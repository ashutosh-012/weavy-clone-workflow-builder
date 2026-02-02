'use client';

import { memo, useState, useRef } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Video, Upload, X } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { VideoUploadNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const VideoUploadNode = memo(({ data, id, selected }: NodeProps<VideoUploadNodeData>) => {
  const nodeType = NODE_TYPES.videoUpload;
  const { updateNode } = useWorkflowStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 50MB.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      
      updateNode(id, {
        videoUrl: result.url,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    updateNode(id, {
      videoUrl: null,
      fileName: undefined,
      fileSize: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        icon={<Video className="h-4 w-4" />}
      >
        <div className="space-y-3">
          {!data.videoUrl ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                onKeyDown={handleKeyDown}
                className="hidden"
                id={`video-input-${id}`}
              />
              <label
                htmlFor={`video-input-${id}`}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 p-6 transition-colors hover:border-purple-500 hover:bg-zinc-800"
              >
                {uploading ? (
                  <>
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                    <span className="text-xs text-zinc-400">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-zinc-500" />
                    <span className="text-xs text-zinc-400">Click to upload video</span>
                    <span className="text-xs text-zinc-600">MP4, WebM up to 50MB</span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative overflow-hidden rounded-lg bg-black">
                <video
                  src={data.videoUrl}
                  controls
                  className="h-32 w-full object-contain"
                />
                <button
                  onClick={handleRemove}
                  className="absolute right-1 top-1 rounded bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {data.fileName && (
                <div className="text-xs text-zinc-400">
                  <p className="truncate">{data.fileName}</p>
                  {data.fileSize && (
                    <p className="text-zinc-600">
                      {(data.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="video" label="video" />
    </>
  );
});

VideoUploadNode.displayName = 'VideoUploadNode';