'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, ShieldCheck, Zap, Lock, CreditCard, Sparkles, 
  ArrowRight, Building2, Mail, Globe, Phone, ExternalLink, RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';
import { PRICING_PLANS } from '@/lib/razorpay';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: 'starter' | 'growth' | 'enterprise';
  planPrice?: string;
  isAnnual: boolean;
  isDark?: boolean;
}

// Dynamically load Razorpay SDK script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  planId = 'growth',
  planPrice = '$149', 
  isAnnual, 
  isDark = true 
}: CheckoutModalProps) {
  const plan = PRICING_PLANS[planId] || PRICING_PLANS.growth;
  const amountInRupees = isAnnual ? plan.annualAmountInr : plan.monthlyAmountInr;
  const formattedInr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountInRupees);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    websiteUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error('Please enter your full name and work email.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load secure Razorpay gateway. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      // 2. Initialize Order on Server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          isAnnual,
          userDetails: formData,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        toast.error(orderData.error || 'Failed to create payment order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // 3. Configure Razorpay Standard Checkout Options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'TangentCore',
        description: `${plan.name} (${isAnnual ? 'Annual' : 'Monthly'} Subscription)`,
        image: '/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone || '',
        },
        notes: {
          planId: plan.id,
          company: formData.companyName,
          domain: formData.websiteUrl,
        },
        theme: {
          color: '#C7A15A', // Luxury gold brand theme
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.info('Payment window closed. You can resume checkout anytime.');
          },
        },
        handler: async (response: any) => {
          // 4. Verify Payment Signature on Server
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                isAnnual,
                userDetails: formData,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                planName: plan.name,
                billingCycle: isAnnual ? 'Annual' : 'Monthly',
                amount: formattedInr,
              });
              toast.success(`Payment verified! Welcome to TangentCore ${plan.name}.`);
            } else {
              toast.error(verifyData.error || 'Payment verification failed.');
            }
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            toast.error('Network error verifying payment. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (failureResponse: any) {
        setIsSubmitting(false);
        toast.error(failureResponse.error?.description || 'Payment failed. Please try a different card or UPI.');
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Razorpay initialization error:', err);
      toast.error('An error occurred during checkout initialization.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPaymentSuccess(null);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`relative w-full max-w-lg rounded-3xl border ${
            isDark 
              ? 'bg-[#121315] border-white/10 text-[#F6F6F4] shadow-2xl shadow-black/80' 
              : 'bg-white border-[#E5E3DF] text-[#181818] shadow-2xl'
          } p-5 sm:p-8 z-10 overflow-hidden my-auto`}
        >
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B87333] via-[#C7A15A] to-[#F5E8C7]" />
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-2 rounded-xl border ${
              isDark 
                ? 'bg-[#18191C] border-white/10 text-[#B7B7B5] hover:text-white' 
                : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#5C5C5C] hover:text-[#181818]'
            } transition-colors cursor-pointer`}
            aria-label="Close Checkout"
          >
            <X className="w-4 h-4" />
          </button>

          {paymentSuccess ? (
            /* PAYMENT SUCCESS SCREEN */
            <div className="py-6 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  Razorpay Payment Verified
                </span>
                <h3 className="text-2xl font-black">Subscription Activated!</h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'} max-w-sm mx-auto`}>
                  Welcome aboard, <strong className={isDark ? 'text-white' : 'text-[#181818]'}>{formData.fullName}</strong>. Your {paymentSuccess.planName} is now live with continuous multi-LLM engine monitoring.
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className={`p-4 rounded-2xl border text-left text-xs font-mono space-y-2.5 max-w-sm mx-auto ${
                isDark ? 'bg-[#18191C] border-white/10' : 'bg-[#F9F8F6] border-[#E5E3DF]'
              }`}>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'}>Plan:</span>
                  <span className="font-bold text-[#C7A15A]">{paymentSuccess.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'}>Billing:</span>
                  <span>{paymentSuccess.billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'}>Amount Paid:</span>
                  <span className="font-bold text-emerald-400">{paymentSuccess.amount}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-inherit">
                  <span className={isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'}>Payment ID:</span>
                  <span className="text-[10px] truncate max-w-[170px]">{paymentSuccess.paymentId}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href="/dashboard"
                  className="w-full py-3.5 rounded-2xl luxury-btn-primary font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open TangentCore Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className={`w-full py-2.5 rounded-xl border text-xs font-mono font-medium ${
                    isDark ? 'border-white/10 hover:bg-white/5' : 'border-[#E5E3DF] hover:bg-[#F6F5F3]'
                  }`}
                >
                  Close Receipt
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM SCREEN */
            <div className="space-y-5">
              {/* Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#C7A15A]/15 text-[#C7A15A] border border-[#C7A15A]/30">
                  <Sparkles className="w-3 h-3" />
                  <span>Razorpay Live Checkout</span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                  Activate {plan.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  Instant 6-LLM Citation Audit, Schema Repair & Priority Support.
                </p>
              </div>

              {/* Price Summary Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-[#18191C] border-[#C7A15A]/30' : 'bg-[#F9F8F6] border-[#B87333]/30'
              }`}>
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider block font-bold ${
                    isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'
                  }`}>
                    {isAnnual ? 'Annual Billed Amount' : 'Monthly Investment'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#C7A15A]">
                      {formattedInr}
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                      ({planPrice} USD)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    14-Day Money Back
                  </span>
                  <span className={`block text-[10px] font-mono mt-0.5 ${isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'}`}>
                    Cancel anytime
                  </span>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleRazorpayPayment} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`text-[11px] font-semibold font-mono ${isDark ? 'text-[#B7B7B5]' : 'text-[#4A4A4A]'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Alex Morgan"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                        isDark 
                          ? 'bg-[#1B1C1F] border-white/10 text-white placeholder-[#85858A] focus:border-[#C7A15A]' 
                          : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#181818] placeholder-[#7A7A7A] focus:border-[#B87333]'
                      } focus:outline-none transition-colors`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[11px] font-semibold font-mono flex items-center gap-1 ${
                      isDark ? 'text-[#B7B7B5]' : 'text-[#4A4A4A]'
                    }`}>
                      <Mail className="w-3 h-3 text-[#C7A15A]" />
                      <span>Work Email *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                        isDark 
                          ? 'bg-[#1B1C1F] border-white/10 text-white placeholder-[#85858A] focus:border-[#C7A15A]' 
                          : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#181818] placeholder-[#7A7A7A] focus:border-[#B87333]'
                      } focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`text-[11px] font-semibold font-mono flex items-center gap-1 ${
                      isDark ? 'text-[#B7B7B5]' : 'text-[#4A4A4A]'
                    }`}>
                      <Phone className="w-3 h-3 text-[#C7A15A]" />
                      <span>Phone / WhatsApp</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                        isDark 
                          ? 'bg-[#1B1C1F] border-white/10 text-white placeholder-[#85858A] focus:border-[#C7A15A]' 
                          : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#181818] placeholder-[#7A7A7A] focus:border-[#B87333]'
                      } focus:outline-none transition-colors`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[11px] font-semibold font-mono flex items-center gap-1 ${
                      isDark ? 'text-[#B7B7B5]' : 'text-[#4A4A4A]'
                    }`}>
                      <Globe className="w-3 h-3 text-[#C7A15A]" />
                      <span>Website Domain</span>
                    </label>
                    <input
                      type="text"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="e.g. yourbrand.com"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
                        isDark 
                          ? 'bg-[#1B1C1F] border-white/10 text-white placeholder-[#85858A] focus:border-[#C7A15A]' 
                          : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#181818] placeholder-[#7A7A7A] focus:border-[#B87333]'
                      } focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                {/* Razorpay Trust & Payment Methods Strip */}
                <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono ${
                  isDark ? 'bg-[#18191C] border-white/5 text-[#85858A]' : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#7A7A7A]'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Razorpay 256-Bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#C7A15A]">UPI</span>
                    <span>•</span>
                    <span>Cards</span>
                    <span>•</span>
                    <span>NetBanking</span>
                    <span>•</span>
                    <span>Wallets</span>
                  </div>
                </div>

                {/* Submit Payment CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl luxury-btn-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition-transform cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#111111]" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#111111]" />
                      <span>Pay Securely with Razorpay ({formattedInr})</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
