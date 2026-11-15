export interface PlanConfig {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  monthlyAmountInr: number; // in Rupees
  annualAmountInr: number; // in Rupees
  monthlyAmountUsd: number;
  annualAmountUsd: number;
  description: string;
}

export const PRICING_PLANS: Record<string, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    monthlyAmountInr: 3299,
    annualAmountInr: 31499,
    monthlyAmountUsd: 39,
    annualAmountUsd: 372,
    description: 'Essential GEO scanning for startups & single product websites (2 LLMs, 15 Prompt Keywords).',
  },
  growth: {
    id: 'growth',
    name: 'Growth Dominator',
    monthlyAmountInr: 12499,
    annualAmountInr: 119999,
    monthlyAmountUsd: 149,
    annualAmountUsd: 1428,
    description: 'Complete Multi-LLM GEO suite for high-growth brands seeking #1 recommendations on AI search.',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Scale',
    monthlyAmountInr: 32999,
    annualAmountInr: 319999,
    monthlyAmountUsd: 399,
    annualAmountUsd: 3828,
    description: 'Full multi-brand corporate suite with custom API integrations and dedicated GEO strategist.',
  },
};
