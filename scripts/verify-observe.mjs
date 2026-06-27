/**
 * 30+ second live observation — animation + parallax + portal checks (no screenshots as proof)
 */
import { chromium } from "playwright";
import { getPortalNav } from "../src/learn/learn-portal-config.js";
import { PROJECT_BLUEPRINTS } from "../src/projects/projects-data.js";

const BASE = "http://localhost:5000";
const OBSERVE_MS = 32000;
const SAMPLE_MS = 2000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sampleCanvas(page) {
  return page.evaluate(() => {
    const c = document.getElementById("nexus-galaxy-canvas");
    if (!c) return null;
    const ctx = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    const pts = [
      { region: "galaxy", x: Math.floor(w * 0.5), y: Math.floor(h * 0.12) },
      { region: "horizon", x: Math.floor(w * 0.5), y: Math.floor(h * 0.52) },
      { region: "ocean", x: Math.floor(w * 0.35), y: Math.floor(h * 0.75) },
      { region: "wave", x: Math.floor(w * 0.6), y: Math.floor(h * 0.68) }
    ];
    return pts.map((p) => {
      const [r, g, b] = ctx.getImageData(p.x, p.y, 1, 1).data;
      return { ...p, r, g, b };
    });
  });
}

async function observePage(page, label) {
  const samples = [];
  const start = Date.now();
  while (Date.now() - start < OBSERVE_MS) {
    samples.push(await sampleCanvas(page));
    await sleep(SAMPLE_MS);
  }
  return { label, samples };
}

function regionChanged(samples, region) {
  const vals = samples.map((s) => {
    const p = s?.find((x) => x.region === region);
    return p ? `${p.r},${p.g},${p.b}` : null;
  }).filter(Boolean);
  return new Set(vals).size > 1;
}

