# 🤖 Agent Chat 全栈应用 Monorepo

一个现代化的全栈AI聊天应用，采用 Next.js + NestJS + React Native 的 Monorepo 架构，支持 Web 端、移动端和后端 API 的统一开发和部署。

## ✨ 项目特色

### 🏗️ 架构特点
- **Monorepo 架构**: 使用 pnpm workspace 管理多个应用和共享包
- **类型安全**: 端到端 TypeScript 支持，共享类型定义
- **现代化技术栈**: Next.js 15 + React 19 + NestJS 10
- **跨平台支持**: Web 端 + React Native 移动端
- **微服务友好**: 模块化设计，易于扩展和维护

### 🚀 核心功能
- **智能聊天**: 支持多种 AI 模型（GPT-4、Claude、Gemini 等）
- **实时通信**: WebSocket 实时消息推送和状态同步
- **多线程管理**: 支持多个聊天会话，历史记录持久化
- **文件上传**: 多模态文件上传和预览功能
- **用户系统**: 完整的认证授权和用户偏好管理
- **响应式设计**: 适配各种屏幕尺寸和设备

### 🎨 用户体验
- **流式响应**: 实时显示 AI 回复过程
- **工具调用**: 支持 AI 工具调用和结果展示
- **主题切换**: 支持亮色/暗色主题
- **国际化**: 多语言支持（中文/英文等）
- **离线支持**: PWA 支持，可离线使用基础功能

---

## 📁 项目结构

```
agent-chat-fullstack-monorepo/
├── apps/                          # 应用目录
│   ├── web/                       # Next.js Web 应用
│   │   ├── src/
│   │   │   ├── app/              # App Router 页面
│   │   │   ├── components/       # React 组件
│   │   │   ├── hooks/           # 自定义 Hooks
│   │   │   ├── lib/             # 工具函数
│   │   │   └── providers/       # Context Providers
│   │   ├── public/              # 静态资源
│   │   └── package.json
│   │
│   ├── api/                      # NestJS API 应用
│   │   ├── src/
│   │   │   ├── modules/         # 功能模块
│   │   │   ├── config/          # 配置文件
│   │   │   ├── guards/          # 守卫
│   │   │   ├── decorators/      # 装饰器
│   │   │   └── utils/           # 工具函数
│   │   ├── prisma/              # 数据库 Schema
│   │   └── package.json
│   │
│   └── mobile/                   # React Native 移动应用
│       ├── src/
│       │   ├── screens/         # 页面组件
│       │   ├── components/      # UI 组件
│       │   ├── navigation/      # 导航配置
│       │   ├── services/        # API 服务
│       │   └── utils/           # 工具函数
│       └── package.json
│
├── packages/                     # 共享包目录
│   ├── types/                   # 共享类型定义
│   │   ├── api.ts              # API 类型
│   │   ├── chat.ts             # 聊天类型
│   │   ├── user.ts             # 用户类型
│   │   └── common.ts           # 通用类型
│   │
│   ├── shared/                  # 共享工具库
│   │   ├── utils.ts            # 工具函数
│   │   ├── constants.ts        # 常量定义
│   │   ├── validators.ts       # 验证器
│   │   ├── api-client.ts       # API 客户端
│   │   └── websocket-client.ts # WebSocket 客户端
│   │
│   ├── ui/                     # 共享 UI 组件库
│   │   ├── components/         # 组件库
│   │   ├── styles/            # 样式文件
│   │   └── theme/             # 主题配置
│   │
│   └── config/                 # 共享配置
│       ├── eslint/            # ESLint 配置
│       ├── typescript/        # TypeScript 配置
│       └── tailwind/          # Tailwind 配置
│
├── docs/                       # 项目文档
│   ├── API.md                 # API 文档
│   ├── DEPLOYMENT.md          # 部署指南
│   ├── DEVELOPMENT.md         # 开发指南
│   └── LEARNING_PATH.md       # 学习路线
│
├── package.json               # 根 package.json
├── pnpm-workspace.yaml       # pnpm 工作区配置
├── docker-compose.yml        # Docker 配置
└── README.md                 # 项目说明
```

---

## 🛠️ 技术栈

### 前端技术
- **Next.js 15**: 全栈 React 框架，支持 SSR/SSG
- **React 19**: 最新的 React 版本，支持并发特性
- **TypeScript**: 类型安全的 JavaScript 超集
- **Tailwind CSS**: 原子化 CSS 框架
- **Framer Motion**: 动画库
- **Radix UI**: 无样式组件库
- **React Query**: 数据获取和状态管理
- **Zustand**: 轻量级状态管理

### 后端技术
- **NestJS 10**: 企业级 Node.js 框架
- **Fastify**: 高性能 HTTP 服务器
- **GraphQL**: API 查询语言和运行时
- **Prisma**: 现代数据库 ORM
- **PostgreSQL**: 关系型数据库
- **Redis**: 内存数据存储（缓存、会话）
- **Socket.io**: 实时通信库
- **JWT**: JSON Web Token 认证
- **Passport**: 认证中间件

### 移动端技术
- **React Native**: 跨平台移动应用框架
- **Expo**: React Native 开发平台
- **React Navigation**: 导航库
- **React Native Paper**: Material Design 组件库
- **React Native Reanimated**: 高性能动画库
- **React Native Gesture Handler**: 手势处理

