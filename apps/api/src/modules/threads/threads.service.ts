import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ThreadsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { title?: string; systemPrompt?: string }) {
    return (this.prisma as any).thread.create({
      data: {
        userId,
        title: data.title || '新的对话',
        systemPrompt: data.systemPrompt,
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
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return (this.prisma as any).thread.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
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
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            type: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    return (this.prisma as any).thread.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
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
        messages: {
          where: {
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
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    return (this.prisma as any).thread.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    return (this.prisma as any).thread.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });
  }

  async getStats(userId: string) {
    const [totalThreads, activeThreads, totalMessages] = await Promise.all([
      (this.prisma as any).thread.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
      (this.prisma as any).thread.count({
        where: {
          userId,
          status: 'ACTIVE',
          deletedAt: null,
        },
      }),
      (this.prisma as any).message.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      totalThreads,
      activeThreads,
      totalMessages,
    };
  }
} 