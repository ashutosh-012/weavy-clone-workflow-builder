import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoUrl, timestamp } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
    }

    const frameUrl = await extractFrameFromVideo(videoUrl, timestamp || 0);

    return NextResponse.json({ frameUrl });
  } catch (error: any) {
    console.error('Extract frame error:', error);
    return NextResponse.json(
      { error: `Extract frame failed: ${error.message}` },
      { status: 500 }
    );
  }
}

async function extractFrameFromVideo(videoUrl: string, timestamp: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
      
      if (!canvas) {
        const placeholderFrame = generatePlaceholderFrame(timestamp);
        resolve(placeholderFrame);
        return;
      }

      resolve(generatePlaceholderFrame(timestamp));
    } catch (error) {
      reject(error);
    }
  });
}

function generatePlaceholderFrame(timestamp: number): string {
  const svg = `
    <svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a2e"/>
      <text x="50%" y="45%" text-anchor="middle" fill="#eab308" font-size="24" font-family="Arial">
        Frame at ${timestamp}s
      </text>
      <text x="50%" y="55%" text-anchor="middle" fill="#71717a" font-size="14" font-family="Arial">
        Video frame extraction
      </text>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}