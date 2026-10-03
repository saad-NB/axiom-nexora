import { contact, displayEmail, mailtoHref, social } from '@config';

export const contactSection = {
  heading: 'Start a project.',
  body: `Email us directly. Genuine inquiries receive a reply within ${contact.responseTime}. Include what you are trying to accomplish, any constraints, and your rough timeline.`,
  plateLabel: 'EMAIL',
  plateNote:
    contact.schedulingUrl ??
    contact.schedulingFallback,
  plateLinkLabel: `Email ${displayEmail}`,
};

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}

export const footer = {
  columns: [
    {
      heading: 'Navigate',
      links: [
        { label: 'Services', href: '#services' },
        { label: 'Work', href: '#work' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Process', href: '#process' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    {
      heading: 'Elsewhere',
      links: [
        { label: 'GitHub', href: social.github, external: true },
        { label: 'ORCID', href: social.orcid, external: true },
        { label: 'LinkedIn', href: social.linkedin, external: true },
        { label: 'Email', href: mailtoHref },
      ],
    },
  ] as FooterColumn[],
  backToTop: 'Back to top',
};
