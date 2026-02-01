'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleNewWorkflow = async () => {
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

  return (
    <header className="border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xl font-bold text-zinc-50"
          >
            WorkflowAI
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleNewWorkflow} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
