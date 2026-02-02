'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight
} from 'lucide-react';

interface Execution {
  id: string;
  status: string;
  scope: string;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
}

interface RightSidebarProps {
  workflowId: string;
}

export default function RightSidebar({ workflowId }: RightSidebarProps) {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workflowId) {
      fetchExecutions();
    }
  }, [workflowId]);

  const fetchExecutions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workflows/${workflowId}/executions`);
      if (response.ok) {
        const data = await response.json();
        setExecutions(data.executions || []);
      }
    } catch (error) {
      console.error('Failed to fetch executions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'full':
        return 'Full Workflow';
      case 'partial':
        return 'Selected Nodes';
      case 'single':
        return 'Single Node';
      default:
        return scope;
    }
  };

  return (
    <div className="w-72 border-l border-gray-800 bg-[#0d0d14] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          <h2 className="text-white font-semibold">Workflow History</h2>
        </div>
      </div>

      {/* Executions List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        ) : executions.length === 0 ? (
          <div className="p-4 text-center">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">No executions yet</p>
            <p className="text-gray-600 text-xs mt-1">
              Run your workflow to see history
            </p>
          </div>
        ) : (
          <div className="p-2">
            {executions.map((execution) => (
              <button
                key={execution.id}
                className="w-full p-3 rounded-lg hover:bg-gray-800/50 transition-colors
                         text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(execution.status)}
                    <div>
                      <p className="text-white text-sm font-medium">
                        {getScopeLabel(execution.scope)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDate(execution.startedAt)} at {formatTime(execution.startedAt)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>

                {execution.duration && (
                  <div className="mt-2 text-xs text-gray-500">
                    Duration: {(execution.duration / 1000).toFixed(1)}s
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}