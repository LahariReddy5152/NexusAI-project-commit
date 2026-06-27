/**
 * Phase 4 — Interview Prep & Virtual Recruiter verification
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";

function validateStatic() {
  const issues = [];
  const dash = fs.readFileSync("dashboard.html", "utf8");
  const css = fs.readFileSync("src/shared/styles/styles-part-11-phase4-interview-vr.css", "utf8");
  const prep = fs.readFileSync("src/interview/interview-prep.js", "utf8");
  const vrUi = fs.readFileSync("src/virtual-recruiter/vr-ui.js", "utf8");

  if (!dash.includes("interview-workspace-grid")) issues.push("Interview side-by-side grid missing");
  if (dash.includes("interviewTimerPanel") || dash.includes("startMockTimer(3)")) {
    issues.push("Timed Interview Mode should be removed");
  }
  if (dash.includes("showInterviewPanel('behavioral'") || dash.includes("showInterviewPanel('hr'")) {
    issues.push("Extra interview tabs should be removed");
  }
  if (!dash.includes("mockInputModesPanel")) issues.push("Mock input mode panel missing");
  if (!dash.includes("Mock Interview")) issues.push("Mock Interview tab missing");
  if (dash.includes("codeLabMessages")) issues.push("Code Lab separate chat should be removed");
  if (!dash.includes("openCodeLabAssistant()")) issues.push("Code Lab VR prompt missing");
  if (dash.includes("showVrPanel('greeting')")) issues.push("VR greeting button should be removed");
  if (!dash.includes("minimizeRecruiter()")) issues.push("VR minimize control missing");
  if ((dash.match(/id="chatbotBox"/g) || []).length !== 1) issues.push("Must have single chatbotBox");
  if (!css.includes("interview-workspace-grid")) issues.push("Interview grid CSS missing");
  if (prep.includes("mockTimerInterval")) issues.push("Mock timer logic should be removed");
  if (!vrUi.includes("Silent startup")) issues.push("VR silent startup missing");
  if (!fs.readFileSync("src/virtual-recruiter/vr-modes.js", "utf8").includes("coding-assistant")) {
    issues.push("Coding Assistant VR mode missing");
  }
  if (!fs.readFileSync("src/virtual-recruiter/vr-modes.js", "utf8").includes("general-assistant")) {
    issues.push("General Assistant VR mode missing");
  }

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user" }));
    localStorage.removeItem("nexusRecruiterHistory");
  });

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  // Silent startup — no auto greeting in chat
  await page.click("#vrToggleBtn");
  await page.waitForSelector("#chatbotBox:not(.hidden)", { timeout: 8000 });
  const greetText = await page.textContent("#chatMessages");
  if (/hello|hi |good morning|welcome/i.test(greetText || "")) {
    issues.push("VR should not auto-greet on open");
  }

  // Single chat window
  const chatCount = await page.evaluate(() => document.querySelectorAll("#chatbotBox").length);
  if (chatCount !== 1) issues.push(`Expected 1 chatbotBox, got ${chatCount}`);

  // Mode switching — Dashboard
  await page.click("button.nav-btn:has-text('Dashboard')");
  await page.waitForTimeout(300);
  let mode = await page.inputValue("#mentorMode");
  if (mode !== "general-assistant") issues.push(`Dashboard mode expected general-assistant, got ${mode}`);

  // Learn → Learning Mentor
  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForTimeout(300);
  mode = await page.inputValue("#mentorMode");
  if (mode !== "learning-mentor") issues.push(`Learn mode expected learning-mentor, got ${mode}`);

  // Interview → Interview Coach
  await page.click("button.nav-btn:has-text('Interview Prep')");
  await page.waitForSelector("#interviewSection:not(.hidden)", { timeout: 8000 });
  await page.waitForTimeout(300);
  mode = await page.inputValue("#mentorMode");
  if (mode !== "interview-coach") issues.push(`Interview mode expected interview-coach, got ${mode}`);

  // Interview layout — side by side
  const gridCols = await page.evaluate(() => {
    const grid = document.querySelector(".interview-workspace-grid");
    if (!grid) return 0;
    return getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
  });
  if (gridCols < 2) issues.push(`Interview grid not side-by-side (${gridCols} cols)`);

  // Mock input modes
  const modes = await page.$$(".mock-mode-btn");
  if (modes.length < 3) issues.push("Mock input modes (audio/text/video) missing");

  await page.click(".mock-mode-btn[data-mode='audio']");
  await page.click("#startMockBtn");
  await page.waitForTimeout(200);
  const voiceBtn = await page.$("#mockVoiceBtn:not(.hidden)");
  if (!voiceBtn) issues.push("Voice button not shown after audio mode start");

  // Text support evaluate
  await page.fill("#interviewAnswer", "Situation: API outage. Task: restore service. Action: rolled back deploy and added monitoring. Result: MTTR 20 minutes with 40% latency improvement.");
  await page.click("button:has-text('Evaluate Response')");
  await page.waitForTimeout(300);
  const feedback = await page.textContent("#interviewFeedback");
  if (!feedback?.includes("Overall")) issues.push("Evaluation feedback missing");

  // No timed mode
  const timer = await page.$("#interviewTimerPanel");
  if (timer) issues.push("Timer panel should not exist");

  // History persistence
  await page.fill("#chatInput", "test phase 4 message");
  await page.click("#chatInputRow button");
  await page.waitForTimeout(200);
  await page.click("button[title='History']");
  await page.waitForSelector("#vrHistoryPanel:not(.hidden)", { timeout: 5000 });
  const hist = await page.textContent("#vrHistoryList");
  if (!hist?.includes("test phase 4")) issues.push("VR history not persisted");

  // Code Lab uses VR
  await page.click("button.nav-btn:has-text('Code Lab')");
  await page.waitForSelector("#codingLabSection:not(.hidden)", { timeout: 8000 });
  mode = await page.inputValue("#mentorMode");
  if (mode !== "coding-assistant") issues.push(`Code Lab mode expected coding-assistant, got ${mode}`);
  const codeChat = await page.$("#codeLabMessages");
  if (codeChat) issues.push("Code Lab inline chat should not exist");

  // Tablet viewport
  await page.setViewportSize({ width: 900, height: 800 });
  await page.click("button.nav-btn:has-text('Interview Prep')");
  await page.waitForTimeout(300);
  const tabletGrid = await page.evaluate(() => !!document.querySelector(".interview-workspace-grid"));
  if (!tabletGrid) issues.push("Interview grid missing at tablet width");

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobileGrid = await page.evaluate(() => {
    const g = document.querySelector(".interview-workspace-grid");
    return g ? getComputedStyle(g).gridTemplateColumns : "";
  });
  if (!mobileGrid) issues.push("Interview grid missing at mobile width");

  return issues;
}

async function main() {
  const staticIssues = validateStatic();
  if (staticIssues.length) {
    console.log("NOT COMPLETED");
    staticIssues.forEach((i) => console.log(" -", i));
    process.exit(1);
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const browserIssues = await validateBrowser(page);
    if (browserIssues.length) {
      console.log("NOT COMPLETED");
      browserIssues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }
    console.log("COMPLETED");
  } catch (e) {
    console.log("BLOCKED");
    console.log(String(e.message || e));
    process.exit(2);
  } finally {
    if (browser) await browser.close();
  }
}

main();
