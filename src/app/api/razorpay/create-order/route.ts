import { NextResponse } from 'next/server';
import { createRazorpayOrder, PRICING_PLANS, RAZORPAY_KEY_ID } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId = 'growth', isAnnual = false, userDetails = {} } = body;

    const plan = PRICING_PLANS[planId] || PRICING_PLANS.growth;

    // Amount in INR rupees
    const amountInRupees = isAnnual ? plan.annualAmountInr : plan.monthlyAmountInr;
    // Razorpay requires amount in paise (1 INR = 100 paise)
    const amountInPaise = amountInRupees * 100;

    const receipt = `tc_${plan.id}_${Date.now()}`;

    const order = await createRazorpayOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        planId: plan.id,
        planName: plan.name,
        billingCycle: isAnnual ? 'annual' : 'monthly',
        customerName: userDetails.fullName || '',
        customerEmail: userDetails.email || '',
        companyName: userDetails.companyName || '',
        websiteUrl: userDetails.websiteUrl || '',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
      planName: plan.name,
      amountInRupees,
    });
  } catch (err: any) {
    console.error('Razorpay Create Order API Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to initialize payment order' },
      { status: 500 }
    );
  }
}

