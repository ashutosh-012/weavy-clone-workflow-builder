import { create } from 'zustand';

interface WorkflowState {
  workflowId: string | null;
  selectedNodes: string[];
  isExecuting: boolean;
  executingNodes: string[];
  
  setWorkflowId: (id: string | null) => void;
  setSelectedNodes: (nodes: string[]) => void;
  setIsExecuting: (executing: boolean) => void;
  setExecutingNodes: (nodes: string[]) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflowId: null,
  selectedNodes: [],
  isExecuting: false,
  executingNodes: [],
  
  setWorkflowId: (id) => set({ workflowId: id }),
  setSelectedNodes: (nodes) => set({ selectedNodes: nodes }),
  setIsExecuting: (executing) => set({ isExecuting: executing }),
  setExecutingNodes: (nodes) => set({ executingNodes: nodes }),
}));