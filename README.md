# Axiom Nexora website

Single-page business showcase. Next.js 15 (App Router), TypeScript, CSS
Modules. Fully static, deployed on Vercel.

Built from `../updatedDESIGN.md` (Swiss Signal design system v2.0).

---

## The one file that matters

**`site.config.ts` in this folder is the single source of truth for every
brand, contact, domain, social, and SEO value on the site.**

Change a value there and it propagates everywhere at once: navigation,
hero, contact section, footer, `<head>` metadata, Open Graph tags,
JSON-LD structured data, `sitemap.xml`, `robots.txt`, and the generated
social share card. No other file needs to be touched.

There are no environment variables. See `.env.example` for why.

### Swapping the brand, domain, or email

1. Open `site.config.ts`.
2. Edit the value you need. Everything marked `TODO` is a placeholder.
3. Run `npm run check:config` to confirm nothing is broken and see what
   is still unresolved.
4. `npm run build`.

| I want to change | Edit this |
|---|---|
| Company or trading name | `brand.companyName`, `brand.shortName`, `brand.wordmark` |
| The practitioner behind it | `person.name`, `person.fullName`, `person.role` |
| The domain | `site.url` (no trailing slash) |
| Primary email | `contact.primaryEmail` |
| A personal Gmail to show | `contact.gmail` (set to `null` to hide it) |
| Link previews | `seo.title`, `seo.description`, `seo.ogDescription` |
| Search keywords | `seo.keywords` |
| GitHub / ORCID / LinkedIn | `social.*` |
| Footer legal line | `legal.entityName`, `legal.year`, `legal.disclaimer` |
| Scheduling link | `contact.schedulingUrl` (falls back to copy when `null`) |

### Before you launch

`npm run check:config` lists the open blockers. One is currently open:

