/**
 * Unified AI Client supporting AWS Bedrock and Google Gemini REST API.
 * All AI calls across the AEO-GEO platform route through this utility.
 *
 * Supported Providers:
 * 1. AWS Bedrock (Amazon Nova, Meta Llama 3) via Bearer token:
 *    - AWS_BEDROCK_API_KEY / BEDROCK_API_KEY
 *    - BEDROCK_REGION (default: us-east-1)
 *    - BEDROCK_DEFAULT_MODEL (default: amazon.nova-pro-v1:0)
 *
 * 2. Google Gemini REST API:
 *    - GEMINI_API_KEY
 */

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

const DEFAULT_BEDROCK_REGION = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'ap-south-1';
const DEFAULT_BEDROCK_MODEL = process.env.BEDROCK_DEFAULT_MODEL || 'apac.anthropic.claude-3-5-sonnet-20241022-v2:0';

export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  provider?: 'bedrock' | 'gemini' | 'auto';
}

export type GeminiOptions = AIOptions;

export interface ScanUsageStats {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  costInr: number;
  modelsUsed: string[];
}

let activeSessionUsage: ScanUsageStats = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  costUsd: 0,
  costInr: 0,
  modelsUsed: [],
};

export function resetScanUsage() {
  activeSessionUsage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    costUsd: 0,
    costInr: 0,
    modelsUsed: [],
  };
}

export function getScanUsage(): ScanUsageStats {
  return {
    ...activeSessionUsage,
    costUsd: Number(activeSessionUsage.costUsd.toFixed(5)),
    costInr: Number((activeSessionUsage.costUsd * 87.0).toFixed(2)),
  };
}

export function recordTokenUsage(modelId: string, inputTokens: number, outputTokens: number) {
  const cleanModel = modelId.toLowerCase();
  
  let inRate = 0.0000008; // default Nova Pro ($0.80 / 1M)
  let outRate = 0.0000032; // default Nova Pro ($3.20 / 1M)

  if (cleanModel.includes('claude-3-5') || cleanModel.includes('claude-sonnet')) {
    inRate = 0.000003; // $3.00 / 1M
    outRate = 0.000015; // $15.00 / 1M
  } else if (cleanModel.includes('claude-haiku')) {
    inRate = 0.00000025; // $0.25 / 1M
    outRate = 0.00000125; // $1.25 / 1M
  } else if (cleanModel.includes('nova-lite')) {
    inRate = 0.00000006; // $0.06 / 1M
    outRate = 0.00000024; // $0.24 / 1M
  } else if (cleanModel.includes('nova-pro')) {
    inRate = 0.0000008; // $0.80 / 1M
    outRate = 0.0000032; // $3.20 / 1M
  } else if (cleanModel.includes('llama')) {
    inRate = 0.00000072; // $0.72 / 1M
    outRate = 0.00000072; // $0.72 / 1M
  } else if (cleanModel.includes('gemini')) {
    inRate = 0.000000075;
    outRate = 0.0000003;
  }

  const callCostUsd = (inputTokens * inRate) + (outputTokens * outRate);

  activeSessionUsage.inputTokens += inputTokens;
  activeSessionUsage.outputTokens += outputTokens;
  activeSessionUsage.totalTokens += (inputTokens + outputTokens);
  activeSessionUsage.costUsd += callCostUsd;
  activeSessionUsage.costInr = activeSessionUsage.costUsd * 87.0;

  const displayName = cleanModel.includes('claude-3-5')
    ? 'Claude 3.5 Sonnet'
    : cleanModel.includes('claude')
    ? 'Claude 3 Haiku'
    : cleanModel.includes('nova-pro')
    ? 'Nova Pro'
    : cleanModel.includes('nova-lite')
    ? 'Nova Lite'
    : cleanModel.includes('llama')
    ? 'Llama 3.3'
    : modelId;

  if (!activeSessionUsage.modelsUsed.includes(displayName)) {
    activeSessionUsage.modelsUsed.push(displayName);
  }
}

/**
 * Invoke AWS Bedrock runtime model via Bearer token.
 */
