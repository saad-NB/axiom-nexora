import type { MetadataRoute } from 'next';
import { canonicalUrl } from '@config';

/**
 * The site is a single page, so the sitemap has exactly one entry.
 * lastModified is derived from the build time, which is accurate for a
 * statically generated site and keeps crawlers from re-fetching blindly.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: canonicalUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
