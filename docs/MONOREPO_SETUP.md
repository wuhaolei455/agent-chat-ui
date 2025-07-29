# Agent Chat UI - Yarn + Turbo Monorepo

这个项目已经成功从 pnpm 迁移到 yarn + turbo 的 monorepo 架构，参考了标准的全栈项目 template 配置。

## 🏗️ 项目结构

```
agent-chat-ui/
├── apps/
│   ├── web/          # Next.js Web 应用
│   ├── native/       # React Native 移动应用  
│   ├── mobile/       # 原有的 mobile 项目（待清理）
│   └── api/          # 后端 API 服务
├── packages/         # 共享包
│   ├── config/       # 配置包
│   ├── shared/       # 共享工具
│   ├── types/        # 类型定义
│   └── ui/           # UI 组件库
├── turbo.json        # Turbo 配置
├── package.json      # 根 package.json（包含 workspaces 配置）
└── yarn.lock         # Yarn lockfile
```

## 🚀 快速开始

### 安装依赖
```bash
yarn install
```

### 开发模式
```bash
# 启动所有应用
yarn dev

# 启动特定应用
yarn turbo dev --filter=web
yarn turbo dev --filter=native

# 启动多个应用
yarn turbo dev --filter=web --filter=native
```

### 构建
```bash
# 构建所有应用
yarn build

# 构建特定应用
yarn turbo build --filter=web
yarn turbo build --filter=native
```

### 代码检查
```bash
# 运行所有 lint
yarn lint

# 运行特定应用的 lint
yarn turbo lint --filter=web
```

## 📱 应用详情

### Web 应用 (`apps/web`)
- **技术栈**: Next.js 15, React 19, TypeScript
- **端口**: 3000
- **启动命令**: `yarn turbo dev --filter=web`

### Native 应用 (`apps/native`)
- **技术栈**: React Native, Expo, TypeScript  
- **启动命令**: `yarn turbo dev --filter=native`
- **Web 端口**: 8081
- **支持平台**: iOS, Android, Web

## 🔧 Turbo 配置

### 任务管道
```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**", ".expo/**"]
  },
  "dev": {
    "cache": false,
    "persistent": true
  },
  "lint": {
    "dependsOn": ["^lint"],
    "outputs": []
  },
  "test": {
    "dependsOn": ["^build"],
    "outputs": ["coverage/**"]
  }
}
```

### 缓存优化
- 本地缓存：自动启用
- 远程缓存：可通过 Vercel 配置

## 📦 Yarn Workspaces

### 工作区配置
```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### 常用命令
```bash
# 查看工作区信息
yarn workspaces info

# 为特定工作区添加依赖
yarn workspace web add lodash
yarn workspace native add react-native-vector-icons

# 为根工作区添加依赖
yarn add -W -D typescript

# 运行特定工作区的脚本
yarn workspace web build
yarn workspace native start
```

## 🛠️ 开发工具

### VS Code 推荐设置
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.workspaceSymbols.scope": "allOpenProjects"
}
```

### Git Hooks
项目已配置 Husky 用于代码质量检查：
- `pre-commit`: 运行 lint 和格式化
- `commit-msg`: 检查提交消息格式

## 🎯 最佳实践

### 依赖管理
1. 共享依赖放在根 `package.json`
2. 应用特有依赖放在各自的 `package.json`
3. 使用精确版本避免版本冲突

### 代码组织
1. 共享组件和工具放在 `packages/` 下
2. 应用特有代码放在对应的 `apps/` 下
3. 类型定义统一放在 `packages/types`

### 构建优化
1. 利用 Turbo 的增量构建和缓存
2. 合理设置 `dependsOn` 确保构建顺序
3. 使用 `--filter` 只构建需要的应用

## 🔍 故障排除

### 常见问题

#### 1. Node modules 冲突
```bash
# 清理所有 node_modules
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
yarn install
```

#### 2. Turbo 缓存问题
```bash
# 清理 Turbo 缓存
yarn turbo clean
```

#### 3. TypeScript 路径解析问题
确保每个应用的 `tsconfig.json` 正确配置了路径映射。

## 📈 性能监控

### 构建分析
```bash
# 分析构建性能
yarn turbo build --profile

# 查看构建统计
yarn turbo build --dry-run
```

## 🔄 迁移说明

### 从 pnpm 到 yarn 的变更
1. ❌ 删除 `pnpm-lock.yaml`, `pnpm-workspace.yaml`
2. ✅ 创建 `yarn.lock`，添加 `workspaces` 配置
3. ✅ 更新 `packageManager` 字段
4. ✅ 调整 Turbo 配置以支持 React Native

### 配置对比
| 特性 | pnpm | yarn |
|------|------|------|
| 工作区配置 | `pnpm-workspace.yaml` | `package.json#workspaces` |
| 锁文件 | `pnpm-lock.yaml` | `yarn.lock` |
| 安装命令 | `pnpm install` | `yarn install` |
| 运行脚本 | `pnpm --filter` | `yarn workspace` |

## 🚀 下一步计划

1. **清理旧项目**: 删除 `apps/mobile` 目录
2. **后端集成**: 完善 `apps/api` 的配置
3. **共享包**: 将重复代码提取到 `packages/` 下
4. **CI/CD**: 配置 GitHub Actions 支持 monorepo
5. **文档**: 完善各应用的独立文档

---

## 📞 支持

如有问题，请创建 issue 或联系开发团队。

**Happy Coding! 🎉** 