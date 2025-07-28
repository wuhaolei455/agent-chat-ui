// 环境配置
export const ENV_CONFIG = {
  // 开发环境
  development: {
    API_URL: 'http://localhost:3001',
    WS_URL: 'ws://localhost:3001',
    DEBUG: true,
    LOG_LEVEL: 'debug' as const,
  },
  
  // 测试环境
  test: {
    API_URL: 'http://localhost:3001',
    WS_URL: 'ws://localhost:3001',
    DEBUG: false,
    LOG_LEVEL: 'error' as const,
  },
  
  // 生产环境
  production: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com',
    DEBUG: false,
    LOG_LEVEL: 'warn' as const,
  },
} as const;

// 获取当前环境配置
export function getEnvConfig() {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
}

// 环境变量验证
export const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
] as const;

export function validateEnvVars() {
  const missing = REQUIRED_ENV_VARS.filter(
    (varName) => !process.env[varName]
  );
  
  if (missing.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missing.join(', ')}`);
  }
} 