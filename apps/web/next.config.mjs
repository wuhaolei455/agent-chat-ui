/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持 Docker 部署的独立输出
  output: 'standalone',
  
  // 支持 monorepo 的 transpile 配置
  transpilePackages: ['@repo/types', '@repo/shared', '@repo/ui'],
  
  // 优化配置
  experimental: {
    optimizePackageImports: ['@repo/types', '@repo/shared', '@repo/ui'],
  },
  
  // 图片配置
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/files/**',
      },
    ],
  },
  
  // API 重写配置 (代理到后端)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
  
  // CORS 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Webpack 配置
  webpack: (config, { isServer }) => {
    // 支持 .mjs 文件
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    return config;
  },
};

export default nextConfig;
