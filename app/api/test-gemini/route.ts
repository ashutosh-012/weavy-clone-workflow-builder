import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const hasKey = !!process.env.GOOGLE_AI_API_KEY;
  const keyPreview = process.env.GOOGLE_AI_API_KEY 
    ? process.env.GOOGLE_AI_API_KEY.substring(0, 10) + '...'
    : 'NOT SET';

  return NextResponse.json({
    hasKey,
    keyPreview,
    allEnvVars: Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('GEMINI'))
  });
}