### 开发工具
- **pnpm**: 高效的包管理器
- **Turborepo**: Monorepo 构建系统
- **ESLint**: 代码检查工具
- **Prettier**: 代码格式化工具
- **Husky**: Git Hooks 管理
- **Commitizen**: 规范化提交信息
- **Docker**: 容器化部署
- **GitHub Actions**: CI/CD 流水线

---

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **PostgreSQL**: >= 13.0
- **Redis**: >= 6.0 (可选)

### 安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd agent-chat-fullstack-monorepo

# 安装依赖
pnpm install
```

### 环境配置
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
vim .env
```

### 数据库设置
```bash
# 生成 Prisma 客户端
pnpm db:generate

# 运行数据库迁移
pnpm db:migrate

# 填充初始数据
pnpm db:seed
```

### 🐳 Docker 快速启动 (推荐)
```bash
# 启动所有服务 (数据库、Redis、API、Web)
docker-compose up -d

# 初始化数据库
docker-compose exec api pnpm db:migrate

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 或者手动启动开发服务器
```bash
# 确保 PostgreSQL 和 Redis 运行中

# 同时启动所有服务
pnpm dev

# 或者分别启动
pnpm dev:web    # Web 应用 (http://localhost:3000)
pnpm dev:api    # API 服务 (http://localhost:3001)
pnpm dev:mobile # 移动应用
```

### 🌐 访问应用
- **Web 应用**: http://localhost:3000
- **API 服务**: http://localhost:3001
- **API 文档**: http://localhost:3001/api-docs
- **数据库**: localhost:5432 (PostgreSQL)
- **缓存**: localhost:6379 (Redis)

---

## 📱 应用预览

### Web 端功能
- 💬 实时聊天界面
- 🧵 多线程管理
- 📁 文件上传和预览
- 🎨 主题切换
- 🌐 多语言支持
- 📊 聊天统计
- ⚙️ 用户设置

### 移动端功能
- 📱 原生移动体验
- 🔔 推送通知
- 📷 相机集成
- 🎤 语音输入
- 🔄 离线同步
- 👆 手势导航

### API 功能
- 🔐 JWT 认证
- 👥 用户管理
- 💬 聊天 API
- 📤 文件上传
- 🔌 WebSocket 实时通信
- 📊 GraphQL 查询
- 📝 Swagger 文档

---

## 🎯 核心功能详解

### 1. 智能聊天系统
- **多模型支持**: GPT-4、Claude-3、Gemini Pro
- **流式响应**: 实时显示 AI 生成过程
- **上下文管理**: 智能上下文窗口管理
- **工具调用**: 支持函数调用和工具集成
- **聊天历史**: 本地和云端历史记录同步

### 2. 实时通信系统
- **WebSocket 连接**: 低延迟实时通信
- **消息队列**: 消息可靠投递和重试
- **状态同步**: 多端状态实时同步
- **连接管理**: 自动重连和心跳检测
- **事件系统**: 灵活的事件驱动架构

### 3. 用户管理系统
- **注册登录**: 邮箱注册、社交登录
- **权限控制**: RBAC 角色权限管理
- **个人资料**: 头像上传、偏好设置
- **安全认证**: 双因子认证、设备管理
- **数据隐私**: GDPR 合规数据处理

### 4. 文件管理系统
- **多格式支持**: 图片、文档、音频、视频
- **智能压缩**: 自动压缩和格式转换
- **CDN 集成**: 全球内容分发网络
- **安全扫描**: 文件安全性检查
- **版本控制**: 文件版本历史管理

---

## 🔧 开发指南

### 代码规范
- **TypeScript**: 严格类型检查
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git 提交钩子
- **Conventional Commits**: 规范化提交信息

### 测试策略
- **单元测试**: Jest + Testing Library
- **集成测试**: Supertest + Test Containers
- **E2E 测试**: Playwright + Cypress
- **性能测试**: Lighthouse + WebPageTest
- **API 测试**: Postman + Newman

### 部署方案
- **Docker**: 容器化部署
- **Kubernetes**: 容器编排
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack

---

## 📚 学习资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [NestJS 文档](https://docs.nestjs.com)
- [React Native 文档](https://reactnative.dev/docs)
- [Prisma 文档](https://www.prisma.io/docs)

### 推荐教程
- [TypeScript 深入理解](https://www.typescriptlang.org/docs)
- [GraphQL 完整指南](https://graphql.org/learn)
- [Monorepo 最佳实践](https://monorepo.tools)
- [AI 应用开发指南](docs/LEARNING_PATH.md)

---

## 🤝 贡献指南

欢迎贡献代码！请阅读 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 贡献流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和社区成员！

特别感谢以下开源项目：
- [Next.js](https://nextjs.org)
- [NestJS](https://nestjs.com)
- [React Native](https://reactnative.dev)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📞 联系我们

- **问题反馈**: [GitHub Issues](https://github.com/your-username/agent-chat-fullstack-monorepo/issues)
- **功能建议**: [GitHub Discussions](https://github.com/your-username/agent-chat-fullstack-monorepo/discussions)
- **邮箱**: your-email@example.com
- **社交媒体**: [@your-twitter](https://twitter.com/your-twitter)

---

<div align="center">
  <h3>⭐ 如果这个项目对你有帮助，请给我们一个星标！</h3>
  <p>让更多人发现和使用这个优秀的全栈AI聊天解决方案</p>
</div>
