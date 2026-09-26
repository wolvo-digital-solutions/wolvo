/**
 * Headless interaction QA (dev server must be running):
 *  - desktop nav anchor links land on their sections
 *  - mobile menu opens, traps focus, closes on Escape and on link click
 *  - WebGL-unavailable path renders fallbacks without errors
 */
import { chromium } from "playwright-core";

const base = process.env.QA_URL || "http://localhost:3000/?motion=full";
const b = await chromium.launch({ channel: "msedge", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const errors = [];
const watch = (p) => {
  p.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
  p.on("console", (m) => m.type() === "error" && errors.push(`[console] ${m.text()}`));
};

// 1. Desktop anchors
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p);
  await p.goto(base, { waitUntil: "networkidle" });
  await p.waitForTimeout(3000);
  for (const label of ["Work", "Services", "About", "Contact"]) {
    await p.click(`nav[aria-label=Primary] >> text=${label}`);
    await p.waitForTimeout(2600);
    const r = await p.evaluate((id) => Math.round(document.querySelector(id).getBoundingClientRect().top), `#${label === "Contact" ? "contact" : label.toLowerCase()}`);
    console.log(`nav ${label}: section top at ${r}px ${Math.abs(r) < 120 ? "✓" : "✗"}`);
  }
  await p.close();
}

// 2. Mobile menu
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  watch(p);
  await p.goto(base, { waitUntil: "networkidle" });
  await p.waitForTimeout(3000);
  await p.click("button[aria-controls=mobile-menu]");
  await p.waitForTimeout(300);
  console.log("menu open:", await p.isVisible("#mobile-menu"), "| expanded:", await p.getAttribute("button[aria-controls=mobile-menu]", "aria-expanded"), "| focus:", await p.evaluate(() => document.activeElement?.textContent?.trim()));
  for (let i = 0; i < 8; i++) await p.keyboard.press("Tab");
  console.log("focus still in menu after 8 tabs:", await p.evaluate(() => !!document.activeElement?.closest("#mobile-menu, button[aria-controls=mobile-menu]")));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  console.log("closed on Escape:", !(await p.isVisible("#mobile-menu")), "| focus returned:", await p.evaluate(() => document.activeElement?.getAttribute("aria-controls")));
  await p.click("button[aria-controls=mobile-menu]");
  await p.click("#mobile-menu >> text=Services");
  await p.waitForTimeout(2600);
  console.log("closed on link:", !(await p.isVisible("#mobile-menu")), "| services top:", await p.evaluate(() => Math.round(document.getElementById("services").getBoundingClientRect().top)));
  await p.close();
}

// 3. No WebGL
{
  const nb = await chromium.launch({ channel: "msedge", args: ["--disable-webgl", "--disable-webgl2", "--disable-3d-apis"] });
  const p = await nb.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p);
  await p.goto(base, { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  for (const id of ["services", "vision"]) {
    await p.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
    await p.waitForTimeout(1500);
  }
  console.log("no-webgl: canvases in 3D sections:", await p.$$eval("#services canvas, #vision canvas", (c) => c.length), "| fallback svg/glyphs:", await p.$$eval("#vision svg, #services .rotate-45", (e) => e.length));
  await nb.close();
}

console.log(errors.length ? `\nerrors:\n${[...new Set(errors)].join("\n")}` : "\nno errors");
await b.close();
