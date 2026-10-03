import type { Metadata } from 'next';
import Link from 'next/link';
import { brand, displayEmail, mailtoHref } from '@config';
import { ArrowRight } from './components/Icons';
import styles from './NotFound.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className={styles.wrap} aria-labelledby="notfound-heading">
      <div className="container">
        <p className="eyebrow">ERROR 404 / NOT FOUND</p>

        <h1 id="notfound-heading" className={styles.title}>
          This page does not exist.
          <span className={styles.period}>.</span>
        </h1>

        <p className={`lead ${styles.body}`}>
          The address may have changed, or the link that brought you here was mistyped. The work,
          pricing, and contact details are all on the home page.
        </p>

        <div className={styles.actions}>
          <Link href="/" className="btn btn--primary">
            Back to home
            <ArrowRight size={16} className="btn__arrow" />
          </Link>
          <a href={mailtoHref} className="btn btn--secondary">
            Email {displayEmail}
          </a>
        </div>

        <p className={`footnote ${styles.footnote}`}>{brand.tagline}</p>
      </div>
    </section>
  );
}
