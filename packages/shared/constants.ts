// API 相关常量
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

// 分页常量
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// 文件上传常量
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/json',
];

// 聊天相关常量
export const MAX_MESSAGE_LENGTH = 10000;
export const MAX_THREAD_TITLE_LENGTH = 100;
export const TYPING_INDICATOR_TIMEOUT = 3000;

// UI 常量
export const SIDEBAR_WIDTH = 280;
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1200;

// 主题常量
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 语言常量
export const LANGUAGES = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
} as const;

// AI 模型常量
export const AI_MODELS = {
  GPT_4: 'gpt-4',
  GPT_3_5: 'gpt-3.5-turbo',
  CLAUDE_3: 'claude-3-opus',
  GEMINI: 'gemini-pro',
} as const;

// 温度范围
export const TEMPERATURE_RANGE = {
  MIN: 0,
  MAX: 2,
  DEFAULT: 0.7,
} as const;

// 错误代码
export const ERROR_CODES = {
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
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  
  // 聊天相关错误
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  MESSAGE_TOO_LONG: 'MESSAGE_TOO_LONG',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
} as const;

// HTTP 状态码
export const HTTP_STATUS = {
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
  SERVICE_UNAVAILABLE: 503,
} as const;

// WebSocket 事件
export const WS_EVENTS = {
  // 连接事件
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // 聊天事件
  JOIN_THREAD: 'join_thread',
  LEAVE_THREAD: 'leave_thread',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_UPDATE: 'message_update',
  
  // 状态事件
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  
  // 系统事件
  SYSTEM_NOTIFICATION: 'system_notification',
  THREAD_UPDATE: 'thread_update',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  CHAT_DRAFTS: 'chat_drafts',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,16}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  PHONE: /^1[3-9]\d{9}$/,
} as const;

// 动画持续时间
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const;

// Z-index 层级
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
  NOTIFICATION: 80,
  MAX: 9999,
} as const; 