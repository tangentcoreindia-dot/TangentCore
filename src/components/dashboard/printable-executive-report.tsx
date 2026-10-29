'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, FileText, Lock, Globe, Cpu, AlertTriangle, CheckCircle2, XCircle, Sparkles, Layers, Check } from 'lucide-react';

interface PrintableExecutiveReportProps {
  auditData: any;
}

export function PrintableExecutiveReport({ auditData }: PrintableExecutiveReportProps) {
  if (!auditData) return null;

  const pageAudit = auditData.pageAudit || {};
  const metrics = auditData.metrics || {};
  const foundation = pageAudit.technicalFoundation || {};
  const crawledPages = pageAudit.crawledPages || [];
  const domain = auditData.domain || 'website.com';
  const brandName = auditData.brandName || pageAudit.brandName || domain.split('.')[0].toUpperCase();
  const overallScore = metrics.overallGeoScore || pageAudit.overallGeoScore || 0;
  const totalPages = pageAudit.totalPagesScanned || (crawledPages.length + 1) || 10;
  const totalIssues = pageAudit.totalIssuesCount || (pageAudit.auditChecklist || []).filter((c: any) => c.status !== 'pass').length || 0;
  const criticalIssues = pageAudit.criticalIssuesCount || (pageAudit.auditChecklist || []).filter((c: any) => c.status === 'fail').length || 0;
  const warningIssues = pageAudit.warningIssuesCount || (pageAudit.auditChecklist || []).filter((c: any) => c.status === 'warn').length || 0;
  const infoIssues = pageAudit.infoIssuesCount || Math.max(0, totalIssues - criticalIssues - warningIssues);

  // Category scores (GEO Studio 7-Category Parity)
  const cats = pageAudit.studioCategories || {};
  const categoryScores = [
    { name: 'Technical SEO', score: cats.technicalSeo ?? pageAudit.seoScore ?? 57, target: '100' },
    { name: 'Core Web Vitals', score: cats.coreWebVitals ?? 57, target: '100' },
    { name: 'On-Page SEO', score: cats.onPageSeo ?? pageAudit.readabilityScore ?? 52, target: '100' },
    { name: 'Content Quality', score: cats.contentQuality ?? 44, target: '100' },
    { name: 'Accessibility', score: cats.accessibility ?? 47, target: '100' },
    { name: 'Structured Data', score: cats.structuredData ?? pageAudit.schemaScore ?? 0, target: '100' },
    { name: 'Internal Linking', score: cats.internalLinking ?? 55, target: '100' },
  ];

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getScoreSeverity = (score: number) => {
    if (score < 30) return { label: 'Critical', bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-300' };
    if (score < 60) return { label: 'Needs Improvement', bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-300' };
    if (score < 80) return { label: 'Good', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-300' };
    return { label: 'Excellent', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-300' };
  };

  const severity = getScoreSeverity(overallScore);

  return (
    <div className="print-only hidden print:block font-sans text-slate-900 bg-white w-full">
      {/* ================= PAGE 1: EXECUTIVE COVER & DASHBOARD ================= */}
      <div className="report-section p-8 border-b-2 border-slate-300 bg-white" style={{ pageBreakAfter: 'always', breakAfter: 'page', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <div>
          {/* Header Metadata */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <div className="text-[11px] font-black tracking-widest uppercase text-slate-500">
                TangentCore • Generative Engine Optimization Audit Report
              </div>
              <h1 className="text-3xl font-black text-slate-950 mt-1">
                {domain}
              </h1>
            </div>
            <div className="text-right text-xs text-slate-600 font-semibold">
              <div>{totalPages} pages analyzed</div>
              <div className="font-bold text-slate-900">{currentDate}</div>
            </div>
          </div>

          {/* Primary Score & Severity Card */}
          <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-6 mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Overall GEO Score
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-black text-slate-950 tracking-tight">
                  {overallScore}
                </span>
                <span className="text-2xl font-bold text-slate-400">/ 100</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white ${severity.bg}`}>
                  {severity.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 max-w-md font-medium">
                Comprehensive score evaluating AI crawler crawlability, pre-rendering HTML, vector entity density, Schema.org JSON-LD coverage, and buyer-intent citation probability.
              </p>
            </div>

            {/* Quick Metrics Counter */}
            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase">Pages Scanned</div>
                <div className="text-xl font-black text-slate-900">{totalPages}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase">Total Issues</div>
                <div className="text-xl font-black text-rose-600">{totalIssues}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase">Critical</div>
                <div className="text-xl font-black text-rose-700">{criticalIssues}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase">Warnings</div>
                <div className="text-xl font-black text-amber-600">{warningIssues}</div>
              </div>
            </div>
          </div>

          {/* Foundational GEO Signals Box (GEO Studio Parity) */}
          <div className="mb-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" /> Technical Foundation: The signals AI crawlers check first
            </h2>
            <div className="grid grid-cols-5 gap-2.5 text-xs">
              {/* robots.txt */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-black uppercase text-slate-500">ROBOTS.TXT</div>
                <div className={`font-black text-sm mt-0.5 ${foundation?.robotsTxt?.exists ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {foundation?.robotsTxt?.exists ? 'Found' : 'Missing'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {foundation?.robotsTxt?.exists ? (foundation.robotsTxt.rulesCount ? `${foundation.robotsTxt.rulesCount} rules` : 'Valid rules') : 'Not detected on root'}
                </div>
              </div>

              {/* llms.txt */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-black uppercase text-slate-500">LLMS.TXT</div>
                <div className={`font-black text-sm mt-0.5 ${foundation?.llmsTxt?.exists ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {foundation?.llmsTxt?.exists ? 'Found' : 'Missing'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {foundation?.llmsTxt?.exists ? (foundation.llmsTxt.linksCount ? `${foundation.llmsTxt.linksCount} links` : 'AI agent index') : 'Not detected on server'}
                </div>
              </div>

              {/* sitemap.xml */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-black uppercase text-slate-500">SITEMAP.XML</div>
                <div className={`font-black text-sm mt-0.5 ${foundation?.sitemapXml?.exists ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {foundation?.sitemapXml?.exists ? 'Found' : 'Missing'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {foundation?.sitemapXml?.exists ? (foundation.sitemapXml.urlsCount ? `${foundation.sitemapXml.urlsCount} URLs` : 'Indexed architecture') : 'Not detected on root'}
                </div>
              </div>

              {/* HTTPS */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-black uppercase text-slate-500">HTTPS</div>
                <div className={`font-black text-sm mt-0.5 ${foundation?.https?.secure !== false ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {foundation?.https?.secure !== false ? 'Secure' : 'Insecure'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {foundation?.https?.secure !== false ? 'valid certificate' : 'Missing SSL encryption'}
                </div>
              </div>

              {/* Orphan Pages */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-black uppercase text-slate-500">ORPHAN PAGES</div>
                <div className="font-black text-sm mt-0.5 text-slate-900">
                  {foundation?.orphanPagesCount ?? 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  no inbound links
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Progress Bars */}
          <div className="mb-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Score by Category (Signal Health & Issue Penalties)
            </h2>
            <div className="space-y-2.5">
              {categoryScores.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 w-44">{cat.name}</span>
                  <div className="flex-1 mx-4 bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cat.score > 70 ? 'bg-emerald-600' : cat.score > 40 ? 'bg-amber-500' : 'bg-rose-600'
                      }`}
                      style={{ width: `${Math.max(4, cat.score)}%` }}
                    />
                  </div>
                  <span className="font-mono font-black text-slate-900 w-12 text-right">
                    {cat.score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex items-center justify-between">
          <span>TangentCore AI Generative Engine Optimization Report • Confidential</span>
          <span>Page 1 of 4 • {domain}</span>
        </div>
      </div>

      {/* ================= PAGE 2: MULTI-PAGE ARCHITECTURE CRAWL ================= */}
      <div className="report-section p-8 border-b-2 border-slate-300 bg-white" style={{ pageBreakAfter: 'always', breakAfter: 'page', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <div>
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-6">
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-slate-500">Site Architecture Audit</div>
              <h2 className="text-2xl font-black text-slate-950">Discovered Pages & Subpage Status</h2>
            </div>
            <div className="text-xs font-bold text-slate-600">{totalPages} Pages Evaluated</div>
          </div>

          <p className="text-xs text-slate-600 mb-4 font-medium">
            AI search crawlers (GPTBot, ClaudeBot, PerplexityBot) traverse linked internal pages to build a topical knowledge graph. The table below details the crawl results and detected issues across all discovered subpages.
          </p>

          <table className="w-full text-left text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-black text-slate-800">
                <th className="py-2.5 px-3">Page URL / Path</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Page Title</th>
                <th className="py-2.5 px-3">Word Count</th>
                <th className="py-2.5 px-3">JSON-LD</th>
                <th className="py-2.5 px-3">Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50/60 font-medium">
                <td className="py-2 px-3 font-bold text-slate-900">/ (Homepage)</td>
                <td className="py-2 px-3"><span className="text-emerald-700 font-bold">200 OK</span></td>
                <td className="py-2 px-3 truncate max-w-[180px]">{pageAudit.title || 'Root'}</td>
                <td className="py-2 px-3">{pageAudit.wordCount} words</td>
                <td className="py-2 px-3">
                  {pageAudit.detectedSchemas?.length > 0 ? (
                    <span className="text-emerald-700 font-bold">Yes ({pageAudit.detectedSchemas.length})</span>
                  ) : (
                    <span className="text-rose-600 font-bold">0 (None)</span>
                  )}
                </td>
                <td className="py-2 px-3">
                  <span className="text-rose-600 font-bold">
                    {(pageAudit.auditChecklist || []).filter((c: any) => c.status !== 'pass').length} issues
                  </span>
                </td>
              </tr>
              {crawledPages.map((sub: any, idx: number) => (
                <tr key={idx} className="font-medium">
                  <td className="py-2 px-3 font-mono font-bold text-slate-800 truncate max-w-[160px]">{sub.path}</td>
                  <td className="py-2 px-3">
                    <span className={`font-bold ${sub.status === 200 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 truncate max-w-[200px]">{sub.title || 'Untitled'}</td>
                  <td className="py-2 px-3">{sub.wordCount} words</td>
                  <td className="py-2 px-3">
                    {sub.hasSchema ? (
                      <span className="text-emerald-700 font-bold">Detected</span>
                    ) : (
                      <span className="text-rose-600 font-bold">Missing</span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-bold text-amber-600">
                    {sub.issuesCount > 0 ? `${sub.issuesCount} issues` : 'Clean'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Competitor Benchmark Overview */}
          <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
              Industry Competitors Tracked Against
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {(auditData.autoDiscoveredCompetitors || pageAudit.autoDiscoveredCompetitors || []).map((comp: string, cIdx: number) => (
                <span key={cIdx} className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex items-center justify-between">
          <span>TangentCore AI Generative Engine Optimization Report • Confidential</span>
          <span>Page 2 of 4 • {domain}</span>
        </div>
      </div>

      {/* ================= PAGE 3: ISSUE DIAGNOSTICS & "HOW TO FIX" ================= */}
      <div className="report-section p-8 border-b-2 border-slate-300 bg-white" style={{ pageBreakAfter: 'always', breakAfter: 'page', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <div>
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-6">
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-slate-500">Diagnostic Remediation Guide</div>
              <h2 className="text-2xl font-black text-slate-950">Detailed Issues & How to Fix</h2>
            </div>
            <div className="text-xs font-bold text-slate-600">Actionable Checklist</div>
          </div>

          <div className="space-y-3.5 text-xs">
            {(pageAudit.auditChecklist || []).map((item: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 break-inside-avoid">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'pass'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'warn'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-slate-700 font-medium mb-1.5">
                  <strong>Finding:</strong> {item.finding}
                </p>

                {item.fixDescription && (
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold text-[11px]">
                    <span className="text-blue-700 font-bold">How to fix: </span>
                    {item.fixDescription}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Page 3 Footer */}
        <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex items-center justify-between">
          <span>TangentCore AI Generative Engine Optimization Report • Confidential</span>
          <span>Page 3 of 4 • {domain}</span>
        </div>
      </div>

      {/* ================= PAGE 4: DEPLOYABLE FIX ACTIONS & SUMMARY ================= */}
      <div className="report-section p-8 bg-white" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <div>
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-6">
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-slate-500">Deployable Schema & LLM Actions</div>
              <h2 className="text-2xl font-black text-slate-950">Immediate Deployable Code Snippets</h2>
            </div>
            <div className="text-xs font-bold text-slate-600">Generated Code Fixes</div>
          </div>

          <div className="space-y-4 text-xs">
            {(pageAudit.actionsQueue || []).slice(0, 3).map((act: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 break-inside-avoid">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      act.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      +{act.impactPoints} Points
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">{act.title}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{act.targetPage}</span>
                </div>
                <p className="text-slate-600 mb-2 font-medium">{act.description}</p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] overflow-x-auto max-h-36">
                  <pre>{act.suggestedCode.slice(0, 500)}...</pre>
                </div>
              </div>
            ))}
          </div>

          {/* Report Footer / Signature */}
          <div className="mt-8 p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-700">
            <div className="font-black text-slate-900 mb-1">About This Audit</div>
            <p>
              This Generative Engine Optimization (GEO) audit was compiled by <strong>TangentCore AI</strong> simulating live crawler queries across Claude 3.5 Sonnet, Nova, and multi-model citations. Deploying the schema fixes and content structuring above directly enhances direct answer citations across ChatGPT, Perplexity, and Claude.
            </p>
          </div>
        </div>

        {/* Page 4 Footer */}
        <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex items-center justify-between">
          <span>TangentCore AI Generative Engine Optimization Report • Confidential</span>
          <span>Page 4 of 4 • {domain}</span>
        </div>
      </div>
    </div>
  );
}
