import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(
    threadId: string,
    userId: string,
    content: string,
  ) {
    // 创建用户消息
    const userMessage = await (this.prisma as any).message.create({
      data: {
        threadId,
        userId,
        type: 'HUMAN',
        role: 'USER',
        content: JSON.stringify([{ type: 'text', text: content }]),
      },
    });

    // 模拟AI响应
    const aiResponses = [
      '这是一个很好的问题！让我为您详细解答。',
      '根据您的描述，我建议采用以下方法...',
      '这个问题涉及到多个方面，我来逐一分析。',
      '基于最新的技术趋势，我推荐您考虑...',
      '您的想法很有创意！我可以为您提供一些相关的资源and建议。',
    ];

    const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];

    // 创建AI响应消息
    const aiMessage = await (this.prisma as any).message.create({
      data: {
        threadId,
        type: 'AI',
        role: 'ASSISTANT',
        content: JSON.stringify([{ type: 'text', text: response }]),
      },
    });

    return {
      userMessage,
      aiMessage,
    };
  }

  async getThreadMessages(threadId: string) {
    return (this.prisma as any).message.findMany({
      where: {
        threadId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async streamResponse(message: string): Promise<AsyncIterable<string>> {
    // 模拟流式响应
    async function* generateResponse() {
      const words = message.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        yield words[i] + ' ';
      }
    }

    return generateResponse();
  }
} 