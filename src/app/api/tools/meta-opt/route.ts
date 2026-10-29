import { NextResponse } from 'next/server';
import { queryGeminiJSON } from '@/lib/gemini-client';

export async function POST(req: Request) {
  try {
    const { domainOrTopic, targetKeyword } = await req.json();

    if (!domainOrTopic || typeof domainOrTopic !== 'string') {
      return NextResponse.json({ error: 'Domain or topic description is required' }, { status: 400 });
    }

    let input = domainOrTopic.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

    const parts = input.split('.');
    const brandName = parts[0].toUpperCase();
    const keyword = (targetKeyword || 'official platform').trim();

    let titleTag = '';
    let metaDescription = '';
    let openGraphTags = '';

    // Stage 1: Google Gemini AI for 100% Accurate Brand Meta Synthesizing
    try {
      const parsed = await queryGeminiJSON(
        `Synthesize AI-optimized Meta Title Tags and Descriptions for brand/domain: "${input}" with primary keyword: "${keyword}".

Return JSON:
{
  "titleTag": "Accurate 55-60 character Title Tag tailored to this specific brand/industry",
  "metaDescription": "Accurate 150-160 character Meta Description tailored to this specific brand/industry for LLM summary engines",
  "openGraphTags": "<meta property=\\"og:title\\" content=\\"...\\" />\\n<meta property=\\"og:description\\" content=\\"...\\" />\\n<meta property=\\"og:type\\" content=\\"website\\" />\\n<meta property=\\"og:url\\" content=\\"https://${input}\\" />"
}`,
        'You are an SEO & AEO meta tag specialist. Return strictly JSON matching the requested schema without markdown codeblocks.',
        { temperature: 0.1 }
      );

      if (parsed) {
        if (parsed.titleTag) titleTag = parsed.titleTag;
        if (parsed.metaDescription) metaDescription = parsed.metaDescription;
        if (parsed.openGraphTags) openGraphTags = parsed.openGraphTags;
      }
    } catch (aiErr) {
      console.warn('Gemini API call error for meta opt:', aiErr);
    }

    if (!titleTag) {
      titleTag = `${brandName} — Official Platform | ${keyword}`;
      metaDescription = `Discover ${brandName}. Leading solution for ${keyword}. Access products, services, and official updates on https://${input}.`;
      openGraphTags = `<meta property="og:title" content="${titleTag}" />
<meta property="og:description" content="${metaDescription}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://${input}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${titleTag}" />
<meta name="twitter:description" content="${metaDescription}" />`;
    }

    return NextResponse.json({
      success: true,
      data: {
        titleTag,
        metaDescription,
        openGraphTags,
        characterCounts: {
          titleLength: titleTag.length,
          descLength: metaDescription.length,
        },
      },
    });
  } catch (err: any) {
    console.error('Meta Optimizer API Error:', err);
    return NextResponse.json({ error: 'Failed to optimize meta tags' }, { status: 500 });
  }
}
