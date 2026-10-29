'use client';

import { Printer, Download, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ReportDownloadButtonProps {
  auditData: any;
  isDark?: boolean;
}

export function ReportDownloadButton({ auditData, isDark = true }: ReportDownloadButtonProps) {
  const handlePrintPdf = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!auditData) return;
    const domain = auditData.domain || 'your domain';
    const score = auditData.metrics?.overallGeoScore || auditData.pageAudit?.overallGeoScore || 0;
    const foundation = auditData.pageAudit?.technicalFoundation;
    const totalPages = auditData.pageAudit?.totalPagesScanned || 10;
    const totalIssues = auditData.pageAudit?.totalIssuesCount || (auditData.pageAudit?.auditChecklist || []).filter((c: any) => c.status !== 'pass').length;

    const robotsStatus = foundation?.robotsTxt?.exists ? 'Present ✅' : 'Missing ❌';
    const llmsStatus = foundation?.llmsTxt?.exists ? 'Present ✅' : 'Missing ❌';
    const sitemapStatus = foundation?.sitemapXml?.exists ? 'Present ✅' : 'Missing ❌';
    const httpsStatus = foundation?.https?.secure !== false ? 'Secure ✅' : 'Insecure ❌';

    const text = `📊 *GEO & AI Search Audit Report: ${domain}*
*Overall GEO Score:* ${score}/100 (${score < 30 ? 'Critical' : score < 70 ? 'Needs Improvement' : 'Good'})
*Pages Analyzed:* ${totalPages} Pages
*Total Issues Detected:* ${totalIssues}

*Foundational Signals:*
• robots.txt: ${robotsStatus}
• llms.txt: ${llmsStatus}
• sitemap.xml: ${sitemapStatus}
• HTTPS: ${httpsStatus}

*Category Health:*
• Structured Data: ${auditData.pageAudit?.schemaScore ?? 0}/100
• Technical SEO: ${auditData.pageAudit?.seoScore ?? 24}/100
• On-Page SEO: ${auditData.pageAudit?.readabilityScore ?? 17}/100

🔗 *View Full Multi-Page Audit Report & Code Fixes:*
https://${domain}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success('Opening WhatsApp with formatted report!');
  };

  const handleDownloadJson = () => {
    if (!auditData) return;
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEO-GEO-Audit-${auditData.domain || 'report'}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Audit JSON data downloaded!');
  };

  return (
    <div className="flex items-center gap-2 no-print">
      <button
        onClick={handleShareWhatsApp}
        className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs font-sans"
        title="Share formatted executive audit report via WhatsApp"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>WhatsApp Report</span>
      </button>

      <button
        onClick={handlePrintPdf}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
            : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs'
        }`}
        title="Export or print clean PDF report without header/footer UI"
      >
        <Printer className="w-3.5 h-3.5 text-cyan-500" />
        <span>Export PDF Report</span>
      </button>

      <button
        onClick={handleDownloadJson}
        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs'
        }`}
        title="Download raw audit JSON dataset"
      >
        <Download className="w-3.5 h-3.5 text-blue-500" />
        <span>JSON</span>
      </button>
    </div>
  );
}
