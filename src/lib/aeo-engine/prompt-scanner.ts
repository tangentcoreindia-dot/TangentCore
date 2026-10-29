import { queryGemini, queryGeminiJSON } from '@/lib/gemini-client';

export interface ModelScanResult {
  modelName: string;
  modelLabel: string;
  brandMentioned: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  rankPosition: number; // 1 = top recommended, 2 = 2nd choice, 0 = unranked
  responseText: string;
  citations: string[];
}

export interface PromptScanItem {
  promptText: string;
  category: string;
  modelResults: ModelScanResult[];
  shareOfVoice: number; // percentage (0 - 100)
}

export const TARGET_AI_MODELS = [
  { name: 'chatgpt', label: 'ChatGPT (GPT-4o)', color: 'emerald' },
  { name: 'gemini', label: 'Google Gemini 2.5', color: 'blue' },
  { name: 'claude', label: 'Claude Sonnet 4', color: 'amber' },
  { name: 'deepseek', label: 'DeepSeek V3', color: 'sky' },
];

export interface SitePageContext {
  title?: string;
  description?: string;
  headings?: string[];
  brandAliases?: string[];
  preGeneratedPrompts?: Array<{ text: string; category: string; isHighValue?: boolean }>;
}

export async function runMultiModelScan(
  domain: string,
  brandName: string,
  keywords: string[] = [],
  competitors: string[] = [],
  promptCount: number = 5,
  siteContext?: SitePageContext
): Promise<PromptScanItem[]> {
  const targetPrompts = (siteContext?.preGeneratedPrompts && siteContext.preGeneratedPrompts.length > 0)
    ? siteContext.preGeneratedPrompts.slice(0, promptCount)
    : await generateTargetPromptsWithAI(domain, brandName, keywords, competitors, promptCount, siteContext);
  const brandAliases = siteContext?.brandAliases || [];

  const scanResults: PromptScanItem[] = [];

  // Process prompts in parallel chunks of 5 prompts to stay under Vercel serverless execution limits
  const BATCH_SIZE = 5;
  for (let i = 0; i < targetPrompts.length; i += BATCH_SIZE) {
    const chunk = targetPrompts.slice(i, i + BATCH_SIZE);

    const chunkResults = await Promise.all(
      chunk.map(async (p) => {
        // Query AI models in parallel for this prompt
        const modelResults = await Promise.all(
          TARGET_AI_MODELS.map(async (model) => {
            return queryAIModel(p.text, domain, brandName, model.name, model.label, brandAliases);
          })
        );

        const mentionedCount = modelResults.filter((m: ModelScanResult) => m.brandMentioned).length;
        const shareOfVoice = Math.round((mentionedCount / TARGET_AI_MODELS.length) * 100);

        return {
          promptText: p.text,
          category: p.category,
          modelResults,
          shareOfVoice,
        };
      })
    );

    scanResults.push(...chunkResults);
  }

  return scanResults;
}

