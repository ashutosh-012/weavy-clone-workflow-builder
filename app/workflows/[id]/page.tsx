'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ReactFlowProvider } from 'reactflow'
import { useWorkflowStore } from '@/lib/store'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { Toolbar } from '@/components/workflow/Toolbar'
import { NodeSidebar } from '@/components/workflow/NodeSidebar'
import { HistorySidebar } from '@/components/workflow/HistorySidebar'

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
    reset,
  } = useWorkflowStore()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
        throw new Error()
      }

      const data = await response.json()
      const workflowData = data.workflow

      setWorkflow(workflowData)

      const parsedNodes = Array.isArray(workflowData.nodes)
        ? workflowData.nodes
        : JSON.parse(workflowData.nodes || '[]')

      const parsedEdges = Array.isArray(workflowData.edges)
        ? workflowData.edges
        : JSON.parse(workflowData.edges || '[]')

      setNodes(parsedNodes)
      setEdges(parsedEdges)
      setLastSaved(new Date(workflowData.updatedAt))
    } catch {
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
          nodes,
          edges,
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
      }
    } finally {
      setSaving(false)
    }
  }, [workflowId, workflow, nodes, edges])

  const runWorkflow = useCallback(async () => {
    if (!workflowId || !workflow) return

    await saveWorkflow()

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          scope: 'full',
          nodes,
          edges,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Execution result:', data)
        setRefreshHistory((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Run workflow error:', error)
    }
  }, [workflowId, workflow, nodes, edges, saveWorkflow])

  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId)
    }

    return () => {
      reset()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [workflowId])

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveWorkflow()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runWorkflow()
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [saveWorkflow, runWorkflow])

  useEffect(() => {
    if (loading || !workflow || !workflowId) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveWorkflow()
    }, 30000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [nodes, edges])

  if (loading || error || !workflow) {
    return <div className="fixed inset-0 bg-[#0a0a0f]" />
  }

  return (
    <ReactFlowProvider>
      <div className="fixed inset-0 flex flex-col bg-[#0a0a0f]">
        <Toolbar
          saving={saving}
          lastSaved={lastSaved}
          onSave={saveWorkflow}
          onRun={runWorkflow}
        />
        <div className="flex flex-1 overflow-hidden">
          <NodeSidebar />
          <div className="relative flex-1">
            <WorkflowCanvas />
          </div>
          <HistorySidebar workflowId={workflowId} refreshTrigger={refreshHistory} />
        </div>
      </div>
    </ReactFlowProvider>
  )
}