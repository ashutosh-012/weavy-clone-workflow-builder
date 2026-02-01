'use client';

import { X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useWorkflowStore } from '@/lib/store';
import { ExecutionStatus } from '@/types/execution';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  ExecutionStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: 'text-zinc-400',
    label: 'Pending',
  },
  running: {
    icon: <Clock className="h-4 w-4 animate-spin" />,
    color: 'text-blue-400',
    label: 'Running',
  },
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-400',
    label: 'Success',
  },
  failed: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-400',
    label: 'Failed',
  },
  partial: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-yellow-400',
    label: 'Partial',
  },
};

export function HistorySidebar() {
  const { executions, historySidebarOpen, setHistorySidebarOpen } = useWorkflowStore();

  if (!historySidebarOpen) return null;

  return (
    <div className="flex h-full w-80 flex-col border-l border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <h2 className="text-lg font-semibold text-zinc-50">Execution History</h2>
        <button
          onClick={() => setHistorySidebarOpen(false)}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {executions.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-zinc-500">No executions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {executions.map((execution, index) => {
              const status = statusConfig[execution.status];
              const date = new Date(execution.startedAt);
              const uniqueKey = `${execution.id}-${index}`;

              return (
                <div
                  key={uniqueKey}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn('flex items-center gap-2', status.color)}>
                      {status.icon}
                      <span className="text-sm font-medium">{status.label}</span>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {date.toLocaleTimeString()}
                    </span>
                  </div>

                  {execution.status === 'running' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-400">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                      <span>Executing...</span>
                    </div>
                  )}

                  <div className="mt-2 space-y-1 text-xs text-zinc-400">
                    <p>Nodes: {execution.nodeResults.length} executed</p>
                    {execution.duration && (
                      <p>Duration: {(execution.duration / 1000).toFixed(2)}s</p>
                    )}
                    {execution.errorMessage && (
                      <p className="text-red-400">{execution.errorMessage}</p>
                    )}
                  </div>

                  {execution.nodeResults.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {execution.nodeResults.slice(0, 3).map((result, resultIndex) => (
                        <div key={`${uniqueKey}-result-${resultIndex}`} className="flex items-center gap-2 text-xs">
                          <div
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              result.status === 'success' && 'bg-green-400',
                              result.status === 'failed' && 'bg-red-400',
                              result.status === 'running' && 'bg-blue-400 animate-pulse',
                              result.status === 'pending' && 'bg-zinc-400'
                            )}
                          />
                          <span className="flex-1 truncate text-zinc-400">{result.nodeName}</span>
                          {result.duration && (
                            <span className="text-zinc-600">{result.duration}ms</span>
                          )}
                        </div>
                      ))}
                      {execution.nodeResults.length > 3 && (
                        <p className="text-xs text-zinc-500">
                          +{execution.nodeResults.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}