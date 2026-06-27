/**
 * Priority 8 — Cosmic Crimson theme verification (visual only)
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";

const SECTIONS = [
  { nav: "Dashboard", id: "dashboardSection" },
  { nav: "Learn", id: "learnSection" },
  { nav: "Career", id: "jobModeSection" },
  { nav: "Interview Prep", id: "interviewSection" },
  { nav: "Real Projects", id: "realProjectsSection" },
  { nav: "Code Lab", id: "codingLabSection" },
  { nav: "Profile", id: "profileSection" },
  { nav: "Settings", id: "settingsSection" }
];

function validateStatic() {
  const issues = [];
  const css = fs.readFileSync("src/shared/styles/styles-part-07-cosmic-crimson.css", "utf8");
  const part01 = fs.readFileSync("src/shared/styles/styles-part-01.css", "utf8");
  const styleEntry = fs.readFileSync("style.css", "utf8");
  const dash = fs.readFileSync("dashboard.html", "utf8");

  if (!styleEntry.includes("styles-part-07-cosmic-crimson")) {
    issues.push("Cosmic crimson stylesheet not imported in style.css");
  }
  if (!part01.includes("--dark-red:")) issues.push("CSS variables not updated for crimson theme");
  if (!css.includes("login-body")) issues.push("Login theme rules missing");
  if ((dash.match(/id="chatbotBox"/g) || []).length !== 1) {
    issues.push("Expected exactly one #chatbotBox in dashboard.html");
  }
  if ((dash.match(/id="vrToggleBtn"/g) || []).length !== 1) {
    issues.push("Expected exactly one #vrToggleBtn");
  }
  if (dash.includes('id="chatbotBtn"')) issues.push("Duplicate chatbotBtn found");

  return issues;
}

async function isCrimsonDark(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return false;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  return r > 40 && r <= 120 && g < 60 && b < 80;
}

async function validateBrowser(page) {
  const issues = [];

  // Login page
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle", timeout: 45000 });
  const galaxyLogin = await page.evaluate(() => {
    const canvas = document.getElementById("nexus-galaxy-canvas");
    const card = document.querySelector(".login-container");
    const scrim = document.querySelector(".ui-glass-scrim");
    return {
      canvas: !!canvas && getComputedStyle(canvas).display !== "none",
      cardBg: card ? getComputedStyle(card).backgroundColor : "",
      scrimBg: scrim ? getComputedStyle(scrim).backgroundColor : ""
    };
  });
  if (!galaxyLogin.canvas) issues.push("Login: galaxy canvas not visible");
  if (!galaxyLogin.cardBg.includes("rgba")) issues.push("Login: glass card background missing");

  // Dashboard + sections
  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user" }));
  });
  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  const domCheck = await page.evaluate(() => ({
    chatbot: document.querySelectorAll("#chatbotBox").length,
    toggle: document.querySelectorAll("#vrToggleBtn").length,
    canvas: !!document.getElementById("nexus-galaxy-canvas"),
    primary: getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim()
  }));

  if (domCheck.chatbot !== 1) issues.push(`Dashboard: ${domCheck.chatbot} recruiter panels`);
  if (domCheck.toggle !== 1) issues.push(`Dashboard: ${domCheck.toggle} recruiter toggles`);
  if (!domCheck.canvas) issues.push("Dashboard: galaxy canvas missing");
  if (!domCheck.primary.includes("be123c") && !domCheck.primary.includes("#be")) {
    issues.push(`Dashboard: primary color not crimson (${domCheck.primary})`);
  }

  const sidebarBg = await page.$eval(".sidebar", (el) => getComputedStyle(el).backgroundColor);
  if (!(await isCrimsonDark(sidebarBg))) {
    issues.push(`Sidebar not dark red/burgundy: ${sidebarBg}`);
  }

  const cardBg = await page.$eval(".glass-card", (el) => getComputedStyle(el).backgroundColor);
  if (cardBg === "rgba(0, 0, 0, 0)" || cardBg === "transparent") {
    issues.push("Glass card fully transparent — low contrast");
  }

  for (const sec of SECTIONS) {
    await page.click(`button.nav-btn:has-text('${sec.nav}')`);
    await page.waitForSelector(`#${sec.id}:not(.hidden)`, { timeout: 10000 });
    await page.waitForTimeout(250);
    const visible = await page.locator(`#${sec.id}`).isVisible();
    if (!visible) issues.push(`Section not visible: ${sec.nav}`);
  }

  // VR toggle still works (no regression)
  await page.click("#vrToggleBtn");
  await page.waitForFunction(() => !document.getElementById("chatbotBox")?.classList.contains("hidden"), { timeout: 5000 });
  await page.click("#chatbotBox button[title='Close']");
  await page.waitForFunction(() => document.getElementById("chatbotBox")?.classList.contains("hidden"), { timeout: 5000 });

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click("button.menu-btn");
  await page.waitForTimeout(300);
  const mobileSidebar = await page.$eval(".sidebar", (el) => getComputedStyle(el).backgroundColor);
  if (!(await isCrimsonDark(mobileSidebar))) {
    issues.push(`Mobile sidebar theme: ${mobileSidebar}`);
  }

  return issues;
}

async function main() {
  const issues = [...validateStatic()];

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
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
