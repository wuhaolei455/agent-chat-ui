import { z } from 'zod';
import { REGEX, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants';

// 基础验证模式
export const EmailSchema = z
  .string()
  .min(1, '邮箱不能为空')
  .email('请输入有效的邮箱地址')
  .regex(REGEX.EMAIL, '邮箱格式不正确');

export const PasswordSchema = z
  .string()
  .min(8, '密码至少8个字符')
  .regex(REGEX.PASSWORD, '密码必须包含大小写字母和数字');

export const UsernameSchema = z
  .string()
  .min(3, '用户名至少3个字符')
  .max(16, '用户名最多16个字符')
  .regex(REGEX.USERNAME, '用户名只能包含字母、数字、下划线和连字符');

export const PhoneSchema = z
  .string()
  .regex(REGEX.PHONE, '请输入有效的手机号');

export const UrlSchema = z
  .string()
  .url('请输入有效的URL')
  .regex(REGEX.URL, 'URL格式不正确');

// 分页验证
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  orderBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// 搜索验证
export const SearchSchema = z.object({
  query: z.string().min(1, '搜索关键词不能为空').max(100, '搜索关键词过长'),
  filters: z.record(z.any()).optional(),
  sort: z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  }).optional(),
});

// 文件验证
export const FileValidationSchema = z.object({
  name: z.string().min(1, '文件名不能为空'),
  type: z.string().refine(
    (type) => ALLOWED_FILE_TYPES.includes(type),
    '不支持的文件类型'
  ),
  size: z.number().max(MAX_FILE_SIZE, '文件大小超过限制'),
});

// ID 验证
export const IdSchema = z.string().uuid('无效的ID格式');

// 日期验证
export const DateSchema = z.union([
  z.string().datetime('无效的日期格式'),
  z.date(),
]);

export const DateRangeSchema = z.object({
  start: DateSchema,
  end: DateSchema,
}).refine(
  (data) => new Date(data.start) <= new Date(data.end),
  '开始日期不能晚于结束日期'
);

// 通用验证函数
export function validateEmail(email: string): boolean {
  return REGEX.EMAIL.test(email);
}

export function validatePassword(password: string): boolean {
  return REGEX.PASSWORD.test(password);
}

export function validateUsername(username: string): boolean {
  return REGEX.USERNAME.test(username);
}

export function validatePhone(phone: string): boolean {
  return REGEX.PHONE.test(phone);
}

export function validateUrl(url: string): boolean {
  return REGEX.URL.test(url);
}

// 文件验证函数
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: '未选择文件' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '文件大小超过限制' };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: '不支持的文件类型' };
  }

  return { valid: true };
}

// 字符串验证函数
export function validateLength(
  str: string,
  min: number,
  max: number
): { valid: boolean; error?: string } {
  if (str.length < min) {
    return { valid: false, error: `长度不能少于${min}个字符` };
  }

  if (str.length > max) {
    return { valid: false, error: `长度不能超过${max}个字符` };
  }

  return { valid: true };
}

// 数组验证函数
export function validateArrayLength<T>(
  arr: T[],
  min: number,
  max: number
): { valid: boolean; error?: string } {
  if (arr.length < min) {
    return { valid: false, error: `至少需要${min}个项目` };
  }

  if (arr.length > max) {
    return { valid: false, error: `最多只能有${max}个项目` };
  }

  return { valid: true };
}

// 自定义验证器创建函数
export function createValidator<T>(
  schema: z.ZodSchema<T>
): (data: unknown) => { success: boolean; data?: T; errors?: string[] } {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        errors: result.error.errors.map(err => err.message),
      };
    }
  };
} 