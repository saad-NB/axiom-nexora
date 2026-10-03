'use client';

import { useId, useState } from 'react';
import { faq, faqSection } from '@/content/process';
import { SectionHead } from './SectionHead';
import { Plus } from './Icons';
import styles from './FAQ.module.css';

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="section" aria-labelledby="faq-heading">
      <div className="container">
        <SectionHead
          index={faqSection.index}
          eyebrow={faqSection.eyebrow}
          heading={faqSection.heading}
          headingId="faq-heading"
        />

        <div className={styles.list}>
          {faq.map((item) => {
            const isOpen = openId === item.id;
            const triggerId = `${baseId}-${item.id}-trigger`;
            const panelId = `${baseId}-${item.id}-panel`;

            return (
              <div className={styles.item} key={item.id} data-reveal>
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    {item.question}
                    <Plus size={20} className={styles.icon} />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={styles.panel}
                  data-open={isOpen}
                  /* Keeps the collapsed text out of the tab order and
                     out of the accessibility tree without unmounting it. */
                  {...(!isOpen ? { inert: true } : {})}
                >
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
