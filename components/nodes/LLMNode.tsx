'use client';

import { memo, useState } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Sparkles, ChevronDown, Copy, Check } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { LLMNodeData } from '@/types/nodes';
import { NODE_TYPES, GEMINI_MODELS } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const LLMNode = memo(({ data, id, selected }: NodeProps<LLMNodeData>) => {
  const nodeType = NODE_TYPES.llm;
  const { updateNode } = useWorkflowStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleCopy = () => {
    if (data.output) {
      navigator.clipboard.writeText(data.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <NodeHandle type="target" position={Position.Left} color="#3b82f6" id="system_prompt" label="system" />
      <NodeHandle type="target" position={Position.Left} color="#3b82f6" id="user_message" label="prompt" style={{ top: '32px' }} />
      <NodeHandle type="target" position={Position.Left} color="#22c55e" id="images" label="images" style={{ top: '64px' }} />

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
            <div className="relative mt-1">
              <select
                value={data.model}
                onChange={(e) => updateNode(id, { model: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full appearance-none rounded bg-zinc-800 p-2 pr-8 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                onClick={(e) => e.stopPropagation()}
              >
                {GEMINI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400">User Prompt</label>
            <textarea
              value={data.prompt}
              onChange={(e) => updateNode(id, { prompt: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Enter your prompt..."
              className="mt-1 h-20 w-full resize-none rounded bg-zinc-800 p-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-300"
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
            Advanced Settings
          </button>

          {showAdvanced && (
            <div className="space-y-2 border-t border-zinc-800 pt-2">
              <div>
                <label className="text-xs text-zinc-400">System Prompt</label>
                <textarea
                  value={data.systemPrompt || ''}
                  onChange={(e) => updateNode(id, { systemPrompt: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Optional system instructions..."
                  className="mt-1 h-16 w-full resize-none rounded bg-zinc-800 p-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
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
                    onKeyDown={handleKeyDown}
                    className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Max Tokens</label>
                  <input
                    type="number"
                    min="1"
                    max="4096"
                    value={data.maxTokens}
                    onChange={(e) => updateNode(id, { maxTokens: parseInt(e.target.value) })}
                    onKeyDown={handleKeyDown}
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
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="mt-1 max-h-32 overflow-y-auto rounded bg-zinc-800 p-2 text-xs text-zinc-300">
                {data.output}
              </div>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="result" label="result" />
    </>
  );
});

LLMNode.displayName = 'LLMNode';