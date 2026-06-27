/**
 * Phase 2 — Learn workspace: 3-panel layout, persistent lesson sidebar
 */
import { LEARNING_PATHS, getCurriculumForPath, getPathProgressPercent } from "./learn-data.js";
import {
  isPathUnlocked,
  getProgressionMeta,
  getUnlockRequirements,
  getAssessmentScore,
  ASSESSMENT_PASS_PERCENT
} from "./learn-progression.js";
import {
  TECHNOLOGY_GROUPS,
  getAggregateProgress,
  getPrimaryLevel,
  getTechIconForGroup
} from "./learn-technologies.js";
import { getTechIcon, getStatusIcon } from "../shared/tech-icons.js";
import { saveRemoteStateDebounced } from "../shared/user-persistence.js";
import { getToken } from "../shared/api-client.js";
import {
  currentPathId,
  currentLessonIndex,
  completedLessons,
  setCurrentPathId,
  setCurrentLessonIndex,
  setCompletedLessons
} from "./learn-state.js";
import {
  breadcrumbForCatalog,
  breadcrumbForTechnology,
  breadcrumbForLevel,
  breadcrumbForLesson
} from "./learn-breadcrumb.js";
import { updateEl } from "../shared/helpers.js";

const WORKSPACE_EXTRAS = [
  { id: "projects", label: "Projects" },
  { id: "interview", label: "Interview Questions" }
];

let activeTechId = null;
let activeExtraId = null;
let learnSearchQuery = "";
let learnActiveFilter = "all";

export const LEARN_FEATURED_FILTERS = [
  { id: "all", label: "All" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "javascript", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "spring-boot", label: "Spring Boot" },
  { id: "sql", label: "SQL" },
  { id: "ai", label: "Machine Learning" },
  { id: "rag", label: "Generative AI" },
  { id: "prompt-engineering", label: "Prompt Engineering" },
  { id: "system-design", label: "System Design" }
];

function filterTechnologyGroups(groups) {
  let list = groups;
  if (learnActiveFilter !== "all") {
    list = list.filter((t) => t.id === learnActiveFilter);
  }
  if (learnSearchQuery.trim()) {
    const q = learnSearchQuery.trim().toLowerCase();
    list = list.filter((t) => t.name.toLowerCase().includes(q) || t.id.includes(q));
  }
  return list;
}

export function setLearnSearch(query) {
  learnSearchQuery = query;
  renderTechnologyCatalog();
}

export function setLearnFilter(filterId) {
  learnActiveFilter = filterId;
  document.querySelectorAll(".learn-filter-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === filterId);
  });
  renderTechnologyCatalog();
}

export function initLearnToolbar() {
  const search = document.getElementById("learnSearchInput");
  const chips = document.getElementById("learnFilterChips");
  search?.addEventListener("input", (e) => setLearnSearch(e.target.value));
  if (chips && !chips.innerHTML) {
    chips.innerHTML = LEARN_FEATURED_FILTERS.map(
      (f) => `<button type="button" class="learn-filter-chip${f.id === "all" ? " active" : ""}" data-filter="${f.id}" onclick="setLearnFilter('${f.id}')">${f.label}</button>`
    ).join("");
  }
}

function loadCompletedForPath(pathId) {
  try {
    setCompletedLessons(JSON.parse(localStorage.getItem(`nexusCompleted_${pathId}`) || "[]"));
  } catch {
    setCompletedLessons([]);
  }
}

function activatePath(pathId) {
  document.getElementById("pathLockPreview")?.classList.add("hidden");
  setCurrentPathId(pathId);
  localStorage.setItem("nexusCurrentPath", pathId);
  setCurrentLessonIndex(null);
  loadCompletedForPath(pathId);
}

function showView(viewId) {
  ["learnCatalogView", "learnLevelView", "learnWorkspaceView"].forEach((id) => {
    document.getElementById(id)?.classList.toggle("hidden", id !== viewId);
  });
}

export function renderTechnologyCatalog() {
  const grid = document.getElementById("courseCatalogGrid");
  if (!grid) return;
  showView("learnCatalogView");
  breadcrumbForCatalog();
  initLearnToolbar();
  const groups = filterTechnologyGroups(TECHNOLOGY_GROUPS);
  if (!groups.length) {
    grid.innerHTML = `<p class="muted-text">No courses match your search. Try another filter.</p>`;
    return;
  }
  grid.innerHTML = groups.map((tech) => {
    const progress = getAggregateProgress(tech.paths);
    const levelLabel = getPrimaryLevel(tech.paths);
    const beginnerPath = LEARNING_PATHS.find((p) => p.id === tech.paths[0]);
    const unlocked = beginnerPath ? isPathUnlocked(beginnerPath) : true;
    const icon = getTechIconForGroup(tech.id);
    const status = getStatusIcon(progress, unlocked);
    const pathId = tech.paths[0];
    return `<div class="course-catalog-card glass-card tech-card" data-tech-id="${tech.id}" role="button" tabindex="0">
      <div class="course-card-header">
        <span class="tech-logo">${icon}</span>
        <span class="status-icon">${status}</span>
      </div>
      <h3>${tech.name}</h3>
      <span class="level-badge level-beginner">${levelLabel}</span>
      <div class="glass-progress catalog-progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="course-catalog-meta">
        <span>${tech.paths.length} level${tech.paths.length > 1 ? "s" : ""}</span>
        <span class="course-pct">${progress}% complete</span>
      </div>
      <button type="button" class="glass-btn course-continue-btn" onclick="event.stopPropagation(); ${unlocked ? `openCourse('${pathId}')` : `openTechnology('${tech.id}')`}">${progress > 0 ? "Continue Learning →" : "Start Course →"}</button>
    </div>`;
  }).join("");
  grid.querySelectorAll(".course-catalog-card").forEach((card) => {
    const techId = card.dataset.techId;
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      openTechnology(techId);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openTechnology(techId);
      }
    });
  });
}

