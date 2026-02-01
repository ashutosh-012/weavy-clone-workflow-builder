import { z } from 'zod';

export const textNodeSchema = z.object({
  type: z.literal('text'),
  label: z.string().min(1),
  value: z.string().min(1, 'Text value is required'),
});

export const imageUploadNodeSchema = z.object({
  type: z.literal('imageUpload'),
  label: z.string().min(1),
  imageUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
});

export const videoUploadNodeSchema = z.object({
  type: z.literal('videoUpload'),
  label: z.string().min(1),
  videoUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  duration: z.number().optional(),
});

export const llmNodeSchema = z.object({
  type: z.literal('llm'),
  label: z.string().min(1),
  prompt: z.string().min(1, 'Prompt is required'),
  model: z.enum(['gemini-pro', 'gemini-pro-vision']),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(8192),
  output: z.string().optional(),
});

export const cropImageNodeSchema = z.object({
  type: z.literal('cropImage'),
  label: z.string().min(1),
  x: z.number().min(0),
  y: z.number().min(0),
  width: z.number().min(1),
  height: z.number().min(1),
  outputUrl: z.string().url().optional(),
});

export const extractFrameNodeSchema = z.object({
  type: z.literal('extractFrame'),
  label: z.string().min(1),
  timestamp: z.number().min(0),
  outputUrl: z.string().url().optional(),
});

export const workflowCreateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  nodes: z.array(z.any()).optional(),
  edges: z.array(z.any()).optional(),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number(),
  }).optional(),
});

export const workflowUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  nodes: z.array(z.any()).optional(),
  edges: z.array(z.any()).optional(),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number(),
  }).optional(),
  isPublic: z.boolean().optional(),
});

export const executionCreateSchema = z.object({
  workflowId: z.string().uuid(),
  scope: z.enum(['full', 'selected', 'single']).optional(),
  selectedNodeIds: z.array(z.string()).optional(),
});
