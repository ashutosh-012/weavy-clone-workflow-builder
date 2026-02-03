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

    const startedAt = new Date()

    try {
      const result = await executeWorkflow({ nodes, edges })

      const executionData = {
        id: `exec-${Date.now()}`,
        workflowId,
        userId,
        status: 'success' as const,
        scope,
        nodeResults: result.nodeResults,
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
      }

      await db.insert(executions).values(executionData)

      return NextResponse.json({ execution: executionData })
    } catch (error: any) {
      const executionData = {
        id: `exec-${Date.now()}`,
        workflowId,
        userId,
        status: 'failed' as const,
        scope,
        nodeResults: [],
        errorMessage: error.message,
        startedAt,
        completedAt: new Date(),
        duration: Date.now() - startedAt.getTime(),
      }

      await db.insert(executions).values(executionData)

      return NextResponse.json({ execution: executionData })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 })
  }
}