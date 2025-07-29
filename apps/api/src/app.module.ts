import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ChatModule } from './modules/chat/chat.module';
import { LangChainModule } from './modules/langchain/langchain.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 限流模块
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    // 业务模块
    ChatModule,
    LangChainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 