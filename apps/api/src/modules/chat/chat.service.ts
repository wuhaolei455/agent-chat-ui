import { Injectable, Logger } from '@nestjs/common';
import { LangChainService, ChatMessage, ChatResponse } from '../langchain/langchain.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly langChainService: LangChainService) {}

  /**
   * 处理单轮对话
   */
  async chat(message: string): Promise<ChatResponse> {
    try {
      this.logger.log(`处理聊天请求: ${message.substring(0, 50)}...`);
      return await this.langChainService.chat(message);
    } catch (error) {
      this.logger.error('聊天服务失败', error);
      throw error;
    }
  }

  /**
   * 处理多轮对话
   */
  async chatWithHistory(
    message: string, 
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      this.logger.log(`处理多轮对话请求: ${message.substring(0, 50)}...`);
      return await this.langChainService.chatWithHistory(message, history);
    } catch (error) {
      this.logger.error('多轮对话服务失败', error);
      throw error;
    }
  }

  /**
   * 处理工具调用聊天
   */
  async chatWithTools(message: string): Promise<ChatResponse> {
    try {
      this.logger.log(`处理工具调用请求: ${message.substring(0, 50)}...`);
      return await this.langChainService.chatWithTools(message);
    } catch (error) {
      this.logger.error('工具调用服务失败', error);
      throw error;
    }
  }

  /**
   * 验证消息格式
   */
  private validateMessage(message: string): void {
    if (!message || message.trim().length === 0) {
      throw new Error('消息内容不能为空');
    }
    if (message.length > 4000) {
      throw new Error('消息内容过长，请限制在4000字符以内');
    }
  }
} 