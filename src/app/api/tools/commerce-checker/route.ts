import { NextResponse } from 'next/server';
import { queryGeminiJSON } from '@/lib/gemini-client';

export async function POST(req: Request) {
  try {
    const { storeUrl } = await req.json();

    if (!storeUrl || typeof storeUrl !== 'string') {
      return NextResponse.json({ error: 'Store URL is required' }, { status: 400 });
    }

    let domain = storeUrl.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

    const parts = domain.split('.');
    const brandName = parts[0].toUpperCase();
    const targetUrl = `https://${domain}`;

    let hasProductSchema = false;
    let hasOgPrice = false;
    let hasGptBotAllowed = true;
    let hasUcpCompliance = false;
    let pageHtml = '';

    // 1. Scrape Store HTML for Real E-Commerce Tags
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        pageHtml = await res.text();
        const lowerHtml = pageHtml.toLowerCase();

        hasProductSchema = lowerHtml.includes('schema.org/product') || lowerHtml.includes('"@type":"product"') || lowerHtml.includes('"@type": "product"');
        hasOgPrice = lowerHtml.includes('og:price:amount') || lowerHtml.includes('product:price:amount') || lowerHtml.includes('priceCurrency');
        hasUcpCompliance = hasProductSchema && (lowerHtml.includes('availability') || lowerHtml.includes('itemcondition') || lowerHtml.includes('offers'));
      }
    } catch (fetchErr) {
      console.warn(`[Commerce Checker] Store fetch failed for ${domain}:`, fetchErr);
    }

    // 2. Fetch robots.txt to verify GPTBot permission
    try {
      const robotsRes = await fetch(`https://${domain}/robots.txt`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000),
      });

      if (robotsRes.ok) {
        const robotsText = (await robotsRes.text()).toLowerCase();
        if (robotsText.includes('user-agent: gptbot') && robotsText.includes('disallow: /')) {
          hasGptBotAllowed = false;
        }
      }
    } catch {
      // Default to true if robots.txt is standard/unblocked
    }

    // 3. AI Evaluation via Claude Sonnet on Bedrock
    let aiScore = 0;
    let aiRecommendation = '';
    let aiChecks: any[] = [];

    try {
      const parsed = await queryGeminiJSON(
        `Perform an authentic AI Agentic Commerce Protocol (ACP) & ChatGPT Shopping readiness audit for e-commerce domain "${domain}" (${brandName}).

Real Findings from Live Crawl:
- Product Schema Detected: ${hasProductSchema ? 'YES' : 'NO'}
- OpenGraph Price/Currency Meta: ${hasOgPrice ? 'YES' : 'NO'}
- GPTBot Crawler Access: ${hasGptBotAllowed ? 'ALLOWED' : 'BLOCKED'}
- Real-Time Inventory & Offer Schema: ${hasUcpCompliance ? 'YES' : 'NO'}
- Page Title Excerpt: ${pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || domain}

Evaluate real AI shopping readiness (ChatGPT Operator, Google AI Shopping, Perplexity Buy). Return JSON:
{
  "acpScore": 75,
  "checks": [
    {"name": "Product JSON-LD Schema (schema.org/Product)", "pass": ${hasProductSchema}, "detail": "Detailed finding"},
    {"name": "OpenGraph Commerce Tags (og:price:amount)", "pass": ${hasOgPrice}, "detail": "Detailed finding"},
    {"name": "ChatGPT Shopping Agent Indexing (GPTBot)", "pass": ${hasGptBotAllowed}, "detail": "Detailed finding"},
    {"name": "Universal Commerce Protocol (UCP) & Live Inventory Feed", "pass": ${hasUcpCompliance}, "detail": "Detailed finding"}
  ],
  "recommendation": "1 specific actionable sentence to make ${brandName} 100% compliant with autonomous AI checkout agents."
}`,
        'You are an autonomous AI e-commerce protocol auditor. Return strictly valid JSON based on the real findings.'
      );

      if (parsed) {
        if (parsed.acpScore) aiScore = parsed.acpScore;
        if (parsed.checks?.length) aiChecks = parsed.checks;
        if (parsed.recommendation) aiRecommendation = parsed.recommendation;
      }
    } catch (aiErr) {
      console.warn('[Commerce Checker] AI evaluation warning:', aiErr);
    }

    // Calculate score deterministically if model unavailable
    if (aiScore === 0) {
      let passedCount = 0;
      if (hasProductSchema) passedCount += 35;
      if (hasOgPrice) passedCount += 25;
      if (hasGptBotAllowed) passedCount += 20;
      if (hasUcpCompliance) passedCount += 20;
      aiScore = Math.max(15, passedCount);
    }

    if (aiChecks.length === 0) {
      aiChecks = [
        {
          name: `Product JSON-LD Schema (\`schema.org/Product\` for ${brandName})`,
          pass: hasProductSchema,
          detail: hasProductSchema ? 'Structured Product JSON-LD markup detected in HTML source' : 'No schema.org/Product schema detected on target domain',
        },
        {
          name: 'OpenGraph Commerce Tags (`og:price:amount`)',
          pass: hasOgPrice,
          detail: hasOgPrice ? 'Valid OpenGraph price and currency tags detected' : 'Missing og:price:amount metadata for social and conversational preview',
        },
        {
          name: 'ChatGPT Shopping Agent Indexing',
          pass: hasGptBotAllowed,
          detail: hasGptBotAllowed ? 'GPTBot is permitted to crawl product catalog in robots.txt' : 'GPTBot is disallowed in robots.txt — AI agents cannot index inventory',
        },
        {
          name: 'Universal Commerce Protocol (UCP) Compliance',
          pass: hasUcpCompliance,
          detail: hasUcpCompliance ? 'Structured Offer availability and price currency signals detected' : 'Missing real-time availability and Offer schema required for autonomous checkout',
        },
      ];
    }

    if (!aiRecommendation) {
      aiRecommendation = hasProductSchema
        ? `${brandName} is ready for basic AI shopping. Ensure dynamic real-time inventory and pricing sync for autonomous agent checkout.`
        : `Implement schema.org/Product JSON-LD markup with Offer and priceCurrency attributes to enable ChatGPT and Google AI shopping integration for ${brandName}.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        domain,
        brandName,
        acpScore: aiScore,
        checks: aiChecks,
        recommendation: aiRecommendation,
      },
    });
  } catch (err: any) {
    console.error('Commerce Checker API Error:', err);
    return NextResponse.json({ error: 'Failed to inspect commerce protocol' }, { status: 500 });
  }
}
