'use client';

import { memo } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Crop } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { CropImageNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';

export const CropImageNode = memo(({ data, id, selected }: NodeProps<CropImageNodeData>) => {
  const nodeType = NODE_TYPES.cropImage;

  return (
    <>
      <NodeHandle type="target" position={Position.Left} color={nodeType.color} id="input" />

      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Crop className="h-4 w-4" />}
      >
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-zinc-400">X: {data.x}px</p>
            </div>
            <div>
              <p className="text-zinc-400">Y: {data.y}px</p>
            </div>
            <div>
              <p className="text-zinc-400">W: {data.width}px</p>
            </div>
            <div>
              <p className="text-zinc-400">H: {data.height}px</p>
            </div>
          </div>
          {data.outputUrl && (
            <img
              src={data.outputUrl}
              alt="Cropped"
              className="h-24 w-full rounded object-cover"
            />
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="output" />
    </>
  );
});

CropImageNode.displayName = 'CropImageNode';