export async function queryBedrock(
  prompt: string,
  systemInstruction?: string,
  options: AIOptions = {}
): Promise<string> {
  const apiKey = process.env.AWS_BEDROCK_API_KEY || process.env.BEDROCK_API_KEY || '';
  if (!apiKey || apiKey.includes('placeholder')) {
    return '';
  }

  const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || DEFAULT_BEDROCK_REGION;
  let modelId = options.model || DEFAULT_BEDROCK_MODEL;

  // Automatically upgrade legacy Claude 3.5 Sonnet v1 to current active Claude 3.5 Sonnet v2
  if (modelId.includes('20240620-v1:0')) {
    modelId = modelId.replace('20240620-v1:0', '20241022-v2:0');
  }

  // AWS Bedrock cross-region inference profile prefix handling
  if (region.startsWith('ap-')) {
    if (modelId.startsWith('amazon.nova') && !modelId.startsWith('apac.')) modelId = `apac.${modelId}`;
    if (modelId.startsWith('anthropic.claude') && !modelId.startsWith('apac.')) modelId = `apac.${modelId}`;
    if (modelId.startsWith('meta.llama') && !modelId.startsWith('apac.')) modelId = `apac.${modelId}`;
  } else if (region.startsWith('us-')) {
    if (modelId.startsWith('amazon.nova') && !modelId.startsWith('us.')) modelId = `us.${modelId}`;
    if (modelId.startsWith('anthropic.claude') && !modelId.startsWith('us.')) modelId = `us.${modelId}`;
    if (modelId.startsWith('meta.llama') && !modelId.startsWith('us.')) modelId = `us.${modelId}`;
  }

  const temperature = options.temperature ?? 0.2;
  const maxTokens = options.maxTokens ?? 2048;
  const timeoutMs = options.timeoutMs ?? 30000;

  // 1. First Attempt: Standard Bedrock Converse API (Universal Bearer Token Endpoint)
  const converseUrl = `https://bedrock-runtime.${region}.amazonaws.com/model/${modelId}/converse`;
  const converseBody: any = {
    messages: [{ role: 'user', content: [{ text: prompt }] }],
    inferenceConfig: {
      temperature,
      maxTokens,
    },
  };
  if (systemInstruction) {
    converseBody.system = [{ text: systemInstruction }];
  }

  try {
    const res = await fetch(converseUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(converseBody),
    });

    if (res.ok) {
      const data = await res.json();
      const outputText = data?.output?.message?.content?.[0]?.text;
      const usage = data?.usage;
      const inTokens = usage?.inputTokens || Math.round(prompt.length / 4);
      const outTokens = usage?.outputTokens || Math.round((outputText || '').length / 4);
      recordTokenUsage(modelId, inTokens, outTokens);
      if (outputText) return outputText.trim();
    } else {
      const errText = await res.text().catch(() => '');
      console.warn(`[AWS Bedrock Converse API] ${modelId} (${region}) status ${res.status}: ${errText.slice(0, 300)}`);
      
      // Automatic model failovers if access denied or unavailable in this region
      if (res.status === 403 || res.status === 400 || res.status === 404) {
        if (modelId.includes('20240620-v1:0')) {
          console.warn(`[Bedrock Failover] Claude 3.5 Sonnet v1 is legacy. Upgrading to Sonnet v2...`);
          return queryBedrock(prompt, systemInstruction, { ...options, model: 'apac.anthropic.claude-3-5-sonnet-20241022-v2:0' });
        } else if (modelId.includes('claude-3-5')) {
          console.warn(`[Bedrock Failover] Claude 3.5 Sonnet unavailable. Failing over to Amazon Nova Pro...`);
          return queryBedrock(prompt, systemInstruction, { ...options, model: 'apac.amazon.nova-pro-v1:0' });
        } else if (modelId.includes('claude')) {
          console.warn(`[Bedrock Failover] Claude unavailable. Failing over to Amazon Nova Pro...`);
          return queryBedrock(prompt, systemInstruction, { ...options, model: 'apac.amazon.nova-pro-v1:0' });
        } else if (modelId.includes('llama')) {
          console.warn(`[Bedrock Failover] Llama model unavailable in ${region}. Failing over to Claude 3.5 Sonnet v2...`);
          return queryBedrock(prompt, systemInstruction, { ...options, model: 'apac.anthropic.claude-3-5-sonnet-20241022-v2:0' });
        } else if (!modelId.includes('claude-3-5')) {
          console.warn(`[Bedrock Failover] Model ${modelId} failed. Failing over to Claude 3.5 Sonnet v2...`);
          return queryBedrock(prompt, systemInstruction, { ...options, model: 'apac.anthropic.claude-3-5-sonnet-20241022-v2:0' });
        }
      }
    }
  } catch (err: any) {
    console.warn(`[AWS Bedrock Converse API] Request failed: ${err.message}`);
  }

  // 2. Fallback Attempt: Model-Specific /invoke API
  try {
    const invokeUrl = `https://bedrock-runtime.${region}.amazonaws.com/model/${modelId}/invoke`;
    let invokeBody: any;

    if (modelId.startsWith('amazon.nova')) {
      invokeBody = {
        messages: [{ role: 'user', content: [{ text: prompt }] }],
        inferenceConfig: { temperature, max_new_tokens: maxTokens },
      };
      if (systemInstruction) invokeBody.system = [{ text: systemInstruction }];
    } else if (modelId.startsWith('meta.llama3')) {
      invokeBody = {
        prompt: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt,
        max_gen_len: maxTokens,
        temperature,
      };
    } else if (modelId.startsWith('anthropic.')) {
      invokeBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }],
      };
      if (systemInstruction) invokeBody.system = systemInstruction;
    } else {
      invokeBody = {
        messages: [{ role: 'user', content: [{ text: prompt }] }],
        inferenceConfig: { temperature, max_new_tokens: maxTokens }
      };
    }

    const invokeRes = await fetch(invokeUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(invokeBody),
    });

    if (invokeRes.ok) {
      const data = await invokeRes.json();
      return (
        data?.output?.message?.content?.[0]?.text ||
        data?.generation ||
        data?.content?.[0]?.text ||
        data?.results?.[0]?.outputText ||
        ''
      ).trim();
    } else {
      const errText = await invokeRes.text().catch(() => '');
      console.warn(`[AWS Bedrock Invoke API] ${modelId} status ${invokeRes.status}: ${errText.slice(0, 300)}`);
    }
  } catch (err: any) {
    console.warn(`[AWS Bedrock Invoke API] Fallback error: ${err.message}`);
  }

  return '';
}

