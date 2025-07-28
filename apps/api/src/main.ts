import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // 使用Fastify适配器
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 启用CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:19006',
      'http://localhost:8081',
      'http://192.168.3.40:3000',
      'http://192.168.3.40:8081',
      'http://192.168.3.40:19006',
      'http://10.1.224.148:3000',
      'http://10.1.224.148:8081',
      'http://10.1.224.148:19006'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 设置API前缀
  app.setGlobalPrefix('api/v1');

  // 开发环境下启用Swagger文档
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Agent Chat API')
      .setDescription('智能对话系统API文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    
    console.log('📚 Swagger文档: http://0.0.0.0:3001/api/docs');
  }

  const port = process.env.PORT || 3001;
  const host = '0.0.0.0'; // 监听所有网络接口
  
  await app.listen(port, host);
  
  console.log(`🚀 API服务器启动成功`);
  console.log(`📡 本地访问: http://localhost:${port}`);
  console.log(`🌐 网络访问: http://192.168.3.40:${port}`);
  console.log(`🔗 健康检查: http://192.168.3.40:${port}/health`);
}

bootstrap(); 