import type { MetadataRoute } from 'next';
import { brand } from '@config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.companyName}. ${brand.tagline}`,
    short_name: brand.shortName,
    description: brand.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F3EF',
    theme_color: '#F4F3EF',
    // Android only reads PNG from the manifest, never the SVG, so the SVG
    // alone leaves the installed app without an icon. The mark is a full-bleed
    // square, which is also safe when Android crops it into a maskable shape.
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
