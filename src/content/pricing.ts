/**
 * Pricing and engagement. The only place prices appear.
 *
 * `id` values are anchor targets. Service cards link to them
 * (see services.ts) and the row flashes once on arrival.
 * See DESIGN.md section 6.6.
 */

export interface PricingRow {
  id: string;
  engagement: string;
  price: string;
  priceNote?: string;
  coverage: string;
  timeline: string;
}

export const pricingSection = {
  index: '03',
  eyebrow: 'PRICING',
  heading: 'Transparent pricing, fixed scope.',
  lead:
    'Fixed prices against defined deliverables. Larger builds are scoped in a written proposal before any work begins.',
  columns: ['Engagement', 'Price', 'What it covers', 'Typical timeline'] as const,
  footnote:
    'Paid pilot available: start with a small, well-defined slice at a fixed price before committing to a larger engagement. Real work, honestly priced, no free trials.',
};

export const pricing: PricingRow[] = [
  {
    id: 'price-diagnostic',
    engagement: 'Diagnostic or audit',
    price: '$250',
    priceNote: 'Basic assessment $250. Comprehensive audit $750 and up.',
    coverage:
      'A focused assessment of your data, codebase, or problem, delivered with a written recommendation and a prioritised fix list.',
    timeline: '2-5 days',
  },
  {
    id: 'price-single-page',
    engagement: 'Single-page site',
    price: '$400',
    coverage:
      'One page, built to convert: responsive layout, SEO foundations, structured data, deployment, and custom domain setup.',
    timeline: '3-5 days',
  },
  {
    id: 'price-multi-section',
    engagement: 'Multi-section site',
    price: '$1,500+',
    priceNote: 'Scoped by section count and motion requirements.',
    coverage:
      'A full company or product site: multiple sections, navigation, editorial system, motion, and analytics setup.',
    timeline: '2-3 weeks',
  },
  {
    id: 'price-mvp',
    engagement: 'MVP or full-stack',
    price: '$2,500+',
    priceNote: 'Larger builds scoped per project.',
    coverage:
      'MVPs, internal tools, dashboards, and cross-platform apps, including database, authentication, deployment, and documentation.',
    timeline: '3-8 weeks',
  },
  {
    id: 'price-analysis',
    engagement: 'Data analysis',
    price: '$500+',
    priceNote: 'Scoped per project.',
    coverage:
      'Meta-analysis, systematic review support, and custom statistical work in R or Python, delivered as reproducible code with plain-language interpretation.',
    timeline: '1-4 weeks',
  },
  {
    id: 'price-ai',
    engagement: 'AI or ML application',
    price: 'from $5,000',
    priceNote: 'Price scales with the complexity of the problem you are solving.',
    coverage:
      'Custom models and agentic systems: problem framing, data preparation, training or retrieval pipelines, evaluation, and a deployed interface. Hosted or fully local inference.',
    timeline: '4-12 weeks',
  },
];
