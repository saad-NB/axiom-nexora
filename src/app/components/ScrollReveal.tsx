'use client';

import { useEffect } from 'react';

/**
 * One shared IntersectionObserver for the whole page.
 *
 * Renders nothing. Every element carrying a `data-reveal` attribute is
 * picked up automatically, so server components can opt into the reveal
 * without becoming client components themselves.
 *
 * The hidden start state lives behind the `html.js` class, which is set by
 * an inline bootstrap script. If this component never runs, the content
 * is simply visible.
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      for (const el of targets) el.setAttribute('data-reveal', 'in');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).setAttribute('data-reveal', 'in');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    for (const el of targets) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return null;
}
