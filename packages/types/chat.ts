import { z } from 'zod';

// 消息类型
export type MessageType = 'human' | 'ai' | 'tool' | 'system';
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

// 消息内容类型
export interface MessageContent {
  type: 'text' | 'image' | 'file' | 'artifact';
  text?: string;
  image_url?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  artifact_id?: string;
}

// 消息接口
export interface Message {
  id: string;
  type: MessageType;
  role?: MessageRole;
  content: MessageContent[] | string;
  timestamp: Date;
  threadId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  parentId?: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

// 工具调用
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  result: any;
  error?: string;
}

// 聊天线程
export interface ChatThread {
  id: string;
  title?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
  messages: Message[];
  status: 'active' | 'archived' | 'deleted';
}

// 聊天配置
export interface ChatConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  tools?: string[];
}

// 流式响应
export interface StreamMessage {
  id: string;
  event: 'message' | 'error' | 'done' | 'tool_call' | 'tool_result';
  data: any;
  threadId?: string;
}

// 创建聊天线程的请求
export const CreateThreadSchema = z.object({
  title: z.string().optional(),
  systemPrompt: z.string().optional(),
  config: z.object({
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().positive().optional(),
  }).optional(),
});

export type CreateThreadRequest = z.infer<typeof CreateThreadSchema>;

// 发送消息的请求
export const SendMessageSchema = z.object({
  content: z.string().min(1),
  threadId: z.string(),
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
    url: z.string(),
  })).optional(),
  metadata: z.record(z.any()).optional(),
});

export type SendMessageRequest = z.infer<typeof SendMessageSchema>;

// WebSocket 事件
export interface WebSocketEvent {
  event: string;
  data: any;
  threadId?: string;
  userId?: string;
}

// 聊天统计
export interface ChatStats {
  totalThreads: number;
  totalMessages: number;
  activeThreads: number;
  tokensUsed: number;
} 