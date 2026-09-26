# WOLVO — 3D + SCROLL ANIMATION SPEC

## Animation philosophy

Motion must support storytelling.

Use slow, deliberate movement.

Never animate just because a section can animate.

The visual language is:
- precise
- cinematic
- smooth
- controlled
- premium

## Hero timeline

### 0%–15%
Wolf still.
Subtle breathing.
Particles nearly invisible.

### 15%–30%
Eyes begin glowing.
Blue energy appears.

### 30%–50%
Energy moves through crystalline sections.

### 50%–70%
Geometric pieces begin separating.
Camera moves closer.

### 70%–90%
Fragments align into W geometry.

### 90%–100%
W symbol reaches final form.
Hold for readability.

## Scroll interaction

The hero can be pinned for part of the scroll.

Scroll progress should drive:
- camera position
- wolf rotation
- energy intensity
- fragment progress
- logo reveal

## Service animation

When a service enters:
- text opacity 0 → 1
- text y offset 24px → 0
- 3D visual rotates slightly
- camera drifts
- accent light follows progress

When service leaves:
- text fades
- visual exits
- next service becomes active

## Portfolio animation

Use stacked depth:
- current project front
- next project slightly behind
- previous project recedes

The transition should feel like moving through a 3D gallery.

## Process animation

A single glowing line travels through:
Discover → Plan → Design → Build → Launch

Do not use giant bouncing numbers.

## Founder animation

Use:
- portrait mask reveal
- subtle 3D depth
- slow highlight movement

Keep faces readable.

## Technology animation

Subtle orbital or floating motion.

No fast spinning logo wheel.

## Global globe animation

Use:
- slow globe rotation
- blue connection nodes
- thin connection paths
- subtle camera orbit

## Reduced motion

When `prefers-reduced-motion`:
- disable aggressive scrubbing
- reduce camera movement
- disable large particle motion
- use simple fades
- keep all content accessible

## Mobile motion

Mobile:
- shorter distances
- fewer particles
- fewer pinned sections
- lower model complexity
- avoid long blocking animations

## Performance principles

- no large unnecessary frame bursts
- lazy load below-the-fold 3D
- compress models
- optimize textures
- avoid permanent heavy postprocessing
- dispose unused resources
