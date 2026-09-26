# WOLVO Website — Technical Requirements Document (TRD)

## 1. Architecture

Recommended:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Three.js
- React Three Fiber
- @react-three/drei
- GSAP
- GSAP ScrollTrigger
- Lenis

Optional only when justified:
- @react-three/postprocessing
- compressed GLB/GLTF tooling
- image optimization packages

## 2. Application architecture

Suggested structure:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── contact/
│           └── route.ts
├── components/
│   ├── layout/
│   ├── sections/
│   ├── 3d/
│   ├── motion/
│   └── ui/
├── data/
│   ├── services.ts
│   ├── projects.ts
│   ├── founders.ts
│   └── testimonials.ts
├── lib/
│   ├── motion.ts
│   ├── three.ts
│   ├── utils.ts
│   └── validation.ts
└── types/
    └── index.ts
```

Public assets:

```text
public/
├── assets/
│   ├── branding/
│   ├── 3d/
│   ├── video/
│   ├── video-frames/
│   ├── founders/
│   ├── projects/
│   └── icons/
└── fonts/
```

## 3. Hero 3D implementation

Use React Three Fiber.

Core objects:
- Wolf GLB
- camera
- lights
- particle system
- environment
- floor/reflection plane if needed

Requirements:
- lazy-load 3D scene
- avoid blocking the initial HTML render
- support fallback visual

## 4. Wolf → W transition

Recommended approaches in order:

### Approach A — pre-rendered frame sequence/video
Use supplied video/animation frames if they already communicate the transition accurately.

Best for:
- exact logo appearance
- predictable cinematic motion
- lower implementation complexity

### Approach B — 3D model morph/decomposition
Use only if an actual rigged/modelled asset is available and the geometry supports controlled transformation.

Do not fake a precise logo morph from an unrelated model.

## 5. Scroll choreography

Use one master experience timeline conceptually divided into chapters:

- Hero
- Services
- Work
- Process
- About
- Founders
- Technology
- Testimonials
- Global vision
- Final CTA

Use `ScrollTrigger` with:
- `scrub`
- `pin`
- timelines
- progress callbacks where necessary

Avoid excessive independent triggers.

## 6. Lenis integration

Use Lenis for smooth scroll behavior.

Keep Lenis and GSAP timing synchronized.

Ensure:
- touch scrolling works
- anchor links work
- browser refresh/restore remains usable

## 7. Mobile fallback

Mobile should use:
- lower DPR where necessary
- fewer particles
- lower model complexity
- simplified post-processing
- image/video fallback if needed

Never make the user wait indefinitely for a heavy WebGL scene.

## 8. Performance budget

Targets:
- minimize blocking JavaScript
- lazy-load heavy 3D
- compress all assets
- avoid oversized textures
- avoid unnecessary re-renders
- dispose of Three.js resources

Measure with:
- browser performance tools
- Lighthouse where practical
- real device testing

## 9. Accessibility

Implement:
- keyboard support
- focus states
- semantic headings
- button labels
- reduced motion
- text alternatives for major visual-only content

## 10. SEO

Include:
- metadata
- title
- description
- OG image
- canonical URL
- sitemap
- robots
- semantic structure

## 11. Contact form

Use server-side validation.

Do not expose private keys in client code.

Possible email providers:
- Resend
- existing company backend
- another approved transactional mail provider

Use whichever WOLVO chooses.

## 12. Browser QA

Use Playwright MCP if available.

Test:
- initial page load
- menu/navigation
- scrolling
- service interactions
- portfolio interactions
- form validation
- form submission
- reduced motion
- mobile viewport
- console errors
- WebGL failure path

## 13. Error handling

If 3D asset fails:
- show poster/image fallback
- log the error
- preserve content access

If animation frame sequence fails:
- show a static hero image or short video fallback

## 14. Security

- validate all form inputs
- rate-limit enquiry endpoint
- sanitize user-provided fields
- protect server credentials
- use environment variables
- do not commit `.env` files

## 15. Deployment

Preferred:
- Vercel or another production host compatible with Next.js

Before deployment:
- build succeeds
- no obvious console errors
- contact flow tested
- metadata reviewed
- mobile reviewed

## 16. Code quality

Prefer:
- typed interfaces
- reusable components
- small modules
- data-driven content
- clear naming
- minimal duplication
