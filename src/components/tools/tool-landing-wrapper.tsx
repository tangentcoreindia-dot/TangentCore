'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowRight, ArrowUp, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, Layers, Bot, 
  ShieldCheck, Zap, Compass, Cpu, BookOpen, Terminal, Globe
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
  const [activeTab, setActiveTab] = useState<'features' | 'workflow' | 'geo' | 'faqs'>('features');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const toolElement = document.getElementById('tool-interactive-studio');
      if (toolElement) {
        const rect = toolElement.getBoundingClientRect();
        setShowScrollToTop(rect.bottom < 150);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!tool) {
    return <div>{children}</div>;
  }

  const Icon = tool.icon;

  const scrollToStudio = () => {
    const studio = document.getElementById('tool-interactive-studio');
    if (studio) {
      studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const input = studio.querySelector('input');
        if (input) input.focus();
      }, 400);
    }
  };

  const scrollToTabs = () => {
    const tabs = document.getElementById('segmented-showcase');
    if (tabs) {
      tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 transition-colors duration-300 w-full max-w-full overflow-x-hidden relative">
      
      {/* 1. TOP BREADCRUMB & METADATA RIBBON */}
      <div className={`flex flex-wrap items-center justify-between gap-3 text-xs font-mono pb-4 border-b ${
        isDark ? 'border-white/10' : 'border-[#E5E3DF]'
      }`}>
        <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 flex-wrap ${
          isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
        }`}>
          <Link 
            href="/tools" 
            className={`flex items-center gap-1 transition-colors font-medium ${
              isDark ? 'hover:text-[#C7A15A]' : 'hover:text-[#B87333]'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
            <span>Tools Hub</span>
          </Link>
          <span className={isDark ? 'text-white/20' : 'text-[#CCCCCC]'}>/</span>
          <span className="hidden sm:inline font-medium text-[11px] truncate max-w-[160px]">{tool.category}</span>
          <span className={`hidden sm:inline ${isDark ? 'text-white/20' : 'text-[#CCCCCC]'}`}>/</span>
          <span className={`font-bold truncate max-w-[200px] ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`}>
            {tool.name}
          </span>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
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
            <Sparkles className="w-3 h-3 text-[#C7A15A]" />
            <span>Scalezix Venture</span>
          </a>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
            isDark
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            Free Tool
          </span>
        </div>
      </div>

      {/* 2. TRUE LUXURY SAAS HERO SECTION */}
      <section className="relative text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto pt-4 sm:pt-8">
        
        {/* Ambient Top Spotlight Halo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-b from-[#C7A15A]/20 via-[#B87333]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Hero Eyebrow Pill */}
        <div className="flex items-center justify-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold shadow-xs backdrop-blur-md ${
            isDark
              ? 'bg-[#18191C]/90 text-[#C7A15A] border-[#C7A15A]/30'
              : 'bg-white text-[#B87333] border-[#B87333]/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Icon className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">{tool.number} • {tool.category}</span>
          </div>
        </div>

        {/* Master Hero Headline */}
        <div className="space-y-4">
          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${
            isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'
          }`}>
            {tool.name}
          </h1>

          <p className="text-base sm:text-xl lg:text-2xl font-bold max-w-2xl mx-auto leading-relaxed champagne-gradient-text">
            {tool.tagline}
          </p>

          <p className={`text-xs sm:text-sm sm:leading-relaxed max-w-2xl mx-auto ${
            isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
          }`}>
            {tool.description}
          </p>
        </div>

        {/* Hero Landing Page Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
          <button
            onClick={scrollToStudio}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl luxury-btn-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer group"
          >
            <Zap className="w-4 h-4 text-[#111111]" />
            <span>Launch Free Interactive Audit</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={scrollToTabs}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'border-white/15 bg-[#121315]/80 hover:bg-white/10 text-white'
                : 'border-[#E5E3DF] bg-white hover:bg-[#F6F5F3] text-[#181818] shadow-xs'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
            <span>AEO Architecture & Guide</span>
          </button>
        </div>

        {/* AI Engine Compatibility & Proof Strip */}
        <div className="pt-2 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider mr-1 ${
              isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'
            }`}>
              AI Engines:
            </span>
            {['ChatGPT-4o', 'Perplexity Pro', 'Google Gemini', 'Claude 3.5'].map((engine) => (
              <span
                key={engine}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-medium border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-[#C7A15A]'
                    : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#B87333]'
                }`}
              >
                ✦ {engine}
              </span>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div className={`flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-xs font-mono pt-1 ${
            isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
          }`}>
            {tool.stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'}`}>
                  {stat.label}:
                </span>
                <span className={`font-bold ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 3. HERO PRODUCT COCKPIT FRAME (THE LIVE INTERACTIVE TOOL STUDIO) */}
      <section id="tool-interactive-studio" className="relative scroll-mt-20">
        
        {/* Subtle Ambient Backing Glow */}
        <div className="absolute -inset-1.5 rounded-3xl opacity-35 blur-2xl pointer-events-none -z-10 bg-gradient-to-r from-[#B87333]/25 via-[#C7A15A]/25 to-[#B87333]/25" />
        
        {/* Cockpit Window Container */}
        <div className={`rounded-3xl border overflow-hidden shadow-2xl backdrop-blur-xl ${
          isDark 
            ? 'bg-[#101114]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]' 
            : 'bg-white border-[#E5E3DF] shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
        }`}>
          
          {/* macOS-Style Window Header Bar */}
          <div className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 text-xs font-mono ${
            isDark ? 'bg-[#16171B] border-white/10 text-[#B7B7B5]' : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#5C5C5C]'
          }`}>
            {/* Window Dots */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 hidden sm:inline text-[11px] font-mono text-[#85858A]">
                tangentcore://tools/{tool.slug}
              </span>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className={isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}>
                Live Interactive Studio
              </span>
            </div>
          </div>

          {/* Children Tool (Input + Results) */}
          <div className="p-4 sm:p-8">
            {children}
          </div>

        </div>

      </section>

      {/* 4. SEGMENTED INTELLIGENCE SHOWCASE (TABS: KILLS "BOXES ONLY" & CUTS HEIGHT BY 70%) */}
      <section id="segmented-showcase" className="space-y-6 pt-4 scroll-mt-20">
        
        {/* Section Headline */}
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
            isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
          }`}>
            Architecture & Deep Dive
          </span>
          <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
            How TangentCore Powers AEO Citations
          </h2>
        </div>

        {/* The Segmented Controller Switcher */}
        <div className="flex items-center justify-center">
          <div className={`p-1 rounded-2xl border flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none ${
            isDark ? 'bg-[#121315] border-white/10' : 'bg-[#F6F5F3] border-[#E5E3DF]'
          }`}>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'features'
                  ? isDark
                    ? 'bg-[#C7A15A] text-[#111111] shadow-md shadow-[#C7A15A]/20'
                    : 'bg-[#B87333] text-white shadow-md shadow-[#B87333]/20'
                  : isDark
                  ? 'text-[#B7B7B5] hover:text-white hover:bg-white/5'
                  : 'text-[#5C5C5C] hover:text-[#181818] hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Capabilities</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'workflow'
                  ? isDark
                    ? 'bg-[#C7A15A] text-[#111111] shadow-md shadow-[#C7A15A]/20'
                    : 'bg-[#B87333] text-white shadow-md shadow-[#B87333]/20'
                  : isDark
                  ? 'text-[#B7B7B5] hover:text-white hover:bg-white/5'
                  : 'text-[#5C5C5C] hover:text-[#181818] hover:bg-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </button>

            <button
              onClick={() => setActiveTab('geo')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'geo'
                  ? isDark
                    ? 'bg-[#C7A15A] text-[#111111] shadow-md shadow-[#C7A15A]/20'
                    : 'bg-[#B87333] text-white shadow-md shadow-[#B87333]/20'
                  : isDark
                  ? 'text-[#B7B7B5] hover:text-white hover:bg-white/5'
                  : 'text-[#5C5C5C] hover:text-[#181818] hover:bg-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>GEO Impact</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'faqs'
                  ? isDark
                    ? 'bg-[#C7A15A] text-[#111111] shadow-md shadow-[#C7A15A]/20'
                    : 'bg-[#B87333] text-white shadow-md shadow-[#B87333]/20'
                  : isDark
                  ? 'text-[#B7B7B5] hover:text-white hover:bg-white/5'
                  : 'text-[#5C5C5C] hover:text-[#181818] hover:bg-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQs</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className={`rounded-3xl border p-5 sm:p-8 transition-all ${
          isDark
            ? 'bg-[#121315]/80 border-white/10'
            : 'bg-white border-[#E5E3DF] shadow-xs'
        }`}>

          {/* TAB 1: CAPABILITIES (Refined Bento Grid) */}
          {activeTab === 'features' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-4 border-inherit">
                <div>
                  <h3 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                    Key Capabilities & Intelligence Deliverables
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                    Engineered to inspect, structure, and verify how AI engines cite your brand.
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                  isDark ? 'bg-[#C7A15A]/15 text-[#C7A15A]' : 'bg-[#B87333]/10 text-[#B87333]'
                }`}>
                  {tool.features.length} Deliverables
                </span>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tool.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      isDark
                        ? 'bg-[#18191C]/80 border-white/5 hover:border-[#C7A15A]/30'
                        : 'bg-[#F9F8F6] border-[#E5E3DF]/70 hover:border-[#B87333]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {feat.tag && (
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
                        }`}>
                          {feat.tag}
                        </span>
                      )}
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
                    </div>
                    <h4 className={`text-sm font-bold leading-snug ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                      {feat.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Target Audience Strip */}
              <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
                isDark ? 'bg-[#18191C] border-white/5' : 'bg-[#F9F8F6] border-[#E5E3DF]'
              }`}>
                <span className={`text-xs font-mono font-bold uppercase ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`}>
                  Tailored For:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {tool.targetAudience.map((role, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white'
                          : 'bg-white border-[#E5E3DF] text-[#181818]'
                      }`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW IT WORKS (Connected Process Flow) */}
          {activeTab === 'workflow' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4 border-inherit">
                <h3 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                  How It Works in 3 Simple Steps
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  High-speed multi-model AI retrieval with zero complex configuration.
                </p>
              </div>

              {/* Connected Timeline Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {tool.howItWorks.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border space-y-2.5 relative ${
                      isDark
                        ? 'bg-[#18191C]/80 border-white/5'
                        : 'bg-[#F9F8F6] border-[#E5E3DF]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-black font-mono ${
                        isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
                      }`}>
                        {step.step}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isDark ? 'bg-white/5 text-[#85858A]' : 'bg-white text-[#7A7A7A] border border-[#E5E3DF]'
                      }`}>
                        Phase 0{idx + 1}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GEO IMPACT */}
          {activeTab === 'geo' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 border-inherit">
                <div className="space-y-1">
                  <span className={`text-xs font-mono uppercase font-bold ${
                    isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
                  }`}>
                    Generative Engine Optimization (GEO)
                  </span>
                  <h3 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                    {tool.whyItMatters.headline}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {['ChatGPT-4o', 'Perplexity', 'Claude 3.5', 'Gemini'].map((engine) => (
                    <span
                      key={engine}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tool.whyItMatters.points.map((point, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border space-y-1.5 ${
                      isDark ? 'bg-[#18191C]/80 border-white/5' : 'bg-[#F9F8F6] border-[#E5E3DF]/70'
                    }`}
                  >
                    <span className={`text-[11px] font-mono font-bold block ${
                      isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
                    }`}>
                      Insight 0{idx + 1}
                    </span>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="border-b pb-4 border-inherit">
                <h3 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
                  Frequently Asked Questions
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  Everything you need to know about this tool and its AEO recommendations.
                </p>
              </div>

              <div className="space-y-2.5">
                {tool.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-colors ${
                        isDark
                          ? 'border-white/5 bg-[#18191C]/70 hover:border-white/15'
                          : 'border-[#E5E3DF] bg-[#F9F8F6] hover:border-[#B87333]/30'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className={`w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm cursor-pointer ${
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
                        <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${
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
            </div>
          )}

        </div>
      </section>

      {/* 5. EXPLORE MORE TOOLS */}
      <section className={`pt-6 border-t ${isDark ? 'border-white/10' : 'border-[#E5E3DF]'}`}>
        <div className="flex items-center justify-between gap-2 pb-4">
          <div>
            <h3 className={`text-sm sm:text-base font-bold ${isDark ? 'text-[#F6F6F4]' : 'text-[#181818]'}`}>
              Explore Related Micro-Tools
            </h3>
            <p className={`text-[11px] ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
              Combine tools to optimize your full AEO footprint across conversational engines.
            </p>
          </div>
          <Link
            href="/tools"
            className={`text-xs font-mono font-semibold hover:underline flex items-center gap-1 shrink-0 ${
              isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'
            }`}
          >
            <span>All 12 Tools</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tool.relatedToolIds.map((relId) => {
            const relTool = TOOLS_DATA[relId];
            if (!relTool) return null;
            const RelIcon = relTool.icon;
            return (
              <Link
                key={relId}
                href={`/tools/${relId}`}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
                  isDark
                    ? 'bg-[#121315]/80 border-white/5 hover:border-[#C7A15A]/40'
                    : 'bg-white border-[#E5E3DF] hover:border-[#B87333]/40 shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase ${
                      isDark ? 'text-[#85858A]' : 'text-[#7A7A7A]'
                    }`}>
                      {relTool.number} • {relTool.category}
                    </span>
                    <RelIcon className={`w-3.5 h-3.5 ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`} />
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold transition-colors line-clamp-1 ${
                    isDark
                      ? 'text-[#F6F6F4] group-hover:text-[#C7A15A]'
                      : 'text-[#181818] group-hover:text-[#B87333]'
                  }`}>
                    {relTool.name}
                  </h4>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                    isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'
                  }`}>
                    {relTool.tagline}
                  </p>
                </div>
                <div className={`pt-2 border-t text-[11px] font-mono font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1 ${
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

      {/* 6. FLOATING RETURN-TO-TOOL BUTTON */}
      {showScrollToTop && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={scrollToStudio}
            className={`px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer active:scale-95 border text-xs font-bold font-mono transition-transform hover:scale-105 ${
              isDark
                ? 'bg-[#18191C] border-[#C7A15A]/40 text-[#C7A15A]'
                : 'bg-white border-[#B87333]/40 text-[#B87333] shadow-lg'
            }`}
            aria-label="Return to Interactive Tool"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Return to Studio</span>
          </button>
        </div>
      )}

    </div>
  );
}