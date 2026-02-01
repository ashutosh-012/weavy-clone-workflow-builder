import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Workflow, Zap, Sparkles } from 'lucide-react'

export default async function HomePage() {
  const user = await currentUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
          <h1 className="text-xl font-bold text-zinc-50">FlowAI</h1>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-zinc-50">
            Build Powerful Workflows
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              With AI
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Create, automate, and execute complex workflows using our visual
            builder. Connect nodes, process data, and leverage AI capabilities.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3 text-blue-400">
              <Workflow className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-50">
              Visual Builder
            </h3>
            <p className="text-zinc-400">
              Drag and drop nodes to create complex workflows visually without
              writing code.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 inline-block rounded-lg bg-purple-500/10 p-3 text-purple-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-50">
              AI-Powered
            </h3>
            <p className="text-zinc-400">
              Integrate LLM nodes to process text, analyze images, and generate
              content.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 inline-block rounded-lg bg-green-500/10 p-3 text-green-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-50">
              Real-time Execution
            </h3>
            <p className="text-zinc-400">
              Execute workflows in real-time and track progress with detailed
              execution history.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}