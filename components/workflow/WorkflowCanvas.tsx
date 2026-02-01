'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
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
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowStore();

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#52525b', strokeWidth: 2 },
    }),
    []
  );

  return (
    <div className="h-full w-full bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#27272a"
        />
        <Controls className="rounded-lg border border-zinc-800 bg-zinc-900" />
        <MiniMap
          className="rounded-lg border border-zinc-800 bg-zinc-900"
          style={{
            backgroundColor: '#18181b',
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeColor={(node) => {
            return '#3f3f46';
          }}
        />
      </ReactFlow>
    </div>
  );
}
