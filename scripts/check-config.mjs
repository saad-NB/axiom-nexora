/**
 * check-config.mjs
 * ------------------------------------------------------------------
 * Verifies that site.config.ts is internally consistent and prints
 * any launch blockers that are still placeholders.
 *
 * Run with:  npm run check:config
 * ------------------------------------------------------------------
 */

import config, { LAUNCH_BLOCKERS, siteUrl } from '../site.config.ts';

const problems = [];
const warnings = [];
const notes = [];

/* ---- 1. Required values are present ---- */

if (!config.brand.companyName) problems.push('brand.companyName is empty.');
if (!config.contact.primaryEmail) problems.push('contact.primaryEmail is empty.');
if (!siteUrl) problems.push('site.url is empty.');

/* ---- 2. Email looks like an email ---- */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(config.contact.primaryEmail)) {
  problems.push(
    `contact.primaryEmail ("${config.contact.primaryEmail}") is not a valid address.`,
  );
}
if (config.contact.gmail && !emailPattern.test(config.contact.gmail)) {
  problems.push(`contact.gmail ("${config.contact.gmail}") is not a valid address.`);
}

/* ---- 3. Site URL is well formed ---- */

try {
  const parsed = new URL(siteUrl);
  if (parsed.protocol !== 'https:') {
    warnings.push(`site.url is not https. Use https for production.`);
  }
  if (parsed.pathname !== '/' && parsed.pathname !== '') {
    warnings.push(`site.url has a path ("${parsed.pathname}"). Use the bare domain.`);
  }
} catch {
  problems.push(`site.url ("${siteUrl}") is not a valid URL.`);
}

/* ---- 4. Social links are absolute URLs ---- */

for (const [key, value] of Object.entries(config.social)) {
  try {
    new URL(value);
  } catch {
    problems.push(`social.${key} ("${value}") is not a valid absolute URL.`);
  }
}

/* ---- 5. SEO description length ---- */

const descriptionLength = config.seo.description.length;
if (descriptionLength < 70) {
  warnings.push(`seo.description is ${descriptionLength} chars. Aim for 140 to 160.`);
} else if (descriptionLength > 170) {
  warnings.push(
    `seo.description is ${descriptionLength} chars and will truncate in search results. Aim for 140 to 160.`,
  );
}

const titleLength = config.seo.title.length;
if (titleLength > 65) {
  warnings.push(`seo.title is ${titleLength} chars and may truncate. Aim for 50 to 60.`);
}

/* ---- 6. Primary email must not be on a free provider ---- */

const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'proton.me'];
const emailDomain = config.contact.primaryEmail.split('@')[1] ?? '';
if (freeProviders.includes(emailDomain.toLowerCase())) {
  warnings.push(
    `contact.primaryEmail is on "${emailDomain}". Use a business address on your own domain.`,
  );
}

/* ---- 7. Copy rule check: no em dashes in any rendered string ---- */

function findEmDashes(value, path = 'config') {
  const found = [];
  if (typeof value === 'string') {
    if (value.includes('\u2014') || value.includes('\u2013')) {
      found.push(path);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => found.push(...findEmDashes(item, `${path}[${index}]`)));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      found.push(...findEmDashes(child, `${path}.${key}`));
    }
  }
  return found;
}

const emDashPaths = findEmDashes(config.brand, 'brand')
  .concat(findEmDashes(config.person, 'person'))
  .concat(findEmDashes(config.contact, 'contact'))
  .concat(findEmDashes(config.seo, 'seo'));

if (emDashPaths.length > 0) {
  problems.push(
    `Em dash found in rendered copy. The design system bans em dashes. Check: ${emDashPaths.join(', ')}`,
  );
}

/* ---- 8. Pricing row ids referenced by structured data must exist ----
   OFFERABLE in src/lib/seo.ts points at rows by id. Renaming a row silently
   drops the offer, so this is asserted rather than assumed. */

const offerable = [
  'price-diagnostic',
  'price-single-page',
  'price-multi-section',
  'price-mvp',
  'price-analysis',
  'price-ai',
];

const { pricing } = await import('../src/content/pricing.ts');
const rowIds = new Set(pricing.map((row) => row.id));
const missingRows = offerable.filter((id) => !rowIds.has(id));
if (missingRows.length > 0) {
  problems.push(
    `src/lib/seo.ts offers reference pricing rows that no longer exist: ${missingRows.join(', ')}. ` +
      `Available: ${[...rowIds].join(', ')}.`,
  );
}

/* ---- 9. Every pricing row must carry a parseable price ---- */

