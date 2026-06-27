import { LEARNING_PATHS, getCurriculumForPath, getPathProgressPercent, createStandardLesson } from "./learn-data.js";
import {
  isPathUnlocked,
  getProgressionMeta,
  getUnlockRequirements,
  getTechnologyLevels,
  getAssessmentScore
} from "./learn-progression.js";
import { currentPathId, completedLessons, activePathCategory, activePathDifficulty, setCurrentPathId, setCurrentLessonIndex, setCompletedLessons, setActivePathCategory, setActivePathDifficulty } from "./learn-state.js";
import { updateEl } from "../shared/helpers.js";
import { getPortalNav, findLessonIndexByTopic } from "./learn-portal-config.js";
import { renderCodeBlock } from "./learn-code.js";
import { enrichLesson } from "./learn-lesson-enrich.js";
import { getTechIcon, getStatusIcon } from "../shared/tech-icons.js";
import {
  renderTechnologyCatalog,
  backToCourseCatalog as workspaceBackToCatalog,
  openLearnWorkspace
} from "./learn-workspace.js";

let activeCourseTab = "";

function langForPath(pathId) {
  if (pathId.includes("java")) return "java";
  if (/javascript|react|typescript|node|express/.test(pathId)) return "javascript";
  if (/sql|postgresql/.test(pathId)) return "sql";
  if (pathId.includes("html")) return "html";
  if (pathId.includes("css")) return "css";
  return "python";
}
let activePortalNav = [];

export function loadCompletedLessons() {
  try {
    setCompletedLessons(JSON.parse(localStorage.getItem(`nexusCompleted_${currentPathId}`) || "[]"));
  } catch {
    setCompletedLessons([]);
  }
}

export function saveCompletedLessons() {
  localStorage.setItem(`nexusCompleted_${currentPathId}`, JSON.stringify(completedLessons));
}

export function getActiveCurriculum() {
  return getCurriculumForPath(currentPathId) || [];
}

export function renderCourseCatalog() {
  renderTechnologyCatalog();
}

export function filterPathCategory() {
  renderTechnologyCatalog();
}

export function backToCourseCatalog() {
  workspaceBackToCatalog();
}

export function openCourse(pathId) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  if (!path) return;
  if (!isPathUnlocked(path)) {
    showLockPreview(pathId);
    return;
  }
  const completed = JSON.parse(localStorage.getItem(`nexusCompleted_${pathId}`) || "[]");
  const curriculum = getCurriculumForPath(pathId);
  const nextIdx = curriculum.findIndex((_, i) => !completed.includes(i));
  openLearnWorkspace(pathId, nextIdx >= 0 ? nextIdx : 0);
}

export { openTechnology } from "./learn-workspace.js";

export function selectLearningPath(pathId) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  if (!path) return;
  document.getElementById("pathLockPreview")?.classList.add("hidden");
  setCurrentPathId(pathId);
  localStorage.setItem("nexusCurrentPath", pathId);
  setCurrentLessonIndex(null);
  loadCompletedLessons();
  activePortalNav = getPortalNav(pathId);
  activeCourseTab = activePortalNav[0]?.id || "";
  const titleEl = document.getElementById("activePathTitle");
  const subEl = document.getElementById("activePathSubtitle");
  if (titleEl) titleEl.textContent = path.title;
  if (subEl) subEl.textContent = path.subtitle;
  renderCourseNav();
  renderCoursePage();
  updateLearningPathProgress();
}

function renderCourseNav() {
  const nav = document.getElementById("courseNavTabs");
  if (!nav) return;
  nav.innerHTML = activePortalNav.map((item) =>
    `<button class="category-tab${item.id === activeCourseTab ? " active" : ""}" onclick="showCourseTab('${item.id}', event)">${item.label}</button>`
  ).join("");
}

