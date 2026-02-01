import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflow = {
      id: params.id,
      name: 'My Workflow',
      description: 'Workflow description',
      userId,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ workflow });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflow' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { nodes, edges, name, description } = body;

    const updatedWorkflow = {
      id: params.id,
      name: name || 'My Workflow',
      description: description || '',
      userId,
      nodes: nodes || [],
      edges: edges || [],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ workflow: updatedWorkflow });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}