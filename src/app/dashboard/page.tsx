'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AeoScoreCard } from '@/components/dashboard/aeo-score-card';
import { MultiModelHeatmap } from '@/components/dashboard/multi-model-heatmap';
import { CitationList } from '@/components/dashboard/citation-list';
import { GapAnalysisTable } from '@/components/dashboard/gap-analysis-table';
import { SiteCrawlerView } from '@/components/dashboard/site-crawler-view';
import { KeywordsResearchView } from '@/components/dashboard/keywords-research-view';
import { AnalysisAnimation } from '@/components/dashboard/analysis-animation';
import { ReportDownloadButton } from '@/components/dashboard/report-download-button';
import { AiBackground } from '@/components/ui/ai-background';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Navbar } from '@/components/navbar';
import { BrandLogo } from '@/components/ui/brand-logo';
import { ActionQueueView } from '@/components/dashboard/action-queue-view';
import { AiRadarSweep } from '@/components/dashboard/ai-radar-sweep';
import { AuditChecklistView } from '@/components/dashboard/audit-checklist-view';
import { SdkInstallModal } from '@/components/dashboard/sdk-install-modal';
import { PrintableExecutiveReport } from '@/components/dashboard/printable-executive-report';
import { LeadCaptureModal } from '@/components/dashboard/lead-capture-modal';
import { LeadDeliveryBadge } from '@/components/dashboard/lead-delivery-badge';
import {
  Brain, RefreshCw, LogOut, Globe, Sparkles, CheckCircle2,
  Search, Loader2, Sun, Moon, Layers, Target, Link2, Bot,
  TrendingUp, Building2, Cpu, Tag, Key, Zap, ExternalLink, Flame, X,
  Radar, ShieldCheck, Code, HelpCircle, MessageCircle, Mail
} from 'lucide-react';
import { toast } from 'sonner';

import { useTheme } from '@/components/theme-provider';

type ActiveTab = 'overview' | 'actions' | 'radar' | 'checklist' | 'crawler' | 'heatmap' | 'keywords' | 'citations' | 'gaps';

