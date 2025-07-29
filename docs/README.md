# Agent Chat UI 项目文档

## 📚 文档目录

### 项目概述和架构
- **[项目重构总结](./PROJECT_REFACTOR_SUMMARY.md)** - 详细记录了项目从初始状态到生产就绪的完整重构过程
- **[Expo SDK升级指南](./EXPO_SDK_UPGRADE.md)** - 从SDK 51升级到SDK 53的完整指南
- **[Expo SDK 53升级完成](./EXPO_SDK_53_UPGRADE_COMPLETED.md)** - 参考nestjs-monorepo模板成功升级到SDK 53的总结
- **[Native多媒体功能升级](./NATIVE_MULTIMODAL_UPGRADE.md)** - native应用文件上传和多媒体对话功能完整实现

### 技术架构

#### 🏗️ Monorepo结构
```
agent-chat-ui/
├── apps/
│   ├── web/          # Next.js Web应用 (React 19)
│   ├── native/       # React Native应用 (Expo SDK 53 + 新架构)
│   └── api/          # NestJS API服务 (LangChain集成)
├── packages/         # 共享包
├── docs/            # 项目文档
└── turbo.json       # Turborepo配置
```

#### 🔄 技术栈总览
- **包管理**: Yarn Workspaces + Turborepo
- **前端**: Next.js 15 + React 19 (Web) / React Native 0.79.5 + Expo SDK 53 (Mobile)
- **后端**: NestJS + TypeScript
- **AI集成**: LangChain + OpenAI GPT-4o-mini（支持视觉理解）
- **多媒体**: 图片/视频/文档上传，Base64编码，文件预览
- **开发工具**: TypeScript + ESLint + Prettier

### 快速开始

#### 🚀 启动所有服务
```bash
# 安装依赖
yarn install

# 启动所有应用
yarn turbo dev

# 或分别启动
yarn turbo dev --filter=web      # Web: http://localhost:3000
yarn turbo dev --filter=native   # Native: http://localhost:8082  
yarn turbo dev --filter=api      # API: http://localhost:4000
```

#### 📋 服务状态
| 服务 | 端口 | 状态 | 功能 |
|------|------|------|------|
| Web应用 | 3000 | ✅ 运行 | Next.js界面 |
| Native应用 | 8082 | ✅ 运行 | RN聊天界面 |
| API服务 | 4000 | ✅ 运行 | LangChain后端 |

### 开发指南

#### 🔧 环境配置
```bash
# 配置OpenAI API Key (必需)
echo "OPENAI_API_KEY=sk-your-api-key" > apps/api/.env

# 启动开发环境
yarn turbo dev
```

#### 🏃‍♂️ 常用命令
```bash
# 构建所有应用
yarn turbo build

# 运行测试
yarn turbo test

# 代码检查
yarn turbo lint

# 清理项目
yarn turbo clean

# 格式化代码
yarn format
```

### API文档

#### 🤖 LangChain Chat API
- **基础URL**: `http://localhost:4000`
- **文档地址**: `http://localhost:4000/api` (Swagger)

#### 主要端点
```bash
# 健康检查
GET /chat/health

# 单轮对话（支持多媒体）
POST /chat
{
  "message": [
    { "type": "text", "text": "请分析这张图片" },
    { "type": "image", "source_type": "base64", "mime_type": "image/jpeg", "data": "..." }
  ]
}

# 多轮对话（支持多媒体）
POST /chat/with-history
{
  "message": [
    { "type": "text", "text": "请继续刚才的话题" },
    { "type": "file", "source_type": "base64", "mime_type": "application/pdf", "data": "..." }
  ],
  "history": [...]
}

# 工具调用聊天
POST /chat/tools
{
  "message": "请帮我计算一下..."
}
```

### 部署和维护

#### 🐳 Docker部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

#### 📈 性能监控
- **构建时间**: Turborepo缓存优化
- **热重载**: 所有应用支持
- **并行构建**: Turbo并行执行

### 故障排除

#### 常见问题
1. **React版本冲突** → 已修复，统一使用React 19
2. **PNG CRC errors** → 已修复，创建了有效的资源文件
3. **OpenAI API错误** → 需要配置有效的API密钥
4. **Expo版本兼容** → 需要升级到SDK 53

#### 🆘 获取帮助
- **Issues**: [GitHub Issues](https://github.com/langchain-ai/agent-chat-ui/issues)
- **文档**: 查看对应的专项文档
- **社区**: LangChain Discord社区

### 贡献指南

#### 📝 提交规范
```bash
# 功能开发
git commit -m "feat: 添加新的聊天功能"

# 问题修复  
git commit -m "fix: 修复React版本冲突"

# 文档更新
git commit -m "docs: 更新API使用说明"
```

#### 🔍 代码审查
- 确保通过所有lint检查
- 添加必要的测试
- 更新相关文档

---

## 📋 项目状态

### ✅ 已完成
- [x] React版本冲突修复
- [x] 移动端PNG错误修复  
- [x] NestJS + LangChain后端实现
- [x] 多端API统一集成
- [x] Monorepo架构优化
- [x] 完整文档编写
- [x] Expo SDK升级到53版本
- [x] Native多媒体功能实现

### 🔄 进行中
- [ ] 用户认证系统
- [ ] 数据库持久化

### 📅 计划中
- [ ] 流式聊天实现
- [ ] 工具调用扩展
- [ ] CI/CD部署自动化
- [ ] 性能监控和优化

**项目现已具备生产级基础能力** 🎉 