# Wolvo — Freelance Digital Agency Website

A premium, motion-driven single-page website for **Wolvo**, built from the four project
specs in this folder (PRD, TRD, Screen Flow, and the UI/UX Design System in `design.md`).
Night (default) and Day themes, brand palette of blue, cyan, deep navy, black, white and neutrals
— no purple/violet anywhere, including imagery.

**Page flow:** Navbar → Hero → About → Services (+ How we work) → Tech Stack → Projects → Blog/Articles → Client Reviews → Final CTA → Footer

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 + TypeScript |
| Styling | Plain CSS with design tokens (`src/styles/tokens.css`), co-located component CSS |
| Animation | GSAP 3 + ScrollTrigger + SplitText (via `@gsap/react` `useGSAP`) |
| Smooth scroll | Lenis, driven by the GSAP ticker (disabled for reduced motion) |
| Icons | Lucide (outline, 1.85px stroke) + custom outline social icons |
| Forms | React Hook Form (lazy-loaded with the inquiry dialog) |
| Font | Inter Variable with optical sizing (self-hosted via Fontsource) |

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to /dist
npm run preview    # serve the production build
npm run lint
npm test           # unit tests (utilities + content integrity)
npm run render     # render the fallback service artwork from assets/renders → assets/renders/out
npm run images     # optimize photos (brand + stock), rendered artwork, logo mark, favicons, OG image → public/
npm run logos      # copy the official tech-stack marks from simple-icons into src/data/techLogos.ts
```

Copy `.env.example` to `.env` and set:

- `VITE_SITE_URL`: production domain (canonical, Open Graph, `sitemap.xml`, `robots.txt`).
- `VITE_CONTACT_EMAIL`: public contact address.
- `VITE_CONTACT_ENDPOINT`: optional JSON form endpoint (Formspree, Basin, serverless function…).
  Without it, the inquiry form opens the visitor's email client with the message prefilled.
- `VITE_WHATSAPP_NUMBER`: number for the floating WhatsApp button, in international format.

## Project structure

```
src/
  animations/   gsap.ts (plugins, media queries), reveal.ts (reusable reveals), smoothScroll.ts (Lenis, anchors, scroll lock)
  components/
    layout/     Navbar (+ mobile menu), Footer
    sections/   Hero, About (+ founders), Services (+ process), Projects, Articles, Testimonials, FinalCTA
    dialogs/    Inquiry form, project detail, article reader, filterable indexes (code-split)
    ui/         Button, Modal, SectionHeading, Logo, Picture, SocialIcon, CarouselControls, StatusPill
    visuals/    Illustrated project mockups, service previews, generative article covers
  context/      UIContext (dialog state; stable actions)
  data/         All editable content (typed)
  hooks/        useSectionMotion, useMagnetic, useActiveSection, useCarousel, useMediaQuery, useStickyValue
  lib/          URL validation, formatting, contact submission, analytics hook
  styles/       tokens.css (both themes), base.css, components.css, modal.css
assets/brand/   Source artwork: official logo, hero/studio photos, CTA waves
assets/stock/   Unsplash source photos for service cards and article covers (SOURCES.md)
assets/renders/ HTML source for the fallback service artwork (rendered by scripts/render-assets.mjs)
public/         Generated images, logo mark, favicons, OG image, manifest
scripts/        optimize-images.mjs
```

## Theming

All colours are tokens in `src/styles/tokens.css`; components never hardcode theme colours.

- `[data-theme='light']` on `<html>` switches to Day mode. An inline script in `index.html` applies
  the saved choice before first paint; `ThemeContext` crossfades changes with the View Transitions API.
- `.theme-dark` re-declares the Night tokens on one element. Use it for surfaces that stay dark in
  both themes (hero stage, photo captions, project mockups, final CTA panel).
- Translucent hairlines and overlays use `rgb(var(--ink) / α)`; fades into the page use
  `rgb(var(--bg-rgb) / α)`, so both follow the theme automatically.

## Motion

`useSectionMotion(ref, setup, { intro, reveals })` is the single entry point:

- `intro` and `data-reveal` entrances play once per page view and depend only on the
  reduced-motion preference — resizing never restarts them.
- `setup` holds layout-specific effects (scroll scrubs, the pinned project rail, pointer
  parallax) and re-runs when the desktop / fine-pointer breakpoints change.
- Ambient loops (hero badge float, CTA glow drift) run only while their section is on screen;
  the badge float is a CSS animation on `translate`, so it never competes with GSAP transforms.

## Images

- **Photos** — service cards and article covers use Unsplash photos (free commercial licence),
  self-hosted. Sources live in `assets/stock/` (see `SOURCES.md` there); `npm run images` crops
  them to 16:10 around a focal point (`STOCK` in `scripts/optimize-images.mjs`), pulls any
  purple toward the brand blue and writes AVIF/WebP/JPEG at responsive widths.
- **Fallbacks** — `Picture` never shows a broken image: service cards fall back to rendered
  artwork (`assets/renders/services.html`, built with `npm run render`), article covers to their
  generated cover art.
- **How we work** — line icons with a brand gradient stroke in glass tiles (no image files).

**Tech logos** are the official marks from simple-icons, shown single-colour (several official brand
colours are purple or black, outside the Wolvo palette). Adobe app icons aren't distributed there at
Adobe's request and Adobe restricts third-party use, so Adobe tools are listed by name only.

## Editing content

All copy and data live in `src/data/`. No component needs to change to update content.

| File | What it controls |
| --- | --- |
| `site.ts` | Email, availability label, social profiles, inquiry budget/timeline options |
| `navigation.ts` | Nav and footer links |
| `services.ts` | The six service cards (copy, deliverables, photo + alt text) |
| `techStack.ts` | Tech Stack groups and tools (logos come from `techLogos.ts`, generated by `npm run logos`) |
| `about.ts` | Proof points, stats, the four process steps |
| `projects.ts` | Portfolio (set `image` for a real screenshot and `href` for a live link) |
| `articles.ts` | Blog posts (reading time is calculated automatically) |
| `founders.ts` | Founder and Co-Founder |
| `testimonials.ts` | Client reviews (`rating` is only shown when provided) |

### ⚠️ Placeholders to replace before launch

The specs forbid inventing clients, reviews, founder details or results, so these are clearly
marked placeholders:

- **Founders** (`founders.ts`): names, bios, photos and social links.
- **Testimonials** (`testimonials.ts`): use genuine reviews only, with permission.
- **Projects** (`projects.ts`): sample projects with illustrated mockups. Add real screenshots and
  URLs and remove `placeholder: true` (this also removes the "sample project" note in the dialog).
- **Contact email, WhatsApp number, domain and social profiles** (`site.ts` / `.env`).
- **Stats** (`about.ts`): currently structural facts (5 services, 4-step process…). Swap in
  verified numbers such as projects delivered once available.

## Notes on the specs

- The PRD's *Process*, *Why Wolvo* and *Founders* sections are kept but placed inside the
  Screen Flow's order: proof points and founders sit in **About** (per Design System §17), and the
  process timeline closes **Services**.
- "View All Projects / Articles" open filterable full-screen indexes; project and article cards
  open detail dialogs. Detail routes (`/work/:slug`, `/articles/:slug`) can be added later without
  changing the data model.
- Motion: pinned horizontal project rail, line reveals, clip-path image reveals, count-up stats,
  a scroll-driven process line, hero parallax, magnetic CTAs and a brand cursor on desktop. Touch
  devices get native scroll-snap carousels and the system cursor, and `prefers-reduced-motion`
  disables all of it.
