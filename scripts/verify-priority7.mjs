/**
 * Priority 7 — Virtual Recruiter verification
 */
import { chromium } from "playwright";
import { VR_MODES } from "../src/virtual-recruiter/vr-modes.js";
import fs from "fs";

const BASE = "http://localhost:5000";

const REQUIRED_MODES = [
  "Career Advisor",
  "Resume Reviewer",
  "Interview Coach",
  "Learning Mentor",
  "Project Mentor",
  "Job Search Assistant"
];

function validateStatic() {
  const issues = [];
  const dash = fs.readFileSync("dashboard.html", "utf8");
  const chatbotCount = (dash.match(/id="chatbotBox"/g) || []).length;
  const toggleCount = (dash.match(/id="vrToggleBtn"/g) || []).length;
  const shellCount = (dash.match(/id="globalRecruiterShell"/g) || []).length;

  if (chatbotCount !== 1) issues.push(`Expected 1 #chatbotBox, found ${chatbotCount}`);
  if (toggleCount !== 1) issues.push(`Expected 1 #vrToggleBtn, found ${toggleCount}`);
  if (shellCount !== 1) issues.push(`Expected 1 #globalRecruiterShell, found ${shellCount}`);
  if (/id="chatbotBtn"/.test(dash)) issues.push("Duplicate chatbotBtn toggle found");
  if (VR_MODES.length !== 6) issues.push(`Expected 6 VR modes, got ${VR_MODES.length}`);

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  const counts = await page.evaluate(() => ({
    chatbot: document.querySelectorAll("#chatbotBox").length,
    toggle: document.querySelectorAll("#vrToggleBtn").length,
    shell: document.querySelectorAll("#globalRecruiterShell").length
  }));
  if (counts.chatbot !== 1) issues.push(`DOM: ${counts.chatbot} chatbotBox instances`);
  if (counts.toggle !== 1) issues.push(`DOM: ${counts.toggle} vrToggleBtn instances`);

  // Toggle open / close (single toggle + panel close button)
  await page.click("#vrToggleBtn");
  await page.waitForSelector("#chatbotBox:not(.hidden)", { timeout: 5000 });
  const clock = await page.locator("#recruiterClock").innerText();
  if (!clock.includes("·")) issues.push("Date/time display missing on clock");

  await page.click("#chatbotBox button[title='Close']");
  await page.waitForFunction(() => document.getElementById("chatbotBox")?.classList.contains("hidden"), { timeout: 5000 });

  await page.click("#vrToggleBtn");
  await page.waitForSelector("#chatbotBox:not(.hidden)", { timeout: 5000 });

  const modeOptions = await page.locator("#mentorMode option").allTextContents();
  for (const m of REQUIRED_MODES) {
    if (!modeOptions.some((o) => o.includes(m))) issues.push(`Mode missing from selector: ${m}`);
  }

  // Mode switching
  await page.selectOption("#mentorMode", "interview-coach");
  await page.waitForTimeout(200);
  let hints = await page.locator("#mentorHints").innerText();
  if (!hints.includes("Interview Coach")) issues.push("Mode switch: Interview Coach hint not shown");

  await page.selectOption("#mentorMode", "job-search");
  await page.waitForTimeout(200);
  hints = await page.locator("#mentorHints").innerText();
  if (!hints.includes("Job Search")) issues.push("Mode switch: Job Search hint not shown");

  // Chat + history
  await page.fill("#chatInput", "help me with career path and certifications");
  await page.click("#chatInputRow button");
  await page.waitForTimeout(300);
  const chatText = await page.locator("#chatMessages").innerText();
  if (!chatText.includes("You:")) issues.push("Chat message not appended");

  await page.click("button[title='History']");
  await page.waitForSelector("#vrHistoryPanel:not(.hidden)", { timeout: 3000 });
  const hist = await page.locator("#vrHistoryList").innerText();
  if (!hist.includes("career") && !hist.includes("You")) issues.push("History panel empty after chat");

  // Session memory
  await page.evaluate(() => window.showVrPanel("chat"));
  await page.fill("#chatInput", "what did I ask earlier in this session");
  await page.click("#chatInputRow button");
  await page.waitForTimeout(400);
  const memoryReply = await page.locator("#chatMessages").innerText();
  if (!/earlier|asked|session/i.test(memoryReply)) issues.push("Session memory reply missing");

  // Clear history
  await page.click("button[title='Clear history']");
  await page.waitForTimeout(300);
  const cleared = await page.evaluate(() => ({
    storage: localStorage.getItem("nexusRecruiterHistory"),
    list: document.getElementById("vrHistoryList")?.innerText || ""
  }));
  if (cleared.storage && cleared.storage !== "[]") issues.push("Clear history: localStorage not cleared");
  if (!/no history/i.test(cleared.list)) issues.push("Clear history: UI list not reset");

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
