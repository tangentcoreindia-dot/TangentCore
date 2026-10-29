'use client';

import { useState } from 'react';
import { Mail, MessageCircle, ExternalLink, CheckCircle2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface LeadDeliveryBadgeProps {
  email?: string;
  phone?: string;
  whatsappUrl?: string;
  whatsappText?: string;
  domain: string;
  isDark?: boolean;
}

export function LeadDeliveryBadge({
  email,
  phone,
  whatsappUrl,
  whatsappText,
  domain,
  isDark = true,
}: LeadDeliveryBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyWhatsapp = () => {
    if (whatsappText) {
      navigator.clipboard.writeText(whatsappText);
      setCopied(true);
      toast.success('WhatsApp executive summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenWhatsapp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    } else {
      const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
      const text = encodeURIComponent(`Hi, here is the TangentCore GEO Audit Report for ${domain}: https://www.tangentcore.in/dashboard?domain=${domain}`);
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`, '_blank');
    }
  };

  return (
    <>
      {/* Floating or Fixed Status Widget (Matches GEO Studio media_1793196317290.png) */}
      <div className="fixed bottom-5 right-5 z-40 animate-fade-in no-print print:hidden">
        <button
          onClick={() => setShowModal(true)}
          type="button"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
            isDark
              ? 'bg-[#121217]/95 border-[#2A2A38] text-white hover:border-[#C7A15A]/50 shadow-black/80'
              : 'bg-white/95 border-slate-200 text-slate-800 hover:border-slate-300 shadow-xl'
          } backdrop-blur-md`}
        >
          {/* Dual Icons: Gmail & WhatsApp */}
          <div className="flex items-center -space-x-1.5">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-md p-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#25D366] flex items-center justify-center shadow-md p-1 text-white">
              <MessageCircle className="w-5 h-5 fill-white stroke-none" />
            </div>
          </div>

          {/* Delivery Text */}
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Delivered
            </div>
            <div className="text-xs font-semibold text-slate-300">
              Delivered to your inbox & WhatsApp
            </div>
          </div>
        </button>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isDark ? 'bg-[#141419] border-[#2A2A38] text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Delivery Channels</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-bold">Email Report</div>
                    <div className="text-xs font-semibold text-slate-200">{email || 'Queued / Sent'}</div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Delivered
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-bold">WhatsApp Report</div>
                    <div className="text-xs font-semibold text-slate-200">{phone || 'Direct Chat Ready'}</div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleOpenWhatsapp}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyWhatsapp}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-all"
                title="Copy WhatsApp Summary"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
