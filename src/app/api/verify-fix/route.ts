import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url, fixType, expectedSnippet } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const cleanUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

    // Live fetch of the site
    const res = await fetch(cleanUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TangentCore-Verifier/1.0; +https://tangentcore.in)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({
        verified: false,
        message: `HTTP ${res.status} returned by server. Fix could not be verified.`,
      });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    let isVerified = false;
    let details = '';

    if (fixType === 'schema') {
      const schemas: string[] = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        schemas.push($(el).html() || '');
      });

      const allSchemas = schemas.join(' ');
      if (expectedSnippet && allSchemas.includes(expectedSnippet)) {
        isVerified = true;
        details = 'Exact schema snippet matched in live <script type="application/ld+json"> tag.';
      } else if (allSchemas.includes('FAQPage') || allSchemas.includes('Organization') || allSchemas.includes('Service')) {
        isVerified = true;
        details = 'Found active JSON-LD schema on the live page.';
      } else {
        isVerified = false;
        details = 'No matching JSON-LD schema detected in the live HTML yet.';
      }
    } else if (fixType === 'metadata') {
      const metaDesc = $('meta[name="description"]').attr('content') || '';
      if (metaDesc.length >= 80) {
        isVerified = true;
        details = `Live meta description detected (${metaDesc.length} characters).`;
      } else {
        isVerified = false;
        details = 'Meta description is either missing or too short on the live page.';
      }
    } else {
      // General HTML verification
      if (expectedSnippet && html.includes(expectedSnippet)) {
        isVerified = true;
        details = 'Expected content snippet verified on the live page.';
      } else {
        isVerified = false;
        details = 'Expected markup was not found on the live page.';
      }
    }

    return NextResponse.json({
      verified: isVerified,
      message: details,
      checkedUrl: cleanUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      verified: false,
      message: `Failed to connect to page: ${err.message}`,
    });
  }
}
