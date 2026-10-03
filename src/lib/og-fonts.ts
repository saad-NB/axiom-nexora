/**
 * og-fonts.ts
 * ------------------------------------------------------------------
 * Loads real web fonts for the generated Open Graph card so it matches
 * the site's typography instead of falling back to a generic sans.
 *
 * Two things make this work:
 *
 * 1. Satori (the renderer behind next/og) cannot parse woff2. It throws
 *    "Unsupported OpenType signature wOF2". Requesting the stylesheet with
 *    an ancient user agent makes Google Fonts serve the TTF build instead.
 *    That string is deliberately old.
 * 2. The legacy endpoint returns extensionless URLs (fonts.gstatic.com/l/font?kit=),
 *    so the URL is matched on the host rather than a file extension.
 *
 * The fetch happens at build time and every failure path returns null, so an
 * unreachable network degrades the card to the default font instead of
 * failing the deploy.
 * ------------------------------------------------------------------
 */

/**
 * Satori (the renderer behind next/og) cannot parse woff2. It throws
 * "Unsupported OpenType signature wOF2". Google Fonts decides which
 * format to serve from the user agent, so this non-browser identifier
 * gets the TTF build, which Satori accepts. Do not "upgrade" this to a
 * browser string: a modern UA brings back woff2 and breaks the build.
 */
const TTF_UA = 'AxiomNexora-OG-Image/1.0';

/** ImageResponse only accepts these discrete weights. */
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: 'normal';
}

function extractFontUrl(css: string): string | null {
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
  return match?.[1] ?? null;
}

/** Confirms the payload is a format Satori can actually parse. */
function isSupportedFormat(data: ArrayBuffer): boolean {
  if (data.byteLength < 4) return false;

  const magic = new DataView(data).getUint32(0, false);

  return (
    magic === 0x4f54544f || // 'OTTO', CFF flavoured OpenType
    magic === 0x74746366 || // 'ttcf', TrueType collection
    magic === 0x74727565 || // 'true', Apple flavoured TrueType
    magic === 0x00010000 // TrueType version tag
  );
}

async function loadFont(
  family: string,
  cssQuery: string,
  weight: FontWeight,
): Promise<OgFont | null> {
  try {
    const cssResponse = await fetch(
      `https://fonts.googleapis.com/css2?family=${cssQuery}&display=swap`,
      { headers: { 'User-Agent': TTF_UA } },
    );
    if (!cssResponse.ok) return null;

    const href = extractFontUrl(await cssResponse.text());
    if (!href) return null;

    const fontResponse = await fetch(href);
    if (!fontResponse.ok) return null;

    const data = await fontResponse.arrayBuffer();
    if (!isSupportedFormat(data)) return null;

    return { name: family, data, weight, style: 'normal' };
  } catch {
    return null;
  }
}

/**
 * Resolves to the fonts to hand to ImageResponse, or an empty list when
 * they could not be fetched.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [archivo, plexMono] = await Promise.all([
    loadFont('Archivo', 'Archivo:wght@800', 800),
    loadFont('IBM Plex Mono', 'IBM+Plex+Mono:wght@400', 400),
  ]);

  return [archivo, plexMono].filter((font): font is OgFont => font !== null);
}
