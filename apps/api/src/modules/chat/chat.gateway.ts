import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-thread')
  handleJoinThread(
    @MessageBody() data: { threadId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(`thread-${data.threadId}`);
    this.logger.log(`Client ${client.id} joined thread ${data.threadId}`);
  }

  @SubscribeMessage('leave-thread')
  handleLeaveThread(
    @MessageBody() data: { threadId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(`thread-${data.threadId}`);
    this.logger.log(`Client ${client.id} left thread ${data.threadId}`);
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() data: { threadId: string; content: string; userId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    // 广播消息到线程中的所有用户
    client.to(`thread-${data.threadId}`).emit('new-message', {
      id: Date.now().toString(),
      threadId: data.threadId,
      content: data.content,
      userId: data.userId,
      timestamp: new Date(),
      type: 'user',
    });

    // 模拟AI响应
    setTimeout(() => {
      const aiResponses = [
        '这是一个很好的问题！',
        '让我为您详细解答。',
        '根据您的描述，我建议...',
        '这个问题很有趣，我来分析一下。',
      ];

      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      client.to(`thread-${data.threadId}`).emit('new-message', {
        id: (Date.now() + 1).toString(),
        threadId: data.threadId,
        content: response,
        timestamp: new Date(),
        type: 'assistant',
      });
    }, 1500);
  }

  @SubscribeMessage('typing-start')
  handleTypingStart(
    @MessageBody() data: { threadId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.to(`thread-${data.threadId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing-stop')
  handleTypingStop(
    @MessageBody() data: { threadId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.to(`thread-${data.threadId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: false,
    });
  }
} 