for (const row of pricing) {
  if (!row.price) {
    problems.push(`Pricing row "${row.id}" (${row.engagement}) has no price.`);
    continue;
  }
  if (!/\$\s?[\d,]+/.test(row.price)) {
    problems.push(
      `Pricing row "${row.id}" price "${row.price}" has no dollar figure, so it cannot appear in structured data.`,
    );
  }
  if (!row.timeline) {
    warnings.push(`Pricing row "${row.id}" (${row.engagement}) has no timeline.`);
  }
}

if (new Set(pricing.map((row) => row.id)).size !== pricing.length) {
  problems.push('Pricing rows contain duplicate ids. Anchors and offers will break.');
}

/* ---- 10. Section anchors used by nav and service links must exist ---- */

/**
 * The content files import from the `@config` and `@/` aliases, which only
 * exist inside the TypeScript and Next.js build. Rather than duplicate the
 * path mapping here, the anchor targets are read straight out of the source
 * with regex. It is checked at lint and build time by tsc.
 */
async function readAnchorsFrom(file, pattern) {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

const services = await import('../src/content/services.ts');
const navigation = await import('../src/content/navigation.ts');
const { faq } = await import('../src/content/process.ts');

/** Footer links live in content/contact.ts, which pulls in @config. */
const footerHrefs = [
  ...(await readAnchorsFrom('../src/content/contact.ts', /href:\s*'(#[^']+)'/g)),
];

/**
 * Section ids live on JSX elements, which cannot be imported here, so they
 * are read from the source instead. Anchors are hand-written in a dozen
 * places, and a silent mismatch means a nav link that scrolls nowhere.
 */
async function readRenderedSectionIds() {
  const { readFile, readdir } = await import('node:fs/promises');
  const componentsDir = new URL('../src/app/components/', import.meta.url);
  const files = (await readdir(componentsDir)).filter((name) => name.endsWith('.tsx'));
  const ids = new Set();

  // Section ids live on the <section> elements inside the section components,
  // not in page.tsx, which only composes them.
  for (const file of files) {
    const source = await readFile(new URL(file, componentsDir), 'utf8');
    for (const match of source.matchAll(/<section[^>]*?\bid="([\w-]+)"/g)) {
      ids.add(match[1]);
    }
  }

  // Pricing rows and FAQ items carry their own ids, injected at render time.
  for (const row of pricing) ids.add(row.id);
  for (const item of faq) ids.add(item.id);

  return ids;
}

const renderedIds = await readRenderedSectionIds();

const anchorTargets = [
  ...navigation.navigation.links.map((link) => ({ from: 'nav', href: link.href })),
  { from: 'nav.cta', href: navigation.navigation.cta.href },
  ...footerHrefs.map((href) => ({ from: 'footer', href })),
  ...services.services.map((service) => ({ from: `service:${service.title}`, href: service.link.href })),
  ...pricing.map((row) => ({ from: `pricing:${row.id}`, href: `#${row.id}` })),
];

for (const { from, href } of anchorTargets) {
  if (!href.startsWith('#')) continue;
  const id = href.slice(1);
  if (!renderedIds.has(id)) {
    problems.push(`${from} links to #${id}, but no element on the page renders that id.`);
  }
}

/* ---- 11. Launch blockers ---- */

const unresolved = LAUNCH_BLOCKERS.filter((item) => !item.resolved);
if (unresolved.length > 0) {
  notes.push(`${unresolved.length} launch blocker(s) still open:`);
  for (const item of unresolved) {
    notes.push(`  [ ] ${item.field}: ${item.description}`);
  }
} else {
  notes.push('All launch blockers resolved.');
}

/* ---- Report ---- */

console.log('');
console.log('  site.config.ts check');
console.log('  ' + '-'.repeat(56));
console.log(`  Brand       ${config.brand.companyName}`);
console.log(`  Domain      ${siteUrl}`);
console.log(`  Email       ${config.contact.primaryEmail}`);
console.log(`  Gmail       ${config.contact.gmail ?? '(not set)'}`);
console.log(`  Description ${descriptionLength} chars`);
console.log(`  Title       ${titleLength} chars`);
console.log('  ' + '-'.repeat(56));

if (notes.length > 0) {
  console.log('');
  for (const line of notes) console.log(line);
}

if (warnings.length > 0) {
  console.log('');
  console.log('  Warnings');
  for (const line of warnings) console.log(`  ! ${line}`);
}

if (problems.length > 0) {
  console.log('');
  console.log('  Errors');
  for (const line of problems) console.log(`  x ${line}`);
  console.log('');
  process.exit(1);
}

console.log('');
console.log('  Config OK.');
console.log('');
