WOLVO --- UI/UX DESIGN SYSTEM

Visual Design Specification • Colors • Typography • Icons • Components •
Layout • Interaction

Purpose: Define the complete visual language for Wolvo's modern
freelance digital-agency website. The design must communicate
technology, creativity, quality, and trust while remaining clear and
easy for clients to understand.

## 1. Design Direction

Wolvo should look like a premium modern digital studio/freelance
technology agency---not an animal-themed brand, not an overly corporate
IT company, and not a generic SaaS template.

-   Modern

-   Premium

-   Creative

-   Technology-focused

-   Confident

-   Minimal in structure but visually rich

-   Easy for a potential client to scan

-   Strong typography and imagery

-   Subtle motion instead of excessive animation

## 2. Brand Personality

-   Creative --- shows design and visual thinking.

-   Technical --- communicates development capability.

-   Professional --- suitable for serious business clients.

-   Approachable --- feels like a freelance team rather than a huge
    corporation.

-   Modern --- contemporary layouts, motion, and technology visuals.

-   Result-oriented --- focus on what Wolvo can build or improve for
    clients.

## 3. Color System

### Primary Palette

-   Background / Black: #07090D --- main page background.

-   Surface: #0D1118 --- cards, panels, navigation surfaces.

-   Surface Elevated: #121824 --- elevated cards and modal-style areas.

-   Primary Text: #F5F7FA --- main headings and important text.

-   Secondary Text: #A6AFBC --- descriptions and supporting content.

-   Muted Text: #6F7885 --- metadata and low-priority labels.

-   Border: #202733 --- subtle borders/dividers.

### Accent Palette

-   Brand Blue: #0066FF --- primary brand/action accent (from the Wolvo logo).

-   Sky Blue: #38BDF8 --- hover/highlight state on dark surfaces.

-   Deep Blue: #0052CC --- gradient depth, hover state on light surfaces.

-   Brand Cyan: #00D2FF --- secondary gradient accent (from the Wolvo logo).

-   Deep Navy: #050A18 --- dark brand surfaces, app-icon tiles.

-   **Purple and violet are not part of the palette.** Do not use them in
    UI, illustrations, gradients or imagery (source photos are hue-corrected
    by `npm run images`).

-   Success Green: #32C48D --- success/status only.

-   Warning: #F5B942 --- warning/status only.

-   Error: #FF5C67 --- error state only.

### Recommended Gradients

-   Primary: #0066FF → #00D2FF (button fills use a deeper #0058E6 → #0082CC
    for white-label contrast).

-   Soft Glow: rgba(0,102,255,0.16) → transparent.

-   Hero Glow: deep navy → blue/cyan radial glow.

-   Do not apply gradients to every component; reserve them for hero,
    CTA, highlights, and selected visual elements.

### Day (light) theme

Both themes are defined as tokens in `src/styles/tokens.css`; components
never hardcode theme colours. Use `rgb(var(--ink) / a)` for translucent
hairlines/overlays and `rgb(var(--bg-rgb) / a)` for fades into the page.
Surfaces that are intentionally dark in both themes (hero stage, photo
captions, project mockups, final CTA panel) carry the `.theme-dark` class.

### Color Usage Ratio

-   Approximately 70--80% dark neutral surfaces/backgrounds.

-   Approximately 15--20% white/gray typography and neutral UI.

-   Approximately 5--10% blue/cyan accent.

## 4. Typography System

### Primary Font

Recommended: Inter. Alternative: Manrope or Geist if the final visual
requires a more distinctive geometric feel.

-   Use one primary font family throughout the website.

-   Avoid mixing many font families.

-   Use font-weight rather than decorative fonts to create hierarchy.

### Desktop Type Scale

-   Hero Display: 72--96px, weight 600--700, line-height 0.95--1.05.

-   H1 Section Heading: 52--68px, weight 600--700.

-   H2: 36--48px, weight 600--700.