export default function DashboardPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSdkModalOpen, setIsSdkModalOpen] = useState(false);

  // GEO Studio Lead Capture & Delivery State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [whatsappDeliveryUrl, setWhatsappDeliveryUrl] = useState('');
  const [whatsappDeliveryText, setWhatsappDeliveryText] = useState('');

  // Analysis Inputs (Website URL + Optional Brand Name + Custom Prompt Count)
  const [targetDomainInput, setTargetDomainInput] = useState('');
  const [targetBrandInput, setTargetBrandInput] = useState('');
  const [selectedPromptCount, setSelectedPromptCount] = useState<number>(5);
  
  const [analyzedProjects, setAnalyzedProjects] = useState<any[]>([]);
  const [activeAuditData, setActiveAuditData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email || 'User');
      }
    });

    // Load cached audit and saved lead details from localStorage/sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('tangentcore_last_audit');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.domain) {
            setActiveAuditData(parsed);
            setAnalyzedProjects([parsed]);
          }
        }
        const savedName = sessionStorage.getItem('pendingLeadName') || localStorage.getItem('tangentcore_lead_name') || '';
        const savedEmail = sessionStorage.getItem('pendingLeadEmail') || localStorage.getItem('tangentcore_lead_email') || '';
        const savedPhone = sessionStorage.getItem('pendingLeadPhone') || localStorage.getItem('tangentcore_lead_phone') || '';
        if (savedName) setLeadName(savedName);
        if (savedEmail) setLeadEmail(savedEmail);
        if (savedPhone) setLeadPhone(savedPhone);
      } catch {
        // ignore
      }

      const pending = sessionStorage.getItem('pendingScanUrl');
      if (pending) {
        sessionStorage.removeItem('pendingScanUrl');
        setTargetDomainInput(pending);
        const lName = sessionStorage.getItem('pendingLeadName') || '';
        const lEmail = sessionStorage.getItem('pendingLeadEmail') || '';
        const lPhone = sessionStorage.getItem('pendingLeadPhone') || '';
        const sEmail = sessionStorage.getItem('pendingSendEmail') !== '0';
        const sWhatsapp = sessionStorage.getItem('pendingSendWhatsapp') !== '0';
        handleRunAnalysisForDomain(pending, '', {
          name: lName,
          email: lEmail,
          phone: lPhone,
          sendEmail: sEmail,
          sendWhatsapp: sWhatsapp,
        });
      }
    }
  }, []);

  const handleRunAnalysisForDomain = async (
    domainToScan: string,
    brandToScan: string = '',
    leadInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      sendEmail?: boolean;
      sendWhatsapp?: boolean;
    }
  ) => {
    try {
      setLoading(true);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domainToScan,
          brandName: brandToScan,
          promptCount: selectedPromptCount,
          isQuickScan: false,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to complete website analysis');
      }

      const data = await res.json();
      setActiveAuditData(data);
      setAnalyzedProjects((prev) => [data, ...prev.filter((p) => p.domain !== data.domain)]);
      try {
        localStorage.setItem('tangentcore_last_audit', JSON.stringify(data));
      } catch {
        // ignore
      }
      
      toast.success(`Complete AI & Technical Audit finished for ${data.domain}!`);
      setActiveTab('overview');

      // Dispatch audit report to user's Email & WhatsApp (GEO Studio Funnel)
      const currentEmail = leadInfo?.email || leadEmail;
      const currentPhone = leadInfo?.phone || leadPhone;
      const currentName = leadInfo?.name || leadName || 'Valued Brand';

      if (currentEmail || currentPhone) {
        try {
          const capRes = await fetch('/api/leads/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: currentName,
              email: currentEmail,
              phone: currentPhone,
              domain: data.domain,
              score: data.compositeGeoScore || data.pageAudit?.studioScore || 50,
              grade: data.grade || 'C',
              pageAudit: data.pageAudit,
              sendEmail: leadInfo?.sendEmail ?? true,
              sendWhatsapp: leadInfo?.sendWhatsapp ?? true,
            }),
          });
          if (capRes.ok) {
            const capData = await capRes.json();
            if (capData.whatsappUrl) {
              setWhatsappDeliveryUrl(capData.whatsappUrl);
              setWhatsappDeliveryText(capData.whatsappText);
            }
            toast.success('Executive audit delivered to your inbox and WhatsApp!');
          }
        } catch (leadErr) {
          console.warn('Lead dispatch error:', leadErr);
        }
      }

      // Reset domain/brand inputs
      setTargetDomainInput('');
      setTargetBrandInput('');
    } catch (err: any) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmitFromDashboard = (leadData: {
    name: string;
    email: string;
    phone: string;
    sendEmail: boolean;
    sendWhatsapp: boolean;
  }) => {
    setLeadName(leadData.name);
    setLeadEmail(leadData.email);
    setLeadPhone(leadData.phone);
    try {
      localStorage.setItem('tangentcore_lead_name', leadData.name);
      localStorage.setItem('tangentcore_lead_email', leadData.email);
      localStorage.setItem('tangentcore_lead_phone', leadData.phone);
    } catch {}
    setIsLeadModalOpen(false);
    handleRunAnalysisForDomain(targetDomainInput, targetBrandInput, leadData);
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetDomainInput) {
      toast.error('Please enter a website domain (e.g. stripe.com)');
      return;
    }
    // If user has not yet entered their details for this session, pop up the GEO Studio modal
    if (!leadEmail && !leadPhone) {
      setIsLeadModalOpen(true);
      return;
    }
    await handleRunAnalysisForDomain(targetDomainInput, targetBrandInput, {
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    window.location.href = '/login';
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#f8fafc] text-slate-900'} flex flex-col font-sans transition-colors duration-300 relative`}>
      <AiBackground isDark={isDark} />

      {/* Full-Screen Analysis Animation Overlay */}
      {loading && (
        <AnalysisAnimation
          domain={targetDomainInput || activeAuditData?.domain || 'website'}
          isDark={isDark}
          leadEmail={leadEmail}
          leadPhone={leadPhone}
        />
      )}

      {/* Top Header Navbar */}
      <div className="no-print print:hidden">
        <Navbar ctaText="Run AI Audit" ctaHref="#scanner" />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        <ScrollReveal variant="fadeUp" duration={0.5} className={`p-6 sm:p-8 rounded-3xl border ${
          isDark
            ? 'bg-[#101216]/95 border-white/[0.08] shadow-2xl backdrop-blur-2xl ring-1 ring-white/[0.05]'
            : 'bg-white border-slate-200/80 shadow-xl shadow-slate-200/50'
        } no-print print:hidden`}>
          {/* Header & Prompts Configuration */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] dark:border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isDark
                    ? 'bg-white/[0.06] text-white/90 border-white/[0.12]'
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>All-in-One AI & Technical Engine</span>
                </span>
                <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Live Multi-LLM Simulation
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Audit Any Website
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Tests 106-point technical checklist, generates Schema.org JSON-LD, and simulates buyer queries across ChatGPT, Gemini, Claude & Perplexity.
              </p>
            </div>

            {/* Prompt Count Selector */}
            <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
              <span className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Prompts:
              </span>
              <div className={`p-1 rounded-2xl border flex items-center gap-1 ${
                isDark ? 'bg-[#0B0C0E] border-white/[0.08]' : 'bg-slate-100 border-slate-200'
              }`}>
                {[3, 5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setSelectedPromptCount(count)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedPromptCount === count
                        ? isDark
                          ? 'bg-white text-black shadow-md font-extrabold'
                          : 'bg-slate-900 text-white shadow-sm font-extrabold'
                        : isDark
                        ? 'text-zinc-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Unified Input Form */}
          <form onSubmit={handleRunAnalysis} className="mt-6" suppressHydrationWarning>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="relative sm:col-span-6">
                <Globe className={`absolute left-4 top-3.5 h-4 w-4 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  suppressHydrationWarning
                  value={targetDomainInput}
                  onChange={(e) => setTargetDomainInput(e.target.value)}
                  placeholder="Website Domain (e.g. stripe.com, kalkifashion.com, amazon.in)"
                  required
                  className={`w-full ${
                    isDark
                      ? 'bg-[#0B0C0E] border-white/[0.08] text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  } border rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm focus:outline-none transition-all`}
                />
              </div>
              
              <div className="relative sm:col-span-3">
                <Building2 className={`absolute left-4 top-3.5 h-4 w-4 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  suppressHydrationWarning
                  value={targetBrandInput}
                  onChange={(e) => setTargetBrandInput(e.target.value)}
                  placeholder="Brand Name (Optional)"
                  className={`w-full ${
                    isDark
                      ? 'bg-[#0B0C0E] border-white/[0.08] text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  } border rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm focus:outline-none transition-all`}
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  suppressHydrationWarning
                  disabled={loading}
                  className={`w-full py-3.5 px-5 rounded-2xl ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:opacity-95 shadow-[0_0_25px_rgba(99,102,241,0.35)]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10'
                  } font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Auditing Website ({selectedPromptCount} Prompts)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Audit Website ({selectedPromptCount} Prompts)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Included Features Strip */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] dark:border-white/[0.06] flex flex-wrap items-center gap-2 sm:gap-3 text-[11px]">
            <span className={`font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Included in this scan:
            </span>
            <span className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 106-Point Technical Checklist
            </span>
            <span className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Schema.org & JSON-LD
            </span>
            <span className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-LLM Citation Sweep
            </span>
            <span className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Competitor Gap Tracking
            </span>
          </div>
        </ScrollReveal>

        {/* Analyzed Websites Switcher Tabs (Hidden during print) */}
        {analyzedProjects.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
            <span className={`text-xs font-bold ${isDark ? 'text-[#9E9E9E]' : 'text-slate-600'} uppercase tracking-wider shrink-0 mr-1`}>
              Recent Audits:
            </span>
            {analyzedProjects.map((proj) => {
              const isSelected = activeAuditData?.domain === proj.domain;
              return (
                <button
                  key={proj.domain}
                  onClick={() => {
                    setActiveAuditData(proj);
                    try { localStorage.setItem('tangentcore_last_audit', JSON.stringify(proj)); } catch {}
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 border ${
                    isSelected
                      ? isDark
                        ? 'bg-[#D4AF37] text-[#111111] border-[#D4AF37] font-extrabold shadow-sm'
                        : 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                      : isDark
                      ? 'bg-[#181818] border-[#2A2A2A] text-[#9E9E9E] hover:text-white hover:border-[#D4AF37]'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 shadow-2xs'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{proj.domain}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Audit Results View or Initial Empty State */}
        {!activeAuditData ? (
          <ScrollReveal variant="scaleUp" duration={0.55}>
            <div className={`p-12 text-center rounded-3xl border ${
              isDark
                ? 'bg-[#181818] border-[#2A2A2A]'
                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
            } space-y-4 max-w-xl mx-auto`}>
              <div className={`w-14 h-14 rounded-2xl ${
                isDark ? 'bg-[#202020] border border-[#2A2A2A] text-[#D4AF37]' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
              } border flex items-center justify-center mx-auto`}>
                <Search className="w-7 h-7" />
              </div>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                No Website Analyzed Yet
              </h3>
              <p className={`text-xs ${isDark ? 'text-[#CFCFCF]' : 'text-slate-600'} leading-relaxed font-medium`}>
                Enter any target domain in the search bar above to start live Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) multi-model auditing.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* SCREEN VIEW (Hidden during PDF print) */}
            <div className="space-y-6 print:hidden">
              {/* LAYER 1: Report Title & Action Buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                      isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Audit Complete: {activeAuditData.domain}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      isDark ? 'bg-white/[0.06] text-zinc-300 border-white/[0.12]' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      Multi-Model Audit ({activeAuditData.promptScans?.length || 5} Prompts)
                    </span>
                    {activeAuditData.metrics?.scanCost && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                        isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25' : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span>
                          Scan Cost: ${activeAuditData.metrics.scanCost.costUsd < 0.01 ? activeAuditData.metrics.scanCost.costUsd.toFixed(4) : activeAuditData.metrics.scanCost.costUsd.toFixed(3)} (₹{activeAuditData.metrics.scanCost.costInr}) • {activeAuditData.metrics.scanCost.totalTokens.toLocaleString()} Tokens
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {activeAuditData.pageAudit?.faviconUrl && (
                      <img
                        src={activeAuditData.pageAudit.faviconUrl}
                        alt={`${activeAuditData.domain} logo`}
                        className="w-8 h-8 rounded-lg object-contain"
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {activeAuditData.brandName} AI Search Visibility
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      if (whatsappDeliveryUrl) {
                        window.open(whatsappDeliveryUrl, '_blank');
                      } else {
                        const clean = (leadPhone || '').replace(/[^0-9]/g, '');
                        const txt = encodeURIComponent(`Hi, here is the TangentCore GEO Audit Report for ${activeAuditData.domain}: https://www.tangentcore.in/dashboard?domain=${activeAuditData.domain}`);
                        window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${txt}`, '_blank');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-all shadow-md shadow-emerald-500/20"
                    title="Send or Open in WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setIsSdkModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lime-400 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:bg-lime-300 transition-all shadow-[0_0_15px_rgba(216,243,28,0.2)]"
                  >
                    <Code className="w-4 h-4" /> Install 1-Line SDK
                  </button>
                  <ReportDownloadButton auditData={activeAuditData} isDark={isDark} />
                </div>
              </div>
              {/* LAYER 2: PingAura Competitor Management Module */}
              <div className={`p-6 rounded-3xl border ${
                isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'
              } space-y-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Competitors
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-[#9E9E9E]' : 'text-slate-500'} font-medium`}>
                      These decide who you are measured against.
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isDark ? 'bg-[#121212] text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {activeAuditData.autoDiscoveredCompetitors?.length || 0} Tracked
                  </span>
                </div>

                {/* Competitor Chips Grid */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {(!activeAuditData.autoDiscoveredCompetitors || activeAuditData.autoDiscoveredCompetitors.length === 0) && (
                    <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'} italic`}>
                      No competitors tracked yet. Add your direct industry competitors below to track share of voice gaps.
                    </p>
                  )}
                  {activeAuditData.autoDiscoveredCompetitors?.map((comp: string, cIdx: number) => {
                    const href = comp.startsWith('http') ? comp : `https://${comp}`;
                    const favUrl = activeAuditData.pageAudit?.competitorFavicons?.[comp] || `https://www.google.com/s2/favicons?domain=${comp}&sz=64`;
                    return (
                      <div
                        key={cIdx}
                        className={`px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2.5 ${
                          isDark
                            ? 'bg-[#121315] border-white/10 text-white hover:border-white/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={favUrl}
                          alt={comp}
                          className="w-4 h-4 rounded-sm object-contain"
                          onError={(e: any) => { e.target.style.display = 'none'; }}
                        />
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-xs hover:underline flex items-center gap-1"
                        >
                          <span>{comp}</span>
                          <ExternalLink className="w-3 h-3 opacity-40" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = activeAuditData.autoDiscoveredCompetitors.filter((_: string, i: number) => i !== cIdx);
                            setActiveAuditData({
                              ...activeAuditData,
                              autoDiscoveredCompetitors: updated,
                            });
                            toast.success(`Removed ${comp}`);
                          }}
                          className="p-0.5 rounded-full hover:bg-red-500/20 hover:text-red-400 text-slate-500 transition-colors ml-1"
                          title="Remove competitor"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Competitor Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const inputEl = e.currentTarget.elements.namedItem('customComp') as HTMLInputElement;
                    const val = inputEl.value.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
                    if (val && val.includes('.')) {
                      const current = activeAuditData.autoDiscoveredCompetitors || [];
                      if (!current.includes(val)) {
                        const updated = [...current, val];
                        setActiveAuditData({
                          ...activeAuditData,
                          autoDiscoveredCompetitors: updated,
                          pageAudit: {
                            ...activeAuditData.pageAudit,
                            competitorFavicons: {
                              ...(activeAuditData.pageAudit?.competitorFavicons || {}),
                              [val]: `https://www.google.com/s2/favicons?domain=${val}&sz=64`,
                            },
                          },
                        });
                        inputEl.value = '';
                        toast.success(`Added ${val} to competitors!`);
                      }
                    } else {
                      toast.error('Please enter a valid domain (e.g. adidas.com or jasper.ai)');
                    }
                  }}
                  className="flex items-center gap-2 pt-1 max-w-md"
                >
                  <input
                    name="customComp"
                    type="text"
                    placeholder="adidas.com"
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold border ${
                      isDark ? 'bg-[#0A0A0A] border-[#2A2A2A] text-white placeholder-slate-600 focus:border-[#D4AF37]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600'
                    } focus:outline-none transition-all`}
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isDark
                        ? 'bg-[#121315] border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]'
                        : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    + Add
                  </button>
                </form>
              </div>

              {/* LAYER 3: Full-Width Clean Segmented Navigation Tab Bar */}
              <ScrollReveal variant="fadeUp" delay={0.1} duration={0.45} className={`p-2 rounded-2xl border ${
                isDark ? 'bg-[#18191C] border-white/10' : 'bg-[#F4F3F0] border-[#E5E3DF]'
              } no-print`}>
                <div className="flex items-center gap-2.5 overflow-x-auto py-0.5 px-0.5 scrollbar-none">
                  {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'actions', label: 'Fix Executor', icon: Zap, badge: (activeAuditData.actionsQueue || []).length },
                    { id: 'radar', label: 'AI Radar & Sweeps', icon: Radar },
                    { id: 'checklist', label: '106 Checks Matrix', icon: ShieldCheck },
                    { id: 'crawler', label: 'Site Crawler & Schema', icon: Layers },
                    { id: 'heatmap', label: 'AI Heatmap', icon: Bot },
                    { id: 'keywords', label: 'Keywords', icon: Key },
                    { id: 'gaps', label: 'Gaps & GEO Briefs', icon: Target },
                    { id: 'citations', label: 'Citations Map', icon: Link2 },
                  ].map(({ id, label, icon: Icon, badge }) => {
                    const isActive = activeTab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id as ActiveTab)}
                        className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                          isActive
                            ? isDark
                              ? 'bg-white text-black border-white shadow-md font-black'
                              : 'bg-slate-900 text-white border-slate-900 shadow-md font-black'
                            : isDark
                            ? 'bg-[#141518] border-white/10 text-zinc-300 hover:text-white hover:border-white/25 hover:bg-[#1E2024]'
                            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-2xs'
                        }`}
                      >
                        <Icon className={`w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 ${
                          isActive
                            ? isDark ? 'text-black' : 'text-white'
                            : isDark ? 'text-zinc-400' : 'text-slate-500'
                        }`} />
                        <span>{label}</span>
                        {badge !== undefined && badge > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                            isActive
                              ? isDark ? 'bg-black text-white' : 'bg-white text-slate-900'
                              : isDark ? 'bg-white/10 text-zinc-200' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollReveal>

              {/* TAB CONTENT 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Bedrock AI Execution & Cost Card */}
                  {activeAuditData.metrics?.scanCost && (
                    <div className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isDark
                        ? 'bg-[#101216] border-white/10 shadow-xl'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        }`}>
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              AWS Bedrock Multi-Model Execution
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Live
                            </span>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'} mt-0.5`}>
                            Models evaluated: <strong className={isDark ? 'text-zinc-200' : 'text-slate-700'}>{activeAuditData.metrics.scanCost.modelsUsed.join(', ')}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 shrink-0 self-end md:self-center">
                        <div className="text-right">
                          <span className={`block text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            Tokens Used
                          </span>
                          <span className={`text-sm sm:text-base font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {activeAuditData.metrics.scanCost.totalTokens.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-8 w-px bg-white/10 dark:bg-white/10" />
                        <div className="text-right">
                          <span className={`block text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            Scan Cost (USD)
                          </span>
                          <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
                            ${activeAuditData.metrics.scanCost.costUsd < 0.01 ? activeAuditData.metrics.scanCost.costUsd.toFixed(4) : activeAuditData.metrics.scanCost.costUsd.toFixed(3)}
                          </span>
                        </div>
                        <div className="h-8 w-px bg-white/10 dark:bg-white/10" />
                        <div className="text-right">
                          <span className={`block text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            Scan Cost (INR)
                          </span>
                          <span className="text-sm sm:text-base font-black font-mono text-blue-400">
                            ₹{activeAuditData.metrics.scanCost.costInr.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <AeoScoreCard
                    overallGeoScore={activeAuditData.metrics?.overallGeoScore ?? 0}
                    schemaScore={activeAuditData.metrics?.schemaScore ?? 0}
                    citationScore={activeAuditData.metrics?.citationScore ?? 0}
                    entityScore={activeAuditData.metrics?.entityScore ?? 0}
                    readabilityScore={activeAuditData.metrics?.readabilityScore ?? 0}
                    shareOfVoice={activeAuditData.metrics?.shareOfVoice ?? 0}
                    isDark={isDark}
                  />

                  {activeAuditData.pageAudit?.recommendations?.length > 0 && (
                    <div className={`p-6 rounded-3xl border ${
                      isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <h3 className={`text-sm font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                        isDark ? 'text-cyan-400' : 'text-cyan-700'
                      }`}>
                        <Sparkles className="w-4 h-4 text-cyan-600" /> Top Actionable GEO Fixes for {activeAuditData.domain}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {activeAuditData.pageAudit.recommendations.map((rec: string, rIdx: number) => (
                          <div key={rIdx} className={`p-3.5 rounded-2xl border ${
                            isDark ? 'bg-[#121315] border-white/10 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-900 font-semibold'
                          } flex items-start gap-2.5`}>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <MultiModelHeatmap promptScans={activeAuditData.promptScans || []} isDark={isDark} />
                </div>
              )}

              {/* TAB CONTENT 2: CRAWLER & SCHEMA */}
              {activeTab === 'crawler' && (
                <SiteCrawlerView pageAudit={activeAuditData.pageAudit} isDark={isDark} />
              )}

              {/* TAB CONTENT 3: HEATMAP */}
              {activeTab === 'heatmap' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-3xl border ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md shadow-slate-200/50'
                  } flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                          isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          <Flame className="w-3.5 h-3.5 inline mr-1 text-amber-400 fill-amber-400" /> AI Matrix Studio
                        </span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} font-semibold`}>
                          {activeAuditData.domain}
                        </span>
                      </div>
                      <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                        AI Multi-Model Search Engine Heatmap Studio
                      </h2>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium mt-1`}>
                        Evaluate brand recommendations across ChatGPT (GPT-4o), Google Gemini 2.5, Claude Sonnet 4, and DeepSeek V3.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className={`px-4 py-2.5 rounded-2xl border text-center ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Share of Voice</span>
                        <span className="text-lg font-black text-cyan-400">{activeAuditData.metrics?.shareOfVoice ?? 0}%</span>
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl border text-center ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Prompts</span>
                        <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeAuditData.promptScans?.length ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  <MultiModelHeatmap promptScans={activeAuditData.promptScans || []} isDark={isDark} />
                </div>
              )}

              {/* TAB CONTENT 4: KEYWORDS & RESEARCH */}
              {activeTab === 'keywords' && (
                <KeywordsResearchView
                  domain={activeAuditData.domain}
                  extractedKeywords={activeAuditData.autoDiscoveredKeywords || []}
                  isDark={isDark}
                />
              )}

              {/* TAB CONTENT 5: GAPS */}
              {activeTab === 'gaps' && (
                <GapAnalysisTable gaps={activeAuditData.gaps || []} isDark={isDark} />
              )}

              {/* TAB CONTENT 5: CITATIONS */}
              {activeTab === 'citations' && (
                <CitationList
                  citations={activeAuditData.citations}
                  promptScans={activeAuditData.promptScans}
                  domain={activeAuditData.domain}
                  isDark={isDark}
                />
              )}

              {/* TAB CONTENT 6: ACTIONS (THE AUTONOMOUS FIX EXECUTOR) */}
              {activeTab === 'actions' && (
                <ActionQueueView
                  actions={activeAuditData.actionsQueue || []}
                  domain={activeAuditData.domain}
                  onOpenSdkModal={() => setIsSdkModalOpen(true)}
                  isDark={isDark}
                />
              )}

              {/* TAB CONTENT 7: AI RADAR SWEEPS */}
              {activeTab === 'radar' && (
                <AiRadarSweep
                  prompts={activeAuditData.promptScans || []}
                  domain={activeAuditData.domain}
                  brandName={activeAuditData.brandName}
                  isDark={isDark}
                />
              )}

              {/* TAB CONTENT 8: 106-POINT AUDIT CHECKLIST */}
              {activeTab === 'checklist' && (
                <AuditChecklistView
                  checklist={activeAuditData.auditChecklist || []}
                  domain={activeAuditData.domain}
                  onNavigateToActions={() => setActiveTab('actions')}
                  isDark={isDark}
                />
              )}
            </div>

            {/* DEDICATED MULTI-PAGE EXECUTIVE PRINT REPORT (GEO STUDIO PARITY) */}
            <PrintableExecutiveReport auditData={activeAuditData} />

            {/* GEO Studio Parity: Delivery Status Badge (Bottom Right) */}
            <LeadDeliveryBadge
              email={leadEmail}
              phone={leadPhone}
              whatsappUrl={whatsappDeliveryUrl}
              whatsappText={whatsappDeliveryText}
              domain={activeAuditData.domain}
              isDark={isDark}
            />
          </>
        )}

        {/* GEO Studio Lead Capture Modal */}
        <LeadCaptureModal
          isOpen={isLeadModalOpen}
          domain={targetDomainInput || 'your website'}
          onClose={() => setIsLeadModalOpen(false)}
          onSubmit={handleLeadSubmitFromDashboard}
          isDark={isDark}
        />

        <SdkInstallModal
          isOpen={isSdkModalOpen}
          onClose={() => setIsSdkModalOpen(false)}
          domain={activeAuditData?.domain || ''}
        />
      </main>

      <footer className={`border-t ${isDark ? 'border-slate-800/80 bg-slate-950' : 'border-slate-200 bg-white'} py-6 text-center text-xs text-slate-500 no-print print:hidden`}>
        © {new Date().getFullYear()} TangentCore (<a href="https://tangentcore.in" target="_blank" rel="noreferrer" className="text-cyan-500 hover:underline font-bold">tangentcore.in</a>). Unlimited Multi-Model Search Engine Analytics.
      </footer>
    </div>
  );
}
