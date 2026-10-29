'use client';

import { useState } from 'react';
import { Sparkles, Mail, Phone, User, Check, X, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  domain: string;
  onClose: () => void;
  onSubmit: (leadData: {
    name: string;
    email: string;
    phone: string;
    sendEmail: boolean;
    sendWhatsapp: boolean;
  }) => void;
  isDark?: boolean;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada' },
];

export function LeadCaptureModal({
  isOpen,
  domain,
  onClose,
  onSubmit,
  isDark = true,
}: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Please enter a valid work email';
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid WhatsApp number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: fullPhone,
      sendEmail,
      sendWhatsapp,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 sm:p-8 transition-all ${
          isDark
            ? 'bg-[#121216] border-[#2A2A35] text-white shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#C7A15A]/15 text-[#C7A15A] border border-[#C7A15A]/30">
            <Sparkles className="w-3.5 h-3.5" />
            GEO Studio Instant Delivery
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold tracking-tight mb-1">
          Where should we send your report?
        </h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Generating a 106-signal audit for <span className="font-semibold text-[#C7A15A]">{domain || 'your website'}</span>. Your executive report will be delivered instantly.
        </p>

        {/* Lead Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Alex Sharma"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isDark
                    ? 'bg-[#181820] border-[#2A2A35] text-white placeholder-slate-500 focus:border-[#C7A15A] focus:ring-1 focus:ring-[#C7A15A]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#C7A15A]'
                } ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Business / Work Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="alex@company.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isDark
                    ? 'bg-[#181820] border-[#2A2A35] text-white placeholder-slate-500 focus:border-[#C7A15A] focus:ring-1 focus:ring-[#C7A15A]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#C7A15A]'
                } ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* WhatsApp / Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              WhatsApp Phone Number *
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className={`px-3 py-3 rounded-xl border text-sm font-bold transition-all ${
                  isDark
                    ? 'bg-[#181820] border-[#2A2A35] text-white focus:border-[#C7A15A]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#C7A15A]'
                }`}
              >
                {COUNTRY_CODES.map((c, i) => (
                  <option key={`${c.country}-${i}`} value={c.code} className="bg-[#181820] text-white">
                    {c.flag} {c.code} ({c.country})
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="98765 43210"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    isDark
                      ? 'bg-[#181820] border-[#2A2A35] text-white placeholder-slate-500 focus:border-[#C7A15A] focus:ring-1 focus:ring-[#C7A15A]'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#C7A15A]'
                  } ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Delivery Channels Checkboxes */}
          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group text-xs text-slate-300">
              <input
                type="checkbox"
                checked={sendWhatsapp}
                onChange={(e) => setSendWhatsapp(e.target.checked)}
                className="w-4 h-4 rounded border-[#2A2A35] text-[#C7A15A] focus:ring-[#C7A15A]"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                Send instant report & executive score to WhatsApp
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group text-xs text-slate-300">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 rounded border-[#2A2A35] text-[#C7A15A] focus:ring-[#C7A15A]"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Email me the complete 9-section PDF report
              </span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm text-black bg-gradient-to-r from-[#C7A15A] via-[#E2C485] to-[#C7A15A] hover:brightness-110 shadow-lg shadow-[#C7A15A]/25 transition-all transform active:scale-[0.99]"
          >
            <span>Run Free AI Audit & Send Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Guarantee */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C7A15A]" />
          <span>Zero spam guaranteed. Delivered directly to your verified channels.</span>
        </div>
      </div>
    </div>
  );
}
