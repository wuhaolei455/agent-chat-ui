import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Base64ContentBlock } from '../components/MultimodalPreview';

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/mov',
  'video/avi',
  'video/quicktime',
];

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_VIDEO_TYPES,
  ...SUPPORTED_FILE_TYPES,
];

interface UseFileUploadOptions {
  initialBlocks?: Base64ContentBlock[];
}

// 将文件转换为base64
const fileToBase64 = (uri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(uri)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // 移除 "data:mime/type;base64," 前缀
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
};

// 将ImagePicker结果转换为ContentBlock
const imagePickerResultToContentBlock = async (
  result: ImagePicker.ImagePickerResult
): Promise<Base64ContentBlock[]> => {
  if (result.canceled || !result.assets) return [];

  const blocks: Base64ContentBlock[] = [];
  
  for (const asset of result.assets) {
    try {
      const base64Data = await fileToBase64(asset.uri);
      const mimeType = asset.mimeType || 'image/jpeg';
      
      const block: Base64ContentBlock = {
        type: mimeType.startsWith('video/') ? 'video' : 'image',
        source_type: 'base64',
        mime_type: mimeType,
        data: base64Data,
        metadata: {
          name: asset.fileName || `${mimeType.startsWith('video/') ? 'video' : 'image'}.${mimeType.split('/')[1]}`,
          size: asset.fileSize,
        },
      };
      
      blocks.push(block);
    } catch (error) {
      console.error('转换文件失败:', error);
      Alert.alert('错误', '文件处理失败');
    }
  }
  
  return blocks;
};

// 将DocumentPicker结果转换为ContentBlock
const documentPickerResultToContentBlock = async (
  result: DocumentPicker.DocumentPickerResult
): Promise<Base64ContentBlock[]> => {
  if (result.canceled || !result.assets) return [];

  const blocks: Base64ContentBlock[] = [];
  
  for (const asset of result.assets) {
    try {
      const base64Data = await fileToBase64(asset.uri);
      
      const block: Base64ContentBlock = {
        type: 'file',
        source_type: 'base64',
        mime_type: asset.mimeType || 'application/octet-stream',
        data: base64Data,
        metadata: {
          filename: asset.name,
          name: asset.name,
          size: asset.size,
        },
      };
      
      blocks.push(block);
    } catch (error) {
      console.error('转换文件失败:', error);
      Alert.alert('错误', '文件处理失败');
    }
  }
  
  return blocks;
};

export function useFileUpload({ initialBlocks = [] }: UseFileUploadOptions = {}) {
  const [contentBlocks, setContentBlocks] = useState<Base64ContentBlock[]>(initialBlocks);

  // 检查重复文件
  const isDuplicate = (newBlock: Base64ContentBlock): boolean => {
    return contentBlocks.some(block => {
      if (block.type !== newBlock.type) return false;
      
      if (block.type === 'file') {
        return block.metadata?.filename === newBlock.metadata?.filename;
      } else {
        return block.metadata?.name === newBlock.metadata?.name;
      }
    });
  };

  // 添加内容块
  const addContentBlocks = (newBlocks: Base64ContentBlock[]) => {
    const uniqueBlocks = newBlocks.filter(block => !isDuplicate(block));
    const duplicateCount = newBlocks.length - uniqueBlocks.length;
    
    if (duplicateCount > 0) {
      Alert.alert('提示', `检测到 ${duplicateCount} 个重复文件，已跳过`);
    }
    
    setContentBlocks(prev => [...prev, ...uniqueBlocks]);
  };

  // 移除内容块
  const removeBlock = (index: number) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index));
  };

  // 重置所有内容块
  const resetBlocks = () => {
    setContentBlocks([]);
  };

  // 从相机拍照
  const pickFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要相机权限才能拍照');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      const blocks = await imagePickerResultToContentBlock(result);
      addContentBlocks(blocks);
    } catch (error) {
      console.error('拍照失败:', error);
      Alert.alert('错误', '拍照失败');
    }
  };

  // 从相册选择
  const pickFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要相册权限才能选择文件');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: false,
      });

      const blocks = await imagePickerResultToContentBlock(result);
      addContentBlocks(blocks);
    } catch (error) {
      console.error('选择文件失败:', error);
      Alert.alert('错误', '选择文件失败');
    }
  };

  // 选择文档
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_FILE_TYPES,
        multiple: true,
        copyToCacheDirectory: true,
      });

      const blocks = await documentPickerResultToContentBlock(result);
      addContentBlocks(blocks);
    } catch (error) {
      console.error('选择文档失败:', error);
      Alert.alert('错误', '选择文档失败');
    }
  };

  // 显示文件选择选项
  const showFilePicker = () => {
    Alert.alert(
      '选择文件',
      '请选择要上传的内容类型',
      [
        { text: '拍照', onPress: pickFromCamera },
        { text: '相册', onPress: pickFromLibrary },
        { text: '文档', onPress: pickDocument },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return {
    contentBlocks,
    setContentBlocks,
    addContentBlocks,
    removeBlock,
    resetBlocks,
    pickFromCamera,
    pickFromLibrary,
    pickDocument,
    showFilePicker,
  };
} 