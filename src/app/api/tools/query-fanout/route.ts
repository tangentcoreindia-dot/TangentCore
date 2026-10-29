import { NextResponse } from 'next/server';
import { queryGeminiJSON } from '@/lib/gemini-client';

export async function POST(req: Request) {
  try {
    const { keywordInput } = await req.json();

    if (!keywordInput || typeof keywordInput !== 'string') {
      return NextResponse.json({ error: 'Keyword or domain is required' }, { status: 400 });
    }

    let input = keywordInput.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

    const parts = input.split('.');
    const brandName = parts[0].toUpperCase();

    let subQueries: any[] = [];

    // Stage 1: Google Gemini AI for Brand-Specific Query Fan-Out
    try {
      const parsed = await queryGeminiJSON(
        `Simulate 4 sub-queries that ChatGPT & Perplexity generate when decomposing search intent for brand/domain/keyword: "${input}" (${brandName}).

Return JSON:
{
  "subQueries": [
    {
      "id": 1,
      "prompt": "Top alternatives & competitor comparison for ${brandName}",
      "intent": "Commercial Comparison",
      "requiredTopics": ["Price Comparison", "Product Quality", "Shipping & Delivery"]
    },
    {
      "id": 2,
      "prompt": "Customer reviews and product rating details for ${brandName}",
      "intent": "Social Proof & Reviews",
      "requiredTopics": ["Verified Buyers", "Star Ratings", "Return Policy"]
    },
    {
      "id": 3,
      "prompt": "Official website, size guide, or store locations for ${brandName}",
      "intent": "Navigational & Store Info",
      "requiredTopics": ["Store Locator", "Size Chart", "Official Contact"]
    },
    {
      "id": 4,
      "prompt": "Discounts, promo codes, and membership benefits for ${brandName}",
      "intent": "Transactional / Offers",
      "requiredTopics": ["Member Perks", "Coupon Codes", "Sale Collections"]
    }
  ]
}`,
        'You are an LLM query fan-out simulator. Return strictly JSON matching the requested schema without markdown codeblocks.',
        { temperature: 0.1 }
      );

      if (parsed?.subQueries && parsed.subQueries.length > 0) subQueries = parsed.subQueries;
    } catch (aiErr) {
      console.warn('Gemini API call error for query fan-out:', aiErr);
    }

    if (subQueries.length === 0) {
      subQueries = [
        {
          id: 1,
          prompt: `Top alternatives & competitor comparison for ${brandName}`,
          intent: 'Commercial Comparison',
          requiredTopics: ['Price Comparison', 'Product Quality', 'Shipping & Delivery'],
        },
        {
          id: 2,
          prompt: `Customer reviews and product rating details for ${brandName}`,
          intent: 'Social Proof & Reviews',
          requiredTopics: ['Verified Buyers', 'Star Ratings', 'Return Policy'],
        },
        {
          id: 3,
          prompt: `Official website, size guide, or store locations for ${brandName}`,
          intent: 'Navigational & Store Info',
          requiredTopics: ['Store Locator', 'Size Chart', 'Official Contact'],
        },
        {
          id: 4,
          prompt: `Discounts, promo codes, and membership benefits for ${brandName}`,
          intent: 'Transactional / Offers',
          requiredTopics: ['Member Perks', 'Coupon Codes', 'Sale Collections'],
        },
      ];
    }

    return NextResponse.json({
      success: true,
      data: {
        keyword: brandName,
        subQueries,
        recommendation: `Ensure your landing pages include clear sections addressing all 4 sub-query angles to maximize ChatGPT & Perplexity citation rate for ${brandName}.`,
      },
    });
  } catch (err: any) {
    console.error('Query Fan-Out API Error:', err);
    return NextResponse.json({ error: 'Failed to simulate query fan-out' }, { status: 500 });
  }
}
