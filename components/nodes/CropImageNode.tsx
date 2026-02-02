'use client';

import { memo } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Crop } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { CropImageNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const CropImageNode = memo(({ data, id, selected }: NodeProps<CropImageNodeData>) => {
  const nodeType = NODE_TYPES.cropImage;
  const { updateNode } = useWorkflowStore();

  return (
    <>
      <NodeHandle type="target" position={Position.Left} color="#22c55e" id="image" label="image" />

      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Crop className="h-4 w-4" />}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-400">X Position</label>
              <input
                type="number"
                min="0"
                value={data.x}
                onChange={(e) => updateNode(id, { x: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Y Position</label>
              <input
                type="number"
                min="0"
                value={data.y}
                onChange={(e) => updateNode(id, { y: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-400">Width</label>
              <input
                type="number"
                min="1"
                value={data.width}
                onChange={(e) => updateNode(id, { width: parseInt(e.target.value) || 100 })}
                className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Height</label>
              <input
                type="number"
                min="1"
                value={data.height}
                onChange={(e) => updateNode(id, { height: parseInt(e.target.value) || 100 })}
                className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {data.output && (
            <div className="border-t border-zinc-800 pt-2">
              <label className="text-xs text-zinc-400">Output</label>
              <div className="mt-1 rounded bg-zinc-800 p-2">
                <img
                  src={data.output}
                  alt="Cropped"
                  className="h-24 w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="output" label="result" />
    </>
  );
});

CropImageNode.displayName = 'CropImageNode';