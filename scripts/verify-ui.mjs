/**
 * Headless UI verification — checks running app at localhost:5000
 */
import { chromium } from "playwright";

const BASE = "http://localhost:5000";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const report = { completed: [], notCompleted: [], errors: [] };

  // Bypass auth if needed
  await page.addInitScript(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem(
      "nexusUser",
      JSON.stringify({
        name: "Test User",
        email: "test@test.com",
        password: "test",
        role: "user",
        progress: { points: 100, streak: 3, hours: 5, hoursLearned: 5 }
      })
    );
  });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2500);

  // 1. Background
  const canvas = await page.$("#nexus-galaxy-canvas");
  const cosmos = await page.evaluate(() => ({
    hasCosmos: !!window.__nexusCosmos,
    cosmosError: window.__nexusCosmosError?.message || null,
    running: window.__nexusCosmos?.running ?? false
  }));

  let bgPixels = null;
  if (canvas) {
    bgPixels = await page.evaluate(() => {
      const c = document.getElementById("nexus-galaxy-canvas");
      const ctx = c?.getContext("2d");
      if (!ctx) return null;
      const w = c.width;
      const h = c.height;
      const samples = [
        [Math.floor(w * 0.5), Math.floor(h * 0.15)],
        [Math.floor(w * 0.5), Math.floor(h * 0.55)],
        [Math.floor(w * 0.5), Math.floor(h * 0.85)]
      ];
      return samples.map(([x, y]) => {
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        return { x, y, r, g, b };
      });
    });
  }

  const hasPeachHorizon = bgPixels?.some((p) => p.r > 100 && p.g > 60 && p.b < 120);
  const hasOcean = bgPixels?.some((p) => p.y > 400 && p.b > 40);
  const notFlatDark =
    bgPixels &&
    new Set(bgPixels.map((p) => `${p.r},${p.g},${p.b}`)).size > 1;

  if (canvas && cosmos.hasCosmos && cosmos.running && notFlatDark && (hasPeachHorizon || hasOcean)) {
    report.completed.push("Background: canvas exists, cosmos running, multi-color pixels (galaxy/ocean visible)");
  } else {
    report.notCompleted.push(
      `Background: canvas=${!!canvas}, cosmos=${cosmos.hasCosmos}, running=${cosmos.running}, error=${cosmos.cosmosError}, pixels=${JSON.stringify(bgPixels)}`
    );
  }

  // 2. Dashboard — no career widgets
  const dashText = await page.locator("#dashboardSection").innerText();
  const careerOnDash = /Resume Analyzer|ATS Score|Resume Builder|Job Tracker|AI Chatbot/i.test(dashText);
  if (!careerOnDash && /Learning Progress|Continue Learning|Recent Activity/i.test(dashText)) {
    report.completed.push("Dashboard: learning widgets only (no resume/job/chatbot in dashboard section)");
  } else {
    report.notCompleted.push(`Dashboard: career tools on dashboard=${careerOnDash}`);
  }

  // 3. Career section
  await page.click("button.nav-btn:has-text('Career')");
  await page.waitForTimeout(500);
  const careerText = await page.locator("#jobModeSection").innerText();
  const careerTabs = ["Resume Analyzer", "ATS Score", "Resume Builder", "Job Tracker", "Career Roadmap", "Interview Recommendations"];
  const missingCareerTabs = careerTabs.filter((t) => !careerText.includes(t));
  if (missingCareerTabs.length === 0) {
    report.completed.push("Career: all 6 required tabs present");
  } else {
    report.notCompleted.push(`Career: missing tabs: ${missingCareerTabs.join(", ")}`);
  }

  // 4. VR — single instance
  const vrCount = await page.locator("#chatbotBox, .chatbot-box").count();
  const vrToggle = await page.$("#vrToggleBtn");
  if (vrCount === 1 && vrToggle) {
    await vrToggle.click();
    await page.waitForTimeout(400);
    const vrVisible = await page.locator("#chatbotBox").isVisible();
    const vrFields = await page.locator("#chatbotBox").innerText();
    const hasGreeting = /Good|Hello|Welcome|Learner/i.test(vrFields);
    const hasChat = await page.$("#chatInput, #userInput, textarea[placeholder*='message' i]");
    if (vrVisible && hasGreeting) {
      report.completed.push("Virtual Recruiter: single panel, toggle opens, greeting visible");
    } else {
      report.notCompleted.push(`VR: visible=${vrVisible}, greeting=${hasGreeting}, chatInput=${!!hasChat}`);
    }
  } else {
    report.notCompleted.push(`VR: instance count=${vrCount}, toggle=${!!vrToggle}`);
  }

  // 5. Learn — open Python course
  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForSelector("#learnSection:not(.hidden)", { timeout: 10000 });
  await page.waitForSelector("#courseCatalogGrid .course-catalog-card", { timeout: 10000 });
  const catalogCards = await page.locator("#courseCatalogGrid .course-catalog-card").count();
  if (catalogCards > 0) {
    report.completed.push(`Learn catalog: ${catalogCards} technology cards`);
  } else {
    report.notCompleted.push("Learn catalog: no technology cards rendered");
  }

  const pythonCard = page.locator("#courseCatalogGrid").getByText(/Python/i).first();
  if (await pythonCard.count()) {
    await pythonCard.click();
    await page.waitForTimeout(600);
    const courseTabs = await page.locator("#courseNavTabs button").allTextContents();
    const requiredTopics = [
      "Overview", "Lessons", "Quiz", "Resources", "Notes", "Progress"
    ];
    const missingTopics = requiredTopics.filter((t) => !courseTabs.some((ct) => ct.includes(t)));
    if (missingTopics.length === 0) {
      report.completed.push(`Python course portal: tabs present (${courseTabs.length} tabs)`);
    } else {
      report.notCompleted.push(`Python portal missing tabs: ${missingTopics.join(", ")}`);
    }

    // Check lesson content depth
    await page.click("#courseNavTabs button:has-text('Lessons')");
    await page.waitForTimeout(400);
    const lessonBtn = page.locator("#courseTabLessons button, #courseTabLessons .lesson-card, #courseTabLessons .module-card").first();
    if (await lessonBtn.count()) {
      await lessonBtn.click();
      await page.waitForTimeout(500);
      const lessonHtml = await page.locator("#lessonView").innerHTML();
      const lessonSections = ["Theory", "Architecture", "Flow", "Quiz", "Exercise", "Summary"];
      const missingLesson = lessonSections.filter((s) => !new RegExp(s, "i").test(lessonHtml));
      if (missingLesson.length <= 2) {
        report.completed.push("Python lesson: most content sections present");
      } else {
        report.notCompleted.push(`Python lesson missing sections: ${missingLesson.join(", ")}`);
      }
    } else {
      report.notCompleted.push("Python course: no clickable lessons in Lessons tab");
    }
  } else {
    report.notCompleted.push("Learn: Python card not found");
  }

  // 6. Projects
  await page.click("button.nav-btn:has-text('Real Projects')");
  await page.waitForSelector("#realProjectsSection:not(.hidden)", { timeout: 10000 });
  const projectCards = await page.locator("#realProjectsSection .project-card-large").count();
  if (projectCards > 0) {
    await page.evaluate(() => window.startCoreProject("RAG Assistant"));
    await page.waitForSelector("#projectDetailSection:not(.hidden)", { timeout: 10000 });
    const detailText = await page.locator("#projectDetailSection").innerText();
    const projectSections = [
      "Overview", "Requirements", "Architecture", "Folder", "Frontend", "Backend",
      "Database", "API", "Authentication", "Deployment", "Testing", "Interview"
    ];
    const missingProj = projectSections.filter((s) => !new RegExp(s, "i").test(detailText));
    if (missingProj.length === 0) {
      report.completed.push("Projects: first project detail has all required sections");
    } else {
      report.notCompleted.push(`Projects: missing sections in detail view: ${missingProj.join(", ")}`);
    }
  } else {
    report.notCompleted.push("Projects: no project cards found");
  }

  // 7. Interview Prep
  await page.click("button.nav-btn:has-text('Interview Prep')");
  await page.waitForTimeout(500);
  const interviewText = await page.locator("#interviewSection").innerText();
  const oldCards = /AI Interview Coach|14.*card|placeholder roadmap/i.test(interviewText);
  if (!oldCards && interviewText.length > 100) {
    report.completed.push("Interview Prep: section has content (not empty placeholder)");
  } else {
    report.notCompleted.push("Interview Prep: may still have old structure or insufficient content");
  }

  if (consoleErrors.length) {
    report.errors = consoleErrors.filter((e) => !e.includes("favicon"));
  }

  await page.screenshot({ path: "scripts/verify-dashboard.png", fullPage: false });
  await browser.close();

  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error("VERIFY_FAILED", e.message);
  process.exit(1);
});
