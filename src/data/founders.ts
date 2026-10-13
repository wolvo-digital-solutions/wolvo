import type { Founder } from '@/types/content';

/**
 * PLACEHOLDER: replace with the real Founder and Co-Founder details and photos.
 * Names, bios and profiles must come from Wolvo — nothing here is invented.
 * Add more entries to expand the team; the section adapts automatically.
 * Social links with an empty or invalid `href` are not rendered.
 */
export const founders: Founder[] = [
  {
    id: 'founder',
    name: 'Founder Name',
    role: 'Founder & CEO',
    bio: 'Leads strategy, client partnerships and creative direction. Your first point of contact from kickoff to launch.',
    socialLinks: [
      { platform: 'linkedin', label: 'LinkedIn', href: '' },
      { platform: 'instagram', label: 'Instagram', href: '' },
    ],
    placeholder: true,
  },
  {
    id: 'co-founder',
    name: 'Co-Founder Name',
    role: 'Co-Founder & CTO',
    bio: 'Owns engineering and delivery: architecture, web and app builds, performance and a smooth, stable launch.',
    socialLinks: [
      { platform: 'linkedin', label: 'LinkedIn', href: '' },
      { platform: 'github', label: 'GitHub', href: 'https://github.com/wolvo-digital-solutions' },
    ],
    placeholder: true,
  },
];
