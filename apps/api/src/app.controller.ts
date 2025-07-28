import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('系统')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '系统根路径' })
  @ApiResponse({ status: 200, description: '返回系统信息' })
  getRoot() {
    return this.appService.getSystemInfo();
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ status: 200, description: '返回系统健康状态' })
  getHealth() {
    return this.appService.getHealthCheck();
  }

  @Get('version')
  @ApiOperation({ summary: '版本信息' })
  @ApiResponse({ status: 200, description: '返回版本信息' })
  getVersion() {
    return this.appService.getVersion();
  }
} 