import {
  brand,
  canonicalUrl,
  contact,
  displayEmail,
  person,
  seo,
  site as siteSettings,
  social,
} from '@config';
import { faq } from '@/content/process';
import { pricing } from '@/content/pricing';
import { publications } from '@/content/publications';
import { work } from '@/content/work';

type Json = Record<string, unknown>;

const abs = (path: string) => `${canonicalUrl}${path.startsWith('/') ? path : `/${path}`}`;

const knowAbout = [
  'Meta-Analysis',
  'Network Meta-Analysis',
  'Systematic Reviews',
  'Statistical Modeling',
  'Bayesian Modeling',
  'R Programming',
  'Python',
  'Next.js',
  'React',
  'TypeScript',
  'Flutter',
  'AI Agents',
  'Offline-First Architecture',
  'Evidence Synthesis',
];

/**
 * Services that map to a fixed entry price, used for makesOffer.
 *
 * These row ids must match `pricing` in src/content/pricing.ts. When a row
 * is renamed the offer is silently dropped, so `npm run check:config` asserts
 * that every id here resolves.
 */
const OFFERABLE = [
  { name: 'Diagnostic or Audit', rowId: 'price-diagnostic' },
  { name: 'Single-Page Website', rowId: 'price-single-page' },
  { name: 'Multi-Section Website', rowId: 'price-multi-section' },
  { name: 'MVP or Full-Stack Application', rowId: 'price-mvp' },
  { name: 'Data Analysis', rowId: 'price-analysis' },
  { name: 'AI or ML Application', rowId: 'price-ai' },
] as const;

/** Pulls the lowest numeric price out of a pricing row like "from $50". */
function minPriceFrom(price: string): string | null {
  const match = price.match(/\$([\d,]+)/);
  if (!match || !match[1]) return null;
  return match[1].replace(/,/g, '');
}

/**
 * A price is a floor, not a total, when it is written with a trailing plus or
 * a leading "from". Schema.org treats those differently, so a "+" that is only
 * mentioned in the price note must not silently change the price type.
 */
function isFloorPrice(price: string): boolean {
  return /\+/.test(price) || /^\s*from\b/i.test(price);
}

const PRICE_SPEC_FLAT = 'https://schema.org/PriceSpecification';
const PRICE_SPEC_FLOOR = 'https://schema.org/PriceSpecificationMinimumPrice';

const offers = OFFERABLE.flatMap(({ name, rowId }) => {
  const row = pricing.find((item) => item.id === rowId);
  if (!row) return [];
  const minPrice = minPriceFrom(row.price);
  if (!minPrice) return [];
  return [
    {
      '@type': 'Offer',
      'itemOffered': { '@type': 'Service', name },
      'url': `${canonicalUrl}/#${rowId}`,
      priceCurrency: 'USD',
      ...(isFloorPrice(row.price) ? {} : { price: minPrice }),
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: minPrice,
        priceCurrency: 'USD',
        minPrice,
        valueAddedTaxIncluded: false,
        priceType: isFloorPrice(row.price) ? PRICE_SPEC_FLOOR : PRICE_SPEC_FLAT,
        ...(row.timeline ? { description: `Typical timeline: ${row.timeline}` } : {}),
        ...(row.priceNote ? { description: row.priceNote } : {}),
      },
    },
  ];
});

const paperNodes: Json[] = publications.map((pub, index) => ({
  '@type': 'ScholarlyArticle',
  '@id': `${canonicalUrl}/#paper-${index + 1}`,
  name: pub.summary,
  datePublished: String(pub.year),
  isPartOf: {
    '@type': 'Periodical',
    name: pub.journal,
  },
  author: { '@id': `${canonicalUrl}/#person` },
  ...(pub.url ? { url: pub.url } : {}),
}));

/**
 * A single connected @graph. One script tag instead of several is
 * marginally faster and lets search engines resolve the references
 * between the organization, the person, and the papers.
 */
export const structuredData: Json = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${canonicalUrl}/#organization`,
      name: brand.companyName,
      alternateName: brand.wordmark,
      url: canonicalUrl,
      logo: abs(siteSettings.ogImagePath),
      image: abs(siteSettings.ogImagePath),
      email: displayEmail,
      description: seo.description,
      foundingDate: brand.foundedYear,
      slogan: brand.tagline,
      knowsLanguage: 'en',
      sameAs: [social.github, social.linkedin, social.orcid],
      founder: { '@id': `${canonicalUrl}/#person` },
      employee: { '@id': `${canonicalUrl}/#person` },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'New business inquiries',
        email: displayEmail,
        availableLanguage: ['English'],
        responseTime: contact.responseTime,
      },
      makesOffer: offers,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Engagements and pricing',
        itemListElement: pricing.map((row) => {
          const minPrice = minPriceFrom(row.price);
          return {
            '@type': 'Offer',
            'itemOffered': { '@type': 'Service', name: row.engagement },
            url: `${canonicalUrl}/#${row.id}`,
            ...(minPrice
              ? {
                  priceCurrency: 'USD',
                  priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price: minPrice,
                    priceCurrency: 'USD',
                    minPrice,
                    priceType: isFloorPrice(row.price) ? PRICE_SPEC_FLOOR : PRICE_SPEC_FLAT,
                  },
                }
              : {}),
          };
        }),
      },
    },
    {
      '@type': 'Person',
      '@id': `${canonicalUrl}/#person`,
      name: person.fullName,
      alternateName: person.name,
      url: canonicalUrl,
      jobTitle: person.role,
      description: seo.description,
      knowsAbout: knowAbout,
      worksFor: { '@id': `${canonicalUrl}/#organization` },
      sameAs: [social.github, social.linkedin, social.orcid],
    },
    {
      '@type': 'WebSite',
      '@id': `${canonicalUrl}/#website`,
      url: canonicalUrl,
      name: brand.companyName,
      description: seo.description,
      inLanguage: 'en',
      publisher: { '@id': `${canonicalUrl}/#organization` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}/#faq`,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}/#work`,
      name: 'Selected work',
      numberOfItems: work.length,
      itemListElement: work.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.href,
      })),
    },
    ...paperNodes,
  ],
};

/** Serialized for a <script type="application/ld+json"> tag. */
export const structuredDataJson = JSON.stringify(structuredData);
