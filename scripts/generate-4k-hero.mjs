import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'assets', 'brand', 'Moody Blue Tech Workspace.png');
const out = path.join(root, 'public', 'images');

// Color remapping helper matching optimize-images.mjs
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

const BRAND_BLUE_HUE = 218;
const debrandPurple = (h) => {
  const w = smoothstep(236, 250, h) * (1 - smoothstep(320, 338, h));
  return w ? h + w * (BRAND_BLUE_HUE - h) : h;
};

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

async function run() {
  console.log('Processing brand hue corrections on source image...');
  const corrected = await remapHue(src, debrandPurple);

  console.log('Upscaling to 4K UHD (3840x2160) master with Lanczos3 + edge sharpening...');
  const master = await sharp(corrected)
    .resize(3840, 2160, {
      fit: 'cover',
      position: 'center',
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({
      sigma: 1.15,
      m1: 1.0,
      m2: 2.0,
      x1: 2,
      y2: 10,
      y3: 20,
    })
    .toBuffer();

  const widths = [640, 960, 1280, 1920, 2560, 3840];
  for (const w of widths) {
    const h = Math.round((w * 2160) / 3840);
    const base = sharp(master).resize(w, h, { kernel: sharp.kernel.lanczos3 });

    // High quality AVIF (quality: 85 vs old 52) and WebP (quality: 92 vs old 74)
    await base.clone().avif({ quality: 85, effort: 6 }).toFile(path.join(out, `hero-workspace-${w}.avif`));
    await base.clone().webp({ quality: 92, effort: 6 }).toFile(path.join(out, `hero-workspace-${w}.webp`));

    if (w === 1920 || w === 1280) {
      await base.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(out, `hero-workspace-${w}.jpg`));
    }
    console.log(`✓ hero-workspace-${w} (AVIF/WebP/JPG) generated`);
  }

  console.log('Done generating all 4K responsive variants!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
