// 应用配置
export const APP_CONFIG = {
  // 基本信息
  name: 'Agent Chat',
  version: '1.0.0',
  description: '全栈AI聊天应用',
  
  // URL 配置
  urls: {
    web: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
    api: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    ws: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  },
  
  // UI 配置
  ui: {
    // 主题
    themes: ['light', 'dark', 'system'] as const,
    defaultTheme: 'system' as const,
    
    // 语言
    languages: ['zh-CN', 'en-US'] as const,
    defaultLanguage: 'zh-CN' as const,
    
    // 布局
    sidebar: {
      width: 280,
      collapsedWidth: 60,
      breakpoint: 768,
    },
    
    // 动画
    animation: {
      duration: {
        fast: 150,
        normal: 250,
        slow: 400,
      },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // 聊天配置
  chat: {
    // 消息限制
    maxMessageLength: 10000,
    maxMessagesPerThread: 1000,
    
    // AI 模型配置
    models: [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        maxTokens: 8192,
        contextLength: 32768,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        maxTokens: 4096,
        contextLength: 16384,
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        maxTokens: 4096,
        contextLength: 200000,
      },
    ],
    
    // 默认配置
    defaults: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: '你是一个有用的AI助手，请用中文回答问题。',
    },
    
    // 流式响应配置
    streaming: {
      enabled: true,
      chunkSize: 1024,
      timeout: 30000,
    },
  },
  
  // 文件上传配置
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/json',
      'text/markdown',
    ],
    uploadPath: process.env.FILE_UPLOAD_PATH || './uploads',
  },
  
  // 通知配置
  notifications: {
    // 推送通知
    push: {
      enabled: true,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY || '',
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
    },
    
    // 邮件通知
    email: {
      enabled: false,
      from: process.env.EMAIL_FROM || 'noreply@agentchat.com',
      templates: {
        welcome: 'welcome',
        passwordReset: 'password-reset',
        notification: 'notification',
      },
    },
  },
  
  // 功能开关
  features: {
    registration: true,
    guestMode: false,
    fileUpload: true,
    voiceMessage: false,
    darkMode: true,
    analytics: process.env.NODE_ENV === 'production',
    monitoring: process.env.NODE_ENV === 'production',
  },
} as const;

// 开发工具配置
export const DEV_CONFIG = {
  // 开发服务器
  devServer: {
    port: {
      web: 3000,
      api: 3001,
      mobile: 19006,
    },
    hot: true,
    open: true,
  },
  
  // 调试配置
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    showQueries: true,
    showErrors: true,
    logLevel: 'debug' as const,
  },
  
  // Mock 配置
  mock: {
    enabled: process.env.ENABLE_MOCK === 'true',
    delay: 500,
  },
} as const; 