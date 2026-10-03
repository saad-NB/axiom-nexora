import { publicationLinks, publications } from '@/content/publications';
import { workSection } from '@/content/work';
import { ArrowUpRight } from './Icons';
import styles from './Publications.module.css';

export function Publications() {
  return (
    <div className={styles.block} data-reveal>
      <p className={styles.label}>{workSection.publicationsLabel}</p>

      <div className={styles.grid}>
        {publications.map((publication, index) => (
          <article
            className={styles.plate}
            key={publication.journal}
            data-reveal
            style={{ '--i': index } as React.CSSProperties}
          >
            <p className={styles.plate__head}>
              <span className={styles.plate__journal}>{publication.journal}</span>
              <span className={styles.plate__year}>{publication.year}</span>
            </p>

            <p className={styles.plate__summary}>{publication.summary}</p>

            <p className={styles.plate__role}>Role: {publication.role}</p>
          </article>
        ))}
      </div>

      <div className={styles.links}>
        <a
          href={publicationLinks.orcid}
          className="textlink"
          target="_blank"
          rel="noopener noreferrer"
        >
          Full record on ORCID
          <ArrowUpRight size={14} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a
          href={publicationLinks.github}
          className="textlink"
          target="_blank"
          rel="noopener noreferrer"
        >
          All repositories on GitHub
          <ArrowUpRight size={14} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
