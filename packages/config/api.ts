// API 配置
export const API_CONFIG = {
  // 基础配置
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  version: 'v1',
  timeout: 30000,
  
  // 端点配置
  endpoints: {
    // 认证相关
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    
    // 用户相关
    users: {
      list: '/users',
      detail: '/users/:id',
      update: '/users/:id',
      delete: '/users/:id',
      preferences: '/users/:id/preferences',
    },
    
    // 聊天相关
    chat: {
      threads: '/chat/threads',
      thread: '/chat/threads/:id',
      messages: '/chat/threads/:threadId/messages',
      message: '/chat/threads/:threadId/messages/:id',
      stream: '/chat/stream',
    },
    
    // 文件相关
    files: {
      upload: '/files/upload',
      download: '/files/:id',
      delete: '/files/:id',
      list: '/files',
    },
    
    // 系统相关
    system: {
      health: '/health',
      version: '/version',
      stats: '/stats',
    },
  },
  
  // HTTP 头部配置
  headers: {
    default: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    
    upload: {
      'Content-Type': 'multipart/form-data',
    },
    
    stream: {
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  },
  
  // 限流配置
  rateLimit: {
    // 通用API限流
    general: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 1000次请求
    },
    
    // 聊天API限流
    chat: {
      windowMs: 60 * 1000, // 1分钟
      max: 60, // 60次请求
    },
    
    // 文件上传限流
    upload: {
      windowMs: 60 * 1000, // 1分钟
      max: 10, // 10次上传
    },
    
    // 认证API限流
    auth: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 50, // 50次请求
    },
  },
  
  // 重试配置
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 2,
    retryCondition: (error: any) => {
      return error.response?.status >= 500 || error.code === 'NETWORK_ERROR';
    },
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5分钟
    maxSize: 100, // 最多缓存100个响应
    
    // 可缓存的端点
    cacheable: [
      '/users/:id',
      '/chat/threads',
      '/files',
      '/system/health',
    ],
  },
} as const;

// GraphQL 配置
export const GRAPHQL_CONFIG = {
  endpoint: '/graphql',
  subscriptionsEndpoint: '/graphql',
  
  // 查询配置
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all' as const,
      fetchPolicy: 'cache-and-network' as const,
    },
    query: {
      errorPolicy: 'all' as const,
      fetchPolicy: 'cache-first' as const,
    },
  },
  
  // 缓存配置
  cache: {
    typePolicies: {
      User: {
        fields: {
          threads: {
            merge: false,
          },
        },
      },
      Thread: {
        fields: {
          messages: {
            merge: false,
          },
        },
      },
    },
  },
} as const;

// WebSocket 配置
export const WEBSOCKET_CONFIG = {
  url: process.env.WS_URL || 'ws://localhost:3001',
  
  // 连接配置
  connection: {
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
    timeout: 10000,
  },
  
  // 事件配置
  events: {
    // 连接事件
    connect: 'connect',
    disconnect: 'disconnect',
    error: 'error',
    
    // 聊天事件
    joinThread: 'join_thread',
    leaveThread: 'leave_thread',
    sendMessage: 'send_message',
    receiveMessage: 'receive_message',
    messageUpdate: 'message_update',
    
    // 状态事件
    typingStart: 'typing_start',
    typingStop: 'typing_stop',
    userOnline: 'user_online',
    userOffline: 'user_offline',
    
    // 系统事件
    systemNotification: 'system_notification',
    threadUpdate: 'thread_update',
  },
  
  // 房间配置
  rooms: {
    user: (userId: string) => `user:${userId}`,
    thread: (threadId: string) => `thread:${threadId}`,
    global: 'global',
  },
} as const; 