import { brand, person } from '@config';

export const hero = {
  eyebrow: `RESEARCH AND SOFTWARE PRACTICE · EST. ${brand.foundedYear}`,
  headingLines: ['Analysis you can defend.', 'Software you can ship.'],
  lead:
    'Axiom Nexora is a research and software practice led by Saad NB. We design analyses you can defend and build the software that puts them to work: websites, applications, dashboards, and reproducible pipelines.',
  primaryCta: { label: 'Start a project', href: '#contact' },
  secondaryCta: { label: 'See selected work', href: '#work' },
} as const;

export const profilePlate = {
  header: `PROFILE / ${brand.foundedYear}`,
  rows: [
    { label: 'Name', value: brand.companyName },
    { label: 'Led by', value: person.name },
    { label: 'Role', value: person.role },
    { label: 'Focus', value: 'Medical research, web, ML, AI' },
    { label: 'Methods', value: 'Meta-analysis, network meta-analysis, Bayesian modeling' },
    { label: 'Stack', value: 'R, Python, Next.js, Flutter, PostgreSQL, Docker' },
    { label: 'Records', value: '3 papers (2026), ORCID registered' },
  ],
  status: 'Available for new projects',
} as const;

/**
 * Every figure here traces to a publication or a public repository.
 * Copy rule: no invented metrics. See DESIGN.md section 6.2.
 *
 * `display` is what gets prerendered, so it must be the real final value.
 * The count-up animation only ever overwrites it in the browser.
 */
export const heroStats = [
  { value: 3, display: '03', label: 'Papers published in 2026' },
  { value: 3931, display: '3,931', label: 'Patients in largest synthesis' },
  { value: 11, display: '11', label: 'RCTs in one meta-analysis' },
  { value: 3, display: '03', label: 'Public repositories' },
] as const;
