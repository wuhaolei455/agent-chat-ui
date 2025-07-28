import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getSystemInfo() {
    return {
      success: true,
      message: '全栈AI聊天应用API服务',
      data: {
        name: 'Agent Chat API',
        version: '1.0.0',
        description: '基于NestJS的AI聊天应用后端服务',
        environment: this.configService.get('NODE_ENV'),
        timestamp: new Date().toISOString(),
      },
    };
  }

  getHealthCheck() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      success: true,
      data: {
        status: 'healthy',
        uptime: {
          seconds: Math.floor(uptime),
          humanReadable: this.formatUptime(uptime),
        },
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
        environment: this.configService.get('NODE_ENV'),
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected', // 这里可以添加实际的数据库连接检查
          redis: 'not_configured', // 如果使用Redis可以检查连接状态
        },
      },
    };
  }

  getVersion() {
    return {
      success: true,
      data: {
        version: '1.0.0',
        buildDate: new Date().toISOString(),
        commit: process.env.GIT_COMMIT || 'unknown',
        branch: process.env.GIT_BRANCH || 'main',
        environment: this.configService.get('NODE_ENV'),
      },
    };
  }

  private formatUptime(uptime: number): string {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}天`);
    if (hours > 0) parts.push(`${hours}小时`);
    if (minutes > 0) parts.push(`${minutes}分钟`);
    if (seconds > 0) parts.push(`${seconds}秒`);

    return parts.join(' ') || '0秒';
  }
} 