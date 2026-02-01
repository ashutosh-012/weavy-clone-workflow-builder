import { Node, Edge, Viewport } from 'reactflow';
import { WorkflowNodeData } from './nodes';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  viewport?: Viewport;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowCreateInput {
  name?: string;
  description?: string;
  nodes?: Node<WorkflowNodeData>[];
  edges?: Edge[];
  viewport?: Viewport;
}

export interface WorkflowUpdateInput {
  name?: string;
  description?: string;
  nodes?: Node<WorkflowNodeData>[];
  edges?: Edge[];
  viewport?: Viewport;
  isPublic?: boolean;
}
