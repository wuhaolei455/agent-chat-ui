// 认证配置
export const AUTH_CONFIG = {
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: '30d',
    algorithm: 'HS256' as const,
  },
  
  // 密码配置
  password: {
    minLength: 6,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    saltRounds: 12,
  },
  
  // 会话配置
  session: {
    cookieName: 'agent-chat-session',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
  
  // OAuth 配置 (预留)
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      redirectUri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback',
    },
  },
  
  // 限流配置
  rateLimit: {
    // 登录限流
    login: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 5, // 最多5次尝试
    },
    
    // 注册限流
    register: {
      windowMs: 60 * 60 * 1000, // 1小时
      max: 3, // 最多3次注册
    },
    
    // 密码重置限流
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1小时
      max: 3, // 最多3次重置
    },
  },
} as const;

// 基础用户权限
const USER_PERMISSIONS = [
  'chat:create',
  'chat:read',
  'chat:update',
  'chat:delete',
  'thread:create',
  'thread:read',
  'thread:update',
  'thread:delete',
  'message:create',
  'message:read',
  'file:upload',
  'file:read',
  'profile:read',
  'profile:update',
] as const;

// 角色权限配置
export const ROLE_PERMISSIONS = {
  user: USER_PERMISSIONS,
  
  admin: [
    // 用户权限
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'user:list',
    
    // 系统权限
    'system:health',
    'system:stats',
    'system:logs',
    
    // 所有用户权限
    ...USER_PERMISSIONS,
  ],
  
  moderator: [
    // 内容管理权限
    'content:moderate',
    'thread:moderate',
    'message:moderate',
    'user:moderate',
    
    // 基础用户权限
    ...USER_PERMISSIONS,
  ],
} as const; 