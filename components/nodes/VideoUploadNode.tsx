'use client';

import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Video } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { VideoUploadNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';

export const VideoUploadNode = memo(({ data, id, selected }: NodeProps<VideoUploadNodeData>) => {
  const nodeType = NODE_TYPES.videoUpload;

  return (
    <>
      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<Video className="h-4 w-4" />}
      >
        <div className="space-y-2">
          {data.videoUrl ? (
            <div className="space-y-2">
              <video
                src={data.videoUrl}
                className="h-32 w-full rounded object-cover"
                controls
              />
              <p className="truncate text-xs text-zinc-400">{data.fileName}</p>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded border-2 border-dashed border-zinc-700 text-zinc-500">
              <p className="text-sm">No video uploaded</p>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" color={nodeType.color} id="output" />
    </>
  );
});

VideoUploadNode.displayName = 'VideoUploadNode';
