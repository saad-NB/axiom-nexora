import { social } from '@config';

/**
 * Peer-reviewed publications.
 *
 * ACCURACY NOTE (carried from the portfolio audit):
 * `summary` is a topic description, not a verbatim published title.
 * TODO before launch: replace `summary` with the exact published title
 * and set `doi` to the real DOI so the plates link to the record.
 * See DESIGN.md section 6.5.
 */

export interface Publication {
  journal: string;
  year: number;
  summary: string;
  role: string;
  doi: string | null;
  url: string | null;
}

export const publications: Publication[] = [
  {
    journal: 'Acta Physiologica',
    year: 2026,
    summary:
      'Fourth-line antihypertensive therapy in resistant hypertension. Pairwise meta-analysis in R covering 11 randomized controlled trials and 3,931 patients.',
    role: 'Research methodology design and data analysis',
    doi: null,
    url: null,
  },
  {
    journal: 'Clinical Lymphoma, Myeloma and Leukemia',
    year: 2026,
    summary:
      'BCMA-targeted therapies in relapsed and refractory multiple myeloma. Systematic review and meta-analysis.',
    role: 'Research methodology design and data analysis',
    doi: null,
    url: null,
  },
  {
    journal: 'Diabetes Research and Clinical Practice',
    year: 2026,
    summary:
      'Mirogabalin versus pregabalin versus duloxetine versus placebo for painful diabetic peripheral neuropathy. Network meta-analysis.',
    role: 'Research methodology design and data analysis',
    doi: null,
    url: null,
  },
];

export const publicationLinks = {
  orcid: social.orcid,
  github: social.github,
} as const;
