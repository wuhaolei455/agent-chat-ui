module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/hooks': './src/hooks',
            '@/utils': './src/utils',
            '@/types': './src/types',
            '@/services': './src/services',
            '@/store': './src/store',
            '@/assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
}; 