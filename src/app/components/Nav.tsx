'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { brand } from '@config';
import { navigation } from '@/content/navigation';
import { ArrowRight, CloseIcon, LogoMark, MenuIcon } from './Icons';
import { cn } from '@/lib/utils';
import styles from './Nav.module.css';

/** Section ids that the nav links point at, used for active-link tracking. */
const SECTION_IDS = navigation.links.map((link) => link.href.replace('#', ''));

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ---- Scroll elevation ---- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---- Active section tracking ---- */
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* ---- Menu: escape to close, scroll lock, focus management ---- */
  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      /* Keep focus inside the overlay while it is open. */
      const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const wordmark = (
    <>
      <LogoMark size={24} />
      <span className={styles.nav__wordmark}>{brand.wordmark}</span>
    </>
  );

  return (
    <header className={styles.nav} data-scrolled={scrolled}>
      <div className={`container ${styles.nav__inner}`}>
        <a href="#top" className={styles.nav__brand} aria-label={`${brand.companyName}, home`}>
          {wordmark}
        </a>

        <nav aria-label="Primary">
          <ul className={styles.nav__links}>
            {navigation.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.nav__link}
                  data-active={active === link.href.replace('#', '')}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={navigation.cta.href} className="btn btn--primary btn--compact">
          {navigation.cta.label}
          <ArrowRight size={16} className="btn__arrow" />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className={styles.nav__toggle}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? navigation.menuCloseLabel : navigation.menuOpenLabel}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {open ? (
        <div
          ref={overlayRef}
          id="mobile-menu"
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className={styles.overlay__top}>
            <span className={styles.overlay__brand}>
              <LogoMark size={24} />
              <span className={styles.overlay__wordmark}>{brand.wordmark}</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className={styles.overlay__close}
              aria-label={navigation.menuCloseLabel}
              onClick={close}
            >
              <CloseIcon size={24} />
            </button>
          </div>

          <nav aria-label="Mobile">
            <ul className={styles.overlay__links}>
              {navigation.links.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.overlay__link}
                    style={{ '--i': index } as React.CSSProperties}
                    onClick={close}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={navigation.cta.href}
            className={cn('btn', styles.overlay__cta)}
            onClick={close}
          >
            {navigation.cta.label}
            <ArrowRight size={16} className="btn__arrow" />
          </a>

          <p className={styles.overlay__meta}>{brand.tagline}</p>
        </div>
      ) : null}
    </header>
  );
}
