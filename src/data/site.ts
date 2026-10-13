import type { SocialLink } from '@/types/content';

/**
 * Global brand + contact configuration.
 * Contact values can be overridden per environment via VITE_* variables (see .env.example).
 */
export const site = {
  name: 'Wolvo',
  tagline: 'Freelance Digital Agency',
  statement:
    'A freelance digital agency designing and building websites, apps, campaigns and content for brands that want to grow.',
  url: import.meta.env.VITE_SITE_URL || 'https://wolvo.agency',
  // PLACEHOLDER: replace with Wolvo's real inbox (or set VITE_CONTACT_EMAIL).
  email: import.meta.env.VITE_CONTACT_EMAIL || 'hello@wolvo.agency',
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
  availability: 'Available for new projects',
  // Configured WhatsApp business number (e.g. +1234567890 or set VITE_WHATSAPP_NUMBER).
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '+1234567890',
  whatsappMessage: 'Hi Wolvo, I would like to discuss a new project!',
} as const;

/**
 * PLACEHOLDER: point these at Wolvo's real profiles. Invalid or empty URLs are
 * filtered out automatically, so a platform can be removed by clearing its href.
 */
export const socialLinks: SocialLink[] = [
  { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { platform: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { platform: 'x', label: 'X (Twitter)', href: 'https://x.com/' },
  { platform: 'github', label: 'GitHub', href: 'https://github.com/' },
];

/** Options for the project inquiry form. */
export const inquiryOptions = {
  budgets: ['Under $1k', '$1k – $5k', '$5k – $10k', '$10k+', 'Not sure yet'],
  timelines: ['As soon as possible', 'Within 1 month', '1 – 3 months', 'Flexible'],
} as const;
