# 环境配置说明

本项目使用环境变量来配置各种服务和功能。请根据以下说明配置你的环境变量。

## 创建环境文件

请在以下位置创建相应的环境文件：

- 根目录: `.env` (全局配置)
- Web 应用: `apps/web/.env.local` (Next.js 配置)
- API 服务: `apps/api/.env` (NestJS 配置)

## 必需环境变量

### 应用基础配置

```env
# 应用环境
NODE_ENV=development
PORT=3001

# 数据库配置 (必需)
DATABASE_URL="postgresql://user:password@localhost:5432/agentchat"

# JWT 认证 (必需)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

### AI 服务配置

```env
# AI 服务配置 (至少配置一个)
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

## 可选环境变量

### Redis 配置

```env
# Redis 配置 (用于缓存和会话存储)
REDIS_URL="redis://localhost:6379"
```

### 文件上传配置

```env
# 文件上传
FILE_UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=10485760  # 10MB
```

### 邮件服务配置

```env
# 邮件服务 (用于通知和密码重置)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@agentchat.com"
```

### 推送通知配置

```env
# 推送通知 (PWA 功能)
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

### OAuth 配置

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_REDIRECT_URI="http://localhost:3000/auth/github/callback"
```

### 前端配置

```env
# 前端URL (Next.js 公共环境变量)
NEXT_PUBLIC_WEB_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
```

### 错误监控配置

```env
# Sentry 错误监控
SENTRY_DSN="your-sentry-dsn"
```

### 开发工具配置

```env
# 开发工具
ENABLE_MOCK=false
DEBUG_QUERIES=true

# CORS 设置
CORS_ORIGINS="http://localhost:3000,https://localhost:3000"
```

## 快速配置

### 1. 复制示例配置

```bash
# 复制根目录配置
cp .env.example .env

# 复制 Web 应用配置
cp apps/web/.env.example apps/web/.env.local

# 复制 API 服务配置
cp apps/api/.env.example apps/api/.env
```

### 2. 修改必需配置

编辑各个 `.env` 文件，至少配置以下项：

- `DATABASE_URL`: PostgreSQL 数据库连接字符串
- `JWT_SECRET`: JWT 签名密钥 (生产环境必须更改)
- `OPENAI_API_KEY`: OpenAI API 密钥 (用于 AI 功能)

### 3. 验证配置

```bash
# 验证环境变量
pnpm dev

# 检查数据库连接
pnpm db:generate
pnpm db:migrate
```

## 配置建议

### 开发环境

- 使用本地 PostgreSQL 数据库
- 使用 OpenAI API (需要付费账户)
- 启用调试模式 (`DEBUG_QUERIES=true`)

### 生产环境

- 使用托管数据库服务 (如 Supabase, AWS RDS)
- 配置 Redis 缓存
- 启用错误监控 (Sentry)
- 使用强随机 JWT 密钥
- 配置 HTTPS 和安全头部

## 安全注意事项

1. **永远不要**将 `.env` 文件提交到版本控制
2. 在生产环境中使用强密码和密钥
3. 定期轮换 API 密钥和密码
4. 限制数据库和服务的访问权限
5. 使用环境变量而不是硬编码敏感信息

## 故障排除

### 数据库连接失败

- 检查 `DATABASE_URL` 格式是否正确
- 确认数据库服务是否运行
- 验证用户名密码是否正确

### AI 服务无响应

- 检查 API 密钥是否有效
- 确认账户余额和配额
- 验证网络连接

### 文件上传失败

- 检查 `FILE_UPLOAD_PATH` 目录权限
- 确认 `MAX_FILE_SIZE` 设置合理
- 验证磁盘空间是否充足 