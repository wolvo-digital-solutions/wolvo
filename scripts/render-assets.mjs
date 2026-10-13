/**
 * Renders Wolvo's fallback service artwork from the HTML sources in
 * /assets/renders into high-resolution PNGs (assets/renders/out). Run
 * `npm run images` afterwards to produce the optimized AVIF/WebP files.
 *
 *   npm run render                 # everything
 *   npm run render -- web          # only jobs whose name contains "web"
 *
 * Uses a locally installed Chromium browser (Edge or Chrome) in headless mode,
 * driven over the DevTools protocol — no extra dependencies. Override the
 * browser with WOLVO_BROWSER=/path/to/chrome.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

if (typeof WebSocket === 'undefined') {
  console.error('This script needs a global WebSocket: use Node 22+, or run it via `npm run render` (adds --experimental-websocket).');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'assets', 'renders');
const out = path.join(src, 'out');
mkdirSync(out, { recursive: true });

/** Service artwork — the self-hosted fallback for the service photos. */
const JOBS = [
  ...['web', 'app', 'ads', 'video', 'brand', 'social'].map((scene) => ({
    name: `service-${scene}`,
    file: 'services.html',
    query: `scene=${scene}`,
    width: 1200,
    height: 750,
    scale: 2,
  })),
];

const filter = process.argv[2];
const jobs = filter ? JOBS.filter((j) => j.name.includes(filter)) : JOBS;

const browser =
  process.env.WOLVO_BROWSER ??
  [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));
if (!browser) {
  console.error('No Chromium browser found. Set WOLVO_BROWSER to a Chrome/Edge executable.');
  process.exit(1);
}

const profile = mkdtempSync(path.join(tmpdir(), 'wolvo-render-'));
const port = 9400 + Math.floor(Math.random() * 400);
const proc = spawn(browser, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  '--force-color-profile=srgb',
  '--allow-file-access-from-files',
  'about:blank',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let page;
for (let i = 0; i < 60 && !page; i++) {
  try {
    page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
  } catch {
    /* browser still starting */
  }
  if (!page) await sleep(200);
}
if (!page) throw new Error('Browser did not start');

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let seq = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });

await send('Page.enable');
try {
  for (const job of jobs) {
    const scale = job.scale ?? 1;
    await send('Emulation.setDeviceMetricsOverride', { width: job.width, height: job.height, deviceScaleFactor: scale, mobile: false });
    await send('Emulation.setDefaultBackgroundColorOverride', job.transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
    const url = `${pathToFileURL(path.join(src, job.file)).href}?${job.query}`;
    await send('Page.navigate', { url });
    let state;
    for (let i = 0; i < 300; i++) {
      await sleep(100);
      const r = await send('Runtime.evaluate', { expression: 'window.__error || (window.__ready === true && document.fonts.status === "loaded")', returnByValue: true });
      state = r.result.value;
      if (state) break;
    }
    if (state !== true) throw new Error(`${job.name}: ${state || 'timed out'}`);
    await sleep(150);
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(path.join(out, `${job.name}.png`), Buffer.from(data, 'base64'));
    console.log(`✓ ${job.name} (${job.width * scale}×${job.height * scale})`);
  }
} finally {
  ws.close();
  proc.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
}
