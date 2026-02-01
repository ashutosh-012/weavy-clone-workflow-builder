import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { executeWorkflow } from '@/lib/execution-engine';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workflowId, scope = 'full', nodes = [], edges = [] } = body;

    const execution = {
      id: `exec-${Date.now()}`,
      workflowId,
      status: 'running' as const,
      scope,
      nodeResults: [],
      startedAt: new Date().toISOString(),
    };

    try {
      const result = await executeWorkflow({ nodes, edges });
      
      return NextResponse.json({
        execution: {
          ...execution,
          status: 'success' as const,
          nodeResults: result.nodeResults,
          completedAt: new Date().toISOString(),
          duration: Date.now() - new Date(execution.startedAt).getTime(),
        },
      });
    } catch (error: any) {
      return NextResponse.json({
        execution: {
          ...execution,
          status: 'failed' as const,
          errorMessage: error.message,
          completedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
  }
}