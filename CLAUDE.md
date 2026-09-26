# WOLVO — CLAUDE CODE PROJECT RULES

## 1. Mission

You are building the official WOLVO company website.

WOLVO is a digital technology and creative studio providing:
1. App Development
2. Web Development
3. Video Editing
4. Graphic Designing
5. Advertising Management
6. Social Media Management

WOLVO currently has 10+ happy clients.

The site should present WOLVO as a premium, modern, trustworthy, globally minded digital studio.

## 2. Non-negotiable experience

This website must be a genuine 3D scroll-animated experience.

It must NOT become:
- a generic SaaS template
- a normal portfolio page with a few hover effects
- a page made entirely of static cards
- an animation showcase with weak business content

The correct balance is:
- business clarity first
- premium visual design
- 3D storytelling
- cinematic scroll choreography
- strong trust signals

## 3. Brand source of truth

Use the supplied WOLVO logo as the visual source of truth.

Do not redesign the logo.

Do not generate alternate logo geometry.

Do not create fake brand marks.

### Brand colors

The uploaded logo controls the exact color appearance.

Use the WOLVO blue gradient as the dominant accent:
- deep royal/electric blue
- saturated blue
- bright cyan-blue highlights

Reference approximations only:
- Midnight Navy: #030B1E
- Deep Blue: #0935CA
- Strong Blue: #0D79FD
- Bright Blue: #18ACFD
- Cyan Highlight: #1FCBFD
- White: #F7FAFF
- Muted Text: #9AA8BD

The uploaded logo remains the authority over these approximations.

Do not introduce purple, green, red, orange, or gold into the main brand system.

## 4. Design direction

Keywords:
- cinematic
- premium
- futuristic
- technological
- precise
- geometric
- elegant
- dark
- minimal
- sophisticated
- confident

Do not use:
- excessive neon
- over-glowing
- excessive glassmorphism
- random 3D objects
- cartoon graphics
- noisy backgrounds
- meaningless decorative motion

## 5. Typography

Preferred:
- Headings: Space Grotesk
- Body: Inter or Manrope

Typography should remain highly readable.

## 6. 3D direction

Primary 3D story:
Wolf → energy activation → geometric decomposition → W formation → WOLVO symbol.

Use:
- polished metal
- chrome/silver highlights
- translucent blue crystal/glass
- blue/cyan rim lighting
- dark reflective surfaces
- subtle particles
- subtle volumetric light

The wolf should feel:
- intelligent
- powerful
- elegant
- technologically advanced

Not:
- aggressive
- fantasy-heavy
- cartoonish

## 7. Scroll architecture

The main site is scroll-driven.

Use:
- GSAP
- ScrollTrigger
- Lenis
- React Three Fiber / Three.js

Prefer timelines with a clear start and end.

Do not attach hundreds of independent scroll listeners.

Use ScrollTrigger for:
- pinning
- scrub
- progress-based animation
- section transitions
- camera movement
- model transforms
- reveal sequences

Use Lenis for smooth page scrolling and keep it synchronized with ScrollTrigger.

## 8. Responsive strategy

Desktop:
- full 3D experience
- higher particle counts
- richer camera motion

Tablet:
- reduced particle counts
- reduced model complexity
- fewer expensive post effects

Mobile:
- simplify 3D aggressively
- prioritize readability and tap targets
- use video/image fallbacks where needed
- never let the WebGL scene block content access

The site must remain usable if WebGL performance is poor.

## 9. Asset rules

Use real supplied assets.

Do not invent:
- client logos
- testimonials
- awards
- client counts
- founder history
- business results
- technology claims

Use placeholders marked clearly when content has not yet been provided.

For animation frame sequences:
- use the supplied frames
- keep ordering deterministic
- preserve frame aspect ratio
- preload intelligently
- avoid loading the entire sequence at once on mobile unless performance is acceptable

## 10. Component architecture

Keep responsibilities separated.

Recommended:
- `components/layout/*`
- `components/sections/*`
- `components/3d/*`
- `components/motion/*`
- `components/ui/*`
- `lib/*`
- `data/*`
- `public/assets/*`

Avoid a single giant page component.

## 11. Recommended 3D structure

Example:

`WolvoHeroScene`
- `WolfModel`
- `Environment`
- `HeroLights`
- `Particles`
- `CameraRig`

`WolvoServicesScene`
- service model(s)
- environment
- camera controller

`WolvoGlobalScene`
- globe
- connection lines
- particles

## 12. Performance rules

Always consider:
- GLB compression
- texture size
- lazy loading
- dynamic imports
- model disposal
- GPU cost
- particle count
- post-processing cost
- mobile fallbacks

Avoid rendering large hidden 3D scenes.

Do not create expensive effects that do not improve the experience.

## 13. Accessibility

Maintain:
- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- alt text
- reduced motion support
- accessible labels
- logical heading hierarchy

Respect:
`prefers-reduced-motion`

When reduced motion is requested:
- remove aggressive scroll choreography
- reduce parallax
- reduce particle motion
- keep content fully accessible

## 14. SEO

Implement:
- metadata
- Open Graph
- canonical URL
- semantic headings
- descriptive page title
- description
- sitemap
- robots.txt
- structured content where appropriate

## 15. Development verification

After every major phase:

1. Start the development server.
2. Open the site in a browser using Playwright MCP if available.
3. Scroll through the entire site.
4. Test interactions.
5. Check console/runtime errors.
6. Test desktop.
7. Test mobile viewport.
8. Fix issues.
9. Retest.

Never claim a feature works without testing it.

## 16. Documentation

Before implementing a version-sensitive library/API:
- use Context7 when available
- verify current official documentation
- prefer official documentation over stale examples

## 17. Git discipline

Make focused commits.

Examples:
- `feat(hero): add cinematic wolf scene`
- `feat(motion): add scroll choreography`
- `feat(services): add 3d service sequence`
- `feat(work): add case-study transitions`
- `fix(mobile): reduce webgl load`
- `perf(3d): optimize hero assets`

## 18. Build order

Do not build everything in one pass.

Recommended:
Phase 0 — inspect project
Phase 1 — foundation/design system
Phase 2 — hero and wolf animation
Phase 3 — services
Phase 4 — work/case studies
Phase 5 — process/about/founders
Phase 6 — technology/testimonials/global vision
Phase 7 — final CTA/footer
Phase 8 — responsive/performance
Phase 9 — SEO/accessibility
Phase 10 — final QA

## 19. Definition of done

A phase is complete only when:
- UI is implemented
- animation is implemented
- responsive behavior is tested
- console errors are resolved
- accessibility is acceptable
- performance is considered
- supplied assets are used correctly
- no fake claims were introduced

## 20. Important content rule

If information is missing:
- use an obvious placeholder
- do not invent company facts

Examples:
`[FOUNDER NAME — TO BE PROVIDED]`
`[TESTIMONIAL — TO BE PROVIDED]`

Do not silently fabricate content.
