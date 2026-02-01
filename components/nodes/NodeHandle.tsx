'use client';

import { Handle, Position } from 'reactflow';

interface NodeHandleProps {
  type: 'source' | 'target';
  position: Position;
  color: string;
  id: string;
  label?: string;
  style?: React.CSSProperties;
}

export function NodeHandle({ type, position, color, id, label, style }: NodeHandleProps) {
  return (
    <div className="relative" style={style}>
      {label && type === 'target' && (
        <span className="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-xs text-zinc-500">
          {label}
        </span>
      )}
      <Handle
        type={type}
        position={position}
        id={id}
        style={{
          background: color,
          width: 10,
          height: 10,
          border: '2px solid #18181b',
        }}
      />
      {label && type === 'source' && (
        <span className="absolute -right-2 top-1/2 translate-x-full -translate-y-1/2 text-xs text-zinc-500">
          {label}
        </span>
      )}
    </div>
  );
}