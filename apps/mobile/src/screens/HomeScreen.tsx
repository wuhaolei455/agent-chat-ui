import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { API_CONFIG } from '../config/api';

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  // 测试API连接
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        console.log('🔍 测试API连接:', API_CONFIG.BASE_URL);
        
        // 使用AbortController实现超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api/v1', '')}/health`, {
          method: 'GET',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setApiStatus('connected');
          console.log('✅ API连接成功');
        } else {
          setApiStatus('error');
          console.log('❌ API连接失败:', response.status);
        }
      } catch (error) {
        setApiStatus('error');
        console.log('❌ API连接错误:', error);
      }
    };

    checkApiConnection();
  }, []);

  const handleStartChat = () => {
    if (apiStatus !== 'connected') {
      Alert.alert(
        '连接错误',
        'API服务器连接失败，请检查网络设置或联系开发者。',
        [{ text: '确定' }]
      );
      return;
    }
    
    navigation.navigate('Chat', {
      threadId: 'new',
      title: '新对话'
    });
  };

  const handleOpenSettings = () => {
    navigation.navigate('Settings');
  };

  // 模拟的最近对话数据
  const recentChats = [
    { id: '1', title: 'React Native开发问题', lastMessage: '如何优化性能？', time: '2分钟前' },
    { id: '2', title: 'API集成讨论', lastMessage: '后端接口已更新', time: '1小时前' },
    { id: '3', title: '项目架构设计', lastMessage: '考虑使用微服务', time: '昨天' },
  ];

  const getApiStatusColor = () => {
    switch (apiStatus) {
      case 'connected': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'connected': return '✅ API连接正常';
      case 'error': return '❌ API连接失败';
      default: return '🔄 检查连接中...';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* 欢迎卡片 */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>欢迎使用 Agent Chat</Title>
            <Paragraph>
              智能对话助手，为您提供专业的AI对话体验。开始与AI助手进行有意义的对话吧！
            </Paragraph>
            
            {/* API状态指示器 */}
            <View style={{ 
              marginTop: 12, 
              padding: 8, 
              backgroundColor: getApiStatusColor() + '20',
              borderRadius: 4,
              borderLeftWidth: 4,
              borderLeftColor: getApiStatusColor()
            }}>
              <Paragraph style={{ fontSize: 12, color: getApiStatusColor() }}>
                {getApiStatusText()}
              </Paragraph>
              <Paragraph style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                API地址: {API_CONFIG.BASE_URL}
              </Paragraph>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleStartChat}>
              开始新对话
            </Button>
            <Button mode="outlined" onPress={handleOpenSettings}>
              设置
            </Button>
          </Card.Actions>
        </Card>

        {/* 最近对话 */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>最近对话</Title>
          </Card.Content>
          {recentChats.map((chat, index) => (
            <React.Fragment key={chat.id}>
              <List.Item
                title={chat.title}
                description={`${chat.lastMessage} • ${chat.time}`}
                left={props => <List.Icon {...props} icon="chat" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate('Chat', { 
                  threadId: chat.id, 
                  title: chat.title 
                })}
              />
              {index < recentChats.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>

        {/* 功能特色 */}
        <Card>
          <Card.Content>
            <Title>功能特色</Title>
            <List.Item
              title="智能对话"
              description="基于先进AI模型的自然对话体验"
              left={props => <List.Icon {...props} icon="robot" />}
            />
            <Divider />
            <List.Item
              title="多模态支持"
              description="支持文本、图片等多种输入方式"
              left={props => <List.Icon {...props} icon="image-multiple" />}
            />
            <Divider />
            <List.Item
              title="实时响应"
              description="快速的AI响应，流畅的对话体验"
              left={props => <List.Icon {...props} icon="flash" />}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* 悬浮按钮 */}
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="plus"
        onPress={handleStartChat}
        disabled={apiStatus !== 'connected'}
      />
    </View>
  );
} 