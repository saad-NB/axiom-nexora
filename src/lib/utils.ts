/** Joins class names, dropping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Builds a mailto link with a prefilled subject and optional body.
 * Encodes both so spaces and punctuation survive the mail client.
 */
export function buildMailto(email: string, subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  return `mailto:${email}?${params.toString()}`;
}

/** Zero pads a number to a fixed width, e.g. padStart(3, 0) to "03". */
export function padStart(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}