export async function generateTargetPromptsWithAI(
  domain: string,
  brandName: string,
  keywords: string[] = [],
  competitors: string[] = [],
  count: number = 5,
  siteContext?: SitePageContext
): Promise<Array<{ text: string; category: string }>> {
  const brand = brandName || domain.split('.')[0].toUpperCase();

  const keywordContext = keywords.length > 0 ? keywords.join(', ') : 'their core products and services';
  const competitorContext = competitors.length > 0 ? competitors.join(', ') : 'their main competitors';

  const scrapedInfo = [
    siteContext?.title && siteContext.title !== domain ? `Page Title: "${siteContext.title}"` : '',
    siteContext?.description ? `Meta Description: "${siteContext.description}"` : '',
    siteContext?.headings && siteContext.headings.length > 0 ? `Key Page Headings: ${siteContext.headings.slice(0, 6).join(' | ')}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `You are a world-class AEO/GEO (Answer Engine Optimization) strategist who understands exactly what real buyers type into ChatGPT, Perplexity, Gemini, and Claude.

TASK: Analyze the REAL SCRAPED DATA of the website "${domain}" below and generate exactly ${count} highly specific search prompts that REAL potential customers would type into AI assistants when looking for what "${domain}" sells/solves.

REAL SCRAPED SITE DATA:
- Website: ${domain}
${scrapedInfo ? scrapedInfo : ''}
- Core Products/Services/Keywords: ${keywordContext}
- Known Competitors: ${competitorContext}
- Brand Name (reference only): ${brand}

QUALITY STANDARD (match this level):
For an AI marketing platform, great prompts look like:
- "ai marketing software with the best customer support"
- "software for automated seo content creation and posting"
- "integrated ai seo and social media automation tools"
- "ai marketing automation platform with social media scheduling"
- "ai content writer with auto publishing to social media"
- "which ai marketing software do professionals actually use"
- "best ai marketing software for small business"
- "best ai marketing software for agencies"
- "all in one ai marketing platform for small teams"
- "best software for managing client marketing with ai"
- "automated content creation and social media publishing tool"
- "ai tool that creates blog posts and social media graphics"
- "alternative to using multiple marketing tools for agencies"

RULES:
1. 100% of prompts must be GENERIC — do NOT mention "${brand}" or "${domain}" in ANY prompt
2. Prompts must be SPECIFIC BUYER INTENT queries, not vague topics
3. Each prompt should be a natural sentence/phrase (6-12 words) that a real person would type
4. Focus on what the product DOES and what PROBLEMS it solves, not brand names
5. Include feature-specific queries (e.g., "with social media scheduling", "with auto publishing")
6. Include use-case queries (e.g., "for agencies", "for small teams", "for small business")
7. Include comparison-style queries WITHOUT naming specific brands (e.g., "alternative to using multiple tools")
8. Mix "best..." queries with "how to..." and "which..." and direct feature searches
9. NO generic filler like "top tools 2024" or "best software"
10. Every prompt must be specific enough that you could tell what product category it's for

CATEGORIES — distribute prompts across:
- "Competitor" (50%) — Generic industry queries testing if the brand gets cited alongside competitors
- "Discovery" (25%) — Feature-specific and use-case discovery queries
- "Comparison" (15%) — "Alternative to..." or "vs" style without naming the brand
- "How-To" (10%) — Problem-solving queries where the product is the answer

Return ONLY a valid JSON array of objects with "text" and "category" keys.
Do NOT include markdown code blocks, backticks, or extra text. Return ONLY the JSON array.`;

  try {
    const parsed = await queryGeminiJSON<Array<{ text: string; category: string }>>(
      prompt,
      'You are a prompt research strategist. Return strictly valid JSON array without markdown code blocks.',
      { temperature: 0.4, maxTokens: 4000 }
    );

    if (Array.isArray(parsed) && parsed.length >= 3) {
      const categoryMap: Record<string, string> = {
        'product_search': 'Competitor',
        'competitor': 'Competitor',
        'how_to': 'How-To',
        'supplier_search': 'Competitor',
        'discovery': 'Discovery',
        'comparison': 'Comparison',
        'recommendation': 'Competitor',
        'niche': 'Discovery',
      };
      return parsed.slice(0, count).map(p => ({
        text: p.text.toLowerCase().replace(/[?.!]$/g, '').trim(),
        category: categoryMap[p.category?.toLowerCase()] || p.category || 'Competitor',
      }));
    }
  } catch (err) {
    console.warn('[Prompt Generation] Gemini call failed:', err);
  }

  return generateFallbackPrompts(domain, brand, keywords, competitors, count);
}

function generateFallbackPrompts(domain: string, brand: string, keywords: string[], competitors: string[], count: number = 5) {
  const targetBrand = brand || domain.split('.')[0].toUpperCase();

  // Clean keywords: keep only concise 1-3 word commercial topics
  const cleanK = keywords
    .map(k => k.replace(/[^a-zA-Z0-9\s]/g, '').trim())
    .filter(k => k.length > 2 && k.split(/\s+/).length <= 4 && !k.toLowerCase().includes('http'));

  const k1 = cleanK[0] || 'AI Automation';
  const k2 = cleanK[1] || 'Custom Software Development';
  const k3 = cleanK[2] || 'Enterprise AI Solutions';
  const k4 = cleanK[3] || 'Workflow Optimization';

  const masterPromptsList: Array<{ text: string; category: string }> = [
    { text: `best ${k1.toLowerCase()} services for growing business`, category: 'Competitor' },
    { text: `top rated ${k2.toLowerCase()} companies and agencies`, category: 'Competitor' },
    { text: `how to choose the right ${k1.toLowerCase()} partner`, category: 'How-To' },
    { text: `which ${k2.toLowerCase()} firms do professionals recommend`, category: 'Discovery' },
    { text: `reliable ${k3.toLowerCase()} for enterprise teams`, category: 'Discovery' },
    { text: `how to automate business operations with ${k4.toLowerCase()}`, category: 'How-To' },
  ];

  if (competitors.length > 0 && competitors[0] && !competitors[0].includes('alt1') && competitors[0].includes('.')) {
    masterPromptsList.push({ text: `${targetBrand} vs ${competitors[0]}`, category: 'Comparison' });
  }

  return masterPromptsList.slice(0, Math.min(count, masterPromptsList.length));
}

/**
 * Robust Brand Detection: Checks if a brand, domain, or any known alias/stem is mentioned in LLM text.
 * Works seamlessly across domains that differ from brand names (e.g. nirmauni.ac.in -> Nirma University / Nirma).
 */
export function checkBrandMention(
  content: string,
  domain: string,
  brandName: string,
  brandAliases: string[] = []
): { isMentioned: boolean; matchedFirstIndex: number } {
  const contentLower = content.toLowerCase();
  const domainLower = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const domainBase = domainLower.split('.')[0]; // e.g. "nirmauni" from "nirmauni.ac.in"

  const candidateTerms: string[] = [];

  // 1. Direct domain matches
  if (domainLower) candidateTerms.push(domainLower);
  if (domainBase && domainBase.length >= 3) candidateTerms.push(domainBase);

  // 2. Official Brand Name
  if (brandName) {
    candidateTerms.push(brandName.toLowerCase().trim());
  }

  // 3. Brand Aliases
  brandAliases.forEach(alias => {
    if (alias && alias.trim()) candidateTerms.push(alias.toLowerCase().trim());
  });

  // 4. Token-level roots (e.g. "Nirma" from "Nirma University", "Harvard" from "Harvard University")
  const genericStopWords = new Set([
    'university', 'institute', 'college', 'technologies', 'technology',
    'solutions', 'services', 'software', 'platform', 'app', 'company',
    'corporation', 'corp', 'inc', 'llc', 'ltd', 'limited', 'group',
    'international', 'global', 'india', 'school', 'academy', 'hospital',
    'systems', 'labs', 'consulting', 'digital', 'media', 'foundation',
    'center', 'centre', 'the', 'and', 'for', 'of', 'in', 'online', 'degree'
  ]);

  if (brandName) {
    const tokens = brandName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length >= 3);
    tokens.forEach(token => {
      if (!genericStopWords.has(token) && token.length >= 3) {
        candidateTerms.push(token);
      }
    });
  }

  // 5. Common domain suffix roots (e.g. "nirmauni" -> "nirma", "stanfordedu" -> "stanford")
  if (domainBase.length >= 6) {
    for (const suffix of ['uni', 'tech', 'soft', 'app', 'hub', 'lab', 'edu', 'law', 'med']) {
      if (domainBase.endsWith(suffix) && domainBase.length - suffix.length >= 4) {
        const root = domainBase.slice(0, domainBase.length - suffix.length);
        if (!genericStopWords.has(root)) {
          candidateTerms.push(root);
        }
      }
    }
  }

  const uniqueTerms = Array.from(new Set(candidateTerms.filter(t => t && t.length >= 3)));
  let minFirstIndex = Infinity;
  let hasMatch = false;

  for (const term of uniqueTerms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    const match = regex.exec(contentLower);
    if (match) {
      hasMatch = true;
      if (match.index < minFirstIndex) {
        minFirstIndex = match.index;
      }
    }
  }

  return { isMentioned: hasMatch, matchedFirstIndex: hasMatch ? minFirstIndex : -1 };
}

async function queryAIModel(
  prompt: string,
  domain: string,
  brandName: string,
  modelKey: string,
  modelLabel: string,
  brandAliases: string[] = []
): Promise<ModelScanResult> {
  try {
    const modelConfigMap: Record<string, { system: string; model?: string }> = {
      claude: {
        system: 'You are Anthropic Claude 3.5 Sonnet. Provide a thoughtful, balanced, authoritative response to this buyer search query, mentioning leading industry brands, products, and direct solutions.',
        model: 'apac.anthropic.claude-3-5-sonnet-20241022-v2:0',
      },
      chatgpt: {
        system: 'You are OpenAI ChatGPT (GPT-4o). Answer this search query naturally, authoritatively and objectively as ChatGPT, mentioning leading real-world solutions and brands.',
        model: 'apac.amazon.nova-pro-v1:0',
      },
      gemini: {
        system: 'You are Google Gemini 2.5 / Google AI Overview. Answer this search query clearly and helpfully, highlighting top brands and services.',
        model: 'apac.amazon.nova-lite-v1:0',
      },
      deepseek: {
        system: 'You are DeepSeek / Meta Llama. Provide an analytical, direct response answering this search query with top recommended platforms and alternatives.',
        model: 'apac.meta.llama3-1-70b-instruct-v1:0',
      },
    };

    const targetConfig = modelConfigMap[modelKey.toLowerCase()] || {
      system: `You are an AI assistant answering search queries as ${modelLabel}. Answer naturally and objectively.`,
      model: 'apac.amazon.nova-pro-v1:0',
    };

    const content = await queryGemini(
      prompt,
      targetConfig.system,
      { model: targetConfig.model, temperature: 0.2, maxTokens: 600, timeoutMs: 15000 }
    );

    if (content) {
      const { isMentioned, matchedFirstIndex } = checkBrandMention(content, domain, brandName, brandAliases);

      let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
      if (isMentioned) {
        if (/best|top|excellent|leading|highly|recommended|superior|robust|popular|standout|powerful|comprehensive/i.test(content)) {
          sentiment = 'positive';
        } else if (/lacks|expensive|complex|difficult|behind|poor|limited|basic|weak/i.test(content)) {
          sentiment = 'negative';
        }
      }

      const citations = extractUrlsFromText(content);

      // Calculate rank position based on where brand appears in the response
      let rankPosition = 0;
      if (isMentioned) {
        if (matchedFirstIndex >= 0 && matchedFirstIndex < 150) rankPosition = 1;
        else if (matchedFirstIndex >= 0 && matchedFirstIndex < 400) rankPosition = 2;
        else rankPosition = 3;
      }

      return {
        modelName: modelKey,
        modelLabel,
        brandMentioned: isMentioned,
        sentiment,
        rankPosition,
        responseText: content,
        citations,
      };
    }
  } catch (err) {
    console.warn(`[AI Scan] Query failed for ${modelLabel}:`, err);
  }

  return {
    modelName: modelKey,
    modelLabel,
    brandMentioned: false,
    sentiment: 'neutral',
    rankPosition: 0,
    responseText: `Live scan query timed out or was unavailable for ${modelLabel}.`,
    citations: [],
  };
}

function extractUrlsFromText(text: string): string[] {
  const regex = /(https?:\/\/[^\s\)\"\'\>]+)/g;
  const matches = text.match(regex) || [];
  return Array.from(new Set(matches.map(u => u.replace(/[\.\,\)\?]$/, ''))));
}