- `seo.googleVerification` is empty. Search Console will not accept a
  `vercel.app` hostname for file verification, so this needs a domain-based
  token, a DNS TXT record, or an HTML tag served from the site. See
  [Google Search Console ownership verification](https://support.google.com/webmasters/answer/9008080).

Two more are not machine-detectable but matter:

- Confirm the ORCID iD is production, public, and actually lists the works.
- Replace each publication `summary` in `src/content/publications.ts` with
  the exact published title, and set `doi` and `url`.

### The domain is `vercel.app`

`site.url` is set to the Vercel project hostname, `https://axiom-nexora.vercel.app`.
There is no custom domain. That is a deliberate choice, not a leftover, and
it has two consequences worth knowing:

- `vercel.app` hostnames are not indexable at their apex by default. Search
  engines can and do crawl them, but there is no domain authority to build,
  so organic ranking will stay near zero for as long as you stay on it.
- Search Console cannot verify a `vercel.app` hostname using an HTML file or
  a meta tag, because the platform serves a shared header that blocks it. Use
  DNS verification, which does not work without a domain you control.

If you attach a custom domain later, change `site.url` to it and leave
`canonicalOverride` null, then rebuild. `canonicalOverride` exists only for
the case where you want the two hostnames to disagree deliberately, which you
do not.

---

## Project structure

```
site/
├── site.config.ts              THE variables file. Read this first.
├── eslint.config.mjs
├── next.config.ts              Security headers, image formats, caching
├── tsconfig.json               "@config" and "@/*" path aliases
├── scripts/
│   └── check-config.mjs        Validates the config, prints blockers
├── public/
│   └── favicon.svg             Orange square, paper cross
└── src/
    ├── app/
    │   ├── layout.tsx          Fonts, metadata, JSON-LD, Nav, Footer
    │   ├── page.tsx            Section composition, forced static
    │   ├── globals.css         Design tokens, reset, shared primitives
    │   ├── opengraph-image.tsx 1200x630 card, generated from the config
    │   ├── icon.tsx            32x32 browser-tab icon, generated
    │   ├── apple-icon.tsx      180x180 touch icon, generated
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── manifest.ts
    │   ├── not-found.tsx       Branded 404
    │   └── components/
    │       ├── FlockCanvas.tsx   Boids canvas: lifecycle and rendering
    │       └── *.module.css      One .tsx + one .module.css per section
    ├── content/                All site copy as typed data
    │   ├── hero.ts
    │   ├── services.ts
    │   ├── work.ts
    │   ├── publications.ts
    │   ├── pricing.ts
    │   ├── process.ts          Process steps and FAQ
    │   ├── contact.ts          Contact copy and footer links
    │   └── navigation.ts       Nav links and ticker
    └── lib/
        ├── seo.ts              JSON-LD graph, built from config + content
        ├── og-fonts.ts         Font loading for the OG card
        ├── boids.ts            Flocking simulation, pure logic, no DOM
        └── utils.ts
```

**Why copy lives in `src/content/`.** Components render; content declares.
Editing the wording of a service or a price never means opening a `.tsx`
file, and there is exactly one place to check that a price is consistent
between the pricing table and the structured data.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server on `localhost:3000` |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run check:config` | Validate `site.config.ts`, pricing rows, and page anchors, list open blockers |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run verify` | All four, in order. Use before every deploy. |

`check:config` is not only a config lint. It also fails the build if a pricing
row is renamed without updating the structured data, if two rows share an id,
if a row has no dollar figure, or if a nav, footer, or service link points at
an anchor that no section renders. That last one is the common failure after a
section is removed, and it is silent in the browser: the link simply scrolls
nowhere.

---

## SEO

Everything is static and prerendered, so there is no runtime cost.

- **Metadata** is built in `src/app/layout.tsx` from `site.config.ts`:
  title template, description, keywords, canonical, robots, Open Graph,
  Twitter card, verification tokens.
- **JSON-LD** in `src/lib/seo.ts` is a single connected `@graph`:
  `ProfessionalService`, `Person`, `WebSite`, `FAQPage`, `ItemList`, and one
  `ScholarlyArticle` per paper. Prices are read from `src/content/pricing.ts`,
  so structured data can never disagree with the visible page. All six
  engagements are published as `makesOffer` entries. Rows written as a floor
  (`$1,500+` or `from $5,000`) use `PriceSpecificationMinimumPrice` and omit a
  flat `price`; rows with a single total publish a flat `price` instead.
- **`sitemap.ts` and `robots.ts`** derive from `site.url`.
- **The Open Graph card is generated at build time** from the config, so it
  cannot drift out of sync with the brand name, domain, or email. Change the
  config, rebuild, and the card follows.
- **Semantic HTML**: one `h1`, an `h2` per section, `scope` on all table
  headers, `aria-expanded` on the accordion, `rel="noopener"` on all 30
  external links, a skip link, and a visible "(opens in a new tab)" for
  screen readers.

### After launch

1. Submit `sitemap.xml` in Google Search Console.
2. Add the Search Console token to `seo.googleVerification`, then rebuild.
3. Validate the structured data at [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
4. Run [PageSpeed Insights](https://pagespeed.web.dev/) against the live URL.

---

## Performance

| Metric | Result |
|---|---|
| HTML (brotli) | ~15 KB |
| CSS (gzip) | ~9 KB |
| Own client JS (gzip) | ~7 KB |
| Flocking simulation | 0.2 ms per frame at 190 boids, ~2 KB gzipped |
| Framework baseline | ~103 KB (React 19 + Next.js 15, fixed cost) |
| Rendering | Fully static, `dynamic = 'error'` |

The site's own JavaScript is roughly 7KB gzipped, all of it from the six
client components listed above. The larger figure Next reports as "First
Load JS" is almost entirely the React 19 and Next.js framework runtime, which
is fixed and not reducible without abandoning the App Router.

How the speed is achieved:

- Server Components by default. Only six components ship JavaScript:
  `Nav`, `Hero` (stat count-up), `Pricing` (row flash), `FAQ`, the shared
  `ScrollReveal` observer, and `FlockCanvas`. Everything else, including
  Services, Work, Publications, Process, Contact, and the footer, is static
  markup.
- No animation library, no icon library, no UI kit, no third-party scripts.
  The background flock is hand-written rather than pulled from a library, so
  it costs about 2 KB gzipped.
- `next/font` with a variable Archivo, Latin subsets, `display: swap`, and
  preloading, which is what keeps CLS at zero.
- Scroll reveals are progressive enhancement. The hidden start state is
  gated behind an `html.js` class set by an inline bootstrap script, so a
  visitor without JavaScript sees the full page rather than a blank one.
- The stat numerals render their real values in the HTML. The count-up only
  overwrites them in the browser.
- Security headers and immutable caching are set in `next.config.ts`.

### The background flock

`src/lib/boids.ts` is a Reynolds flocking simulation. Every boid steers
using three local rules, computed only from its immediate neighbours:

| Rule | Behaviour |
|---|---|
| Separation | Push away from crowding neighbours, weighted by inverse distance |
| Alignment | Match the average heading of the neighbours |
| Cohesion | Drift toward the local centre of mass |

Tune `createFlockParams` in that file. Current weights are separation 1.6,
alignment 1.35, cohesion 1.25, which favours tight synchronised flocks over
loose scattering. Perception and separation radii scale with the smaller
viewport dimension, so the flock reads the same on a phone and on a wide
desktop. Speed runs from 55 to 140 px/s with a 420 px/s steering ceiling.

Initial positions and headings come from `Math.random`, so no two visits
produce the same flight. Space is treated as a torus and boids wrap across
the edges, which keeps the flock evenly spread instead of piling against a
boundary. The simulation is chaotic, so it keeps evolving for as long as the
tab is open.

### The flock follows the cursor

A fourth, deliberately weaker rule pulls the flock toward the pointer:

- `pointerWeight` is 0.55, well under the 1.6 separation weight, so the
  flock leans toward the cursor and never collapses onto it. Measured over
  900 steps, the flock sits about 15% closer to the cursor than an
  uncontrolled one, and no two boids ever share a position.
- `pointerRadius` scales with the viewport, roughly 280 to 540px, so the
  effect is felt across a large area without being global.
- Influence falls off linearly from 1 at the cursor to 0 at the radius. The
  same falloff drives three things at once, which is what sells the depth:
  boids near the cursor steer harder toward it, are allowed to overspeed past
  the 140 px/s ceiling, and are drawn up to 1.75x larger.
- The overspeed is the important one. Boids accelerate as they close on the
  pointer and ease off once they pass it, which reads as flying toward the
  viewer rather than toward a dot.
- Only mouse and pen engage it. A touch drag is a scroll, and steering the
  flock around mid-read would be hostile. The pull is also released when the
  pointer leaves the window.

### Keeping the flock off the cards

The canvas is `position: fixed` at `z-index: -1`, so it paints above the page
background but below all in-flow content. That alone is not enough, because
most cards in this design are transparent, defined only by hairlines and
rules. A transparent card does not occlude anything, so the flock showed
straight through the services and work areas.

The fix is the `--surface-card` token in `globals.css`, which resolves to
`var(--paper)`. It is visually a no-op, since the page background is
`--paper` too, but it makes those surfaces opaque so they occlude the canvas.
It is applied to the services grid, the work list, the process steps, and the
FAQ list.

**Any new card, table, or panel you add must set `background: var(--surface-card)`**,
or the flock will show through it. The hero is the deliberate exception: it
stays transparent, because it is the one place the flock should be seen.

Other guards:

- `pointer-events: none` and `user-select: none` mean it cannot be clicked,
  tapped, or text-selected, and it never intercepts focus.
- Opacity is 0.5 on desktop and 0.42 on mobile, so it reads as texture rather
  than competing with the copy. Raise `--flock-opacity` in
  `components/FlockCanvas.module.css` to make it bolder.
- Colour is read from the `--signal` token via `getComputedStyle`, so the
  accent stays defined in one place.

The flock runs 150 boids on a laptop viewport, capped at 190, and scaled down
by `navigator.hardwareConcurrency` so a low-power phone does not pay for a
desktop-sized flock. It costs 0.2 ms per frame. The loop pauses when the tab
is hidden. Under `prefers-reduced-motion` it paints a single static frame
instead of animating.

Analytics were deliberately left out. The design doc calls for no
third-party scripts at launch. If you add Vercel Analytics or Plausible
later, do it after launch so it does not affect the baseline scores.

---

## Accessibility

- Every colour pairing meets WCAG AA, with headlines and body copy at AAA.
  Orange on paper is restricted to large display type and graphics only.
- `prefers-reduced-motion` disables the marquee, the reveals, the count-ups,
  the background flock, and all transitions. Content renders in its final
  state, and the flock becomes a single still frame rather than disappearing.
- The flock canvas is `aria-hidden` and fully non-interactive, so assistive
  technology never encounters it.
- Touch targets are at least 44px, and inversion hovers are replaced with
  pressed states on coarse pointers.
- The mobile menu traps focus, closes on Escape, and restores focus to the
  button that opened it.
- Nav height collapses on scroll, and `scroll-padding-top` keeps anchor
  targets clear of the fixed header.

---

## Deploying to Vercel

1. Push this folder to a GitHub repository. The repo root must be this
   folder, the one holding `package.json`. Pushing the parent directory
   leaves Vercel unable to find a build.
2. Import the repo in Vercel. The framework is detected automatically, so
   leave the build command and output directory alone.
3. The project deploys to `https://axiom-nexora.vercel.app`. No custom
   domain is attached and none is needed to get started.

If you attach a custom domain later, add it in Project Settings, then add
the DNS records Vercel gives you at your registrar, and change `site.url`
in `site.config.ts` to match before you rebuild. HTTPS is issued
automatically.

If you ever do add mail DNS records, do not touch MX, SPF, DKIM, or DMARC
without checking what is already there. Those records belong to the mail
provider, and overwriting them silently breaks sending. The website itself
only needs CNAME and A records, which do not collide with mail.

Before the first deploy, run `npm run verify` and resolve every blocker
that `check:config` reports.
