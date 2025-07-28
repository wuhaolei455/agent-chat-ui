import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prismaClient: any;

  constructor(private configService: ConfigService) {
    // 延迟导入避免TypeScript类型问题
  }

  async onModuleInit() {
    try {
      const { PrismaClient } = await import('@prisma/client');
      this.prismaClient = new PrismaClient({
        datasources: {
          db: {
            url: this.configService.get<string>('DATABASE_URL'),
          },
        },
        log: this.configService.get('NODE_ENV') === 'development' 
          ? ['query', 'info', 'warn', 'error'] 
          : ['warn', 'error'],
      });

      await this.prismaClient.$connect();
      console.log('📦 数据库连接成功');
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.prismaClient) {
      await this.prismaClient.$disconnect();
      console.log('📦 数据库连接已断开');
    }
  }

  // 代理所有Prisma方法
  get user() {
    return this.prismaClient?.user;
  }

  get thread() {
    return this.prismaClient?.thread;
  }

  get message() {
    return this.prismaClient?.message;
  }

  get session() {
    return this.prismaClient?.session;
  }

  get file() {
    return this.prismaClient?.file;
  }

  get userPreferences() {
    return this.prismaClient?.userPreferences;
  }

  // Prisma特殊方法
  async $connect() {
    return this.prismaClient?.$connect();
  }

  async $disconnect() {
    return this.prismaClient?.$disconnect();
  }

  async $queryRaw(query: any) {
    return this.prismaClient?.$queryRaw(query);
  }

  // 健康检查
  async healthCheck() {
    try {
      if (!this.prismaClient) {
        return { status: 'unhealthy', error: 'Prisma client not initialized', timestamp: new Date() };
      }
      await this.prismaClient.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: (error as any).message, timestamp: new Date() };
    }
  }

  // 清理过期数据
  async cleanupExpiredData() {
    if (!this.prismaClient) {
      throw new Error('Prisma client not initialized');
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    try {
      // 清理过期的会话
      const expiredSessions = await this.prismaClient.session.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      // 清理软删除的旧数据
      const deletedThreads = await this.prismaClient.thread.deleteMany({
        where: {
          deletedAt: {
            not: null,
            lt: thirtyDaysAgo,
          },
        },
      });

      return {
        expiredSessions: expiredSessions.count,
        deletedThreads: deletedThreads.count,
      };
    } catch (error) {
      console.error('清理过期数据失败:', error);
      throw error;
    }
  }
} 