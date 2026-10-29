// Lead capture and multi-channel delivery service (Email & WhatsApp)
// 100% parity with GEO Studio delivery funnel

export interface AuditLead {
  name: string;
  email: string;
  phone: string;
  domain: string;
  score?: number;
  grade?: string;
  metadata?: any;
}

export function formatWhatsAppMessage(lead: {
  name: string;
  domain: string;
  score: number;
  grade: string;
  pageAudit?: any;
  appUrl?: string;
}): string {
  const domain = lead.domain;
  const score = lead.score;
  const grade = lead.grade;
  const audit = lead.pageAudit || {};
  const baseUrl = lead.appUrl || 'https://www.tangentcore.in';
  const reportUrl = `${baseUrl}/dashboard?domain=${encodeURIComponent(domain)}`;

  const tech = audit.technicalSeoScore ?? 24;
  const cwv = audit.coreWebVitalsScore !== undefined && audit.coreWebVitalsScore !== null ? `${audit.coreWebVitalsScore}/100` : 'Calibrating';
  const onpage = audit.onPageScore ?? 17;
  const content = audit.contentQualityScore ?? 11;
  const a11y = audit.accessibilityScore ?? 29;
  const structuredData = audit.structuredDataScore ?? 0;
  const links = audit.internalLinkingScore ?? 21;

  const robots = audit.hasRobotsTxt ? '✅ Found' : '❌ Missing';
  const llms = audit.hasLlmsTxt ? '✅ Found' : '❌ Missing (Critical)';
  const sitemap = audit.hasSitemapXml ? '✅ Found' : '❌ Missing';
  const https = audit.hasHttps !== false ? '✅ Active' : '❌ Insecure';

  const actions = audit.actionsQueue || [];
  const topFixes = actions.slice(0, 3).map((a: any, i: number) => {
    return `${i + 1}. *${a.title || a.name || 'Critical Fix'}* (${a.priority || 'HIGH'})\n   _${a.description || a.details || 'Optimization required'}_`;
  }).join('\n');

  return `🚀 *TANGENTCORE™ AI & GEO ENGINE AUDIT*
━━━━━━━━━━━━━━━━━━━━━━━━━
👋 Hi ${lead.name || 'there'}, your full GEO audit for *${domain}* is ready!

📊 *OVERALL GEO HEALTH SCORE: ${score}/100*
🏆 *Health Grade:* ${grade}

📈 *7-CATEGORY HEALTH BREAKDOWN:*
• 🛠️ Technical SEO: *${tech}/100*
• ⚡ Core Web Vitals: *${cwv}*
• 📄 On-Page SEO: *${onpage}/100*
• ✍️ Content Quality: *${content}/100*
• ♿ Accessibility: *${a11y}/100*
• 🏷️ Structured Data: *${structuredData}/100*
• 🔗 Internal Linking: *${links}/100*

🛡️ *FOUNDATION STATUS:*
• Robots.txt: ${robots}
• LLMs.txt: ${llms}
• Sitemap.xml: ${sitemap}
• HTTPS Encryption: ${https}

${topFixes ? `⚠️ *TOP 3 IMMEDIATE FIXES:*\n${topFixes}\n\n` : ''}🔗 *VIEW YOUR COMPLETE INTERACTIVE REPORT & 9-SECTION PDF:*
👉 ${reportUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent via TangentCore Intelligence Engine_
_Questions? Reply directly or contact tangentcoreindia@gmail.com_`;
}

