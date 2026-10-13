import { describe, expect, it } from 'vitest';
import { isExternalUrl, isSafeUrl } from './url';
import { countWords, formatDate, initials, padNumber, readingTime } from './format';
import { buildMailto, EMAIL_PATTERN, PHONE_PATTERN, sanitizeInquiry } from './contact';
import { articles } from '@/data/articles';
import { projects } from '@/data/projects';
import { services } from '@/data/services';
import { founders } from '@/data/founders';
import { socialLinks } from '@/data/site';
import { techGroups } from '@/data/techStack';
import { techLogos } from '@/data/techLogos';

/** Files present in /public/images (keys only — nothing is loaded). */
const publicImages = new Set(Object.keys(import.meta.glob('/public/images/*')).map((key) => key.replace(/^\/public/, '')));
const publicFile = (url: string) => publicImages.has(url);

describe('url helpers', () => {
  it('accepts http(s), mailto and in-page anchors', () => {
    expect(isSafeUrl('https://wolvo.agency')).toBe(true);
    expect(isSafeUrl('mailto:hello@wolvo.agency')).toBe(true);
    expect(isSafeUrl('#projects')).toBe(true);
  });

  it('rejects empty, relative-looking and script URLs', () => {
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl(undefined)).toBe(false);
    expect(isSafeUrl('#')).toBe(false);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('https://localhost')).toBe(false);
  });

  it('detects external links', () => {
    expect(isExternalUrl('https://github.com/')).toBe(true);
    expect(isExternalUrl('#about')).toBe(false);
  });
});

describe('format helpers', () => {
  it('pads numbers and builds initials', () => {
    expect(padNumber(5, 2)).toBe('05');
    expect(padNumber(100, 2)).toBe('100');
    expect(initials('Client Name')).toBe('CN');
    expect(initials('wolvo')).toBe('W');
  });

  it('formats ISO dates without timezone drift', () => {
    expect(formatDate('2026-09-22')).toBe('Sep 22, 2026');
  });

  it('rounds reading time up to whole minutes', () => {
    const article = { summary: 'one two', body: [{ paragraphs: [Array(219).fill('word').join(' ')] }] };
    expect(countWords(article)).toBe(221);
    expect(readingTime(article)).toBe('2 min read');
  });
});

describe('inquiry helpers', () => {
  it('validates email and phone formats', () => {
    expect(EMAIL_PATTERN.test('client@company.com')).toBe(true);
    expect(EMAIL_PATTERN.test('client@company')).toBe(false);
    expect(PHONE_PATTERN.test('+91 98765 43210')).toBe(true);
    expect(PHONE_PATTERN.test('call me')).toBe(false);
  });

  it('trims, strips control characters and caps lengths', () => {
    const clean = sanitizeInquiry({
      name: '  Ada\u0007 ',
      email: ' ADA@Example.COM ',
      service: 'Web Development',
      message: 'x'.repeat(3000),
    });
    expect(clean.name).toBe('Ada');
    expect(clean.email).toBe('ada@example.com');
    expect(clean.message).toHaveLength(2000);
    expect(clean.website).toBe('');
  });

  it('builds an encoded mailto link', () => {
    const href = buildMailto(
      { name: 'Ada', email: 'ada@example.com', service: 'App Development', message: 'Build an app & launch it' },
      'hello@wolvo.agency',
    );
    expect(href.startsWith('mailto:hello@wolvo.agency?subject=')).toBe(true);
    expect(href).toContain(encodeURIComponent('App Development'));
    expect(href).toContain(encodeURIComponent('Build an app & launch it'));
  });
});

describe('content data integrity', () => {
  it('has unique ids', () => {
    for (const list of [articles, projects, services, founders]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('covers the six core services', () => {
    expect(services.map((s) => s.id)).toEqual(['web', 'app', 'ads', 'video', 'brand', 'social']);
  });

  it('ships every service photo variant, its fallback and alt text', () => {
    for (const { image, imageAlt, imageFallback } of services) {
      expect(imageAlt.length).toBeGreaterThan(20);
      expect(publicFile(image.fallback)).toBe(true);
      expect(publicFile(imageFallback)).toBe(true);
      for (const w of image.widths) for (const ext of ['avif', 'webp']) expect(publicFile(`${image.base}-${w}.${ext}`)).toBe(true);
    }
  });

  it('ships every article cover photo variant', () => {
    for (const { coverImage } of articles) {
      if (!coverImage) continue;
      expect(publicFile(coverImage.fallback)).toBe(true);
      for (const w of coverImage.widths) for (const ext of ['avif', 'webp']) expect(publicFile(`${coverImage.base}-${w}.${ext}`)).toBe(true);
    }
  });

  it('lists tools in every tech stack group, each logo resolving to an official mark', () => {
    for (const group of techGroups) {
      expect(group.tools.length).toBeGreaterThan(0);
      for (const tool of group.tools) if (tool.logo) expect(techLogos[tool.logo].path.length).toBeGreaterThan(20);
    }
  });

  it('shows 4–6 featured projects and exactly one featured article', () => {
    const featured = projects.filter((p) => p.featured).length;
    expect(featured).toBeGreaterThanOrEqual(4);
    expect(featured).toBeLessThanOrEqual(6);
    expect(articles.filter((a) => a.featured)).toHaveLength(1);
  });

  it('only lists social profiles with valid URLs or leaves them empty', () => {
    for (const link of [...socialLinks, ...founders.flatMap((f) => f.socialLinks)]) {
      expect(link.href === '' || isSafeUrl(link.href)).toBe(true);
    }
  });
});
