import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
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
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000,
    });

    this.logger.log('LangChain服务初始化完成');
  }

  /**
   * 单轮对话
   */
  async chat(message: string): Promise<ChatResponse> {
    try {
      this.logger.log(`处理聊天请求: ${message.substring(0, 50)}...`);
      
      const humanMessage = new HumanMessage(message);
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
   * 多轮对话
   */
  async chatWithHistory(
    message: string, 
    history: ChatMessage[]
  ): Promise<ChatResponse> {
    try {
      this.logger.log(`处理多轮对话请求: ${message.substring(0, 50)}...`);
      
      // 构建消息历史
      const messages: BaseMessage[] = [];
      
      // 添加系统消息
      messages.push(
        new HumanMessage(
          '你是一个友善、有用的AI助手。请用中文回答用户问题，提供准确和有帮助的信息。'
        )
      );

      // 添加历史对话
      for (const msg of history.slice(-10)) { // 只保留最近10轮对话
        if (msg.role === 'user') {
          messages.push(new HumanMessage(msg.content));
        } else if (msg.role === 'assistant') {
          messages.push(new AIMessage(msg.content));
        }
      }

      // 添加当前消息
      messages.push(new HumanMessage(message));

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
   * 流式聊天（后续实现）
   */
  async streamChat(message: string): Promise<AsyncIterable<string>> {
    // TODO: 实现流式聊天
    throw new Error('流式聊天功能待实现');
  }

  /**
   * 工具调用示例
   */
  async chatWithTools(message: string): Promise<ChatResponse> {
    try {
      this.logger.log(`处理工具调用请求: ${message.substring(0, 50)}...`);
      
      // TODO: 集成工具调用功能
      // 这里可以添加各种工具，如搜索、计算器等
      
      const response = await this.chat(message);
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