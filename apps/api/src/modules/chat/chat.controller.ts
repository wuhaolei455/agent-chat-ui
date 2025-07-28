import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '发送消息' })
  @ApiResponse({ status: 201, description: '消息发送成功' })
  @Post('threads/:threadId/messages')
  async sendMessage(
    @Param('threadId') threadId: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.chatService.sendMessage(
      threadId,
      req.user.userId,
      body.content,
    );
  }

  @ApiOperation({ summary: '获取线程消息' })
  @ApiResponse({ status: 200, description: '返回消息列表' })
  @Get('threads/:threadId/messages')
  getThreadMessages(@Param('threadId') threadId: string) {
    return this.chatService.getThreadMessages(threadId);
  }

  @ApiOperation({ summary: '流式聊天响应' })
  @Sse('stream')
  streamChat(@Body() body: { message: string }): Observable<MessageEvent> {
    return new Observable(observer => {
      const responses = [
        'Hello! How can I help you today?',
        'I understand your question.',
        'Let me think about that...',
        'Here is my response to your query.',
        'Is there anything else you would like to know?',
      ];

      let index = 0;
      const interval = setInterval(() => {
        if (index < responses.length) {
          observer.next({
            data: JSON.stringify({
              content: responses[index],
              timestamp: new Date().toISOString(),
            }),
          } as MessageEvent);
          index++;
        } else {
          observer.complete();
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    });
  }
} 