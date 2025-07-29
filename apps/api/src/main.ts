import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用CORS
  app.use(cors({
    origin: [
      'http://localhost:3000',   // web应用
      'http://localhost:8081',   // native应用
      'http://localhost:8082',   // native应用备用端口
    ],
    credentials: true,
  }));

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger文档
  const config = new DocumentBuilder()
    .setTitle('Agent Chat API')
    .setDescription('LangChain集成的聊天API服务')
    .setVersion('1.0')
    .addTag('chat')
    .addTag('langchain')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 API服务运行在: http://localhost:${port}`);
  console.log(`📚 API文档地址: http://localhost:${port}/api`);
}

bootstrap(); 