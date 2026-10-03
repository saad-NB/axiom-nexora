'use client';

import { useEffect, useRef } from 'react';
import { hero, heroStats, profilePlate } from '@/content/hero';
import { ArrowRight } from './Icons';
import styles from './Hero.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Counts each statistic up from zero on load.
 *
 * The final value is rendered in the HTML, so it is correct for search
 * engines and for visitors without JavaScript. The animation only ever
 * overwrites the text content, and `tabular-nums` plus a reserved min
 * height keep the layout from shifting.
 */
function useCountUp() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-count-to]'));
    if (nodes.length === 0) return;

    const reduceMotion = window.matchMedia(REDUCED_MOTION).matches;
    if (reduceMotion) return;

    const duration = 1200;
    const start = performance.now();

    let frame = 0;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOut(progress);

      for (const node of nodes) {
        const target = Number(node.dataset.countTo ?? '0');
        const format = node.dataset.countFormat ?? 'plain';
        const current = Math.round(target * eased);
        node.textContent =
          format === 'comma' ? current.toLocaleString('en-US') : String(current).padStart(2, '0');
      }

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return rootRef;
}

export function Hero() {
  const statsRef = useCountUp();

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.hero__rules} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <svg
        className={styles.hero__watermark}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M13 2h6v11h11v6H19v11h-6V19H2v-6h11z" fill="currentColor" />
      </svg>

      <div className="container">
        <div className={styles.hero__top}>
          <div className={styles.hero__main}>
            <p className="eyebrow">{hero.eyebrow}</p>

            <h1 id="hero-heading" className={styles.hero__title}>
              {hero.headingLines.map((line, index) => (
                <span className={styles.hero__mask} key={line}>
                  <span className={styles.hero__line}>
                    {line.slice(0, -1)}
                    <span className={styles.hero__period}>{line.slice(-1)}</span>
                    {index === hero.headingLines.length - 1 ? null : <br />}
                  </span>
                </span>
              ))}
            </h1>

            <p className={styles.hero__lead}>{hero.lead}</p>

            <div className={styles.hero__ctas}>
              <a href={hero.primaryCta.href} className="btn btn--primary">
                {hero.primaryCta.label}
                <ArrowRight size={16} className="btn__arrow" />
              </a>
              <a href={hero.secondaryCta.href} className="btn btn--secondary">
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>

          <div className={styles.hero__aside}>
            <div className={styles.plate}>
              <p className={styles.plate__header}>{profilePlate.header}</p>

              <dl>
                {profilePlate.rows.map((row) => (
                  <div className={styles.plate__row} key={row.label}>
                    <dt className={styles.plate__label}>{row.label}</dt>
                    <dd className={styles.plate__value}>{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className={styles.plate__status}>
                <span className={styles.plate__dot} aria-hidden="true" />
                {profilePlate.status}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.stats} ref={statsRef}>
          {heroStats.map((stat) => (
            <div className={styles.stats__cell} key={stat.label}>
              <p
                className={styles.stats__value}
                data-count-to={stat.value}
                data-count-format={stat.value >= 1000 ? 'comma' : 'plain'}
              >
                {stat.display}
              </p>
              <p className={styles.stats__label}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
