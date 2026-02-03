import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { executeWorkflow } from '@/lib/execution-engine'
import { db } from '@/lib/db'
import { executions } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workflowId, scope = 'full', nodes = [], edges = [] } = body

    if (!workflowId) {
      return NextResponse.json({ error: 'Workflow ID required' }, { status: 400 })
    }

    const startedAt = new Date()

    try {
      const result = await executeWorkflow({ nodes, edges })

      const hasFailures = result.nodeResults.some((r) => r.status === 'failed')

      const [execution] = await db
        .insert(executions)
        .values({
          workflowId,
          userId,
          status: hasFailures ? 'failed' : 'success',
          scope,
          nodeResults: result.nodeResults,
          startedAt,
          completedAt: new Date(),
          duration: Date.now() - startedAt.getTime(),
        })
        .returning()

      return NextResponse.json({ execution })
    } catch (error: any) {
      console.error('Execution error:', error)

      const [execution] = await db
        .insert(executions)
        .values({
          workflowId,
          userId,
          status: 'failed',
          scope,
          nodeResults: [],
          errorMessage: error.message,
          startedAt,
          completedAt: new Date(),
          duration: Date.now() - startedAt.getTime(),
        })
        .returning()

      return NextResponse.json({ execution })
    }
  } catch (error: any) {
    console.error('Execute API error:', error)
    return NextResponse.json({ error: error.message || 'Execution failed' }, { status: 500 })
  }
}