export function openTechnology(techId) {
  activeTechId = techId;
  const tech = TECHNOLOGY_GROUPS.find((t) => t.id === techId);
  if (!tech) return;
  showView("learnLevelView");
  breadcrumbForTechnology(tech.name, techId);

  const logo = document.getElementById("techLevelLogo");
  const title = document.getElementById("techLevelTitle");
  const sub = document.getElementById("techLevelSubtitle");
  if (logo) logo.textContent = getTechIconForGroup(techId);
  if (title) title.textContent = tech.name;
  if (sub) sub.textContent = "Select your level — beginner opens immediately; higher levels unlock via completion or assessment.";

  const grid = document.getElementById("techLevelGrid");
  if (!grid) return;
  grid.innerHTML = tech.paths.map((pathId) => {
    const path = LEARNING_PATHS.find((p) => p.id === pathId);
    if (!path) return "";
    const unlocked = isPathUnlocked(path);
    const progress = getPathProgressPercent(pathId);
    const meta = getProgressionMeta(pathId);
    const req = getUnlockRequirements(pathId);
    const assessScore = req ? getAssessmentScore(req.previousPathId) : 0;
    return `<div class="tech-level-card glass-card ${unlocked ? "" : "locked"}" onclick="${unlocked ? `openCourse('${pathId}')` : `showLockPreview('${pathId}')`}">
      ${unlocked ? "" : '<span class="lock-icon">🔒</span>'}
      <span class="level-badge level-${meta.level}">${meta.levelTitle}</span>
      <p class="muted-text">${path.subtitle}</p>
      <p class="course-pct"><strong>${progress}%</strong> complete</p>
      ${!unlocked && req ? `<p class="lock-hint">Complete ${req.previousLevelTitle} or pass assessment (${ASSESSMENT_PASS_PERCENT}%+)</p>
        <button class="glass-btn" onclick="event.stopPropagation();openPlacementAssessment('${req.previousPathId}')">Take Assessment</button>` : ""}
      ${unlocked ? `<button class="glass-btn" onclick="event.stopPropagation();openCourse('${pathId}')">Start Learning →</button>` : ""}
    </div>`;
  }).join("");
}

export function openLearnWorkspace(pathId, lessonIndex = 0) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  if (!path || !isPathUnlocked(path)) {
    if (typeof window.showLockPreview === "function") window.showLockPreview(pathId);
    return;
  }
  activatePath(pathId);
  showView("learnWorkspaceView");
  renderWorkspaceChrome(pathId);
  openWorkspaceLesson(lessonIndex);
}

export function renderWorkspaceChrome(pathId) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  const meta = getProgressionMeta(pathId);
  const progress = getPathProgressPercent(pathId);
  const icon = getTechIcon(pathId, path?.title);

  updateEl("workspaceTechLogo", icon);
  updateEl("workspaceCourseTitle", meta.levelTitle || path?.title);
  updateEl("workspaceProgressPct", `${progress}% complete`);

  const bar = document.getElementById("workspaceProgressBar");
  if (bar) bar.style.width = `${progress}%`;

  renderWorkspaceSidebar(pathId);
  breadcrumbForLevel(pathId);
}

export function renderWorkspaceSidebar(pathId) {
  const list = document.getElementById("workspaceLessonList");
  if (!list) return;
  const curriculum = getCurriculumForPath(pathId);
  loadCompletedForPath(pathId);

  const lessonItems = curriculum.map((mod, i) => {
    const done = completedLessons.includes(i);
    const active = currentLessonIndex === i && !activeExtraId;
    return `<li class="workspace-lesson-item ${active ? "active" : ""} ${done ? "completed" : ""}" onclick="openWorkspaceLesson(${i})">
      <span class="lesson-status">${done ? "✓" : "○"}</span>
      <span class="lesson-label">${mod.title}</span>
    </li>`;
  }).join("");

  const extraItems = WORKSPACE_EXTRAS.map((ex) => {
    const active = activeExtraId === ex.id;
    return `<li class="workspace-lesson-item workspace-extra ${active ? "active" : ""}" onclick="openWorkspaceExtra('${ex.id}')">
      <span class="lesson-status">★</span>
      <span class="lesson-label">${ex.label}</span>
    </li>`;
  }).join("");

  list.innerHTML = lessonItems + extraItems;
}

