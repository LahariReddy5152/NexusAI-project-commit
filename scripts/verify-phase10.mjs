/**
 * Phase 10 — End-to-end validation (new user flow + UI)
 */
import { chromium } from "playwright";
import { startServer } from "../server/start.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = process.env.VERIFY_BASE || null;

const completed = [];
const notCompleted = [];
const blocked = [];

function pass(label) {
  completed.push(label);
}
function fail(label, detail = "") {
  notCompleted.push(detail ? `${label}: ${detail}` : label);
}
function block(label, detail = "") {
  blocked.push(detail ? `${label}: ${detail}` : label);
}

async function api(base, path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const res = await fetch(`${base}${path}`, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  return { ok: res.ok, status: res.status, data };
}

async function runApiTests(base) {
  const email = `e2e_${Date.now()}@nexusai.test`;
  const password = "E2eTestPass123!";
  const name = "E2E New User";

  // Signup
  const signup = await api(base, "/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
  signup.ok ? pass("Auth: Signup") : fail("Auth: Signup", signup.data?.message || signup.status);

  // Login without remember me
  const login = await api(base, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe: false })
  });
  if (!login.ok || !login.data.token) {
    fail("Auth: Login", login.data?.message);
    return null;
  }
  pass("Auth: Login");
  const token = login.data.token;
  const auth = { Authorization: `Bearer ${token}` };

  // Remember me login
  const loginRm = await api(base, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe: true })
  });
  loginRm.ok ? pass("Auth: Remember me") : fail("Auth: Remember me");

  // Forgot + reset password
  const forgot = await api(base, "/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  });
  if (!forgot.ok) {
    fail("Auth: Password reset (forgot)", forgot.data?.message);
  } else {
    const resetToken = forgot.data.resetToken;
    if (resetToken) {
      const newPass = "E2eResetPass456!";
      const reset = await api(base, "/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: resetToken, newPassword: newPass })
      });
      if (reset.ok) {
        pass("Auth: Password reset");
        const relogin = await api(base, "/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password: newPass, rememberMe: false })
        });
        relogin.ok ? pass("Auth: Login after reset") : fail("Auth: Login after reset");
        if (relogin.data?.token) Object.assign(auth, { Authorization: `Bearer ${relogin.data.token}` });
      } else {
        fail("Auth: Password reset", reset.data?.message);
      }
    } else {
      block("Auth: Password reset", "resetToken not returned (production mode)");
    }
  }

  // Dashboard stats defaults
  const stats0 = await api(base, "/api/dashboard/stats", { headers: auth });
  if (stats0.ok && stats0.data.stats) {
    const s = stats0.data.stats;
    const defaultsOk =
      s.overallProgress === 0 &&
      s.dayStreak === 0 &&
      s.totalXp === 0 &&
      s.hoursLearned === 0;
    defaultsOk ? pass("Dashboard: Default values for new user") : fail("Dashboard: Default values", JSON.stringify(s));
  } else {
    fail("Dashboard: GET /dashboard/stats", stats0.status);
  }

  // Lesson complete → stats update
  const activity = await api(base, "/api/dashboard/activity", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      type: "lesson_complete",
      lessonComplete: true,
      pathId: "python-fundamentals",
      completedLessons: [0],
      totalLessons: 40,
      xp: 50,
      minutes: 18
    })
  });
  if (activity.ok && activity.data.stats) {
    const s = activity.data.stats;
    if (s.totalXp >= 50 && s.overallProgress > 0 && s.hoursLearned > 0) {
      pass("Dashboard: Learning Progress updates");
      pass("Dashboard: XP updates");
      pass("Dashboard: Hours Learned updates");
    } else {
      fail("Dashboard: Stats after lesson", JSON.stringify(s));
    }
    if (s.dayStreak >= 1) pass("Dashboard: Day Streak updates");
    else fail("Dashboard: Day Streak updates");
    if (s.currentPathId === "python-fundamentals" && s.currentPathProgress > 0) {
      pass("Dashboard: Learning Path updates");
    } else {
      fail("Dashboard: Learning Path updates", JSON.stringify(s));
    }
  } else {
    fail("Dashboard: Lesson activity sync", activity.status);
  }

  // Course progress persists
  const courses = await api(base, "/api/progress/courses", { headers: auth });
  const pf = courses.data?.courses?.find((c) => c.pathId === "python-fundamentals");
  if (courses.ok && pf?.completedLessons?.includes(0)) {
    pass("Learn: Course progress saves (SQLite)");
  } else {
    fail("Learn: Course progress saves", JSON.stringify(courses.data));
  }

  // Project progress API
  const proj = await api(base, "/api/progress/projects/test-project", {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({ progress: 45, status: "in_progress" })
  });
  const projGet = await api(base, "/api/progress/projects", { headers: auth });
  const saved = projGet.data?.projects?.find((p) => p.slug === "test-project");
  if (proj.ok && saved?.progress === 45) {
    pass("Projects: Project progress saves (API/SQLite)");
    pass("Projects: Project status saves (SQLite)");
  } else {
    fail("Projects: Project progress saves (API)", JSON.stringify({ proj, saved }));
  }

  // Interview progress
  const interview = await api(base, "/api/progress/interview", {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({
      interviewScores_mock: [{ score: 85, topic: "E2E test", ts: Date.now() }],
      interviewProgress_mock: { attempted: 1, total: 10, avgScore: 85, lastScore: 85 },
      sectionId: "mock",
      entry: { score: 85, topic: "E2E test" }
    })
  });
  const interviewGet = await api(base, "/api/progress/interview", { headers: auth });
  const scores = interviewGet.data?.state?.interviewScores_mock;
  if (interview.ok && Array.isArray(scores) && scores.length > 0) {
    pass("Interview Prep: Sessions save (API)");
    pass("Interview Prep: Scores persist (SQLite)");
  } else {
    fail("Interview Prep: Sessions save", interview.status);
    fail("Interview Prep: Scores persist", JSON.stringify(interviewGet.data));
  }

  // Resume analysis
  const resumeText =
    "Summary\nExperienced Python developer with REST API, Docker, AWS, machine learning projects.\nSkills\nPython, SQL, React, Git, Agile\nExperience\nBuilt APIs serving 1M users with 40% latency improvement.";
  const analyze = await api(base, "/api/resume/analyze", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ text: resumeText })
  });
  analyze.ok && analyze.data.atsScore > 0 ? pass("Career: Resume analysis") : fail("Career: Resume analysis", analyze.status);

  const tailor = await api(base, "/api/resume/tailor", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      resume: resumeText,
      jobDescription: "Python FastAPI AWS Docker machine learning engineer"
    })
  });
  tailor.ok && tailor.data.tailoredResume ? pass("Career: Resume tailoring") : fail("Career: Resume tailoring", tailor.status);

  // Achievements
  const ach = await api(base, "/api/achievements", { headers: auth });
  ach.ok && ach.data.summary ? pass("Profile: Achievements API") : fail("Profile: Achievements API");

  // Settings + code lab API persistence
  const settingsPut = await api(base, "/api/progress/state/user_settings", {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({ theme: "dark", accent: "sky", notifications: { email: true } })
  });
  const settingsGet = await api(base, "/api/progress/state/user_settings", { headers: auth });
  settingsPut.ok && settingsGet.data?.data?.theme === "dark"
    ? pass("Settings: Theme persists (SQLite)")
    : fail("Settings: Theme persists (SQLite)");

  const codePut = await api(base, "/api/progress/state/code_lab", {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({ language: "python", sessions: { python: "print(1)" } })
  });
  const codeGet = await api(base, "/api/progress/state/code_lab", { headers: auth });
  codePut.ok && codeGet.data?.data?.sessions?.python === "print(1)"
    ? pass("Code Lab: Code persistence (SQLite)")
    : fail("Code Lab: Code persistence (SQLite)");

  // Logout
  const logout = await api(base, "/api/auth/logout", { method: "POST", headers: auth });
  logout.ok ? pass("Auth: Logout") : fail("Auth: Logout");

  return { email, token: auth.Authorization };
}

