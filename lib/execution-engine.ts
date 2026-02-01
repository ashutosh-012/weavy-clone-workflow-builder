import { Node, Edge } from 'reactflow';
import { WorkflowNodeData, NodeResultData, NodeStatus } from '@/types/nodes';

export interface ExecutionContext {
  nodeOutputs: Map<string, any>;
  results: NodeResultData[];
}

export class ExecutionEngine {
  private nodes: Node<WorkflowNodeData>[];
  private edges: Edge[];
  private context: ExecutionContext;

  constructor(nodes: Node<WorkflowNodeData>[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.context = {
      nodeOutputs: new Map(),
      results: [],
    };
  }

  // Build dependency graph using topological sort
  private buildExecutionOrder(): string[] {
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    // Initialize
    this.nodes.forEach((node) => {
      inDegree.set(node.id, 0);
      adjacencyList.set(node.id, []);
    });

    // Build adjacency list and calculate in-degrees
    this.edges.forEach((edge) => {
      adjacencyList.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Find nodes with no dependencies
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const executionOrder: string[] = [];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      executionOrder.push(nodeId);

      adjacencyList.get(nodeId)?.forEach((neighbor) => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    // Check for cycles
    if (executionOrder.length !== this.nodes.length) {
      throw new Error('Workflow contains cycles');
    }

    return executionOrder;
  }

  // Get input values for a node from connected nodes
  private getNodeInputs(nodeId: string): Record<string, any> {
    const inputs: Record<string, any> = {};
    const incomingEdges = this.edges.filter((edge) => edge.target === nodeId);

    incomingEdges.forEach((edge) => {
      const sourceOutput = this.context.nodeOutputs.get(edge.source);
      if (sourceOutput !== undefined) {
        inputs[edge.sourceHandle || 'default'] = sourceOutput;
      }
    });

    return inputs;
  }

  // Execute a single node
  private async executeNode(node: Node<WorkflowNodeData>): Promise<NodeResultData> {
    const startTime = Date.now();
    const result: NodeResultData = {
      id: `result-${node.id}-${startTime}`,
      nodeId: node.id,
      nodeName: node.data.label,
      nodeType: node.data.type,
      status: 'pending',
      startedAt: new Date().toISOString(),
    };

    try {
      result.status = 'running';
      result.inputs = this.getNodeInputs(node.id);

      let output: any;

      switch (node.data.type) {
        case 'text':
          output = node.data.value;
          break;

        case 'imageUpload':
          output = node.data.imageUrl;
          if (!output) {
            throw new Error('No image uploaded');
          }
          break;

        case 'videoUpload':
          output = node.data.videoUrl;
          if (!output) {
            throw new Error('No video uploaded');
          }
          break;

        case 'llm':
          output = await this.executeLLMNode(node, result.inputs);
          break;

        case 'cropImage':
          output = await this.executeCropImageNode(node, result.inputs);
          break;

        case 'extractFrame':
          output = await this.executeExtractFrameNode(node, result.inputs);
          break;

        default:
          throw new Error(`Unknown node type: ${(node.data as any).type}`);
      }

      this.context.nodeOutputs.set(node.id, output);
      result.outputs = { value: output };
      result.status = 'success';
    } catch (error) {
      result.status = 'failed';
      result.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    result.completedAt = new Date().toISOString();
    result.duration = Date.now() - startTime;

    return result;
  }

  private async executeLLMNode(
    node: Node<WorkflowNodeData>,
    inputs: Record<string, any>
  ): Promise<string> {
    if (node.data.type !== 'llm') throw new Error('Invalid node type');

    // Replace variables in prompt
    let prompt = node.data.prompt;
    Object.entries(inputs).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    });

    const response = await fetch('/api/llm/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model: node.data.model,
        temperature: node.data.temperature,
        maxTokens: node.data.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error('LLM generation failed');
    }

    const data = await response.json();
    return data.text;
  }

  private async executeCropImageNode(
    node: Node<WorkflowNodeData>,
    inputs: Record<string, any>
  ): Promise<string> {
    if (node.data.type !== 'cropImage') throw new Error('Invalid node type');

    const imageUrl = inputs.default;
    if (!imageUrl) {
      throw new Error('No image input provided');
    }

    const response = await fetch('/api/image/crop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl,
        x: node.data.x,
        y: node.data.y,
        width: node.data.width,
        height: node.data.height,
      }),
    });

    if (!response.ok) {
      throw new Error('Image crop failed');
    }

    const data = await response.json();
    return data.croppedImageUrl;
  }

  private async executeExtractFrameNode(
    node: Node<WorkflowNodeData>,
    inputs: Record<string, any>
  ): Promise<string> {
    if (node.data.type !== 'extractFrame') throw new Error('Invalid node type');

    const videoUrl = inputs.default;
    if (!videoUrl) {
      throw new Error('No video input provided');
    }

    const response = await fetch('/api/video/extract-frame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoUrl,
        timestamp: node.data.timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error('Frame extraction failed');
    }

    const data = await response.json();
    return data.frameUrl;
  }

  // Execute the entire workflow
  async execute(): Promise<NodeResultData[]> {
    try {
      const executionOrder = this.buildExecutionOrder();

      for (const nodeId of executionOrder) {
        const node = this.nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        const result = await this.executeNode(node);
        this.context.results.push(result);
      }

      return this.context.results;
    } catch (error) {
      throw error;
    }
  }

  // Execute only selected nodes
  async executeSelected(selectedNodeIds: string[]): Promise<NodeResultData[]> {
    const selectedNodes = this.nodes.filter((node) =>
      selectedNodeIds.includes(node.id)
    );

    if (selectedNodes.length === 0) {
      throw new Error('No nodes selected for execution');
    }

    // Find all dependencies of selected nodes
    const nodesToExecute = new Set<string>(selectedNodeIds);
    const visited = new Set<string>();

    const findDependencies = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const incomingEdges = this.edges.filter((edge) => edge.target === nodeId);
      incomingEdges.forEach((edge) => {
        nodesToExecute.add(edge.source);
        findDependencies(edge.source);
      });
    };

    selectedNodeIds.forEach(findDependencies);

    // Filter nodes and edges to only include necessary ones
    this.nodes = this.nodes.filter((node) => nodesToExecute.has(node.id));
    this.edges = this.edges.filter(
      (edge) => nodesToExecute.has(edge.source) && nodesToExecute.has(edge.target)
    );

    return this.execute();
  }
}
