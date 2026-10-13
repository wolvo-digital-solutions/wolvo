/**
 * Generates optimized, responsive image assets from the source artwork in
 * /assets/brand. Run with `npm run images`; output lands in /public.
 *
 * Brand rule: the palette is blue, cyan, deep navy, black, white and neutrals
 * only. Source photos are hue-corrected here so no purple/violet ever ships.
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = path.join(root, 'assets', 'brand');
const pub = path.join(root, 'public');
const out = path.join(pub, 'images');
const SRC = {
  workspace: path.join(brand, 'Moody Blue Tech Workspace.png'),
  waves: path.join(brand, 'Blue Wave Background.png'),
  office: path.join(brand, 'Wolvo Office.webp'),
  logo: path.join(brand, 'wolvo-logo-source.webp'),
};

/** Logo background colour (deep navy) that gets keyed out of the source artwork. */
const LOGO_BG = [1, 7, 29];
const NAVY = '#050a18';

await mkdir(out, { recursive: true });
await mkdir(path.join(pub, 'brand'), { recursive: true });

// --- Colour helpers ---------------------------------------------------------

function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return [h < 0 ? h + 360 : h, max ? d / max : 0, max];
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Applies `remap(hue, saturation) → hue` to every pixel and returns a PNG buffer. */
async function remapHue(input, remap) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 3) {
    const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    if (s < 0.08) continue;
    const nh = remap(h, s);
    if (nh === h) continue;
    const [r, g, b] = hsvToRgb((nh + 360) % 360, s, v);
    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

/** Pulls violet/magenta hues (≈240–335°) onto the brand blue, feathered so there is no banding. */
const BRAND_BLUE_HUE = 218;
const debrandPurple = (h) => {
  const w = smoothstep(236, 250, h) * (1 - smoothstep(320, 338, h));
  return w ? h + w * (BRAND_BLUE_HUE - h) : h;
};

/** Rotates ultramarine blues (which read as violet on screen) toward the logo's azure. */
const toAzure = (h) => {
  if (h < 195 || h > 290) return h;
  return debrandPurple(h - 16 * (1 - smoothstep(270, 290, h)));
};

// --- Responsive photo variants ---------------------------------------------

async function variants(name, input, widths, { fallbackWidth } = {}) {
  for (const w of widths) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(out, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(out, `${name}-${w}.webp`));
  }
  const fw = fallbackWidth ?? widths[Math.floor(widths.length / 2)];
  await sharp(input)
    .resize({ width: fw, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(out, `${name}-${fw}.jpg`));
  console.log(`✓ ${name} (${widths.join(', ')})`);
}

const workspace = await remapHue(SRC.workspace, debrandPurple);

// Hero — full workspace composition.
await variants('hero-workspace', workspace, [640, 960, 1280, 1672], { fallbackWidth: 1280 });

// About visual — the Wolvo studio photo (square).
await variants('about-office', await remapHue(SRC.office, debrandPurple), [640, 960, 1254], { fallbackWidth: 960 });

// Final CTA — bottom wave band, 2:1 landscape crop, rotated onto the azure/cyan brand hues.
const waves = await remapHue(SRC.waves, toAzure);
const ctaCrop = await sharp(waves).extract({ left: 0, top: 1872 - 420, width: 840, height: 420 }).toBuffer();
await variants('cta-waves', ctaCrop, [840], { fallbackWidth: 840 });

// --- Stock photography (assets/stock, Unsplash licence — see assets/stock/SOURCES.md) ---

/**
 * Focal-point crop to 16:10: `cx`/`cy` are the subject's centre and `w` the crop
 * width, as fractions of the source. Cards then crop further (1.45:1–2.2:1)
 * around the centre, so the subject stays in view at every size.
 */
const STOCK = {
  'service-web': { cx: 0.595, cy: 0.225, w: 0.81 }, // monitor + tablet + phone; keeps the branded cup out
  'service-app': { cx: 0.5, cy: 0.55, w: 1 },
  'service-ads': { cx: 0.5, cy: 0.5, w: 1 },
  'service-video': { cx: 0.5, cy: 0.5, w: 1 },
  'service-brand': { cx: 0.5, cy: 0.62, w: 1 },
  'service-social': { cx: 0.5, cy: 0.5, w: 1 },
  'article-website': { cx: 0.5, cy: 0.5, w: 1 },
  'article-app': { cx: 0.5, cy: 0.5, w: 1 },
  'article-ads': { cx: 0.5, cy: 0.45, w: 1 },
  'article-video': { cx: 0.5, cy: 0.5, w: 1 },
  'article-brand': { cx: 0.5, cy: 0.45, w: 1 },
  'article-trends': { cx: 0.5, cy: 0.5, w: 1 },
};

async function stockCrop(name, { cx, cy, w }) {
  const input = path.join(root, 'assets', 'stock', `${name}.jpg`);
  const { width, height } = await sharp(input).metadata();
  const cw = Math.round(width * w);
  const ch = Math.min(height, Math.round(cw / 1.6));
  const left = Math.max(0, Math.min(width - cw, Math.round(width * cx - cw / 2)));
  const top = Math.max(0, Math.min(height - ch, Math.round(height * cy - ch / 2)));
  const cropped = await sharp(input).extract({ left, top, width: cw, height: ch }).toBuffer();
  return remapHue(cropped, debrandPurple);
}

for (const [name, crop] of Object.entries(STOCK)) {
  const widths = name.startsWith('service') ? [640, 960, 1280, 1600] : [480, 800, 1200, 1600];
  await variants(`photo-${name}`, await stockCrop(name, crop), widths, { fallbackWidth: widths[1] });
}

// --- Rendered artwork (from `npm run render`) -------------------------------

const renders = path.join(root, 'assets', 'renders', 'out');
if (!existsSync(path.join(renders, 'service-web.png'))) {
  console.log('… skipping rendered artwork: run `npm run render` first to create assets/renders/out');
} else {
  // Service cards — rendered 16:10 scenes, used as fallbacks if a photo fails to load.
  for (const id of ['web', 'app', 'ads', 'video', 'brand', 'social']) {
    await variants(`service-${id}`, path.join(renders, `service-${id}.png`), [640, 960, 1280], { fallbackWidth: 960 });
  }

  console.log('✓ rendered service artwork (photo fallbacks)');
}

// --- Brand mark -------------------------------------------------------------

/**
 * Keys the navy background out of the logo artwork: alpha comes from the
 * distance to the background colour, then colour is un-premultiplied so the
 * anti-aliased edges stay clean on both light and dark surfaces.
 */
async function keyedLogo() {
  const { data, info } = await sharp(SRC.logo).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0, q = 0; p < data.length; p += 3, q += 4) {
    const dist = Math.max(data[p] - LOGO_BG[0], data[p + 1] - LOGO_BG[1], data[p + 2] - LOGO_BG[2]);
    const a = Math.min(1, Math.max(0, (dist - 10) / 90));
    for (let c = 0; c < 3; c++) {
      rgba[q + c] = a ? Math.min(255, Math.max(0, Math.round((data[p + c] - LOGO_BG[c] * (1 - a)) / a))) : 0;
    }
    rgba[q + 3] = Math.round(a * 255);
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
}

const mark = await keyedLogo();
const markMeta = await sharp(mark).metadata();
console.log(`✓ logo keyed (${markMeta.width}×${markMeta.height})`);

/** Mark fitted inside a square, with optional navy tile (app icons) and padding ratio. */
async function squareMark(size, { padding = 0.14, background } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const fitted = await sharp(mark).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: fitted, gravity: 'center' }])
    .png();
}