export function showCourseTab(tab, event) {
  activeCourseTab = tab;
  document.querySelectorAll("#courseNavTabs .category-tab").forEach((t) => t.classList.remove("active"));
  if (event?.target) event.target.classList.add("active");
  else {
    document.querySelector(`#courseNavTabs .category-tab[onclick*="'${tab}'"]`)?.classList.add("active");
  }
  renderCourseTabContent(tab);
}

function renderTopicPanel(item, path, curriculum) {
  let idx = findLessonIndexByTopic(curriculum, item.topicTitle);
  let module = idx >= 0 ? curriculum[idx] : null;
  if (!module) {
    module = enrichLesson(
      createStandardLesson({ title: item.topicTitle, lang: langForPath(path.id) }),
      path.title
    );
    idx = -1;
  }
  const lang = module?.codeLang || langForPath(path.id);
  const openBtn = idx >= 0
    ? `<button class="primary-btn" onclick="openLesson(${idx})">Open Full Lesson →</button>`
    : "";
  return `<div class="glass-card portal-topic-card" data-portal="${path.id}" data-section="${item.id}">
    <p class="course-isolation-label">${path.title} portal · <strong>${item.label}</strong></p>
    <h3>${module.title}</h3>
    <p class="muted-text">${module.description}</p>
    <h4>Overview</h4><p>${module.overview || module.description}</p>
    <h4>Theory</h4><p>${module.theory || module.explanation}</p>
    <h4>Architecture Diagram</h4><pre class="diagram-block">${module.architectureDiagram || ""}</pre>
    <h4>Flow Diagram</h4><pre class="diagram-block">${module.flowDiagram || ""}</pre>
    <h4>Code</h4>${renderCodeBlock(module.practicalExample || module.syntax, lang)}
    <h4>Exercises</h4><p>${module.exercise || ""}</p>
    <h4>Mini Project</h4><p>${module.miniProject || ""}</p>
    <h4>Interview Questions</h4><ul>${(module.interviewQuestions || []).map((q) => `<li>${q}</li>`).join("")}</ul>
    <h4>Summary</h4><p>${module.summary || ""}</p>
    ${openBtn}
  </div>`;
}

