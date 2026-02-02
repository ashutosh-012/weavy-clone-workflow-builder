export type NodeStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

export type NodeType =
  | 'text'
  | 'imageUpload'
  | 'videoUpload'
  | 'llm'
  | 'cropImage'
  | 'extractFrame';

export interface BaseNodeData {
  label: string;
  type: NodeType;
  status?: NodeStatus;
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
  duration?: number;
}

export interface LLMNodeData extends BaseNodeData {
  type: 'llm';
  prompt: string;
  systemPrompt?: string;
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-2.0-flash';
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
  outputUrl?: string;
}

export interface ExtractFrameNodeData extends BaseNodeData {
  type: 'extractFrame';
  timestamp: number;
  outputUrl?: string;
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
  nodeType: NodeType;
  status: NodeStatus;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
}