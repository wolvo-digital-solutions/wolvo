import { photos } from './images';
import type { Article } from '@/types/content';

/**
 * Editorial content for the Insights section. Reading time is calculated from
 * the body text automatically. Replace or extend freely; set `featured: true`
 * on the article that should lead the section.
 */
export const articles: Article[] = [
  {
    id: 'website-hardest-working-salesperson',
    title: 'Why your website is your hardest-working salesperson',
    category: 'Web Development',
    summary:
      'Your website works around the clock. Here’s how speed, clarity and a focused structure turn casual visitors into real enquiries.',
    date: '2026-09-22',
    cover: 'grid',
    coverImage: photos.articleWebsite,
    featured: true,
    body: [
      {
        paragraphs: [
          'Before most clients ever speak to you, they have already visited your website. In a few seconds they decide whether you look credible, whether you understand their problem and whether it is worth getting in touch. That makes your website less of a brochure and more of a salesperson: one that never takes a day off.',
        ],
      },
      {
        heading: 'Speed is the first impression',
        paragraphs: [
          'Visitors notice slow pages before they notice your design. Every extra second of loading gives people a reason to leave, especially on mobile connections. Optimized images, lean code and good hosting are not technical extras; they are the foundation everything else stands on.',
        ],
      },
      {
        heading: 'Clarity beats cleverness',
        paragraphs: [
          'Your headline should answer three questions immediately: what you do, who it is for and what to do next. Clever taglines can work, but only after the basics are obvious. If a visitor has to scroll to understand your offer, many simply will not.',
        ],
      },
      {
        heading: 'Structure pages around decisions',
        paragraphs: [
          'Great websites guide visitors through a simple story: the problem, your solution, proof that you can deliver and a clear next step. Each section should earn the scroll. Services should be scannable, work examples should be real, and calls to action should appear at natural decision points, not only at the very bottom.',
        ],
      },
      {
        heading: 'Measure, then improve',
        paragraphs: [
          'A launch is a starting point. Track which pages people visit, where they drop off and which calls to action they use. Small, regular improvements — a sharper headline, a shorter form, a faster page — compound into a website that keeps getting better at its job.',
        ],
      },
    ],
  },
  {
    id: 'native-cross-platform-or-web-app',
    title: 'Native, cross-platform or web app: choosing the right build',
    category: 'App Development',
    summary:
      'The right technology depends on your users, budget and roadmap. A practical guide to choosing how your app should be built.',
    date: '2026-09-08',
    cover: 'orbit',
    coverImage: photos.articleApp,
    body: [
      {
        paragraphs: [
          'One of the first decisions in any app project is how to build it. There is no universally right answer, but there is usually a right answer for your product, your users and your budget.',
        ],
      },
      {
        heading: 'Native apps',
        paragraphs: [
          'Native apps are built separately for iOS and Android using each platform’s own tools. They offer the best performance and the deepest access to device features, which matters for apps with complex animation, heavy media or hardware integrations. The trade-off is cost: you are effectively maintaining two codebases.',
        ],
      },
      {
        heading: 'Cross-platform apps',
        paragraphs: [
          'Frameworks like React Native and Flutter let one codebase run on both platforms. For most business apps — booking, ordering, tracking, content — they deliver a near-native experience at a significantly lower cost, and updates ship to both platforms at once.',
        ],
      },
      {
        heading: 'Web apps and PWAs',
        paragraphs: [
          'If your users mainly need information or simple tools, a progressive web app might be enough. It runs in the browser, installs to the home screen and avoids app store review cycles. It is often the fastest way to validate an idea before investing in a full mobile build.',
        ],
      },
      {
        heading: 'How to decide',
        paragraphs: [
          'Start with your users and your roadmap, not the technology. Which features are essential at launch? Which devices do your users have? How often will the product change? Answer those honestly and the right approach usually becomes clear.',
        ],
      },
    ],
  },
  {
    id: 'meta-ads-structure-before-spend',
    title: 'Meta Ads for lead generation: structure before spend',
    category: 'Meta Ads',
    summary:
      'Bigger budgets rarely fix weak campaigns. How to structure Meta Ads so your spend turns into qualified leads, not just clicks.',
    date: '2026-08-25',
    cover: 'bars',
    coverImage: photos.articleAds,
    body: [
      {
        paragraphs: [
          'It is tempting to treat ad performance as a budget problem: spend more, get more. In practice, most underperforming campaigns have a structure problem. Before increasing spend, it pays to get the foundations right.',
        ],
      },
      {
        heading: 'Start with tracking',
        paragraphs: [
          'If you cannot measure leads accurately, you cannot optimize for them. Install the Meta Pixel, set up the Conversions API and define exactly what counts as a lead. Without clean data, the algorithm is optimizing in the dark.',
        ],
      },
      {
        heading: 'Keep the account simple',
        paragraphs: [
          'Over-segmented campaigns split your budget into pieces too small to learn from. Fewer campaigns with broader audiences often perform better, because Meta’s delivery system gets enough data to find the people most likely to convert.',
        ],
      },
      {
        heading: 'Let creative do the targeting',
        paragraphs: [
          'Your ad creative is one of your strongest targeting tools. Different hooks, formats and messages attract different people. Test a handful of distinct creative concepts rather than small variations of the same idea, and give each test enough time and budget to produce a clear result.',
        ],
      },
      {
        heading: 'Judge quality, not just volume',
        paragraphs: [
          'Cheap leads that never answer the phone are not cheap. Track what happens after the form is submitted, feed that information back into your campaigns and refine your forms to filter for intent. The goal is more customers, not more contacts.',
        ],
      },
    ],
  },
  {
    id: 'first-three-seconds-short-form-video',
    title: 'The first three seconds: editing short-form video that holds attention',
    category: 'Video',
    summary:
      'On Reels and Shorts, attention is earned frame by frame. Editing techniques that keep viewers watching past the first swipe.',
    date: '2026-08-11',
    cover: 'wave',
    coverImage: photos.articleVideo,
    body: [
      {
        paragraphs: [
          'Short-form video is the most competitive real estate online. Viewers decide within a couple of seconds whether to keep watching or swipe away, so editing is not just finishing work — it is a core part of the strategy.',
        ],
      },
      {
        heading: 'Lead with the payoff',
        paragraphs: [
          'Open with the most interesting moment, a bold statement or a visual question. Save the slow introduction for long-form content. If the first frame does not create curiosity, nothing that follows will be seen.',
        ],
      },
      {
        heading: 'Cut for rhythm',
        paragraphs: [
          'Tight pacing keeps energy high. Remove pauses, filler words and repeated ideas. Vary shot length to create rhythm, and use cuts, zooms and B-roll to give the eye something new every few seconds without becoming chaotic.',
        ],
      },
      {
        heading: 'Design for sound-off viewing',
        paragraphs: [
          'Many people watch without sound. Clear, well-timed captions and on-screen text make your message understandable either way, and they keep viewers reading, which keeps them watching.',
        ],
      },
      {
        heading: 'Format for every platform',
        paragraphs: [
          'A single edit rarely fits everywhere. Reframe for vertical, adjust the length for each platform and keep key text inside safe zones, away from interface buttons. Small adjustments make content feel native rather than recycled.',
        ],
      },
    ],
  },
  {
    id: 'brand-more-than-a-logo',
    title: 'A brand is more than a logo: building a consistent visual identity',
    category: 'Branding',
    summary:
      'Recognition comes from consistency. The building blocks of a visual identity that works across your website, socials and ads.',
    date: '2026-07-28',
    cover: 'rings',
    coverImage: photos.articleBrand,
    body: [
      {
        paragraphs: [
          'A logo is often where branding starts, but it is rarely what makes a brand recognizable. Recognition comes from consistency: the same colours, typography, tone and visual style showing up everywhere your audience meets you.',
        ],
      },
      {
        heading: 'Define the core system',
        paragraphs: [
          'A practical identity includes a logo suite for different spaces, a colour palette with clear roles, one or two typefaces and rules for imagery and layout. Together, these make it easy to create new material that still feels unmistakably yours.',
        ],
      },
      {
        heading: 'Design for real use',
        paragraphs: [
          'Your identity has to work in a tiny social avatar, a website header, a printed menu and a vertical video. Test it in those contexts early. A design that only looks good in a presentation deck is not finished.',
        ],
      },
      {
        heading: 'Write it down',
        paragraphs: [
          'Simple brand guidelines save hours of guesswork. Document how to use the logo, which colour combinations are approved and how headlines and body text should look. Templates for common needs — social posts, ads, presentations — help everyone stay consistent.',
        ],
      },
      {
        heading: 'Evolve, don’t restart',
        paragraphs: [
          'Strong brands evolve gradually. As your business grows, refine the system rather than reinventing it. Every consistent touchpoint adds to the recognition you have already built.',
        ],
      },
    ],
  },
  {
    id: 'digital-product-trends',
    title: 'Five digital product trends worth paying attention to',
    category: 'Technology',
    summary:
      'Not every trend deserves your budget. Five shifts in how digital products are designed and built that genuinely matter for growing brands.',
    date: '2026-07-14',
    cover: 'blocks',
    coverImage: photos.articleTrends,
    body: [
      {
        paragraphs: [
          'New tools and buzzwords appear every month. Most can be safely ignored, but a few shifts are changing what customers expect from websites and apps. These are the ones worth understanding.',
        ],
      },
      {
        heading: 'AI as a feature, not a gimmick',
        paragraphs: [
          'The most useful AI features are quiet: smarter search, helpful summaries, assisted forms and relevant recommendations. Start with a real user problem and use AI where it genuinely removes friction.',
        ],
      },
      {
        heading: 'Performance as a brand signal',
        paragraphs: [
          'Users have little patience for slow experiences. Fast loading, smooth interactions and reliable offline behaviour now shape how people judge a brand’s quality, often before they read a word.',
        ],
      },
      {
        heading: 'Motion with purpose',
        paragraphs: [
          'Thoughtful animation guides attention, explains changes and makes interfaces feel responsive. The key is restraint: motion should support content, respect reduced-motion preferences and never block what users came to do.',
        ],
      },
      {
        heading: 'Accessibility by default',
        paragraphs: [
          'Accessible design — readable contrast, keyboard support, clear structure — makes products better for everyone and widens your audience. It is far easier to build it in from the start than to retrofit it later.',
        ],
      },
      {
        heading: 'Owned channels',
        paragraphs: [
          'As advertising costs fluctuate, brands are investing in channels they control: fast websites, email, communities and content. Paid campaigns work best when they lead people somewhere worth staying.',
        ],
      },
    ],
  },
];

export const featuredArticle = articles.find((a) => a.featured) ?? articles[0];
export const secondaryArticles = articles.filter((a) => a.id !== featuredArticle.id).slice(0, 3);
export const articleCategories = Array.from(new Set(articles.map((a) => a.category)));
