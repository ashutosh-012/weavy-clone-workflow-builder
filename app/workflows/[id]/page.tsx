'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ReactFlowProvider } from 'reactflow'
import { useWorkflowStore } from '@/lib/store'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { Toolbar } from '@/components/workflow/Toolbar'
import { NodeSidebar } from '@/components/workflow/NodeSidebar'
import { HistorySidebar } from '@/components/workflow/HistorySidebar'
import { Loader2 } from 'lucide-react'

export default function WorkflowPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  const { 
    setWorkflow, 
    setNodes, 
    setEdges, 
    workflow,
    nodes,
    edges,
    reset 
  } = useWorkflowStore()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch workflow from database
  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId)
    }

    return () => {
      reset()
    }
  }, [workflowId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveWorkflow()
      }
      
      // Ctrl/Cmd + Enter to run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        // TODO: Run workflow
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [nodes, edges, workflow])

  // Auto-save when nodes or edges change
  useEffect(() => {
    if (!loading && workflow && (nodes.length > 0 || edges.length > 0)) {
      const timer = setTimeout(() => {
        saveWorkflow()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [nodes, edges, loading, workflow])

  const fetchWorkflow = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/workflows/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/dashboard')
          return
        }
        throw new Error('Failed to fetch workflow')
      }

      const data = await response.json()
      const workflowData = data.workflow

      setWorkflow(workflowData)
      
      // Parse nodes and edges (handle both array and JSON string)
      const parsedNodes = Array.isArray(workflowData.nodes) 
        ? workflowData.nodes 
        : JSON.parse(workflowData.nodes || '[]')
      
      const parsedEdges = Array.isArray(workflowData.edges) 
        ? workflowData.edges 
        : JSON.parse(workflowData.edges || '[]')

      setNodes(parsedNodes)
      setEdges(parsedEdges)
      setLastSaved(new Date(workflowData.updatedAt))

    } catch (error) {
      console.error('Failed to fetch workflow:', error)
      setError('Failed to load workflow')
    } finally {
      setLoading(false)
    }
  }

  const saveWorkflow = useCallback(async () => {
    if (!workflowId || !workflow) return

    try {
      setSaving(true)

      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflow.name,
          description: workflow.description,
          nodes: nodes,
          edges: edges,
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
        console.log('✅ Workflow saved')
      } else {
        console.error('Failed to save workflow')
      }
    } catch (error) {
      console.error('Failed to save workflow:', error)
    } finally {
      setSaving(false)
    }
  }, [workflowId, workflow, nodes, edges])

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-gray-400">Loading workflow...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // No workflow found
  if (!workflow) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-gray-400">Workflow not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <ReactFlowProvider>
      <div className="fixed inset-0 flex flex-col bg-[#0a0a0f]">
        {/* Toolbar with save status */}
        <Toolbar 
          saving={saving} 
          lastSaved={lastSaved} 
          onSave={saveWorkflow}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Node Types */}
          <NodeSidebar />
          
          {/* Main Canvas */}
          <div className="relative flex-1">
            <WorkflowCanvas />
          </div>
          
          {/* Right Sidebar - History */}
          <HistorySidebar workflowId={workflowId} />
        </div>
      </div>
    </ReactFlowProvider>
  )
}