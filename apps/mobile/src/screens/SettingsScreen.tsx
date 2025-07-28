import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  List,
  Switch,
  Button,
  Divider,
  Portal,
  Dialog,
  TextInput,
  RadioButton,
} from 'react-native-paper';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSend, setAutoSend] = useState(false);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const handleClearHistory = () => {
    Alert.alert(
      '清空历史记录',
      '确定要清空所有聊天历史记录吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('成功', '历史记录已清空');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('导出数据', '数据导出功能开发中...');
  };

  const handleSaveApiKey = () => {
    // 模拟保存API密钥
    Alert.alert('成功', 'API密钥已保存');
    setShowApiDialog(false);
  };

  const handleSaveModel = () => {
    // 模拟保存模型选择
    Alert.alert('成功', `已切换到 ${selectedModel} 模型`);
    setShowModelDialog(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 界面设置 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>界面设置</Title>
            <List.Item
              title="深色模式"
              description="使用深色主题界面"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                />
              )}
            />
            <Divider />
            <List.Item
              title="推送通知"
              description="接收新消息通知"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                />
              )}
            />
            <Divider />
            <List.Item
              title="自动发送"
              description="按回车键自动发送消息"
              left={(props) => <List.Icon {...props} icon="send" />}
              right={() => (
                <Switch
                  value={autoSend}
                  onValueChange={setAutoSend}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* AI 设置 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>AI 设置</Title>
            <List.Item
              title="API 密钥"
              description="配置 OpenAI API 密钥"
              left={(props) => <List.Icon {...props} icon="key" />}
              onPress={() => setShowApiDialog(true)}
            />
            <Divider />
            <List.Item
              title="AI 模型"
              description={`当前：${selectedModel}`}
              left={(props) => <List.Icon {...props} icon="robot" />}
              onPress={() => setShowModelDialog(true)}
            />
            <Divider />
            <List.Item
              title="对话设置"
              description="调整AI回复的温度和长度"
              left={(props) => <List.Icon {...props} icon="cog" />}
              onPress={() => Alert.alert('开发中', '对话参数设置功能开发中...')}
            />
          </Card.Content>
        </Card>

        {/* 数据管理 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>数据管理</Title>
            <List.Item
              title="清空历史记录"
              description="删除所有聊天记录"
              left={(props) => <List.Icon {...props} icon="delete" />}
              onPress={handleClearHistory}
            />
            <Divider />
            <List.Item
              title="导出数据"
              description="将聊天记录导出为文件"
              left={(props) => <List.Icon {...props} icon="export" />}
              onPress={handleExportData}
            />
            <Divider />
            <List.Item
              title="同步设置"
              description="与云端同步设置和数据"
              left={(props) => <List.Icon {...props} icon="sync" />}
              onPress={() => Alert.alert('开发中', '云端同步功能开发中...')}
            />
          </Card.Content>
        </Card>

        {/* 关于 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>关于</Title>
            <List.Item
              title="版本信息"
              description="v1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            <Divider />
            <List.Item
              title="使用帮助"
              description="查看应用使用指南"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={() => Alert.alert('帮助', '使用帮助功能开发中...')}
            />
            <Divider />
            <List.Item
              title="反馈建议"
              description="向我们提供反馈"
              left={(props) => <List.Icon {...props} icon="message-text" />}
              onPress={() => Alert.alert('反馈', '反馈功能开发中...')}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* API密钥对话框 */}
      <Portal>
        <Dialog visible={showApiDialog} onDismiss={() => setShowApiDialog(false)}>
          <Dialog.Title>配置 API 密钥</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="OpenAI API Key"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              placeholder="sk-..."
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowApiDialog(false)}>取消</Button>
            <Button onPress={handleSaveApiKey} mode="contained">保存</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 模型选择对话框 */}
      <Portal>
        <Dialog visible={showModelDialog} onDismiss={() => setShowModelDialog(false)}>
          <Dialog.Title>选择 AI 模型</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group 
              onValueChange={setSelectedModel} 
              value={selectedModel}
            >
              <RadioButton.Item label="GPT-4" value="gpt-4" />
              <RadioButton.Item label="GPT-3.5 Turbo" value="gpt-3.5-turbo" />
              <RadioButton.Item label="Claude 3 Opus" value="claude-3-opus" />
              <RadioButton.Item label="Gemini Pro" value="gemini-pro" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowModelDialog(false)}>取消</Button>
            <Button onPress={handleSaveModel} mode="contained">确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  textInput: {
    marginVertical: 8,
  },
}); 