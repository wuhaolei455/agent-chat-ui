import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatModule } from './modules/chat/chat.module';
import { ThreadsModule } from './modules/threads/threads.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnvironment } from './config/env.validation';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // 数据库模块
    DatabaseModule,
    
    // 功能模块
    AuthModule,
    UsersModule,
    ChatModule,
    ThreadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 