-   H3/Card Heading: 22--28px, weight 600.

-   Body Large: 18--20px, line-height 1.5.

-   Body: 16--18px, line-height 1.55.

-   Small/Metadata: 12--14px, weight 500.

-   Eyebrow/Label: 11--13px, uppercase, letter spacing 0.08--0.14em.

### Responsive Typography

-   Use CSS clamp() for major headings.

-   Hero heading should scale down smoothly on tablet/mobile.

-   Never allow headings to overflow the viewport.

-   Maintain readable body text on mobile.

## 5. Logo / Wordmark

-   Primary logo: Wolvo wordmark.

-   Preferred presentation: clean white/light wordmark on dark
    background.

-   Accent version may use blue highlight only where appropriate.

-   Do not make the wolf/animal the main website visual language.

-   Logo should remain simple and recognizable at small sizes.

-   Use SVG for production.

## 6. Icon System

### Icon Style

Use a consistent outline icon family with clean geometric construction.

-   Recommended library: Lucide Icons.

-   Stroke width: approximately 1.75--2px.

-   Rounded line caps and joins.

-   Default icon color: #A6AFBC.

-   Active/hover icon: #69A7FF.

-   Do not mix filled, cartoon, 3D, and outline icons randomly.

### Service Icons

-   Web Development: Monitor / Code2 icon.

-   App Development: Smartphone icon.

-   Meta Ads: Megaphone / TrendingUp / Target icon.

-   Video Editing: Clapperboard / PlaySquare icon.

-   Branding & Design: PenTool / Palette icon.

### UI Icons

-   ArrowRight --- CTA buttons.

-   ArrowUpRight --- external/project links.

-   Menu --- mobile navigation.

-   X --- close menu.

-   ChevronDown --- dropdowns.

-   Mail --- email/contact.

-   LinkedIn, Instagram, X, GitHub --- social links where used.

## 7. Layout System

### Container

-   Maximum content width: approximately 1200--1280px.

-   Desktop horizontal padding: 40--64px.

-   Tablet: 28--40px.

-   Mobile: 20--24px.

-   Keep text blocks narrower than the overall container for
    readability.

### Grid

-   Desktop: 12-column grid.

-   Tablet: 8-column grid.

-   Mobile: 4-column conceptual grid / single-column content.

-   Use CSS Grid for major page layouts.

-   Use Flexbox for navigation, button groups, and smaller component
    layouts.

### Spacing

-   Use a consistent 4px/8px-based spacing system.

-   Small: 8px.

-   Medium: 16px.

-   Large: 24px.

-   XL: 32px.

-   Section spacing: approximately 120--180px desktop depending on
    content.

-   Mobile section spacing: approximately 72--100px.

## 8. Border & Radius System

-   Default border: 1px solid #202733.

-   Highlighted border: rgba(76,141,255,0.45).

-   Card radius: 18--24px.

-   Large feature visual radius: 24--32px.

-   Button radius: 10--14px.

-   Avoid excessive pill-shaped UI except tags/badges.

-   Use borders more than heavy shadows.

## 9. Shadow & Glow System

-   Default shadow: subtle, soft, low-opacity black.

-   Card hover: small blue ambient glow.

-   CTA hover: blue/cyan glow.

-   Do not use large bright neon shadows everywhere.

-   Glow should support hierarchy, not dominate the design.

## 10. Navigation UI

### Desktop

-   Transparent/dark navigation over the hero.

-   Logo on left.

-   Navigation links centered/right.

-   CTA on far right.

-   After scrolling: semi-transparent dark surface with backdrop blur
    and subtle border.

### Mobile

-   Logo left.

-   Menu button right.

-   Full-screen or large dark navigation panel.

-   Large, easily tappable links.

-   CTA at the bottom of the menu.

-   Animated menu open/close using GSAP or a lightweight transition.

## 11. Hero UI Design

