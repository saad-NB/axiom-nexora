import { work, workSection } from '@/content/work';
import { SectionHead } from './SectionHead';
import { ArrowUpRight } from './Icons';
import styles from './Work.module.css';

export function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-heading">
      <div className="container">
        <SectionHead
          index={workSection.index}
          eyebrow={workSection.eyebrow}
          heading={workSection.heading}
          lead={workSection.lead}
          headingId="work-heading"
        />

        <ul className={styles.list}>
          {work.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={styles.row}
                data-reveal
                style={{ '--i': index } as React.CSSProperties}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.row__index}>{item.index}</span>

                <span className={styles.row__body}>
                  <span className={styles.row__name}>
                    {item.name}
                    <ArrowUpRight size={16} className={styles.row__ext} />
                  </span>
                  <span className={styles.row__description}>{item.description}</span>
                </span>

                <span className={styles.row__tags}>{item.tags.join(' / ')}</span>

                <span className={styles.row__arrow} aria-hidden="true">
                  <ArrowUpRight size={20} />
                </span>

                <span className={styles.row__sr}>(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
