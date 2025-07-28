# 基础镜像
FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache libc6-compat

# 依赖安装阶段
FROM base AS deps
WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 开发阶段
FROM base AS development
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动开发服务器
CMD ["pnpm", "dev:web"]

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1

# 构建应用
RUN pnpm build:web

# 生产阶段
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/apps/web/public ./apps/web/public

# 设置正确的权限
RUN mkdir -p .next && chown nextjs:nodejs .next

# 自动利用输出跟踪来减少镜像大小
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 启动应用
CMD ["node", "apps/web/server.js"] 