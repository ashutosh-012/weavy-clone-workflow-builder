import { Node, Edge } from 'reactflow';
import { WorkflowNodeData, NodeResultData } from '@/types/nodes';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ExecutionContext {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  results: Map<string, any>;
}

async function executeNode(
  node: Node<WorkflowNodeData>,
  context: ExecutionContext
): Promise<NodeResultData> {
  const startTime = Date.now();
  
  try {
    let output: any;

    switch (node.data.type) {
      case 'text':
        output = node.data.value;
        break;

      case 'imageUpload':
        output = node.data.imageUrl;
        break;

      case 'videoUpload':
        output = node.data.videoUrl;
        break;

      case 'llm':
        output = await executeLLMNode(node, context);
        break;

      case 'cropImage':
        output = await executeCropNode(node, context);
        break;

      case 'extractFrame':
        output = await executeExtractFrameNode(node, context);
        break;

      default:
        throw new Error(`Unknown node type: ${(node.data as any).type}`);
    }

    context.results.set(node.id, output);

    return {
      id: `result-${node.id}`,
      nodeId: node.id,
      nodeName: node.data.label,
      nodeType: node.data.type,
      status: 'success',
      outputs: { result: output },
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      id: `result-${node.id}`,
      nodeId: node.id,
      nodeName: node.data.label,
      nodeType: node.data.type,
      status: 'failed',
      errorMessage: error.message,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }
}

async function executeLLMNode(
  node: Node<WorkflowNodeData>,
  context: ExecutionContext
): Promise<string> {
  if (node.data.type !== 'llm') throw new Error('Invalid node type');

  const inputEdges = context.edges.filter((e) => e.target === node.id);
  
  let systemPrompt = node.data.systemPrompt || '';
  let userMessage = node.data.prompt || '';
  
  for (const edge of inputEdges) {
    const sourceOutput = context.results.get(edge.source);
    if (edge.targetHandle === 'system_prompt') {
      systemPrompt = sourceOutput || systemPrompt;
    } else if (edge.targetHandle === 'user_message') {
      userMessage = sourceOutput || userMessage;
    }
  }

  if (!process.env.GEMINI_API_KEY) {
    return `[Mock LLM Response]\nPrompt: ${userMessage}\nThis is a simulated response. Add GEMINI_API_KEY to .env to use real AI.`;
  }

  const model = genAI.getGenerativeModel({ model: node.data.model });
  
  const prompt = systemPrompt 
    ? `${systemPrompt}\n\nUser: ${userMessage}`
    : userMessage;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function executeCropNode(
  node: Node<WorkflowNodeData>,
  context: ExecutionContext
): Promise<string> {
  if (node.data.type !== 'cropImage') throw new Error('Invalid node type');
  
  const inputEdge = context.edges.find((e) => e.target === node.id);
  if (!inputEdge) throw new Error('No image input connected');
  
  const imageUrl = context.results.get(inputEdge.source);
  if (!imageUrl) throw new Error('No image data available');

  return `[Cropped Image: ${node.data.width}x${node.data.height} at ${node.data.x},${node.data.y}]`;
}

async function executeExtractFrameNode(
  node: Node<WorkflowNodeData>,
  context: ExecutionContext
): Promise<string> {
  if (node.data.type !== 'extractFrame') throw new Error('Invalid node type');
  
  const inputEdge = context.edges.find((e) => e.target === node.id);
  if (!inputEdge) throw new Error('No video input connected');
  
  const videoUrl = context.results.get(inputEdge.source);
  if (!videoUrl) throw new Error('No video data available');

  return `[Extracted Frame at ${node.data.timestamp}s]`;
}

function getExecutionOrder(nodes: Node[], edges: Edge[]): Node[] {
  const visited = new Set<string>();
  const order: Node[] = [];

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const dependencies = edges
      .filter((e) => e.target === nodeId)
      .map((e) => e.source);

    dependencies.forEach(visit);

    const node = nodes.find((n) => n.id === nodeId);
    if (node) order.push(node);
  }

  nodes.forEach((node) => visit(node.id));
  return order;
}

export async function executeWorkflow(data: {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}) {
  const context: ExecutionContext = {
    nodes: data.nodes,
    edges: data.edges,
    results: new Map(),
  };

  const executionOrder = getExecutionOrder(data.nodes, data.edges);
  const nodeResults: NodeResultData[] = [];

  for (const node of executionOrder) {
    const result = await executeNode(node, context);
    nodeResults.push(result);
  }

  return { nodeResults };
}