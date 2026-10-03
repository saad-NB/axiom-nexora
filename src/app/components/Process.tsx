import { processSection, processSteps } from '@/content/process';
import { SectionHead } from './SectionHead';
import styles from './Process.module.css';

export function Process() {
  return (
    <section id="process" className="section" aria-labelledby="process-heading">
      <div className="container">
        <SectionHead
          index={processSection.index}
          eyebrow={processSection.eyebrow}
          heading={processSection.heading}
          headingId="process-heading"
        />

        <ol className={styles.steps}>
          {processSteps.map((step, index) => (
            <li
              className={styles.step}
              key={step.index}
              data-reveal
              style={{ '--i': index } as React.CSSProperties}
            >
              <p className={styles.step__index}>{step.index}</p>
              <span className={styles.step__rule} aria-hidden="true" />
              <h3 className={styles.step__title}>{step.title}</h3>
              <p className={styles.step__body}>{step.body}</p>
            </li>
          ))}
        </ol>

        <p className={styles.callout}>{processSection.callout}</p>
      </div>
    </section>
  );
}
