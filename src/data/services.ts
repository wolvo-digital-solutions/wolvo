import { Clapperboard, Megaphone, Monitor, PenTool, Share2, Smartphone } from 'lucide-react';
import type { Service } from '@/types/content';
import { images, photos } from './images';

export const services: Service[] = [
  {
    id: 'web',
    title: 'Web Development',
    shortTitle: 'Web',
    description:
      'Fast, modern and fully responsive websites and web apps — engineered to load quickly, rank well and turn visitors into enquiries.',
    icon: Monitor,
    deliverables: ['Business websites', 'Landing pages', 'Web apps', 'E-commerce'],
    href: '#contact',
    image: photos.serviceWeb,
    imageAlt: 'A landing page open in a browser on a desktop monitor, with its code alongside',
    imageFallback: images.serviceWeb.fallback,
  },
  {
    id: 'app',
    title: 'App Development',
    shortTitle: 'App',
    description:
      'Android, iOS and cross-platform apps with clean interfaces, smooth performance and a launch plan built in.',
    icon: Smartphone,
    deliverables: ['iOS & Android', 'Cross-platform', 'App UI/UX', 'Store launch'],
    href: '#contact',
    image: photos.serviceApp,
    imageAlt: 'A hand holding a smartphone running a weather and activity app, with app designs on screens behind',
    imageFallback: images.serviceApp.fallback,
  },
  {
    id: 'ads',
    title: 'Digital Marketing',
    shortTitle: 'Marketing',
    description:
      'Meta Ads on Facebook and Instagram built around your goals — setup, targeting, creatives and ongoing optimization that turns spend into leads.',
    icon: Megaphone,
    deliverables: ['Meta Ads', 'Targeting', 'Ad creatives', 'Optimization'],
    href: '#contact',
    image: photos.serviceAds,
    imageAlt: 'A dark analytics dashboard with traffic charts, conversion rates and session metrics',
    imageFallback: images.serviceAds.fallback,
  },
  {
    id: 'video',
    title: 'Video Editing',
    shortTitle: 'Video',
    description:
      'Reels, promos and brand videos edited for attention — tight pacing, clean motion graphics and formats for every platform.',
    icon: Clapperboard,
    deliverables: ['Reels & shorts', 'Promo videos', 'Brand films', 'Motion graphics'],
    href: '#contact',
    image: photos.serviceVideo,
    imageAlt: 'Close-up of a video editing timeline with clips, transitions and an audio track',
    imageFallback: images.serviceVideo.fallback,
  },
  {
    id: 'brand',
    title: 'Branding & Design',
    shortTitle: 'Branding',
    description:
      'Logos, visual identities, social creatives and UI/UX design that make your brand look as good as the work behind it.',
    icon: PenTool,
    deliverables: ['Logo & identity', 'Social creatives', 'UI/UX design', 'Brand guidelines'],
    href: '#contact',
    image: photos.serviceBrand,
    imageAlt: 'A letter A sketched on a drawing tablet next to a stylus and an orange brand book',
    imageFallback: images.serviceBrand.fallback,
  },
  {
    id: 'social',
    title: 'Social Media Management',
    shortTitle: 'Social',
    description:
      'Content calendars, on-brand posts and community management that keep your channels consistent, active and growing — with clear monthly reporting.',
    icon: Share2,
    deliverables: ['Content calendar', 'Post design', 'Community management', 'Monthly reports'],
    href: '#contact',
    image: photos.serviceSocial,
    imageAlt: 'A hand holding up a phone showing a social media profile grid among city billboards',
    imageFallback: images.serviceSocial.fallback,
  },
];

export const serviceTitles = services.map((s) => s.title);
