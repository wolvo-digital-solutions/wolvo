# MAIN CLAUDE CODE BUILD PROMPT — WOLVO

Read all files in:
- `docs/PRD.md`
- `docs/TRD.md`
- `docs/WEBSITE_FLOW.md`
- `docs/ANIMATION_SPEC.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/CONTENT.md`
- `docs/ASSET_MANIFEST.md`
- `config/TECH_STACK.md`

Read `CLAUDE.md` before doing anything.

## Task

Build the WOLVO company website as a premium 3D scroll-animated experience.

WOLVO services:
- App Development
- Web Development
- Video Editing
- Graphic Designing
- Advertising Management
- Social Media Management

Known metric:
10+ happy clients.

## Brand

Use the supplied WOLVO logo as the exact visual source of truth.

Colors:
- midnight navy
- WOLVO blue gradient
- bright cyan-blue highlights
- white

Do not redesign the logo.

## Main technical requirements

Use:
- Next.js
- React
- TypeScript
- Tailwind
- Three.js
- React Three Fiber
- Drei
- GSAP
- ScrollTrigger
- Lenis

## Core experience

The page must use a continuous scroll narrative:

HERO
→ TRUST
→ SERVICES
→ CAPABILITIES
→ WORK
→ PROCESS
→ ABOUT
→ FOUNDERS
→ TECHNOLOGY
→ TESTIMONIALS
→ GLOBAL VISION
→ FINAL CTA
→ FOOTER

## Hero

Build a cinematic wolf scene.

The wolf:
- metallic
- silver
- blue crystalline sections
- WOLVO blue/cyan lighting
- dark midnight environment

Hero motion:
wolf still
→ eyes glow
→ energy activates
→ geometric decomposition
→ W formation
→ WOLVO symbol reveal

Use supplied animation frames/video if available.

Do not create a fake logo with text generation.

## Scroll animation

The page must feel 3D and cinematic.

Use ScrollTrigger to coordinate:
- camera movement
- hero transformation progress
- service visual transitions
- portfolio depth
- process line
- global globe

Use pinned scenes where appropriate.

## Services

Build all six services:
1. App Development
2. Web Development
3. Video Editing
4. Graphic Designing
5. Advertising Management
6. Social Media Management

Each service should have:
- title
- description
- visual
- CTA

Use a consistent visual system.

## Work

Create a case-study section using only real supplied project information.

Place obvious placeholders where information is missing.

## About + founders

Use editable real company information.

Do not fabricate history or biographies.

Use actual founder/co-founder photos when supplied.

## Technology

Show only technologies the company actually uses.

## Testimonials

Use real testimonials only.

## Global vision

Use a subtle cinematic 3D globe representing WOLVO's global ambition.

Do not falsely claim global operations.

## Contact

Create a clear enquiry flow.

Recommended fields:
- Name
- Company
- Email
- Project Type
- Budget optional
- Message

## Performance

The 3D site must remain usable.

Implement:
- lazy loading
- compressed assets
- dynamic imports
- responsive DPR
- mobile fallback
- reduced particle count
- reduced motion support

## Verification

After each phase:
- run the app
- open with Playwright MCP if available
- scroll through the actual website
- verify visual behavior
- inspect console
- test mobile
- fix errors
- retest

## Process

DO NOT build all sections in one huge uncontrolled step.

Build phases:

Phase 0 — inspect existing project

Phase 1 — app shell + design system

Phase 2 — hero 3D scene + scroll choreography

Phase 3 — services

Phase 4 — portfolio

Phase 5 — process + about + founders

Phase 6 — technology + testimonials + global vision

Phase 7 — final CTA + footer

Phase 8 — responsive/performance/accessibility

Phase 9 — SEO/final QA

At the end of each phase provide:
- changed files
- what was implemented
- what was tested
- what remains