-   Large left-aligned headline.

-   Small eyebrow above heading.

-   Short paragraph below heading.

-   Two CTA buttons.

-   Right-side premium technology visual on desktop.

-   Stacked layout on mobile.

-   Use subtle blue/cyan ambient glow behind the visual.

-   No animal imagery as the primary hero visual.

### Hero Buttons

-   Primary: blue gradient or solid electric blue.

-   Primary text: white.

-   Secondary: transparent/dark with 1px border.

-   Hover: slight translateY(-2px), border/glow change, arrow movement.

-   Desktop primary CTA may use a subtle magnetic effect.

## 12. About Section UI

-   Editorial two-column layout.

-   Large heading on one side.

-   Agency description on the other.

-   Large supporting image or abstract technology visual.

-   Stats can appear below or alongside the content.

-   Use large numbers with small labels.

-   Avoid turning the section into a dense corporate information block.

## 13. Services UI

### Card Design

-   Dark surface slightly lighter than page background.

-   1px subtle border.

-   Large service number such as 01, 02, 03.

-   Outline service icon.

-   Service title.

-   Short 1--2 sentence description.

-   Relevant small visual or abstract graphic.

-   Arrow CTA.

### Service Hover

-   Card moves upward 4--8px.

-   Border becomes blue.

-   Icon moves/scales slightly.

-   Image/visual shifts subtly.

-   Arrow moves toward the right.

-   Background glow appears very subtly.

## 14. Projects UI

### Project Card

-   Large image/mockup is the main visual.

-   Project title below/over image.

-   Category tag.

-   Short description.

-   View Project arrow.

-   Optional technology/service tags.

### Project Interaction

-   Image scale: approximately 1.00 → 1.05.

-   Dark overlay appears on hover.

-   Project information slides/fades in.

-   Cursor-follow 'View Project' can be used on desktop.

-   Mobile uses normal tap behavior.

## 15. Blog / Article UI

-   Clean editorial cards.

-   Large cover image.

-   Small category label.

-   Title with strong typography.

-   Date + reading time.

-   Short summary.

-   Arrow link.

-   Use slightly lighter cards than service cards to distinguish
    content.

## 16. Client Reviews UI

-   Large quotation mark or subtle quote icon.

-   Client testimonial in 18--24px typography.

-   Client avatar.

-   Name and role/company.

-   Five-star rating only when genuine.

-   Use a grid or controlled carousel depending on number of reviews.

-   Keep the section calm and trustworthy; avoid flashy effects.

## 17. Founder / Team UI

If founder information is shown on the homepage, keep it within About or
immediately after About rather than making it dominate the main flow.

-   Large professional portrait.

-   Name.

-   Role.

-   Short biography.

-   Social links.

-   Editorial layout rather than corporate employee cards.

-   Image hover: subtle zoom and gradient overlay.

## 18. Final CTA UI

-   Full-width premium dark section.

-   Large headline.

-   Short supporting message.

-   Large Start a Project button.

-   Blue/cyan ambient gradient.

-   Optional subtle animated light/noise texture.

-   High visual contrast so the CTA feels like the conclusion of the
    journey.

## 19. Footer UI

-   Large Wolvo logo/wordmark.

-   Short agency statement.

-   Navigation columns.

-   Services column.

-   Contact column.

-   Social icons.

-   Small legal/copyright row.

-   Keep footer visually clean and less animated than the rest of the
    site.

## 20. Motion Design Language

-   Motion should feel smooth, intentional, and premium.

-   Primary animation engine: GSAP + ScrollTrigger.

-   Use opacity + transform for most reveals.

-   Use staggered entrances for cards.

-   Use clip-path reveals for selected images.

-   Use parallax sparingly.

-   Use hover motion for interactive components.

-   Use magnetic buttons only on desktop.

-   Avoid constant bouncing, rotating, flashing, or excessive particle
    effects.

