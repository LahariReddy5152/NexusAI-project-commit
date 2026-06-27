/**
 * Static + module audit (no browser required)
 */
import { LEARNING_PATHS, getCurriculumForPath } from "../src/learn/learn-data.js";
import { PROJECT_BLUEPRINTS } from "../src/projects/projects-data.js";
import fs from "fs";

const PYTHON_PORTAL_TOPICS = [
  "Overview", "Variables", "Data Types", "Operators", "Loops", "Functions", "Collections",
  "OOP", "Exception Handling", "File Handling", "Decorators", "Generators", "Async", "FastAPI",
  "Projects", "Assignments", "Interview Questions", "Notes", "Diagrams", "Progress", "Quiz", "Resources"
];

const LESSON_SECTIONS = [
  "Overview", "Theory", "Architecture Diagram", "Flow Diagram", "Examples", "Code",
  "Exercises", "Quiz", "Mini Project", "Interview Questions", "Summary", "Resources", "Progress"
];

const PROJECT_SECTIONS = [
  "overview", "requirements", "architecture", "folderStructure", "frontend", "backend",
  "database", "api", "authentication", "deployment", "testing", "interviewQuestions"
];

const report = { completed: [], notCompleted: [] };

// Galaxy export check
const galaxySrc = fs.readFileSync("src/shared/animations/galaxy-background.js", "utf8");
if (galaxySrc.includes("export { NexusCosmosEngine")) {
  report.completed.push("Background code: NexusCosmosEngine export present (module can load)");
} else {
  report.notCompleted.push("Background code: missing NexusCosmosEngine export");
}

// Dashboard HTML check
const dash = fs.readFileSync("dashboard.html", "utf8");
const dashSection = dash.match(/id="dashboardSection"[\s\S]*?<\/div>\s*<div id="learnSection"/)?.[0] || "";
if (!/Resume Analyzer|Job Tracker|ATS Score|Resume Builder/i.test(dashSection)) {
  report.completed.push("Dashboard HTML: no Resume/ATS/Job Tracker widgets in dashboardSection");
} else {
  report.notCompleted.push("Dashboard HTML: career tools still inside dashboardSection");
}

// Career tabs
const careerRequired = ["Resume Analyzer", "ATS Score", "Resume Builder", "Job Tracker", "Career Roadmap", "Interview Recommendations"];
const missingCareer = careerRequired.filter((t) => !dash.includes(t));
if (!missingCareer.length) report.completed.push("Career HTML: all 6 tools present in markup");
else report.notCompleted.push(`Career HTML missing: ${missingCareer.join(", ")}`);

// VR single instance
const vrCount = (dash.match(/id="chatbotBox"/g) || []).length;
if (vrCount === 1) report.completed.push("VR HTML: single #chatbotBox instance");
else report.notCompleted.push(`VR HTML: ${vrCount} chatbotBox instances`);

// Learn paths count
report.completed.push(`Learn data: ${LEARNING_PATHS.length} technology paths defined`);

// Python portal topic coverage
const pyCurriculum = getCurriculumForPath("python-fundamentals");
const pyTitles = pyCurriculum.map((l) => l.title.toLowerCase());
const missingPyTopics = PYTHON_PORTAL_TOPICS.filter((t) => {
  if (t === "Overview" || t === "Projects" || t === "Assignments" || t === "Notes" || t === "Diagrams" || t === "Progress" || t === "Quiz" || t === "Resources" || t === "Interview Questions") return false;
  return !pyTitles.some((title) => title.includes(t.toLowerCase()));
});
if (missingPyTopics.length === 0) {
  report.completed.push(`Python curriculum: ${pyCurriculum.length} lessons covering core topic titles`);
} else {
  report.notCompleted.push(`Python curriculum missing lesson topics: ${missingPyTopics.join(", ")}`);
}

// Course portal tabs vs user spec
const courseTabs = ["Overview", "Roadmap", "Learning Path", "Modules", "Lessons", "Topics", "Videos", "Exercises", "Projects", "Quiz", "Resources", "Notes", "Progress", "Certificate"];
const missingPortalTabs = PYTHON_PORTAL_TOPICS.filter((t) => !courseTabs.some((ct) => ct.toLowerCase().includes(t.toLowerCase())) && !["Variables", "Data Types", "Operators", "Loops", "Functions", "Collections", "OOP", "Exception Handling", "File Handling", "Decorators", "Generators", "Async", "FastAPI"].includes(t));
if (missingPortalTabs.length) {
  report.notCompleted.push(`Learn course portal missing user-requested tabs: ${missingPortalTabs.join(", ")} (topics live under Lessons, not top-level nav)`);
}

// Auto-generated paths with only 8 template lessons
let templateOnly = 0;
let richPaths = 0;
const RICH = new Set(["python-fundamentals", "ai-fundamentals", "prompt-engineering"]);
for (const p of LEARNING_PATHS) {
  const cur = getCurriculumForPath(p.id);
  if (RICH.has(p.id)) {
    richPaths++;
    continue;
  }
  if (cur.length <= 10) templateOnly++;
}
report.notCompleted.push(`Learn content: ~${templateOnly} technologies use auto-generated 8-topic template lessons (not full unique portals)`);
report.completed.push(`Learn content: ${richPaths} paths with dedicated curriculum files (Python, AI Fundamentals, Prompt Engineering)`);

// Projects blueprints
const projectNames = Object.keys(PROJECT_BLUEPRINTS);
let projectsComplete = 0;
let projectsIncomplete = [];
for (const name of projectNames) {
  const bp = PROJECT_BLUEPRINTS[name];
  const missing = PROJECT_SECTIONS.filter((k) => !bp[k] || (typeof bp[k] === "string" && !bp[k].trim()));
  if (!missing.length) projectsComplete++;
  else projectsIncomplete.push(`${name}: ${missing.join(", ")}`);
}
if (projectsComplete === projectNames.length) {
  report.completed.push(`Projects data: all ${projectNames.length} blueprints have required section fields`);
} else {
  report.notCompleted.push(`Projects data incomplete: ${projectsIncomplete.join("; ")}`);
}
report.notCompleted.push("Projects UI: progress/score uses single localStorage key (not per-project)");

// Broken import check
const learnNav = fs.readFileSync("src/learn/learn-navigation.js", "utf8");
if (learnNav.includes('renderDailyChallenge')) {
  report.notCompleted.push("Learn navigation: broken renderDailyChallenge import (blocks entire app bootstrap)");
} else {
  report.completed.push("Learn navigation: renderDailyChallenge import removed (app modules can load)");
}

console.log(JSON.stringify(report, null, 2));
