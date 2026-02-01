'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Workflow } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchWorkflows();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/sign-in');
    }
  };

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled Workflow' }),
      });

      if (response.ok) {
        const { workflow } = await response.json();
        router.push(`/workflows/${workflow.id}`);
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      setWorkflows(workflows.filter((w) => w.id !== id));
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-zinc-950 p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-zinc-950 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">My Workflows</h1>
            <p className="mt-1 text-zinc-400">
              Create and manage your workflow automations
            </p>
          </div>
          <Button onClick={handleCreateWorkflow}>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>

        {workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-800 py-24">
            <h3 className="mb-2 text-lg font-medium text-zinc-50">
              No workflows yet
            </h3>
            <p className="mb-4 text-sm text-zinc-400">
              Get started by creating your first workflow
            </p>
            <Button onClick={handleCreateWorkflow}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="group relative rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-zinc-700"
              >
                <button
                  onClick={() => router.push(`/workflows/${workflow.id}`)}
                  className="w-full text-left"
                >
                  <h3 className="mb-2 text-lg font-semibold text-zinc-50">
                    {workflow.name}
                  </h3>
                  {workflow.description && (
                    <p className="mb-4 text-sm text-zinc-400">
                      {workflow.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(workflow.updatedAt).toLocaleDateString()}
                    </span>
                    <span>{workflow.nodes.length} nodes</span>
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWorkflow(workflow.id);
                  }}
                  className="absolute right-4 top-4 rounded p-1 text-zinc-500 opacity-0 transition-opacity hover:bg-zinc-800 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
