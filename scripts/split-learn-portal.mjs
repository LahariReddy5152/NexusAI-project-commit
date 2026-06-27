import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const raw = fs.readFileSync(path.join(root, "src/learn/learn-portal.raw.js"), "utf8");
const lines = raw.split(/\r?\n/);

function slice(start, end) {
  return lines.slice(start - 1, end).join("\n");
}

function wrap(content, header) {
  const body = content.replace(/^function (\w+)/gm, "export function $1");
  return header + body + "\n";
}

const splits = [
  ["src/learn/learn-code.js", 8, 35, `import { escapeHtml } from "../shared/helpers.js";\n\n`],
  ["src/learn/learn-navigation.js", 37, 145, `import { LEARNING_PATHS, getCurriculumForPath, getPathProgressPercent, isPathUnlocked } from "./learn-data.js";\nimport { currentPathId, completedLessons, activePathCategory, setCurrentPathId, setCurrentLessonIndex, setCompletedLessons, setActivePathCategory } from "./learn-state.js";\nimport { updateEl } from "../shared/helpers.js";\nimport { renderDailyChallenge } from "../dashboard/dashboard-challenge-render.js";\n\n`],
  ["src/learn/learn-lessons.js", 149, 336, `import { getCurriculumForPath } from "./learn-data.js";\nimport { currentPathId, currentLessonIndex, completedLessons, setCurrentLessonIndex } from "./learn-state.js";\nimport { renderCodeBlock } from "./learn-code.js";\nimport { loadCompletedLessons, saveCompletedLessons, getActiveCurriculum, renderModulesGrid, updateLearningPathProgress, renderLearningPathTabs } from "./learn-navigation.js";\nimport { logActivity, awardPoints, recordLessonToday } from "../dashboard/dashboard-activity.js";\nimport { syncDashboardFromProgress } from "../dashboard/dashboard-sync.js";\n\n`],
  ["src/dashboard/dashboard-activity.js", 273, 310, `import { LEARNING_PATHS, getCurriculumForPath } from "../learn/learn-data.js";\n\n`],
  ["src/dashboard/dashboard-sync.js", 320, 415, `import { LEARNING_PATHS, getCurriculumForPath, getPathProgressPercent } from "../learn/learn-data.js";\nimport { updateEl, getTimeGreeting } from "../shared/helpers.js";\nimport { renderRecentActivity } from "./dashboard-activity.js";\nimport { renderDailyChallenge } from "./dashboard-challenge-render.js";\nimport { showSection } from "../app/app-navigation.js";\nimport { selectLearningPath } from "../learn/learn-navigation.js";\nimport { openLesson } from "../learn/learn-lessons.js";\nimport { logActivity } from "./dashboard-activity.js";\n\n`],
  ["src/dashboard/dashboard-greeting.js", 417, 453, `import { updateEl, getTimeGreeting } from "../shared/helpers.js";\nimport { getNextLessonInfo } from "./dashboard-sync.js";\n\n`],
  ["src/virtual-recruiter/vr-ui.js", 384, 474, `import { LEARNING_PATHS, getPathProgressPercent } from "../learn/learn-data.js";\nimport { getOverallProgress, getNextLessonInfo, getLessonsToday } from "../dashboard/dashboard-sync.js";\n\n`],
  ["src/career/career-panels.js", 476, 502, `import { logActivity } from "../dashboard/dashboard-activity.js";\nimport { renderVirtualRecruiterGreeting } from "../virtual-recruiter/vr-ui.js";\n\n`],
  ["src/interview/interview-tracks.js", 504, 526, `import { openInterviewPrepCard } from "./interview-prep.js";\n\n`]
];

for (const [out, start, end, header] of splits) {
  const content = slice(start, end);
  fs.writeFileSync(path.join(root, out), wrap(content, header));
  console.log("wrote", out, end - start + 1, "lines");
}

// Fix learn-navigation: uses currentPathId as assignment - need to use setCurrentPathId
let nav = fs.readFileSync(path.join(root, "src/learn/learn-navigation.js"), "utf8");
nav = nav.replace(
  /currentPathId = pathId;\s*\n\s*localStorage\.setItem\("nexusCurrentPath", pathId\);/,
  "setCurrentPathId(pathId);"
);
nav = nav.replace(/currentLessonIndex = null;/g, "setCurrentLessonIndex(null);");
nav = nav.replace(/currentLessonIndex = index;/g, "setCurrentLessonIndex(index);");
nav = nav.replace(/activePathCategory = category;/g, "setActivePathCategory(category);");
nav = nav.replace(/completedLessons = JSON\.parse/g, "setCompletedLessons(JSON.parse");
// fix loadCompletedLessons - need different approach
nav = nav.replace(
  /export function loadCompletedLessons\(\) \{\s*try \{\s*setCompletedLessons\(JSON\.parse\(localStorage\.getItem\(`nexusCompleted_\$\{currentPathId\}`\) \|\| "\[\]"\)\);\s*\} catch \{ completedLessons = \[\]; \}\s*\}/,
  `export function loadCompletedLessons() {
  try {
    setCompletedLessons(JSON.parse(localStorage.getItem(\`nexusCompleted_\${currentPathId}\`) || "[]"));
  } catch {
    setCompletedLessons([]);
  }
}`
);
fs.writeFileSync(path.join(root, "src/learn/learn-navigation.js"), nav);

console.log("learn portal split complete");
