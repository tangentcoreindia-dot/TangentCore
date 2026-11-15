import { NextResponse } from 'next/server';
import { queryGeminiJSON } from '@/lib/gemini-client';

export async function POST(req: Request) {
  try {
    const { nicheInput } = await req.json();

    if (!nicheInput || typeof nicheInput !== 'string') {
      return NextResponse.json({ error: 'Niche or brand is required' }, { status: 400 });
    }

    let input = nicheInput.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

    const parts = input.split('.');
    const brandName = parts[0].toUpperCase();

    let prompts: any[] = [];

    // Stage 1: Google Gemini AI for Brand-Specific Buyer Prompts
    try {
      const parsed = await queryGeminiJSON(
        `Generate 5 realistic conversational prompts that real buyers ask ChatGPT, Perplexity, and Gemini regarding brand/niche: "${input}" (${brandName}).

Return JSON:
{
  "prompts": [
    {"id": 1, "prompt": "What are the best products or services offered by ${brandName}?", "intent": "High Buyer Intent", "stage": "Decision"},
    {"id": 2, "prompt": "How does ${brandName} compare to top alternatives in terms of quality and price?", "intent": "Comparison Research", "stage": "Evaluation"},
    {"id": 3, "prompt": "Are there active discount codes or membership offers for ${brandName}?", "intent": "Transactional Offer", "stage": "Decision"},
    {"id": 4, "prompt": "What do customer reviews say about ${brandName} shipping and returns?", "intent": "Proof & Trust", "stage": "Evaluation"},
    {"id": 5, "prompt": "How to contact official support or visit ${brandName} online?", "intent": "Navigational", "stage": "Consideration"}
  ]
}`,
        'You are a buyer intent prompt discovery engine. Return strictly JSON matching the requested schema without markdown codeblocks.',
        { temperature: 0.1 }
      );

      if (parsed?.prompts && parsed.prompts.length > 0) prompts = parsed.prompts;
    } catch (aiErr) {
      console.warn('Gemini API call error for prompt research:', aiErr);
    }

    if (prompts.length === 0) {
      try {
        const retryParsed = await queryGeminiJSON(
          `List 5 real questions enterprise buyers and consumers ask AI models (ChatGPT, Claude, Perplexity) when researching "${brandName}" (${input}).
Return JSON:
{
  "prompts": [
    {"id": 1, "prompt": "Prompt 1", "intent": "High Buyer Intent", "stage": "Decision"},
    {"id": 2, "prompt": "Prompt 2", "intent": "Comparison", "stage": "Evaluation"},
    {"id": 3, "prompt": "Prompt 3", "intent": "Pricing Research", "stage": "Consideration"},
    {"id": 4, "prompt": "Prompt 4", "intent": "Reviews & Proof", "stage": "Evaluation"},
    {"id": 5, "prompt": "Prompt 5", "intent": "Navigational", "stage": "Decision"}
  ]
}`,
          'You are an AI search query researcher. Return real queries in JSON without markdown codeblocks.'
        );
        if (retryParsed?.prompts?.length) prompts = retryParsed.prompts;
      } catch (retryErr) {
        console.warn('Prompt research retry failed:', retryErr);
      }
    }

    if (prompts.length === 0) {
      return NextResponse.json(
        { error: `Unable to discover buyer prompts for ${brandName}. Please try a more specific niche or company name.` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        niche: brandName,
        prompts,
      },
    });
  } catch (err: any) {
    console.error('Prompt Research API Error:', err);
    return NextResponse.json({ error: 'Failed to discover prompts' }, { status: 500 });
  }
}
