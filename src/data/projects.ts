import type { Project } from '@/types/content';

/**
 * PLACEHOLDER PORTFOLIO
 * These entries describe the kinds of work Wolvo delivers and render with
 * illustrated mockups. Replace them with real projects: set `image` to a real
 * screenshot, `href` to the live URL / case study, and remove `placeholder`.
 * No client names or results are invented here.
 */
export const projects: Project[] = [
  {
    id: 'ecommerce-storefront',
    title: 'E-Commerce Storefront',
    category: 'Website',
    description: 'A conversion-focused online store with a custom catalogue, fast checkout and an easy-to-edit CMS.',
    overview:
      'A headless storefront designed around product discovery: rich category pages, a frictionless checkout and a content system the team can update without touching code. Built mobile-first, with performance budgets set from day one.',
    services: ['Web Development', 'UI/UX Design'],
    technologies: ['React', 'Next.js', 'Stripe', 'Headless CMS'],
    visual: 'commerce',
    featured: true,
    placeholder: true,
  },
  {
    id: 'fitness-tracking-app',
    title: 'Fitness Tracking App',
    category: 'Mobile App',
    description: 'A cross-platform app for logging workouts and progress, with daily dashboards and goal streaks.',
    overview:
      'A calm, focused mobile experience for tracking training. Daily dashboards surface what matters, streaks keep motivation high, and offline-first sync means workouts are never lost. Shipped to iOS and Android from a single codebase.',
    services: ['App Development', 'UI/UX Design'],
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    visual: 'fitness',
    featured: true,
    placeholder: true,
  },
  {
    id: 'lead-generation-campaign',
    title: 'Lead Generation Campaign',
    category: 'Meta Ads',
    description: 'A full-funnel Facebook and Instagram campaign with audience research, creative testing and tracking.',
    overview:
      'A structured Meta Ads program built for qualified leads: audience research, a creative testing matrix, lead forms tuned for quality and full conversion tracking through the Pixel and Conversions API, so every decision is based on data.',
    services: ['Digital Marketing', 'Ad Creatives'],
    technologies: ['Meta Ads Manager', 'Meta Pixel', 'Conversions API'],
    visual: 'ads',
    featured: true,
    placeholder: true,
  },
  {
    id: 'product-launch-reel',
    title: 'Product Launch Reel',
    category: 'Video Editing',
    description: 'Short-form launch videos cut for Reels and Shorts, with kinetic type and platform-ready formats.',
    overview:
      'A launch content pack edited for attention: a hero film, cut-downs for Reels, Shorts and Stories, kinetic typography, sound design and captions, delivered in every aspect ratio the campaign needs.',
    services: ['Video Editing', 'Motion Graphics'],
    technologies: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    visual: 'editor',
    featured: true,
    placeholder: true,
  },
  {
    id: 'cafe-brand-identity',
    title: 'Café Brand Identity',
    category: 'Branding',
    description: 'A warm, modern identity: logo, palette, typography and social templates for print and screen.',
    overview:
      'A complete identity system for a neighbourhood café: a flexible logo suite, a warm colour palette, typography rules, menu layouts and a set of social templates that keep every post on-brand.',
    services: ['Branding & Design'],
    technologies: ['Figma', 'Illustrator'],
    visual: 'brand',
    featured: true,
    placeholder: true,
  },
  {
    id: 'saas-analytics-dashboard',
    title: 'SaaS Analytics Dashboard',
    category: 'Website',
    description: 'A data-rich web app with role-based dashboards, real-time charts and an interface built for daily use.',
    overview:
      'A web application that turns raw data into decisions: role-based dashboards, real-time charts, saved views and an accessible component library that keeps the product consistent as it grows.',
    services: ['Web Development', 'UI/UX Design'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    visual: 'dashboard',
    featured: true,
    placeholder: true,
  },
  {
    id: 'food-ordering-app',
    title: 'Food Ordering App',
    category: 'Mobile App',
    description: 'A fast ordering flow with smart search, saved favourites and real-time order tracking.',
    overview:
      'An ordering app designed for speed: smart search, saved favourites, one-tap reorders and live order tracking, with a menu management panel for the restaurant team.',
    services: ['App Development', 'UI/UX Design'],
    technologies: ['Flutter', 'Firebase', 'Google Maps'],
    visual: 'food',
    featured: false,
    placeholder: true,
  },
  {
    id: 'creator-portfolio-website',
    title: 'Creator Portfolio Website',
    category: 'Website',
    description: 'An editorial portfolio site with case studies, smooth motion and a simple publishing workflow.',
    overview:
      'An editorial portfolio for a content creator: immersive case studies, subtle scroll motion, a simple publishing workflow and SEO foundations that help new work get found.',
    services: ['Web Development', 'Branding & Design'],
    technologies: ['Astro', 'GSAP', 'Sanity'],
    visual: 'editorial',
    featured: false,
    placeholder: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const projectCategories = Array.from(new Set(projects.map((p) => p.category)));
