export interface BaseNodeData {
  type: string;
  label: string;
  status?: 'pending' | 'running' | 'success' | 'failed';
}

export interface TextNodeData extends BaseNodeData {
  type: 'text';
  value: string;
}

export interface ImageUploadNodeData extends BaseNodeData {
  type: 'imageUpload';
  imageUrl: string | null;
  fileName?: string;
  fileSize?: number;
}

export interface VideoUploadNodeData extends BaseNodeData {
  type: 'videoUpload';
  videoUrl: string | null;
  fileName?: string;
  fileSize?: number;
}

export interface LLMNodeData extends BaseNodeData {
  type: 'llm';
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature: number;
  maxTokens: number;
  output?: string;
}

export interface CropImageNodeData extends BaseNodeData {
  type: 'cropImage';
  x: number;
  y: number;
  width: number;
  height: number;
  output?: string;
}

export interface ExtractFrameNodeData extends BaseNodeData {
  type: 'extractFrame';
  timestamp: number;
  output?: string;
}

export type WorkflowNodeData =
  | TextNodeData
  | ImageUploadNodeData
  | VideoUploadNodeData
  | LLMNodeData
  | CropImageNodeData
  | ExtractFrameNodeData;

export interface NodeResultData {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  outputs?: Record<string, any>;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}