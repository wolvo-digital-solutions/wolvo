import type { LucideIcon } from 'lucide-react';
import type { ImageSet } from '@/data/images';

export type ServiceId = 'web' | 'app' | 'ads' | 'video' | 'brand' | 'social';

export interface NavItem {
  label: string;
  href: `#${string}`;
  external?: boolean;
  target?: '_blank' | '_self';
}

export interface Service {
  id: ServiceId;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  deliverables: string[];
  href: string;
  /** Card photo (responsive image set). */
  image: ImageSet;
  /** Describes the photo for screen readers. */
  imageAlt: string;
  /** Self-hosted backup shown if the photo fails to load. */
  imageFallback: string;
}

export type ProjectCategory = 'Website' | 'Mobile App' | 'Meta Ads' | 'Video Editing' | 'Branding';

export type ProjectVisualKind =
  | 'commerce'
  | 'dashboard'
  | 'editorial'
  | 'fitness'
  | 'food'
  | 'ads'
  | 'editor'
  | 'brand';

export interface ProjectResult {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  description: string;
  /** The core problem or client challenge faced before the project. */
  challenge: string;
  /** What Wolvo engineered, designed and launched to solve it. */
  solution: string;
  /** Primary business outcome or measurable impact. */
  result?: ProjectResult;
  /** Longer copy shown in the project detail dialog. */
  overview: string;
  services: string[];
  technologies: string[];
  /** Real screenshot path. When omitted, an illustrated mockup is rendered. */
  image?: string;
  imageAlt?: string;
  visual: ProjectVisualKind;
  /** Live project / case-study URL. Only rendered when it is a valid http(s) URL. */
  href?: string;
  featured: boolean;
  /** True until replaced with genuine Wolvo work. */
  placeholder?: boolean;
}

export interface SocialLink {
  platform: 'instagram' | 'linkedin' | 'x' | 'github' | 'email';
  label: string;
  href: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  imageAlt?: string;
  socialLinks: SocialLink[];
  placeholder?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
  /** Only shown for genuine reviews (1–5). */
  rating?: number;
  placeholder?: boolean;
}

export type ArticleCategory =
  | 'Web Development'
  | 'App Development'
  | 'Meta Ads'
  | 'Video'
  | 'Branding'
  | 'Technology';

export type CoverVariant = 'grid' | 'orbit' | 'bars' | 'wave' | 'rings' | 'blocks';

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  cover: CoverVariant;
  /** Cover photo; the generated cover art is used when absent or if it fails to load. */
  coverImage?: ImageSet;
  body: ArticleSection[];
  featured?: boolean;
  href?: string;
}

export interface Stat {
  value: number;
  label: string;
  suffix?: string;
  /** Zero-pad to this many digits (e.g. 5 → "05"). */
  pad?: number;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ProofPoint {
  title: string;
  description: string;
  icon: LucideIcon;
}
