# WorkflowAI - Professional Workflow Builder

A production-ready Next.js 14 workflow builder application with visual node editing, AI integration, and real-time execution.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface powered by React Flow
- **Node Types**:
  - Text Input
  - Image Upload
  - Video Upload
  - LLM (Google Gemini)
  - Crop Image
  - Extract Frame
- **Real-time Execution**: Execute workflows with detailed tracking
- **Execution History**: View past runs and results
- **Authentication**: Secure user authentication with Supabase
- **Database**: PostgreSQL with Supabase for data persistence
- **State Management**: Zustand for efficient state management
- **Type Safety**: Full TypeScript support with Zod validation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Workflow Canvas**: React Flow
- **Validation**: Zod
- **AI**: Google Gemini API
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google AI API key

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Database Setup

The database is already configured with Supabase. The schema includes:
- `users` - User profiles
- `workflows` - Workflow definitions
- `executions` - Execution history
- `node_results` - Individual node execution results

All tables have Row Level Security (RLS) enabled for secure data access.

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Getting Your Credentials:

**Supabase:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing
3. Go to Settings > API
4. Copy the Project URL and anon/public key

**Google AI:**
1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key

### 4. Create Storage Bucket (Optional)

If you want to use file uploads:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket named `workflow-assets`
4. Set it to public

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── workflows/[id]/
│   ├── api/
│   │   ├── workflows/
│   │   ├── execute/
│   │   ├── llm/
│   │   └── upload/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   ├── workflow/
│   └── nodes/
├── lib/
│   ├── supabase.ts
│   ├── store.ts
│   ├── constants.ts
│   ├── validations.ts
│   └── execution-engine.ts
├── types/
│   ├── nodes.ts
│   ├── workflow.ts
│   └── execution.ts
└── hooks/
```

## Usage

### Creating a Workflow

1. Sign up or sign in to your account
2. Click "New Workflow" from the dashboard
3. Add nodes from the left sidebar
4. Connect nodes by dragging from output to input handles
5. Configure each node by clicking on it
6. Save your workflow

### Running a Workflow

1. Click the "Run" button in the toolbar
2. View real-time execution in the History sidebar
3. Inspect node results and outputs

### Node Types

**Text Node**: Outputs static text that can be used as input for other nodes

**Image Upload**: Upload and pass images to processing nodes

**Video Upload**: Upload videos for frame extraction

**LLM Node**: Process text with Google Gemini AI

**Crop Image**: Crop uploaded images with specified dimensions

**Extract Frame**: Extract frames from videos at specific timestamps

## API Routes

- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create new workflow
- `GET /api/workflows/[id]` - Get specific workflow
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete workflow
- `POST /api/execute` - Execute a workflow
- `POST /api/llm/generate` - Generate text with LLM
- `POST /api/upload` - Upload files

## Security

- All API routes require authentication
- Row Level Security (RLS) enabled on all database tables
- Users can only access their own workflows and executions
- File uploads are scoped to authenticated users

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js 14:
- Netlify
- Railway
- AWS
- Digital Ocean

## Troubleshooting

**Build Errors**: Ensure all environment variables are set correctly

**Authentication Issues**: Check Supabase URL and keys

**LLM Not Working**: Verify Google AI API key is valid

**File Upload Fails**: Ensure storage bucket is created and public

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
