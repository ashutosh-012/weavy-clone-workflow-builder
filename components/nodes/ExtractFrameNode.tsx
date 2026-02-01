'use client';

import { memo } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Film } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { ExtractFrameNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';

export const ExtractFrameNode = memo(({ data, id, selected }: NodeProps<ExtractFrameNodeData>) => {
  const nodeType = NODE_TYPES.extractFrame;

  return (
    <>
      <NodeHandle type="target" position={Position.Left} color={nodeType.color} id="input" />

      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Film className="h-4 w-4" />}
      >
        <div className="space-y-2">
          <div>
            <p className="text-xs text-zinc-400">
              Timestamp: {data.timestamp}s
            </p>
          </div>
          {data.outputUrl && (
            <img
              src={data.outputUrl}
              alt="Extracted frame"
              className="h-24 w-full rounded object-cover"
            />
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="output" />
    </>
  );
});

ExtractFrameNode.displayName = 'ExtractFrameNode';
