'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ConnectionMode,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '@/lib/store';
import { TextNode } from '@/components/nodes/TextNode';
import { ImageUploadNode } from '@/components/nodes/ImageUploadNode';
import { VideoUploadNode } from '@/components/nodes/VideoUploadNode';
import { LLMNode } from '@/components/nodes/LLMNode';
import { CropImageNode } from '@/components/nodes/CropImageNode';
import { ExtractFrameNode } from '@/components/nodes/ExtractFrameNode';

const nodeTypes = {
  text: TextNode,
  imageUpload: ImageUploadNode,
  videoUpload: VideoUploadNode,
  llm: LLMNode,
  cropImage: CropImageNode,
  extractFrame: ExtractFrameNode,
};

export function WorkflowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, deleteNode } = useWorkflowStore();

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }),
    []
  );

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      if (connection.source === connection.target) {
        return false;
      }

      if (!connection.source || !connection.target) {
        return false;
      }

      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);

      if (!sourceNode || !targetNode) {
        return false;
      }

      const isDuplicate = edges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle
      );

      if (isDuplicate) {
        return false;
      }

      return true;
    },
    [edges, nodes]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        selectedNodes.forEach((node) => deleteNode(node.id));
      }
    },
    [nodes, deleteNode]
  );

  return (
    <div className="h-full w-full bg-zinc-950" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Strict}
        isValidConnection={isValidConnection}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        snapToGrid={true}
        snapGrid={[15, 15]}
        deleteKeyCode={['Delete', 'Backspace']}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#27272a" />
        <Controls className="rounded-lg border border-zinc-800 bg-zinc-900" showInteractive={false} />
        <MiniMap
          className="rounded-lg border border-zinc-800 bg-zinc-900"
          style={{
            backgroundColor: '#18181b',
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              text: '#3b82f6',
              imageUpload: '#22c55e',
              videoUpload: '#a855f7',
              llm: '#eab308',
              cropImage: '#f97316',
              extractFrame: '#ec4899',
            };
            return colors[node.type || 'text'] || '#3f3f46';
          }}
        />
      </ReactFlow>
    </div>
  );
}