# WOLVO — ASSET MANIFEST

## Required asset tree

```text
public/assets/
├── branding/
│   ├── wolvo-logo.svg
│   ├── wolvo-logo-white.svg
│   ├── wolvo-symbol.svg
│   └── favicon.svg
├── 3d/
│   ├── wolvo-wolf.glb
│   ├── globe.glb
│   └── services/
├── video/
│   ├── hero.mp4
│   └── transitions/
├── video-frames/
│   └── supplied-animation-frames/
├── founders/
│   ├── founder.webp
│   └── cofounder.webp
├── projects/
├── icons/
└── textures/
```

## Animation frame ZIP

When your prepared frame ZIP is available:
1. Extract it.
2. Preserve frame ordering.
3. Put frames under:
   `public/assets/video-frames/<sequence-name>/`
4. Prefer sequential names:
   `frame_0001.webp`
   `frame_0002.webp`
   etc.
5. Keep a poster:
   `poster.webp`

If the supplied sequence is already encoded as video:
- put it in `public/assets/video/`
- keep the original sequence as the source archive

## Image optimization

Preferred:
- WebP
- AVIF

Use PNG only when transparency or source quality requires it.

## 3D optimization

Preferred:
- GLB/GLTF
- compressed geometry
- compressed textures
- reasonable texture resolution

## Critical rule

Do not alter the WOLVO logo geometry or colors.
Use the supplied official logo assets for final brand marks.
