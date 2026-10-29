'use client';

import { useState } from 'react';
import {
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck,
  Copy, Check, Code, RefreshCw, Zap, ExternalLink, Download, Eye, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';

export interface DeployableFixAction {
  id: string;
  title: string;
  category: 'schema' | 'metadata' | 'readability' | 'crawlability' | 'llms_txt';
  severity: 'critical' | 'warning' | 'opportunity';
  impactPoints: number;
  targetPage: string;
  description: string;
  currentCode: string;
  suggestedCode: string;
  codeType: 'json' | 'html' | 'text';
  status: 'pending' | 'deployed' | 'verified';
  deployType: 'sdk' | 'manual';
  verifiedAt?: string;
}

interface ActionQueueViewProps {
  actions: DeployableFixAction[];
  domain: string;
  onOpenSdkModal?: () => void;
  isDark?: boolean;
}

export function ActionQueueView({ actions: initialActions = [], domain, onOpenSdkModal, isDark: propIsDark }: ActionQueueViewProps) {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  const [actions, setActions] = useState<DeployableFixAction[]>(initialActions);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'schema' | 'metadata' | 'deployed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Markup copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleDeploy = (id: string) => {
    setActions(prev => prev.map(a => {
      if (a.id === id) {
        const isNowDeployed = a.status !== 'deployed' && a.status !== 'verified';
        const nextStatus = isNowDeployed ? 'deployed' : 'pending';
        if (isNowDeployed) {
          toast.success(`Action "${a.title}" deployed via TangentCore SDK!`);
        } else {
          toast.info(`Action "${a.title}" reverted to pending.`);
        }
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleVerifyLive = async (action: DeployableFixAction) => {
    try {
      setVerifyingId(action.id);
      const res = await fetch('/api/verify-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: `https://${domain}${action.targetPage === '/' ? '' : action.targetPage}`,
          fixType: action.category === 'schema' ? 'schema' : action.category === 'metadata' ? 'metadata' : 'text',
          expectedSnippet: action.category === 'schema' ? 'schema.org' : '',
        }),
      });

      const data = await res.json();
      if (data.verified) {
        setActions(prev => prev.map(a => a.id === action.id ? { ...a, status: 'verified', verifiedAt: new Date().toLocaleTimeString() } : a));
        toast.success(`Live Verification Passed: ${data.message}`);
      } else {
        toast.warning(`Verification pending: ${data.message}`);
      }
    } catch {
      toast.error('Failed to verify live status');
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredActions = actions.filter(a => {
    if (activeFilter === 'critical') return a.severity === 'critical';
    if (activeFilter === 'schema') return a.category === 'schema';
    if (activeFilter === 'metadata') return a.category === 'metadata';
    if (activeFilter === 'deployed') return a.status === 'deployed' || a.status === 'verified';
    return true;
  });

  const totalImpact = actions.reduce((acc, curr) => acc + (curr.impactPoints || 0), 0);
  const deployedCount = actions.filter(a => a.status === 'deployed' || a.status === 'verified').length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Autonomous Execution Stats */}
      <div className={`relative overflow-hidden rounded-3xl border p-5 sm:p-7 transition-all ${
        isDark
          ? 'bg-[#181818] border-[#2A2A2A] shadow-md'
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs font-mono font-extrabold uppercase tracking-wider ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                Autonomous GEO Fix Executor
              </span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Deployable Action Queue
            </h3>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}>
              Don't just read an audit report. Deploy verified JSON-LD schema, meta optimization, and answerability markup directly to your website with 1-click execution or instant rollback.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end shrink-0">
            <div className={`rounded-2xl border px-4 py-2.5 flex-1 sm:flex-none text-left sm:text-right ${
              isDark ? 'bg-[#121315] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                Potential Boost
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">
                +{totalImpact.toFixed(1)} pts
              </div>
            </div>

            {onOpenSdkModal && (
              <button
                onClick={onOpenSdkModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 shrink-0"
              >
                <Code className="w-4 h-4" /> Install 1-Line SDK
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation */}
        <div className={`mt-6 flex items-center gap-2 overflow-x-auto pb-1 pt-4 border-t no-scrollbar ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              activeFilter === 'all'
                ? isDark
                  ? 'bg-white text-black border-white'
                  : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : isDark
                ? 'bg-[#121315] text-zinc-300 border-white/10 hover:border-white/20'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            All Actions ({actions.length})
          </button>
          <button
            onClick={() => setActiveFilter('critical')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              activeFilter === 'critical'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : isDark
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            Critical Issues ({actions.filter(a => a.severity === 'critical').length})
          </button>
          <button
            onClick={() => setActiveFilter('schema')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              activeFilter === 'schema'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : isDark
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Structured Data ({actions.filter(a => a.category === 'schema').length})
          </button>
          <button
            onClick={() => setActiveFilter('metadata')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              activeFilter === 'metadata'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : isDark
                ? 'bg-sky-500/10 text-sky-300 border-sky-500/20 hover:bg-sky-500/20'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
          >
            Metadata ({actions.filter(a => a.category === 'metadata').length})
          </button>
          <button
            onClick={() => setActiveFilter('deployed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              activeFilter === 'deployed'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : isDark
                ? 'bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20'
                : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
            }`}
          >
            Active Deployed ({deployedCount})
          </button>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="space-y-4">
        {filteredActions.length === 0 ? (
          <div className={`rounded-3xl border p-12 text-center ${
            isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No actions match this filter
            </h4>
            <p className={`text-xs mt-1 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              All issues in this category are resolved or up to date.
            </p>
          </div>
        ) : (
          filteredActions.map((action) => {
            const isDeployed = action.status === 'deployed' || action.status === 'verified';
            const isVerified = action.status === 'verified';

            return (
              <div
                key={action.id}
                className={`rounded-3xl border transition-all duration-300 p-5 sm:p-7 shadow-sm ${
                  isVerified
                    ? isDark ? 'border-emerald-500/50 bg-[#101F18]' : 'border-emerald-300 bg-emerald-50/50'
                    : isDeployed
                    ? isDark ? 'border-lime-500/50 bg-[#162114]' : 'border-lime-300 bg-lime-50/40'
                    : isDark ? 'border-[#2A2A2A] bg-[#181818]' : 'border-slate-200 bg-white'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {action.severity === 'critical' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-600/15 border border-rose-500/30 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" /> Critical
                      </span>
                    ) : action.severity === 'warning' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Warning
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Optimization
                      </span>
                    )}

                    <span className={`rounded-lg border px-2.5 py-1 text-xs font-mono font-bold ${
                      isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      Target: {action.targetPage}
                    </span>

                    <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      +{action.impactPoints.toFixed(1)} pts
                    </span>

                    {isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Live Verified
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => handleToggleDeploy(action.id)}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all shadow-xs ${
                        isDeployed
                          ? isDark
                            ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-white/10'
                            : 'bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isDeployed ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" /> Rollback
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" /> Apply Fix via SDK
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleVerifyLive(action)}
                      disabled={verifyingId === action.id}
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all disabled:opacity-50 ${
                        isDark
                          ? 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200'
                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {verifyingId === action.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      <span>Verify Live</span>
                    </button>

                    <button
                      onClick={() => handleCopyCode(action.id, action.suggestedCode)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isDark
                          ? 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200'
                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                      title="Copy code"
                    >
                      {copiedId === action.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mt-4">
                  <h4 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {action.title}
                  </h4>
                  <p className={`text-xs sm:text-sm font-medium mt-1 leading-relaxed ${
                    isDark ? 'text-zinc-300' : 'text-slate-600'
                  }`}>
                    {action.description}
                  </p>
                </div>

                {/* Before vs After Code Diff Box */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
                  {/* Current (Before) */}
                  <div className={`rounded-2xl border p-4 ${
                    isDark
                      ? 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                      : 'border-rose-200 bg-rose-50/80 text-rose-950'
                  }`}>
                    <div className="text-[11px] uppercase font-black tracking-wider mb-2 flex items-center justify-between text-rose-600 dark:text-rose-400">
                      <span>Current State</span>
                      <span className="font-bold opacity-75">Before Fix</span>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap max-h-44 text-[11px] leading-relaxed scrollbar-thin">
                      {action.currentCode}
                    </pre>
                  </div>

                  {/* Suggested (After) */}
                  <div className={`rounded-2xl border p-4 ${
                    isDark
                      ? 'border-emerald-500/30 bg-emerald-950/25 text-emerald-200'
                      : 'border-emerald-300 bg-emerald-50/80 text-emerald-950'
                  }`}>
                    <div className="text-[11px] uppercase font-black tracking-wider mb-2 flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Suggested Fix (Ready to Ship)</span>
                      <span className="font-bold opacity-75">After Fix</span>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap max-h-44 text-[11px] font-semibold leading-relaxed scrollbar-thin">
                      {action.suggestedCode}
                    </pre>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
