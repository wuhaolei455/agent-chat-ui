import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  IconButton,
  Card,
  Paragraph,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

// 消息类型定义
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: '1',
    content: '你好！我是AI助手，有什么可以帮助您的吗？',
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:00:00'),
  },
  {
    id: '2',
    content: '你好，我想了解一下React Native的开发流程',
    role: 'user',
    timestamp: new Date('2024-01-15T10:01:00'),
  },
  {
    id: '3',
    content: 'React Native是一个用于构建移动应用的框架，它允许您使用JavaScript和React来开发原生iOS和Android应用。开发流程通常包括：\n\n1. 环境搭建\n2. 项目初始化\n3. 开发和调试\n4. 构建和发布\n\n您想了解哪个方面的详细信息呢？',
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:01:30'),
  },
];

export default function ChatScreen() {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // 设置标题
  React.useLayoutEffect(() => {
    if (route.params?.title) {
      navigation.setOptions({ title: route.params.title });
    }
  }, [navigation, route.params?.title]);

  // 发送消息
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputText('');
    setIsLoading(true);

    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // 模拟AI响应
    setTimeout(() => {
      const responses = [
        '这是一个很好的问题！让我为您详细解答。',
        '根据您的描述，我建议采用以下方法...',
        '这个问题涉及到多个方面，我来逐一分析。',
        '基于最新的技术趋势，我推荐您考虑...',
        '您的想法很有创意！我可以为您提供一些相关的资源和建议。',
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );
      setIsLoading(false);

      // 再次滚动到底部
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  // 渲染消息项
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        <Card style={[
          styles.messageCard,
          isUser ? styles.userMessageCard : styles.assistantMessageCard
        ]}>
          <Card.Content style={styles.messageContent}>
            {item.isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator animating size="small" />
                <Paragraph style={styles.loadingText}>AI正在思考...</Paragraph>
              </View>
            ) : (
              <Paragraph style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.assistantMessageText
              ]}>
                {item.content}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
        <Chip 
          style={styles.timestampChip}
          textStyle={styles.timestampText}
          compact
        >
          {item.timestamp.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Chip>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="输入消息..."
          multiline
          maxLength={1000}
          disabled={isLoading}
          onSubmitEditing={handleSendMessage}
          blurOnSubmit={false}
        />
        <IconButton
          icon="send"
          mode="contained"
          size={24}
          onPress={handleSendMessage}
          disabled={isLoading || inputText.trim() === ''}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  assistantMessageContainer: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    elevation: 2,
  },
  userMessageCard: {
    backgroundColor: '#2563eb',
  },
  assistantMessageCard: {
    backgroundColor: '#ffffff',
  },
  messageContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  assistantMessageText: {
    color: '#1e293b',
  },
  timestampChip: {
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
  },
}); 