/**
 * Priority 4 — Real Projects verification
 */
import { chromium } from "playwright";
import {
  ALL_PROJECT_NAMES,
  CORE_PROJECT_NAMES,
  LIVE_PROJECT_NAMES,
  PROJECT_BLUEPRINTS
} from "../src/projects/projects-blueprints.js";
import { hasProjectPlaceholder } from "../src/projects/project-builder.js";
import {
  getProjectProgressKey,
  getProjectScoreKey,
  getProjectNotesKey,
  getProjectCheckpointsKey,
  getProjectMilestonesKey
} from "../src/projects/project-progress.js";

const BASE = "http://localhost:5000";

const REQUIRED_FIELDS = [
  "overview",
  "businessProblem",
  "requirements",
  "functionalRequirements",
  "nonFunctionalRequirements",
  "architectureDiagram",
  "flowDiagram",
  "folderStructure",
  "frontendDesign",
  "backendDesign",
  "databaseDesign",
  "apiSpecifications",
  "authenticationAuthorization",
  "deploymentStrategy",
  "testingStrategy",
  "cicdStrategy",
  "monitoringLogging",
  "interviewQuestions"
];

const REQUIRED_UI_SECTIONS = [
  "Overview",
  "Business Problem",
  "Requirements",
  "Functional Requirements",
  "Non-Functional Requirements",
  "Architecture Diagram",
  "Flow Diagram",
  "Folder Structure",
  "Frontend Design",
  "Backend Design",
  "Database Design",
  "API Specifications",
  "Authentication and Authorization",
  "Deployment Strategy",
  "Testing Strategy",
  "CI/CD Strategy",
  "Monitoring and Logging",
  "Interview Questions",
  "Progress Tracking",
  "Completion Status",
  "Build Checkpoints",
  "Milestones",
  "Project Score"
];

const PLACEHOLDER_PATTERNS = [
  /blueprint loading/i,
  /coming soon/i,
  /lorem ipsum/i,
  /\bTBD\b/,
  /placeholder/i
];

