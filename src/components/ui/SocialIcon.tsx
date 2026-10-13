import { Mail } from 'lucide-react';
import type { SocialLink } from '@/types/content';
import { isSafeUrl } from '@/lib/url';

/** Outline brand icons drawn to match Lucide's 2px, rounded-cap style. */
export function SocialIcon({ platform }: { platform: SocialLink['platform'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.85,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  switch (platform) {
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <path d="M4 4l11.7 16H20L8.3 4Z" />
          <path d="M4 20l6.8-6.8M13.2 10.8 20 4" />
        </svg>
      );
    case 'github':
      return (
        <svg {...common}>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    default:
      return <Mail strokeWidth={1.85} aria-hidden="true" />;
  }
}

/** Renders only links with valid URLs, so unset profiles simply disappear. */
export function SocialList({ links, className = 'socials' }: { links: SocialLink[]; className?: string }) {
  const valid = links.filter((link) => isSafeUrl(link.href));
  if (!valid.length) return null;
  return (
    <ul className={className} role="list">
      {valid.map((link) => (
        <li key={link.platform}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`}>
            <SocialIcon platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
