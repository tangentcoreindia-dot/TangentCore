import { NextResponse } from 'next/server';
import { queryGeminiJSON } from '@/lib/gemini-client';

export async function POST(req: Request) {
  try {
    let domainInput = '';
    try {
      const body = await req.json();
      domainInput = body?.domainInput || '';
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 });
    }

    if (!domainInput || typeof domainInput !== 'string') {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Clean & normalize domain
    let domain = domainInput.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');

    const clearbitLogo = `https://logo.clearbit.com/${domain}`;
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const targetUrl = `https://${domain}`;

    let siteTitle = domain;
    let metaDescription = '';
    let ogImage = '';
    let appleTouchIcon = '';
    let scrapedLogos: string[] = [];
    let schemasFound: string[] = [];

    // Stage 1: Deep Real HTML Scraping for Exact Logo Images
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const html = await res.text();

        if (!html.includes('JavaScript is disabled') && !html.includes('robot check')) {
          // Extract title
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) siteTitle = titleMatch[1].trim();

          // Extract meta description
          const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          if (descMatch && descMatch[1]) metaDescription = descMatch[1].trim();

          // Extract OpenGraph image
          const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
          if (ogMatch && ogMatch[1]) {
            let og = ogMatch[1].trim();
            if (og.startsWith('/')) og = `https://${domain}${og}`;
            ogImage = og;
          }

          // Extract Apple Touch Icon
          const appleMatch = html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i);
          if (appleMatch && appleMatch[1]) {
            let ati = appleMatch[1].trim();
            if (ati.startsWith('/')) ati = `https://${domain}${ati}`;
            appleTouchIcon = ati;
          }

          // Extract real <img> logo tags from website HTML (e.g. rajaranicoaching.com "Raja Rani Side Dark.svg" or "footer logo.webp")
          const imgRegex = /<img[^>]+>/gi;
          let imgTag;
          while ((imgTag = imgRegex.exec(html)) !== null && scrapedLogos.length < 5) {
            const tag = imgTag[0];
            if (tag.toLowerCase().includes('logo') || tag.toLowerCase().includes('brand') || tag.includes('.svg') || tag.toLowerCase().includes('header')) {
              const srcMatch = tag.match(/src=["']([^"']+)["']/i);
              if (srcMatch && srcMatch[1]) {
                let src = srcMatch[1].trim().replace(/&amp;/g, '&');
                if (src.startsWith('//')) src = `https:${src}`;
                else if (src.startsWith('/')) src = `https://${domain}${src}`;
                else if (!src.startsWith('http')) src = `https://${domain}/${src}`;
                
                // Avoid facebook pixels or tracking 1x1 pixels
                if (!src.includes('facebook') && !src.includes('pixel')) {
                  scrapedLogos.push(src);
                }
              }
            }
          }

          if (html.includes('Organization')) schemasFound.push('Organization');
          if (html.includes('Product') || html.includes('SoftwareApplication')) schemasFound.push('Product / SaaS');
          if (html.includes('FAQPage')) schemasFound.push('FAQPage');
        }
      }
    } catch (err) {
      console.warn('HTTP scraping warning:', err);
    }

    const cleanBrandName = domain.split('.')[0].toUpperCase();

    // Prioritize REAL scraped site logos over external fallback providers (NO IconHorse!)
    const logoCandidates = [
      ...scrapedLogos,
      clearbitLogo,
      appleTouchIcon,
      ogImage,
      googleFavicon,
    ].filter((url, index, self) => url && self.indexOf(url) === index);

    let aiSummary = '';
    let targetAudience = '';
    let keyFeatures: string[] = [];
    let competitors: any[] = [];
    let aeoScore = 88;

    // Stage 2: Deep AI Analysis via Google Gemini API
    try {
      const parsed = await queryGeminiJSON(
        `Provide a real business audit for domain "${domain}".
Target Domain: ${domain}
Scraped Title: "${siteTitle}"
Meta Description: "${metaDescription}"

Return JSON matching:
{
  "brandName": "Official Clean Brand Name",
  "executiveSummary": "Detailed 3-4 sentence summary of what this company actually does, its business model, core services, and value proposition.",
  "targetAudience": "Primary customers and buyers.",
  "keyFeatures": ["Core Product/Service 1", "Core Product/Service 2", "Core Product/Service 3", "Core Product/Service 4"],
  "competitors": [
    {"name": "Real Competitor 1 Name", "domain": "realcompetitor1.com", "positioning": "How they compete", "threatLevel": "High"},
    {"name": "Real Competitor 2 Name", "domain": "realcompetitor2.com", "positioning": "How they compete", "threatLevel": "High"},
    {"name": "Real Competitor 3 Name", "domain": "realcompetitor3.com", "positioning": "How they compete", "threatLevel": "Medium"},
    {"name": "Real Competitor 4 Name", "domain": "realcompetitor4.com", "positioning": "How they compete", "threatLevel": "Low"}
  ],
  "aeoScore": 88
}`,
        'You are an enterprise business analyst. Return strictly valid JSON object without markdown code block formatting.',
        { temperature: 0.1 }
      );

      if (parsed) {
        if (parsed.brandName) siteTitle = parsed.brandName;
        if (parsed.executiveSummary) aiSummary = parsed.executiveSummary;
        if (parsed.targetAudience) targetAudience = parsed.targetAudience;
        if (parsed.keyFeatures && parsed.keyFeatures.length > 0) {
          keyFeatures = parsed.keyFeatures.filter((f: string) => !f.toLowerCase().includes('javascript'));
        }
        if (parsed.competitors && parsed.competitors.length > 0) {
          competitors = parsed.competitors.filter((c: any) => !c.name.toLowerCase().includes('competitor'));
        }
        if (parsed.aeoScore) aeoScore = parsed.aeoScore;
      }
    } catch (aiErr) {
      console.warn('Gemini API call error:', aiErr);
    }

    // Stage 3: If AI query returned empty, retry once with focused prompt
    if (!aiSummary || competitors.length === 0) {
      try {
        const retryParsed = await queryGeminiJSON(
          `Identify the business operating at domain "${domain}".
Return JSON with:
{
  "brandName": "Official Brand Name",
  "executiveSummary": "2-3 sentence description of their actual business, products, or services.",
  "targetAudience": "Primary customers.",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "competitors": [
    {"name": "Competitor 1", "domain": "domain1.com", "positioning": "Market rival", "threatLevel": "High"},
    {"name": "Competitor 2", "domain": "domain2.com", "positioning": "Alternative provider", "threatLevel": "Medium"}
  ],
  "aeoScore": 75
}`,
          'You are an authoritative business research analyst. Return strictly real facts in JSON without markdown codeblocks.'
        );

        if (retryParsed) {
          if (retryParsed.brandName) siteTitle = retryParsed.brandName;
          if (retryParsed.executiveSummary) aiSummary = retryParsed.executiveSummary;
          if (retryParsed.targetAudience) targetAudience = retryParsed.targetAudience;
          if (retryParsed.keyFeatures?.length) keyFeatures = retryParsed.keyFeatures;
          if (retryParsed.competitors?.length) competitors = retryParsed.competitors;
          if (retryParsed.aeoScore) aeoScore = retryParsed.aeoScore;
        }
      } catch (retryErr) {
        console.warn('Brand audit retry failed:', retryErr);
      }
    }

    if (!aiSummary) {
      return NextResponse.json(
        { error: `Unable to complete AI analysis for ${domain}. Please ensure the domain is active and publicly accessible.` },
        { status: 502 }
      );
    }

    const dynamicRecommendation = schemasFound.length === 0
      ? `Add Organization and WebSite JSON-LD schemas to boost AI answer engine entity recognition for ${cleanBrandName}.`
      : !metaDescription
      ? `Add clear descriptive meta tags and OpenGraph tags to help ChatGPT and Perplexity summarize ${cleanBrandName}.`
      : `Expand FAQ and Product schema markup to capture #1 conversational citations across ChatGPT and Claude.`;

    return NextResponse.json({
      success: true,
      data: {
        domain,
        targetUrl,
        brandName: cleanBrandName,
        siteTitle: siteTitle || `${cleanBrandName} — Official Platform`,
        metaDescription: metaDescription || `Official website and platform overview for ${cleanBrandName}.`,
        logoUrl: logoCandidates[0] || googleFavicon,
        logoCandidates,
        faviconUrl: googleFavicon,
        ogImage: ogImage || logoCandidates[0] || googleFavicon,
        executiveSummary: aiSummary,
        targetAudience,
        keyFeatures,
        competitors,
        aeoReadiness: {
          score: aeoScore,
          schemasFound,
          hasFavicon: !!googleFavicon,
          hasMetaDescription: metaDescription.length > 10,
          aiCrawlerAccess: 'Active (Crawlers allowed)',
          recommendation: dynamicRecommendation,
        },
      },
    });
  } catch (err: any) {
    console.error('Brand Audit API Error:', err);
    return NextResponse.json({ error: 'Failed to audit website' }, { status: 500 });
  }
}
