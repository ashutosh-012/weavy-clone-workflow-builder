'use client';

import { Type, Image, Video, Sparkles, Crop, Film } from 'lucide-react';
import { NodeType } from '@/types/nodes';
import { NODE_TYPES } from '@/lib/constants';
import { useWorkflowStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface NodeTypeItem {
  type: NodeType;
  icon: React.ReactNode;
}

const nodeTypes: NodeTypeItem[] = [
  { type: 'text', icon: <Type className="h-5 w-5" /> },
  { type: 'imageUpload', icon: <Image className="h-5 w-5" /> },
  { type: 'videoUpload', icon: <Video className="h-5 w-5" /> },
  { type: 'llm', icon: <Sparkles className="h-5 w-5" /> },
  { type: 'cropImage', icon: <Crop className="h-5 w-5" /> },
  { type: 'extractFrame', icon: <Film className="h-5 w-5" /> },
];

export function NodeSidebar() {
  const { addNode, nodes } = useWorkflowStore();

  const handleAddNode = (type: NodeType) => {
    const nodeConfig = NODE_TYPES[type];
    const newNode: any = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: nodeConfig.label,
        type,
      },
    };

    // Add default values based on type
    switch (type) {
      case 'text':
        newNode.data.value = '';
        break;
      case 'llm':
        newNode.data.prompt = '';
        newNode.data.model = 'gemini-pro';
        newNode.data.temperature = 0.7;
        newNode.data.maxTokens = 1024;
        break;
      case 'cropImage':
        newNode.data.x = 0;
        newNode.data.y = 0;
        newNode.data.width = 100;
        newNode.data.height = 100;
        break;
      case 'extractFrame':
        newNode.data.timestamp = 0;
        break;
    }

    addNode(newNode);
  };

  return (
    <div className="h-full w-64 border-r border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-50">Nodes</h2>
        <p className="text-sm text-zinc-400">Drag to add to canvas</p>
      </div>

      <div className="space-y-2">
        {nodeTypes.map(({ type, icon }) => {
          const config = NODE_TYPES[type];
          return (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border border-zinc-800 p-3 text-left transition-all hover:border-zinc-700 hover:bg-zinc-800'
              )}
            >
              <div
                className="rounded p-2"
                style={{
                  backgroundColor: `${config.color}20`,
                  color: config.color,
                }}
              >
                {icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-50">{config.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
