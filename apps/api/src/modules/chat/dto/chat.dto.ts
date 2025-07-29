import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// 基础内容块
export class BaseContentBlock {
  @ApiProperty({ description: '内容类型', enum: ['text', 'image', 'video', 'file'] })
  @IsEnum(['text', 'image', 'video', 'file'])
  type: 'text' | 'image' | 'video' | 'file';
}

// 文本内容块
export class TextContentBlock extends BaseContentBlock {
  @ApiProperty({ description: '内容类型', enum: ['text'] })
  type: 'text';

  @ApiProperty({ description: '文本内容' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

// 媒体文件元数据
export class MediaMetadata {
  @ApiProperty({ description: '文件名', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '文件名（用于PDF等文档）', required: false })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiProperty({ description: '文件大小', required: false })
  @IsOptional()
  size?: number;
}

// Base64媒体内容块
export class Base64ContentBlock extends BaseContentBlock {
  @ApiProperty({ description: '内容类型', enum: ['image', 'video', 'file'] })
  @IsEnum(['image', 'video', 'file'])
  type: 'image' | 'video' | 'file';

  @ApiProperty({ description: '源类型', enum: ['base64'] })
  @IsString()
  source_type: 'base64';

  @ApiProperty({ description: 'MIME类型' })
  @IsString()
  mime_type: string;

  @ApiProperty({ description: 'Base64编码的数据' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: '元数据', type: MediaMetadata, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaMetadata)
  metadata?: MediaMetadata;
}

// 消息内容联合类型
export type MessageContent = TextContentBlock | Base64ContentBlock;

export class ChatMessage {
  @ApiProperty({ description: '消息ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '消息角色', enum: ['user', 'assistant', 'system'] })
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({ 
    description: '消息内容数组',
    type: [Object],
    example: [
      { type: 'text', text: '这是一条文本消息' },
      { 
        type: 'image', 
        source_type: 'base64', 
        mime_type: 'image/jpeg', 
        data: 'base64-encoded-image-data',
        metadata: { name: 'image.jpg' }
      }
    ]
  })
  @IsArray()
  @IsNotEmpty()
  content: MessageContent[];

  @ApiProperty({ description: '时间戳' })
  timestamp: Date;
}

export class ChatRequestDto {
  @ApiProperty({ 
    description: '用户消息内容（支持文本和多媒体）',
    type: [Object],
    example: [
      { type: 'text', text: '你好，请分析这张图片' },
      { 
        type: 'image', 
        source_type: 'base64', 
        mime_type: 'image/jpeg', 
        data: 'base64-encoded-image-data',
        metadata: { name: 'image.jpg' }
      }
    ]
  })
  @IsArray()
  @IsNotEmpty()
  message: MessageContent[];
}

export class ChatWithHistoryDto {
  @ApiProperty({ 
    description: '用户消息内容（支持文本和多媒体）',
    type: [Object],
    example: [
      { type: 'text', text: '请继续刚才的话题' }
    ]
  })
  @IsArray()
  @IsNotEmpty()
  message: MessageContent[];

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