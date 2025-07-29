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

// 文件大小限制（字节）
const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 50 * 1024 * 1024, // 50MB
  file: 20 * 1024 * 1024,  // 20MB
};

interface UseFileUploadOptions {
  initialBlocks?: Base64ContentBlock[];
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 检查文件大小
const checkFileSize = (size: number, type: string): boolean => {
  let maxSize = MAX_FILE_SIZES.file;
  
  if (type.startsWith('image/')) {
    maxSize = MAX_FILE_SIZES.image;
  } else if (type.startsWith('video/')) {
    maxSize = MAX_FILE_SIZES.video;
  }
  
  return size <= maxSize;
};

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
  const failedFiles: string[] = [];
  
  for (const asset of result.assets) {
    try {
      const mimeType = asset.mimeType || 'image/jpeg';
      const fileSize = asset.fileSize || 0;
      
      // 检查文件大小
      if (!checkFileSize(fileSize, mimeType)) {
        const maxSize = mimeType.startsWith('video/') 
          ? formatFileSize(MAX_FILE_SIZES.video)
          : formatFileSize(MAX_FILE_SIZES.image);
        failedFiles.push(`${asset.fileName || '文件'} (${formatFileSize(fileSize)} > ${maxSize})`);
        continue;
      }
      
      const base64Data = await fileToBase64(asset.uri);
      
      const block: Base64ContentBlock = {
        type: mimeType.startsWith('video/') ? 'video' : 'image',
        source_type: 'base64',
        mime_type: mimeType,
        data: base64Data,
        metadata: {
          name: asset.fileName || `${mimeType.startsWith('video/') ? 'video' : 'image'}.${mimeType.split('/')[1]}`,
          size: fileSize,
        },
      };
      
      blocks.push(block);
    } catch (error) {
      console.error('转换文件失败:', error);
      failedFiles.push(asset.fileName || '未知文件');
    }
  }
  
  // 显示失败的文件
  if (failedFiles.length > 0) {
    Alert.alert(
      '部分文件处理失败', 
      `以下文件无法添加：\n${failedFiles.join('\n')}`,
      [{ text: '确定' }]
    );
  }
  
  return blocks;
};

// 将DocumentPicker结果转换为ContentBlock
const documentPickerResultToContentBlock = async (
  result: DocumentPicker.DocumentPickerResult
): Promise<Base64ContentBlock[]> => {
  if (result.canceled || !result.assets) return [];

  const blocks: Base64ContentBlock[] = [];
  const failedFiles: string[] = [];
  
  for (const asset of result.assets) {
    try {
      const fileSize = asset.size || 0;
      
      // 检查文件大小
      if (!checkFileSize(fileSize, asset.mimeType || '')) {
        failedFiles.push(`${asset.name} (${formatFileSize(fileSize)} > ${formatFileSize(MAX_FILE_SIZES.file)})`);
        continue;
      }
      
      const base64Data = await fileToBase64(asset.uri);
      
      const block: Base64ContentBlock = {
        type: 'file',
        source_type: 'base64',
        mime_type: asset.mimeType || 'application/octet-stream',
        data: base64Data,
        metadata: {
          filename: asset.name,
          name: asset.name,
          size: fileSize,
        },
      };
      
      blocks.push(block);
    } catch (error) {
      console.error('转换文件失败:', error);
      failedFiles.push(asset.name);
    }
  }
  
  // 显示失败的文件
  if (failedFiles.length > 0) {
    Alert.alert(
      '部分文件处理失败', 
      `以下文件无法添加：\n${failedFiles.join('\n')}`,
      [{ text: '确定' }]
    );
  }
  
  return blocks;
};

export function useFileUpload({ initialBlocks = [] }: UseFileUploadOptions = {}) {
  const [contentBlocks, setContentBlocks] = useState<Base64ContentBlock[]>(initialBlocks);
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    if (uniqueBlocks.length > 0) {
      setContentBlocks(prev => [...prev, ...uniqueBlocks]);
      Alert.alert('成功', `已添加 ${uniqueBlocks.length} 个文件`);
    }
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
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
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
      Alert.alert('错误', '拍照失败，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 从相册选择
  const pickFromLibrary = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
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
      Alert.alert('错误', '选择文件失败，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 选择文档
  const pickDocument = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_FILE_TYPES,
        multiple: true,
        copyToCacheDirectory: true,
      });

      const blocks = await documentPickerResultToContentBlock(result);
      addContentBlocks(blocks);
    } catch (error) {
      console.error('选择文档失败:', error);
      Alert.alert('错误', '选择文档失败，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 显示文件选择选项
  const showFilePicker = () => {
    if (isProcessing) {
      Alert.alert('提示', '正在处理文件，请稍候...');
      return;
    }
    
    const options = [
      { text: '📷 拍照', onPress: pickFromCamera },
      { text: '🖼️ 相册', onPress: pickFromLibrary },
      { text: '📄 文档', onPress: pickDocument },
      { text: '取消', style: 'cancel' as const },
    ];
    
    Alert.alert(
      '选择文件', 
      '请选择要上传的内容类型\n\n文件大小限制：\n• 图片：最大10MB\n• 视频：最大50MB\n• 文档：最大20MB',
      options,
      { cancelable: true }
    );
  };

  // 获取文件统计信息
  const getFileStats = () => {
    const stats = {
      total: contentBlocks.length,
      images: contentBlocks.filter(b => b.type === 'image').length,
      videos: contentBlocks.filter(b => b.type === 'video').length,
      files: contentBlocks.filter(b => b.type === 'file').length,
      totalSize: contentBlocks.reduce((sum, b) => sum + (b.metadata?.size || 0), 0),
    };
    
    return {
      ...stats,
      totalSizeFormatted: formatFileSize(stats.totalSize),
    };
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
    isProcessing,
    getFileStats,
  };
} 