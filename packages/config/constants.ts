// 通用常量配置
export const CONSTANTS = {
  // 应用常量
  APP: {
    NAME: 'Agent Chat',
    VERSION: '1.0.0',
    DESCRIPTION: '全栈AI聊天应用',
    AUTHOR: 'Agent Chat Team',
    WEBSITE: 'https://agentchat.com',
  },
  
  // 时间常量
  TIME: {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
    YEAR: 365 * 24 * 60 * 60 * 1000,
  },
  
  // 文件大小常量
  FILE_SIZE: {
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    
    // 限制
    MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // 状态常量
  STATUS: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    LOADING: 'loading',
    IDLE: 'idle',
  },
  
  // HTTP 状态码
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  },
  
  // 错误代码
  ERROR_CODES: {
    // 通用错误
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    
    // 认证错误
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    
    // 验证错误
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT',
    
    // 资源错误
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    RESOURCE_LIMIT_EXCEEDED: 'RESOURCE_LIMIT_EXCEEDED',
    
    // 服务器错误
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    DATABASE_ERROR: 'DATABASE_ERROR',
    
    // 聊天相关错误
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    MESSAGE_TOO_LONG: 'MESSAGE_TOO_LONG',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  },
  
  // 用户角色
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  },
  
  // 用户状态
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BANNED: 'banned',
    PENDING: 'pending',
  },
  
  // 消息类型
  MESSAGE_TYPES: {
    HUMAN: 'human',
    AI: 'ai',
    SYSTEM: 'system',
    TOOL: 'tool',
  },
  
  // 文件类型
  FILE_TYPES: {
    IMAGE: 'image',
    DOCUMENT: 'document',
    AUDIO: 'audio',
    VIDEO: 'video',
    OTHER: 'other',
  },
  
  // MIME 类型
  MIME_TYPES: {
    // 图片
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    GIF: 'image/gif',
    WEBP: 'image/webp',
    SVG: 'image/svg+xml',
    
    // 文档
    PDF: 'application/pdf',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    TXT: 'text/plain',
    MD: 'text/markdown',
    
    // 代码
    JSON: 'application/json',
    JS: 'application/javascript',
    TS: 'application/typescript',
    HTML: 'text/html',
    CSS: 'text/css',
    
    // 音频
    MP3: 'audio/mpeg',
    WAV: 'audio/wav',
    OGG: 'audio/ogg',
    
    // 视频
    MP4: 'video/mp4',
    WEBM: 'video/webm',
    AVI: 'video/x-msvideo',
  },
  
  // 正则表达式
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    USERNAME: /^[a-zA-Z0-9_-]{3,16}$/,
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    PHONE: /^1[3-9]\d{9}$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  
  // 存储键名
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
    LANGUAGE: 'language',
    CHAT_DRAFTS: 'chat_drafts',
    SIDEBAR_COLLAPSED: 'sidebar_collapsed',
    LAST_ACTIVE_THREAD: 'last_active_thread',
  },
  
  // 事件名称
  EVENTS: {
    // 用户事件
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_REGISTER: 'user:register',
    USER_UPDATE: 'user:update',
    
    // 聊天事件
    THREAD_CREATE: 'thread:create',
    THREAD_UPDATE: 'thread:update',
    THREAD_DELETE: 'thread:delete',
    MESSAGE_SEND: 'message:send',
    MESSAGE_RECEIVE: 'message:receive',
    MESSAGE_UPDATE: 'message:update',
    MESSAGE_DELETE: 'message:delete',
    
    // 系统事件
    SYSTEM_ERROR: 'system:error',
    SYSTEM_WARNING: 'system:warning',
    SYSTEM_INFO: 'system:info',
    
    // UI 事件
    THEME_CHANGE: 'ui:theme_change',
    LANGUAGE_CHANGE: 'ui:language_change',
    SIDEBAR_TOGGLE: 'ui:sidebar_toggle',
  },
  
  // 分页常量
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
  },
  
  // AI 模型常量
  AI_MODELS: {
    GPT_4: 'gpt-4',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
    CLAUDE_3_OPUS: 'claude-3-opus',
    CLAUDE_3_SONNET: 'claude-3-sonnet',
    CLAUDE_3_HAIKU: 'claude-3-haiku',
    GEMINI_PRO: 'gemini-pro',
  },
  
  // 温度范围
  TEMPERATURE: {
    MIN: 0,
    MAX: 2,
    DEFAULT: 0.7,
    STEP: 0.1,
  },
  
  // 令牌限制
  TOKEN_LIMITS: {
    GPT_4: 8192,
    GPT_3_5_TURBO: 4096,
    CLAUDE_3_OPUS: 4096,
    CLAUDE_3_SONNET: 4096,
    CLAUDE_3_HAIKU: 4096,
    GEMINI_PRO: 8192,
  },
} as const; 