import type { StandardApiResponse } from '@repo/types';
import { API_BASE_URL, HTTP_STATUS, ERROR_CODES } from './constants';
import { objectToQueryString } from './utils';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.timeout = 10000; // 10秒
  }

  // 设置认证 token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 移除认证 token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // 设置默认头部
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  // 构建完整URL
  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${path}`;
    if (params) {
      const queryString = objectToQueryString(params);
      return queryString ? `${url}?${queryString}` : url;
    }
    return url;
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<StandardApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data.error?.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
        data.error?.message || response.statusText,
        response.status,
        data
      );
    }

    return data;
  }

  // 发送请求
  private async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<StandardApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = this.timeout,
      withCredentials = false,
    } = config;

    const url = this.buildUrl(path, method === 'GET' ? params : undefined);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: withCredentials ? 'include' : 'same-origin',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(
          ERROR_CODES.SERVICE_UNAVAILABLE,
          '请求超时',
          HTTP_STATUS.SERVICE_UNAVAILABLE
        );
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '网络错误',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET 请求
  async get<T>(path: string, params?: Record<string, any>): Promise<StandardApiResponse<T>> {
    return this.request<T>(path, { method: 'GET', params });
  }

  // POST 请求
  async post<T>(path: string, body?: any): Promise<StandardApiResponse<T>> {
    return this.request<T>(path, { method: 'POST', body });
  }

  // PUT 请求
  async put<T>(path: string, body?: any): Promise<StandardApiResponse<T>> {
    return this.request<T>(path, { method: 'PUT', body });
  }

  // PATCH 请求
  async patch<T>(path: string, body?: any): Promise<StandardApiResponse<T>> {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  // DELETE 请求
  async delete<T>(path: string): Promise<StandardApiResponse<T>> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  // 上传文件
  async upload<T>(
    path: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<StandardApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type']; // 让浏览器自动设置

    return this.request<T>(path, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// API 错误类
export class ApiError extends Error {
  public code: string;
  public status: number;
  public data?: any;

  constructor(code: string, message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient();

// 便捷的API调用函数
export async function apiCall<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  try {
    const response = await apiClient.get<T>(path, config.params);
    return response.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      '未知错误',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
} 