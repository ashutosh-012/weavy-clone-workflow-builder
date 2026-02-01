import { NodeType } from '@/types/nodes';

export const NODE_TYPES: Record<NodeType, { label: string; color: string; icon: string; description: string }> = {
  text: {
    label: 'Text Input',
    color: '#3b82f6',
    icon: 'Type',
    description: 'Input text data',
  },
  imageUpload: {
    label: 'Image Upload',
    color: '#22c55e',
    icon: 'Image',
    description: 'Upload and process images',
  },
  videoUpload: {
    label: 'Video Upload',
    color: '#a855f7',
    icon: 'Video',
    description: 'Upload and process videos',
  },
  llm: {
    label: 'Run LLM',
    color: '#eab308',
    icon: 'Sparkles',
    description: 'Process with AI models',
  },
  cropImage: {
    label: 'Crop Image',
    color: '#f97316',
    icon: 'Crop',
    description: 'Crop images to specific dimensions',
  },
  extractFrame: {
    label: 'Extract Frame',
    color: '#ec4899',
    icon: 'Film',
    description: 'Extract frame from video at timestamp',
  },
};

export const GEMINI_MODELS = [
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient',
    maxTokens: 8192,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Most capable model',
    maxTokens: 32768,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Latest model with improved performance',
    maxTokens: 8192,
  },
] as const;

export const EDGE_TYPES = {
  default: {
    type: 'smoothstep',
    animated: true,
  },
};

export const DEFAULT_VIEWPORT = {
  x: 0,
  y: 0,
  zoom: 1,
};

export const GRID_SIZE = 20;
export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 120;

export const KEYBOARD_SHORTCUTS = {
  save: 'Ctrl+S',
  run: 'Ctrl+Enter',
  delete: 'Delete',
  duplicate: 'Ctrl+D',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  selectAll: 'Ctrl+A',
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime'];