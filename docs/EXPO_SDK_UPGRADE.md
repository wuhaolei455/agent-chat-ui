# Expo SDK 升级指南 - 从 SDK 51 到 SDK 53

## 🎯 升级概述

当前项目使用 **Expo SDK 51**，需要升级到 **SDK 53** 以解决与 Expo Go 的版本兼容性问题。

### 版本兼容性问题
```
错误信息: Project is incompatible with this version of Expo Go
- 项目使用: SDK 51
- Expo Go版本: SDK 53
```

## 📋 升级路径

> **重要**: Expo官方建议逐个版本升级，避免一次性跨越多个版本。

**升级路径**: SDK 51 → SDK 52 → SDK 53

## 🔄 第一阶段: 升级到 SDK 52

### 1. 升级Expo核心包
```bash
# 升级到SDK 52
npx expo install expo@^52.0.0 --fix
```

### 2. 主要变更 (SDK 51 → 52)

#### ✅ 新架构默认启用
- **New Architecture** 在新项目中默认启用
- 现有项目可选择启用 `newArchEnabled: true`
- Expo Go只支持新架构

#### ✅ 系统要求更新
- **iOS**: 最低版本从 13.4 升级到 15.1
- **Android**: minSdkVersion 从 23 升级到 24
- **Xcode**: 需要 Xcode 16.1

#### ✅ 核心库更新
- **expo-video**: 从beta升级为稳定版
- **expo-audio**: 新的beta版本
- **expo-camera**: 大量改进和修复
- **expo-sqlite**: 支持SQLCipher

#### ⚠️ 重大变更
- `expo-camera/legacy` 已移除
- `expo-sqlite/legacy` 已移除  
- `expo-barcode-scanner` 已移除
- JSC不再支持，必须使用Hermes

## 🔄 第二阶段: 升级到 SDK 53

### 1. 升级Expo核心包
```bash
# 升级到SDK 53
npx expo install expo@^53.0.0 --fix
```

### 2. 主要变更 (SDK 52 → 53)

#### ✅ React 19 和 React Native 0.79
- **React**: 升级到 React 19
- **React Native**: 升级到 0.79
- **新特性**: Suspense、use hook等

#### ✅ New Architecture强制启用
- 所有项目默认启用新架构
- 可通过 `newArchEnabled: false` 临时退出

#### ✅ Edge-to-Edge默认启用
- Android新项目默认启用edge-to-edge
- Google要求Android 16必须支持

#### ✅ 新功能和改进
- **expo-audio**: 从beta升级为稳定版
- **expo-maps**: 新的alpha版本
- **expo-background-task**: 替代 expo-background-fetch
- **package.json exports**: Metro默认启用

#### ⚠️ 重大变更
- `expo-av` 不再维护
- `expo-background-fetch` 被弃用
- `jsEngine` 字段被弃用
- Node 18 EOL，推荐Node 20+

## 🛠 升级步骤

### 步骤 1: 准备工作
```bash
# 更新EAS CLI (如果使用)
npm i -g eas-cli

# 清理旧依赖
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
```

### 步骤 2: 升级到SDK 52
```bash
# 升级核心包
npx expo install expo@^52.0.0 --fix

# 检查潜在问题
npx expo-doctor@latest

# 重新安装依赖
yarn install
```

### 步骤 3: 更新配置

#### 更新 app.json
```json
{
  "expo": {
    "newArchEnabled": true,
    "ios": {
      "deploymentTarget": "15.1"
    },
    "android": {
      "minSdkVersion": 24,
      "compileSdkVersion": 35
    }
  }
}
```

#### 更新 babel.config.js
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### 步骤 4: 升级到SDK 53
```bash
# 升级到最新版本
npx expo install expo@^53.0.0 --fix

# 再次检查
npx expo-doctor@latest

# 重新安装依赖
yarn install
```

### 步骤 5: 更新原生项目
```bash
# 如果使用CNG (推荐)
rm -rf android ios
npx expo prebuild --clear

# 如果不使用CNG
npx pod-install
# 参考Native project upgrade helper进行手动更新
```

## 📦 依赖迁移指南

### 必须替换的库
```bash
# expo-av → expo-video + expo-audio
npm uninstall expo-av
npm install expo-video expo-audio

# expo-camera/legacy → expo-camera
# 更新导入语句
- import { Camera } from 'expo-camera/legacy';
+ import { CameraView } from 'expo-camera';

# expo-sqlite/legacy → expo-sqlite  
# 更新导入语句
- import * as SQLite from 'expo-sqlite/legacy';
+ import * as SQLite from 'expo-sqlite';

# expo-barcode-scanner → expo-camera (条码扫描)
npm uninstall expo-barcode-scanner
# 使用expo-camera的条码扫描功能
```

### 可选升级的库
```bash
# 新的后台任务API
npm install expo-background-task
# 替代 expo-background-fetch

# 新的文件系统API
npm install expo-file-system@next
# 提供同步操作能力
```

## 🧪 测试和验证

### 1. 依赖兼容性检查
```bash
# 检查New Architecture兼容性
npx expo-doctor@latest

# 检查过时的依赖
npm outdated
```

### 2. 应用测试
```bash
# 预构建测试
npx expo prebuild --clear

# 本地运行测试
npx expo run:ios
npx expo run:android

# Web测试
npx expo start --web
```

### 3. 构建测试
```bash
# EAS构建测试
eas build --platform ios --profile development
eas build --platform android --profile development
```

## ⚠️ 已知问题和解决方案

### React 19兼容性
```json
// package.json - 添加overrides解决版本冲突
{
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Metro ES Module兼容性
```javascript
// metro.config.js - 可选择禁用exports字段
module.exports = {
  resolver: {
    unstable_enablePackageExports: false
  }
};
```

### Edge-to-Edge适配
```bash
# 安装edge-to-edge支持
npm install react-native-edge-to-edge
```

## 📋 升级检查清单

### 升级到SDK 52
- [ ] 升级Expo核心包到52.0.0
- [ ] 更新iOS最低版本到15.1
- [ ] 更新Android SDK版本
- [ ] 启用New Architecture
- [ ] 迁移expo-camera/legacy
- [ ] 迁移expo-sqlite/legacy  
- [ ] 移除expo-barcode-scanner
- [ ] 测试应用功能

### 升级到SDK 53
- [ ] 升级Expo核心包到53.0.0
- [ ] 适配React 19变更
- [ ] 处理package.json exports
- [ ] 启用edge-to-edge (Android)
- [ ] 迁移expo-av到expo-video/audio
- [ ] 升级Node.js到20+
- [ ] 全面测试应用

## 🚀 升级后优化

### 1. 性能优化
- 启用新架构的性能提升
- 使用新的expo-video/audio组件
- 利用edge-to-edge提升视觉体验

### 2. 新功能体验
- React 19的Suspense和use hook
- DOM Components (实验性)
- 改进的开发工具

### 3. 开发体验提升
- 更快的Metro解析
- 改进的错误信息
- 更好的TypeScript支持

## 📞 支持和帮助

- **官方文档**: [Expo SDK升级指南](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- **问题报告**: [expo/expo GitHub Issues](https://github.com/expo/expo/issues)
- **社区支持**: [Expo Discord](https://discord.gg/expo)
- **办公时间**: 每周三太平洋时间12:00PM 