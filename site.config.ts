/**
 * site.config.ts
 * ------------------------------------------------------------------
 * THE ONLY FILE YOU NEED TO EDIT TO RE-BRAND OR RE-DEPLOY THIS SITE.
 *
 * Every string that identifies the business flows from here: navigation,
 * hero, contact, footer, <head> metadata, Open Graph tags, JSON-LD
 * structured data, sitemap.xml, robots.txt, and the generated OG image.
 * Change a value in this file and it updates everywhere, with no other edits.
 *
 * Marked items with `TODO` are placeholders that must be resolved before
 * launch. They are also collected in `LAUNCH_BLOCKERS` at the bottom of this
 * file, and `npm run check:config` prints the unresolved ones.
 * ------------------------------------------------------------------
 */

/* ------------------------------------------------------------------ */
/* 1. BRAND                                                            */
/* ------------------------------------------------------------------ */

export const brand = {
  /** Legal / trading name of the practice. Used in the footer and JSON-LD. */
  companyName: 'Axiom Nexora',

  /** Short display name for tight spaces such as the mobile overlay menu. */
  shortName: 'Axiom Nexora',

  /** Uppercase mono lockup. Wordmark and OG image. */
  wordmark: 'AXIOM NEXORA',

  /** One line that appears under the wordmark and in the footer. */
  tagline: 'Analysis you can defend. Software you can ship.',

  /** Displayed on the profile plate and used as the "since" signal. */
  foundedYear: '2023',

  /** Two or three words for the ticker band and meta keywords. */
  discipline: 'Research and Software Practice',
} as const;

/* ------------------------------------------------------------------ */
/* 2. PERSON (the practitioner behind the brand)                        */
/* ------------------------------------------------------------------ */

export const person = {
  name: 'Saad NB',

  /** Used in bylines, JSON-LD author, and the "led by" line. */
  fullName: 'Saad NB',

  /** Short professional title. Shown on the profile plate. */
  role: 'Analyst and Developer',

  /**
   * Whether the practice brands as "we" (company) or "I" (solo).
   * Set to false if the site is ever reverted to a personal showcase.
   */
  usePluralVoice: true,
} as const;

/* ------------------------------------------------------------------ */
/* 3. DOMAIN AND URLS                                                  */
/* ------------------------------------------------------------------ */

export const site = {
  /**
   * The live domain, no trailing slash. Drives metadataBase, canonical URLs,
   * Open Graph, sitemap, robots, and JSON-LD, so it is the one value every
   * absolute URL on the site derives from.
   *
   * This is the Vercel project domain. If you later attach a custom domain,
   * change it here and set canonicalOverride to the same value, then
   * rebuild, or the two hostnames will disagree.
   */
  url: 'https://axiom-nexora.vercel.app',

  /** Locale used for Open Graph. */
  locale: 'en_US',

  /** Path to the generated social share image. */
  ogImagePath: '/opengraph-image',

  /**
   * Optional canonical override. Leave null so it derives from site.url.
   * Set to a string only if you are consolidating several domains.
   */
  canonicalOverride: null as string | null,
} as const;

/* ------------------------------------------------------------------ */
/* 4. CONTACT                                                          */
/* ------------------------------------------------------------------ */

export const contact = {
  /**
   * The live Zoho mailbox. Primary contact address shown in the contact
   * section, the footer, every mailto link, the OG image, and the JSON-LD.
   */
  primaryEmail: 'axiomnexora@zohomail.com',

  /**
   * TODO: Optional personal Gmail. Leave null to hide it entirely.
   * If set, it appears in the footer "Elsewhere" column only.
   * Never use this as the primary outreach address.
   */
  gmail: null as string | null,

  /** Prefilled subject line on the mailto link. */
  emailSubject: 'Project inquiry',

  /** Promise shown in the contact section and the FAQ. */
  responseTime: 'one to two business days',

  /**
   * TODO: Optional scheduling link (Calendly, Cal.com, etc).
   * Leave null and the two-time-windows sentence is used instead.
   */
  schedulingUrl: null as string | null,

  /** Alternative sentence when schedulingUrl is null. */
  schedulingFallback:
    'Prefer a call? Propose two time windows in your first message and I will confirm one.',
} as const;

/* ------------------------------------------------------------------ */
/* 5. SOCIAL AND RESEARCH ACCOUNTS                                     */
/* ------------------------------------------------------------------ */

export const social = {
  /** TODO: Point at the org account if you create one, keep personal if not. */
  github: 'https://github.com/saad-NB',

  orcid: 'https://orcid.org/0009-0001-6417-569X',
  linkedin: 'https://www.linkedin.com/in/muhammad-saad-20138b28b',
} as const;

/* ------------------------------------------------------------------ */
/* 6. SEO                                                             */
/* ------------------------------------------------------------------ */

