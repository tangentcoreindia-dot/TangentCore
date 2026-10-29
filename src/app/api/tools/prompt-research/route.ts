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
      prompts = [
        { id: 1, prompt: `What are the top offerings from ${brandName}?`, intent: 'High Buyer Intent', stage: 'Decision' },
        { id: 2, prompt: `Top alternatives to ${brandName} for quality and value`, intent: 'Comparison Research', stage: 'Evaluation' },
        { id: 3, prompt: `What is the price range and return policy of ${brandName}?`, intent: 'Pricing Research', stage: 'Consideration' },
        { id: 4, prompt: `Are customer reviews positive for ${brandName}?`, intent: 'Proof & Trust', stage: 'Evaluation' },
        { id: 5, prompt: `Where to buy official ${brandName} products online?`, intent: 'Navigational', stage: 'Decision' },
      ];
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
