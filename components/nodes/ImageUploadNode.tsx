'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Image } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { ImageUploadNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';

export const ImageUploadNode = memo(({ data, id, selected }: NodeProps<ImageUploadNodeData>) => {
  const nodeType = NODE_TYPES.imageUpload;

  return (
    <>
      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Image className="h-4 w-4" />}
      >
        <div className="space-y-2">
          {data.imageUrl ? (
            <div className="space-y-2">
              <img
                src={data.imageUrl}
                alt={data.fileName || 'Uploaded image'}
                className="h-32 w-full rounded object-cover"
              />
              <p className="truncate text-xs text-zinc-400">{data.fileName}</p>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded border-2 border-dashed border-zinc-700 text-zinc-500">
              <p className="text-sm">No image uploaded</p>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" color={nodeType.color} id="output" />
    </>
  );
});

ImageUploadNode.displayName = 'ImageUploadNode';
