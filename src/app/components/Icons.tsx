/**
 * Icon set. Inline SVG only, no icon library.
 * 24px grid, 1.5px stroke, square caps and miters, flat and geometric.
 * See DESIGN.md section 3.6.
 */

export interface IconProps {
  size?: number;
  className?: string;
  /** Provide only when the icon carries meaning. Otherwise it is hidden. */
  title?: string;
}

function Svg({
  size = 24,
  className,
  title,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      {...(title ? { role: 'img' } : { 'aria-hidden': true, focusable: false })}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17L17 7" />
      <path d="M8.5 7H17v8.5" />
    </Svg>
  );
}

/**
 * Two independent bars. The accordion rotates the second one to make
 * a plus into a minus, so do not merge these into a single path.
 */
export function Plus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h16" />
      <path className="plus-vertical" d="M12 6v12" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 8h18" />
      <path d="M3 16h18" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 5h18v14H3z" />
      <path d="M3 6l9 7 9-7" />
    </Svg>
  );
}

/* ---- Service glyphs ---- */

export function GlyphBrowser(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 4h18v16H3z" />
      <path d="M3 9h18" />
      <path d="M6 6.5h1" strokeWidth={2} />
      <path d="M9 6.5h1" strokeWidth={2} />
    </Svg>
  );
}

export function GlyphLayers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 12.5l9 5 9-5" />
      <path d="M3 16.5l9 5 9-5" />
    </Svg>
  );
}

export function GlyphChart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 3v18h17" />
      <path d="M7.5 15.5l4-5 3 3 4.5-6" />
    </Svg>
  );
}

export function GlyphNodes(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 7h10v10H7z" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="7" r="2.5" />
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </Svg>
  );
}

/** A small network: a hub feeding three branches. Used for the AI and ML
 *  service, which is about a model at the centre of connected parts. */
export function GlyphNetwork(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="6" r="3" />
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M12 9v3M12 12H5v2M12 12h7v2" />
    </Svg>
  );
}

export function LogoMark({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" fill="var(--signal)" />
      <path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" fill="var(--paper)" />
    </svg>
  );
}
