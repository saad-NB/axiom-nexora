import { displayEmail, mailtoHref, social } from '@config';
import { contactSection } from '@/content/contact';
import { ArrowUpRight, MailIcon } from './Icons';
import styles from './Contact.module.css';

const elsewhere = [
  { label: 'GitHub', href: social.github },
  { label: 'ORCID', href: social.orcid },
  { label: 'LinkedIn', href: social.linkedin },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="section section--signal section--band"
      aria-labelledby="contact-heading"
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h2 id="contact-heading" className={styles.title}>
            {contactSection.heading}
          </h2>
          <p className={styles.body}>{contactSection.body}</p>

          <div className={styles.links}>
            {elsewhere.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
                <ArrowUpRight size={13} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.plate}>
          <a href={mailtoHref} className={styles.plateBox}>
            <span className={styles.plateHead}>
              <span className={styles.plateLabel}>{contactSection.plateLabel}</span>
              <MailIcon size={18} className={styles.plateIcon} />
            </span>
            <span className={styles.plateAddress}>{displayEmail}</span>
            <span className={styles.plateNote}>{contactSection.plateNote}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
