'use client';

import { useEffect } from 'react';
import { pricing, pricingSection } from '@/content/pricing';
import { SectionHead } from './SectionHead';
import styles from './Pricing.module.css';

const FLASH_MS = 400;

/**
 * When a service card links to a pricing row (for example
 * `#price-web`), the browser jumps straight there. This flashes the row
 * once so the visitor can see which row was targeted.
 * See DESIGN.md section 7.1, moment 5.
 */
function useRowFlash() {
  useEffect(() => {
    const flashClass = styles.flash;
    if (!flashClass) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const flash = () => {
      const id = window.location.hash.replace('#', '');
      if (!id || !id.startsWith('price-')) return;

      const row = document.getElementById(id);
      if (!row) return;

      row.classList.remove(flashClass);
      /* Force a reflow so the animation restarts on repeat visits. */
      void row.offsetWidth;
      row.classList.add(flashClass);

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => row.classList.remove(flashClass), FLASH_MS);
    };

    flash();
    window.addEventListener('hashchange', flash);

    return () => {
      window.removeEventListener('hashchange', flash);
      if (timer) clearTimeout(timer);
    };
  }, []);
}

export function Pricing() {
  useRowFlash();

  return (
    <section
      id="pricing"
      className="section section--ink section--band"
      aria-labelledby="pricing-heading"
    >
      <div className="container">
        <SectionHead
          index={pricingSection.index}
          eyebrow={pricingSection.eyebrow}
          heading={pricingSection.heading}
          lead={pricingSection.lead}
          headingId="pricing-heading"
          tone="ink"
        />

        <table className={styles.table}>
          <caption className="sr-only">
            Engagements, prices, coverage, and typical timelines
          </caption>
          <thead>
            <tr>
              {pricingSection.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pricing.map((row) => (
              <tr key={row.id} id={row.id}>
                <td className={styles.engagement} data-label="Engagement">
                  {row.engagement}
                </td>
                <td data-label="Price">
                  <span className={styles.price}>{row.price}</span>
                  {row.priceNote ? <span className={styles.note}>{row.priceNote}</span> : null}
                </td>
                <td className={styles.coverage} data-label="What it covers">
                  {row.coverage}
                </td>
                <td className={styles.timeline} data-label="Typical timeline">
                  {row.timeline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={`footnote ${styles.footnote}`}>{pricingSection.footnote}</p>
      </div>
    </section>
  );
}
