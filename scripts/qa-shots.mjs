/**
 * Headless QA screenshots via playwright-core + the system Edge/Chrome.
 *
 *   node scripts/qa-shots.mjs <outDir> <width>x<height> <selector>@<progress> ...
 *
 * `selector@0.5` scrolls to 50% through that element's scroll range
 * (offsetTop + (height - viewport) * p). Use `y=1234` for an absolute scroll.
 * Env: QA_URL (default http://localhost:3000/?motion=full), QA_MOTION=reduced.
 * Prints console errors and page errors so runs double as a smoke test.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const [outDir, size, ...targets] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const url = process.env.QA_URL || "http://localhost:3000/?motion=full";
const mobile = width < 768;

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: process.env.QA_MOTION === "reduced" ? "reduce" : "no-preference",
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

let n = 0;
for (const t of targets) {
  await page.evaluate((t) => {
    let y;
    if (t.startsWith("y=")) y = Number(t.slice(2));
    else {
      const [sel, p = "0"] = t.split("@");
      const el = document.querySelector(sel);
      if (!el) throw new Error(`missing ${sel}`);
      const top = el.getBoundingClientRect().top + window.scrollY;
      y = top + Math.max(0, el.offsetHeight - innerHeight) * Number(p);
    }
    window.scrollTo(0, y);
  }, t);
  await page.waitForTimeout(2200);
  const file = path.join(outDir, `${String(++n).padStart(2, "0")}-${t.replace(/[^a-z0-9.@=]+/gi, "_")}.png`);
  await page.screenshot({ path: file });
  console.log(file);
}

console.log(errors.length ? `\n${errors.length} console issue(s):\n${[...new Set(errors)].join("\n")}` : "\nno console errors");
await browser.close();
