/** Headless smoke test: enquiry form validation + submission, skip link. Run with the dev server up. */
import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on("response", async (r) => r.url().includes("/api/contact") && console.log("API", r.status(), await r.text()));
p.on("request", (r) => r.url().includes("/api/contact") && console.log("REQ", r.postData()));
await p.goto((process.env.QA_ORIGIN || "http://localhost:3000") + "/?motion=reduced#enquiry", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.click('button[type=submit]');
await p.waitForTimeout(300);
console.log("invalid status:", await p.textContent("#form-status"));
console.log("aria-invalid name:", await p.getAttribute("#name", "aria-invalid"), "| focused:", await p.evaluate(() => document.activeElement?.id));
console.log("errors:", await p.$$eval('[id$="-error"]', (els) => els.map((e) => e.textContent)));
await p.fill("#name", "QA Tester");
await p.fill("#email", "qa@example.com");
await p.selectOption("#projectType", "Web Development");
await p.fill("#message", "This is an end-to-end test of the WOLVO enquiry form.");
await p.click('button[type=submit]');
await p.waitForTimeout(1500);
console.log("valid status:", await p.textContent("#form-status"), await p.$$eval('[id$="-error"]', (els) => els.map((e) => e.id + ": " + e.textContent)));
// keyboard: skip link + nav
await p.goto((process.env.QA_ORIGIN || "http://localhost:3000") + "/?motion=reduced", { waitUntil: "networkidle" });
await p.keyboard.press("Tab");
console.log("first tab:", await p.evaluate(() => document.activeElement?.textContent?.trim()));
await b.close();
