'use client';

import { memo, useState, useRef } from 'react';
import { NodeProps, Position } from 'reactflow';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { NodeHandle } from './NodeHandle';
import { ImageUploadNodeData } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';

export const ImageUploadNode = memo(({ data, id, selected }: NodeProps<ImageUploadNodeData>) => {
  const nodeType = NODE_TYPES.imageUpload;
  const { updateNode } = useWorkflowStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      
      updateNode(id, {
        imageUrl: result.url,
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
      imageUrl: null,
      fileName: undefined,
      fileSize: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <BaseNode
        data={data}
        id={id}
        selected={selected}
        color={nodeType.color}
        icon={<ImageIcon className="h-4 w-4" />}
      >
        <div className="space-y-3">
          {!data.imageUrl ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`file-input-${id}`}
              />
              <label
                htmlFor={`file-input-${id}`}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 p-6 transition-colors hover:border-green-500 hover:bg-zinc-800"
              >
                {uploading ? (
                  <>
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                    <span className="text-xs text-zinc-400">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-zinc-500" />
                    <span className="text-xs text-zinc-400">Click to upload image</span>
                    <span className="text-xs text-zinc-600">PNG, JPG, WebP up to 10MB</span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={data.imageUrl}
                  alt="Uploaded"
                  className="h-32 w-full object-cover"
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
                      {(data.fileSize / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandle type="source" position={Position.Right} color={nodeType.color} id="image" label="image" />
    </>
  );
});

ImageUploadNode.displayName = 'ImageUploadNode';