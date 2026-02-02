import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { workflows } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userWorkflows = await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, userId))
      .orderBy(desc(workflows.updatedAt));

    return NextResponse.json({ workflows: userWorkflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    const [workflow] = await db
      .insert(workflows)
      .values({
        userId,
        name: name || 'Untitled Workflow',
        description: description || null,
        nodes: [],
        edges: [],
      })
      .returning();

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}