'use client';

import { PageGeoAuditResult } from '@/lib/aeo-engine/page-analyzer';
import { Layers, CheckCircle2, AlertTriangle, FileCode, Tag, Heading, Sparkles, Globe, Cpu, Users, Lock, ShieldCheck, ShieldAlert, FileText, X, Check, FileSearch } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface SiteCrawlerProps {
  pageAudit?: PageGeoAuditResult;
  isDark?: boolean;
}

export function SiteCrawlerView({ pageAudit, isDark = true }: SiteCrawlerProps) {
  if (!pageAudit) {
    return (
      <div className={`p-8 text-center rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-xs'}`}>
        No crawl data available yet. Run a website scan above to inspect site structure and schemas.
      </div>
    );
  }

  const foundation = pageAudit.technicalFoundation;
  const crawledPages = pageAudit.crawledPages || [];
  const totalScanned = pageAudit.totalPagesScanned || (crawledPages.length + 1);

  return (
    <ScrollReveal variant="fadeUp" duration={0.55} className="space-y-6">
      {/* Foundational GEO Signals Banner (GEO Studio Parity) */}
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200/80 dark:border-[#2A2A2A]">
          <div>
            <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-[#D4AF37]' : 'text-blue-600'}`}>
              Foundational GEO Signals
            </span>
            <h4 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Core Technical Infrastructure
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isDark ? 'bg-[#0A0A0A] border-[#2A2A2A] text-zinc-300' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}>
              {totalScanned} Pages Scanned
            </span>
            {pageAudit.totalIssuesCount !== undefined && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {pageAudit.totalIssuesCount} Issues Detected
              </span>
            )}
          </div>
        </div>

        {/* 4 Foundation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* robots.txt */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
              <span className={`font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>robots.txt</span>
            </div>
            {foundation?.robotsTxt?.exists ? (
              <span className="flex items-center gap-1 font-bold text-emerald-500">
                <Check className="w-3.5 h-3.5" /> Found {foundation.robotsTxt.rulesCount ? `(${foundation.robotsTxt.rulesCount} rules)` : ''}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-rose-500">
                <X className="w-3.5 h-3.5" /> Missing
              </span>
            )}
          </div>

          {/* llms.txt */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Cpu className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
              <span className={`font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>llms.txt</span>
            </div>
            {foundation?.llmsTxt?.exists ? (
              <span className="flex items-center gap-1 font-bold text-emerald-500">
                <Check className="w-3.5 h-3.5" /> Found {foundation.llmsTxt.linksCount ? `(${foundation.llmsTxt.linksCount} links)` : ''}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-rose-500">
                <X className="w-3.5 h-3.5" /> Missing
              </span>
            )}
          </div>

          {/* sitemap.xml */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
              <span className={`font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>sitemap.xml</span>
            </div>
            {foundation?.sitemapXml?.exists ? (
              <span className="flex items-center gap-1 font-bold text-emerald-500">
                <Check className="w-3.5 h-3.5" /> Found {foundation.sitemapXml.urlsCount ? `(${foundation.sitemapXml.urlsCount} URLs)` : ''}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-rose-500">
                <X className="w-3.5 h-3.5" /> Missing
              </span>
            )}
          </div>

          {/* HTTPS */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Lock className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
              <span className={`font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>HTTPS</span>
            </div>
            {foundation?.https?.secure !== false ? (
              <span className="flex items-center gap-1 font-bold text-emerald-500">
                <Check className="w-3.5 h-3.5" /> Secure (valid cert)
              </span>
            ) : (
              <span className="flex items-center gap-1 font-bold text-rose-500">
                <X className="w-3.5 h-3.5" /> Insecure
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Crawl Summary Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200/80 dark:border-[#2A2A2A]">
          <div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider mb-1 ${
              isDark ? 'text-[#D4AF37]' : 'text-cyan-600'
            }`}>
              <Globe className="w-3.5 h-3.5" /> Technical On-Page GEO Crawl
            </div>
            <div className="flex items-center gap-3">
              {(pageAudit as any).faviconUrl && (
                <img
                  src={(pageAudit as any).faviconUrl}
                  alt={`${pageAudit.domain} logo`}
                  className="w-7 h-7 rounded-lg object-contain"
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              )}
              <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {pageAudit.domain}
              </h3>
            </div>
            <p className={`text-xs ${isDark ? 'text-[#CFCFCF]' : 'text-slate-600'} mt-0.5 font-medium`}>
              Crawled URL: <a href={pageAudit.url} target="_blank" rel="noreferrer" className={`${isDark ? 'text-[#D4AF37] hover:text-[#F5D76E]' : 'text-cyan-600'} hover:underline font-bold`}>{pageAudit.url}</a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`text-center px-4 py-2.5 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`block text-[10px] uppercase font-bold ${isDark ? 'text-[#9E9E9E]' : 'text-slate-500'}`}>Schema Score</span>
              <span className={`text-xl font-black ${isDark ? 'gold-gradient-text' : 'text-purple-600'}`}>{pageAudit.schemaScore}/100</span>
            </div>
            <div className={`text-center px-4 py-2.5 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`block text-[10px] uppercase font-bold ${isDark ? 'text-[#9E9E9E]' : 'text-slate-500'}`}>Entity Density</span>
              <span className={`text-xl font-black ${isDark ? 'gold-gradient-text' : 'text-emerald-600'}`}>{pageAudit.entityScore}/100</span>
            </div>
          </div>
        </div>

        {/* AI Discovered Competitors Banner */}
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-sky-50/50 border-sky-200'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
          <div className="flex items-center gap-2">
            <Users className={`w-4 h-4 ${isDark ? 'text-[#D4AF37]' : 'text-cyan-600'}`} />
            <span className={`font-bold ${isDark ? 'text-[#CFCFCF]' : 'text-slate-900'}`}>AI Auto-Discovered Competitors:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pageAudit.autoDiscoveredCompetitors.map((comp, cIdx) => (
              <span key={cIdx} className={`px-3 py-1 rounded-xl font-extrabold border flex items-center gap-2 ${
                isDark ? 'bg-[#181818] border-[#2A2A2A] text-[#D4AF37]' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
              }`}>
                <img
                  src={(pageAudit as any).competitorFavicons?.[comp] || `https://www.google.com/s2/favicons?domain=${comp}&sz=64`}
                  alt={comp}
                  className="w-4 h-4 rounded-sm object-contain"
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* Page Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`font-bold uppercase block mb-1 ${isDark ? 'text-[#9E9E9E]' : 'text-slate-500'}`}>Meta Title Tag</span>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{pageAudit.title || 'No Title Found'}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`font-bold uppercase block mb-1 ${isDark ? 'text-[#9E9E9E]' : 'text-slate-500'}`}>Meta Description</span>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{pageAudit.description || 'No Description Found'}</p>
          </div>
        </div>
      </div>

      {/* JSON-LD Schemas & Heading Outline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Schemas */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-xs'}`}>
          <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 mb-4`}>
            <FileCode className={`w-5 h-5 ${isDark ? 'text-[#D4AF37]' : 'text-purple-600'}`} /> JSON-LD Schema Markup Inspection
          </h4>

          <div className="space-y-3 text-xs">
            <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`font-bold ${isDark ? 'text-[#CFCFCF]' : 'text-slate-800'}`}>FAQPage Schema</span>
              {pageAudit.hasFaqSchema ? (
                <span className={`px-3 py-1 rounded-full border font-bold flex items-center gap-1 ${
                  isDark ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Detected
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Missing
                </span>
              )}
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`font-bold ${isDark ? 'text-[#CFCFCF]' : 'text-slate-800'}`}>Organization Schema</span>
              {pageAudit.hasOrganizationSchema ? (
                <span className={`px-3 py-1 rounded-full border font-bold flex items-center gap-1 ${
                  isDark ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Detected
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Missing
                </span>
              )}
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${isDark ? 'bg-[#0A0A0A] border-[#2A2A2A]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`font-bold ${isDark ? 'text-[#CFCFCF]' : 'text-slate-800'}`}>Product / Service Schema</span>
              {pageAudit.hasProductSchema ? (
                <span className={`px-3 py-1 rounded-full border font-bold flex items-center gap-1 ${
                  isDark ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Detected
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full font-bold ${isDark ? 'bg-[#202020] text-[#9E9E9E]' : 'bg-slate-200 text-slate-600'}`}>
                  Optional
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Knowledge Graph Entities */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-xs'}`}>
          <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 mb-4`}>
            <Tag className={`w-5 h-5 ${isDark ? 'text-[#D4AF37]' : 'text-emerald-600'}`} /> Vector Entity Density Keywords
          </h4>

          <p className={`text-xs ${isDark ? 'text-[#CFCFCF]' : 'text-slate-600'} mb-4 font-medium`}>
            Key brand and topical entities extracted for LLM vector embedding alignment:
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {pageAudit.entityKeywords.map((entity, eIdx) => (
              <span
                key={eIdx}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  isDark ? 'bg-[#0A0A0A] border-[#2A2A2A] text-white' : 'bg-slate-50 border-slate-300 text-slate-900 shadow-2xs'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#D4AF37]' : 'text-cyan-600'}`} />
                {entity}
              </span>
            ))}
          </div>

          <h5 className={`text-xs font-bold ${isDark ? 'text-[#9E9E9E]' : 'text-slate-800'} uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
            <Heading className={`w-4 h-4 ${isDark ? 'text-[#D4AF37]' : 'text-blue-600'}`} /> H2 Subheading Structure
          </h5>
          <div className="space-y-1.5 text-xs font-medium max-h-36 overflow-y-auto">
            {pageAudit.h2Tags.map((h2, hIdx) => (
              <div key={hIdx} className={`p-2 rounded-xl border truncate ${
                isDark ? 'bg-[#0A0A0A] border-[#2A2A2A] text-[#CFCFCF]' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                • {h2}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10-Page Crawl Results Table (GEO Studio Parity) */}
      {crawledPages && crawledPages.length > 0 && (
        <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200/80 dark:border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <FileSearch className={`w-5 h-5 ${isDark ? 'text-[#D4AF37]' : 'text-blue-600'}`} />
              <h4 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Discovered Pages & Subpage Audits ({totalScanned} Pages)
              </h4>
            </div>
            <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Multi-page crawl across site architecture
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#2A2A2A] text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-2.5 px-3 font-bold">Page URL / Path</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                  <th className="py-2.5 px-3 font-bold">Page Title</th>
                  <th className="py-2.5 px-3 font-bold">Word Count</th>
                  <th className="py-2.5 px-3 font-bold">JSON-LD Schema</th>
                  <th className="py-2.5 px-3 font-bold">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-[#2A2A2A]/60">
                {/* Root Homepage */}
                <tr className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                  <td className="py-3 px-3 font-bold">
                    <span className="text-emerald-500 font-extrabold">/</span> (Homepage)
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-500">200 OK</span>
                  </td>
                  <td className={`py-3 px-3 max-w-[200px] truncate ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                    {pageAudit.title || 'Root'}
                  </td>
                  <td className={`py-3 px-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {pageAudit.wordCount} words
                  </td>
                  <td className="py-3 px-3">
                    {pageAudit.detectedSchemas.length > 0 ? (
                      <span className="text-emerald-500 font-bold">Yes ({pageAudit.detectedSchemas.length})</span>
                    ) : (
                      <span className="text-rose-500 font-bold">None (0)</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-500">
                      {pageAudit.auditChecklist?.filter(c => c.status !== 'pass').length || 0} issues
                    </span>
                  </td>
                </tr>

                {/* Subpages */}
                {crawledPages.map((page, pIdx) => (
                  <tr key={pIdx} className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-300 max-w-[180px] truncate">
                      {page.path}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        page.status === 200 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className={`py-3 px-3 max-w-[220px] truncate ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                      {page.title || 'Untitled Page'}
                    </td>
                    <td className={`py-3 px-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      {page.wordCount} words
                    </td>
                    <td className="py-3 px-3">
                      {page.hasSchema ? (
                        <span className="text-emerald-500 font-bold">Detected</span>
                      ) : (
                        <span className="text-rose-500 font-bold">Missing</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {page.issuesCount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-500">
                          {page.issuesCount} issues
                        </span>
                      ) : (
                        <span className="text-emerald-500 font-bold">Clean</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ScrollReveal>
  );
}
