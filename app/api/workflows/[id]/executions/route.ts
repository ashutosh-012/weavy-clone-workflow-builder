import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { executions, workflows } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [workflow] = await db
      .select()
      .from(workflows)
      .where(and(eq(workflows.id, id), eq(workflows.userId, userId)));

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const workflowExecutions = await db
      .select()
      .from(executions)
      .where(eq(executions.workflowId, id))
      .orderBy(desc(executions.startedAt))
      .limit(50);

    return NextResponse.json({ executions: workflowExecutions });
  } catch (error) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const [execution] = await db
      .insert(executions)
      .values({
        workflowId: id,
        userId,
        status: body.status || 'running',
        scope: body.scope || 'full',
        nodeResults: body.nodeResults || [],
        errorMessage: body.errorMessage,
        startedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ execution }, { status: 201 });
  } catch (error) {
    console.error('Error creating execution:', error);
    return NextResponse.json(
      { error: 'Failed to create execution' },
      { status: 500 }
    );
  }
}