-   Respect prefers-reduced-motion.

### Suggested Timing

-   Micro interaction: 150--250ms.

-   Button/card hover: 200--350ms.

-   Standard reveal: 600--900ms.

-   Large hero animation: 900--1400ms.

-   Stagger: 80--150ms between elements.

## 21. Image & Visual Direction

-   Use premium real-world technology/product visuals.

-   Laptop and mobile app mockups.

-   Website screenshots.

-   Advertising dashboards/creative previews.

-   Video editing timelines/previews.

-   Abstract digital gradients.

-   Creative studio/workspace photography.

-   Avoid generic handshake/corporate stock photography.

-   Avoid animal rescue, wildlife, wolf photography, or animal
    illustrations as the website's primary imagery.

## 22. Background Treatment

-   Base background should remain dark and calm.

-   Use subtle radial blue/cyan gradients behind selected sections.

-   Use thin grid/noise texture only at very low opacity.

-   Optional moving light spot in hero/CTA.

-   Do not create a busy futuristic sci-fi background across every
    section.

## 23. Buttons

-   Primary button: electric blue / blue-to-cyan gradient.

-   Secondary button: transparent with border.

-   Text: 14--16px, weight 600.

-   Height: approximately 46--54px desktop.

-   Mobile: minimum 44px touch target.

-   Include ArrowRight icon where appropriate.

-   Hover: translateY(-2px), glow, arrow movement.

-   Focus: visible outline/ring.

## 24. Badges & Tags

-   Small dark surface.

-   1px border.

-   12--13px text.

-   Rounded 8--10px.

-   Used for project categories, technologies, or service labels.

-   Do not overuse badges.

## 25. Responsive UI Rules

-   Desktop: maximum visual richness.

-   Tablet: simplify multi-column layouts.

-   Mobile: single-column priority content.

-   Hero visual moves below text.

-   Services become vertical cards.

-   Projects become vertical cards or horizontal swipeable cards.

-   Articles become vertical cards.

-   Testimonials become swipeable/stacked.

-   Navigation becomes mobile menu.

-   Remove mouse-only interactions on touch devices.

## 26. Accessibility UI Rules

-   Maintain WCAG-conscious contrast.

-   Never communicate meaning by color alone.

-   Visible keyboard focus.

-   Buttons must look and behave like buttons.

-   Links must look and behave like links.

-   All meaningful images require alt text.

-   Decorative visuals should not interfere with screen readers.

-   Respect reduced-motion preferences.

## 27. Design Tokens

Create CSS variables/design tokens so the complete visual system can be
changed from one place.

-   --color-bg

-   --color-surface

-   --color-surface-elevated

-   --color-text

-   --color-text-muted

-   --color-border

-   --color-primary

-   --color-primary-hover

-   --color-secondary

-   --radius-sm

-   --radius-md

-   --radius-lg

-   --shadow-sm

-   --shadow-glow

-   --container-width

-   --section-spacing

-   --font-family

## 28. Final Visual Rule

The website must feel like a modern creative technology agency that
happens to be a freelance team. The design should immediately
communicate Web Development, App Development, Meta Ads, Video Editing,
and creative digital services. It should be attractive through
typography, composition, imagery, color accents, interaction, and
motion---not through unnecessary visual clutter.

## 29. Final UI/UX Checklist

-   Modern dark agency aesthetic.

-   Consistent blue/cyan accent system.

-   Inter/Manrope/Geist typography.

-   Lucide-style outline icons.

-   12-column desktop grid.

-   Strong spacing system.

-   Consistent card radius and borders.

-   Premium technology imagery.

-   Clear CTA hierarchy.

-   GSAP-powered motion.

-   Responsive mobile design.

-   Accessible interaction states.

-   No animal-rescue/wolf-themed visual direction.

-   No generic corporate template appearance.

-   Clear client-focused messaging.

End of UI/UX Design System --- WOLVO
