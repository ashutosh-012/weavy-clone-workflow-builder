'use client';

import { memo } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Film } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { ExtractFrameNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const ExtractFrameNode = memo(({ data, id, selected }: NodeProps<ExtractFrameNodeData>) => {
  const nodeType = NODE_TYPES.extractFrame;
  const { updateNode } = useWorkflowStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <NodeHandle type="target" position={Position.Left} color="#a855f7" id="video" label="video" />

      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Film className="h-4 w-4" />}
      >
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Timestamp (seconds)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={data.timestamp}
            onChange={(e) => updateNode(id, { timestamp: parseFloat(e.target.value) || 0 })}
            onKeyDown={handleKeyDown}
            className="w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
            onClick={(e) => e.stopPropagation()}
          />

          {data.output && (
            <div className="border-t border-zinc-800 pt-2">
              <label className="text-xs text-zinc-400">Extracted Frame</label>
              <div className="mt-1 rounded bg-zinc-800 p-2">
                <img
                  src={data.output}
                  alt="Extracted frame"
                  className="h-24 w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="frame" label="frame" />
    </>
  );
});

ExtractFrameNode.displayName = 'ExtractFrameNode';