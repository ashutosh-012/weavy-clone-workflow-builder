'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Sparkles } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { LLMNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';

export const LLMNode = memo(({ data, id, selected }: NodeProps<LLMNodeData>) => {
  const nodeType = NODE_TYPES.llm;

  return (
    <>
      <NodeHandle type="target" color={nodeType.color} id="input" />

      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Sparkles className="h-4 w-4" />}
      >
        <div className="space-y-2">
          <div>
            <p className="text-xs text-zinc-400">Prompt</p>
            <div className="mt-1 rounded bg-zinc-800 p-2 text-xs text-zinc-300">
              {data.prompt || 'No prompt set'}
            </div>
          </div>
          {data.output && (
            <div>
              <p className="text-xs text-zinc-400">Output</p>
              <div className="mt-1 max-h-20 overflow-auto rounded bg-zinc-800 p-2 text-xs text-zinc-300">
                {data.output}
              </div>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" color={nodeType.color} id="output" />
    </>
  );
});

LLMNode.displayName = 'LLMNode';
