import { brand, displayEmail, legal, mailtoHref } from '@config';
import { footer } from '@/content/contact';
import { ArrowUpRight, LogoMark } from './Icons';
import styles from './Footer.module.css';

export function Footer() {
  const year = legal.year;

  return (
    <footer className={`site-footer ${styles.footer}`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <p className={styles.wordmark}>
              <LogoMark size={24} />
              {brand.wordmark}
            </p>
            <p className={styles.tagline}>{brand.tagline}</p>
            <a href={mailtoHref} className={styles.email}>
              {displayEmail}
            </a>
            {legal.disclaimer ? <p className={styles.disclaimer}>{legal.disclaimer}</p> : null}
          </div>

          {footer.columns.map((column, index) => (
            <nav
              className={`${styles.col} ${index === footer.columns.length - 1 ? styles['col--last'] : ''}`}
              key={column.heading}
              aria-label={column.heading}
            >
              <h2 className={styles.colHeading}>{column.heading}</h2>
              <ul className={styles.colList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={styles.colLink}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                      {link.external ? (
                        <>
                          <ArrowUpRight size={12} />
                          <span className="sr-only">(opens in a new tab)</span>
                        </>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.baseline}>
          <p>
            &copy; {year} {legal.entityName}. All rights reserved.
          </p>
          <a href="#top" className={styles.toTop}>
            {footer.backToTop}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
