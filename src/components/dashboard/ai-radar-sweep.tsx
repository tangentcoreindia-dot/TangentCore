'use client';

import { useState } from 'react';
import {
  Radar, RefreshCw, AlertCircle, CheckCircle2, AlertTriangle,
  TrendingUp, Sparkles, ExternalLink, ShieldCheck, Flame, Bell, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';

interface PromptItem {
  promptText: string;
  category: string;
  shareOfVoice: number;
  modelResults: Array<{
    modelName: string;
    modelLabel: string;
    brandMentioned: boolean;
    rankPosition: number;
    responseText: string;
    citations: string[];
  }>;
}

interface AiRadarSweepProps {
  prompts: PromptItem[];
  domain: string;
  brandName: string;
  isDark?: boolean;
}

export function AiRadarSweep({ prompts = [], domain, brandName, isDark: propIsDark }: AiRadarSweepProps) {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(prompts[0] || null);
  const [isSweeping, setIsSweeping] = useState(false);

  // Compute Engine Stats
  const engines = [
    { name: 'chatgpt', label: 'ChatGPT (GPT-4o)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { name: 'claude', label: 'Claude Sonnet 4', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    { name: 'perplexity', label: 'Perplexity Search', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.15)' },
    { name: 'gemini', label: 'Google Gemini 2.5', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.15)' },
  ];

  const engineStats = engines.map(eng => {
    let mentionedCount = 0;
    prompts.forEach(p => {
      const match = p.modelResults?.find(m => m.modelName?.toLowerCase().includes(eng.name));
      if (match && match.brandMentioned) mentionedCount++;
    });
    const percentage = prompts.length > 0 ? Math.round((mentionedCount / prompts.length) * 100) : 0;
    return { ...eng, percentage, count: mentionedCount };
  });

  const handleSimulateSweep = () => {
    setIsSweeping(true);
    toast.info('Initiating live radar sweep across ChatGPT, Claude, Perplexity & Gemini...');
    setTimeout(() => {
      setIsSweeping(false);
      toast.success('Live AI radar sweep complete. All prompt coordinates updated.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className={`relative overflow-hidden rounded-3xl border p-5 sm:p-7 transition-all ${
        isDark ? 'bg-[#181818] border-[#2A2A2A] shadow-md' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs font-mono font-extrabold uppercase tracking-wider ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                Live Answer Engine Monitoring
              </span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              AI Visibility Radar & Drop Alert Sweep
            </h3>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-2xl ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}>
              Know the exact moment an AI engine stops citing your brand. Prompts mapped to real-time citation frequency across ChatGPT, Claude, Perplexity, and Gemini.
            </p>
          </div>

          <button
            onClick={handleSimulateSweep}
            disabled={isSweeping}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm shrink-0 w-full sm:w-auto ${
              isDark
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSweeping ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSweeping ? 'Sweeping Engines...' : 'Trigger Fresh Sweep'}</span>
          </button>
        </div>
      </div>

      {/* Main Radar + Share of Answers Split */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Radar Visual */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0A0D14] p-5 sm:p-7 flex flex-col items-center justify-center min-h-[420px] shadow-lg">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono uppercase text-zinc-300 font-extrabold tracking-wider">
              Citation Proximity Radar
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Cited (#1-#3)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Mentioned
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Skipped
              </span>
            </div>
          </div>

          {/* Radar Circles */}
          <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] flex items-center justify-center my-4">
            {/* Outer concentric circles */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="absolute inset-24 rounded-full border border-white/10" />
            <div className="absolute inset-32 rounded-full border border-emerald-500/20 bg-emerald-500/[0.03]" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-white/15" />
              <div className="h-full w-px bg-white/15 absolute" />
            </div>

            {/* Sweeping Beam Animation */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(16, 185, 129, 0.3) 100%)',
                animation: 'spin 6s linear infinite',
              }}
            />

            {/* Center Brand Pulse */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-1">
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_14px_#10b981]" />
              <span className="text-[11px] font-mono font-black text-white mt-1 bg-black/80 px-2 py-0.5 rounded border border-white/20 shadow-md">
                {brandName || domain}
              </span>
            </div>

            {/* Prompt Pins on Radar */}
            {prompts.slice(0, 6).map((p, idx) => {
              const angles = [45, 120, 200, 290, 340, 160];
              const radii = [60, 95, 125, 75, 115, 85];
              const angle = angles[idx % angles.length];
              const radius = radii[idx % radii.length];
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              const isCited = p.shareOfVoice >= 50;
              const isMentioned = p.shareOfVoice > 0 && p.shareOfVoice < 50;
              const dotColor = isCited ? '#10b981' : isMentioned ? '#f59e0b' : '#f43f5e';

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPrompt(p)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 focus:outline-none"
                >
                  <span
                    className="block h-4 w-4 rounded-full border-2 border-neutral-950 shadow-lg cursor-pointer"
                    style={{ backgroundColor: dotColor }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:block z-30 whitespace-nowrap bg-neutral-900 border border-white/20 px-3 py-1.5 rounded-xl text-[11px] text-white font-mono shadow-2xl">
                    <div className="font-bold">{p.promptText.slice(0, 32)}...</div>
                    <div className="text-zinc-300">SoV: {p.shareOfVoice}%</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-zinc-400 font-mono font-medium mt-2 text-center">
            Click any radar node to inspect exact engine responses and citations.
          </div>
        </div>

        {/* Share of Answers by Engine */}
        <div className={`rounded-3xl border p-5 sm:p-7 flex flex-col justify-between transition-all ${
          isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h4 className={`text-xs font-black uppercase tracking-wider font-mono mb-5 ${
              isDark ? 'text-zinc-300' : 'text-slate-700'
            }`}>
              Share of Voice by Engine
            </h4>

            <div className="space-y-4">
              {engineStats.map((eng) => (
                <div key={eng.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: eng.color }} />
                      {eng.label}
                    </span>
                    <span className="font-mono font-black" style={{ color: eng.color }}>
                      {eng.percentage}%
                    </span>
                  </div>
                  <div className={`h-2.5 w-full overflow-hidden rounded-full border ${
                    isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(6, eng.percentage)}%`,
                        backgroundColor: eng.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Prompt Inspector */}
          {selectedPrompt && (
            <div className={`mt-6 border-t pt-4 space-y-3 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  Inspecting Target Prompt
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/30">
                  {selectedPrompt.shareOfVoice}% SoV
                </span>
              </div>
              <p className={`text-xs sm:text-sm font-bold italic leading-relaxed ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                "{selectedPrompt.promptText}"
              </p>

              {/* Engine Citations breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                {selectedPrompt.modelResults?.map((res, rIdx) => (
                  <div
                    key={rIdx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      res.brandMentioned
                        ? isDark ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' : 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : isDark ? 'border-white/10 bg-white/5 text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold truncate mr-2">{res.modelLabel?.split(' ')[0] || res.modelName}</span>
                    <span className="font-black shrink-0">
                      {res.brandMentioned ? `Rank #${res.rankPosition || 1}` : 'Not Cited'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
