import type { Testimonial } from '@/types/content';

/**
 * PLACEHOLDER: only publish genuine client reviews (with permission).
 * Replace each entry with a real quote, name, role and company; add `avatar`
 * and `rating` only when they are real. Ratings are hidden when omitted.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'review-1',
    name: 'Client Name',
    role: 'Founder',
    company: 'Company',
    quote:
      'Your first genuine client review goes here: two or three honest sentences about the project, the process and what changed after launch.',
    placeholder: true,
  },
  {
    id: 'review-2',
    name: 'Client Name',
    role: 'Marketing Lead',
    company: 'Company',
    quote:
      'Real feedback builds real trust. Add a quote from a client you have delivered a website, app, campaign or video for.',
    placeholder: true,
  },
  {
    id: 'review-3',
    name: 'Client Name',
    role: 'Content Creator',
    company: 'Brand',
    quote:
      'Keep it specific: what was the challenge, how did Wolvo help, and what was it like working with the team day to day?',
    placeholder: true,
  },
];
