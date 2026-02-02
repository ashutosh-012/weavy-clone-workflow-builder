'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Loader2, 
  Check,
  Clock
} from 'lucide-react';

interface WorkflowHeaderProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  lastSaved: Date | null;
}

export default function WorkflowHeader({
  workflowName,
  setWorkflowName,
  onSave,
  saving,
  lastSaved,
}: WorkflowHeaderProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <header className="h-14 border-b border-gray-800 bg-[#0d0d14] flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>

        {isEditing ? (
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            autoFocus
            className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-purple-500 
                     focus:outline-none text-sm font-medium"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-white font-medium hover:text-purple-400 transition-colors"
          >
            {workflowName}
          </button>
        )}

        {lastSaved && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Saved {formatLastSaved(lastSaved)}</span>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg
                   font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600
                   text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 
                   transition-all duration-200 shadow-lg shadow-purple-500/25"
        >
          <Play className="w-4 h-4" />
          Run All
        </button>
      </div>
    </header>
  );
}