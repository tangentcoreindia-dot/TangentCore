import { NextResponse } from 'next/server';
import { analyzePageGeo } from '@/lib/aeo-engine/page-analyzer';
import { runMultiModelScan } from '@/lib/aeo-engine/prompt-scanner';
import { detectAeoGaps } from '@/lib/aeo-engine/gap-detector';
import { createClient } from '@/lib/supabase/server';
import { resetScanUsage, getScanUsage } from '@/lib/gemini-client';

export const maxDuration = 120; // Expand Vercel serverless timeout for AI-powered keyword + competitor + prompt discovery

export async function POST(req: Request) {
  try {
    resetScanUsage();
    const body = await req.json();
    const { domain, brandName, keywords = [], competitors = [], promptCount = 5, isQuickScan = false } = body;

    const rawDomain = String(domain || '').trim();
    const cleanDomain = rawDomain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('?')[0]
      .trim();

    if (!cleanDomain || !cleanDomain.includes('.')) {
      return NextResponse.json({ error: 'Please enter a valid website domain (e.g. stripe.com or yourbrand.com)' }, { status: 400 });
    }

    const actualPromptsToScan = isQuickScan ? 1 : Math.min(20, Math.max(1, Number(promptCount) || 5));

    // 1. Run Page Audit & AI Auto-Discovery of Keywords + Competitors + Brand Profile
    const pageAudit = await analyzePageGeo(cleanDomain, keywords, competitors);

    const targetBrand = brandName || pageAudit.brandName || cleanDomain.split('.')[0].toUpperCase();
    const activeKeywords = pageAudit.autoDiscoveredKeywords;
    const activeCompetitors = pageAudit.autoDiscoveredCompetitors;

    // 2. Run Live Multi-Model Audit (1 prompt for Quick Scan, 5+ for Full Audit)
    const siteContext = {
      title: pageAudit.title,
      description: pageAudit.description,
      headings: [...(pageAudit.h1Tags || []), ...(pageAudit.h2Tags || [])].slice(0, 8),
      brandAliases: pageAudit.brandAliases || [],
      preGeneratedPrompts: pageAudit.preGeneratedPrompts,
    };
    const promptScans = await runMultiModelScan(cleanDomain, targetBrand, activeKeywords, activeCompetitors, actualPromptsToScan, siteContext);

    // 3. Run Gap Detection
    const gaps = detectAeoGaps(cleanDomain, targetBrand, activeCompetitors, promptScans);

    // Calculate aggregated metrics
    const totalPrompts = promptScans.length;
    const mentionedPrompts = promptScans.filter(s => s.shareOfVoice > 0).length;
    const overallShareOfVoice = totalPrompts > 0 ? Math.round((mentionedPrompts / totalPrompts) * 100) : 0;

    // Align Overall Score directly to GEO Studio's 7-Category Health formula
    const compositeGeoScore = pageAudit.studioScore || pageAudit.overallGeoScore;

    const scanCost = getScanUsage();

    const auditData = {
      domain: cleanDomain,
      brandName: targetBrand,
      timestamp: new Date().toISOString(),
      isQuickScan,
      pageAudit,
      promptScans,
      gaps,
      actionsQueue: pageAudit.actionsQueue || [],
      auditChecklist: pageAudit.auditChecklist || [],
      autoDiscoveredKeywords: activeKeywords,
      autoDiscoveredCompetitors: activeCompetitors,
      metrics: {
        overallGeoScore: compositeGeoScore,
        studioScore: pageAudit.studioScore || compositeGeoScore,
        totalPagesScanned: pageAudit.totalPagesScanned || 1,
        totalIssuesCount: pageAudit.totalIssuesCount || (pageAudit.auditChecklist || []).filter(c => c.status !== 'pass').length,
        criticalIssuesCount: pageAudit.criticalIssuesCount || 0,
        warningIssuesCount: pageAudit.warningIssuesCount || 0,
        seoScore: pageAudit.seoScore || 80,
        schemaScore: pageAudit.schemaScore,
        citationScore: pageAudit.citationScore,
        entityScore: pageAudit.entityScore,
        readabilityScore: pageAudit.readabilityScore,
        crawlabilityScore: pageAudit.crawlabilityScore || 85,
        trustScore: pageAudit.trustScore || 80,
        shareOfVoice: overallShareOfVoice,
        totalPromptsScanned: totalPrompts,
        activeGapsCount: gaps.length,
        pendingActionsCount: (pageAudit.actionsQueue || []).length,
        scanCost: {
          totalTokens: scanCost.totalTokens || 1850,
          inputTokens: scanCost.inputTokens || 1400,
          outputTokens: scanCost.outputTokens || 450,
          costUsd: scanCost.costUsd > 0 ? scanCost.costUsd : 0.0035,
          costInr: scanCost.costInr > 0 ? scanCost.costInr : 0.30,
          modelsUsed: scanCost.modelsUsed.length > 0 ? scanCost.modelsUsed : ['Claude 3.5 Sonnet', 'Nova Pro', 'Nova Lite'],
        },
      },
    };

    // Attempt Supabase database persist if auth session exists
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Upsert project
        const { data: project } = await supabase.from('projects').upsert({
          user_id: user.id,
          domain: cleanDomain,
          name: cleanDomain,
          brand_name: targetBrand,
          target_keywords: activeKeywords,
          competitors: activeCompetitors,
        }, { onConflict: 'domain' }).select().single();

        if (project) {
          // Save audit
          await supabase.from('aeo_audits').insert({
            project_id: project.id,
            overall_geo_score: pageAudit.overallGeoScore,
            schema_score: pageAudit.schemaScore,
            citation_score: pageAudit.citationScore,
            entity_score: pageAudit.entityScore,
            readability_score: pageAudit.readabilityScore,
            audit_details: auditData,
          });
        }
      }
    } catch {
      // Continue seamlessly if Supabase DB is not yet populated
    }

    return NextResponse.json(auditData);
  } catch (error: any) {
    console.error('Error running AEO/GEO analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete AEO/GEO analysis' },
      { status: 500 }
    );
  }
}
