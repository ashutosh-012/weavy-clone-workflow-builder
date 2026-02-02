'use client'

import { useRouter } from 'next/navigation'
import { useWorkflowStore } from '@/lib/store'
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Loader2, 
  Clock,
  Check
} from 'lucide-react'
import { useState } from 'react'

interface ToolbarProps {
  saving?: boolean
  lastSaved?: Date | null
  onSave?: () => void
}

export function Toolbar({ saving = false, lastSaved, onSave }: ToolbarProps) {
  const router = useRouter()
  const { workflow, setWorkflow } = useWorkflowStore()
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')

  const formatLastSaved = (date: Date | null) => {
    if (!date) return ''
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleNameClick = () => {
    setTempName(workflow?.name || 'Untitled Workflow')
    setIsEditing(true)
  }

  const handleNameSave = () => {
    if (workflow && tempName.trim()) {
      setWorkflow({ ...workflow, name: tempName.trim() })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return (
    <header className="h-14 border-b border-gray-800 bg-[#0d0d14] flex items-center justify-between px-4 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>

        {/* Workflow Name */}
        {isEditing ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-purple-500 
                     focus:outline-none text-sm font-medium min-w-[200px]"
          />
        ) : (
          <button
            onClick={handleNameClick}
            className="text-white font-medium hover:text-purple-400 transition-colors"
          >
            {workflow?.name || 'Untitled Workflow'}
          </button>
        )}

        {/* Save Status */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span>Saved {formatLastSaved(lastSaved)}</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Manual Save Button */}
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg
                   font-medium hover:bg-gray-700 transition-colors disabled:opacity-50
                   text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>

        {/* Run Button */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600
                   text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 
                   transition-all duration-200 shadow-lg shadow-purple-500/25 text-sm"
        >
          <Play className="w-4 h-4" />
          Run All
        </button>
      </div>
    </header>
  )
}