// 通用工具类型
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// 深度部分类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 排除某些属性
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 只选择某些属性
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 时间戳
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// 软删除
export interface SoftDelete {
  deletedAt?: Date;
  isDeleted: boolean;
}

// 实体基类
export interface BaseEntity extends Timestamps {
  id: string;
}

// 审计信息
export interface AuditInfo extends Timestamps {
  createdBy?: string;
  updatedBy?: string;
}

// 元数据
export interface Metadata {
  [key: string]: any;
}

// 排序配置
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// 筛选配置
export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'not_in';
  value: any;
}

// 查询配置
export interface QueryConfig {
  filters?: FilterConfig[];
  sort?: SortConfig[];
  pagination?: {
    page: number;
    limit: number;
  };
  search?: {
    query: string;
    fields: string[];
  };
}

// 环境类型
export type Environment = 'development' | 'staging' | 'production';

// 日志级别
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

// 主题模式
export type ThemeMode = 'light' | 'dark' | 'system';

// 语言代码
export type LanguageCode = 'zh-CN' | 'zh-TW' | 'en-US' | 'en-GB' | 'ja-JP' | 'ko-KR';

// 货币代码
export type CurrencyCode = 'USD' | 'CNY' | 'EUR' | 'GBP' | 'JPY' | 'KRW';

// 时区
export type TimeZone = 'UTC' | 'Asia/Shanghai' | 'Asia/Tokyo' | 'America/New_York' | 'Europe/London';

// 状态枚举
export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

// 优先级
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// 可见性
export type Visibility = 'public' | 'private' | 'internal';

// 权限动作
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage'; 