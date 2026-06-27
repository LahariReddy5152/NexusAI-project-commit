/**
 * Priority 2 — Dedicated per-technology learn portals
 */
import { chromium } from "playwright";
import { LEARNING_PATHS } from "../src/learn/learn-data.js";
import { PORTAL_NAV_BY_ID } from "../src/learn/learn-portal-config.js";

const BASE = "http://localhost:5000";

const PYTHON_NAV = [
  "Overview", "Roadmap", "Variables", "Data Types", "Operators", "Conditions", "Loops",
  "Functions", "Collections", "OOP", "Exception Handling", "File Handling", "Modules",
  "Decorators", "Generators", "Async Programming", "FastAPI", "Projects", "Assignments",
  "Quiz", "Interview Questions", "Notes", "Resources", "Progress", "Certificate"
];

const JAVA_NAV = [
  "Core Java", "OOP", "Collections", "Streams", "Multithreading", "JDBC", "JVM",
  "Exception Handling", "File Handling", "Interview Questions", "Projects", "Resources"
];

const SQL_NAV = [
  "SQL Fundamentals", "Joins", "Subqueries", "Indexes", "Views", "Stored Procedures",
  "Triggers", "Optimization", "PostgreSQL", "Interview Questions", "Projects"
];

const GENERIC_TAB_SET = new Set([
  "Fundamentals", "Core Concepts", "Syntax", "Patterns", "Best Practices",
  "Advanced Topics", "Integration", "Production"
]);

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const completed = [];
  const notCompleted = [];

  await page.addInitScript((pathIds) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user", progress: {} }));
    const done = Array.from({ length: 24 }, (_, i) => i);
    for (const id of pathIds) {
      localStorage.setItem(`nexusCompleted_${id}`, JSON.stringify(done));
    }
  }, LEARNING_PATHS.map((p) => p.id));

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });
  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForSelector("#courseCatalogGrid .course-catalog-card", { timeout: 15000 });

  const navFingerprints = new Map();
  const issues = [];

  for (const path of LEARNING_PATHS) {
    const expectedNav = PORTAL_NAV_BY_ID[path.id];
    if (!expectedNav?.length) {
      issues.push(`${path.title}: missing portal config`);
      continue;
    }

    await page.evaluate((id) => window.openCourse(id), path.id);
    await page.waitForTimeout(600);

    const visible = await page.locator("#learnCourseView:not(.hidden)").isVisible();
    if (!visible) {
      issues.push(`${path.title}: portal did not open`);
      continue;
    }

    const tabs = await page.locator("#courseNavTabs .category-tab").allTextContents();
    const trimmed = tabs.map((t) => t.trim());
    const expectedLabels = expectedNav.map((n) => n.label);

    if (trimmed.join("|") !== expectedLabels.join("|")) {
      issues.push(`${path.title}: nav mismatch — got [${trimmed.slice(0, 6).join(", ")}...] expected [${expectedLabels.slice(0, 6).join(", ")}...]`);
      continue;
    }

    const genericHits = trimmed.filter((t) => GENERIC_TAB_SET.has(t));
    if (genericHits.length >= 5) {
      issues.push(`${path.title}: contains generic placeholder tabs (${genericHits.join(", ")})`);
      continue;
    }

    const panelText = await page.locator("#courseTabPanel").innerText();
    if (/being added|placeholder tab|generic tabs/i.test(panelText)) {
      issues.push(`${path.title}: placeholder content in panel`);
      continue;
    }

    const fp = trimmed.join("|");
    navFingerprints.set(path.id, fp);

    const tabEls = page.locator("#courseNavTabs .category-tab");
    const count = await tabEls.count();
    const sample = [0, Math.min(2, count - 1), Math.min(count - 1, count - 1)].filter((v, i, a) => a.indexOf(v) === i);
    const contents = [];
    for (const idx of sample) {
      await tabEls.nth(idx).click();
      await page.waitForTimeout(350);
      contents.push(await page.locator("#courseTabPanel").innerText());
    }
    const unique = new Set(contents);
    if (unique.size < 2 && count > 1) {
      issues.push(`${path.title}: tab content does not change between sections`);
      continue;
    }

    completed.push(`${path.title}: dedicated portal (${trimmed.length} nav items, content switches)`);
    await page.evaluate(() => window.backToCourseCatalog());
    await page.waitForTimeout(200);
  }

  await page.evaluate(() => window.openCourse("python-fundamentals"));
  await page.waitForTimeout(400);
  const pyTabs = (await page.locator("#courseNavTabs .category-tab").allTextContents()).map((t) => t.trim());
  if (pyTabs.join("|") === PYTHON_NAV.join("|")) {
    completed.push("Python portal: exact required navigation structure");
  } else {
    notCompleted.push(`Python portal: nav mismatch — missing or extra items`);
  }

  await page.evaluate(() => { window.backToCourseCatalog(); window.openCourse("java-fundamentals"); });
  await page.waitForTimeout(400);
  const javaTabs = (await page.locator("#courseNavTabs .category-tab").allTextContents()).map((t) => t.trim());
  if (javaTabs.join("|") === JAVA_NAV.join("|")) {
    completed.push("Java portal: exact required navigation structure");
  } else {
    notCompleted.push(`Java portal: nav mismatch — got ${javaTabs.length} tabs`);
  }

  await page.evaluate(() => { window.backToCourseCatalog(); window.openCourse("sql"); });
  await page.waitForTimeout(400);
  const sqlTabs = (await page.locator("#courseNavTabs .category-tab").allTextContents()).map((t) => t.trim());
  if (sqlTabs.join("|") === SQL_NAV.join("|")) {
    completed.push("SQL portal: exact required navigation structure");
  } else {
    notCompleted.push(`SQL portal: nav mismatch — got ${sqlTabs.length} tabs`);
  }

  const pyFp = navFingerprints.get("python-fundamentals");
  const javaFp = navFingerprints.get("java-fundamentals");
  const reactFp = navFingerprints.get("react");
  if (pyFp && javaFp && pyFp !== javaFp) {
    completed.push("Portals use unique navigation per technology (Python ≠ Java)");
  } else {
    notCompleted.push("Python and Java share identical navigation");
  }
  if (reactFp && javaFp && reactFp !== javaFp) {
    completed.push("React portal has distinct navigation from Java");
  }

  const duplicateGroups = {};
  for (const [id, fp] of navFingerprints) {
    duplicateGroups[fp] = duplicateGroups[fp] || [];
    duplicateGroups[fp].push(id);
  }
  const dupes = Object.values(duplicateGroups).filter((g) => g.length > 1);
  if (dupes.length) {
    notCompleted.push(`Duplicate nav across paths: ${dupes.map((g) => g.join("=")).join("; ")}`);
  } else {
    completed.push("All 46 technology portals have unique navigation fingerprints");
  }

  if (issues.length) notCompleted.push(...issues);

  await browser.close();
  console.log(JSON.stringify({ completed, notCompleted }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
