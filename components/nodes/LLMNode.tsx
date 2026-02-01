'use client';

import { memo, useState } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Sparkles, ChevronDown, Settings } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { LLMNodeData } from '@/types/nodes';
import { NODE_TYPES, GEMINI_MODELS } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const LLMNode = memo(({ data, id, selected }: NodeProps<LLMNodeData>) => {
  const nodeType = NODE_TYPES.llm;
  const { updateNode } = useWorkflowStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <NodeHandle type="target" position={Position.Left} color="#3b82f6" id="system_prompt" label="system" style={{ top: 40 }} />
      <NodeHandle type="target" position={Position.Left} color="#3b82f6" id="user_message" label="prompt*" style={{ top: 80 }} />
      <NodeHandle type="target" position={Position.Left} color="#22c55e" id="images" label="images" style={{ top: 120 }} />

      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Sparkles className="h-4 w-4" />}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400">Model</label>
            <select
              value={data.model}
              onChange={(e) => updateNode(id, { model: e.target.value as any })}
              className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              onClick={(e) => e.stopPropagation()}
            >
              {GEMINI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400">User Prompt</label>
            <textarea
              value={data.prompt}
              onChange={(e) => updateNode(id, { prompt: e.target.value })}
              placeholder="Enter your prompt..."
              className="mt-1 w-full resize-none rounded bg-zinc-800 p-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAdvanced(!showAdvanced);
            }}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-300"
          >
            <Settings className="h-3 w-3" />
            Advanced Settings
            <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          {showAdvanced && (
            <div className="space-y-2 border-t border-zinc-800 pt-2">
              <div>
                <label className="text-xs text-zinc-400">System Prompt</label>
                <textarea
                  value={data.systemPrompt || ''}
                  onChange={(e) => updateNode(id, { systemPrompt: e.target.value })}
                  placeholder="You are a helpful assistant..."
                  className="mt-1 w-full resize-none rounded bg-zinc-800 p-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  rows={2}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400">Temperature</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={data.temperature}
                    onChange={(e) => updateNode(id, { temperature: parseFloat(e.target.value) })}
                    className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Max Tokens</label>
                  <input
                    type="number"
                    value={data.maxTokens}
                    onChange={(e) => updateNode(id, { maxTokens: parseInt(e.target.value) })}
                    className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          )}

          {data.output && (
            <div className="border-t border-zinc-800 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400">Output</label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(data.output || '');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Copy
                </button>
              </div>
              <div className="mt-1 max-h-32 overflow-auto rounded bg-zinc-800 p-2 text-xs text-zinc-300 whitespace-pre-wrap">
                {data.output}
              </div>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="output" label="result" />
    </>
  );
});

LLMNode.displayName = 'LLMNode';