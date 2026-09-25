# WOLVO — CLAUDE PHASE PROMPTS

## Phase 0 — Inspect first

```text
Read CLAUDE.md and all docs in docs/.

Inspect the current project.

Do not modify files yet.

Return:
- current framework
- package.json
- current routes
- folder structure
- existing dependencies
- existing assets
- existing 3D assets
- existing animation code
- risks/conflicts
- proposed architecture

Use Context7 to verify current library guidance where appropriate.
```

## Phase 1 — Foundation

```text
Implement the WOLVO design foundation only.

Create:
- global colors
- typography
- spacing
- navbar
- section wrappers
- buttons
- reusable text reveal components
- page structure

Do not build advanced 3D yet.

Use the supplied WOLVO logo.

Keep content modular.

Test desktop and mobile.
```

## Phase 2 — Hero

```text
Build the WOLVO cinematic hero.

Use:
- React Three Fiber
- Three.js
- GSAP ScrollTrigger
- Lenis

Hero sequence:
still wolf
→ eyes glow
→ energy activates
→ geometric decomposition
→ W formation
→ WOLVO symbol reveal

Use supplied video/animation frames if available.

Do not invent a replacement logo.

Make the hero responsive and performant.

Use Playwright to test the actual browser experience.
```

## Phase 3 — Services

```text
Build the services chapter.

Six services:
App Development
Web Development
Video Editing
Graphic Designing
Advertising Management
Social Media Management

Create a pinned scroll sequence where the active service changes based on scroll progress.

Use one consistent 3D visual language.

Test desktop and mobile.
```

## Phase 4 — Work

```text
Build a cinematic case-study section.

Use real provided projects only.

Create:
- stacked depth cards
- image/video transitions
- project metadata
- service tags
- CTA

Do not fabricate results or clients.
```

## Phase 5 — Process / About / Founders

```text
Build:
- Process
- About
- Founder
- Co-Founder

Use:
- animated timeline
- real images when available
- subtle depth
- typography reveal

Do not fabricate biographies.
```

## Phase 6 — Technology / Testimonials / Global

```text
Build:
- technology stack
- testimonials
- global vision

Use:
- subtle motion
- 3D globe
- real testimonials
- verified technology list
```

## Phase 7 — Final CTA / Footer

```text
Build:
- final CTA
- contact flow
- footer

Bring the wolf visual language back into the final CTA.

Make the call to action obvious and accessible.
```

## Phase 8 — Quality

```text
Run full QA.

Test:
- desktop
- tablet
- mobile
- reduced motion
- keyboard navigation
- 3D failure fallback
- console errors
- animation smoothness
- contact form
- navigation
- page refresh
- deep links

Optimize anything causing poor performance.
```

## Phase 9 — SEO / final

```text
Implement:
- metadata
- OG tags
- sitemap
- robots
- semantic headings
- favicon
- accessibility labels

Then perform a final browser pass.
```