function validateStatic() {
  const issues = [];
  if (CORE_PROJECT_NAMES.length !== 8) {
    issues.push(`Expected 8 core projects, got ${CORE_PROJECT_NAMES.length}`);
  }
  if (LIVE_PROJECT_NAMES.length !== 4) {
    issues.push(`Expected 4 live projects, got ${LIVE_PROJECT_NAMES.length}`);
  }

  for (const name of ALL_PROJECT_NAMES) {
    const bp = PROJECT_BLUEPRINTS[name];
    if (!bp) {
      issues.push(`Missing blueprint: ${name}`);
      continue;
    }
    for (const field of REQUIRED_FIELDS) {
      const val = bp[field];
      if (field === "interviewQuestions" || field === "requirements" || field === "functionalRequirements" || field === "nonFunctionalRequirements") {
        if (!Array.isArray(val) || val.length < 2) issues.push(`${name}: empty ${field}`);
        continue;
      }
      if (!val || String(val).trim().length < 20) {
        issues.push(`${name}: missing/short ${field}`);
      }
      if (hasProjectPlaceholder(val)) {
        issues.push(`${name}: placeholder in ${field}`);
      }
    }
    if ((bp.architectureDiagram || "").length < 40) issues.push(`${name}: architecture diagram too short`);
    if ((bp.flowDiagram || "").length < 40) issues.push(`${name}: flow diagram too short`);
    if ((bp.apiSpecifications || "").length < 30) issues.push(`${name}: API spec too short`);

    const progressKey = getProjectProgressKey(name);
    const scoreKey = getProjectScoreKey(name);
    if (progressKey === scoreKey) issues.push(`${name}: progress and score share same key`);
    if (getProjectNotesKey(name) === progressKey) issues.push(`${name}: notes key not unique`);
    if (getProjectCheckpointsKey(name) === getProjectMilestonesKey(name)) {
      issues.push(`${name}: checkpoints and milestones share key`);
    }
  }

  const overviews = new Map();
  for (const name of ALL_PROJECT_NAMES) {
    const ov = PROJECT_BLUEPRINTS[name].overview.trim();
    if (overviews.has(ov)) {
      issues.push(`Duplicate overview: ${name} vs ${overviews.get(ov)}`);
    } else {
      overviews.set(ov, name);
    }
  }

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  await page.click("button.nav-btn:has-text('Real Projects')");
  await page.waitForSelector("#realProjectsSection:not(.hidden)", { timeout: 10000 });

  const coreCards = await page.locator("#coreProjectsPanel .project-card-large").count();
  if (coreCards !== 8) issues.push(`Core panel: expected 8 cards, got ${coreCards}`);

  for (const name of ALL_PROJECT_NAMES) {
    const isLive = LIVE_PROJECT_NAMES.includes(name);
    if (isLive) {
      await page.click("button.category-tab:has-text('Live Projects')");
      await page.waitForTimeout(200);
    } else {
      await page.click("button.category-tab:has-text('Core Projects')");
      await page.waitForTimeout(200);
    }

    if (isLive) {
      await page.evaluate((n) => window.startLiveProject(n), name);
    } else {
      await page.evaluate((n) => window.startCoreProject(n), name);
    }
    await page.waitForSelector("#projectDetailSection:not(.hidden)", { timeout: 10000 });
    await page.waitForTimeout(300);

    const text = await page.locator("#projectDetailSection").innerText();
    for (const section of REQUIRED_UI_SECTIONS) {
      if (!text.includes(section)) issues.push(`${name}: UI missing "${section}"`);
    }
    for (const pat of PLACEHOLDER_PATTERNS) {
      if (pat.test(text)) issues.push(`${name}: placeholder text in page`);
    }

    const diagrams = await page.locator("#projectDetailContent .diagram-block").allTextContents();
    if (diagrams.length < 3) issues.push(`${name}: expected 3+ diagram blocks, got ${diagrams.length}`);
    const apiBlock = await page.locator(".api-spec-block").innerText().catch(() => "");
    if (apiBlock.trim().length < 20) issues.push(`${name}: API block empty`);

    const checkpoints = await page.locator("#projectCheckpointsList input[type=checkbox]").count();
    const milestones = await page.locator("#projectMilestonesList input[type=checkbox]").count();
    if (checkpoints < 8) issues.push(`${name}: checkpoints not rendered (${checkpoints})`);
    if (milestones < 5) issues.push(`${name}: milestones not rendered (${milestones})`);

    await page.click("button.back-btn:has-text('Back to Projects')");
    await page.waitForTimeout(150);
  }

  // Isolation: progress, score, notes per project
  const iso = await page.evaluate(() => {
    const a = "AI Resume Analyzer";
    const b = "Job Tracker";
    localStorage.setItem(`projectProgress_${a.replace(/\s+/g, "_")}`, "25");
    localStorage.setItem(`projectScore_${a.replace(/\s+/g, "_")}`, "91");
    localStorage.setItem(`projectNotes_${a.replace(/\s+/g, "_")}`, "notes-A");
    localStorage.setItem(`projectProgress_${b.replace(/\s+/g, "_")}`, "75");
    localStorage.setItem(`projectScore_${b.replace(/\s+/g, "_")}`, "44");
    localStorage.setItem(`projectNotes_${b.replace(/\s+/g, "_")}`, "notes-B");

    window.startCoreProject(a);
    return {
      progA: document.getElementById("progressText")?.textContent,
      scoreA: document.getElementById("projectScore")?.textContent,
      notesA: document.getElementById("projectNotes")?.value
    };
  });
  await page.waitForTimeout(300);

  if (!iso.progA?.includes("25")) issues.push("Isolation: project A progress not loaded");
  if (iso.scoreA !== "91") issues.push(`Isolation: project A score expected 91, got ${iso.scoreA}`);
  if (iso.notesA !== "notes-A") issues.push("Isolation: project A notes not loaded");

  const isoB = await page.evaluate(() => {
    window.startCoreProject("Job Tracker");
    return {
      progB: document.getElementById("progressText")?.textContent,
      scoreB: document.getElementById("projectScore")?.textContent,
      notesB: document.getElementById("projectNotes")?.value
    };
  });
  await page.waitForTimeout(300);

  if (!isoB.progB?.includes("75")) issues.push("Isolation: project B progress not loaded");
  if (isoB.scoreB !== "44") issues.push(`Isolation: project B score expected 44, got ${isoB.scoreB}`);
  if (isoB.notesB !== "notes-B") issues.push("Isolation: project B notes not loaded");

  // Changing A checkpoints must not change B stored progress
  await page.evaluate(() => {
    window.startCoreProject("AI Resume Analyzer");
    const box = document.querySelector("#projectCheckpointsList input[data-checkpoint='0']");
    if (box) {
      box.checked = true;
      window.updateProgress();
    }
  });
  await page.waitForTimeout(200);

  const bProgAfter = await page.evaluate(() =>
    localStorage.getItem("projectProgress_Job_Tracker")
  );
  if (bProgAfter !== "75") {
    issues.push(`Isolation: updating A changed B progress to ${bProgAfter}`);
  }

  return issues;
}

async function main() {
  const issues = [...validateStatic()];

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await page.addInitScript(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "user");
      localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user", progress: {} }));
    });
    await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });
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
