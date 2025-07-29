import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  Animated,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { MultimodalPreview, Base64ContentBlock } from './src/components/MultimodalPreview';
import { useFileUpload } from './src/hooks/useFileUpload';

// API配置
const API_BASE_URL = 'http://localhost:4000';

// 消息内容类型
type MessageContent = 
  | { type: 'text'; text: string }
  | Base64ContentBlock;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: MessageContent[];
  timestamp: Date;
}

// 获取消息的文本内容
const getMessageText = (content: MessageContent[]): string => {
  return content
    .filter((item): item is { type: 'text'; text: string } => item.type === 'text')
    .map(item => item.text)
    .join(' ');
};

// 消息组件
const MessageBubble: React.FC<{ message: ChatMessage; isAnimating?: boolean }> = ({ 
  message, 
  isAnimating = false 
}) => {
  const isUser = message.role === 'user';
  const textContent = getMessageText(message.content);
  const mediaContent = message.content.filter(
    (item): item is Base64ContentBlock => item.type !== 'text'
  );
  
  const fadeAnim = useRef(new Animated.Value(isAnimating ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(isAnimating ? 20 : 0)).current;

  useEffect(() => {
    if (isAnimating) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isAnimating]);

  return (
    <Animated.View 
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* 显示媒体内容 */}
      {mediaContent.length > 0 && (
        <View style={styles.mediaContainer}>
          {mediaContent.map((block, index) => (
            <MultimodalPreview
              key={index}
              block={block}
              size="md"
              removable={false}
            />
          ))}
        </View>
      )}
      
      {/* 显示文本内容 */}
      {textContent && (
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.assistantText
        ]}>
          {textContent}
        </Text>
      )}
      
      {/* 时间戳 */}
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </Animated.View>
  );
};

export default function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  
  const {
    contentBlocks,
    removeBlock,
    resetBlocks,
    showFilePicker,
    isProcessing,
    getFileStats,
  } = useFileUpload();

  // 键盘监听器
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // 延迟滚动到底部，确保键盘完全弹出
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // 监听聊天历史变化，自动滚动
  useEffect(() => {
    if (chatHistory.length > 0) {
      const newLastMessageId = chatHistory[chatHistory.length - 1].id;
      if (newLastMessageId !== lastMessageId) {
        setLastMessageId(newLastMessageId);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    }
  }, [chatHistory]);

  // 发送消息到LangChain API
  const sendMessageInternal = async (isRetry = false) => {
    if (!message.trim() && contentBlocks.length === 0) {
      Alert.alert('提示', '请输入消息或选择文件');
      return;
    }

    // 收起键盘
    Keyboard.dismiss();
    setIsLoading(true);
    
    // 构建消息内容
    const messageContent: MessageContent[] = [
      ...(message.trim() ? [{ type: 'text' as const, text: message.trim() }] : []),
      ...contentBlocks,
    ];
    
    // 添加用户消息到历史记录
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    resetBlocks();

    try {
      // 调用LangChain API（支持多媒体）
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
        content: [{ type: 'text', text: data.content }],
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
        content: [{ type: 'text', text: '抱歉，我现在无法回复。请稍后再试。' }],
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 包装函数供UI调用
  const sendMessage = () => sendMessageInternal(false);

  // 清空聊天历史
  const clearChat = () => {
    Alert.alert(
      '确认清空',
      '确定要清空聊天记录吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => {
          setChatHistory([]);
          setLastMessageId(null);
        }}
      ]
    );
  };

  // 焦点输入框
  const focusInput = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI助手</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={scrollToBottom} style={styles.actionButton}>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearChat} style={styles.actionButton}>
            <MaterialIcons name="delete-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 聊天消息区域 */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: Math.max(20, keyboardHeight / 4) }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToBottom}
      >
        {chatHistory.length === 0 ? (
          <TouchableOpacity style={styles.emptyState} onPress={focusInput}>
            <MaterialIcons name="chat-bubble-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>开始您的对话吧</Text>
            <Text style={styles.emptySubText}>支持文字、图片、视频和文档</Text>
            <Text style={styles.tapHint}>点击这里开始输入</Text>
          </TouchableOpacity>
        ) : (
          chatHistory.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              message={msg}
              isAnimating={index === chatHistory.length - 1 && msg.role === 'assistant'}
            />
          ))
        )}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>AI正在思考...</Text>
          </View>
        )}
      </ScrollView>

      {/* 输入区域 */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputSection}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* 文件统计和预览区域 */}
        {contentBlocks.length > 0 && (
          <Animated.View style={styles.filePreviewContainer}>
            <View style={styles.fileStatsContainer}>
              <Text style={styles.fileStatsText}>
                {(() => {
                  const stats = getFileStats();
                  return `已选择 ${stats.total} 个文件 (${stats.totalSizeFormatted})`;
                })()}
              </Text>
              <TouchableOpacity onPress={resetBlocks} style={styles.clearAllButton}>
                <MaterialIcons name="clear-all" size={16} color="#666" />
                <Text style={styles.clearAllText}>清空</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filePreviewContent}
            >
              {contentBlocks.map((block, index) => (
                <MultimodalPreview
                  key={index}
                  block={block}
                  size="sm"
                  removable
                  onRemove={() => removeBlock(index)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}
        
        {/* 输入框和按钮 */}
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            onPress={showFilePicker}
            style={[
              styles.attachButton,
              (isLoading || isProcessing) && styles.attachButtonDisabled
            ]}
            disabled={isLoading || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <MaterialIcons name="add" size={24} color={(isLoading || isProcessing) ? "#ccc" : "#007AFF"} />
            )}
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              ref={textInputRef}
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="输入消息..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
              editable={!isLoading}
              textAlignVertical="center"
              onSubmitEditing={() => {
                if (!isLoading && (message.trim() || contentBlocks.length > 0)) {
                  sendMessageInternal();
                }
              }}
              blurOnSubmit={false}
            />
            {message.length > 800 && (
              <View style={styles.characterCounter}>
                <Text style={[
                  styles.counterText,
                  message.length > 950 && styles.counterTextWarning
                ]}>
                  {message.length}/1000
                </Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={sendMessage}
            style={[
              styles.sendButton,
              (isLoading || (!message.trim() && contentBlocks.length === 0)) && styles.sendButtonDisabled
            ]}
            disabled={isLoading || (!message.trim() && contentBlocks.length === 0)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialIcons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  messageBubble: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  assistantText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  inputSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  filePreviewContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  fileStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  fileStatsText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  clearAllText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  filePreviewContent: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 12,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  attachButtonDisabled: {
    backgroundColor: '#f8f8f8',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f8f8f8',
    color: '#333',
  },
  characterCounter: {
    position: 'absolute',
    bottom: 4,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  counterText: {
    fontSize: 10,
    color: '#666',
  },
  counterTextWarning: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
});