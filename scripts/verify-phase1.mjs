/**
 * Phase 1 — Visual design system & dashboard redesign verification
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";
const LOGIN_BG = "images.unsplash.com/photo-1462331940025-496dfbfc7564";
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
  const index = fs.readFileSync("index.html", "utf8");
  const dash = fs.readFileSync("dashboard.html", "utf8");
  const style = fs.readFileSync("style.css", "utf8");
  const phase1 = fs.readFileSync("src/shared/styles/styles-part-08-phase1-design.css", "utf8");

  if (index.includes("galaxy-engine")) issues.push("Login still loads galaxy-engine");
  if (dash.includes("galaxy-engine")) issues.push("Dashboard still loads galaxy-engine");
  if (!style.includes("styles-part-08-phase1-design")) issues.push("Phase 1 CSS not imported");
  if (!phase1.includes(LOGIN_BG)) issues.push("Login Unsplash URL missing from CSS");
  if (!phase1.includes("dashboard-background.png")) issues.push("Dashboard static image path missing");
  if (!fs.existsSync("assets/images/dashboard-background.png")) issues.push("Dashboard background image file missing");
  if (!fs.existsSync("forgot-password.html")) issues.push("forgot-password.html missing");
  if (dash.includes('id="recentActivity"')) issues.push("Recent Activity section still present");
  if (!dash.includes("greeting-card-horizontal")) issues.push("Horizontal greeting card missing");
  if (!dash.includes("dashboardCourseCards")) issues.push("Dashboard course cards missing");
  if (!dash.includes("notification-bell")) issues.push("Notification bell missing");
  if (!index.includes("avatar-picker")) issues.push("Avatar picker missing on signup");
  if (dash.includes("Daily learning reminders")) issues.push("Duplicate notifications in Settings");

  return issues;
}

async function validateBrowser(page) {
  const issues = [];

  // Login background
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle", timeout: 45000 });
  const loginBg = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const canvas = document.getElementById("nexus-galaxy-canvas");
    return {
      bgImage: body.backgroundImage,
      hasCanvas: !!canvas && getComputedStyle(canvas).display !== "none"
    };
  });
  if (!loginBg.bgImage.includes("1462331940025")) {
    issues.push(`Login background not Unsplash URL: ${loginBg.bgImage.slice(0, 80)}`);
  }
  if (loginBg.hasCanvas) issues.push("Login page has visible galaxy canvas");

  // Forgot password same background
  await page.goto(`${BASE}/forgot-password.html`, { waitUntil: "networkidle", timeout: 30000 });
  const forgotBg = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
  if (!forgotBg.includes("1462331940025")) issues.push("Forgot password missing login background");

  // Dashboard
  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({
      name: "Test User",
      email: "t@t.com",
      role: "user",
      avatar: { type: "male" },
      progress: { points: 100, streak: 3, hours: 5 }
    }));
  });
  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  const dashCheck = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const canvas = document.getElementById("nexus-galaxy-canvas");
    const greeting = document.querySelector(".greeting-card-horizontal");
    const statTitle = document.querySelector(".dashboard-stats .stat-title");
    const statValue = document.querySelector(".dashboard-stats .stat-value");
    const courseCards = document.querySelectorAll(".dashboard-course-card").length;
    const recent = document.getElementById("recentActivity");
    const fontHeading = getComputedStyle(document.documentElement).getPropertyValue("--font-heading");
    return {
      bgImage: body.backgroundImage,
      hasCanvas: !!canvas && getComputedStyle(canvas).display !== "none",
      greeting: !!greeting,
      titleSize: statTitle ? parseFloat(getComputedStyle(statTitle).fontSize) : 0,
      valueSize: statValue ? parseFloat(getComputedStyle(statValue).fontSize) : 0,
      courseCards,
      recent: !!recent,
      fontHeading: fontHeading.trim()
    };
  });

  if (!dashCheck.bgImage.includes("dashboard-background")) {
    issues.push(`Dashboard not using static image: ${dashCheck.bgImage.slice(0, 80)}`);
  }
  if (dashCheck.hasCanvas) issues.push("Dashboard has visible galaxy canvas");
  if (!dashCheck.greeting) issues.push("Horizontal greeting not rendered");
  if (dashCheck.valueSize <= dashCheck.titleSize) {
    issues.push(`Stat value (${dashCheck.valueSize}px) not larger than title (${dashCheck.titleSize}px)`);
  }
  if (dashCheck.courseCards < 4) issues.push(`Expected dashboard course cards, got ${dashCheck.courseCards}`);
  if (dashCheck.recent) issues.push("Recent activity element still in DOM");
  if (!dashCheck.fontHeading.includes("Outfit")) issues.push("Outfit font variable not set");

  // Sections navigation
  for (const sec of SECTIONS) {
    await page.click(`button.nav-btn:has-text('${sec.nav}')`);
    await page.waitForSelector(`#${sec.id}:not(.hidden)`, { timeout: 10000 });
  }

  // Notification bell
  await page.click("button.nav-btn:has-text('Dashboard')");
  await page.click(".notification-bell");
  await page.waitForSelector("#notificationDropdown.open", { timeout: 5000 });

  // Profile notifications
  await page.click("button.nav-btn:has-text('Profile')");
  const profileNotif = await page.$("#profileNotificationsList");
  if (!profileNotif) issues.push("Profile notifications panel missing");

  // Learn course cards have tech logo
  await page.click("button.nav-btn:has-text('Learn')");
  const catalogLogo = await page.$(".course-catalog-card .tech-logo");
  if (!catalogLogo) issues.push("Learn catalog missing tech logos");

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click("button.menu-btn");
  await page.waitForTimeout(300);
  const mobileGreeting = await page.$(".greeting-card-horizontal");
  if (!mobileGreeting) issues.push("Greeting missing on mobile");

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
