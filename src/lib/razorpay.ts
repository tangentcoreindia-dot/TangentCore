import crypto from 'crypto';

export interface PlanConfig {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  monthlyAmountInr: number; // in Rupees
  annualAmountInr: number; // in Rupees
  monthlyAmountUsd: number;
  annualAmountUsd: number;
  description: string;
}

export const PRICING_PLANS: Record<string, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    monthlyAmountInr: 3299,
    annualAmountInr: 31499,
    monthlyAmountUsd: 39,
    annualAmountUsd: 372,
    description: 'Essential GEO scanning for startups & single product websites (2 LLMs, 15 Prompt Keywords).',
  },
  growth: {
    id: 'growth',
    name: 'Growth Dominator',
    monthlyAmountInr: 12499,
    annualAmountInr: 119999,
    monthlyAmountUsd: 149,
    annualAmountUsd: 1428,
    description: 'Complete Multi-LLM GEO suite for high-growth brands seeking #1 recommendations on AI search.',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Scale',
    monthlyAmountInr: 32999,
    annualAmountInr: 319999,
    monthlyAmountUsd: 399,
    annualAmountUsd: 3828,
    description: 'Full multi-brand corporate suite with custom API integrations and dedicated GEO strategist.',
  },
};

export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  'rzp_live_TuVbNSiePj0Pz7';

export const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || 'V6JoLMEMEOaR2qvWODv2blGB';

/**
 * Creates an official Razorpay Order via REST API.
 * Amount is in paise (1 INR = 100 paise).
 */
export async function createRazorpayOrder({
  amount,
  currency = 'INR',
  receipt,
  notes = {},
}: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Razorpay Order Error:', data);
    throw new Error(data.error?.description || 'Failed to create Razorpay order');
  }

  return data;
}

/**
 * Verifies the cryptographic HMAC SHA-256 signature returned by Razorpay Checkout.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!orderId || !paymentId || !signature) return false;

  const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
  hmac.update(`${orderId}|${paymentId}`);
  const expectedSignature = hmac.digest('hex');

  return expectedSignature === signature;
}

