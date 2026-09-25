# WOLVO — website

Official site for WOLVO, a digital technology & creative studio. A single-page, scroll-driven 3D experience:
**Wolf → energy → geometric decomposition → W → WOLVO**, then services, work, process, people, technology,
global vision and contact.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Three.js / React Three Fiber / drei ·
GSAP + ScrollTrigger · Lenis · zod.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

Copy `.env.example` → `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (metadata, OG, sitemap, robots) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Enquiry delivery via Resend. Unset → dev logs the enquiry; production returns 503 with a friendly message |

## Motion preview

The site respects `prefers-reduced-motion`. Windows with *Settings → Accessibility → Animation effects* **off**
reports reduced motion, which shows the calm static version. To preview the full experience regardless, append
`?motion=full` (or `?motion=reduced` to force the calm version).

## Assets

- `source-assets/` — originals (logo PNG, `hero_section_2_frames.zip`; the zip is git-ignored).
- `npm run assets` regenerates everything in `public/assets/` and the app icons / OG image:
  - hero sequence → `public/assets/video-frames/hero/{lg,sm}/frame_NNNN.webp` (240 frames @1600w ≈ 8.4 MB; 121 frames @900w ≈ 1.9 MB)
  - logo → `public/assets/branding/wolvo-symbol*.{png,webp}` (background removed, geometry and colour untouched)

## Content still to be supplied

Everything below is rendered as a visible dashed `[… — TO BE PROVIDED]` placeholder. Edit the data files — no
component changes needed:

| What | Where |
| --- | --- |
| Real case studies (name, client, description, outcome, image, link) | `src/data/projects.ts` |
| Founder & co-founder names, photos (`public/assets/founders/*.webp`), bios, links | `src/data/founders.ts` |
| Client testimonials (approved) | `src/data/testimonials.ts` |
| Verified technology stack (set `verified: true`) | `src/data/technologies.ts` |
| Contact email, location, social URLs | `src/data/company.ts` |
| Mission statement, founding year | `src/components/sections/About.tsx` |
| Budget ranges for the form | `src/lib/validation.ts` |
| Official vector logo / wordmark (SVG) | `public/assets/branding/` → swap in `src/components/ui/Logo.tsx` |

Draft copy written only from the supplied positioning (service descriptions, capability/process steps, about
pillars, vision line) should be approved by the WOLVO team.

## Structure

```
src/
  app/                 layout, page, globals.css, api/contact, sitemap, robots, icons
  components/
    layout/            Navbar, Footer, Preloader
    sections/          Hero, Trust, Services, Capabilities, Work, Process, About, Founders,
                       Technology, Testimonials, GlobalVision, FinalCta
    3d/                ServicesScene, GlobeScene, StudioLights, Particles, SceneMount
    motion/            ExperienceProvider (capabilities + Lenis⇄ScrollTrigger), PageMotion (reveals, anchors)
    ui/                Button, Logo, SectionHeading, Placeholder, ContactForm
  data/                company, services, projects, founders, testimonials, technologies
  lib/                 gsap, frameSequence, validation, loading, site, utils
scripts/               build-assets, qa-shots, qa-form, qa-interactions
```

## Performance & fallbacks

- Hero: 2D canvas frame sequence, coarse-to-fine loading (every 16th frame first), small set on mobile/low DPR.
- 3D scenes are dynamically imported, mounted only near the viewport, paused off-screen, unmounted when far away.
- Tiers (`high` / `mid` / `low`) reduce particles, DPR and pinned choreography; phones get stacked layouts.
- No WebGL → SVG/glyph fallbacks. Reduced motion → no Lenis, no scrubbing, static hero poster.

## QA scripts (dev server running)

Uses `playwright-core` with the system Microsoft Edge — no browser download.

```bash
node scripts/qa-shots.mjs out 1440x900 "#top@0" "#services@0.5"   # screenshots + console errors
node scripts/qa-interactions.mjs                                  # nav anchors, mobile menu, no-WebGL path
node scripts/qa-form.mjs                                          # enquiry validation + submission
```