function renderCourseTabContent(tab) {
  const path = LEARNING_PATHS.find((p) => p.id === currentPathId);
  const curriculum = getActiveCurriculum();
  const percent = getPathProgressPercent(currentPathId);
  const panel = document.getElementById("courseTabPanel");
  const navItem = activePortalNav.find((n) => n.id === tab) || activePortalNav[0];
  if (!panel || !path || !navItem) return;

  const type = navItem.type;

  if (type === "overview") {
    const beginner = curriculum.filter((m) => m.difficulty === "Beginner").length;
    const intermediate = curriculum.filter((m) => m.difficulty === "Intermediate").length;
    const advanced = curriculum.filter((m) => m.difficulty === "Advanced").length;
    const meta = getProgressionMeta(currentPathId);
    const techLevels = getTechnologyLevels(meta.technologyId);
    const levelsHtml = techLevels.map((lvl) => {
      const lm = getProgressionMeta(lvl.id);
      const unlocked = isPathUnlocked(lvl);
      const pct = getPathProgressPercent(lvl.id);
      const req = getUnlockRequirements(lvl.id);
      return `<div class="tech-level-card glass-card ${unlocked ? "" : "locked"}">
        ${unlocked ? "" : "<span class=\"lock-icon\">🔒</span>"}
        <h4>${lm.levelTitle}</h4>
        <p class="muted-text">${lvl.subtitle}</p>
        <p><strong>${pct}%</strong> complete</p>
        ${!unlocked && req ? `<p class="lock-hint">Unlock: complete ${req.previousLevelTitle} or pass assessment (${req.passPercent}%+)</p>
          <button class="glass-btn" onclick="event.stopPropagation();openPlacementAssessment('${req.previousPathId}')">Take Assessment</button>` : ""}
        ${unlocked ? `<button class="glass-btn" onclick="openCourse('${lvl.id}')">Open Level</button>` : `<button class="glass-btn" onclick="showLockPreview('${lvl.id}')">View Requirements</button>`}
      </div>`;
    }).join("");
    panel.innerHTML = `
      <div class="glass-card path-overview-card course-only-banner">
        <p class="course-isolation-label">Dedicated portal: <strong>${path.title}</strong> · ${meta.levelTitle}</p>
        <h3>Overview</h3>
        <p>${path.subtitle}</p>
        <p><strong>Levels in this technology:</strong> Beginner (${beginner}) · Intermediate (${intermediate}) · Advanced (${advanced})</p>
        <p><strong>Completion:</strong> ${percent}%</p>
        <button class="primary-btn" onclick="continueCourseLearning()">Continue Learning →</button>
      </div>
      ${techLevels.length > 1 ? `<div class="tech-levels-grid"><h3>Technology Progression</h3>${levelsHtml}</div>` : ""}`;
  } else if (type === "roadmap") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Roadmap</h3><ol>${curriculum.map((m, i) => `<li>${i + 1}. ${m.title} <span class="muted-text">(${m.difficulty})</span></li>`).join("")}</ol></div>`;
  } else if (type === "topic") {
    panel.innerHTML = renderTopicPanel(navItem, path, curriculum);
  } else if (type === "projects") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Projects</h3><ul>${curriculum.map((m) => `<li><strong>${m.title}</strong>: ${m.miniProject || "Apply concepts in a portfolio mini project."}</li>`).join("")}</ul></div>`;
  } else if (type === "assignments") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Assignments</h3><ul>${curriculum.map((m, i) => `<li><button class="glass-btn" onclick="openLesson(${i})">${m.title}</button>: ${m.assignment || ""}</li>`).join("")}</ul></div>`;
  } else if (type === "quiz") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Quiz</h3><ul>${curriculum.map((m, i) => `<li><button class="glass-btn" onclick="openLesson(${i})">${m.title} Quiz (${m.quizQuestions?.length || 5} questions)</button></li>`).join("")}</ul></div>`;
  } else if (type === "interview") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Interview Questions</h3><ul>${curriculum.flatMap((m) => (m.interviewQuestions || []).map((q) => `<li><strong>${m.title}:</strong> ${q}</li>`)).join("") || "<li>See topic sections for interview questions.</li>"}</ul></div>`;
  } else if (type === "resources") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Resources</h3><ul>${curriculum.flatMap((m) => (m.resources || []).map((r) => `<li>${m.title}: ${r}</li>`)).join("") || "<li>Official documentation and lesson references.</li>"}</ul></div>`;
  } else if (type === "notes") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Notes</h3>${curriculum.map((m, i) => `<details class="course-note-block"><summary>${m.title}</summary><p>${m.notes || m.summary || m.explanation?.slice(0, 300)}</p><button class="glass-btn" onclick="openLesson(${i})">Open lesson</button></details>`).join("")}</div>`;
  } else if (type === "progress") {
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} — ${navItem.label}</h3>
      <p>Completed: <strong>${completedLessons.length}</strong> / ${curriculum.length} lessons (${percent}%)</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
      <ul>${curriculum.map((m, i) => `<li>${completedLessons.includes(i) ? "✓" : "○"} ${m.title}</li>`).join("")}</ul></div>`;
  } else if (type === "certificate") {
    const earned = percent >= 80;
    panel.innerHTML = `<div class="glass-card"><h3>${path.title} Certificate</h3>
      <p>${earned ? `You earned the ${path.title} certificate.` : `Complete 80% to unlock. Current: ${percent}%`}</p>
      ${earned ? `<button class="glass-btn" onclick="alert('Certificate: NEX-${path.id.toUpperCase()}')">Download Certificate</button>` : ""}</div>`;
  }
}

export function renderCoursePage() {
  renderCourseTabContent(activeCourseTab);
}