export function openWorkspaceLesson(index) {
  const curriculum = getCurriculumForPath(currentPathId);
  const module = curriculum[index];
  if (!module) return;

  activeExtraId = null;
  setCurrentLessonIndex(index);
  const session = { pathId: currentPathId, index };
  localStorage.setItem("nexusLastLesson", JSON.stringify(session));
  localStorage.setItem("nexusCurrentPath", currentPathId);
  if (getToken()) {
    saveRemoteStateDebounced("learn_session", session);
  }

  breadcrumbForLesson(currentPathId, module.title);
  renderWorkspaceSidebar(currentPathId);

  const center = document.getElementById("lessonContent");
  if (center) {
    center.innerHTML = `<header class="lesson-content-header">
      <h1 class="lesson-content-title">${module.title}</h1>
      <p class="lesson-content-desc">${module.description}</p>
      <div class="lesson-meta-inline">
        <span class="level-badge level-${(module.difficulty || "beginner").toLowerCase()}">${module.difficulty || "Beginner"}</span>
        <span class="lesson-duration">${module.duration || "20 min"}</span>
      </div>
    </header><div class="lesson-sections" id="lessonSections"></div>`;
  }

  import("./learn-lessons.js").then(({ renderLessonContent, updateMarkCompleteButton }) => {
    renderLessonContent(module);
    updateMarkCompleteButton();
  });
  updateRightPanel(module, index, curriculum.length);
}

export function openWorkspaceExtra(extraId) {
  activeExtraId = extraId;
  setCurrentLessonIndex(null);
  const path = LEARNING_PATHS.find((p) => p.id === currentPathId);
  const curriculum = getCurriculumForPath(currentPathId);
  const label = WORKSPACE_EXTRAS.find((e) => e.id === extraId)?.label || extraId;
  breadcrumbForLesson(currentPathId, label);
  renderWorkspaceSidebar(currentPathId);

  const center = document.getElementById("lessonContent");
  if (!center) return;

  if (extraId === "projects") {
    center.innerHTML = `<header class="lesson-content-header"><h1 class="lesson-content-title">Projects</h1></header>
      <div class="lesson-sections"><ul class="rec-list">${curriculum.map((m) => `<li><strong>${m.title}</strong>: ${m.miniProject || "Apply concepts in a portfolio mini project."}</li>`).join("")}</ul></div>`;
  } else {
    center.innerHTML = `<header class="lesson-content-header"><h1 class="lesson-content-title">Interview Questions</h1></header>
      <div class="lesson-sections"><ul class="rec-list">${curriculum.flatMap((m) => (m.interviewQuestions || []).map((q) => `<li><strong>${m.title}:</strong> ${q}</li>`)).join("") || "<li>See individual lessons for interview questions.</li>"}</ul></div>`;
  }

  updateEl("rightPanelLessonStatus", "Supplementary content");
  updateEl("rightPanelEstTime", path?.title || "");
  const prevBtn = document.getElementById("rightPanelPrevBtn");
  const nextBtn = document.getElementById("rightPanelNextBtn");
  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = true;
}

function updateRightPanel(module, index, total) {
  const done = completedLessons.includes(index);
  updateEl("rightPanelLessonStatus", done ? "✓ Completed" : "In progress");
  updateEl("rightPanelEstTime", module.duration || "20 min");
  updateEl("rightPanelLessonIndex", `Lesson ${index + 1} of ${total}`);

  const nextTitle = document.getElementById("rightPanelNextTitle");
  const prevTitle = document.getElementById("rightPanelPrevTitle");
  const curriculum = getCurriculumForPath(currentPathId);
  if (nextTitle) nextTitle.textContent = index < total - 1 ? curriculum[index + 1]?.title : "—";
  if (prevTitle) prevTitle.textContent = index > 0 ? curriculum[index - 1]?.title : "—";

  const prevBtn = document.getElementById("rightPanelPrevBtn");
  const nextBtn = document.getElementById("rightPanelNextBtn");
  if (prevBtn) prevBtn.disabled = index <= 0;
  if (nextBtn) nextBtn.disabled = index >= total - 1;
}

export function backToCourseCatalog() {
  activeTechId = null;
  activeExtraId = null;
  setCurrentLessonIndex(null);
  document.getElementById("pathLockPreview")?.classList.add("hidden");
  showView("learnCatalogView");
  renderTechnologyCatalog();
}

export function backToTechnologyLevels() {
  if (activeTechId) openTechnology(activeTechId);
  else backToCourseCatalog();
}

// Re-export for openCourse compatibility
export function openCourseFromWorkspace(pathId) {
  openLearnWorkspace(pathId, 0);
}
