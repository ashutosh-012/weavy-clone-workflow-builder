'use client';

import { memo } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { TextNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const TextNode = memo(({ data, id, selected }: NodeProps<TextNodeData>) => {
  const nodeType = NODE_TYPES.text;
  const { updateNode } = useWorkflowStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Type className="h-4 w-4" />}
      >
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Text Content</label>
          <textarea
            value={data.value}
            onChange={(e) => updateNode(id, { value: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="Enter text..."
            className="h-24 w-full resize-none rounded bg-zinc-800 p-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="text-xs text-zinc-500">{data.value.length} characters</p>
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="text" label="text" />
    </>
  );
});

TextNode.displayName = 'TextNode';