export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

export const NODE_TYPES = {
  text: {
    type: 'text',
    label: 'Text Input',
    color: '#3b82f6',
    description: 'Static text input',
  },
  imageUpload: {
    type: 'imageUpload',
    label: 'Image Upload',
    color: '#22c55e',
    description: 'Upload and process images',
  },
  videoUpload: {
    type: 'videoUpload',
    label: 'Video Upload',
    color: '#a855f7',
    description: 'Upload and process videos',
  },
  llm: {
    type: 'llm',
    label: 'Run LLM',
    color: '#eab308',
    description: 'Execute AI language model',
  },
  cropImage: {
    type: 'cropImage',
    label: 'Crop Image',
    color: '#f97316',
    description: 'Crop image to dimensions',
  },
  extractFrame: {
    type: 'extractFrame',
    label: 'Extract Frame',
    color: '#ec4899',
    description: 'Extract frame from video',
  },
};

export const DEFAULT_NODE_DATA = {
  text: {
    value: '',
  },
  imageUpload: {
    imageUrl: null,
  },
  videoUpload: {
    videoUrl: null,
  },
  llm: {
    model: 'gemini-2.5-flash',
    prompt: '',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 1024,
  },
  cropImage: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  extractFrame: {
    timestamp: 0,
  },
};