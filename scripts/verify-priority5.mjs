/**
 * Priority 5 — Interview Prep verification
 */
import { chromium } from "playwright";
import {
  SECTION_CONFIG,
  INTERVIEW_QUESTIONS,
  getQuestionsForSection
} from "../src/interview/interview-data.js";
import { hasInterviewPlaceholder } from "../src/interview/interview-builder.js";
import { INTERVIEW_SECTION_IDS } from "../src/interview/interview-progress.js";

const BASE = "http://localhost:5000";

const REQUIRED_UI = [
  "Question Bank",
  "Evaluation Criteria",
  "Sample Answer",
  "Score Tracking",
  "Progress Tracking",
  "Recommendations"
];

const OLD_GENERIC = [
  "Track Practice",
  "AI Interview Coach",
  "Select a track or panel",
  "Focused Prep",
  "Generate Technical Questions"
];

const SECTION_TABS = [
  { id: "mock", label: "Mock Interviews" },
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
  { id: "hr", label: "HR" },
  { id: "coding", label: "Coding Practice" },
  { id: "system-design", label: "System Design" },
  { id: "ai-track", label: "AI Interview Track" }
];

function validateStatic() {
  const issues = [];

  if (INTERVIEW_SECTION_IDS.length !== 7) {
    issues.push(`Expected 7 sections, got ${INTERVIEW_SECTION_IDS.length}`);
  }

  for (const sectionId of INTERVIEW_SECTION_IDS) {
    const cfg = SECTION_CONFIG[sectionId];
    if (!cfg) {
      issues.push(`Missing SECTION_CONFIG for ${sectionId}`);
      continue;
    }
    const questions = getQuestionsForSection(sectionId);
    if (questions.length < 2) {
      issues.push(`${sectionId}: question bank too small (${questions.length})`);
    }
    for (const q of questions) {
      if (!q.sampleAnswer || q.sampleAnswer.length < 30) {
        issues.push(`${q.id}: sample answer too short`);
      }
      if (!q.evaluationCriteria?.length) {
        issues.push(`${q.id}: missing evaluation criteria`);
      }
      if (hasInterviewPlaceholder(q.question) || hasInterviewPlaceholder(q.sampleAnswer)) {
        issues.push(`${q.id}: placeholder content`);
      }
    }
    for (const topic of cfg.topics || []) {
      const tq = getQuestionsForSection(sectionId, topic.id);
      if (!tq.length) issues.push(`${sectionId}/${topic.id}: no questions for topic`);
    }
  }

  if (INTERVIEW_QUESTIONS.length < 40) {
    issues.push(`Expected 40+ questions, got ${INTERVIEW_QUESTIONS.length}`);
  }

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  await page.click("button.nav-btn:has-text('Interview Prep')");
  await page.waitForSelector("#interviewSection:not(.hidden)", { timeout: 10000 });

  const sectionText = await page.locator("#interviewSection").innerText();
  for (const old of OLD_GENERIC) {
    if (sectionText.includes(old)) issues.push(`Old generic content still present: ${old}`);
  }

  for (const tab of SECTION_TABS) {
    await page.click(`button.category-tab:has-text('${tab.label}')`);
    await page.waitForTimeout(350);

    const text = await page.locator("#interviewSection").innerText();
    for (const req of REQUIRED_UI) {
      if (!text.includes(req)) issues.push(`${tab.id}: missing UI "${req}"`);
    }

    const qCount = await page.locator("#interviewQuestionList li").count();
    if (qCount < 2) issues.push(`${tab.id}: question bank has ${qCount} items`);

    const sample = await page.locator("#interviewSampleAnswer").innerText();
    if (sample.trim().length < 20) issues.push(`${tab.id}: sample answer empty`);

    const criteria = await page.locator("#interviewCriteria").innerText();
    if (!criteria.includes("Evaluation Criteria")) issues.push(`${tab.id}: criteria not rendered`);

    for (const pat of [/placeholder/i, /coming soon/i, /TBD/i]) {
      if (pat.test(text)) issues.push(`${tab.id}: placeholder in page`);
    }
  }

  // Scoring + progress per section
  const scoring = await page.evaluate(async () => {
    window.showInterviewPanel("technical");
    await new Promise((r) => setTimeout(r, 300));
    document.getElementById("interviewAnswer").value =
      "Situation: API latency. Task: reduce p95. Action: added caching and indexes. Result: 40% improvement for 2M users.";
    window.evaluateInterviewAnswer();
    document.getElementById("interviewScore").value = "88";
    window.saveInterviewScore();

    window.showInterviewPanel("behavioral");
    await new Promise((r) => setTimeout(r, 300));
    document.getElementById("interviewScore").value = "72";
    window.saveInterviewScore();

    return {
      techScores: localStorage.getItem("interviewScores_technical"),
      behScores: localStorage.getItem("interviewScores_behavioral"),
      techProg: localStorage.getItem("interviewProgress_technical"),
      behProg: localStorage.getItem("interviewProgress_behavioral"),
      feedback: document.getElementById("interviewFeedback")?.innerText || ""
    };
  });

  if (!scoring.feedback.includes("Score:")) issues.push("Evaluate answer did not produce score feedback");
  if (!scoring.techScores) issues.push("Technical section scores not persisted");
  if (!scoring.behScores) issues.push("Behavioral section scores not persisted");
  if (scoring.techScores === scoring.behScores) issues.push("Section scores not isolated");
  if (!scoring.techProg || !scoring.behProg) issues.push("Section progress not persisted");

  const status = await page.locator("#interviewScoreStatus").innerText();
  if (!status.includes("Attempts")) issues.push("Score status not updated after save");

  const recs = await page.locator("#interviewRecommendations li").count();
  if (recs < 1) issues.push("Recommendations list empty");

  // Mock timer
  await page.click("button.category-tab:has-text('Mock Interviews')");
  await page.waitForTimeout(200);
  await page.click("button:has-text('Start 3 min')");
  await page.waitForTimeout(500);
  const timer = await page.locator("#interviewTimerDisplay").innerText();
  if (!/^\d+:\d{2}$/.test(timer.trim())) issues.push(`Mock timer invalid: ${timer}`);

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
