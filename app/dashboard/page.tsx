'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Plus, 
  Workflow, 
  Trash2, 
  Clock, 
  MoreVertical,
  Search,
  FolderOpen,
  Loader2
} from 'lucide-react';

interface WorkflowItem {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch workflows
  useEffect(() => {
    if (isLoaded && user) {
      fetchWorkflows();
    }
  }, [isLoaded, user]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workflows');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async () => {
    try {
      setCreating(true);
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Untitled Workflow',
          description: '' 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/workflow/${data.workflow.id}`);
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
    } finally {
      setCreating(false);
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorkflows(workflows.filter(w => w.id !== id));
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  };

  const openWorkflow = (id: string) => {
    router.push(`/workflow/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredWorkflows = workflows.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading workflows...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FlowAI</h1>
                <p className="text-xs text-gray-500">Workflow Builder</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white">{user?.fullName || user?.firstName}</p>
                <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <img
                src={user?.imageUrl || '/default-avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-purple-500/30"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title & Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">My Workflows</h2>
            <p className="text-gray-500 mt-1">
              {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={createWorkflow}
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 
                     text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg shadow-purple-500/25"
          >
            {creating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            New Workflow
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#12121a] border border-gray-800 rounded-xl
                     text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50
                     transition-colors"
          />
        </div>

        {/* Workflows Grid */}
        {filteredWorkflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-[#12121a] rounded-2xl flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No workflows found' : 'No workflows yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try a different search term' 
                : 'Create your first workflow to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={createWorkflow}
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white 
                         rounded-xl font-medium hover:bg-purple-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Workflow
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="group bg-[#12121a] border border-gray-800 rounded-xl p-5
                         hover:border-purple-500/30 transition-all duration-200 cursor-pointer"
                onClick={() => openWorkflow(workflow.id)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                                rounded-xl flex items-center justify-center">
                    <Workflow className="w-6 h-6 text-purple-400" />
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(workflow.id);
                      setShowDeleteModal(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 
                             rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                {/* Card Content */}
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                  {workflow.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {workflow.description || 'No description'}
                </p>

                {/* Card Footer */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated {formatDate(workflow.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">Delete Workflow?</h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. All nodes and execution history will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-xl 
                         font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteWorkflow(deleteId)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl 
                         font-medium hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}