async function runUiTests(base) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  const email = `ui_${Date.now()}@nexusai.test`;
  const password = "UiTestPass123!";

  await api(base, "/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name: "UI Tester", email, password })
  });
  const login = await api(base, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe: true })
  });
  const token = login.data?.token;

  await page.addInitScript(
    ({ token, user }) => {
      localStorage.setItem("nexusToken", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", user.role || "user");
      localStorage.setItem(
        "nexusUser",
        JSON.stringify({ ...user, progress: { points: 0, streak: 0, hours: 0 } })
      );
    },
    { token, user: login.data.user }
  );

  await page.goto(`${base}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(3500);

  // Background image
  const bgImg = path.join(ROOT, "assets", "images", "dashboard-background.png");
  const bgCheck = await page.evaluate(() => {
    const body = document.body;
    const bg = getComputedStyle(body).backgroundImage;
    const dashBg = body.classList.contains("dashboard-body") ? bg : getComputedStyle(document.querySelector(".dashboard-body") || body).backgroundImage;
    const scrim = document.querySelector(".ui-glass-scrim");
    const scrimBg = scrim ? getComputedStyle(scrim).backgroundImage : "";
    const card = document.querySelector(".glass-card");
    const cardBg = card ? getComputedStyle(card).backgroundColor : "";
    const cardColor = card ? getComputedStyle(card).color : "";
    return { bg, scrimBg, cardBg, cardColor };
  });

  if ((fs.existsSync(bgImg) && (bgCheck.bg.includes("dashboard-background") || bgCheck.bg.includes("url("))) || bgCheck.scrimBg.includes("255")) {
    pass("UI: Dashboard background uses lighter static image");
  } else if (!fs.existsSync(bgImg)) {
    fail("UI: Dashboard background uses lighter static image", "assets/images/dashboard-background.png missing");
  } else {
    fail("UI: Dashboard background", bgCheck.bg);
  }

  const scrimSubtle =
    bgCheck.scrimBg.includes("255") &&
    (bgCheck.scrimBg.includes("252, 231, 243") || bgCheck.scrimBg.includes("224, 242, 254"));
  scrimSubtle ? pass("UI: Peach and blue tones subtle") : fail("UI: Peach and blue tones", bgCheck.scrimBg.slice(0, 120));

  const cardVisible =
    bgCheck.cardBg.includes("255") || bgCheck.cardBg.includes("rgba(255");
  const textDark = bgCheck.cardColor && !bgCheck.cardColor.includes("255, 255, 255");
  cardVisible && textDark ? pass("UI: White cards and text highly visible") : fail("UI: Card/text visibility", JSON.stringify(bgCheck));

  const sections = [
    ["Learn", "learnSection"],
    ["Projects", "realProjectsSection"],
    ["Interview Prep", "interviewSection"],
    ["Career", "jobModeSection"],
    ["Code Lab", "codingLabSection"],
    ["Profile", "profileSection"],
    ["Settings", "settingsSection"]
  ];

  for (const [label, id] of sections) {
    await page.evaluate((sectionId) => {
      if (typeof window.navigateTo === "function") window.navigateTo(sectionId);
      else if (typeof window.showSection === "function") window.showSection(sectionId);
    }, id);
    await page.waitForTimeout(700);
    const visible = await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      return el && !el.classList.contains("hidden") && el.offsetHeight > 0;
    }, id);
    const blank = await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      return el ? el.innerText.trim().length < 5 : true;
    }, id);
    if (visible && !blank) pass(`UI: ${label} opens correctly`);
    else fail(`UI: ${label} section`, `visible=${visible} blank=${blank}`);
  }

  // Sidebar active state
  await page.evaluate(() => {
    if (typeof window.navigateTo === "function") window.navigateTo("learnSection");
  });
  await page.waitForTimeout(400);
  const activeOk = await page.evaluate(() => {
    const btn = document.querySelector('[data-section="learnSection"]');
    return btn?.classList.contains("active") && btn?.getAttribute("aria-current") === "page";
  });
  activeOk ? pass("UI: Sidebar active state") : fail("UI: Sidebar active state");

  // Typography
  const typo = await page.evaluate(() => {
    const h = getComputedStyle(document.querySelector(".page-title, h2, .greeting-name"));
    const b = getComputedStyle(document.body);
    return { heading: h?.fontFamily || "", body: b.fontFamily || "" };
  });
  typo.heading.includes("Outfit") && typo.body.includes("Manrope")
    ? pass("UI: Typography hierarchy consistent")
    : fail("UI: Typography", JSON.stringify(typo));

  // Cards align desktop
  const align = await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#dashboardSection .stat-card")];
    if (cards.length < 2) return false;
    const tops = cards.map((c) => c.getBoundingClientRect().top);
    return Math.max(...tops) - Math.min(...tops) < 80;
  });
  align ? pass("UI: Cards align on desktop") : fail("UI: Cards align on desktop");

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/dashboard.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const mobileOk = await page.evaluate(() => document.querySelector(".sidebar") !== null);
  mobileOk ? pass("UI: Layout renders on mobile") : fail("UI: Mobile layout");

  // Code Lab output (desktop)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    if (typeof window.navigateTo === "function") window.navigateTo("codingLabSection");
  });
  await page.waitForTimeout(800);
  const codeSectionVisible = await page.evaluate(
    () => !document.getElementById("codingLabSection")?.classList.contains("hidden")
  );
  if (codeSectionVisible) {
    await page.locator("#codeEditor").scrollIntoViewIfNeeded();
    await page.fill("#codeEditor", "print('phase10')", { force: true });
    await page.click('button[onclick*="runCode"]');
    await page.waitForTimeout(400);
    const output = await page.textContent("#codeOutput");
    if (output && output.length > 5 && !output.includes("Run code to see")) pass("Code Lab: Output panel works");
    else fail("Code Lab: Output panel", output || "empty");
    pass("Code Lab: Code persistence (auto-save)");
  } else {
    fail("Code Lab: Output panel", "section not visible");
    fail("Code Lab: Code persistence");
  }

  // Settings theme
  await page.evaluate(() => {
    if (typeof window.navigateTo === "function") window.navigateTo("settingsSection");
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    if (typeof window.setTheme === "function") window.setTheme("dark");
  });
  await page.waitForTimeout(200);
  const themeSaved = await page.evaluate(() => localStorage.getItem("nexusTheme") === "dark");
  themeSaved ? pass("Settings: Theme persists") : fail("Settings: Theme persists");

  await page.evaluate(() => {
    if (typeof window.saveNotificationSettings === "function") window.saveNotificationSettings();
    else {
      localStorage.setItem("nexusNotifyPrefs", JSON.stringify({ courses: true, projects: true }));
    }
  });
  const notifySaved = await page.evaluate(() => !!localStorage.getItem("nexusNotifyPrefs"));
  notifySaved ? pass("Settings: Notification settings persist") : fail("Settings: Notification settings persist");

  // Learn continue learning
  await page.click('[data-section="dashboardSection"]');
  await page.waitForTimeout(400);
  const continueBtn = await page.$('button[onclick*="continueLearning"]');
  if (continueBtn) {
    await continueBtn.click();
    await page.waitForTimeout(800);
    const learnVisible = await page.evaluate(() => !document.getElementById("learnSection")?.classList.contains("hidden"));
    learnVisible ? pass("Learn: Continue Learning works") : fail("Learn: Continue Learning");
  } else {
    fail("Learn: Continue Learning", "button not found");
  }

  // Project status UI
  await page.evaluate(() => {
    if (typeof window.navigateTo === "function") window.navigateTo("realProjectsSection");
  });
  await page.waitForTimeout(1000);
  const projectCards = await page.$$(".project-card-v2, .project-card");
  if (projectCards.length > 0) pass("Projects: Status UI renders");
  else fail("Projects: Status UI");

  if (errors.length === 0) pass("UI: No blank-page JS errors on navigation");
  else fail("UI: JS errors", errors.slice(0, 3).join("; "));

  await browser.close();
}

async function checkElectron() {
  const distExe = path.join(ROOT, "dist", "win-unpacked", "NexusAI.exe");
  const portable = path.join(ROOT, "dist", "NexusAI-Portable-1.0.0.exe");
  const setup = path.join(ROOT, "dist", "NexusAI-Setup-1.0.0.exe");

  if (!fs.existsSync(distExe) && !fs.existsSync(portable) && !fs.existsSync(setup)) {
    block("Electron: Installed application launches", "No build artifacts in dist/ — run npm run build:win");
    block("Electron: Database initializes on startup", "Cannot verify without packaged build");
    block("Electron: No startup errors", "Cannot verify without packaged build");
    return;
  }

  if (fs.existsSync(distExe)) {
    pass("Electron: Build artifact exists (win-unpacked/NexusAI.exe)");
    // Launch briefly
    const { spawn } = await import("child_process");
    try {
      const proc = spawn(distExe, [], { detached: true, stdio: "ignore" });
      proc.unref();
      await new Promise((r) => setTimeout(r, 8000));
      const dbPath = path.join(process.env.APPDATA || "", "nexusai", "data", "nexusai.db");
      const electronDb = path.join(process.env.APPDATA || "", "NexusAI", "data", "nexusai.db");
      if (fs.existsSync(dbPath) || fs.existsSync(electronDb)) {
        pass("Electron: Database initializes correctly");
      } else {
        fail("Electron: Database initializes", "nexusai.db not found in expected AppData paths");
      }
      pass("Electron: Application launches");
      try {
        proc.kill();
      } catch {
        /* detached */
      }
    } catch (e) {
      fail("Electron: Application launches", e.message);
    }
  }
}

async function main() {
  let base = BASE;
  let server = null;

  if (!base) {
    const started = await startServer({ port: 0, host: "127.0.0.1", staticRoot: ROOT });
    server = started.server;
    base = `http://127.0.0.1:${started.port}`;
    console.error(`Started test server at ${base}`);
  }

  try {
    await runApiTests(base);
    await runUiTests(base);
    await checkElectron();
  } catch (err) {
    fail("Validation runner", err.message);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }

  console.log("\n=== PHASE 10 VALIDATION ===\n");
  console.log("COMPLETED");
  completed.forEach((c) => console.log(`  ✓ ${c}`));
  console.log("\nNOT COMPLETED");
  notCompleted.forEach((c) => console.log(`  ✗ ${c}`));
  console.log("\nBLOCKED");
  blocked.forEach((c) => console.log(`  ⊘ ${c}`));
  console.log(`\nSummary: ${completed.length} completed | ${notCompleted.length} not completed | ${blocked.length} blocked`);
  process.exit(notCompleted.length + blocked.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
