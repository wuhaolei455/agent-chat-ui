// API配置
const getApiBaseUrl = () => {
  // 在开发环境中使用机器IP，在生产环境中使用实际API域名
  if (__DEV__) {
    // 根据网络环境自动选择IP地址
    // 您的机器IP地址（从ifconfig获取）
    const LOCAL_IP = '192.168.3.40'; // WiFi网络IP
    const VPN_IP = '10.1.224.148';   // VPN网络IP
    
    // 优先使用WiFi网络IP
    return `http://${LOCAL_IP}:3001/api/v1`;
    
    // 如果WiFi不可用，尝试VPN IP
    // return `http://${VPN_IP}:3001/api/v1`;
  }
  
  // 生产环境API地址
  return 'https://your-production-api.com/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// WebSocket配置
export const WS_CONFIG = {
  URL: __DEV__ ? 'ws://192.168.3.40:3001' : 'wss://your-production-api.com',
};

console.log('🌐 Mobile API配置:', API_CONFIG); 