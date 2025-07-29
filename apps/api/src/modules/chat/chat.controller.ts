import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRequestDto, ChatWithHistoryDto } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: '发送聊天消息' })
  @ApiResponse({ status: 200, description: '聊天回复' })
  async chat(@Body() chatRequestDto: ChatRequestDto) {
    return this.chatService.chat(chatRequestDto.message);
  }

  @Post('with-history')
  @ApiOperation({ summary: '带历史记录的聊天' })
  @ApiResponse({ status: 200, description: '聊天回复' })
  async chatWithHistory(@Body() chatWithHistoryDto: ChatWithHistoryDto) {
    return this.chatService.chatWithHistory(
      chatWithHistoryDto.message,
      chatWithHistoryDto.history
    );
  }

  @Post('tools')
  @ApiOperation({ summary: '带工具调用的聊天' })
  @ApiResponse({ status: 200, description: '聊天回复' })
  async chatWithTools(@Body() chatRequestDto: ChatRequestDto) {
    return this.chatService.chatWithTools(chatRequestDto.message);
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ status: 200, description: '服务状态' })
  getHealth() {
    return { 
      status: 'ok', 
      service: 'chat',
      timestamp: new Date().toISOString()
    };
  }
} 