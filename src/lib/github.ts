/**
 * GitHub repository helpers: URL construction, sharing endpoints, and REST API integration.
 */

export interface GitHubRepoMeta {
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  cloneUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  license?: string;
  isPrivate: boolean;
  updatedAt: string;
}

export interface GitHubFetchResult {
  success: boolean;
  data?: GitHubRepoMeta;
  error?: string;
  isNotFound?: boolean;
  isRateLimited?: boolean;
  isAuthError?: boolean;
}

export interface ShareOptions {
  url: string;
  title?: string;
  text?: string;
}

const DEFAULT_OWNER = 'wolvo-digital-solutions';
const DEFAULT_REPO = 'wolvo';
const BASE_GITHUB = 'https://github.com';

/**
 * Normalizes owner and repo strings, guarding against malformed paths.
 */
export function sanitizeRepoSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9._-]/g, '').trim();
}

/**
 * Builds a validated, safe GitHub repository URL.
 */
export function buildGitHubRepoUrl(owner = DEFAULT_OWNER, repo = DEFAULT_REPO): string {
  const cleanOwner = sanitizeRepoSlug(owner) || DEFAULT_OWNER;
  const cleanRepo = sanitizeRepoSlug(repo) || DEFAULT_REPO;
  return `${BASE_GITHUB}/${cleanOwner}/${cleanRepo}`;
}

/**
 * Builds the Git HTTPS clone URL.
 */
export function buildCloneUrl(repoUrl: string): string {
  const clean = repoUrl.replace(/\/+$/, '');
  return clean.endsWith('.git') ? clean : `${clean}.git`;
}

/**
 * Generates platform-specific sharing links for the repository.
 */
export function generateShareLinks({ url, title = 'Wolvo Digital Agency Repository', text = 'Check out the Wolvo project repository on GitHub:' }: ShareOptions) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text} ${url}`);
  const encodedTitle = encodeURIComponent(title);

  return {
    rawUrl: url,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
  };
}

/**
 * Attempts native Web Share API if supported.
 */
export async function shareNatively(options: ShareOptions): Promise<boolean> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(options);
      return true;
    } catch (err) {
      // User cancelled or share dismissed
      if ((err as Error)?.name === 'AbortError') return false;
      throw err;
    }
  }
  return false;
}

/**
 * Copies text to the clipboard with robust fallbacks.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to textarea execCommand
  }

  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Fetches repository metadata directly from the public GitHub REST API.
 * Handles rate limits, authentication tokens, 404s, and offline states.
 */
export async function fetchGitHubRepoDetails(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
  token?: string,
): Promise<GitHubFetchResult> {
  const cleanOwner = sanitizeRepoSlug(owner) || DEFAULT_OWNER;
  const cleanRepo = sanitizeRepoSlug(repo) || DEFAULT_REPO;
  const apiUrl = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };

  const authToken = token || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GITHUB_TOKEN : undefined);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(apiUrl, { headers });

    if (res.status === 404) {
      return {
        success: false,
        error: `Repository "${cleanOwner}/${cleanRepo}" was not found or is set to private.`,
        isNotFound: true,
      };
    }

    if (res.status === 401) {
      return {
        success: false,
        error: 'GitHub API authentication failed. The provided GitHub token is invalid or expired.',
        isAuthError: true,
      };
    }

    if (res.status === 403) {
      const remaining = res.headers.get('x-ratelimit-remaining');
      if (remaining === '0') {
        return {
          success: false,
          error: 'GitHub API rate limit exceeded. You can still access, copy, and share the repository URL directly.',
          isRateLimited: true,
        };
      }
      return {
        success: false,
        error: 'Access to this repository via GitHub API was restricted.',
        isAuthError: true,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: `GitHub API returned status ${res.status} (${res.statusText || 'Unknown Error'}).`,
      };
    }

    const json = await res.json();

    const data: GitHubRepoMeta = {
      owner: json.owner?.login || cleanOwner,
      repo: json.name || cleanRepo,
      fullName: json.full_name || `${cleanOwner}/${cleanRepo}`,
      description: json.description || 'Wolvo — freelance digital agency website repository.',
      htmlUrl: json.html_url || buildGitHubRepoUrl(cleanOwner, cleanRepo),
      cloneUrl: json.clone_url || buildCloneUrl(buildGitHubRepoUrl(cleanOwner, cleanRepo)),
      stars: json.stargazers_count ?? 0,
      forks: json.forks_count ?? 0,
      openIssues: json.open_issues_count ?? 0,
      defaultBranch: json.default_branch || 'main',
      license: json.license?.spdx_id || json.license?.name || undefined,
      isPrivate: Boolean(json.private),
      updatedAt: json.updated_at || new Date().toISOString(),
    };

    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      success: false,
      error: `Network error connecting to GitHub: ${message}. Direct repository link remains fully operational.`,
    };
  }
}
