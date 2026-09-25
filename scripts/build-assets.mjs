/**
 * WOLVO asset pipeline.
 *
 * Source (not served):   source-assets/
 *   - hero_section_2_frames.zip   supplied 240-frame wolf → W sequence (1920×1080 PNG)
 *   - wolvo-logo-source.png       supplied official logo (raster, dark background)
 *
 * Output (served):        public/assets/
 *   - video-frames/hero/lg/frame_0001.webp …  full sequence, desktop resolution
 *   - video-frames/hero/sm/frame_0001.webp …  every 2nd frame, mobile resolution
 *   - video-frames/hero/poster-{lg,sm}.webp   first frame (LCP poster)
 *   - video-frames/hero/final-{lg,sm}.webp    last frame (W logo)
 *   - branding/*                               logo derivatives (geometry untouched)
 *
 * Run: npm run assets
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import unzipper from "unzipper";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "source-assets");
const tmp = path.join(src, ".frames");
const out = path.join(root, "public", "assets");
const heroOut = path.join(out, "video-frames", "hero");
const brandOut = path.join(out, "branding");

const LG = { width: 1600, quality: 72, step: 1 };
const SM = { width: 900, quality: 66, step: 2 };

const pad = (n) => String(n).padStart(4, "0");

async function extractFrames() {
  if (fs.existsSync(tmp) && fs.readdirSync(tmp).length >= 240) return;
  fs.mkdirSync(tmp, { recursive: true });
  const dir = await unzipper.Open.file(path.join(src, "hero_section_2_frames.zip"));
  for (const entry of dir.files) {
    if (!entry.path.endsWith(".png")) continue;
    const name = path.basename(entry.path);
    await new Promise((res, rej) =>
      entry.stream().pipe(fs.createWriteStream(path.join(tmp, name))).on("finish", res).on("error", rej),
    );
  }
}

async function buildFrames() {
  // Deterministic ordering: numeric sort on the frame index.
  const files = fs
    .readdirSync(tmp)
    .filter((f) => /^frame_\d+\.png$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  for (const [label, cfg] of [["lg", LG], ["sm", SM]]) {
    const dest = path.join(heroOut, label);
    fs.rmSync(dest, { recursive: true, force: true });
    fs.mkdirSync(dest, { recursive: true });
    let n = 0;
    let bytes = 0;
    for (let i = 0; i < files.length; i += cfg.step) {
      n += 1;
      const target = path.join(dest, `frame_${pad(n)}.webp`);
      await sharp(path.join(tmp, files[i]))
        .resize({ width: cfg.width })
        .webp({ quality: cfg.quality, effort: 5 })
        .toFile(target);
      bytes += fs.statSync(target).size;
    }
    // Always include the true final frame (the finished W) in the sparse set.
    const last = files[files.length - 1];
    if ((files.length - 1) % cfg.step !== 0) {
      n += 1;
      const target = path.join(dest, `frame_${pad(n)}.webp`);
      await sharp(path.join(tmp, last)).resize({ width: cfg.width }).webp({ quality: cfg.quality, effort: 5 }).toFile(target);
      bytes += fs.statSync(target).size;
    }
    await sharp(path.join(tmp, files[0])).resize({ width: cfg.width }).webp({ quality: 80 }).toFile(path.join(heroOut, `poster-${label}.webp`));
    await sharp(path.join(tmp, last)).resize({ width: cfg.width }).webp({ quality: 80 }).toFile(path.join(heroOut, `final-${label}.webp`));
    console.log(`hero/${label}: ${n} frames, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
    fs.writeFileSync(path.join(dest, "manifest.json"), JSON.stringify({ count: n, width: cfg.width, height: Math.round((cfg.width * 9) / 16) }));
  }
}

/**
 * Logo: remove the flat dark background WITHOUT touching geometry or colour.
 * The mark sits on near-black, so we treat the source as "mark over background"
 * and un-composite it: alpha = strongest channel above background, colour = (c - bg) / alpha + bg-free.
 * Re-compositing the result over the original background reproduces the source pixel-for-pixel.
 */
async function buildLogo() {
  fs.mkdirSync(brandOut, { recursive: true });
  const file = path.join(src, "wolvo-logo-source.png");
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Background = median of the four 24px corners.
  const samples = [];
  for (const [cx, cy] of [[0, 0], [width - 24, 0], [0, height - 24], [width - 24, height - 24]]) {
    for (let y = cy; y < cy + 24; y++)
      for (let x = cx; x < cx + 24; x++) {
        const o = (y * width + x) * 3;
        samples.push([data[o], data[o + 1], data[o + 2]]);
      }
  }
  const bg = [0, 1, 2].map((c) => samples.map((s) => s[c]).sort((a, b) => a - b)[samples.length >> 1]);

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const d = [0, 1, 2].map((c) => Math.max(0, data[i + c] - bg[c]) / (255 - bg[c]));
    let a = Math.max(d[0], d[1], d[2]);
    a = a < 0.02 ? 0 : a; // kill compression noise in the background
    rgba[j + 3] = Math.round(a * 255);
    for (let c = 0; c < 3; c++) rgba[j + c] = a ? Math.min(255, Math.round((d[c] / a) * 255)) : 0;
  }

  const symbol = sharp(rgba, { raw: { width, height, channels: 4 } }).trim({ threshold: 10 });
  const trimmed = await symbol.png().toBuffer();
  await sharp(trimmed).resize({ width: 1024 }).png({ compressionLevel: 9 }).toFile(path.join(brandOut, "wolvo-symbol.png"));
  await sharp(trimmed).resize({ width: 512 }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(brandOut, "wolvo-symbol-512.webp"));
  await sharp(trimmed).resize({ width: 160 }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(brandOut, "wolvo-symbol-160.webp"));

  // App icons (square, symbol centred on transparent / brand-navy canvas).
  const squareOn = async (size, background) => {
    const inner = Math.round(size * 0.86);
    const mark = await sharp(trimmed).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background } })
      .composite([{ input: mark, gravity: "center" }])
      .png();
  };
  const appDir = path.join(root, "src", "app");
  await (await squareOn(512, { r: 0, g: 0, b: 0, alpha: 0 })).toFile(path.join(appDir, "icon.png"));
  await (await squareOn(180, { r: 3, g: 11, b: 30, alpha: 1 })).toFile(path.join(appDir, "apple-icon.png"));
  console.log(`logo: background rgb(${bg.join(",")}) removed, symbol + icons written`);
}

/** Open Graph image built from the supplied final frame (the real W mark). */
async function buildOg() {
  const last = fs.readdirSync(tmp).filter((f) => f.endsWith(".png")).sort().at(-1);
  await sharp(path.join(tmp, last))
    .resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(root, "src", "app", "opengraph-image.jpg"));
  console.log("og image written");
}

await extractFrames();
fs.mkdirSync(path.join(root, "src", "app"), { recursive: true });
await buildLogo();
await buildOg();
await buildFrames();
