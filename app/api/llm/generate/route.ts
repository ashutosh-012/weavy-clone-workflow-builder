import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature, maxTokens } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const generativeModel = genAI.getGenerativeModel({
      model: model || 'gemini-pro',
    });

    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature || 0.7,
        maxOutputTokens: maxTokens || 1024,
      },
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('LLM generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
}
