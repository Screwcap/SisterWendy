import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SISTER_WENDY_PERSONA, UPLOAD_PROMPT } from '@/lib/sisterWendy';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let imageData: { type: 'base64'; data: string; mediaType: string } | { type: 'url'; url: string };

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await req.json();
    if (!body.url) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }
    imageData = { type: 'url', url: body.url };
  } else {
    // Multipart form upload
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image too large (max 5MB)' }, { status: 400 });
    }
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mt = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    imageData = { type: 'base64', data: base64, mediaType: mt };
  }

  try {
    const client = new Anthropic({ apiKey });
    const imageSource =
      imageData.type === 'url'
        ? { type: 'url' as const, url: imageData.url }
        : {
            type: 'base64' as const,
            media_type: imageData.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: imageData.data,
          };

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1200,
      system: SISTER_WENDY_PERSONA,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: imageSource },
            { type: 'text', text: UPLOAD_PROMPT },
          ],
        },
      ],
    });

    const analysis = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error('Claude API error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
