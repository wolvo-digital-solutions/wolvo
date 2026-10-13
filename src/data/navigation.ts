import type { NavItem } from '@/types/content';

/** Primary navigation — section anchors from the screen-flow spec. */
export const primaryNav: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Articles', href: '#articles' },
  { label: 'Contact', href: '#contact' },
];

/** Footer navigation includes every landing-page section. */
export const footerNav: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Tech Stack', href: '#stack' },
  { label: 'Projects', href: '#projects' },
  { label: 'Articles', href: '#articles' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

/** Section ids in page order for active-link tracking. `stack` is omitted so "Services" stays highlighted through the tech stack. */
export const sectionIds = ['home', 'about', 'services', 'projects', 'articles', 'reviews', 'contact'] as const;
