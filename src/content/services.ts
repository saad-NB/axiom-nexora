/**
 * Service cells. Prices are deliberately absent here.
 * All numbers live in pricing.ts so there is one source of truth.
 * See DESIGN.md section 6.4.
 */

export type ServiceGlyph = 'browser' | 'layers' | 'chart' | 'nodes' | 'network';

export interface Service {
  index: string;
  glyph: ServiceGlyph;
  title: string;
  body: string;
  features: string[];
  link: { label: string; href: string };
  /** Spans both grid columns. Used for the AI and ML offering, which reads as
   *  a step change rather than another peer cell. */
  wide?: boolean;
}

export const servicesSection = {
  index: '01',
  eyebrow: 'SERVICES',
  heading: 'Five ways to engage.',
  lead:
    'Each service is fixed-scope, fixed-price, and delivered with documentation. Every engagement begins with a short scoping conversation.',
  footnote:
    'Every project starts with a short scoping conversation. No commitment, no generic proposal.',
};

export const services: Service[] = [
  {
    index: '01',
    glyph: 'browser',
    title: 'Website Design',
    body: 'Fast, accessible, search-optimized websites built with Next.js and deployed on Vercel. From a single landing page to a full company site, delivered with editorial attention to type, grid, and detail.',
    features: [
      'Mobile-first responsive layouts',
      'SEO foundations: semantic HTML, metadata, structured data',
      'Purposeful motion that respects reduced-motion settings',
      'Deployment, custom domain, and analytics setup included',
    ],
    link: { label: 'View pricing', href: '#price-single-page' },
  },
  {
    index: '02',
    glyph: 'layers',
    title: 'Full-Stack Applications',
    body: 'End-to-end product development: frontend, backend, database, deployment, and documentation. MVPs, internal tools, dashboards, and cross-platform applications built to keep running after handover.',
    features: [
      'Next.js, Node, Express, PostgreSQL',
      'Flutter applications for Android and Windows',
      'AI integration, hosted or fully local (Ollama, LangGraph, provider APIs)',
      'Offline-first architecture where connectivity cannot be assumed',
    ],
    link: { label: 'View pricing', href: '#price-mvp' },
  },
  {
    index: '03',
    glyph: 'chart',
    title: 'Medical Research Data Analysis',
    body: 'Statistical analysis and evidence synthesis for medical and health research, conducted in R and Python and delivered as reproducible code with plain-language summaries.',
    features: [
      'Systematic review support, pairwise and network meta-analysis',
      'Bayesian methods, heterogeneity and sensitivity analysis',
      'Reproducible pipelines with documented, versioned code',
      'Publication-ready tables, figures, and interpretation',
    ],
    link: { label: 'View pricing', href: '#price-analysis' },
  },
  {
    index: '04',
    glyph: 'nodes',
    title: 'Custom Hybrid Projects',
    body: 'Work that crosses disciplines: a clinical dataset that needs a dashboard, a model that needs an interface, an agent that needs guardrails. Scoped as one coherent project instead of three vendors.',
    features: [
      'Data science paired with production interfaces',
      'Model delivery with serving, export, and monitoring',
      'Agentic workflow design, build, and audit',
      'Technical assessment and advisory engagements',
    ],
    link: { label: 'Discuss a hybrid project', href: '#contact' },
  },
  {
    index: '05',
    glyph: 'network',
    title: 'AI and Machine Learning Applications',
    body: 'Custom intelligence built for a specific problem, from the framing through to a deployed system your team can actually use. We start by deciding whether a model is the right answer at all, then build the training or retrieval pipeline, the evaluation that proves it works, and the interface it runs inside.',
    features: [
      'Problem framing, data audit, and feasibility before any build',
      'Custom models, fine-tuning, and retrieval pipelines',
      'Agentic and multi-step LLM systems with guardrails and evaluation',
      'Hosted APIs or fully local inference (Ollama, LangGraph) where privacy matters',
      'Evaluation harness, monitoring, and handover documentation',
    ],
    link: { label: 'View pricing', href: '#price-ai' },
    wide: true,
  },
];
