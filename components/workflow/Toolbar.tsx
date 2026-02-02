'use client';

import { Play, Save, Download, History, Maximize, Minimize } from 'lucide-react';
import { useWorkflowStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { executeWorkflow } from '@/lib/execution-engine';

export function Toolbar() {
  const {
    workflow,
    nodes,
    edges,
    isExecuting,
    setIsExecuting,
    setHistorySidebarOpen,
    historySidebarOpen,
    addExecution,
    updateExecution,
    updateNode,
  } = useWorkflowStore();
  
  const [saving, setSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!workflow) return;

    const autoSaveInterval = setInterval(() => {
      if (nodes.length > 0 && !isExecuting) {
        fetch(`/api/workflows/${workflow.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges }),
        }).catch(err => console.error('Auto-save failed:', err));
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [workflow, nodes, edges, isExecuting]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handleSave = async () => {
    if (!workflow) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) throw new Error('Failed to save');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    if (!workflow || isExecuting || nodes.length === 0) return;

    setIsExecuting(true);
    
    nodes.forEach(node => {
      updateNode(node.id, { status: 'pending', output: undefined });
    });

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const execution = {
      id: executionId,
      workflowId: workflow.id,
      status: 'running' as const,
      scope: 'full' as const,
      nodeResults: [],
      startedAt: new Date().toISOString(),
    };

    addExecution(execution);
    setHistorySidebarOpen(true);

    console.log('Started execution:', executionId);

    try {
      const updateNodeStatus = (nodeId: string, status: 'running' | 'success' | 'failed') => {
        updateNode(nodeId, { status });
      };

      const result = await executeWorkflow(
        { nodes, edges },
        updateNodeStatus
      );

      console.log('Execution completed:', result.nodeResults.length, 'nodes');

      result.nodeResults.forEach(nodeResult => {
        if (nodeResult.outputs?.result && nodeResult.nodeType === 'llm') {
          updateNode(nodeResult.nodeId, { output: String(nodeResult.outputs.result) });
        }
      });
      
      const duration = Date.now() - new Date(execution.startedAt).getTime();
      
      console.log('Updating execution to SUCCESS, duration:', duration);
      
      updateExecution(executionId, {
        status: 'success',
        nodeResults: result.nodeResults,
        completedAt: new Date().toISOString(),
        duration,
      });
    } catch (error: any) {
      console.error('Execution failed:', error);
      
      updateExecution(executionId, {
        status: 'failed',
        errorMessage: error.message,
        completedAt: new Date().toISOString(),
      });
      
      nodes.forEach(node => {
        updateNode(node.id, { status: 'failed' });
      });
    } finally {
      setIsExecuting(false);
      console.log('Execution finished');
    }
  };

  const handleExport = () => {
    if (!workflow) return;

    const data = {
      name: workflow.name,
      nodes,
      edges,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-zinc-50">
          {workflow?.name || 'Untitled Workflow'}
        </h1>
        <span className="text-xs text-zinc-500">
          {nodes.length} nodes
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
        >
          <History className="mr-2 h-4 w-4" />
          History
        </Button>

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </Button>

        <Button
          size="sm"
          onClick={handleRun}
          disabled={isExecuting || nodes.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="mr-2 h-4 w-4" />
          {isExecuting ? 'Running...' : 'Run'}
        </Button>
      </div>
    </div>
  );
}