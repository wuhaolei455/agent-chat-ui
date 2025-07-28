import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// 定义自定义颜色
const customColors = {
  primary: '#2563eb',
  onPrimary: '#ffffff',
  primaryContainer: '#dbeafe',
  onPrimaryContainer: '#1e40af',
  secondary: '#64748b',
  onSecondary: '#ffffff',
  secondaryContainer: '#f1f5f9',
  onSecondaryContainer: '#475569',
  background: '#ffffff',
  onBackground: '#1e293b',
  surface: '#f8fafc',
  onSurface: '#1e293b',
  surfaceVariant: '#f1f5f9',
  onSurfaceVariant: '#64748b',
  error: '#ef4444',
  onError: '#ffffff',
  errorContainer: '#fecaca',
  onErrorContainer: '#dc2626',
};

// 亮色主题
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
};

// 暗色主题
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3b82f6',
    onPrimary: '#ffffff',
    primaryContainer: '#1e40af',
    onPrimaryContainer: '#dbeafe',
    secondary: '#94a3b8',
    onSecondary: '#ffffff',
    secondaryContainer: '#475569',
    onSecondaryContainer: '#f1f5f9',
    background: '#0f172a',
    onBackground: '#f8fafc',
    surface: '#1e293b',
    onSurface: '#f8fafc',
    surfaceVariant: '#334155',
    onSurfaceVariant: '#94a3b8',
    error: '#f87171',
    onError: '#ffffff',
    errorContainer: '#dc2626',
    onErrorContainer: '#fecaca',
  },
};

// 默认使用亮色主题
export const theme = lightTheme; 