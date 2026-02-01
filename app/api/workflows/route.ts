import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { workflowCreateSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: workflows, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ workflows });
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = workflowCreateSchema.parse(body);

    const { data: workflow, error } = await supabase
      .from('workflows')
      .insert({
        name: validated.name || 'Untitled Workflow',
        description: validated.description,
        nodes: validated.nodes || [],
        edges: validated.edges || [],
        viewport: validated.viewport,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}
