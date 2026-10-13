import { describe, expect, it } from 'vitest';
import {
  buildCloneUrl,
  buildGitHubRepoUrl,
  generateShareLinks,
  sanitizeRepoSlug,
  fetchGitHubRepoDetails,
} from './github';

describe('github helpers', () => {
  it('sanitizes repo slugs against dangerous or invalid characters', () => {
    expect(sanitizeRepoSlug('wolvo-digital-solutions')).toBe('wolvo-digital-solutions');
    expect(sanitizeRepoSlug('wolvo/project')).toBe('wolvoproject');
    expect(sanitizeRepoSlug('wolvo.agency')).toBe('wolvo.agency');
    expect(sanitizeRepoSlug('  slug_with-spaces  ')).toBe('slug_with-spaces');
  });

  it('builds canonical GitHub repository URLs', () => {
    expect(buildGitHubRepoUrl()).toBe('https://github.com/wolvo-digital-solutions/wolvo');
    expect(buildGitHubRepoUrl('custom-owner', 'custom-repo')).toBe('https://github.com/custom-owner/custom-repo');
  });

  it('builds HTTPS clone URLs', () => {
    expect(buildCloneUrl('https://github.com/wolvo-digital-solutions/wolvo')).toBe(
      'https://github.com/wolvo-digital-solutions/wolvo.git',
    );
    expect(buildCloneUrl('https://github.com/wolvo-digital-solutions/wolvo.git')).toBe(
      'https://github.com/wolvo-digital-solutions/wolvo.git',
    );
    expect(buildCloneUrl('https://github.com/wolvo-digital-solutions/wolvo/')).toBe(
      'https://github.com/wolvo-digital-solutions/wolvo.git',
    );
  });

  it('generates platform sharing links for WhatsApp, X, LinkedIn, and Email', () => {
    const links = generateShareLinks({
      url: 'https://github.com/wolvo-digital-solutions/wolvo',
      title: 'Wolvo Repo',
      text: 'Check this out:',
    });

    expect(links.rawUrl).toBe('https://github.com/wolvo-digital-solutions/wolvo');
    expect(links.whatsapp).toContain('https://api.whatsapp.com/send?text=');
    expect(links.whatsapp).toContain(encodeURIComponent('https://github.com/wolvo-digital-solutions/wolvo'));

    expect(links.x).toContain('https://twitter.com/intent/tweet?');
    expect(links.x).toContain(encodeURIComponent('https://github.com/wolvo-digital-solutions/wolvo'));

    expect(links.linkedin).toContain('https://www.linkedin.com/sharing/share-offsite/?url=');
    expect(links.linkedin).toContain(encodeURIComponent('https://github.com/wolvo-digital-solutions/wolvo'));

    expect(links.email.startsWith('mailto:?subject=')).toBe(true);
    expect(links.email).toContain(encodeURIComponent('Wolvo Repo'));
  });

  it('gracefully handles API network errors or missing repos without throwing', async () => {
    // Non-existent repo to verify clear error structure
    const result = await fetchGitHubRepoDetails('wolvo-nonexistent-org-123456789', 'unknown-repo-xyz');
    expect(result.success).toBe(false);
    expect(typeof result.error).toBe('string');
    expect(result.error?.length).toBeGreaterThan(5);
  });
});
