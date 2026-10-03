/**
 * Engagement process and FAQ copy.
 *
 * Voice rule: the practice speaks as "we"; Saad NB speaks as "I" in
 * direct, personal moments (contact, FAQ answers, delivery).
 * No em dashes anywhere. See DESIGN.md sections 6.8 and 6.10.
 */

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

export const processSection = {
  index: '04',
  eyebrow: 'PROCESS',
  heading: 'From first message to delivered work.',
  callout:
    'Paid pilot option: for larger projects we begin with a well-defined slice at a small fixed price. You evaluate the quality and the working style directly before committing further.',
};

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'First message',
    body: 'Email a description of the problem and what you have tried. A rough outline is enough to start.',
  },
  {
    index: '02',
    title: 'Scoping call or diagnostic',
    body: 'We define the real problem, the constraints, and what done looks like. For complex work, a small paid diagnostic precedes the proposal.',
  },
  {
    index: '03',
    title: 'Fixed proposal',
    body: 'One page: scope, fixed price, deliverables, and timeline. No open-ended engagements.',
  },
  {
    index: '04',
    title: 'Build with check-ins',
    body: 'Analysis and development proceed with regular written updates. You always know the state of the work.',
  },
  {
    index: '05',
    title: 'Delivery and walkthrough',
    body: 'The deliverable arrives with documentation and a walkthrough, so your team can use it independently.',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqSection = {
  index: '05',
  eyebrow: 'FAQ',
  heading: 'Before you write.',
};

export const faq: FaqItem[] = [
  {
    id: 'faq-start',
    question: 'How do we start?',
    answer:
      'Email us with a short description of your project. I reply within one to two business days. If the work is a fit, we schedule a scoping call or begin with a small diagnostic.',
  },
  {
    id: 'faq-engagement',
    question: 'What does a typical engagement look like?',
    answer:
      'Most engagements are fixed-scope with a fixed price: a diagnostic or audit ($100 to $500), a defined project (websites from $50, full-stack builds from $200, data analysis from $100), or ongoing support by written agreement. Everything begins with a scope you approve.',
  },
  {
    id: 'faq-trials',
    question: 'Do you accept unpaid trials?',
    answer:
      'I do not take free tests. Instead, I offer a paid pilot on a well-defined slice of the work. It is real, scoped, and priced small, and it gives both sides an honest evaluation before a larger commitment.',
  },
  {
    id: 'faq-tools',
    question: 'Can you work with our existing tools and data?',
    answer:
      'Yes. For analysis, we work with spreadsheets, databases, APIs, and public datasets. For development, we build into your existing stack or start fresh. Describe what you have and the scope follows from it.',
  },
  {
    id: 'faq-timelines',
    question: 'What are typical timelines?',
    answer:
      'Diagnostics take a few days. Websites take three to ten days. Full-stack applications take two to six weeks. Analysis projects range from days to weeks depending on data quality and scope. Every proposal states its timeline in writing.',
  },
  {
    id: 'faq-medical',
    question: 'Do you specialize in medical and health projects?',
    answer:
      'Medical research data analysis is one of our three core services: systematic reviews, pairwise and network meta-analysis, real-world evidence, and plain-language summaries, conducted in R and Python. Three papers published in 2026 carry this work, listed under Selected Work.',
  },
  {
    id: 'faq-scope',
    question: 'Can you help me define what I actually need?',
    answer:
      'That is precisely the diagnostic step. If you are unsure whether the answer is a website, a dashboard, an analysis, or something else, start there. You receive a written recommendation either way, and it tells you honestly when we are not the right fit.',
  },
];
