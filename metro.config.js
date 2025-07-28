const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// 获取项目根目录
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 配置解析器 - 修复 monorepo 中的模块解析问题
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
  // 显式指定@babel/runtime的位置
  alias: {
    '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime'),
    '@': path.resolve(projectRoot, 'src'),
    '@components': path.resolve(projectRoot, 'src/components'),
    '@screens': path.resolve(projectRoot, 'src/screens'),
    '@services': path.resolve(projectRoot, 'src/services'),
    '@utils': path.resolve(projectRoot, 'src/utils'),
    '@types': path.resolve(projectRoot, 'src/types'),
  },
  // 支持的文件扩展名
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
  // 平台特定的扩展名
  platforms: ['ios', 'android', 'native', 'web'],
  // 禁用符号链接支持，避免模块解析问题
  disableSymlinks: true,
};

// 配置监视文件夹
config.watchFolders = [
  projectRoot,
  // 监视workspace中的共享包
  path.resolve(workspaceRoot, 'packages'),
  // 明确监视根目录的node_modules
  path.resolve(workspaceRoot, 'node_modules'),
];

// 配置转换器
config.transformer = {
  ...config.transformer,
  // 启用内联require以减少bundle大小
  inlineRequires: true,
  // 配置Metro transformer
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config; 