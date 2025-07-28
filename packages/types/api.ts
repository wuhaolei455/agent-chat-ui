import { z } from 'zod';

// HTTP 方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 端点配置
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  description?: string;
  auth?: boolean;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
}

// API 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  path?: string;
}

// 标准 API 响应格式
export interface StandardApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: Date;
    version: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// GraphQL 相关类型
export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

// 文件上传
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  createdAt: Date;
}

// API 健康检查
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  version: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    redis?: 'connected' | 'disconnected';
    storage?: 'connected' | 'disconnected';
  };
}

// 验证模式
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  category: z.enum(['avatar', 'document', 'image', 'other']).optional(),
  metadata: z.record(z.any()).optional(),
});

export type FileUploadRequest = z.infer<typeof FileUploadSchema>; 