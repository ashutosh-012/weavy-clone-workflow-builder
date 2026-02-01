import { NodeResultData } from './nodes';

export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'partial';
export type ExecutionScope = 'full' | 'selected' | 'single';

export interface Execution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  scope: ExecutionScope;
  nodeResults: NodeResultData[];
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export interface ExecutionCreateInput {
  workflowId: string;
  scope?: ExecutionScope;
  selectedNodeIds?: string[];
}

export interface ExecutionResult {
  execution: Execution;
  success: boolean;
  error?: string;
}
