/*
  # Create Workflow Builder Database Schema

  ## Tables Created
  
  1. **users**
    - `id` (uuid, primary key)
    - `email` (text, unique)
    - `name` (text, optional)
    - `image_url` (text, optional)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  2. **workflows**
    - `id` (uuid, primary key)
    - `name` (text)
    - `description` (text, optional)
    - `nodes` (jsonb) - stores node configuration
    - `edges` (jsonb) - stores edge configuration
    - `viewport` (jsonb, optional) - stores canvas viewport state
    - `user_id` (uuid, foreign key to users)
    - `is_public` (boolean)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  3. **executions**
    - `id` (uuid, primary key)
    - `workflow_id` (uuid, foreign key to workflows)
    - `status` (text) - pending, running, success, failed, partial
    - `scope` (text) - full, selected, single
    - `node_results` (jsonb)
    - `error_message` (text, optional)
    - `started_at` (timestamptz)
    - `completed_at` (timestamptz, optional)
    - `duration` (integer, optional) - in milliseconds
  
  4. **node_results**
    - `id` (uuid, primary key)
    - `execution_id` (uuid, foreign key to executions)
    - `node_id` (text)
    - `node_name` (text)
    - `node_type` (text)
    - `status` (text) - pending, running, success, failed, skipped
    - `inputs` (jsonb, optional)
    - `outputs` (jsonb, optional)
    - `error_message` (text, optional)
    - `started_at` (timestamptz, optional)
    - `completed_at` (timestamptz, optional)
    - `duration` (integer, optional) - in milliseconds

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT 'Untitled Workflow' NOT NULL,
  description text,
  nodes jsonb DEFAULT '[]'::jsonb NOT NULL,
  edges jsonb DEFAULT '[]'::jsonb NOT NULL,
  viewport jsonb,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create executions table
CREATE TABLE IF NOT EXISTS executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' NOT NULL,
  scope text DEFAULT 'full' NOT NULL,
  node_results jsonb DEFAULT '[]'::jsonb NOT NULL,
  error_message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  duration integer
);

-- Create node_results table
CREATE TABLE IF NOT EXISTS node_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id uuid NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  node_id text NOT NULL,
  node_name text NOT NULL,
  node_type text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  inputs jsonb,
  outputs jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  duration integer
);

-- Create indexes
CREATE INDEX IF NOT EXISTS workflows_user_id_idx ON workflows(user_id);
CREATE INDEX IF NOT EXISTS executions_workflow_id_idx ON executions(workflow_id);
CREATE INDEX IF NOT EXISTS node_results_execution_id_idx ON node_results(execution_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_results ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Workflows policies
CREATE POLICY "Users can view own workflows"
  ON workflows FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own workflows"
  ON workflows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows"
  ON workflows FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows"
  ON workflows FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Executions policies
CREATE POLICY "Users can view own executions"
  ON executions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = executions.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own executions"
  ON executions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = executions.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own executions"
  ON executions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = executions.workflow_id
      AND workflows.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = executions.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

-- Node results policies
CREATE POLICY "Users can view own node results"
  ON node_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM executions
      JOIN workflows ON workflows.id = executions.workflow_id
      WHERE executions.id = node_results.execution_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own node results"
  ON node_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM executions
      JOIN workflows ON workflows.id = executions.workflow_id
      WHERE executions.id = node_results.execution_id
      AND workflows.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();