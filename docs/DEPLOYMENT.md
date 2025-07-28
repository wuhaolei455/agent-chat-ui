# 部署指南

本文档介绍如何将 Agent Chat 全栈应用部署到不同的环境中。

## 🚀 快速部署

### 使用 Docker Compose (推荐)

1. **克隆项目**
```bash
git clone <your-repo-url>
cd agent-chat-fullstack-monorepo
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量
```

3. **启动服务**
```bash
docker-compose up -d
```

4. **初始化数据库**
```bash
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed
```

### 手动部署

#### 前置要求

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (可选)
- pnpm 8+

#### 步骤

1. **安装依赖**
```bash
pnpm install
```

2. **构建项目**
```bash
pnpm build
```

3. **配置数据库**
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

4. **启动服务**
```bash
pnpm start
```

## 🌐 云平台部署

### Vercel + Supabase + Railway

这是推荐的云部署方案，成本低且易于维护。

#### 1. 数据库 (Supabase)

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取数据库连接字符串
4. 在 Supabase SQL 编辑器中执行迁移

```sql
-- 在 Supabase 中执行 schema
-- 复制 apps/api/prisma/schema.prisma 中的表结构
```

#### 2. 后端 API (Railway)

1. 访问 [Railway](https://railway.app)
2. 连接 GitHub 仓库
3. 配置环境变量：

```env
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
NODE_ENV=production
PORT=3001
```

4. 设置构建命令：
```bash
pnpm install && pnpm build:api
```

5. 设置启动命令：
```bash
pnpm start:api
```

#### 3. 前端 Web (Vercel)

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置项目设置：
   - Framework Preset: Next.js
   - Root Directory: apps/web
   - Build Command: `cd ../.. && pnpm build:web`
   - Output Directory: apps/web/.next

4. 配置环境变量：
```env
NEXT_PUBLIC_API_URL=your-railway-api-url
NEXT_PUBLIC_WS_URL=your-railway-websocket-url
```

### AWS 部署

#### 1. 使用 AWS ECS + RDS

1. **创建 RDS PostgreSQL 实例**
2. **构建 Docker 镜像**
```bash
docker build -t agent-chat-api -f apps/api/Dockerfile .
docker build -t agent-chat-web -f apps/web/Dockerfile .
```

3. **推送到 ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag agent-chat-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/agent-chat-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/agent-chat-api:latest
```

4. **创建 ECS 服务**

#### 2. 使用 AWS Lambda + API Gateway

适合低流量应用，成本更低。

### Google Cloud Platform 部署

#### 使用 Cloud Run + Cloud SQL

1. **创建 Cloud SQL PostgreSQL 实例**
2. **构建并部署到 Cloud Run**
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/agent-chat-api apps/api
gcloud run deploy --image gcr.io/PROJECT-ID/agent-chat-api --platform managed
```

## 🐳 Docker 配置

### API Dockerfile

```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### Web Dockerfile

```dockerfile
# apps/web/Dockerfile
FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: agentchat
      POSTGRES_PASSWORD: password
      POSTGRES_DB: agentchat
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      DATABASE_URL: postgresql://agentchat:password@db:5432/agentchat
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-jwt-secret
      OPENAI_API_KEY: your-openai-key
    ports:
      - "3001:3001"
    depends_on:
      - db
      - redis

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NEXT_PUBLIC_WS_URL: ws://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
```

## 🔧 生产环境配置

### 环境变量

```bash
# 生产环境必需配置
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-strong-jwt-secret
OPENAI_API_KEY=your-openai-api-key

# 安全配置
CORS_ORIGINS=https://yourdomain.com
COOKIE_SECURE=true
HTTPS_REDIRECT=true

# 性能配置
REDIS_URL=your-redis-url
DATABASE_POOL_SIZE=10

# 监控配置
SENTRY_DSN=your-sentry-dsn
ENABLE_METRICS=true
```

### 反向代理 (Nginx)

```nginx
# /etc/nginx/sites-available/agentchat
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Web 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API 后端
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 监控和日志

### 健康检查

```bash
# API 健康检查
curl http://localhost:3001/health

# Web 应用检查
curl http://localhost:3000/api/health
```

### 日志配置

```bash
# PM2 日志管理
pm2 logs agent-chat-api
pm2 logs agent-chat-web

# Docker 日志
docker-compose logs -f api
docker-compose logs -f web
```

### 监控指标

- 响应时间
- 错误率
- 数据库连接数
- 内存使用率
- CPU 使用率

## 🔄 CI/CD 配置

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: corepack enable
      - run: pnpm install
      - run: pnpm test
      - run: pnpm lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🔐 安全配置

### SSL/TLS

- 使用 Let's Encrypt 免费证书
- 配置 HTTPS 重定向
- 启用 HSTS

### 防火墙

```bash
# UFW 配置
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 环境隔离

- 开发环境使用测试数据
- 生产环境启用所有安全措施
- 使用不同的 API 密钥

## 📝 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查连接字符串
   - 验证网络访问权限
   - 确认数据库服务运行状态

2. **构建失败**
   - 清理缓存：`pnpm clean`
   - 重新安装依赖：`pnpm install`
   - 检查 Node.js 版本

3. **内存不足**
   - 增加服务器内存
   - 优化数据库查询
   - 启用 Redis 缓存

4. **API 响应慢**
   - 检查数据库索引
   - 优化 N+1 查询
   - 启用 CDN

### 日志分析

```bash
# 查看错误日志
grep "ERROR" /var/log/agentchat/api.log

# 分析访问模式
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr
``` 