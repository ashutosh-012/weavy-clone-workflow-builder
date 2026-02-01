'use client'

import { useEffect } from 'react'
import { useParams, redirect } from 'next/navigation'
import { ReactFlowProvider } from 'reactflow'
import { useWorkflowStore } from '@/lib/store'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { Toolbar } from '@/components/workflow/Toolbar'
import { NodeSidebar } from '@/components/workflow/NodeSidebar'
import { HistorySidebar } from '@/components/workflow/HistorySidebar'
import { Skeleton } from '@/components/ui/skeleton'

export default function WorkflowPage() {
  const params = useParams()
  const { setWorkflow, setNodes, setEdges, workflow } = useWorkflowStore()

  useEffect(() => {
    if (params.id) {
      fetchWorkflow(params.id as string)
    }

    return () => {
      useWorkflowStore.getState().reset()
    }
  }, [params.id])

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  const fetchWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/workflows/${id}`)
      if (!response.ok) throw new Error('Failed to fetch workflow')

      const data = await response.json()
      setWorkflow(data.workflow)
      setNodes(data.workflow.nodes)
      setEdges(data.workflow.edges)
    } catch (error) {
      console.error('Failed to fetch workflow:', error)
      redirect('/dashboard')
    }
  }

  if (!workflow) {
    return (
      <div className="flex h-full">
        <Skeleton className="h-full w-64" />
        <div className="flex-1">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  return (
    <ReactFlowProvider>
      <div className="fixed inset-0 flex flex-col">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <NodeSidebar />
          <div className="relative flex-1">
            <WorkflowCanvas />
          </div>
          <HistorySidebar />
        </div>
      </div>
    </ReactFlowProvider>
  )
}