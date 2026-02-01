'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { TextNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';

export const TextNode = memo(({ data, id, selected }: NodeProps<TextNodeData>) => {
  const nodeType = NODE_TYPES.text;

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
          <p className="text-xs text-zinc-400">Output</p>
          <div className="rounded bg-zinc-800 p-2 text-sm text-zinc-300">
            {data.value || 'No text entered'}
          </div>
        </div>
      </BaseNode>

      <NodeHandle type="source" color={nodeType.color} id="output" />
    </>
  );
});

TextNode.displayName = 'TextNode';