/**
 * Send a prompt to the Google Gemini REST API.
 */
async function queryGeminiDirect(
  prompt: string,
  systemInstruction?: string,
  options: AIOptions = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey || apiKey.includes('placeholder')) {
    return '';
  }

  const model = options.model || DEFAULT_GEMINI_MODEL;
  const temperature = options.temperature ?? 0.1;
  const maxTokens = options.maxTokens ?? 4096;
  const timeoutMs = options.timeoutMs ?? 30000;

  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;

  const body: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`[Gemini API] ${model} returned ${res.status}: ${res.statusText}`);
      return '';
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  } catch (err) {
    console.warn(`[Gemini API] ${model} call failed:`, err);
    return '';
  }
}

/**
 * Universal AI query function.
 * Automatically delegates to AWS Bedrock or Google Gemini depending on available API keys.
 * Preserves 100% backward compatibility with existing callers of queryGemini.
 */
export async function queryGemini(
  prompt: string,
  systemInstruction?: string,
  options: AIOptions = {}
): Promise<string> {
  const hasBedrockKey = !!(process.env.AWS_BEDROCK_API_KEY || process.env.BEDROCK_API_KEY);
  const hasGeminiKey = !!(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('placeholder'));

  // If explicitly requested or if Bedrock is configured and Gemini is not
  if (options.provider === 'bedrock' || (hasBedrockKey && !hasGeminiKey)) {
    const res = await queryBedrock(prompt, systemInstruction, options);
    if (res) return res;
  }

  // If Gemini is available
  if (hasGeminiKey) {
    const res = await queryGeminiDirect(prompt, systemInstruction, options);
    if (res) return res;
  }

  // Fallback to Bedrock if Gemini failed or wasn't primary
  if (hasBedrockKey) {
    return queryBedrock(prompt, systemInstruction, options);
  }

  return '';
}

/**
 * Helper to robustly extract and clean JSON string from LLM responses.
 */
function extractJSONString(raw: string): string {
  // 1. Remove markdown fences like ```json ... ```
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced && fenced[1]) {
    return fenced[1].trim();
  }

  // 2. Look for outer [ ... ] or { ... }
  const startArr = raw.indexOf('[');
  const startObj = raw.indexOf('{');

  if (startArr !== -1 && (startObj === -1 || startArr < startObj)) {
    const endArr = raw.lastIndexOf(']');
    if (endArr !== -1) return raw.substring(startArr, endArr + 1);
  }

  if (startObj !== -1) {
    const endObj = raw.lastIndexOf('}');
    if (endObj !== -1) return raw.substring(startObj, endObj + 1);
  }

  return raw.replace(/```json/g, '').replace(/```/g, '').trim();
}

/**
 * Query AI and parse the response as JSON.
 * Robustly strips markdown code fences and extracts arrays/objects before parsing.
 *
 * @returns Parsed JSON object, or null on failure
 */
export async function queryGeminiJSON<T = any>(
  prompt: string,
  systemInstruction?: string,
  options: AIOptions = {}
): Promise<T | null> {
  const raw = await queryGemini(prompt, systemInstruction, options);
  if (!raw) return null;

  try {
    const cleaned = extractJSONString(raw);
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn('[AI Client] JSON parse failed on raw output:', raw.slice(0, 300), err);
    return null;
  }
}
