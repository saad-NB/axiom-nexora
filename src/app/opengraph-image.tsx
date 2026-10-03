import { ImageResponse } from 'next/og';
import { brand, displayEmail, seo, social } from '@config';
import { hero } from '@/content/hero';
import { loadOgFonts } from '@/lib/og-fonts';

export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph card, generated at build time from site.config.ts.
 *
 * Generating it means the card can never drift out of sync with the brand
 * name, domain, or email: change the config and rebuild, and the image
 * follows. The design follows DESIGN.md section 12.2: paper field, faint
 * column rules, ink headline with orange periods, ink footer strip.
 */
export default async function OpengraphImage() {
  const github = social.github.replace('https://', '');
  const orcid = social.orcid.replace('https://', '');
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F4F3EF',
          color: '#141412',
          fontFamily: 'Archivo, sans-serif',
          position: 'relative',
        }}
      >
        {/* Faint column rules */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 96,
            display: 'flex',
          }}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                borderLeft: '1px solid rgba(20,20,18,0.05)',
                borderRight: '1px solid rgba(20,20,18,0.05)',
              }}
            />
          ))}
        </div>

        {/* Orange cross watermark */}
        <div
          style={{
            position: 'absolute',
            top: -70,
            right: -70,
            width: 300,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,77,0,0.10)',
            fontSize: 300,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          +
        </div>

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '64px 72px 0' }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: '#FF4D00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F4F3EF',
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
              marginRight: 16,
            }}
          >
            +
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '0.02em',
              display: 'flex',
            }}
          >
            {brand.wordmark}
          </div>
        </div>

        {/* Headline, taken from the same source as the page hero so the
            card and the site can never disagree. */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 72px' }}>
          {hero.headingLines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: 78,
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.02,
                display: 'flex',
              }}
            >
              {line.slice(0, -1)}
              <span style={{ color: '#FF4D00' }}>{line.slice(-1)}</span>
            </div>
          ))}

          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: '#3A3A36',
              display: 'flex',
              maxWidth: 900,
            }}
          >
            Website design · Full-stack applications · Medical research data analysis
          </div>
        </div>

        {/* Ink footer strip */}
        <div
          style={{
            height: 96,
            background: '#141412',
            color: '#F4F3EF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 72px',
            fontSize: 20,
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.04em',
          }}
        >
          <span style={{ display: 'flex' }}>{displayEmail.toUpperCase()}</span>
          <span style={{ display: 'flex', color: '#A8A79E' }}>
            {github} · {orcid}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
