# 基础镜像
FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache libc6-compat curl

# 依赖安装阶段
FROM base AS deps
WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 开发阶段
FROM base AS development
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN pnpm --filter api db:generate

# 暴露端口
EXPOSE 3001

# 启动开发服务器
CMD ["pnpm", "dev:api"]

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN pnpm --filter api db:generate

# 构建应用
RUN pnpm build:api

# 生产阶段
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# 复制构建产物
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json

# 创建上传目录
RUN mkdir -p uploads && chown nestjs:nodejs uploads

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 启动应用
CMD ["node", "dist/main.js"] 