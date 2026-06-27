/**
 * Phase 3 — Projects & Career verification
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";

function validateStatic() {
  const issues = [];
  const dash = fs.readFileSync("dashboard.html", "utf8");
  const css = fs.readFileSync("src/shared/styles/styles-part-10-phase3-projects-career.css", "utf8");

  if (!dash.includes("real-projects-grid-v2")) issues.push("Projects responsive grid missing");
  if (dash.includes("careerAtsPanel")) issues.push("ATS Score panel should be removed");
  if (dash.includes("careerRoadmapPanel")) issues.push("Career Roadmap panel should be removed");
  if (!dash.includes("careerTailorPanel")) issues.push("Tailor Resume panel missing");
  if (!dash.includes("githubUsername")) issues.push("GitHub connect UI missing");
  if (!fs.readFileSync("src/projects/projects-data.js", "utf8").includes("project-detail-grid")) {
    issues.push("Project detail side-by-side layout missing");
  }
  if (!css.includes("career-tailor-grid")) issues.push("Career tailor side-by-side CSS missing");

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user" }));
  });

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  // Projects grid
  await page.click("button.nav-btn:has-text('Real Projects')");
  await page.waitForSelector("#realProjectsSection:not(.hidden)", { timeout: 10000 });

  const gridCols = await page.evaluate(() => {
    const grid = document.querySelector(".real-projects-grid-v2");
    if (!grid) return 0;
    return getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  });
  if (gridCols < 2) issues.push(`Projects grid not multi-column (${gridCols})`);

  const cards = await page.$$(".project-card-v2");
  if (cards.length < 8) issues.push(`Expected 8+ project cards, got ${cards.length}`);

  const cardMeta = await page.$eval(".project-card-v2", (el) => ({
    icon: !!el.querySelector(".project-icon"),
    pct: !!el.querySelector(".project-pct"),
    stack: !!el.querySelector(".project-stack"),
    badge: !!el.querySelector(".project-status-badge")
  }));
  if (!cardMeta.icon || !cardMeta.pct || !cardMeta.stack || !cardMeta.badge) {
    issues.push("Project card missing required fields");
  }

  // Project detail side-by-side
  await page.locator(".project-card-v2").first().click();
  await page.waitForSelector("#projectDetailSection:not(.hidden)", { timeout: 10000 });

  const detailGrid = await page.$(".project-detail-grid");
  if (!detailGrid) issues.push("Project detail grid missing");

  const cells = await page.$$(".project-detail-cell");
  if (cells.length < 4) issues.push("Project detail side-by-side cells missing");

  // GitHub at 0% progress
  await page.fill("#githubUsername", "testuser");
  await page.click("button:has-text('Connect')");
  await page.waitForTimeout(300);
  await page.fill("#githubRepoUrl", "https://github.com/testuser/nexus-project");
  await page.click("button:has-text('Sync Repository')");
  await page.waitForTimeout(400);
  const syncStatus = await page.textContent("#githubSyncStatus");
  if (!syncStatus?.includes("Synced") && !syncStatus?.includes("Connected")) {
    issues.push(`GitHub sync failed at 0%: ${syncStatus}`);
  }

  await page.click("button:has-text('Push Progress')");
  await page.waitForTimeout(300);
  const pushOk = await page.evaluate(() => !!localStorage.getItem("githubPush_AI_Resume_Analyzer") || !!localStorage.getItem("githubSync_AI_Resume_Analyzer"));
  if (!pushOk) issues.push("GitHub push/sync record not saved");

  // Career — Resume Analyzer
  await page.click("button.nav-btn:has-text('Career')");
  await page.waitForSelector("#jobModeSection:not(.hidden)", { timeout: 10000 });

  const careerTabs = await page.$$eval(".career-tab", (els) => els.map((e) => e.textContent.trim()));
  if (careerTabs.length !== 2) issues.push(`Expected 2 career tabs, got ${careerTabs.length}`);
  if (careerTabs.some((t) => t.includes("ATS Score") || t.includes("Roadmap"))) {
    issues.push("Removed career tabs still present");
  }

  const analyzerGrid = await page.evaluate(() => {
    const g = document.querySelector(".career-analyzer-grid");
    return g ? getComputedStyle(g).gridTemplateColumns.split(" ").length : 0;
  });
  if (analyzerGrid < 2) issues.push("Resume analyzer not side-by-side");

  await page.fill("#resumeText", "Python Java SQL React AWS Docker machine learning API REST git experience projects");
  await page.click("button:has-text('Analyze Resume')");
  await page.waitForTimeout(400);
  const atsScore = await page.textContent("#atsScore");
  if (!atsScore?.includes("%")) issues.push("Resume analyzer ATS score missing");

  const skills = await page.$$eval("#skillsList li", (els) => els.length);
  if (skills < 1) issues.push("Resume analyzer skills list empty");

  // Tailor Resume side-by-side
  await page.click("button:has-text('Tailor Resume')");
  await page.waitForSelector("#careerTailorPanel:not(.hidden)", { timeout: 5000 });

  const tailorGrid = await page.evaluate(() => {
    const g = document.querySelector(".career-tailor-grid");
    return g ? getComputedStyle(g).gridTemplateColumns.split(" ").length : 0;
  });
  if (tailorGrid < 2) issues.push("Tailor resume not side-by-side on desktop");

  await page.fill("#jobDescriptionText", "Senior Python Engineer\nRequirements: Python, FastAPI, AWS, Docker");
  await page.fill("#tailorResumeText", "Jane Doe\nPython developer with API experience");
  await page.click("button:has-text('Generate Tailored Resume')");
  await page.waitForTimeout(400);
  const tailored = await page.textContent("#tailoredResumeOutput");
  if (!tailored || tailored.includes("Paste both")) issues.push("Tailor resume generation failed");

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click("button.menu-btn");
  await page.waitForTimeout(300);
  await page.click("button.nav-btn:has-text('Real Projects')");
  const mobileOverflow = await page.evaluate(() => {
    const section = document.getElementById("realProjectsSection");
    return section ? section.scrollWidth > section.clientWidth + 5 : false;
  });
  if (mobileOverflow) issues.push("Projects section horizontal overflow on mobile");

  return issues;
}

async function main() {
  const issues = [...validateStatic()];

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    issues.push(...(await validateBrowser(page)));
    await browser.close();
  } catch (e) {
    if (browser) await browser.close();
    console.log("BLOCKED");
    console.error(e.message || e);
    process.exit(2);
  }

  if (issues.length) {
    console.log("NOT COMPLETED");
    issues.forEach((i) => console.error(`- ${i}`));
    process.exit(1);
  }
  console.log("COMPLETED");
}

main().catch((e) => {
  console.log("BLOCKED");
  console.error(e);
  process.exit(2);
});
