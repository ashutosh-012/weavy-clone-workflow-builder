import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mockWorkflows = [
      {
        id: '1',
        name: 'Sample Workflow',
        description: 'A sample workflow',
        userId,
        nodes: [],
        edges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ workflows: mockWorkflows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name = 'Untitled Workflow' } = body;

    const newWorkflow = {
      id: `workflow-${Date.now()}`,
      name,
      description: '',
      userId,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ workflow: newWorkflow });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}