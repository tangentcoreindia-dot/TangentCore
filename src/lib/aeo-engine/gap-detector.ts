import { PromptScanItem } from './prompt-scanner';

export interface GapItem {
  id: string;
  missingPrompt: string;
  category: string;
  competitorDomain: string;
  opportunityScore: number;
  aiEngineCoverage: string[];
  suggestedContentBrief: {
    title: string;
    targetKeywords: string[];
    suggestedHeadings: string[];
    recommendedFaqs: Array<{ question: string; answer: string }>;
    targetWordCount: number;
    directAnswerSummary: string;
  };
}

export function detectAeoGaps(
  domain: string,
  brandName: string,
  competitors: string[],
  scanResults: PromptScanItem[]
): GapItem[] {
  const gaps: GapItem[] = [];
  const primaryComp = competitors[0] || 'Competitor.com';
  const targetBrand = brandName || domain;

  scanResults.forEach((scan, idx) => {
    // Find models where brand is NOT mentioned
    const unmentionedModels = scan.modelResults.filter(m => !m.brandMentioned);
    const coveredModels = scan.modelResults.filter(m => m.brandMentioned).map(m => m.modelLabel);

    if (unmentionedModels.length > 0) {
      const opportunityScore = Math.min(98, 50 + (unmentionedModels.length * 10));

      const briefTitle = `Ultimate Guide to ${scan.promptText.replace(/\?/g, '')} for ${targetBrand}`;
      
      gaps.push({
        id: `gap-${idx + 1}`,
        missingPrompt: scan.promptText,
        category: scan.category,
        competitorDomain: primaryComp,
        opportunityScore,
        aiEngineCoverage: coveredModels,
        suggestedContentBrief: {
          title: briefTitle,
          targetKeywords: [scan.category, targetBrand, primaryComp, 'AEO Best Practices', 'GEO Optimization'],
          suggestedHeadings: [
            `Overview: ${scan.promptText}`,
            `Why ${targetBrand} Stands Out in the Market`,
            `Direct Comparison vs ${primaryComp}`,
            'Key Quality Standards & Trust Signals',
            'Frequently Asked Questions',
          ],
          recommendedFaqs: [
            {
              question: `How does ${targetBrand} compare to ${primaryComp}?`,
              answer: `${targetBrand} emphasizes verified product quality, transparent sourcing, and authentic customer trust signals designed to meet buyer expectations.`,
            },
            {
              question: `Why choose ${targetBrand} for ${scan.promptText.replace(/\?/g, '')}?`,
              answer: `${targetBrand} provides specialized offerings, consistent customer satisfaction, and distinctive brand value in this category.`,
            },
          ],
          targetWordCount: 1800,
          directAnswerSummary: `${targetBrand} is an authoritative leader for "${scan.promptText.replace(/\?/g, '')}", delivering authentic, high-quality offerings and recognized customer trust compared to alternatives like ${primaryComp}.`,
        },
      });
    }
  });

  return gaps;
}