export function continueCourseLearning() {
  const curriculum = getActiveCurriculum();
  const nextIdx = curriculum.findIndex((_, i) => !completedLessons.includes(i));
  openLesson(nextIdx >= 0 ? nextIdx : 0);
}

export function showLockPreview(pathId) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  if (!path) return;
  const req = getUnlockRequirements(pathId);
  const meta = getProgressionMeta(pathId);
  const curriculum = getCurriculumForPath(pathId);
  const preview = curriculum.slice(0, 4).map((m) => m.title).join(", ");
  const el = document.getElementById("pathLockPreview");
  if (!el) return;

  if (!req) {
    el.classList.add("hidden");
    return;
  }

  const assessScore = getAssessmentScore(req.previousPathId);
  el.classList.remove("hidden");
  el.innerHTML = `
    <h3>🔒 ${meta.levelTitle || path.title}</h3>
    <p class="lock-unlock-heading"><strong>Unlock by:</strong></p>
    <ul class="lock-unlock-list">
      <li>Completing <strong>${req.previousLevelTitle}</strong> (currently <strong>${req.previousCompletionPercent}%</strong>)</li>
      <li>OR passing the <strong>${req.previousLevelTitle} Assessment</strong> with <strong>${req.passPercent}%</strong> or higher${assessScore ? ` — your best: <strong>${assessScore}%</strong>` : ""}</li>
    </ul>
    <div class="lock-preview-actions">
      <button class="glass-btn" onclick="openPlacementAssessment('${req.previousPathId}')">Take ${req.previousLevelTitle} Assessment</button>
      <button class="glass-btn" onclick="openCourse('${req.previousPathId}')">Go to ${req.previousLevelTitle}</button>
    </div>
    <p class="muted-text"><strong>Preview:</strong> ${preview}${curriculum.length > 4 ? "…" : ""}</p>`;
}

export function initializeLearningPortal() {
  const legacy = localStorage.getItem("pythonCompletedLessons");
  if (legacy && !localStorage.getItem("nexusCompleted_python-fundamentals")) {
    localStorage.setItem("nexusCompleted_python-fundamentals", legacy);
  }
  backToCourseCatalog();
}

export function renderModulesGrid() {
  const grid = document.getElementById("pathModulesGrid");
  if (!grid) return;
  const curriculum = getActiveCurriculum().filter((m) =>
    activePathDifficulty === "all" || m.difficulty === activePathDifficulty
  );
  if (!curriculum.length) {
    grid.innerHTML = "<p class='muted-text'>No modules at this difficulty level.</p>";
    return;
  }
  const full = getActiveCurriculum();
  grid.innerHTML = curriculum.map((module) => {
    const index = full.indexOf(module);
    const isCompleted = completedLessons.includes(index);
    return `<div class="module-card-learning glass-card ${isCompleted ? "completed" : ""}" onclick="openLesson(${index})">
      <h3>${module.title}</h3>
      <p class="module-description">${module.description}</p>
      <div class="module-meta">
        <span class="module-badge">${module.difficulty}</span>
        <span class="module-duration">${module.duration}</span>
      </div>
    </div>`;
  }).join("");
}

export function updateLearningPathProgress() {
  const curriculum = getActiveCurriculum();
  const completed = completedLessons.length;
  const total = curriculum.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const estRemain = (total - completed) * 18;

  updateEl("pathModulesCompleted", completed);
  updateEl("pathTotalModules", total);
  updateEl("pathProgressPercent", `${percent}%`);
  const bar = document.getElementById("pathProgressBar");
  if (bar) bar.style.width = `${percent}%`;
  const estEl = document.getElementById("pathEstimatedTime");
  if (estEl) estEl.textContent = estRemain > 60 ? `~${Math.ceil(estRemain / 60)}h left` : `~${estRemain}m left`;
}

export function renderLearningPathTabs() {
  renderCourseCatalog();
}

export function renderPathOverview() {
  renderCourseTabContent("overview");
}