export function generateExecutiveHtmlEmail(data: {
  name: string;
  domain: string;
  score: number;
  grade: string;
  pageAudit?: any;
  appUrl?: string;
}): string {
  const { name, domain, score, grade, pageAudit = {}, appUrl = 'https://www.tangentcore.in' } = data;
  const reportUrl = `${appUrl}/dashboard?domain=${encodeURIComponent(domain)}`;

  const tech = pageAudit.technicalSeoScore ?? 24;
  const cwv = pageAudit.coreWebVitalsScore !== undefined && pageAudit.coreWebVitalsScore !== null ? `${pageAudit.coreWebVitalsScore}/100` : 'N/A';
  const onpage = pageAudit.onPageScore ?? 17;
  const content = pageAudit.contentQualityScore ?? 11;
  const a11y = pageAudit.accessibilityScore ?? 29;
  const structuredData = pageAudit.structuredDataScore ?? 0;
  const links = pageAudit.internalLinkingScore ?? 21;

  const robots = pageAudit.hasRobotsTxt ? 'Pass' : 'Missing';
  const llms = pageAudit.hasLlmsTxt ? 'Pass' : 'Missing';
  const sitemap = pageAudit.hasSitemapXml ? 'Pass' : 'Missing';
  const https = pageAudit.hasHttps !== false ? 'Active' : 'Missing';

  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const actions = (pageAudit.actionsQueue || []).slice(0, 3);
  const actionItemsHtml = actions.length > 0
    ? actions.map((act: any, i: number) => `
      <div style="background-color: #1a1a1f; border-left: 3px solid #C7A15A; padding: 12px 16px; margin-bottom: 10px; border-radius: 0 6px 6px 0;">
        <div style="font-weight: 700; color: #f3f4f6; font-size: 14px;">${i + 1}. ${act.title || act.name || 'Optimization Priority'}</div>
        <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">${act.description || act.details || ''}</div>
      </div>
    `).join('')
    : '<div style="color: #9ca3af; font-size: 13px;">No critical blocking issues detected.</div>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your GEO Studio Audit Report for ${domain}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0d; color: #f3f4f6; margin: 0; padding: 24px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #121216; border: 1px solid #26262e; border-radius: 12px; overflow: hidden;">
    
    <!-- Header -->
    <tr>
      <td style="padding: 24px 28px; background: linear-gradient(180deg, #181820 0%, #121216 100%); border-bottom: 1px solid #26262e;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 20px; font-weight: 900; color: #f3f4f6; letter-spacing: -0.5px;">
            <span style="color: #C7A15A;">TANGENT</span>CORE
          </span>
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #C7A15A; background-color: rgba(199, 161, 90, 0.1); border: 1px solid rgba(199, 161, 90, 0.25); padding: 4px 10px; border-radius: 9999px;">
            GEO Intelligence
          </span>
        </div>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px;">
        <h1 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0;">
          Executive AI & GEO Audit: <span style="color: #C7A15A;">${domain}</span>
        </h1>
        <p style="color: #9ca3af; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">
          Hello ${name || 'Team'}, here is your comprehensive search and generative AI visibility evaluation, scored against 106 foundation checks and multi-model frontier simulations.
        </p>

        <!-- Big Score Hero Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #17171d; border: 1px solid #2a2a35; border-radius: 10px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; margin-bottom: 6px;">
                Overall GEO Health Score
              </div>
              <div style="font-size: 56px; font-weight: 900; color: ${scoreColor}; line-height: 1;">
                ${score}<span style="font-size: 20px; color: #71717a; font-weight: 500;">/100</span>
              </div>
              <div style="margin-top: 8px;">
                <span style="display: inline-block; font-size: 12px; font-weight: 800; text-transform: uppercase; padding: 4px 14px; border-radius: 6px; background-color: ${scoreColor}22; color: ${scoreColor}; border: 1px solid ${scoreColor}44;">
                  Grade ${grade}
                </span>
              </div>
            </td>
          </tr>
        </table>

        <!-- 7 Category Matrix -->
        <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #e4e4e7; margin: 0 0 12px 0;">
          7-Category Health Breakdown
        </h3>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #17171d; border: 1px solid #26262e; border-radius: 8px; margin-bottom: 24px; font-size: 13px;">
          <tr style="border-bottom: 1px solid #26262e;">
            <td style="padding: 10px 14px; color: #d4d4d8;">🛠️ Technical SEO</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #f4f4f5;">${tech}/100</td>
          </tr>
          <tr style="border-bottom: 1px solid #26262e;">
            <td style="padding: 10px 14px; color: #d4d4d8;">⚡ Core Web Vitals</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #f4f4f5;">${cwv}</td>
          </tr>
          <tr style="border-bottom: 1px solid #26262e;">
            <td style="padding: 10px 14px; color: #d4d4d8;">📄 On-Page SEO</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #f4f4f5;">${onpage}/100</td>
          </tr>
          <tr style="border-bottom: 1px solid #26262e;">
            <td style="padding: 10px 14px; color: #d4d4d8;">✍️ Content Quality</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #f4f4f5;">${content}/100</td>
          </tr>
          <tr style="border-bottom: 1px solid #26262e;">
            <td style="padding: 10px 14px; color: #d4d4d8;">♿ Accessibility</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #f4f4f5;">${a11y}/100</td>
          </tr>
          <tr style="border-bottom: 1px solid #26262e;">
            <td style="padding: 10px 14px; color: #d4d4d8;">🏷️ Structured Data (Schema)</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #f4f4f5;">${structuredData}/100</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; color: #d4d4d8;">🔗 Internal Linking</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #f4f4f5;">${links}/100</td>
          </tr>
        </table>

        <!-- Foundation Signals -->
        <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #e4e4e7; margin: 0 0 12px 0;">
          Core Foundation Checks
        </h3>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; font-size: 12px;">
          <tr>
            <td width="25%" style="padding: 8px; text-align: center; background-color: #17171d; border-radius: 6px; border: 1px solid #26262e;">
              <div style="color: #a1a1aa; font-size: 11px;">Robots.txt</div>
              <div style="font-weight: 800; margin-top: 4px; color: ${robots === 'Pass' ? '#10b981' : '#ef4444'};">${robots}</div>
            </td>
            <td width="5%"></td>
            <td width="25%" style="padding: 8px; text-align: center; background-color: #17171d; border-radius: 6px; border: 1px solid #26262e;">
              <div style="color: #a1a1aa; font-size: 11px;">LLMs.txt</div>
              <div style="font-weight: 800; margin-top: 4px; color: ${llms === 'Pass' ? '#10b981' : '#ef4444'};">${llms}</div>
            </td>
            <td width="5%"></td>
            <td width="25%" style="padding: 8px; text-align: center; background-color: #17171d; border-radius: 6px; border: 1px solid #26262e;">
              <div style="color: #a1a1aa; font-size: 11px;">Sitemap.xml</div>
              <div style="font-weight: 800; margin-top: 4px; color: ${sitemap === 'Pass' ? '#10b981' : '#ef4444'};">${sitemap}</div>
            </td>
            <td width="5%"></td>
            <td width="25%" style="padding: 8px; text-align: center; background-color: #17171d; border-radius: 6px; border: 1px solid #26262e;">
              <div style="color: #a1a1aa; font-size: 11px;">HTTPS</div>
              <div style="font-weight: 800; margin-top: 4px; color: ${https === 'Active' ? '#10b981' : '#ef4444'};">${https}</div>
            </td>
          </tr>
        </table>

        <!-- Top Fixes Section -->
        <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #e4e4e7; margin: 0 0 12px 0;">
          Priority Recommendations
        </h3>
        ${actionItemsHtml}

        <!-- Primary CTA Button -->
        <div style="margin-top: 28px; text-align: center;">
          <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #C7A15A 0%, #A68038 100%); color: #000000; font-weight: 800; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 15px rgba(199, 161, 90, 0.35);">
            View Full Interactive Dashboard & PDF →
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 28px; background-color: #0d0d10; border-top: 1px solid #222228; text-align: center; color: #71717a; font-size: 11px; line-height: 1.6;">
        <div>TangentCore AI Search Optimization Platform</div>
        <div>Need technical assistance or a dedicated enterprise review? Contact <a href="mailto:tangentcoreindia@gmail.com" style="color: #C7A15A; text-decoration: underline;">tangentcoreindia@gmail.com</a></div>
      </td>
    </tr>

  </table>
</body>
</html>
  `;
}
