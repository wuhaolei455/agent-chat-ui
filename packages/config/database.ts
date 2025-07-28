// 数据库配置
export const DATABASE_CONFIG = {
  // Prisma 配置
  prisma: {
    // 数据库连接URL
    url: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/agentchat',
    
    // 连接池配置
    pool: {
      min: 2,
      max: 10,
      idle: 10000,
      acquire: 30000,
    },
    
    // 日志配置
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error'] 
      : ['warn', 'error'],
  },
  
  // Redis 配置 (可选)
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  },
} as const;

// 数据库表名配置
export const TABLE_NAMES = {
  USERS: 'users',
  THREADS: 'threads',
  MESSAGES: 'messages',
  FILES: 'files',
  SESSIONS: 'sessions',
} as const;

// 数据库约束配置
export const DB_CONSTRAINTS = {
  // 用户相关
  USER_EMAIL_MAX_LENGTH: 255,
  USER_NAME_MAX_LENGTH: 100,
  USER_PASSWORD_MIN_LENGTH: 6,
  
  // 聊天相关
  THREAD_TITLE_MAX_LENGTH: 200,
  MESSAGE_CONTENT_MAX_LENGTH: 50000,
  
  // 文件相关
  FILE_NAME_MAX_LENGTH: 255,
  FILE_SIZE_MAX: 10 * 1024 * 1024, // 10MB
  
  // 分页相关
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const; 