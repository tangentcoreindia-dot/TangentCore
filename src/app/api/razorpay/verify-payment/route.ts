import { NextResponse } from 'next/server';
import { verifyRazorpaySignature, PRICING_PLANS } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId = 'growth',
      isAnnual = false,
      userDetails = {},
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment credentials' },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error('Invalid Razorpay signature for payment:', razorpay_payment_id);
      return NextResponse.json(
        { error: 'Payment signature verification failed. Transaction flagged as untrusted.' },
        { status: 400 }
      );
    }

    const plan = PRICING_PLANS[planId] || PRICING_PLANS.growth;
    const amountInRupees = isAnnual ? plan.annualAmountInr : plan.monthlyAmountInr;

    // Attempt to log transaction in Supabase
    try {
      const supabase = createClient();
      await supabase.from('payments').insert({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        amount: amountInRupees,
        currency: 'INR',
        status: 'captured',
        plan_id: plan.id,
        plan_name: plan.name,
        billing_cycle: isAnnual ? 'annual' : 'monthly',
        customer_name: userDetails.fullName || '',
        customer_email: userDetails.email || '',
        customer_company: userDetails.companyName || '',
        customer_website: userDetails.websiteUrl || '',
        metadata: {
          signatureVerified: true,
          verifiedAt: new Date().toISOString(),
          phone: userDetails.phone || '',
        },
      });
    } catch (dbErr) {
      console.warn('Database logging warning for payment (continuing with success response):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Welcome to TangentCore!',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      planName: plan.name,
      billingCycle: isAnnual ? 'Annual' : 'Monthly',
      amountInRupees,
    });
  } catch (err: any) {
    console.error('Razorpay Verify Payment API Error:', err);
    return NextResponse.json(
      { error: err.message || 'Payment verification processing failed' },
      { status: 500 }
    );
  }
}

