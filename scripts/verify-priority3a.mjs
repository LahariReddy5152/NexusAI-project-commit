/**
 * Priority 3A — Python, SQL, Java lesson depth only
 */
import { chromium } from "playwright";
import { getCurriculumForPath } from "../src/learn/learn-data.js";
import { hasBoilerplate } from "../src/learn/content/lesson-builder.js";

const BASE = "http://localhost:5000";

const PATHS = [
  { id: "python-fundamentals", label: "Python" },
  { id: "sql", label: "SQL" },
  { id: "java-fundamentals", label: "Java" }
];

const REQUIRED_STRING_FIELDS = [
  "overview", "theory", "explanation", "realWorldExample",
  "architectureDiagram", "flowDiagram", "exercise", "assignment",
  "miniProject", "summary"
];

const REQUIRED_ARRAY_FIELDS = [
  "quizQuestions", "interviewQuestions", "resources", "bestPractices", "commonMistakes"
];

const TEMPLATE_PATTERNS = [
  /is essential for backend java engineers/i,
  /java \w+ apis integrate with the standard library/i,
  /this lesson walks through \w+ with syntax/i,
  /microservices use \w+ when processing requests/i,
  /concept flow diagram for this topic/i,
  /learn → practice → apply/i,
  /is a core skill for ai engineers/i
];

const PLACEHOLDER_PATTERNS = [
  /concept flow diagram for this topic/i,
  /apply this topic in a small portfolio project/i,
  /review key concepts and complete the exercise/i
];

function validateStatic(pathId, label) {
  const issues = [];
  const curriculum = getCurriculumForPath(pathId);
  if (!curriculum.length) return [`${label}: empty curriculum`];

  const overviews = new Map();

  for (const lesson of curriculum) {
    for (const field of REQUIRED_STRING_FIELDS) {
      const val = lesson[field];
      if (!val || String(val).trim().length < 12) {
        issues.push(`${label} "${lesson.title}": missing/short ${field}`);
      }
      if (hasBoilerplate(val)) {
        issues.push(`${label} "${lesson.title}": boilerplate in ${field}`);
      }
      for (const pat of TEMPLATE_PATTERNS) {
        if (pat.test(String(val || ""))) {
          issues.push(`${label} "${lesson.title}": template text in ${field}`);
        }
      }
    }
    for (const field of REQUIRED_ARRAY_FIELDS) {
      if (!Array.isArray(lesson[field]) || lesson[field].length < 1) {
        issues.push(`${label} "${lesson.title}": empty ${field}`);
      }
    }
    if (!lesson.quizQuestions || lesson.quizQuestions.length < 2) {
      issues.push(`${label} "${lesson.title}": quiz needs 2+ questions`);
    }
    if (!lesson.practicalExample && !lesson.syntax) {
      issues.push(`${label} "${lesson.title}": missing code example`);
    }
    if ((lesson.architectureDiagram || "").length < 20) {
      issues.push(`${label} "${lesson.title}": architecture diagram too short`);
    }

    const ov = (lesson.overview || "").trim();
    if (overviews.has(ov)) {
      issues.push(`${label}: duplicate overview — "${lesson.title}" vs "${overviews.get(ov)}"`);
    } else {
      overviews.set(ov, lesson.title);
    }
  }

  return issues;
}

async function validateBrowser(page, pathId, label, curriculum) {
  const issues = [];
  for (let idx = 0; idx < curriculum.length; idx++) {
    await page.evaluate(({ pathId, lessonIndex }) => {
      window.openCourse(pathId);
      window.openLesson(lessonIndex);
    }, { pathId, lessonIndex: idx });
    await page.waitForSelector("#lessonView:not(.hidden)", { timeout: 10000 });
    await page.waitForTimeout(250);

    const content = await page.locator("#lessonContent").innerText();
    const title = curriculum[idx].title;

    for (const h of ["Overview", "Theory", "Architecture Diagram", "Assignment", "Quiz", "Mini Project", "Progress Tracking"]) {
      if (!content.includes(h)) issues.push(`${label} "${title}": missing ${h}`);
    }
    for (const pat of PLACEHOLDER_PATTERNS) {
      if (pat.test(content)) issues.push(`${label} "${title}": placeholder in page`);
    }

    const diagrams = await page.locator("#lessonContent .diagram-block").allTextContents();
    if (diagrams.length < 2 || diagrams.some((d) => d.trim().length < 10)) {
      issues.push(`${label} "${title}": diagrams missing`);
    }

    const quizCount = await page.locator("#lessonContent .quiz-container").count();
    if (quizCount < 2) issues.push(`${label} "${title}": quiz count ${quizCount}`);

    const mini = await page.locator("#section-miniproject + p").first().innerText().catch(() => "");
    const assign = await page.locator("#section-assignment + p").first().innerText().catch(() => "");
    if (mini.trim().length < 15) issues.push(`${label} "${title}": mini project empty`);
    if (assign.trim().length < 15) issues.push(`${label} "${title}": assignment empty`);

    await page.evaluate(() => {
      document.getElementById("lessonView")?.classList.add("hidden");
      document.getElementById("learnCourseView")?.classList.add("hidden");
      document.getElementById("learnCatalogView")?.classList.remove("hidden");
    });
    await page.waitForTimeout(100);
  }
  return issues;
}

async function main() {
  const issues = [];
  for (const p of PATHS) {
    issues.push(...validateStatic(p.id, p.label));
  }

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
    await page.click("button.nav-btn:has-text('Learn')");
    await page.waitForSelector("#courseCatalogGrid .course-catalog-card", { timeout: 15000 });

    for (const p of PATHS) {
      const curriculum = getCurriculumForPath(p.id);
      issues.push(...await validateBrowser(page, p.id, p.label, curriculum));
    }
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
