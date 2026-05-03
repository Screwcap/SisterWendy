import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDailyPaintingId, fetchMetObject } from '@/lib/metMuseum';
import { SISTER_WENDY_PERSONA, DAILY_PROMPT } from '@/lib/sisterWendy';

export const revalidate = 86400; // Regenerate once per day

export async function GET() {
  const objectID = getDailyPaintingId();
  const painting = await fetchMetObject(objectID);

  if (!painting || !painting.primaryImage) {
    return NextResponse.json({ error: 'No painting found' }, { status: 500 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1200,
      system: SISTER_WENDY_PERSONA,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'url', url: painting.primaryImage },
            },
            {
              type: 'text',
              text: DAILY_PROMPT(
                painting.title,
                painting.artistDisplayName || 'Unknown artist',
                painting.objectDate
              ),
            },
          ],
        },
      ],
    });

    const analysis = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({
      painting: {
        id: painting.objectID,
        title: painting.title,
        artist: painting.artistDisplayName,
        date: painting.objectDate,
        medium: painting.medium,
        imageUrl: painting.primaryImage,
        imageSmall: painting.primaryImageSmall,
        creditLine: painting.creditLine,
        objectURL: painting.objectURL,
      },
      analysis,
    });
  } catch (err) {
    console.error('Claude API error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
