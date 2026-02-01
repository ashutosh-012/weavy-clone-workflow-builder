import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="text-lg font-semibold text-zinc-50">FlowAI</span>
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400">Workflow Builder</span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}