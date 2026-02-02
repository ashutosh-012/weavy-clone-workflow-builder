import { pgTable, text, timestamp, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull().default('Untitled Workflow'),
  description: text('description'),
  nodes: jsonb('nodes').notNull().default([]),
  edges: jsonb('edges').notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const executions = pgTable('executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  status: text('status').notNull().default('pending'),
  scope: text('scope').notNull().default('full'),
  nodeResults: jsonb('node_results').notNull().default([]),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'),
});

export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type Execution = typeof executions.$inferSelect;
export type NewExecution = typeof executions.$inferInsert;