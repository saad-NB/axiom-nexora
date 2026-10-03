import styles from './SectionHead.module.css';

interface SectionHeadProps {
  index: string;
  eyebrow: string;
  heading: string;
  lead?: string;
  headingId: string;
  /** Set when the section sits on an ink background. */
  tone?: 'paper' | 'ink';
}

/**
 * The masthead is the strongest Swiss signature on the page: the section
 * number and eyebrow sit in the left cell, the heading and lead in the right.
 * It repeats on every section. See DESIGN.md section 5.2.
 */
export function SectionHead({ index, eyebrow, heading, lead, headingId, tone }: SectionHeadProps) {
  return (
    <div
      className={`masthead ${styles.masthead}`}
      data-reveal
      {...(tone === 'ink' ? { 'data-tone': 'ink' } : {})}
    >
      <div className="masthead__aside">
        <p className="eyebrow">
          <span className={styles.index}>{index} /</span> {eyebrow}
        </p>
      </div>

      <div className="masthead__main">
        <h2 id={headingId} className="h2">
          {heading}
        </h2>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </div>
  );
}
