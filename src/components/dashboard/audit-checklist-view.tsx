'use client';

import { useState } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, Search, Filter,
  ShieldCheck, FileCode, Bot, Cpu, Zap, ArrowRight, Layers
} from 'lucide-react';
import { AuditCheckItem } from '@/lib/aeo-engine/page-analyzer';
import { useTheme } from '@/components/theme-provider';

interface AuditChecklistViewProps {
  checklist: AuditCheckItem[];
  domain?: string;
  onNavigateToActions?: () => void;
  onFixClick?: () => void;
  isDark?: boolean;
}

export function AuditChecklistView({
  checklist = [],
  domain,
  onNavigateToActions,
  onFixClick,
  isDark: propIsDark
}: AuditChecklistViewProps) {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;
  const handleFixRedirect = onNavigateToActions || onFixClick;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'warn' | 'fail'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: 'All Checks (106)', icon: Layers },
    { key: 'structured_data', label: 'Structured Data', icon: FileCode },
    { key: 'ai_readability', label: 'AI Readability', icon: Bot },
    { key: 'crawlability', label: 'Crawlability & SSR', icon: Cpu },
    { key: 'technical_seo', label: 'Technical SEO', icon: Zap },
    { key: 'entity_clarity', label: 'Entity Clarity', icon: ShieldCheck },
  ];

  const filteredItems = checklist.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.finding.toLowerCase().includes(q);
    }
    return true;
  });

  const passCount = checklist.filter(c => c.status === 'pass').length;
  const warnCount = checklist.filter(c => c.status === 'warn').length;
  const failCount = checklist.filter(c => c.status === 'fail').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl border p-5 sm:p-7 transition-all ${
        isDark ? 'bg-[#181818] border-[#2A2A2A] shadow-md' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs font-mono font-extrabold uppercase tracking-wider ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                106-Point GEO Audit Matrix
              </span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Audit Matrix & Check Inspection
            </h3>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-2xl ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}>
              Transparent, itemized checks evaluating raw pre-JS crawlability, JSON-LD schemas, LLM entity clarity, and direct answerability.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto shrink-0 font-mono text-center">
            <button
              onClick={() => setStatusFilter(statusFilter === 'pass' ? 'all' : 'pass')}
              className={`p-3 rounded-2xl border transition-all ${
                statusFilter === 'pass' ? 'ring-2 ring-emerald-500' : ''
              } ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="font-black text-xl sm:text-2xl">{passCount}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider">Passed</div>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'warn' ? 'all' : 'warn')}
              className={`p-3 rounded-2xl border transition-all ${
                statusFilter === 'warn' ? 'ring-2 ring-amber-500' : ''
              } ${
                isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="font-black text-xl sm:text-2xl">{warnCount}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider">Warnings</div>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'fail' ? 'all' : 'fail')}
              className={`p-3 rounded-2xl border transition-all ${
                statusFilter === 'fail' ? 'ring-2 ring-rose-500' : ''
              } ${
                isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="font-black text-xl sm:text-2xl">{failCount}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider">Fixes Needed</div>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className={`mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-t pt-4 ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isSelected
                      ? isDark
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : isDark
                      ? 'bg-[#121315] text-zinc-300 border-white/10 hover:border-white/20'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStatusFilter(statusFilter === 'fail' ? 'all' : 'fail')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === 'fail'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : isDark
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              Only Fixes
            </button>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Checks List */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        isDark ? 'border-[#2A2A2A] bg-[#181818] divide-y divide-white/5' : 'border-slate-200 bg-white divide-y divide-slate-100 shadow-sm'
      }`}>
        {filteredItems.length === 0 ? (
          <div className={`p-12 text-center text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            No audit checks found matching the selected filter.
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="mt-0.5 shrink-0">
                  {item.status === 'pass' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : item.status === 'warn' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm sm:text-base font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {item.name}
                    </h4>
                    <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                      isDark ? 'bg-white/5 text-zinc-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      +{item.impact.toFixed(1)} pts
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
                    isDark ? 'text-zinc-300' : 'text-slate-600'
                  }`}>
                    {item.finding}
                  </p>
                </div>
              </div>

              {item.fixDescription && handleFixRedirect && (
                <button
                  onClick={handleFixRedirect}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs w-full md:w-auto ${
                    isDark
                      ? 'bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <span>View Fix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
