import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, x, y, width, height } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    let imageBuffer: Buffer;

    if (imageUrl.startsWith('data:')) {
      const base64Data = imageUrl.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    const croppedBuffer = await sharp(imageBuffer)
      .extract({
        left: Math.max(0, x || 0),
        top: Math.max(0, y || 0),
        width: Math.max(1, width || 100),
        height: Math.max(1, height || 100),
      })
      .toBuffer();

    const base64 = croppedBuffer.toString('base64');
    const croppedImageUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ croppedImageUrl });
  } catch (error: any) {
    console.error('Crop error:', error);
    return NextResponse.json(
      { error: `Crop failed: ${error.message}` },
      { status: 500 }
    );
  }
}