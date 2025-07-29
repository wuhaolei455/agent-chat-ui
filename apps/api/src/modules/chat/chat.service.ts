import { Injectable, Logger } from '@nestjs/common';
import { LangChainService, ChatMessage, ChatResponse } from '../langchain/langchain.service';
import { MessageContent, TextContentBlock, Base64ContentBlock } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly langChainService: LangChainService) {}

  /**
   * 处理单轮对话（多媒体支持）
   */
  async chat(messageContent: MessageContent[]): Promise<ChatResponse> {
    try {
      this.validateMessageContent(messageContent);
      const description = this.getContentDescription(messageContent);
      this.logger.log(`处理聊天请求: ${description}`);
      return await this.langChainService.chat(messageContent);
    } catch (error) {
      this.logger.error('聊天服务失败', error);
      throw error;
    }
  }

  /**
   * 处理多轮对话（多媒体支持）
   */
  async chatWithHistory(
    messageContent: MessageContent[], 
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      this.validateMessageContent(messageContent);
      const description = this.getContentDescription(messageContent);
      this.logger.log(`处理多轮对话请求: ${description}`);
      return await this.langChainService.chatWithHistory(messageContent, history);
    } catch (error) {
      this.logger.error('多轮对话服务失败', error);
      throw error;
    }
  }

  /**
   * 处理工具调用聊天（多媒体支持）
   */
  async chatWithTools(messageContent: MessageContent[]): Promise<ChatResponse> {
    try {
      this.validateMessageContent(messageContent);
      const description = this.getContentDescription(messageContent);
      this.logger.log(`处理工具调用请求: ${description}`);
      return await this.langChainService.chatWithTools(messageContent);
    } catch (error) {
      this.logger.error('工具调用服务失败', error);
      throw error;
    }
  }

  /**
   * 兼容旧版本的字符串消息处理
   */
  async chatLegacy(message: string): Promise<ChatResponse> {
    const messageContent: MessageContent[] = [
      { type: 'text', text: message }
    ];
    return this.chat(messageContent);
  }

  /**
   * 兼容旧版本的多轮对话
   */
  async chatWithHistoryLegacy(
    message: string, 
    history: any[] = []
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
   * 验证消息内容格式
   */
  private validateMessageContent(messageContent: MessageContent[]): void {
    if (!messageContent || messageContent.length === 0) {
      throw new Error('消息内容不能为空');
    }

    let totalTextLength = 0;
    let imageCount = 0;
    let videoCount = 0;
    let fileCount = 0;

    for (const item of messageContent) {
      if (item.type === 'text') {
        const textItem = item as TextContentBlock;
        if (!textItem.text || textItem.text.trim().length === 0) {
          throw new Error('文本内容不能为空');
        }
        totalTextLength += textItem.text.length;
      } else if (item.type === 'image') {
        const imageItem = item as Base64ContentBlock;
        if (!imageItem.data || !imageItem.mime_type) {
          throw new Error('图片数据不完整');
        }
        if (!imageItem.mime_type.startsWith('image/')) {
          throw new Error('无效的图片格式');
        }
        imageCount++;
      } else if (item.type === 'video') {
        const videoItem = item as Base64ContentBlock;
        if (!videoItem.data || !videoItem.mime_type) {
          throw new Error('视频数据不完整');
        }
        if (!videoItem.mime_type.startsWith('video/')) {
          throw new Error('无效的视频格式');
        }
        videoCount++;
      } else if (item.type === 'file') {
        const fileItem = item as Base64ContentBlock;
        if (!fileItem.data || !fileItem.mime_type) {
          throw new Error('文件数据不完整');
        }
        fileCount++;
      }
    }

    // 验证限制
    if (totalTextLength > 4000) {
      throw new Error('文本内容过长，请限制在4000字符以内');
    }
    if (imageCount > 10) {
      throw new Error('图片数量过多，请限制在10张以内');
    }
    if (videoCount > 3) {
      throw new Error('视频数量过多，请限制在3个以内');
    }
    if (fileCount > 5) {
      throw new Error('文件数量过多，请限制在5个以内');
    }
  }

  /**
   * 获取内容描述（用于日志）
   */
  private getContentDescription(messageContent: MessageContent[]): string {
    const textParts = messageContent
      .filter((item): item is TextContentBlock => item.type === 'text')
      .map(item => item.text)
      .join(' ');

    const counts = {
      images: messageContent.filter(item => item.type === 'image').length,
      videos: messageContent.filter(item => item.type === 'video').length,
      files: messageContent.filter(item => item.type === 'file').length,
    };

    let description = textParts.substring(0, 50) || '无文本';
    const mediaDesc = [];
    if (counts.images > 0) mediaDesc.push(`${counts.images}张图片`);
    if (counts.videos > 0) mediaDesc.push(`${counts.videos}个视频`);
    if (counts.files > 0) mediaDesc.push(`${counts.files}个文件`);

    if (mediaDesc.length > 0) {
      description += ` [${mediaDesc.join(', ')}]`;
    }

    return description + (textParts.length > 50 ? '...' : '');
  }
} 