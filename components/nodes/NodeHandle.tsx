'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

interface NodeHandleProps {
  type: 'source' | 'target';
  color?: string;
  id?: string;
  className?: string;
}

export function NodeHandle({ type, color, id, className }: NodeHandleProps) {
  return (
    <Handle
      type={type}
      position={type === 'source' ? Position.Right : Position.Left}
      id={id}
      className={cn(
        'h-3 w-3 border-2 border-zinc-900',
        className
      )}
      style={{ backgroundColor: color || '#3b82f6' }}
    />
  );
}
