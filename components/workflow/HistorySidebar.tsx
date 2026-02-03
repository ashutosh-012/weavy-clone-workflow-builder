'use client'

import { useState, useEffect } from 'react'
import {
  History,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  X,
} from 'lucide-react'

interface Execution {
  id: string
  status: string
  scope: string
  startedAt: string
  completedAt: string | null
  duration: number | null
  nodeResults: any[]
}

interface HistorySidebarProps {
  workflowId?: string
  refreshTrigger?: number
}

export function HistorySidebar({ workflowId, refreshTrigger }: HistorySidebarProps) {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (workflowId) {
      fetchExecutions()
    }
  }, [workflowId, refreshTrigger])

  const fetchExecutions = async () => {
    if (!workflowId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/workflows/${workflowId}/executions`)
      if (response.ok) {
        const data = await response.json()
        setExecutions(data.executions || [])
      }
    } catch (error) {
      console.error('Failed to fetch executions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'running':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'text-green-400'
      case 'failed':
      case 'error':
        return 'text-red-400'
      case 'running':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'full':
        return 'Full Run'
      case 'partial':
        return 'Partial Run'
      case 'single':
        return 'Single Node'
      default:
        return scope
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-[#0d0d14] border border-gray-800 rounded-l-lg hover:bg-gray-800 transition-colors"
      >
        <History className="w-5 h-5 text-gray-400" />
      </button>
    )
  }

  return (
    <div className="w-72 border-l border-gray-800 bg-[#0d0d14] flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          <h2 className="text-white font-semibold">History</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        ) : executions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-gray-800/50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <History className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No runs yet</p>
            <p className="text-gray-600 text-xs mt-1">Execute your workflow to see history</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {executions.map((execution) => (
              <div
                key={execution.id}
                className="w-full p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left border border-transparent hover:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(execution.status)}
                    <span className={`text-sm font-medium capitalize ${getStatusColor(execution.status)}`}>
                      {execution.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                    {getScopeLabel(execution.scope)}
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-1">
                  {formatDate(execution.startedAt)} at {formatTime(execution.startedAt)}
                </p>

                {execution.duration && (
                  <p className="text-xs text-gray-600">
                    Duration: {(execution.duration / 1000).toFixed(2)}s
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {executions.length > 0 && (
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={fetchExecutions}
            disabled={loading}
            className="w-full py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh History'}
          </button>
        </div>
      )}
    </div>
  )
}