// Navbar / footer / UI mark — transparent, rendered at ~40px, exported at 4x for crisp HiDPI.
const uiMark = sharp(mark).resize({ height: 160 });
await uiMark.clone().webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(pub, 'brand', 'wolvo-mark.webp'));
await uiMark.clone().png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(pub, 'brand', 'wolvo-mark.png'));
console.log('✓ UI mark');

// Favicons (transparent) + app icons (navy tile, maskable-safe padding).
await (await squareMark(32, { padding: 0.02 })).toFile(path.join(pub, 'favicon-32.png'));
await (await squareMark(48, { padding: 0.02 })).toFile(path.join(pub, 'favicon-48.png'));
for (const [size, name] of [
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]) {
  await (await squareMark(size, { padding: 0.18, background: NAVY })).toFile(path.join(pub, name));
}
console.log('✓ favicons + app icons');

// --- Open Graph image — 1200×630 -------------------------------------------

const og = await sharp(workspace).resize({ width: 1200, height: 630, fit: 'cover', position: 'right' }).toBuffer();
const ogMark = await sharp(mark).resize({ height: 64 }).toBuffer();
const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="#05080f" stop-opacity=".96"/>
      <stop offset=".45" stop-color="#05080f" stop-opacity=".82"/>
      <stop offset=".75" stop-color="#05080f" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="txt" x1="0" x2="1">
      <stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#00D2FF"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <text x="168" y="134" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="40" font-weight="700" fill="#F8FAFC" letter-spacing="-1">Wolvo</text>
  <text x="80" y="300" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="62" font-weight="700" fill="#F8FAFC" letter-spacing="-2">Creative Ideas.</text>
  <text x="80" y="372" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="62" font-weight="700" fill="#F8FAFC" letter-spacing="-2">Smart Technology.</text>
  <text x="80" y="444" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="62" font-weight="700" fill="url(#txt)" letter-spacing="-2">Real Results.</text>
  <text x="80" y="520" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="24" font-weight="500" fill="#94A3B8">Web · Apps · Meta Ads · Video · Branding</text>
</svg>`;
await sharp(og)
  .composite([{ input: Buffer.from(overlay) }, { input: ogMark, left: 80, top: 86 }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(pub, 'og-image.jpg'));
console.log('✓ og-image');
