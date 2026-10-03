import { services, servicesSection, type ServiceGlyph } from '@/content/services';
import { SectionHead } from './SectionHead';
import {
  ArrowRight,
  GlyphBrowser,
  GlyphChart,
  GlyphLayers,
  GlyphNetwork,
  GlyphNodes,
} from './Icons';
import styles from './Services.module.css';

const GLYPHS: Record<ServiceGlyph, typeof GlyphBrowser> = {
  browser: GlyphBrowser,
  layers: GlyphLayers,
  chart: GlyphChart,
  nodes: GlyphNodes,
  network: GlyphNetwork,
};

export function Services() {
  return (
    <section id="services" className="section section--strong" aria-labelledby="services-heading">
      <div className="container">
        <SectionHead
          index={servicesSection.index}
          eyebrow={servicesSection.eyebrow}
          heading={servicesSection.heading}
          lead={servicesSection.lead}
          headingId="services-heading"
        />

        <div className={styles.grid}>
          {services.map((service, index) => {
            const Glyph = GLYPHS[service.glyph];
            return (
              <article
                className={service.wide ? `${styles.cell} ${styles.cell__wide}` : styles.cell}
                key={service.title}
                data-reveal
                style={{ '--i': index } as React.CSSProperties}
              >
                <div className={styles.cell__top}>
                  <span className={styles.cell__index}>{service.index}</span>
                  <Glyph size={24} className={styles.cell__glyph} />
                </div>

                <h3 className={styles.cell__title}>{service.title}</h3>
                <p className={styles.cell__body}>{service.body}</p>

                <ul className="bullets">
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <a href={service.link.href} className={`textlink ${styles.cell__link}`}>
                  {service.link.label}
                  <ArrowRight size={14} className="btn__arrow" />
                </a>
              </article>
            );
          })}
        </div>

        <p className={`footnote ${styles.footnote}`}>{servicesSection.footnote}</p>
      </div>
    </section>
  );
}
