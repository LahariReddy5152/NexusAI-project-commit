/**
 * Phase 2 — Learn experience verification
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";
const TECH_PATHS = {
  Python: { tech: "python", path: "python-fundamentals", lesson: "Variables" },
  SQL: { tech: "sql", path: "sql", lesson: "SQL Fundamentals" },
  Java: { tech: "java", path: "java-fundamentals", lesson: "Core Java" },
  "Spring Boot": { tech: "spring-boot", path: "spring-boot", lesson: "Boot Basics" },
  "AI Fundamentals": { tech: "ai", path: "ai-fundamentals", lesson: "AI Fundamentals" },
  "Prompt Engineering": { tech: "prompt-engineering", path: "prompt-engineering", lesson: "Introduction" }
};

function validateStatic() {
  const issues = [];
  const dash = fs.readFileSync("dashboard.html", "utf8");
  const css = fs.readFileSync("src/shared/styles/styles-part-09-learn-phase2.css", "utf8");
  const style = fs.readFileSync("style.css", "utf8");

  if (dash.includes("pathCategoryTabs")) issues.push("Category filter tabs still present");
  if (dash.includes('id="learnCourseView"')) issues.push("Old portal course view still present");
  if (dash.includes('id="lessonView"')) issues.push("Old lesson view still present");
  if (!dash.includes("learnWorkspaceView")) issues.push("Learn workspace view missing");
  if (!dash.includes("learnBreadcrumb")) issues.push("Breadcrumb nav missing");
  if (!dash.includes("workspaceLessonList")) issues.push("Persistent lesson sidebar missing");
  if (!style.includes("styles-part-09-learn-phase2")) issues.push("Phase 2 CSS not imported");
  if (!css.includes("learn-workspace")) issues.push("3-panel workspace CSS missing");
  if (!fs.existsSync("src/learn/learn-workspace.js")) issues.push("learn-workspace.js missing");
  if (!fs.existsSync("assets/images/dashboard-background.png")) issues.push("Dashboard background missing");

  return issues;
}

async function verifyTechnologyFlow(page, label, { tech, path, lesson }) {
  const issues = [];
  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForSelector("#learnSection:not(.hidden)", { timeout: 10000 });

  await page.click(`.tech-card:has-text('${label.split(" ")[0]}')`);
  await page.waitForSelector("#learnLevelView:not(.hidden)", { timeout: 8000 });

  const breadcrumb = await page.textContent("#learnBreadcrumb");
  if (!breadcrumb?.includes("Learn")) issues.push(`${label}: breadcrumb missing Learn`);
  if (!breadcrumb?.includes(label.split(" ")[0])) issues.push(`${label}: breadcrumb missing tech name`);

  await page.locator(`#techLevelGrid .tech-level-card:not(.locked)`).first().click();
  await page.waitForSelector("#learnWorkspaceView:not(.hidden)", { timeout: 10000 });

  const sidebarVisible = await page.$("#workspaceLessonList .workspace-lesson-item");
  if (!sidebarVisible) issues.push(`${label}: lesson sidebar not visible`);

  const sidebarCount = await page.$$eval(".workspace-lesson-item", (els) => els.length);
  if (sidebarCount < 3) issues.push(`${label}: sidebar has too few items (${sidebarCount})`);

  const bcLesson = await page.textContent("#learnBreadcrumb");
  if (!bcLesson?.includes("Beginner") && !bcLesson?.includes(label.split(" ")[0])) {
    issues.push(`${label}: breadcrumb missing level context`);
  }

  const firstLesson = await page.$(".workspace-lesson-item:not(.workspace-extra)");
  if (firstLesson) {
    await firstLesson.click();
    await page.waitForTimeout(600);
  }

  const sidebarStill = await page.isVisible("#workspaceLessonList");
  if (!sidebarStill) issues.push(`${label}: sidebar hidden after lesson open`);

  const content = await page.$(".lesson-section-block, .lesson-content-title");
  if (!content) issues.push(`${label}: lesson content not rendered`);

  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
  if (!bg.includes("dashboard-background")) issues.push(`${label}: dashboard background not applied`);

  const overflow = await page.evaluate(() => {
    const ws = document.querySelector(".learn-workspace");
    return ws ? ws.scrollWidth > ws.clientWidth + 2 : false;
  });
  if (overflow) issues.push(`${label}: workspace horizontal overflow`);

  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForTimeout(300);
  if (typeof window !== "undefined") {}
  await page.evaluate(() => {
    if (typeof window.backToCourseCatalog === "function") window.backToCourseCatalog();
  });
  await page.waitForSelector("#learnCatalogView:not(.hidden)", { timeout: 8000 });

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user", progress: {} }));
  });

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  for (const [label, cfg] of Object.entries(TECH_PATHS)) {
    issues.push(...(await verifyTechnologyFlow(page, label, cfg)));
  }

  // Lesson switching on Python
  await page.click("button.nav-btn:has-text('Learn')");
  await page.click(".tech-card:has-text('Python')");
  await page.locator("#techLevelGrid .tech-level-card:not(.locked)").first().click();
  await page.waitForSelector("#learnWorkspaceView:not(.hidden)");
  const items = page.locator(".workspace-lesson-item:not(.workspace-extra)");
  const count = await items.count();
  if (count >= 2) {
    await items.nth(0).click();
    await page.waitForTimeout(400);
    await items.nth(1).click();
    await page.waitForTimeout(400);
    const active = await page.$eval(".workspace-lesson-item.active .lesson-label", (el) => el.textContent);
    if (!active) issues.push("Lesson switch: no active sidebar item");
  }

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click("button.menu-btn");
  await page.waitForTimeout(300);
  const mobileSidebar = await page.isVisible("#workspaceLessonList");
  if (!mobileSidebar) issues.push("Mobile: lesson sidebar not visible");

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
