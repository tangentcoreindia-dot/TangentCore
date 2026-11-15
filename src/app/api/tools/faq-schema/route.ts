import { NextResponse } from 'next/server';
import { queryGeminiJSON } from '@/lib/gemini-client';

export async function POST(req: Request) {
  try {
    const { brandOrTopic } = await req.json();

    if (!brandOrTopic || typeof brandOrTopic !== 'string') {
      return NextResponse.json({ error: 'Brand or product topic is required' }, { status: 400 });
    }

    let input = brandOrTopic.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

    const parts = input.split('.');
    const brandName = parts[0].toUpperCase();

    let faqs: { question: string; answer: string }[] = [];

    // Stage 1: Google Gemini AI for Brand-Specific FAQs
    try {
      const parsed = await queryGeminiJSON(
        `Generate 5 realistic, conversational FAQs for brand/domain: "${input}" (${brandName}).

Return JSON:
{
  "faqs": [
    {"question": "What is ${brandName} and what products/services do they offer?", "answer": "Detailed answer tailored to ${brandName}..."},
    {"question": "How to buy or order from ${brandName}?", "answer": "Detailed answer tailored to ${brandName}..."},
    {"question": "What makes ${brandName} unique compared to competitors?", "answer": "Detailed answer tailored to ${brandName}..."},
    {"question": "Does ${brandName} offer customer support and warranties?", "answer": "Detailed answer tailored to ${brandName}..."},
    {"question": "Where is ${brandName} located and how to contact them?", "answer": "Detailed answer tailored to ${brandName}..."}
  ]
}`,
        'You are an AEO conversational FAQ specialist. Return strictly JSON matching the requested schema without markdown codeblocks.',
        { temperature: 0.1 }
      );

      if (parsed?.faqs && parsed.faqs.length > 0) faqs = parsed.faqs;
    } catch (aiErr) {
      console.warn('Gemini API call error for FAQ schema:', aiErr);
    }

    if (faqs.length === 0) {
      try {
        const retryParsed = await queryGeminiJSON(
          `Generate 5 real conversational Q&A frequently asked questions regarding "${brandName}" (${input}).
Output JSON:
{
  "faqs": [
    {"question": "Real Question 1", "answer": "Real Answer 1"},
    {"question": "Real Question 2", "answer": "Real Answer 2"},
    {"question": "Real Question 3", "answer": "Real Answer 3"},
    {"question": "Real Question 4", "answer": "Real Answer 4"},
    {"question": "Real Question 5", "answer": "Real Answer 5"}
  ]
}`,
          'You are an authoritative FAQ creator. Return real, helpful answers strictly in JSON.'
        );
        if (retryParsed?.faqs?.length) faqs = retryParsed.faqs;
      } catch (retryErr) {
        console.warn('FAQ retry failed:', retryErr);
      }
    }

    if (faqs.length === 0) {
      return NextResponse.json(
        { error: `Unable to generate conversational FAQs for ${brandName}. Please verify the topic or domain and try again.` },
        { status: 502 }
      );
    }

    const jsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    const schemaSnippet = `<script type="application/ld+json">\n${JSON.stringify(jsonLdSchema, null, 2)}\n</script>`;

    return NextResponse.json({
      success: true,
      data: {
        topic: brandName,
        faqs,
        schemaSnippet,
      },
    });
  } catch (err: any) {
    console.error('FAQ Generator API Error:', err);
    return NextResponse.json({ error: 'Failed to generate FAQ schema' }, { status: 500 });
  }
}
