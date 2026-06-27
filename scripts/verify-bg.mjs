/**
 * Background visibility verification — screenshots + pixel/animation checks
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = "scripts/verify-screenshots";
const BASE = "http://localhost:5000";

async function samplePage(page, label) {
  await page.waitForTimeout(2500);
  const shot = path.join(OUT, `${label}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const frame1 = await page.evaluate(() => {
    const c = document.getElementById("nexus-galaxy-canvas");
    if (!c) return null;
    const ctx = c.getContext("2d");
    const w = c.width; const h = c.height;
    const pts = [
      { name: "galaxy", x: w * 0.5, y: h * 0.12 },
      { name: "horizon", x: w * 0.5, y: h * 0.52 },
      { name: "ocean", x: w * 0.5, y: h * 0.78 }
    ];
    return pts.map((p) => {
      const [r, g, b] = ctx.getImageData(Math.floor(p.x), Math.floor(p.y), 1, 1).data;
      return { ...p, r, g, b };
    });
  });

  await page.waitForTimeout(800);
  const frame2 = await page.evaluate(() => {
    const c = document.getElementById("nexus-galaxy-canvas");
    const ctx = c.getContext("2d");
    const [r, g, b] = ctx.getImageData(Math.floor(c.width * 0.5), Math.floor(c.height * 0.12), 1, 1).data;
    return { r, g, b };
  });

  const animating = frame1 && frame2 && (frame1[0].r !== frame2.r || frame1[0].g !== frame2.g);
  const peachHorizon = frame1?.some((p) => p.name === "horizon" && p.r > 120 && p.g > 80);
  const purpleSky = frame1?.some((p) => p.name === "galaxy" && p.b > 50 && p.r < 180);
  const oceanBlue = frame1?.some((p) => p.name === "ocean" && p.b > 45 && p.g < 120);
  const cosmos = await page.evaluate(() => ({
    has: !!window.__nexusCosmos,
    running: window.__nexusCosmos?.running
  }));

  return { label, shot, frame1, animating, peachHorizon, purpleSky, oceanBlue, cosmos };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", password: "x", role: "user", progress: {} }));
  });

  const pages = [
    { url: `${BASE}/dashboard.html`, label: "dashboard" },
    { url: `${BASE}/index.html`, label: "login" },
    { url: `${BASE}/learning.html`, label: "learning" }
  ];

  const results = [];
  for (const p of pages) {
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 30000 });
    results.push(await samplePage(page, p.label));
  }

  await browser.close();

  const allOk = results.every((r) =>
    r.cosmos.has && r.cosmos.running && r.animating && r.peachHorizon && r.purpleSky && r.oceanBlue
  );

  console.log(JSON.stringify({ allOk, results, screenshots: results.map((r) => r.shot) }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
