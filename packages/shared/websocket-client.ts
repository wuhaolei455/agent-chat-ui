import type { WebSocketEvent } from '@repo/types';
import { WS_BASE_URL, WS_EVENTS } from './constants';

export interface WebSocketOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (event: WebSocketEvent) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts: number = 0;
  private heartbeatInterval: number;
  private heartbeatTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;
  private isConnected: boolean = false;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private options: WebSocketOptions;

  constructor(options: WebSocketOptions = {}) {
    this.options = options;
    this.url = options.url || WS_BASE_URL;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.heartbeatInterval = options.heartbeatInterval || 30000;
  }

  // 连接WebSocket
  connect(token?: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = token ? `${this.url}?token=${token}` : this.url;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
  }

  // 断开连接
  disconnect(): void {
    this.clearReconnectTimer();
    this.clearHeartbeatTimer();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  // 发送消息
  send(event: string, data?: any): void {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket 未连接，无法发送消息');
      return;
    }

    const message: WebSocketEvent = { event, data };
    this.ws.send(JSON.stringify(message));
  }

  // 监听事件
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  // 移除事件监听
  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      return;
    }

    const eventListeners = this.listeners.get(event)!;
    if (callback) {
      eventListeners.delete(callback);
    } else {
      eventListeners.clear();
    }
  }

  // 触发事件
  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // 处理连接打开
  private handleOpen(): void {
    console.log('WebSocket 连接已建立');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    
    this.options.onConnect?.();
    this.emit(WS_EVENTS.CONNECT);
  }

  // 处理连接关闭
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket 连接已关闭', event.code, event.reason);
    this.isConnected = false;
    this.clearHeartbeatTimer();
    
    this.options.onDisconnect?.();
    this.emit(WS_EVENTS.DISCONNECT, { code: event.code, reason: event.reason });

    // 自动重连
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  // 处理连接错误
  private handleError(event: Event): void {
    console.error('WebSocket 连接错误', event);
    this.options.onError?.(event);
    this.emit(WS_EVENTS.ERROR, event);
  }

  // 处理消息
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketEvent = JSON.parse(event.data);
      
      this.options.onMessage?.(message);
      this.emit(message.event, message.data);
      
      // 处理心跳响应
      if (message.event === 'pong') {
        // 心跳响应，无需处理
        return;
      }
      
    } catch (error) {
      console.error('解析WebSocket消息失败', error);
    }
  }

  // 开始心跳
  private startHeartbeat(): void {
    this.clearHeartbeatTimer();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send('ping');
      }
    }, this.heartbeatInterval);
  }

  // 清除心跳定时器
  private clearHeartbeatTimer(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  // 安排重连
  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    this.reconnectAttempts++;
    
    console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  // 清除重连定时器
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
  }

  // 获取连接状态
  get connected(): boolean {
    return this.isConnected;
  }

  // 获取WebSocket状态
  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

// 创建默认WebSocket客户端实例
export const wsClient = new WebSocketClient();

// 便捷的WebSocket连接函数
export function connectWebSocket(options: WebSocketOptions = {}): WebSocketClient {
  const client = new WebSocketClient(options);
  client.connect();
  return client;
} 