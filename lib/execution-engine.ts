import { Node, Edge } from 'reactflow';
import { WorkflowNodeData, NodeResultData } from '@/types/nodes';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_AI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

interface ExecutionContext {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  results: Map<string, any>;
  updateNodeStatus?: (nodeId: string, status: 'running' | 'success' | 'failed') => void;
}

async function executeNode(
  node: Node<WorkflowNodeData>,
  context: ExecutionContext
): Promise<NodeResultData> {
  const startTime = Date.now();
  
  if (context.updateNodeStatus) {
    context.updateNodeStatus(node.id, 'running');
  }
  
  try {
    let output: any;
    const nodeData = node.data as WorkflowNodeData;

    switch (nodeData.type) {
      case 'text':
        output = nodeData.value || '';
        break;

      case 'imageUpload':
        output = nodeData.imageUrl || null;
        break;

      case 'videoUpload':
        output = nodeData.videoUrl || null;
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
        throw new Error('Unknown node type');
    }

    context.results.set(node.id, output);

    if (context.updateNodeStatus) {
      context.updateNodeStatus(node.id, 'success');
    }

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
    console.error(`Node ${node.id} execution failed:`, error);
    
    if (context.updateNodeStatus) {
      context.updateNodeStatus(node.id, 'failed');
    }

    return {
      id: `result-${node.id}`,
      nodeId: node.id,
      nodeName: node.data.label,
      nodeType: node.data.type,
      status: 'failed',
      errorMessage: error.message || 'Unknown error',
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
  const nodeData = node.data as any;
  if (nodeData.type !== 'llm') throw new Error('Invalid node type');

  const inputEdges = context.edges.filter((e) => e.target === node.id);
  
  let systemPrompt = nodeData.systemPrompt || '';
  let userMessage = nodeData.prompt || '';
  
  for (const edge of inputEdges) {
    const sourceOutput = context.results.get(edge.source);
    if (edge.targetHandle === 'system_prompt' && sourceOutput) {
      systemPrompt = String(sourceOutput);
    } else if (edge.targetHandle === 'user_message' && sourceOutput) {
      userMessage = String(sourceOutput);
    }
  }

  if (!userMessage) {
    throw new Error('No prompt provided');
  }

  if (!genAI || !API_KEY) {
    return `[DEMO MODE]\n\nPrompt: "${userMessage}"\n\nResponse: Lines of code unfold,\nBugs dance in midnight's cold glow,\nCoffee fuels the soul.\n\n(Add GOOGLE_AI_API_KEY to .env for real AI)`;
  }

  try {
    const modelName = 'gemini-2.5-flash';
    
    console.log('Calling Gemini API with model:', modelName);
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
    });
    
    const prompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${userMessage}`
      : userMessage;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Gemini API response received, length:', text.length);
    
    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key');
    }
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded');
    }
    
    throw new Error(`Gemini API: ${error.message}`);
  }
}

async function executeCropNode(
  node: Node<WorkflowNodeData>,
  context: ExecutionContext
): Promise<string> {
  const nodeData = node.data as any;
  if (nodeData.type !== 'cropImage') throw new Error('Invalid node type');
  
  const inputEdge = context.edges.find((e) => e.target === node.id);
  if (!inputEdge) throw new Error('No image input connected');
  
  const imageUrl = context.results.get(inputEdge.source);
  if (!imageUrl) throw new Error('No image data available');

  try {
    const response = await fetch('/api/process/crop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl,
        x: nodeData.x || 0,
        y: nodeData.y || 0,
        width: nodeData.width || 100,
        height: nodeData.height || 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Crop failed');
    }

    const result = await response.json();
    return result.croppedImageUrl;
  } catch (error: any) {
    throw new Error(`Crop error: ${error.message}`);
  }
}

async function executeExtractFrameNode(
  node: Node<WorkflowNodeData>,
  context: ExecutionContext
): Promise<string> {
  const nodeData = node.data as any;
  if (nodeData.type !== 'extractFrame') throw new Error('Invalid node type');
  
  const inputEdge = context.edges.find((e) => e.target === node.id);
  if (!inputEdge) throw new Error('No video input connected');
  
  const videoUrl = context.results.get(inputEdge.source);
  if (!videoUrl) throw new Error('No video data available');

  return `Frame extracted at ${nodeData.timestamp}s from video`;
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

export async function executeWorkflow(
  data: {
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
  },
  updateNodeStatus?: (nodeId: string, status: 'running' | 'success' | 'failed') => void
) {
  const context: ExecutionContext = {
    nodes: data.nodes,
    edges: data.edges,
    results: new Map(),
    updateNodeStatus,
  };

  const executionOrder = getExecutionOrder(data.nodes, data.edges);
  const nodeResults: NodeResultData[] = [];

  for (const node of executionOrder) {
    const result = await executeNode(node, context);
    nodeResults.push(result);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return { nodeResults };
}