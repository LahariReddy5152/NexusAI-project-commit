/**
 * Full page-by-page verification against user requirements
 */
import { chromium } from "playwright";
import { PROJECT_BLUEPRINTS } from "../src/projects/projects-data.js";
import { LEARNING_PATHS } from "../src/learn/learn-data.js";

const BASE = "http://localhost:5000";
const PYTHON_PORTAL_NAV = [
  "Overview", "Variables", "Data Types", "Operators", "Loops", "Functions", "Collections",
  "OOP", "Exception Handling", "File Handling", "Decorators", "Generators", "Async", "FastAPI",
  "Projects", "Assignments", "Interview Questions", "Notes", "Diagrams", "Progress", "Quiz", "Resources"
];
const LESSON_REQUIRED = [
  "Overview", "Theory", "Architecture", "Flow", "Examples", "Code", "Exercises",
  "Quiz", "Mini Project", "Interview", "Summary", "Resources", "Progress"
];
const PROJECT_NAMES = Object.keys(PROJECT_BLUEPRINTS);
const PAGES = [
  ["Dashboard", "dashboardSection"],
  ["Learn", "learnSection"],
  ["Career", "jobModeSection"],
  ["Interview Prep", "interviewSection"],
  ["Projects", "realProjectsSection"],
  ["Code Lab", "codingLabSection"],
  ["Profile", "profileSection"],
  ["Settings", "settingsSection"]
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const completed = [];
  const notCompleted = [];

  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({
      name: "Test User", email: "t@t.com", password: "x", role: "user",
      progress: { points: 100, streak: 3, hours: 5 }
    }));
  });

  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  // --- DASHBOARD + BACKGROUND ---
  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  const bgCheck = await page.evaluate(() => {
    const c = document.getElementById("nexus-galaxy-canvas");
    const cosmos = window.__nexusCosmos;
    if (!c || !cosmos?.running) return { ok: false, reason: "no canvas or not running" };
    const ctx = c.getContext("2d");
    const w = c.width; const h = c.height;
    const pts = [[0.5, 0.12], [0.5, 0.55], [0.5, 0.88], [0.2, 0.3], [0.8, 0.25]];
    const px = pts.map(([fx, fy]) => {
      const [r, g, b] = ctx.getImageData(Math.floor(w * fx), Math.floor(h * fy), 1, 1).data;
      return { r, g, b, region: fy < 0.5 ? "sky" : "ocean" };
    });
    const peach = px.some((p) => p.region === "sky" && p.r > 90 && p.g > 50);
    const purple = px.some((p) => p.region === "sky" && p.b > 60 && p.r < 120);
    const oceanBlue = px.some((p) => p.region === "ocean" && p.b > 30);
    const distinct = new Set(px.map((p) => `${p.r},${p.g},${p.b}`)).size;
    const looksFlatDark = px.every((p) => p.r < 40 && p.g < 40 && p.b < 60);
    return { ok: !looksFlatDark && distinct >= 3 && (peach || purple) && oceanBlue, px, peach, purple, oceanBlue, distinct, looksFlatDark };
  });

  await page.screenshot({ path: "scripts/verify-bg-dashboard.png" });

  if (bgCheck.ok) {
    completed.push("Background (dashboard): canvas animating with sky + ocean color variation");
  } else {
    notCompleted.push(`Background (dashboard): does NOT visibly match galaxy/sunset/ocean spec — ${JSON.stringify(bgCheck)}`);
  }

  // Background on login
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const loginBg = await page.evaluate(() => {
    const c = document.getElementById("nexus-galaxy-canvas");
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    return { hasCanvas: !!c, cosmos: !!window.__nexusCosmos, bodyBg };
  });
  if (loginBg.hasCanvas && loginBg.cosmos) {
    completed.push("Background (login): galaxy canvas present");
  } else {
    notCompleted.push(`Background (login): galaxy not on every page — canvas=${loginBg.hasCanvas}, body=${loginBg.bodyBg}`);
  }

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Dashboard isolation
  const dash = await page.locator("#dashboardSection").innerText();
  const badOnDash = ["Resume Analyzer", "ATS Score", "Resume Builder", "Job Tracker", "AI Chatbot"].filter((t) => dash.includes(t));
  if (!badOnDash.length && /Learning Progress|Continue Learning/.test(dash)) {
    completed.push("Dashboard: learning-only widgets (no career tools in dashboard section)");
  } else {
    notCompleted.push(`Dashboard: forbidden widgets present: ${badOnDash.join(", ") || "or missing learning widgets"}`);
  }

  // --- PAGE BY PAGE ---
  for (const [label, sectionId] of PAGES) {
    const navMap = {
      Dashboard: "Dashboard", Learn: "Learn", Career: "Career",
      "Interview Prep": "Interview Prep", Projects: "Real Projects",
      "Code Lab": "Code Lab", Profile: "Profile", Settings: "Settings"
    };
    await page.click(`button.nav-btn:has-text('${navMap[label]}')`);
    await page.waitForSelector(`#${sectionId}:not(.hidden)`, { timeout: 8000 }).catch(() => null);
    const visible = await page.locator(`#${sectionId}`).isVisible();
    const hasContent = (await page.locator(`#${sectionId}`).innerText()).trim().length > 30;
    if (visible && hasContent) completed.push(`Page loads: ${label}`);
    else notCompleted.push(`Page loads: ${label} — visible=${visible}, hasContent=${hasContent}`);
  }

  // --- CAREER (6 tools only) ---
  await page.click("button.nav-btn:has-text('Career')");
  await page.waitForTimeout(400);
  const career = await page.locator("#jobModeSection").innerText();
  const requiredCareer = ["Resume Analyzer", "ATS Score", "Resume Builder", "Job Tracker", "Career Roadmap", "Interview Recommendations"];
  const missCareer = requiredCareer.filter((t) => !career.includes(t));
  if (!missCareer.length) completed.push("Career: all 6 required tools present");
  else notCompleted.push(`Career: missing tools: ${missCareer.join(", ")}`);

  const extraCareer = /Virtual Recruiter|AI Chatbot|Daily Challenge/i.test(career);
  if (!extraCareer) completed.push("Career: no extra widgets (VR/chatbot not embedded in Career section)");
  else notCompleted.push("Career: contains extra content beyond the 6 tools");

  if (/Linux.*roadmap|generic.*linux/i.test(career)) {
    notCompleted.push("Career Roadmap: generic Linux roadmap still present");
  } else if (career.includes("AI Engineer") || career.includes("ML Engineer")) {
    completed.push("Career Roadmap: AI-focused paths visible (not verified against your personal notes)");
  } else {
    notCompleted.push("Career Roadmap: does not match your notes / may be placeholder");
  }

  // --- VR ---
  const vrBoxes = await page.locator("#chatbotBox").count();
  if (vrBoxes === 1) completed.push("Virtual Recruiter: single instance in DOM");
  else notCompleted.push(`Virtual Recruiter: ${vrBoxes} instances (expected 1)`);

  await page.click("#vrToggleBtn");
  await page.waitForTimeout(500);
  const vrText = await page.locator("#chatbotBox").innerText();
  const vrChecks = {
    greeting: /Good|Welcome|Hello|Learner|Evening|Morning/i.test(vrText),
    time: /\d{1,2}:\d{2}|AM|PM/i.test(vrText),
    date: /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|June|202/i.test(vrText),
    chat: await page.$("#chatInput") !== null,
    history: /History|history/i.test(vrText) || await page.$("#vrHistoryPanel") !== null,
    mode: await page.$("#mentorMode") !== null,
    learningRec: /Learning Recommendations|learning/i.test(vrText)
  };
  const vrMissing = Object.entries(vrChecks).filter(([, v]) => !v).map(([k]) => k);
  if (!vrMissing.length) completed.push("Virtual Recruiter: greeting, time, date, chat, history, mode in one window");
  else notCompleted.push(`Virtual Recruiter missing in open panel: ${vrMissing.join(", ")}`);

  if (!(await page.locator("#chatbotBox").isVisible())) {
    notCompleted.push("Virtual Recruiter: panel hidden by default (toggle required — not always-visible single window)");
  }

  // --- LEARN ---
  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForSelector("#courseCatalogGrid .course-catalog-card", { timeout: 10000 });
  const cardCount = await page.locator(".course-catalog-card").count();
  if (cardCount >= LEARNING_PATHS.length - 2) {
    completed.push(`Learn catalog: ${cardCount} technology cards render`);
  } else {
    notCompleted.push(`Learn catalog: only ${cardCount} cards (expected ~${LEARNING_PATHS.length})`);
  }

  await page.locator("#courseCatalogGrid").getByText(/^Python$/).first().click();
  await page.waitForTimeout(600);
  const courseTabs = await page.locator("#courseNavTabs button").allTextContents();
  const missingPyNav = PYTHON_PORTAL_NAV.filter((t) => !courseTabs.some((ct) => ct.trim() === t || ct.includes(t)));
  if (missingPyNav.length === 0) {
    completed.push("Learn Python: full portal nav per your spec");
  } else {
    notCompleted.push(`Learn Python portal: missing top-level nav items: ${missingPyNav.join(", ")} (has generic tabs: ${courseTabs.join(", ")})`);
  }

  // Non-Python tech portal
  await page.evaluate(() => window.backToCourseCatalog());
  await page.waitForTimeout(400);
  await page.locator("#courseCatalogGrid").getByText(/^Java$/).first().click();
  await page.waitForTimeout(500);
  const javaTabs = await page.locator("#courseNavTabs button").allTextContents();
  const javaMissing = PYTHON_PORTAL_NAV.filter((t) => !javaTabs.some((ct) => ct.includes(t)) && !["FastAPI", "Decorators", "Generators", "Async"].includes(t));
  if (javaMissing.length < 5) {
    notCompleted.push(`Learn Java portal: same incomplete generic structure — missing ${javaMissing.length} of your required nav items`);
  } else {
    notCompleted.push(`Learn Java portal: NOT a complete learning portal per your spec (${javaMissing.slice(0, 8).join(", ")}...)`);
  }

  notCompleted.push(`Learn: only catalog + generic tabs for ~${LEARNING_PATHS.length - 1} other technologies — NOT full per-tech portals like your Python example`);

  // Lesson content depth
  await page.evaluate(() => { window.backToCourseCatalog(); window.openCourse("python-fundamentals"); });
  await page.waitForTimeout(500);
  await page.click("#courseNavTabs button:has-text('Lessons')");
  await page.waitForTimeout(300);
  const lessonClick = page.locator("#courseTabLessons .module-card, #courseTabLessons button").first();
  if (await lessonClick.count()) {
    await lessonClick.click();
    await page.waitForTimeout(500);
    const lessonText = await page.locator("#lessonView").innerText();
    const missLesson = LESSON_REQUIRED.filter((s) => !new RegExp(s, "i").test(lessonText));
    if (missLesson.length <= 2) {
      completed.push(`Python lesson sample: ${LESSON_REQUIRED.length - missLesson.length}/${LESSON_REQUIRED.length} content sections visible`);
    } else {
      notCompleted.push(`Lesson content incomplete: missing ${missLesson.join(", ")}`);
    }
    if (/grounded in computer science principles applied to real engineering/i.test(lessonText)) {
      notCompleted.push("Lesson content: uses generic template text (enrichLesson boilerplate), not unique deep content");
    }
  } else {
    notCompleted.push("Learn: cannot open a Python lesson to verify content sections");
  }

  // --- ALL PROJECTS ---
  const projectIssues = [];
  for (const name of PROJECT_NAMES) {
    await page.evaluate((n) => window.startCoreProject(n), name).catch(() => window.startLiveProject?.(name));
    await page.waitForTimeout(300);
    const text = await page.locator("#projectDetailSection").innerText().catch(() => "");
    const sections = ["Overview", "Requirements", "Architecture", "Folder", "Frontend", "Backend", "Database", "API", "Authentication", "Deployment", "Testing", "Interview", "Project Score", "Completion"];
    const missing = sections.filter((s) => !new RegExp(s, "i").test(text));
    const blank = sections.filter((s) => {
      const re = new RegExp(`${s}[^\\n]*\\n\\s*(\\n|$)`, "i");
      return false;
    });
    if (missing.length) projectIssues.push(`${name}: missing labels [${missing.join(", ")}]`);
    if (/Blueprint loading|placeholder|TBD/i.test(text)) projectIssues.push(`${name}: placeholder content`);
  }
  if (!projectIssues.length) {
    completed.push(`Projects: all ${PROJECT_NAMES.length} projects open with required section labels`);
  } else {
    notCompleted.push(`Projects: issues — ${projectIssues.join("; ")}`);
  }
  notCompleted.push("Projects: progress/score not per-project (shared localStorage key)");

  // Live projects tab
  await page.click("button.nav-btn:has-text('Real Projects')");
  await page.waitForTimeout(300);
  await page.click("button.category-tab:has-text('Live Projects')");
  await page.waitForTimeout(300);
  const liveCount = await page.locator("#liveProjectsPanel .project-card-large").count();
  if (liveCount >= 4) completed.push(`Live Projects tab: ${liveCount} live project cards visible`);
  else notCompleted.push(`Live Projects: only ${liveCount} cards`);

  // --- INTERVIEW PREP ---
  await page.click("button.nav-btn:has-text('Interview Prep')");
  await page.waitForTimeout(400);
  const interview = await page.locator("#interviewSection").innerText();
  const oldInterview = ["AI Interview Coach", "HR Interview card", "Resume Tips", "Linux Interview"].filter((t) => interview.includes(t));
  if (oldInterview.length) {
    notCompleted.push(`Interview Prep: old sections still present: ${oldInterview.join(", ")}`);
  }
  notCompleted.push("Interview Prep: structure not verified against your personal notes (current: Mock/Technical/Behavioral/System/Tracks/Coding tabs)");

  if (errors.length) notCompleted.push(`JS errors during session: ${errors.slice(0, 3).join("; ")}`);

  await browser.close();
  console.log(JSON.stringify({ completed, notCompleted }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
