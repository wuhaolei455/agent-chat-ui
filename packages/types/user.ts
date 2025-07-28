import { z } from 'zod';

// 用户角色
export type UserRole = 'user' | 'admin' | 'moderator';

// 用户状态
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending';

// 用户接口
export interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  metadata?: Record<string, any>;
  preferences?: UserPreferences;
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  chat: {
    model: string;
    temperature: number;
    systemPrompt?: string;
  };
}

// 用户认证
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username?: string;
  displayName?: string;
}

// Zod 验证模式
export const LoginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
});

export const RegisterSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
  confirmPassword: z.string(),
  username: z.string().min(3, '用户名至少3个字符').optional(),
  displayName: z.string().min(1, '显示名称不能为空').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '密码确认不匹配',
  path: ['confirmPassword'],
});

export const UpdateProfileSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符').optional(),
  displayName: z.string().min(1, '显示名称不能为空').optional(),
  avatar: z.string().url('请输入有效的头像URL').optional(),
});

export const UpdatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sound: z.boolean(),
  }).optional(),
  chat: z.object({
    model: z.string(),
    temperature: z.number().min(0).max(2),
    systemPrompt: z.string().optional(),
  }).optional(),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;
export type UpdatePreferencesRequest = z.infer<typeof UpdatePreferencesSchema>; 