import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessage {
  @ApiProperty({ description: '消息ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '消息角色', enum: ['user', 'assistant', 'system'] })
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({ description: '消息内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '时间戳' })
  timestamp: Date;
}

export class ChatRequestDto {
  @ApiProperty({ 
    description: '用户消息内容',
    example: '你好，请介绍一下LangChain是什么？'
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ChatWithHistoryDto {
  @ApiProperty({ 
    description: '用户消息内容',
    example: '请继续刚才的话题'
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ 
    description: '历史对话记录',
    type: [ChatMessage],
    required: false
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChatMessage)
  history?: ChatMessage[];
}

export class ChatResponseDto {
  @ApiProperty({ description: '回复ID' })
  id: string;

  @ApiProperty({ description: '回复内容' })
  content: string;

  @ApiProperty({ description: '时间戳' })
  timestamp: Date;
} 