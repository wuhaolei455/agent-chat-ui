import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

export interface Base64ContentBlock {
  type: 'image' | 'video' | 'file';
  source_type: 'base64';
  mime_type: string;
  data: string;
  metadata?: {
    name?: string;
    filename?: string;
    size?: number;
  };
}

interface MultimodalPreviewProps {
  block: Base64ContentBlock;
  removable?: boolean;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 获取文件图标
const getFileIcon = (mimeType: string): string => {
  if (mimeType.includes('pdf')) return 'picture-as-pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'description';
  if (mimeType.includes('text')) return 'text-snippet';
  return 'insert-drive-file';
};

export const MultimodalPreview: React.FC<MultimodalPreviewProps> = ({
  block,
  removable = false,
  onRemove,
  size = 'md',
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { width: 60, height: 60 };
      case 'lg':
        return { width: 120, height: 120 };
      default:
        return { width: 80, height: 80 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 28;
      default:
        return 20;
    }
  };

  // 图片预览
  if (
    block.type === 'image' &&
    block.source_type === 'base64' &&
    block.mime_type.startsWith('image/')
  ) {
    const uri = `data:${block.mime_type};base64,${block.data}`;
    const fileSize = formatFileSize(block.metadata?.size || 0);
    
    return (
      <View style={styles.container}>
        <Image
          source={{ uri }}
          style={[styles.image, getSizeStyle()]}
          resizeMode="cover"
        />
        {fileSize && size !== 'sm' && (
          <View style={styles.imageSizeLabel}>
            <Text style={styles.sizeText}>{fileSize}</Text>
          </View>
        )}
        {removable && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            accessibilityLabel="移除图片"
          >
            <MaterialIcons name="close" size={getIconSize()} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 视频预览
  if (
    block.type === 'video' &&
    block.source_type === 'base64' &&
    block.mime_type.startsWith('video/')
  ) {
    const uri = `data:${block.mime_type};base64,${block.data}`;
    const fileSize = formatFileSize(block.metadata?.size || 0);
    
    return (
      <View style={styles.container}>
        <Video
          source={{ uri }}
          style={[styles.video, getSizeStyle()]}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
        />
        <View style={styles.videoOverlay}>
          <MaterialIcons name="play-circle-outline" size={24} color="white" />
        </View>
        {fileSize && size !== 'sm' && (
          <View style={styles.videoSizeLabel}>
            <Text style={styles.sizeText}>{fileSize}</Text>
          </View>
        )}
        {removable && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            accessibilityLabel="移除视频"
          >
            <MaterialIcons name="close" size={getIconSize()} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 文件预览 (PDF等)
  if (block.type === 'file') {
    const filename = block.metadata?.filename || block.metadata?.name || '文件';
    const fileSize = formatFileSize(block.metadata?.size || 0);
    const iconName = getFileIcon(block.mime_type);
    
    return (
      <View style={[
        styles.fileContainer,
        size === 'sm' && styles.fileContainerSmall
      ]}>
        <View style={styles.fileContent}>
          <View style={styles.fileIconContainer}>
            <MaterialIcons 
              name={iconName as any}
              size={size === 'sm' ? 20 : size === 'lg' ? 32 : 24} 
              color="#0891b2" 
            />
          </View>
          <View style={styles.fileInfo}>
            <Text 
              style={[
                styles.filename,
                size === 'sm' && styles.filenameSmall
              ]} 
              numberOfLines={size === 'sm' ? 1 : 2}
            >
              {filename}
            </Text>
            {fileSize && size !== 'sm' && (
              <Text style={styles.fileSize}>{fileSize}</Text>
            )}
          </View>
        </View>
        {removable && (
          <TouchableOpacity
            style={styles.fileRemoveButton}
            onPress={onRemove}
            accessibilityLabel="移除文件"
          >
            <MaterialIcons name="close" size={getIconSize()} color="#0891b2" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 未知类型
  return (
    <View style={styles.fileContainer}>
      <View style={styles.fileContent}>
        <MaterialIcons name="help-outline" size={20} color="#6b7280" />
        <Text style={styles.unsupportedText}>不支持的文件类型</Text>
      </View>
      {removable && (
        <TouchableOpacity
          style={styles.fileRemoveButton}
          onPress={onRemove}
          accessibilityLabel="移除文件"
        >
          <MaterialIcons name="close" size={getIconSize()} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    borderRadius: 8,
  },
  video: {
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  imageSizeLabel: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  videoSizeLabel: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  sizeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(107, 114, 128, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 120,
  },
  fileContainerSmall: {
    padding: 8,
    minWidth: 100,
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIconContainer: {
    marginRight: 8,
    padding: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  filename: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 16,
  },
  filenameSmall: {
    fontSize: 11,
    lineHeight: 14,
  },
  fileSize: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  fileRemoveButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unsupportedText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6b7280',
  },
}); 