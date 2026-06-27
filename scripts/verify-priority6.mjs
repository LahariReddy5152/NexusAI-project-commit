/**
 * Priority 6 — Career Roadmap verification
 */
import { chromium } from "playwright";
import { CAREER_ROADMAPS } from "../src/career/career-roadmap-data.js";
import { CAREER_PATH_IDS, ASSESSMENT_PASS_PERCENT } from "../src/career/career-roadmap-progress.js";
import { hasRoadmapPlaceholder } from "../src/career/career-roadmap-builder.js";

const BASE = "http://localhost:5000";

const REQUIRED_PATHS = [
  "AI Engineer",
  "Java Full Stack Developer",
  "Backend Engineer",
  "Frontend Engineer",
  "Machine Learning Engineer",
  "Generative AI Engineer",
  "Data Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "MLOps Engineer"
];

const REQUIRED_SECTIONS = [
  "Estimated timeline",
  "Technologies Required",
  "Recommended Order",
  "Projects",
  "Certifications",
  "Interview Preparation",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Milestones",
  "Skill Progress"
];

const PLACEHOLDER_PATTERNS = [
  /linux placeholder/i,
  /generic ai career/i,
  /coming soon/i,
  /lorem ipsum/i,
  /Current learning focus/i,
  /Full-Stack AI Developer/i
];

function validateStatic() {
  const issues = [];
  if (CAREER_ROADMAPS.length !== 10) issues.push(`Expected 10 roadmaps, got ${CAREER_ROADMAPS.length}`);
  if (CAREER_PATH_IDS.length !== 10) issues.push(`PATH_IDS count mismatch`);

  for (const p of CAREER_ROADMAPS) {
    if (!p.timeline || hasRoadmapPlaceholder(p.timeline)) issues.push(`${p.id}: invalid timeline`);
    for (const stage of ["beginner", "intermediate", "advanced"]) {
      const s = p.stages[stage];
      if (!s?.milestones?.length) issues.push(`${p.id}: missing ${stage} milestones`);
      if (!s?.skills?.length) issues.push(`${p.id}: missing ${stage} skills`);
    }
    if (!p.technologies?.length || !p.projects?.length || !p.certifications?.length) {
      issues.push(`${p.id}: missing technologies/projects/certifications`);
    }
    const progressKey = `careerRoadmapProgress_${p.id}`;
    const milestoneKey = `careerRoadmapMilestones_${p.id}`;
    if (progressKey === milestoneKey) issues.push(`${p.id}: progress keys not unique`);
  }

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  await page.click("button.nav-btn:has-text('Career')");
  await page.waitForTimeout(300);
  await page.click("button.career-tab:has-text('Career Roadmap')");
  await page.waitForSelector("#careerRoadmapList:not(.hidden)", { timeout: 10000 });

  const listText = await page.locator("#careerRoadmapPanel").innerText();
  for (const name of REQUIRED_PATHS) {
    if (!listText.includes(name)) issues.push(`Path missing from list: ${name}`);
  }
  for (const pat of PLACEHOLDER_PATTERNS) {
    if (pat.test(listText)) issues.push(`Placeholder pattern in roadmap list: ${pat}`);
  }

  const cards = await page.locator(".career-path-card").count();
  if (cards !== 10) issues.push(`Expected 10 path cards, got ${cards}`);

  for (const p of CAREER_ROADMAPS) {
    await page.evaluate((id) => window.openCareerRoadmapPath(id), p.id);
    await page.waitForSelector("#careerRoadmapDetail:not(.hidden)", { timeout: 8000 });
    await page.waitForTimeout(250);

    const text = await page.locator("#careerRoadmapDetail").innerText();
    for (const sec of REQUIRED_SECTIONS) {
      if (!text.includes(sec) && !text.includes(sec.replace(" Preparation", ""))) {
        if (sec === "Interview Preparation" && text.includes("Interview Preparation Topics")) continue;
        else issues.push(`${p.title}: missing "${sec}"`);
      }
    }
    if (!/\d+–\d+ months|\d+–\d+ months/.test(text) && !text.includes("months")) {
      issues.push(`${p.title}: timeline not visible`);
    }
    const milestones = await page.locator(".roadmap-milestones label").count();
    if (milestones < 4) issues.push(`${p.title}: milestones not rendered (${milestones})`);

    await page.click("button.back-btn:has-text('All Career Paths')");
    await page.waitForTimeout(200);
  }

  // Progress isolation via milestones (per-path keys)
  const iso = await page.evaluate(() => {
    localStorage.setItem(
      "careerRoadmapMilestones_ai-engineer",
      JSON.stringify({ "b-ai-engineer-0": true, "b-ai-engineer-1": true, "b-ai-engineer-2": true, "b-ai-engineer-3": true })
    );
    localStorage.setItem(
      "careerRoadmapMilestones_cloud-engineer",
      JSON.stringify({ "b-cloud-engineer-0": true, "i-cloud-engineer-0": true, "i-cloud-engineer-1": true })
    );
    window.openCareerRoadmapPath("ai-engineer");
    return {
      text: document.querySelector("#careerRoadmapDetailContent")?.innerText || "",
      aiKey: localStorage.getItem("careerRoadmapMilestones_ai-engineer"),
      cloudKey: localStorage.getItem("careerRoadmapMilestones_cloud-engineer")
    };
  });
  await page.waitForTimeout(400);
  if (!iso.text.includes("33%") && !iso.text.includes("4/12")) {
    issues.push("Isolation: AI Engineer milestone progress not reflected");
  }
  if (iso.aiKey === iso.cloudKey) issues.push("Isolation: milestone keys identical");

  await page.evaluate(() => window.openCareerRoadmapPath("cloud-engineer"));
  await page.waitForTimeout(300);
  const cloudText = await page.locator("#careerRoadmapDetailContent").innerText();
  if (!cloudText.includes("Completion") && !cloudText.includes("%")) issues.push("Cloud engineer path detail failed");
  if (cloudText.includes("4/12") && cloudText.includes("33%")) issues.push("Isolation: cloud path shows AI Engineer progress");

  // Assessment — pass intermediate for backend-engineer (single turn)
  await page.evaluate(() => {
    window.startCareerAssessment("backend-engineer", "intermediate");
    const correctIndexes = [0, 0, 1, 1, 1];
    document.querySelectorAll(".assessment-q").forEach((block, qi) => {
      const radio = block.querySelectorAll("input[type=radio]")[correctIndexes[qi]];
      if (radio) radio.checked = true;
    });
    window.submitCareerAssessment();
  });
  await page.waitForTimeout(1600);

  const passed = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem("careerRoadmapAssessment_backend-engineer") || "{}");
    return r.intermediate?.passed === true && r.intermediate?.score >= 80;
  });
  if (!passed) issues.push("Assessment: backend-engineer intermediate not passed at 80%+");

  const unlockIso = await page.evaluate(() => {
    const u = JSON.parse(localStorage.getItem("careerRoadmapUnlock_backend-engineer") || "{}");
    const ai = JSON.parse(localStorage.getItem("careerRoadmapUnlock_ai-engineer") || "{}");
    return { backend: u.intermediate, ai: ai.intermediate };
  });
  if (!unlockIso.backend) issues.push("Assessment did not unlock backend path intermediate");
  if (unlockIso.ai) issues.push("Assessment unlock leaked to ai-engineer path");

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
