import { ticker } from '@/content/navigation';
import { Plus } from './Icons';
import styles from './Ticker.module.css';

/**
 * Full-bleed ink band. Two identical copies in a flex track translate by
 * -50%, which makes the loop seamless. Pure CSS, no JavaScript, and it
 * stops entirely under prefers-reduced-motion. See DESIGN.md section 5.11.
 */
export function Ticker() {
  const content = (
    <>
      {ticker.items.map((item) => (
        <span className={styles.item} key={item}>
          {item}
        </span>
      ))}
      <span className={styles.sep} aria-hidden="true">
        <Plus size={14} />
      </span>
    </>
  );

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div
        className={styles.track}
        style={{ animationDuration: `${ticker.durationSeconds}s` }}
      >
        <div className={styles.group}>{content}</div>
        <div className={styles.group}>{content}</div>
      </div>

      <span className="sr-only">
        Areas of practice: {ticker.items.join(', ')}.
      </span>
    </div>
  );
}
