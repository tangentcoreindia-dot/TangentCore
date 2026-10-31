'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowRight, ArrowDown, ArrowUp, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, Layers, Bot, 
  ShieldCheck, ExternalLink, Zap, Compass
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { TOOLS_DATA, ToolData } from '@/lib/tools-data';

interface ToolLandingWrapperProps {
  toolId: string;
  children: React.ReactNode;
}

export function ToolLandingWrapper({ toolId, children }: ToolLandingWrapperProps) {
  const { isDark } = useTheme();
  const tool: ToolData | undefined = TOOLS_DATA[toolId];
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolledToTool, setScrolledToTool] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const toolElement = document.getElementById('tool-studio');
      if (toolElement) {
        const rect = toolElement.getBoundingClientRect();
        setScrolledToTool(rect.top <= 200);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!tool) {
    return <div>{children}</div>;
  }

  const Icon = tool.icon;

  const scrollToStudio = () => {
    const studio = document.getElementById('tool-studio');
    if (studio) {
      studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const input = studio.querySelector('input');
        if (input) input.focus();
      }, 500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 transition-colors duration-300">
      
      {/* 1. TOP BREADCRUMB & METADATA BAR */}
      <div className={`flex flex-wrap items-center justify-between gap-3 text-xs font-mono pb-4 border-b ${
        isDark ? 'border-white/10' : 'border-[#E5E3DF]'
      }`}>
        <nav aria-label="Breadcrumb" className={`flex items-center gap-2 flex-wrap ${
          isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
        }`}>
          <Link 
            href="/tools" 
            className={`flex items-center gap-1.5 transition-colors font-medium ${
              isDark ? 'hover:text-[#C7A15A]' : 'hover:text-[#B87333]'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
            <span>Tools Hub</span>
          </Link>
          <span className={isDark ? 'text-white/30' : 'text-[#B8B8B8]'}>/</span>
          <span className="hidden sm:inline font-medium">{tool.category}</span>
          <span className={`hidden sm:inline ${isDark ? 'text-white/30' : 'text-[#B8B8B8]'}`}>/</span>
          <span className={`font-bold ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`}>
            {tool.name}
          </span>
        </nav>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="https://scalezix.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all ${
              isDark
                ? 'bg-[#C7A15A]/10 border border-[#C7A15A]/30 text-[#C7A15A] hover:bg-[#C7A15A]/20'
                : 'bg-[#B87333]/10 border border-[#B87333]/30 text-[#B87333] hover:bg-[#B87333]/20 shadow-xs'
            }`}
            title="A Scalezix Venture Entity"
          >
            <Sparkles className="w-3 h-3" />
            <span>A Scalezix Venture</span>
          </a>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
            isDark
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
          }`}>
            {tool.badge}
          </span>
        </div>
      </div>

      {/* 2. LANDING PAGE HERO SECTION */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-2 sm:pt-4">
        
        {/* Tool Number Eyebrow */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold shadow-xs ${
          isDark
            ? 'bg-[#121315] border-white/10 text-[#C7A15A]'
            : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#B87333]'
        }`}>
          <Icon className={`w-3.5 h-3.5 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
          <span className="uppercase tracking-widest">{tool.number} • {tool.category}</span>
        </div>

        {/* Big Impact Landing Headline */}
        <div className="space-y-4">
          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] ${
            isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
          }`}>
            {tool.name}
          </h1>
          <p className={`text-base sm:text-xl font-semibold max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
          }`}>
            {tool.tagline}
          </p>
          <p className={`text-sm sm:text-base leading-relaxed max-w-3xl mx-auto ${
            isDark ? 'text-[#B7B7B5]' : 'text-[#4A4A4A]'
          }`}>
            {tool.description}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={scrollToStudio}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl luxury-btn-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <span>Launch Interactive Tool</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
          
          <Link
            href="/tools"
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              isDark
                ? 'border-white/15 bg-[#121315] hover:bg-white/5 text-[#F6F6F4]'
                : 'border-[#E5E3DF] bg-white hover:bg-[#F6F5F3] text-[#181818] shadow-xs'
            }`}
          >
            <span>Browse All Tools (12)</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
          </Link>
        </div>

        {/* Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {tool.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
                isDark
                  ? 'bg-[#1B1C1F] border-white/10 text-[#B7B7B5]'
                  : 'bg-white border-[#E5E3DF] text-[#4A4A4A] shadow-xs'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-left">
          {tool.stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-1 transition-colors ${
                isDark
                  ? 'bg-[#121315]/90 border-white/10 hover:border-[#C7A15A]/30'
                  : 'bg-white border-[#E5E3DF] hover:border-[#B87333]/40 shadow-xs'
              }`}
            >
              <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'
              }`}>
                {stat.label}
              </span>
              <span className={`text-base sm:text-lg font-mono font-bold block ${
                isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
              }`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
          }`}>
            <Zap className="w-3.5 h-3.5" />
            <span>Step-by-Step Workflow</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
          }`}>
            How It Works in 3 Simple Steps
          </h2>
          <p className={`text-xs sm:text-sm ${
            isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
          }`}>
            Engineered for high-speed multi-model AI retrieval without requiring technical complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tool.howItWorks.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-7 border relative overflow-hidden space-y-3 transition-all group ${
                isDark
                  ? 'bg-[#121315]/90 border-white/10 hover:border-[#C7A15A]/40'
                  : 'bg-white border-[#E5E3DF] hover:border-[#B87333]/40 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-3xl sm:text-4xl font-black font-mono transition-colors ${
                  isDark
                    ? 'text-[#C7A15A]/40 group-hover:text-[#C7A15A]'
                    : 'text-[#B87333]/30 group-hover:text-[#B87333]'
                }`}>
                  {step.step}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-[#85858A]'
                    : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#7A7A7A]'
                }`}>
                  Step {idx + 1}
                </span>
              </div>
              <h3 className={`text-base sm:text-lg font-bold ${
                isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
              }`}>
                {step.title}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
              }`}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY CAPABILITIES & ENTERPRISE FEATURES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
          }`}>
            <Layers className="w-3.5 h-3.5" />
            <span>Comprehensive Capabilities</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
          }`}>
            Key Features & Intelligence Deliverables
          </h2>
          <p className={`text-xs sm:text-sm ${
            isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
          }`}>
            Everything you need to analyze, structure, and verify how AI search engines evaluate your domain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tool.features.map((feat, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 border transition-all space-y-2.5 group ${
                isDark
                  ? 'bg-[#121315]/80 border-white/10 hover:border-[#C7A15A]/40'
                  : 'bg-white border-[#E5E3DF] hover:border-[#B87333]/40 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                {feat.tag && (
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                    isDark
                      ? 'bg-[#C7A15A]/15 border-[#C7A15A]/30 text-[#C7A15A]'
                      : 'bg-[#B87333]/10 border-[#B87333]/30 text-[#B87333]'
                  }`}>
                    {feat.tag}
                  </span>
                )}
                <CheckCircle2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
                }`} />
              </div>
              <h3 className={`text-base font-bold ${
                isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
              }`}>
                {feat.title}
              </h3>
              <p className={`text-xs leading-relaxed ${
                isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
              }`}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Target Audience Bar */}
        <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
          isDark
            ? 'bg-[#1B1C1F]/60 border-white/10'
            : 'bg-[#F6F5F3] border-[#E5E3DF]'
        }`}>
          <div className="space-y-0.5">
            <span className={`text-xs font-mono uppercase font-bold block ${
              isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
            }`}>
              Engineered For Modern Growth Leaders
            </span>
            <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
              Tailored for data-driven teams building next-generation digital presence.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tool.targetAudience.map((role, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-[#E5E3DF] text-[#181818] shadow-xs'
                }`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE TOOL STUDIO CONTAINER (THE LIVE TOOL) */}
      <section id="tool-studio" className="scroll-mt-24 space-y-6">
        
        {/* Studio Section Intro Bar */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pt-4">
          <div className="flex items-center justify-center gap-2">
            <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2 border shadow-xs ${
              isDark
                ? 'bg-[#C7A15A]/15 border-[#C7A15A]/30 text-[#C7A15A]'
                : 'bg-[#B87333]/10 border-[#B87333]/30 text-[#B87333]'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Live Studio</span>
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
          }`}>
            Launch Real-Time Analysis
          </h2>
          <p className={`text-xs sm:text-sm ${
            isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
          }`}>
            Enter your parameters below. Processing executes in real time with multi-model AI validation.
          </p>
        </div>

        {/* The Live Interactive Tool */}
        <div className="relative">
          {children}
        </div>

      </section>

      {/* 6. WHY THIS MATTERS FOR GENERATIVE ENGINE OPTIMIZATION (GEO) */}
      <section className={`rounded-3xl p-6 sm:p-8 border space-y-6 shadow-sm ${
        isDark
          ? 'bg-[#121315]/90 border-white/10'
          : 'bg-white border-[#E5E3DF]'
      }`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 ${
          isDark ? 'border-white/10' : 'border-[#E5E3DF]'
        }`}>
          <div className="space-y-1">
            <span className={`text-xs font-mono uppercase font-bold ${
              isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
            }`}>
              Generative Engine Optimization (GEO) Deep Dive
            </span>
            <h3 className={`text-lg sm:text-xl font-extrabold ${
              isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
            }`}>
              {tool.whyItMatters.headline}
            </h3>
          </div>

          {/* AI Model Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['ChatGPT-4o', 'Perplexity', 'Claude 3.5', 'Gemini Pro'].map((engine) => (
              <span
                key={engine}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-[#C7A15A]'
                    : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#B87333]'
                }`}
              >
                {engine}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          {tool.whyItMatters.points.map((point, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className={`text-xs font-mono font-bold ${
                isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
              }`}>
                Key Insight 0{idx + 1}
              </span>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
              }`}>
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="space-y-5 max-w-3xl mx-auto">
        <div className="text-center space-y-1.5">
          <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase ${
            isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
          }`}>
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${
            isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
          }`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-xs sm:text-sm ${
            isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
          }`}>
            Everything you need to know about using this tool and implementing its recommendations.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {tool.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-colors ${
                  isDark
                    ? 'border-white/10 bg-[#121315]/80 hover:border-white/20'
                    : 'border-[#E5E3DF] bg-white hover:border-[#B87333]/40 shadow-xs'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base cursor-pointer ${
                    isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
                  }`}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'}`} />
                  )}
                </button>
                {isOpen && (
                  <div className={`px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t ${
                    isDark
                      ? 'text-[#B7B7B5] border-white/5'
                      : 'text-[#5C5C5C] border-[#E5E3DF]/50'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. RELATED TOOLS CARDS */}
      <section className={`space-y-5 pt-6 border-t ${
        isDark ? 'border-white/10' : 'border-[#E5E3DF]'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className={`text-lg sm:text-xl font-bold ${
              isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
            }`}>
              Explore Related Micro-Tools
            </h3>
            <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
              Combine tools across the TangentCore suite to optimize your full AEO footprint.
            </p>
          </div>
          <Link
            href="/tools"
            className={`text-xs font-mono hover:underline flex items-center gap-1 font-semibold ${
              isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
            }`}
          >
            <span>View all 12 tools</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tool.relatedToolIds.map((relId) => {
            const relTool = TOOLS_DATA[relId];
            if (!relTool) return null;
            const RelIcon = relTool.icon;
            return (
              <Link
                key={relId}
                href={`/tools/${relId}`}
                className={`rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 group shadow-xs ${
                  isDark
                    ? 'bg-[#121315]/80 border-white/10 hover:border-[#C7A15A]/40'
                    : 'bg-white border-[#E5E3DF] hover:border-[#B87333]/40'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase ${
                      isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'
                    }`}>
                      {relTool.number} • {relTool.category}
                    </span>
                    <RelIcon className={`w-4 h-4 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
                  </div>
                  <h4 className={`text-sm font-bold transition-colors ${
                    isDark
                      ? 'text-[#F6F6F4] group-hover:text-[#C7A15A]'
                      : 'text-[#181818] group-hover:text-[#B87333]'
                  }`}>
                    {relTool.name}
                  </h4>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${
                    isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
                  }`}>
                    {relTool.tagline}
                  </p>
                </div>
                <div className={`pt-2 border-t text-xs font-mono flex items-center gap-1 font-semibold transition-transform group-hover:translate-x-1 ${
                  isDark
                    ? 'border-white/5 text-[#C7A15A]'
                    : 'border-[#E5E3DF] text-[#B87333]'
                }`}>
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 9. FLOATING MOBILE QUICK-ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        {scrolledToTool ? (
          <button
            onClick={scrollToTop}
            className={`p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 border ${
              isDark
                ? 'bg-[#1B1C1F] border-[#C7A15A]/50 text-[#C7A15A]'
                : 'bg-white border-[#B87333]/50 text-[#B87333]'
            }`}
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={scrollToStudio}
            className="px-4 py-3 rounded-full luxury-btn-primary font-bold text-xs shadow-2xl flex items-center gap-2 cursor-pointer active:scale-95"
            aria-label="Jump to Tool Studio"
          >
            <Zap className="w-4 h-4" />
            <span>Launch Tool</span>
          </button>
        )}
      </div>

    </div>
  );
}
