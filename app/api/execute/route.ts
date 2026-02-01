import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ExecutionEngine } from '@/lib/execution-engine';
import { executionCreateSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = executionCreateSchema.parse(body);

    // Fetch the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', validated.workflowId)
      .eq('user_id', user.id)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Create execution record
    const { data: execution, error: executionError } = await supabase
      .from('executions')
      .insert({
        workflow_id: workflow.id,
        status: 'running',
        scope: validated.scope || 'full',
        node_results: [],
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (executionError) throw executionError;

    // Execute the workflow
    try {
      const engine = new ExecutionEngine(workflow.nodes, workflow.edges);
      const results =
        validated.scope === 'selected' && validated.selectedNodeIds
          ? await engine.executeSelected(validated.selectedNodeIds)
          : await engine.execute();

      // Update execution with results
      const completedAt = new Date().toISOString();
      const duration =
        new Date(completedAt).getTime() -
        new Date(execution.started_at).getTime();

      const hasFailures = results.some((r) => r.status === 'failed');
      const allSuccess = results.every((r) => r.status === 'success');

      const { data: updatedExecution, error: updateError } = await supabase
        .from('executions')
        .update({
          status: allSuccess ? 'success' : hasFailures ? 'partial' : 'success',
          node_results: results,
          completed_at: completedAt,
          duration,
        })
        .eq('id', execution.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Save individual node results
      const nodeResultsToInsert = results.map((result) => ({
        execution_id: execution.id,
        node_id: result.nodeId,
        node_name: result.nodeName,
        node_type: result.nodeType,
        status: result.status,
        inputs: result.inputs,
        outputs: result.outputs,
        error_message: result.errorMessage,
        started_at: result.startedAt,
        completed_at: result.completedAt,
        duration: result.duration,
      }));

      await supabase.from('node_results').insert(nodeResultsToInsert);

      return NextResponse.json({ execution: updatedExecution });
    } catch (execError) {
      // Update execution with error
      await supabase
        .from('executions')
        .update({
          status: 'failed',
          error_message:
            execError instanceof Error
              ? execError.message
              : 'Unknown error',
          completed_at: new Date().toISOString(),
        })
        .eq('id', execution.id);

      throw execError;
    }
  } catch (error) {
    console.error('Execution error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Execution failed',
      },
      { status: 500 }
    );
  }
}
