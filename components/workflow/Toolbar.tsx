'use client';

import { Play, Save, Download, Upload, History, Settings } from 'lucide-react';
import { useWorkflowStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Toolbar() {
  const {
    workflow,
    nodes,
    edges,
    isExecuting,
    setIsExecuting,
    setHistorySidebarOpen,
    historySidebarOpen,
  } = useWorkflowStore();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!workflow) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes,
          edges,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    if (!workflow || isExecuting) return;

    setIsExecuting(true);
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: workflow.id,
          scope: 'full',
        }),
      });

      if (!response.ok) throw new Error('Execution failed');

      const result = await response.json();
      setHistorySidebarOpen(true);
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      setIsExecuting(false);
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
    <div className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-zinc-50">
          {workflow?.name || 'Untitled Workflow'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
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
        >
          <Play className="mr-2 h-4 w-4" />
          {isExecuting ? 'Running...' : 'Run'}
        </Button>
      </div>
    </div>
  );
}
