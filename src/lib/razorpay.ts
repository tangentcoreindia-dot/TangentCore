import crypto from 'crypto';
import { PRICING_PLANS, PlanConfig } from './pricing-plans';

export { PRICING_PLANS };
export type { PlanConfig };

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

