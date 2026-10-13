import type { Article } from '@/types/content';

const WORDS_PER_MINUTE = 220;

export function countWords(article: Pick<Article, 'body' | 'summary'>): number {
  const text = [article.summary, ...article.body.flatMap((s) => [s.heading ?? '', ...s.paragraphs])].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingTime(article: Pick<Article, 'body' | 'summary'>): string {
  const minutes = Math.max(1, Math.ceil(countWords(article) / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function padNumber(value: number, pad = 0): string {
  return String(value).padStart(pad, '0');
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