async function main() {
  const completed = [];
  const notCompleted = [];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", password: "x", role: "user", progress: {} }));
    localStorage.setItem("nexusCompleted_python-fundamentals", JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]));
  });

  const pages = [
    { url: `${BASE}/dashboard.html`, name: "dashboard.html" },
    { url: `${BASE}/index.html`, name: "index.html" },
    { url: `${BASE}/learning.html`, name: "learning.html" }
  ];

  for (const p of pages) {
    await page.goto(p.url, { waitUntil: "networkidle", timeout: 30000 });
    await sleep(1500);
    const obs = await observePage(page, p.name);
    const hasCosmos = await page.evaluate(() => !!window.__nexusCosmos?.running);
    const horizon = obs.samples[0]?.find((x) => x.region === "horizon");
    const peachHorizon = horizon && horizon.r > 100 && horizon.g > 70;
    const oceanAnim = regionChanged(obs.samples, "ocean") || regionChanged(obs.samples, "wave");
    const starAnim = regionChanged(obs.samples, "galaxy") || regionChanged(obs.samples, "horizon");

    if (hasCosmos && peachHorizon) {
      completed.push(`Background on ${p.name}: cosmos running, peach horizon colors detected`);
    } else {
      notCompleted.push(`Background on ${p.name}: cosmos=${hasCosmos}, peachHorizon=${!!peachHorizon}`);
    }
    if (oceanAnim) completed.push(`Background on ${p.name}: ocean/wave pixels changed over ${OBSERVE_MS / 1000}s (moving waves)`);
    else notCompleted.push(`Background on ${p.name}: ocean/wave animation not detected over observation window`);
    if (starAnim) completed.push(`Background on ${p.name}: sky/horizon pixels changed over observation (stars/nebula/fog motion)`);
    else notCompleted.push(`Background on ${p.name}: sky animation not detected at sampled pixels over ${OBSERVE_MS / 1000}s`);
  }

  // Parallax test on dashboard
  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle" });
  await sleep(2000);
  const before = await sampleCanvas(page);
  await page.mouse.move(200, 400);
  await sleep(400);
  await page.mouse.move(1200, 300);
  await sleep(400);
  const after = await sampleCanvas(page);
  const parallaxGalaxy = before?.find((x) => x.region === "galaxy");
  const afterGalaxy = after?.find((x) => x.region === "galaxy");
  const parallaxShift = parallaxGalaxy && afterGalaxy &&
    (Math.abs(parallaxGalaxy.r - afterGalaxy.r) > 1 || Math.abs(parallaxGalaxy.g - afterGalaxy.g) > 1);
  const beforeWave = before?.find((x) => x.region === "wave");
  const afterWave = after?.find((x) => x.region === "wave");
  const waveParallax = beforeWave && afterWave &&
    (Math.abs(beforeWave.r - afterWave.r) > 1 || Math.abs(beforeWave.b - afterWave.b) > 2);
  if (parallaxShift || waveParallax) completed.push("Background parallax: rendered pixels shift after mouse movement on dashboard.html");
  else notCompleted.push("Background parallax: mouse movement did not shift rendered pixels on dashboard.html");

  // Shooting stars - check shooter array changes
  const shootersAnim = await page.evaluate(async () => {
    const c = window.__nexusCosmos;
    if (!c) return false;
    const counts = [];
    for (let i = 0; i < 16; i++) {
      counts.push(c.shooters?.length || 0);
      await new Promise((r) => setTimeout(r, 500));
    }
    return Math.max(...counts) > 0 || new Set(counts).size > 1;
  });
  if (shootersAnim) completed.push("Background: shooting star system active (shooter pool changes over time)");
  else notCompleted.push("Background: shooting stars not confirmed active");

  // Learn portal Python
  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForSelector("#courseCatalogGrid .course-catalog-card", { timeout: 10000 });
  await page.locator("#courseCatalogGrid").getByText(/^Python$/).first().click();
  await sleep(800);
  const pyNav = await page.locator("#courseNavTabs button").allTextContents();
  const required = getPortalNav("python-fundamentals").map((n) => n.label);
  const missing = required.filter((r) => !pyNav.includes(r));
  if (!missing.length) completed.push(`Learn portal Python on dashboard.html: all ${required.length} dedicated nav items present`);
  else notCompleted.push(`Learn portal Python: missing nav [${missing.join(", ")}]`);

  // Java portal
  await page.evaluate(() => window.backToCourseCatalog());
  await sleep(400);
  await page.locator("#courseCatalogGrid").getByText(/^Java$/).first().click();
  await sleep(600);
  const javaNav = await page.locator("#courseNavTabs button").allTextContents();
  const javaRequired = getPortalNav("java-fundamentals").map((n) => n.label);
  const javaMissing = javaRequired.filter((r) => !javaNav.includes(r));
  if (!javaMissing.length) completed.push(`Learn portal Java on dashboard.html: dedicated nav (${javaRequired.length} items)`);
  else notCompleted.push(`Learn portal Java: missing [${javaMissing.slice(0, 5).join(", ")}...]`);

  // Per-project progress
  await page.evaluate(() => {
    localStorage.setItem("projectProgress_RAG_Assistant", "40");
    localStorage.setItem("projectProgress_Interview_Coach", "70");
  });
  await page.evaluate(() => window.startCoreProject("RAG Assistant"));
  await sleep(400);
  const ragProg = await page.locator("#progressText").innerText();
  await page.evaluate(() => window.startCoreProject("Interview Coach"));
  await sleep(400);
  const coachProg = await page.locator("#progressText").innerText();
  if (ragProg !== coachProg) completed.push("Projects on dashboard.html: separate progress per project (RAG vs Interview Coach)");
  else notCompleted.push(`Projects: per-project progress not isolated (both show ${coachProg})`);

  // VR single instance
  const vrCount = await page.locator("#chatbotBox").count();
  if (vrCount === 1) completed.push("Virtual Recruiter on dashboard.html: single #chatbotBox");
  else notCompleted.push(`Virtual Recruiter: ${vrCount} instances`);

  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  if (errors.length) notCompleted.push(`JS errors: ${errors.slice(0, 2).join("; ")}`);

  notCompleted.push("Priority 3: lesson boilerplate text (enrichLesson) still present in most lessons");
  notCompleted.push("Priority 5: Interview Prep not rebuilt from your notes");
  notCompleted.push("Priority 6: Career Roadmap not rebuilt from your notes");
  notCompleted.push("Priority 4: project blueprint content depth not fully verified for all 8 projects");

  await browser.close();
  console.log(JSON.stringify({ completed, notCompleted }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
