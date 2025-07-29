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

  // 图片预览
  if (
    block.type === 'image' &&
    block.source_type === 'base64' &&
    block.mime_type.startsWith('image/')
  ) {
    const uri = `data:${block.mime_type};base64,${block.data}`;
    
    return (
      <View style={styles.container}>
        <Image
          source={{ uri }}
          style={[styles.image, getSizeStyle()]}
          resizeMode="cover"
        />
        {removable && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            accessibilityLabel="移除图片"
          >
            <MaterialIcons name="close" size={16} color="white" />
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
    
    return (
      <View style={styles.container}>
        <Video
          source={{ uri }}
          style={[styles.video, getSizeStyle()]}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
        />
        {removable && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            accessibilityLabel="移除视频"
          >
            <MaterialIcons name="close" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 文件预览 (PDF等)
  if (block.type === 'file') {
    const filename = block.metadata?.filename || block.metadata?.name || '文件';
    
    return (
      <View style={styles.fileContainer}>
        <View style={styles.fileContent}>
          <MaterialIcons 
            name="description" 
            size={size === 'sm' ? 20 : size === 'lg' ? 32 : 24} 
            color="#0891b2" 
          />
          <Text style={styles.filename} numberOfLines={1}>
            {filename}
          </Text>
        </View>
        {removable && (
          <TouchableOpacity
            style={styles.fileRemoveButton}
            onPress={onRemove}
            accessibilityLabel="移除文件"
          >
            <MaterialIcons name="close" size={16} color="#0891b2" />
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
          <MaterialIcons name="close" size={16} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: 4,
  },
  image: {
    borderRadius: 8,
  },
  video: {
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(107, 114, 128, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filename: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  fileRemoveButton: {
    marginLeft: 8,
    padding: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
  unsupportedText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6b7280',
  },
}); 