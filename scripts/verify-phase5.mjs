/**
 * Phase 5 — Final polish & production readiness verification
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";

function validateStatic() {
  const issues = [];
  const style = fs.readFileSync("style.css", "utf8");
  const polish = fs.readFileSync("src/shared/styles/styles-part-12-phase5-polish.css", "utf8");
  const dash = fs.readFileSync("dashboard.html", "utf8");
  const profile = fs.readFileSync("src/profile/profile-ui.js", "utf8");

  if (!style.includes("styles-part-12-phase5-polish")) issues.push("Phase 5 CSS not imported");
  if (!polish.includes("profile-achievements-compact")) issues.push("Achievements compact styles missing");
  if (!polish.includes(":focus-visible")) issues.push("Focus states missing");
  if (!polish.includes("nexusFadeIn")) issues.push("Subtle animations missing");
  if (!polish.includes("overflow-x: hidden")) issues.push("Horizontal overflow guard missing");
  if (!dash.includes("profileAchievementsCompact")) issues.push("Profile achievements section missing");
  if (dash.includes('id="profileAchievements"')) issues.push("Old profile achievements list should be replaced");
  if (!profile.includes("renderAchievementsCompact")) issues.push("Profile achievements logic missing");
  if (!profile.includes("countInterviewSessions")) issues.push("Interview session count missing");

  const notifMatches = dash.match(/notification-dropdown|profileNotificationsList|notification-bell/g) || [];
  const notifPanels = dash.match(/id="profileNotificationsList"/g)?.length || 0;
  const bellPanels = dash.match(/class="notification-wrap"/g)?.length || 0;
  if (bellPanels !== 1) issues.push("Notification bell should exist once in navbar");
  if (notifPanels !== 1) issues.push("Profile notifications panel should exist once");

  return issues;
}

async function validateBrowser(page) {
  const issues = [];
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err.message)));

  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user" }));
  });

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  // Typography tokens applied
  const h1Size = await page.evaluate(() => {
    const el = document.querySelector(".page-title");
    if (!el) return 0;
    return parseFloat(getComputedStyle(el).fontSize);
  });
  if (h1Size < 20) issues.push("H1 page-title too small");

  // Background overlay
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundImage || "");
  if (!bg.includes("gradient") && !bg.includes("url")) {
    issues.push("Dashboard background not configured");
  }

  // Profile achievements compact
  await page.click("button.nav-btn:has-text('Profile')");
  await page.waitForSelector("#profileSection:not(.hidden)", { timeout: 8000 });
  const chips = await page.$$(".achievement-chip");
  if (chips.length < 5) issues.push(`Expected 5 achievement chips, got ${chips.length}`);

  // Notifications only navbar + profile
  const notifCenters = await page.evaluate(() => ({
    bells: document.querySelectorAll(".notification-wrap").length,
    profileList: document.querySelectorAll("#profileNotificationsList").length
  }));
  if (notifCenters.bells !== 1) issues.push("Duplicate notification bell");
  if (notifCenters.profileList !== 1) issues.push("Profile notification list missing");

  // Keyboard focus
  await page.keyboard.press("Tab");
  await page.waitForTimeout(100);
  const hasFocusStyle = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return false;
    const style = getComputedStyle(el);
    return style.outlineWidth !== "0px" || style.boxShadow.includes("251") || el.matches(":focus-visible");
  });
  if (!hasFocusStyle) issues.push("Focus state not visible on keyboard navigation");

  // Navigation smoke test
  const sections = ["Dashboard", "Learn", "Real Projects", "Career", "Interview Prep", "Code Lab"];
  for (const label of sections) {
    await page.click(`button.nav-btn:has-text('${label}')`);
    await page.waitForTimeout(200);
    const hidden = await page.evaluate(() => {
      const visible = document.querySelector(".section:not(.hidden)");
      return !visible;
    });
    if (hidden) issues.push(`Navigation broken for ${label}`);
  }

  // No horizontal scroll — desktop
  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  if (desktopOverflow) issues.push("Horizontal scroll on desktop");

  // Tablet
  await page.setViewportSize({ width: 900, height: 800 });
  await page.waitForTimeout(200);
  const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  if (tabletOverflow) issues.push("Horizontal scroll on tablet");

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  if (mobileOverflow) issues.push("Horizontal scroll on mobile");

  // Card hover transition exists
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.click("button.nav-btn:has-text('Dashboard')");
  await page.waitForTimeout(200);
  const cardTransition = await page.evaluate(() => {
    const card = document.querySelector(".glass-card");
    if (!card) return "";
    return getComputedStyle(card).transition;
  });
  if (!cardTransition.includes("transform")) issues.push("Card hover transition missing");

  // Filter benign console errors
  const criticalErrors = consoleErrors.filter(
    (e) => !/favicon|404|net::ERR|Failed to load resource/i.test(e)
  );
  if (criticalErrors.length) {
    issues.push(`Console errors: ${criticalErrors.slice(0, 3).join("; ")}`);
  }

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
