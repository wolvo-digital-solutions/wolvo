/** Returns true for absolute http(s) URLs, mailto: links and in-page anchors. */
export function isSafeUrl(value: string | undefined | null): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.startsWith('#') && trimmed.length > 1) return true;
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'mailto:') return url.pathname.includes('@');
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

/** True when the URL points to another origin and should open in a new tab. */
export function isExternalUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/**
 * Resolves static asset paths against Vite's base URL so images and icons
 * work properly both locally and on subpaths like GitHub Pages.
 */
export function assetUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (/^(?:https?:|\/\/|data:)/i.test(path)) return path;
  const clean = path.replace(/^\/+/, '');
  const base = import.meta.env.BASE_URL || './';
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}
