import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { WorkflowNodeData } from '@/types/nodes';
import { Workflow } from '@/types/workflow';
import { Execution } from '@/types/execution';

interface WorkflowState {
  workflow: Workflow | null;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodes: string[];
  executions: Execution[];
  isExecuting: boolean;
  selectedNodeForEdit: string | null;
  historySidebarOpen: boolean;

  setWorkflow: (workflow: Workflow | null) => void;
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<WorkflowNodeData>) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedNodeForEdit: (nodeId: string | null) => void;
  setExecutions: (executions: Execution[]) => void;
  addExecution: (execution: Execution) => void;
  updateExecution: (executionId: string, updates: Partial<Execution>) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  setHistorySidebarOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  workflow: null,
  nodes: [],
  edges: [],
  selectedNodes: [],
  executions: [],
  isExecuting: false,
  selectedNodeForEdit: null,
  historySidebarOpen: false,
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  ...initialState,

  setWorkflow: (workflow) => set({ workflow }),

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNode: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const newNode: Node<WorkflowNodeData> = {
      ...node,
      id: `${node.type}-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: {
        ...node.data,
        label: `${node.data.label} (Copy)`,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },

  setSelectedNodes: (nodeIds) => set({ selectedNodes: nodeIds }),

  setSelectedNodeForEdit: (nodeId) => set({ selectedNodeForEdit: nodeId }),

  setExecutions: (executions) => set({ executions }),

  addExecution: (execution) => {
    console.log('Adding execution:', execution.id, execution.status);
    set({
      executions: [execution, ...get().executions],
    });
  },

  updateExecution: (executionId, updates) => {
    console.log('Updating execution:', executionId, 'to status:', updates.status);
    set({
      executions: get().executions.map(exec =>
        exec.id === executionId ? { ...exec, ...updates } : exec
      ),
    });
  },

  setIsExecuting: (isExecuting) => set({ isExecuting }),

  setHistorySidebarOpen: (open) => set({ historySidebarOpen: open }),

  reset: () => set(initialState),
}));