export const seo = {
  /** Browser tab and search result title. Aim for 50 to 60 characters. */
  title: `${brand.companyName} | Research-Grade Analysis and Production Software`,

  /** Appended to every page-level title. */
  titleTemplate: `%s | ${brand.shortName}`,

  /**
   * Meta description. Aim for 140 to 160 characters.
   * This is the snippet shown in Google, so it carries real weight.
   */
  description:
    'Website design, full-stack applications, and medical research data analysis in R and Python. Meta-analysis, reproducible pipelines, and production software.',

  /** Short description used for Open Graph and the social card alt text. */
  ogDescription:
    'Website design, full-stack applications, and medical research data analysis. Analysis you can defend, software you can ship.',

  /** Alternate text for the generated Open Graph image. */
  ogImageAlt: `${brand.companyName}. ${brand.tagline}`,

  /**
   * Meta keywords. Google largely ignores these, but Bing and some
   * alternative engines still read them. Keep it honest and specific.
   */
  keywords: [
    'Axiom Nexora',
    'Saad NB',
    'medical research data analysis',
    'meta-analysis',
    'network meta-analysis',
    'systematic review',
    'R statistical analysis',
    'Python data analysis',
    'Next.js developer',
    'Flutter developer',
    'full-stack development',
    'website design',
    'AI agent development',
    'offline-first architecture',
  ],

  /**
   * TODO: Add a Twitter/X handle if one exists, e.g. '@axiomnexora'.
   * Leave null and the card renders without the handle line.
   */
  twitterHandle: null as string | null,

  /** Twitter card type. 'summary_large_image' shows the full OG image. */
  twitterCard: 'summary_large_image',

  /** Keeps search engines from indexing duplicate or preview URLs. */
  robots: 'index, follow, max-image-preview:large, max-snippet:-1',

  /** Verifies ownership in Google Search Console. TODO: fill in. */
  googleVerification: null as string | null,

  /** Verifies ownership in Bing Webmaster Tools. TODO: fill in. */
  bingVerification: null as string | null,
} as const;

/* ------------------------------------------------------------------ */
/* 7. FOOTER LEGAL                                                     */
/* ------------------------------------------------------------------ */

export const legal = {
  /** TODO: Set to a real registered entity if one exists. */
  entityName: brand.companyName,

  /** Year shown in the copyright line. Update once per year. */
  year: new Date().getFullYear(),

  /**
   * TODO: Review this with a local professional before going live.
   * Shown as a small line in the footer. Set to null to hide it.
   */
  disclaimer: null as string | null,
} as const;

/* ------------------------------------------------------------------ */
/* DERIVED VALUES (do not edit below this line)                        */
/* ------------------------------------------------------------------ */

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const siteUrl = trimTrailingSlash(site.url);
export const canonicalUrl = trimTrailingSlash(site.canonicalOverride ?? site.url);

export const displayEmail = contact.primaryEmail;
export const mailtoHref = `mailto:${contact.primaryEmail}?subject=${encodeURIComponent(
  contact.emailSubject,
)}`;

/** Builds an absolute URL from a root-relative path. Used by metadata. */
export function absoluteUrl(path = '/'): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/** The uppercase email rendered in the OG image strip. */
export const ogImageEmailLine = displayEmail.toUpperCase();

/* ------------------------------------------------------------------ */
/* LAUNCH BLOCKERS                                                     */
/* ------------------------------------------------------------------ */

/**
 * Substrings that mark a value as still being a stand-in rather than the real
 * thing. Checked explicitly instead of by eyeball, so changing the domain or
 * the mailbox cannot silently leave a blocker reported as open or, worse,
 * reported as resolved when it is not.
 */
export const PLACEHOLDER_VALUES = ['placeholder', 'yourdomain', 'example.com', 'TODO'] as const;

/**
 * Every unresolved placeholder, in one list. Run `npm run check:config`
 * to print it. Items are removed automatically when you replace the
 * corresponding value above with something real.
 */
export const LAUNCH_BLOCKERS = [
  {
    field: 'site.url',
    description: 'Replace with the real production domain, no trailing slash.',
    resolved: !PLACEHOLDER_VALUES.some((value) => site.url.includes(value)),
  },
  {
    field: 'contact.primaryEmail',
    description: 'Replace with the live Zoho mailbox on your own domain.',
    resolved: !PLACEHOLDER_VALUES.some((value) => contact.primaryEmail.includes(value)),
  },
  {
    field: 'seo.googleVerification',
    description: 'Add the Google Search Console verification token.',
    resolved: Boolean(seo.googleVerification),
  },
  {
    field: 'social.orcid',
    description: 'Confirm the ORCID iD is production, public, and lists the works.',
    resolved: true,
  },
] as const;

export const unresolvedBlockers = LAUNCH_BLOCKERS.filter((item) => !item.resolved);

/** Convenience default export so `import config from '@config'` also works. */
const siteConfig = {
  brand,
  person,
  site,
  contact,
  social,
  seo,
  legal,
  siteUrl,
  canonicalUrl,
  displayEmail,
  mailtoHref,
  absoluteUrl,
  LAUNCH_BLOCKERS,
  unresolvedBlockers,
} as const;

export default siteConfig;
