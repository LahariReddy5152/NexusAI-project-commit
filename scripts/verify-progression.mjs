/**
 * Verify independent technologies + within-tech level progression + assessments
 */
import { chromium } from "playwright";
import { LEARNING_PATHS } from "../src/learn/learn-data.js";
import { PROGRESSION_META, ASSESSMENT_PASS_PERCENT } from "../src/learn/learn-progression.js";

const BASE = "http://localhost:5000";

const INDEPENDENT_PAIRS = [
  ["sql", "python-fundamentals"],
  ["react", "java-fundamentals"],
  ["ai-fundamentals", "spring-boot"],
  ["aws", "docker"]
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const completed = [];
  const notCompleted = [];

  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Test", email: "t@t.com", role: "user" }));
  });

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });
  await page.click("button.nav-btn:has-text('Learn')");
  await page.waitForSelector("#courseCatalogGrid .course-catalog-card", { timeout: 15000 });

  for (const [pathId, blockedBy] of INDEPENDENT_PAIRS) {
    const unlocked = await page.evaluate((id) => {
      const p = window.LEARNING_PATHS?.find((x) => x.id === id);
      if (!p) return null;
      return typeof window.isPathUnlocked === "function" ? window.isPathUnlocked(p) : null;
    }, pathId);
    if (unlocked === true) {
      completed.push(`Independent entry: ${pathId} unlocked without ${blockedBy} progress`);
    } else {
      notCompleted.push(`${pathId} not immediately available (expected independent from ${blockedBy})`);
    }
  }

  await page.evaluate(() => window.openCourse("sql"));
  await page.waitForTimeout(500);
  if (await page.locator("#learnCourseView:not(.hidden)").isVisible()) {
    completed.push("SQL portal opens immediately with zero cross-tech progress");
  } else {
    notCompleted.push("SQL portal did not open");
  }

  await page.evaluate(() => window.backToCourseCatalog());
  await page.waitForTimeout(300);

  const advPyLocked = await page.evaluate(() => {
    const p = { id: "advanced-python" };
    const paths = document.querySelectorAll(".course-catalog-card");
    return Array.from(paths).some((c) => c.textContent.includes("Advanced Python") && c.classList.contains("locked"));
  });
  if (advPyLocked) {
    completed.push("Advanced Python visible but locked without intermediate progress");
  } else {
    notCompleted.push("Advanced Python should be locked for new users");
  }

  await page.evaluate(() => window.showLockPreview("advanced-python"));
  await page.waitForTimeout(400);
  const lockText = await page.locator("#pathLockPreview").innerText();
  if (/Intermediate Python/i.test(lockText) && /Assessment/i.test(lockText) && /80/i.test(lockText)) {
    completed.push("Lock preview shows prerequisite + assessment option (Advanced Python)");
  } else {
    notCompleted.push(`Lock preview missing required info: ${lockText.slice(0, 120)}`);
  }

  if (await page.locator("button:has-text('Take Intermediate Python Assessment')").isVisible()) {
    completed.push("Assessment button visible on locked level preview");
  } else {
    notCompleted.push("Assessment button not visible on lock preview");
  }

  await page.evaluate(() => window.openPlacementAssessment("python-intermediate"));
  await page.waitForTimeout(400);
  const assessVisible = await page.locator("#placementAssessmentOverlay:not(.hidden)").isVisible();
  const assessText = assessVisible ? await page.locator("#placementAssessmentOverlay").innerText() : "";
  if (assessVisible && /Theory Questions/i.test(assessText) && /Coding Questions/i.test(assessText) && /Challenge Project/i.test(assessText)) {
    completed.push("Placement assessment includes theory, coding, practical, challenge");
  } else {
    notCompleted.push("Placement assessment UI incomplete");
  }

  await page.evaluate(() => {
    const assessment = window.buildPlacementAssessment?.("python-intermediate");
    if (!assessment) return;
    assessment.theoryQuestions.forEach((q, i) => {
      window.setAssessmentAnswer(`theory_${i}`, q.correct);
    });
    assessment.codingQuestions.forEach((q, i) => {
      window.setAssessmentAnswer(`coding_${i}`, "def solution():\n    # full implementation\n    return True\n" + "x".repeat(50));
    });
    assessment.practicalExercises.forEach((q, i) => {
      window.setAssessmentAnswer(`practical_${i}`, "Detailed practical response explaining steps, edge cases, and validation approach for this topic. ".repeat(3));
    });
    window.setAssessmentAnswer("challenge", "Mini project plan: build a modular CLI with input parsing, core logic, tests, and README documenting architecture and tradeoffs. ".repeat(4));
    window.submitPlacementAssessment();
  });
  await page.waitForTimeout(2500);

  const unlockedAfter = await page.evaluate(() => {
    const p = { id: "advanced-python", title: "Advanced Python", category: "core", subtitle: "" };
    const paths = window.LEARNING_PATHS || [];
    const real = paths.find((x) => x.id === "advanced-python");
    return real && window.isPathUnlocked(real);
  });

  if (unlockedAfter) {
    completed.push("Assessment unlock: Advanced Python unlocked after passing intermediate assessment");
  } else {
    notCompleted.push("Assessment did not unlock Advanced Python");
  }

  const crossMeta = Object.entries(PROGRESSION_META).filter(([, m]) => m.previousPathId).filter(([id, m]) => {
    const prev = PROGRESSION_META[m.previousPathId] || { technologyId: m.previousPathId };
    return prev.technologyId !== m.technologyId;
  });
  if (!crossMeta.length) {
    completed.push("No cross-technology level dependencies in progression config");
  } else {
    notCompleted.push(`Cross-tech level deps: ${crossMeta.map(([id]) => id).join(", ")}`);
  }

  const beginnerPaths = LEARNING_PATHS.filter((p) => !PROGRESSION_META[p.id]?.previousPathId);
  const allBeginnerOpen = await page.evaluate((ids) => {
    const paths = window.LEARNING_PATHS || [];
    return ids.every((id) => {
      const p = paths.find((x) => x.id === id);
      return p && window.isPathUnlocked(p);
    });
  }, beginnerPaths.map((p) => p.id));

  if (allBeginnerOpen) {
    completed.push(`All ${beginnerPaths.length} beginner technology levels open immediately`);
  } else {
    notCompleted.push("Some beginner levels are not immediately open");
  }

  await browser.close();
  console.log(JSON.stringify({ completed, notCompleted, ASSESSMENT_PASS_PERCENT }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
