'use client';

import * as React from 'react';
import { NodeProps } from 'reactflow';
import { MoreVertical, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowNodeData, NodeStatus } from '@/types/nodes';
import { useWorkflowStore } from '@/lib/store';

interface BaseNodeProps {
  children: React.ReactNode;
  color: string;
  icon: React.ReactNode;
  data: WorkflowNodeData;
  id: string;
  selected?: boolean;
}

const statusColors: Record<NodeStatus, string> = {
  pending: 'border-zinc-700',
  running: 'border-blue-500 animate-pulse',
  success: 'border-green-500',
  failed: 'border-red-500',
  skipped: 'border-zinc-600',
};

export function BaseNode({ children, color, icon, data, id, selected }: BaseNodeProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { deleteNode, duplicateNode, setSelectedNodeForEdit } = useWorkflowStore();
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusColor = data.status ? statusColors[data.status] : statusColors.pending;

  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-zinc-900 shadow-lg transition-all',
        selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950' : '',
        statusColor
      )}
      style={{ width: 280 }}
      onClick={() => setSelectedNodeForEdit(id)}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between rounded-t-lg px-3 py-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <div className="flex items-center gap-2">
          <div className="rounded p-1" style={{ backgroundColor: `${color}30`, color }}>
            {icon}
          </div>
          <span className="text-sm font-medium text-zinc-50">{data.label}</span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border border-zinc-700 bg-zinc-900 shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateNode(id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">{children}</div>
    </div>
  );
}
