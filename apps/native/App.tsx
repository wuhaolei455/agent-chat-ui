import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// API配置
const API_BASE_URL = 'http://localhost:4000';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 发送消息到LangChain API
  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('提示', '请输入消息内容');
      return;
    }

    setIsLoading(true);
    
    // 添加用户消息到历史记录
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      // 调用LangChain API
      const response = await fetch(`${API_BASE_URL}/chat/with-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: chatHistory.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      // 添加AI回复到历史记录
      const aiMessage: ChatMessage = {
        id: data.id || `ai_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(data.timestamp),
      };

      setChatHistory(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('API调用失败:', error);
      Alert.alert('错误', 'API调用失败，请检查网络连接和API服务状态');
      
      // 添加错误消息
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: '抱歉，我现在无法回复。请稍后再试。',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 清空聊天历史
  const clearHistory = () => {
    Alert.alert(
      '确认',
      '确定要清空聊天历史吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => setChatHistory([]) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>🤖 Agent Chat Native</Text>
        <Text style={styles.subtitle}>LangChain集成聊天应用</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>清空历史</Text>
        </TouchableOpacity>
      </View>

      {/* 聊天历史 */}
      <ScrollView style={styles.chatHistory} showsVerticalScrollIndicator={false}>
        {chatHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>开始与AI助手对话吧！</Text>
          </View>
        ) : (
          chatHistory.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageContainer,
                msg.role === 'user' ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text style={styles.messageRole}>
                {msg.role === 'user' ? '👤 你' : '🤖 AI'}
              </Text>
              <Text style={styles.messageContent}>{msg.content}</Text>
              <Text style={styles.messageTime}>
                {msg.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.loadingText}>AI正在思考中...</Text>
          </View>
        )}
      </ScrollView>

      {/* 输入区域 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="输入你的消息..."
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, isLoading && styles.disabledButton]} 
          onPress={sendMessage}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? '发送中...' : '发送'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
  },
  chatHistory: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 3,
  },
  aiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 