import { NodeType } from '@/types/nodes';

export const NODE_TYPES: Record<NodeType, { label: string; color: string; icon: string }> = {
  text: {
    label: 'Text Input',
    color: '#3b82f6',
    icon: 'Type',
  },
  imageUpload: {
    label: 'Image Upload',
    color: '#22c55e',
    icon: 'Image',
  },
  videoUpload: {
    label: 'Video Upload',
    color: '#a855f7',
    icon: 'Video',
  },
  llm: {
    label: 'LLM',
    color: '#eab308',
    icon: 'Sparkles',
  },
  cropImage: {
    label: 'Crop Image',
    color: '#f97316',
    icon: 'Crop',
  },
  extractFrame: {
    label: 'Extract Frame',
    color: '#ec4899',
    icon: 'Film',
  },
};

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
