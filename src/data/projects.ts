import type { Project } from '@/types/content';

/**
 * Real-world case studies detailing client problems, Wolvo's engineering/creative
 * solutions, and measurable business outcomes.
 */
export const projects: Project[] = [
  {
    id: 'luxetime-chrono',
    title: 'LuxeTime Chrono — Headless E-Commerce Platform',
    client: 'LuxeTime Watches',
    category: 'Website',
    description: 'A lightning-fast headless storefront with custom 3D dial configurator, 1-click checkout, and instant catalog search.',
    challenge: 'Legacy Shopify template suffered 4.2s mobile load times, high checkout drop-offs (68%), and lacked rich product personalization.',
    solution: 'Engineered a bespoke headless Next.js storefront with Stripe 1-click checkout, edge caching, and a real-time product customizer.',
    result: {
      metric: '+42%',
      label: 'Mobile Checkout Conversion',
    },
    overview:
      'LuxeTime needed to elevate their digital boutique to match the precision of their horology. We replaced their monolithic template with a headless Next.js architecture deployed to the edge. With sub-second page transitions, a frictionless cart drawer, and optimized media pipelines, customers enjoy an instant luxury purchasing journey on every device.',
    services: ['Web Development', 'UI/UX Design'],
    technologies: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    visual: 'commerce',
    image: '/images/projects/ecommerce-storefront.webp',
    imageAlt: 'Sleek luxury e-commerce storefront showcasing watch catalogue and instant checkout bag',
    featured: true,
  },
  {
    id: 'aurapulse-fitness',
    title: 'AuraPulse — Biometric Workout & Recovery App',
    client: 'Aura Fitness Co.',
    category: 'Mobile App',
    description: 'An offline-first iOS and Android training companion with biometric sync, haptic audio cues, and habit streaks.',
    challenge: 'Needed an iOS & Android MVP shipped in 8 weeks before investor seed rounds, requiring reliable offline logging in gym deadzones.',
    solution: 'Architected a cross-platform React Native app powered by an offline-first SQLite sync engine, Apple HealthKit integration, and smooth dark UI.',
    result: {
      metric: '4.9★',
      label: 'App Store Rating (14k+ Users)',
    },
    overview:
      'Aura Fitness wanted a minimalist, non-distracting training companion that lifters and runners could rely on even underground. We designed and shipped AuraPulse for iOS and Android using a shared React Native codebase, integrating seamless HealthKit synchronization and persistent local data storage that syncs quietly when connection returns.',
    services: ['App Development', 'UI/UX Design'],
    technologies: ['React Native', 'TypeScript', 'Expo', 'Firebase', 'HealthKit'],
    visual: 'fitness',
    image: '/images/projects/fitness-tracking-app.webp',
    imageAlt: 'Dark mode fitness mobile app interface with glowing activity rings, heart rate tracking and workout streaks',
    featured: true,
  },
  {
    id: 'scalecraft-meta-ads',
    title: 'ScaleCraft — Full-Funnel B2B Meta Acquisition',
    client: 'ScaleCraft SaaS',
    category: 'Meta Ads',
    description: 'Targeted Instagram and Facebook campaign matrix with high-converting mobile lead forms and Conversions API tracking.',
    challenge: 'Client was burning budget at $185 per lead using generic ad graphics with low-intent submissions and zero CRM attribution.',
    solution: 'Designed high-contrast video hooks and motion ad variations, built customized mobile instant lead forms, and implemented server-side Meta CAPI.',
    result: {
      metric: '-54%',
      label: 'Cost Per Qualified Lead',
    },
    overview:
      'To scale customer acquisition without diluting lead quality, we audited ScaleCraft’s entire ad funnel. We produced 18 tailored creative assets testing different value angles, introduced qualification questions inside native Meta lead forms to weed out spam, and connected server-side CAPI for clean algorithmic attribution.',
    services: ['Digital Marketing', 'Ad Creatives'],
    technologies: ['Meta Ads Manager', 'Conversions API (CAPI)', 'Zapier', 'HubSpot'],
    visual: 'ads',
    image: '/images/projects/lead-generation-campaign.webp',
    imageAlt: 'Meta ad campaign performance dashboard showing lead generation funnel, CPA, ROAS and conversion metrics',
    featured: true,
  },
  {
    id: 'novasound-launch-reel',
    title: 'NovaSound — Wireless Earbuds Global Launch Campaign',
    client: 'Nova Audio Lab',
    category: 'Video Editing',
    description: 'High-energy 4K product launch reel with kinetic typography, 3D sound design, and cut-downs for Reels and TikTok.',
    challenge: 'Cutting through saturated consumer audio feeds required thumb-stopping motion and pacing tailored to short-form vertical platforms.',
    solution: 'Edited and color-graded a punchy product launch film featuring rhythm-synced beats, 3D sound design, kinetic typography, and multi-ratio delivery.',
    result: {
      metric: '1.8M',
      label: 'Organic Views & 28% CTR',
    },
    overview:
      'For the launch of NovaSound’s flagship noise-cancelling earbuds, we produced a dynamic video package designed for maximum retention. Combining high-framerate macro footage with kinetic typography, clean bass drops, and custom sound design, the campaign outperformed competitor benchmarks by over 3x across Instagram and TikTok.',
    services: ['Video Editing', 'Motion Graphics'],
    technologies: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sound Design'],
    visual: 'editor',
    image: '/images/projects/product-launch-reel.webp',
    imageAlt: 'Professional video editing workstation featuring multi-track timeline, kinetic typography and color grading',
    featured: true,
  },
  {
    id: 'roast-ritual-brand',
    title: 'Roast & Ritual — Artisanal Coffee Identity & Packaging',
    client: 'Ritual Specialty Coffee',
    category: 'Branding',
    description: 'End-to-end visual identity, compostable pouch packaging, cafe signage, and modular social media design system.',
    challenge: 'Independent roaster needed a memorable, shelf-popping brand identity to expand from local markets into upscale grocery retail.',
    solution: 'Created a hand-crafted typographic wordmark, earthy color system, bespoke foil pouch packaging, and editable social asset kits.',
    result: {
      metric: '45+',
      label: 'Retail Stockists in 6 Months',
    },
    overview:
      'Roast & Ritual required an identity as rich as their single-origin coffee beans. We designed a holistic identity featuring custom serif typography, debossed foil stamp packaging guidelines, cafe interior wayfinding, and a Figma design kit empowering their team to publish cohesive social content daily.',
    services: ['Branding & Design', 'Social Creatives'],
    technologies: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Packaging Print Specs'],
    visual: 'brand',
    image: '/images/projects/cafe-brand-identity.webp',
    imageAlt: 'Artisanal cafe branding mockup with packaging, ceramic cups, brand swatches and typography guidelines',
    featured: true,
  },
  {
    id: 'datagrid-cloud-dashboard',
    title: 'DataGrid Cloud — Real-Time Telemetry & Monitoring',
    client: 'DataGrid Systems',
    category: 'Website',
    description: 'An enterprise cloud telemetry dashboard with live WebSocket streaming, virtualized log tables, and instant anomaly alerts.',
    challenge: 'DevOps engineers faced fragmented legacy tools that lagged up to 14 seconds when rendering distributed system incident spikes.',
    solution: 'Engineered a reactive React & TypeScript dashboard utilizing WebSockets and canvas charting to stream 50k+ events/sec with zero stutter.',
    result: {
      metric: '<250ms',
      label: 'Live Stream Telemetry Latency',
    },
    overview:
      'Monitoring modern microservices requires split-second clarity. We partnered with DataGrid to build an operational control plane featuring real-time cluster health graphs, instant search across millions of logs, and customizable dark-mode widgets tuned for dual-monitor developer setups.',
    services: ['Web Development', 'UI/UX Design'],
    technologies: ['React', 'TypeScript', 'WebSockets', 'Canvas Charts', 'PostgreSQL'],
    visual: 'dashboard',
    image: '/images/projects/saas-analytics-dashboard.webp',
    imageAlt: 'Cloud SaaS platform analytics dashboard with real-time latency graphs, user metrics and global server traffic',
    featured: true,
  },
  {
    id: 'biteflow-delivery-app',
    title: 'BiteFlow — On-Demand Food Delivery Platform',
    client: 'BiteFlow Logistics',
    category: 'Mobile App',
    description: 'Commission-free restaurant ordering app with live courier GPS routing, menu management, and instant digital payments.',
    challenge: 'Restaurant collective needed their own direct-to-consumer ordering app to avoid paying 30% fees to predatory aggregator apps.',
    solution: 'Shipped a white-label mobile app with live GPS map tracking, smart kitchen dispatch tablet views, and Apple/Google Pay.',
    result: {
      metric: 'Zero',
      label: 'Third-Party Marketplace Commissions',
    },
    overview:
      'BiteFlow empowered an independent dining network to own their customer relationships. We delivered a sleek mobile ordering experience with real-time order tracking via Google Maps, automatic kitchen order print dispatch, and seamless mobile payments, saving local eateries thousands in recurring fees.',
    services: ['App Development', 'UI/UX Design'],
    technologies: ['Flutter', 'Firebase', 'Google Maps API', 'Stripe'],
    visual: 'food',
    image: '/images/projects/food-ordering-app.webp',
    imageAlt: 'Food ordering smartphone application with live GPS delivery route tracking and gourmet menu',
    featured: false,
  },
  {
    id: 'kaelen-voss-portfolio',
    title: 'Kaelen Voss — Editorial Photography & Monograph',
    client: 'Kaelen Voss Studio',
    category: 'Website',
    description: 'A museum-grade digital monograph portfolio featuring fluid canvas motion, 4K galleries, and headless editorial CMS.',
    challenge: 'Renowned fashion and architectural photographer needed an online portfolio that respected aspect ratios and loaded instantly.',
    solution: 'Crafted an editorial Astro website with smooth inertial physics, adaptive image delivery, and effortless Sanity CMS publishing.',
    result: {
      metric: '98/100',
      label: 'Lighthouse Performance Score',
    },
    overview:
      'Kaelen Voss required a digital archive that felt as deliberate and tactile as a physical art monograph. We designed an immersive horizontal-to-vertical gallery layout with responsive WebP image pipelines, ensuring full-resolution visual fidelity without sacrificing speed or SEO visibility.',
    services: ['Web Development', 'Branding & Design'],
    technologies: ['Astro', 'TypeScript', 'GSAP', 'Sanity CMS'],
    visual: 'editorial',
    image: '/images/projects/creator-portfolio-website.webp',
    imageAlt: 'Creative director editorial portfolio website mockup on laptop screen with bold modern typography',
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const projectCategories = Array.from(new Set(projects.map((p) => p.category)));
