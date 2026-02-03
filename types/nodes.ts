export type NodeStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'

export interface WorkflowNodeData {
  type: string
  label: string
  status?: NodeStatus
  value?: string
  imageUrl?: string
  videoUrl?: string
  prompt?: string
  systemPrompt?: string
  model?: string
  output?: string
  x?: number
  y?: number
  width?: number
  height?: number
  timestamp?: number
  fileName?: string
  fileSize?: number
  duration?: number
}

export interface TextNodeData extends WorkflowNodeData {
  type: 'text'
  value: string
}

export interface ImageUploadNodeData extends WorkflowNodeData {
  type: 'imageUpload'
  imageUrl?: string
  fileName?: string
  fileSize?: number
}

export interface VideoUploadNodeData extends WorkflowNodeData {
  type: 'videoUpload'
  videoUrl?: string
  fileName?: string
  fileSize?: number
  duration?: number
}

export interface LLMNodeData extends WorkflowNodeData {
  type: 'llm'
  prompt: string
  systemPrompt?: string
  model: string
  output?: string
}

export interface CropImageNodeData extends WorkflowNodeData {
  type: 'cropImage'
  x: number
  y: number
  width: number
  height: number
  output?: string
}

export interface ExtractFrameNodeData extends WorkflowNodeData {
  type: 'extractFrame'
  timestamp: number
  output?: string
}

export interface NodeResultData {
  id: string
  nodeId: string
  nodeName: string
  nodeType: string
  status: 'success' | 'failed' | 'skipped'
  outputs?: Record<string, any>
  errorMessage?: string
  startedAt: string
  completedAt: string
  duration: number
}