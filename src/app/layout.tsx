import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { brand, canonicalUrl, contact, seo, social } from '@config';
import { structuredDataJson } from '@/lib/seo';

import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { FlockCanvas } from './components/FlockCanvas';
import { ScrollReveal } from './components/ScrollReveal';
import './globals.css';

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */

/**
 * Archivo is a variable font, so one file covers every weight the site
 * uses. IBM Plex Mono ships static weights and is limited to the three
 * the design system actually calls for. Both are subset to Latin, use
 * display: swap, and are preloaded automatically by next/font.
 */
const archivo = Archivo({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-plex-mono',
  display: 'swap',
  fallback: ['SF Mono', 'Menlo', 'Consolas', 'monospace'],
  preload: true,
});

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),

  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },

  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: brand.companyName,
  generator: 'Next.js',
  category: 'technology',

  authors: [{ name: brand.companyName, url: social.github }],
  creator: brand.companyName,
  publisher: brand.companyName,

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',
    siteName: brand.companyName,
    locale: 'en_US',
    url: canonicalUrl,
    title: seo.title,
    description: seo.ogDescription,
    emails: [contact.primaryEmail],
  },

  twitter: {
    card: seo.twitterCard,
    title: seo.title,
    description: seo.ogDescription,
    ...(seo.twitterHandle ? { site: seo.twitterHandle, creator: seo.twitterHandle } : {}),
  },

  // Declaring `icons` here replaces the file-convention ones, so apple-icon
  // has to be listed explicitly or iOS loses its home-screen icon.
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon', type: 'image/png' }],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },

  manifest: '/manifest.webmanifest',

  ...(seo.googleVerification
    ? { verification: { google: seo.googleVerification } }
    : {}),
  ...(seo.bingVerification
    ? { verification: { other: { 'msvalidate.01': seo.bingVerification } } }
    : {}),
};

/**
 * Separate from metadata so Next can emit the correct viewport meta tags
 * without the user-scalable and maximum-scale restrictions that break
 * accessibility for people who need to zoom.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F3EF' },
    { media: '(prefers-color-scheme: dark)', color: '#141412' },
  ],
  colorScheme: 'light',
};

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

/**
 * Sets a class on <html> before the body paints. CSS only hides elements
 * that are waiting to be revealed when `.js` is present, so a visitor
 * without JavaScript sees all of the content instead of a blank page.
 */
const bootstrapScript = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        />
      </head>
      <body id="top">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <FlockCanvas />

        <Nav />

        <main id="main">{children}</main>

        <Footer />

        <ScrollReveal />
      </body>
    </html>
  );
}
