'use client';

import { memo, useState, useEffect } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Film, AlertTriangle } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { ExtractFrameNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const ExtractFrameNode = memo(({ data, id, selected }: NodeProps<ExtractFrameNodeData>) => {
  const nodeType = NODE_TYPES.extractFrame;
  const { updateNode, edges, nodes } = useWorkflowStore();
  const [warning, setWarning] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  useEffect(() => {
    const inputEdge = edges.find((e) => e.target === id);
    if (!inputEdge) {
      setVideoDuration(null);
      setWarning(null);
      return;
    }

    const sourceNode = nodes.find((n) => n.id === inputEdge.source);
    if (!sourceNode || sourceNode.data.type !== 'videoUpload') {
      setVideoDuration(null);
      return;
    }

    const videoData = sourceNode.data as any;
    if (videoData.videoUrl) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
        
        if (data.timestamp > video.duration) {
          setWarning(`Timestamp exceeds video duration (${video.duration.toFixed(2)}s)`);
        } else if (data.timestamp < 0) {
          setWarning('Timestamp cannot be negative');
        } else {
          setWarning(null);
        }
        
        video.src = '';
      };
      video.src = videoData.videoUrl;
    }
  }, [id, edges, nodes, data.timestamp]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const handleTimestampChange = (value: number) => {
    updateNode(id, { timestamp: value });
    
    if (videoDuration !== null) {
      if (value > videoDuration) {
        setWarning(`Timestamp exceeds video duration (${videoDuration.toFixed(2)}s)`);
      } else if (value < 0) {
        setWarning('Timestamp cannot be negative');
      } else {
        setWarning(null);
      }
    }
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
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400">Timestamp (seconds)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.timestamp}
              onChange={(e) => handleTimestampChange(parseFloat(e.target.value) || 0)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          {videoDuration !== null && (
            <div className="text-xs text-zinc-500">
              Video duration: {videoDuration.toFixed(2)}s
            </div>
          )}

          {warning && (
            <div className="flex items-center gap-2 rounded bg-yellow-500/10 p-2 text-xs text-yellow-500">
              <AlertTriangle className="h-3 w-3 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          )}

          <div className="text-xs text-zinc-500">
            Extract a single frame from the input video at the specified timestamp
          </div>

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