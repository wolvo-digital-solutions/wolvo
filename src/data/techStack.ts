import { Clapperboard, Monitor, PenTool, Smartphone, type LucideIcon } from 'lucide-react';
import type { TechLogoId } from './techLogos';

export interface TechTool {
  name: string;
  /** Official mark from techLogos (run `npm run logos` to add one). Omitted = shown by name only. */
  logo?: TechLogoId;
}

export interface TechGroup {
  id: 'web' | 'app' | 'video' | 'brand';
  title: string;
  description: string;
  icon: LucideIcon;
  tools: TechTool[];
}

/**
 * The tools Wolvo builds with, grouped by discipline. Based on the stacks named
 * in the project data and this site's own build — confirm and edit freely.
 * Adobe tools have no logo: Adobe restricts third-party use of its app icons.
 */
export const techGroups: TechGroup[] = [
  {
    id: 'web',
    title: 'Web Development',
    description: 'Fast, typed front ends and reliable back ends.',
    icon: Monitor,
    tools: [
      { name: 'React', logo: 'react' },
      { name: 'Next.js', logo: 'nextdotjs' },
      { name: 'TypeScript', logo: 'typescript' },
      { name: 'Node.js', logo: 'nodedotjs' },
      { name: 'Vite', logo: 'vite' },
      { name: 'Astro', logo: 'astro' },
      { name: 'GSAP', logo: 'gsap' },
      { name: 'PostgreSQL', logo: 'postgresql' },
      { name: 'Stripe', logo: 'stripe' },
      { name: 'Sanity', logo: 'sanity' },
    ],
  },
  {
    id: 'app',
    title: 'App Development',
    description: 'Native-feeling apps for iOS and Android.',
    icon: Smartphone,
    tools: [
      { name: 'React Native', logo: 'react' },
      { name: 'Firebase', logo: 'firebase' },
      { name: 'Supabase', logo: 'supabase' },
      { name: 'TypeScript', logo: 'typescript' },
      { name: 'iOS', logo: 'apple' },
      { name: 'Android', logo: 'android' },
      { name: 'Google Maps', logo: 'googlemaps' },
    ],
  },
  {
    id: 'video',
    title: 'Video Editing',
    description: 'Edit, grade and animate for every platform.',
    icon: Clapperboard,
    tools: [{ name: 'Adobe Premiere Pro' }, { name: 'Adobe After Effects' }, { name: 'DaVinci Resolve', logo: 'davinciresolve' }],
  },
  {
    id: 'brand',
    title: 'Brand Design',
    description: 'Identities, interfaces and social creatives.',
    icon: PenTool,
    tools: [{ name: 'Figma', logo: 'figma' }, { name: 'Adobe Illustrator' }, { name: 'Adobe Photoshop' }],
  },
];

/** Every distinct tool that has a logo — used by the marquee. */
export const marqueeTools: TechTool[] = Array.from(
  new Map(techGroups.flatMap((g) => g.tools).filter((t) => t.logo).map((t) => [t.logo, t])).values(),
);
