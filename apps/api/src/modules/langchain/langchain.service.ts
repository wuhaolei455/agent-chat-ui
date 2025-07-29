import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MessageContent, TextContentBlock, Base64ContentBlock } from '../chat/dto/chat.dto';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: MessageContent[];
  timestamp: Date;
}

export interface ChatResponse {
  id: string;
  content: string;
  timestamp: Date;
}

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);
  private readonly llm: ChatOpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY未配置');
      throw new Error('OPENAI_API_KEY未配置');
    }

    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4o-mini', // 支持视觉功能
      temperature: 0.7,
      maxTokens: 1000,
    });

    this.logger.log('LangChain服务初始化完成');
  }

  /**
   * 将MessageContent数组转换为LangChain消息格式
   */
  private convertToLangChainMessage(content: MessageContent[]): any {
    const textParts: string[] = [];
    const imageParts: any[] = [];

    for (const item of content) {
      if (item.type === 'text') {
        const textItem = item as TextContentBlock;
        textParts.push(textItem.text);
      } else if (item.type === 'image') {
        const imageItem = item as Base64ContentBlock;
        imageParts.push({
          type: 'image_url',
          image_url: {
            url: `data:${imageItem.mime_type};base64,${imageItem.data}`,
          },
        });
      }
      // 注意: 目前OpenAI GPT-4o-mini主要支持图片，视频和文档需要其他处理方式
    }

    const messageText = textParts.join('\n');

    // 如果有图片，使用多模态格式
    if (imageParts.length > 0) {
      return [
        {
          type: 'text',
          text: messageText || '请分析这些图片',
        },
        ...imageParts,
      ];
    }

    // 纯文本消息
    return messageText;
  }

  /**
   * 获取消息的描述性文本（用于日志）
   */
  private getMessageDescription(content: MessageContent[]): string {
    const textParts = content
      .filter((item): item is TextContentBlock => item.type === 'text')
      .map(item => item.text)
      .join(' ');

    const mediaCounts = {
      images: content.filter(item => item.type === 'image').length,
      videos: content.filter(item => item.type === 'video').length,
      files: content.filter(item => item.type === 'file').length,
    };

    let description = textParts || '无文本';
    const mediaDesc = [];
    if (mediaCounts.images > 0) mediaDesc.push(`${mediaCounts.images}张图片`);
    if (mediaCounts.videos > 0) mediaDesc.push(`${mediaCounts.videos}个视频`);
    if (mediaCounts.files > 0) mediaDesc.push(`${mediaCounts.files}个文件`);

    if (mediaDesc.length > 0) {
      description += ` [包含: ${mediaDesc.join(', ')}]`;
    }

    return description.substring(0, 100) + (description.length > 100 ? '...' : '');
  }

  /**
   * 单轮对话（支持多媒体）
   */
  async chat(messageContent: MessageContent[]): Promise<ChatResponse> {
    try {
      const description = this.getMessageDescription(messageContent);
      this.logger.log(`处理聊天请求: ${description}`);
      
      const langchainContent = this.convertToLangChainMessage(messageContent);
      const humanMessage = new HumanMessage({ content: langchainContent });
      const response = await this.llm.invoke([humanMessage]);
      
      const result: ChatResponse = {
        id: this.generateId(),
        content: response.content as string,
        timestamp: new Date(),
      };

      this.logger.log(`聊天回复: ${result.content.substring(0, 50)}...`);
      return result;
    } catch (error) {
      this.logger.error('聊天处理失败', error);
      throw new Error('聊天处理失败');
    }
  }

  /**
   * 多轮对话（支持多媒体）
   */
  async chatWithHistory(
    messageContent: MessageContent[], 
    history: ChatMessage[]
  ): Promise<ChatResponse> {
    try {
      const description = this.getMessageDescription(messageContent);
      this.logger.log(`处理多轮对话请求: ${description}`);
      
      // 构建消息历史
      const messages: BaseMessage[] = [];
      
      // 添加系统消息
      messages.push(
        new HumanMessage(
          '你是一个友善、有用的AI助手。你可以处理文本、图片等多种类型的内容。请用中文回答用户问题，提供准确和有帮助的信息。'
        )
      );

      // 添加历史对话（只保留最近8轮对话以避免context过长）
      for (const msg of history.slice(-8)) {
        if (msg.role === 'user') {
          const langchainContent = this.convertToLangChainMessage(msg.content);
          messages.push(new HumanMessage({ content: langchainContent }));
        } else if (msg.role === 'assistant') {
          // 助手消息只包含文本
          const textContent = msg.content
            .filter((item): item is TextContentBlock => item.type === 'text')
            .map(item => item.text)
            .join('\n');
          if (textContent) {
            messages.push(new AIMessage(textContent));
          }
        }
      }

      // 添加当前消息
      const currentLangchainContent = this.convertToLangChainMessage(messageContent);
      messages.push(new HumanMessage({ content: currentLangchainContent }));

      const response = await this.llm.invoke(messages);
      
      const result: ChatResponse = {
        id: this.generateId(),
        content: response.content as string,
        timestamp: new Date(),
      };

      this.logger.log(`多轮对话回复: ${result.content.substring(0, 50)}...`);
      return result;
    } catch (error) {
      this.logger.error('多轮对话处理失败', error);
      throw new Error('多轮对话处理失败');
    }
  }

  /**
   * 兼容旧版本的字符串参数方法
   */
  async chatLegacy(message: string): Promise<ChatResponse> {
    const messageContent: MessageContent[] = [
      { type: 'text', text: message }
    ];
    return this.chat(messageContent);
  }

  /**
   * 兼容旧版本的字符串参数方法
   */
  async chatWithHistoryLegacy(
    message: string, 
    history: any[]
  ): Promise<ChatResponse> {
    const messageContent: MessageContent[] = [
      { type: 'text', text: message }
    ];

    // 转换历史记录格式
    const convertedHistory: ChatMessage[] = history.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: typeof msg.content === 'string' 
        ? [{ type: 'text', text: msg.content }]
        : msg.content,
      timestamp: msg.timestamp,
    }));

    return this.chatWithHistory(messageContent, convertedHistory);
  }

  /**
   * 流式聊天（后续实现）
   */
  async streamChat(messageContent: MessageContent[]): Promise<AsyncIterable<string>> {
    // TODO: 实现流式聊天
    throw new Error('流式聊天功能待实现');
  }

  /**
   * 工具调用示例
   */
  async chatWithTools(messageContent: MessageContent[]): Promise<ChatResponse> {
    try {
      const description = this.getMessageDescription(messageContent);
      this.logger.log(`处理工具调用请求: ${description}`);
      
      // TODO: 集成工具调用功能
      // 这里可以添加各种工具，如搜索、计算器等
      
      const response = await this.chat(messageContent);
      return response;
    } catch (error) {
      this.logger.error('工具调用处理失败', error);
      throw new Error('工具调用处理失败');
    }
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 