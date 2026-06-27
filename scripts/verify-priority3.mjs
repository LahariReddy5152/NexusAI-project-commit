/**
 * Priority 3 — Lesson depth and content quality (6 priority technologies)
 */
import { chromium } from "playwright";
import { getCurriculumForPath } from "../src/learn/learn-data.js";
import { hasBoilerplate } from "../src/learn/content/lesson-builder.js";

const BASE = "http://localhost:5000";

const PRIORITY_PATHS = [
  { id: "python-fundamentals", label: "Python", sampleTopics: ["Variables", "Joins"] },
  { id: "sql", label: "SQL", sampleTopics: ["SQL Fundamentals", "Joins"] },
  { id: "java-fundamentals", label: "Java", sampleTopics: ["Core Java", "OOP"] },
  { id: "spring-boot", label: "Spring Boot", sampleTopics: ["Spring Boot Setup", "REST Controllers"] },
  { id: "ai-fundamentals", label: "AI Fundamentals", sampleTopics: ["ML Foundations", "Neural Networks"] },
  { id: "prompt-engineering", label: "Prompt Engineering", sampleTopics: ["Prompt Basics", "Chain of Thought"] }
];

const REQUIRED_STRING_FIELDS = [
  "overview", "theory", "explanation", "realWorldExample",
  "architectureDiagram", "flowDiagram", "exercise", "assignment",
  "miniProject", "summary"
];

const REQUIRED_ARRAY_FIELDS = [
  "quizQuestions", "interviewQuestions", "resources", "bestPractices", "commonMistakes"
];

const PLACEHOLDER_PATTERNS = [
  /concept flow diagram for this topic/i,
  /learn → practice → apply/i,
  /apply this topic in a small portfolio project/i,
  /review key concepts and complete the exercise/i,
  /is a core skill for ai engineers/i,
  /this lesson covers .+ in depth for engineers building data-backed/i
];

function validateCurriculumStatic(pathId, label) {
  const issues = [];
  const curriculum = getCurriculumForPath(pathId);
  if (!curriculum.length) {
    issues.push(`${label}: empty curriculum`);
    return issues;
  }

  const overviewSet = new Set();
  let duplicateOverviews = 0;

  curriculum.forEach((lesson, i) => {
    for (const field of REQUIRED_STRING_FIELDS) {
      const val = lesson[field];
      if (!val || String(val).trim().length < 12) {
        issues.push(`${label} "${lesson.title}": missing/short ${field}`);
      }
      if (hasBoilerplate(val)) {
        issues.push(`${label} "${lesson.title}": boilerplate in ${field}`);
      }
    }
    for (const field of REQUIRED_ARRAY_FIELDS) {
      const arr = lesson[field];
      if (!Array.isArray(arr) || arr.length < 1) {
        issues.push(`${label} "${lesson.title}": empty ${field}`);
      }
    }
    if (!lesson.quizQuestions || lesson.quizQuestions.length < 2) {
      issues.push(`${label} "${lesson.title}": quiz needs 2+ questions`);
    }
    if (!lesson.practicalExample && !lesson.syntax) {
      issues.push(`${label} "${lesson.title}": missing code example`);
    }
    const diagram = lesson.architectureDiagram || "";
    if (diagram.length < 20) {
      issues.push(`${label} "${lesson.title}": architecture diagram too short`);
    }

    const ovKey = (lesson.overview || "").slice(0, 80);
    if (overviewSet.has(ovKey)) duplicateOverviews++;
    overviewSet.add(ovKey);
  });

  if (duplicateOverviews > 2) {
    issues.push(`${label}: ${duplicateOverviews} duplicate overview prefixes`);
  }

  return issues;
}

async function validateLessonInBrowser(page, pathId, lessonIndex) {
  await page.evaluate(({ pathId, lessonIndex }) => {
    window.openCourse(pathId);
    window.openLesson(lessonIndex);
  }, { pathId, lessonIndex });
  await page.waitForSelector("#lessonView:not(.hidden)", { timeout: 10000 });
  await page.waitForTimeout(400);

  const content = await page.locator("#lessonContent").innerText();
  const issues = [];

  const requiredHeadings = [
    "Overview", "Theory", "Architecture Diagram", "Flow Diagram",
    "Explanation", "Exercises", "Assignment", "Quiz", "Mini Project",
    "Interview Questions", "Summary", "Resources", "Progress Tracking"
  ];
  for (const h of requiredHeadings) {
    if (!content.includes(h)) issues.push(`missing heading: ${h}`);
  }

  for (const pat of PLACEHOLDER_PATTERNS) {
    if (pat.test(content)) issues.push(`placeholder text: ${pat}`);
  }

  const diagrams = await page.locator("#lessonContent .diagram-block").allTextContents();
  if (diagrams.length < 2 || diagrams.some((d) => d.trim().length < 10)) {
    issues.push("diagram blocks missing or empty");
  }

  const quizCount = await page.locator("#lessonContent .quiz-container").count();
  if (quizCount < 2) issues.push(`quiz containers: ${quizCount}`);

  const miniProjectText = await page.locator("#section-miniproject + p, #section-miniproject ~ p").first().innerText().catch(() => "");
  if (miniProjectText.trim().length < 15) {
    issues.push("mini project section empty");
  }

  const assignmentText = await page.locator("#section-assignment + p, #section-assignment ~ p").first().innerText().catch(() => "");
  if (assignmentText.trim().length < 15) {
    issues.push("assignment section empty");
  }

  return issues;
}

async function main() {
  const staticIssues = [];
  for (const p of PRIORITY_PATHS) {
    staticIssues.push(...validateCurriculumStatic(p.id, p.label));
  }

  let browser;
  let browserIssues = [];
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

    for (const p of PRIORITY_PATHS) {
      const curriculum = getCurriculumForPath(p.id);
      const indices = [0, Math.floor(curriculum.length / 2), curriculum.length - 1]
        .filter((v, i, a) => a.indexOf(v) === i);

      for (const idx of indices) {
        const lessonIssues = await validateLessonInBrowser(page, p.id, idx);
        if (lessonIssues.length) {
          browserIssues.push(`${p.label} lesson[${idx}] (${curriculum[idx]?.title}): ${lessonIssues.join("; ")}`);
        }
      }

      await page.evaluate(() => window.backToLearningPath?.());
      await page.evaluate(() => {
        document.getElementById("lessonView")?.classList.add("hidden");
        document.getElementById("learnCourseView")?.classList.add("hidden");
        document.getElementById("learnCatalogView")?.classList.remove("hidden");
      });
      await page.waitForTimeout(200);
    }

    await browser.close();
  } catch (e) {
    if (browser) await browser.close();
    console.log("BLOCKED");
    console.error(e.message || e);
    process.exit(2);
  }

  const allIssues = [...staticIssues, ...browserIssues];
  if (allIssues.length) {
    console.log("NOT COMPLETED");
    allIssues.forEach((i) => console.error(`- ${i}`));
    process.exit(1);
  }

  console.log("COMPLETED");
}

main().catch((e) => {
  console.log("BLOCKED");
  console.error(e);
  process.exit(2);
});
