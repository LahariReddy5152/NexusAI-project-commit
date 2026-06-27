import { LEARNING_PATHS, getCurriculumForPath, getPathProgressPercent } from "../learn/learn-data.js";
import { updateEl } from "../shared/helpers.js";
import { getOverallProgress } from "./dashboard-activity.js";
import { getCachedStats } from "./dashboard-stats-store.js";
import { showSection } from "../app/app-navigation.js";
import { openCourse } from "../learn/learn-navigation.js";
import { isPathUnlocked, getProgressionMeta } from "../learn/learn-progression.js";
import { getTechIcon, getStatusIcon } from "../shared/tech-icons.js";

export function getLessonsToday() {
  const data = JSON.parse(localStorage.getItem("nexusLessonsToday") || "{}");
  if (data.date !== new Date().toDateString()) return 0;
  return data.count || 0;
}

export function recordLessonToday() {
  const today = new Date().toDateString();
  const data = JSON.parse(localStorage.getItem("nexusLessonsToday") || "{}");
  const count = data.date === today ? (data.count || 0) + 1 : 1;
  localStorage.setItem("nexusLessonsToday", JSON.stringify({ date: today, count }));
}

export function getHoursLearned() {
  const cached = getCachedStats();
  if (cached && typeof cached.hoursLearned === "number") {
    return Math.max(0, cached.hoursLearned);
  }

  let minutes = Number(localStorage.getItem("projectMinutes") || 0);
  LEARNING_PATHS.forEach((p) => {
    const done = JSON.parse(localStorage.getItem(`nexusCompleted_${p.id}`) || "[]").length;
    minutes += done * 18;
  });
  const hours = Math.round((minutes / 60) * 10) / 10;
  return Math.max(0, hours);
}

export function getNextLessonInfo() {
  const pathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
  const curriculum = getCurriculumForPath(pathId);
  if (!curriculum.length) return { title: "Start learning", pathId, index: 0 };
  const completed = JSON.parse(localStorage.getItem(`nexusCompleted_${pathId}`) || "[]");
  const nextIndex = curriculum.findIndex((_, i) => !completed.includes(i));
  if (nextIndex >= 0) return { title: curriculum[nextIndex].title, pathId, index: nextIndex };
  return { title: curriculum[0].title, pathId, index: 0 };
}

const FEATURED_PATH_IDS = [
  "python-fundamentals",
  "sql",
  "java-fundamentals",
  "javascript",
  "react",
  "spring-boot",
  "ai-fundamentals",
  "docker"
];

export function renderDashboardCourseCards() {
  const grid = document.getElementById("dashboardCourseCards");
  if (!grid) return;
  const paths = FEATURED_PATH_IDS.map((id) => LEARNING_PATHS.find((p) => p.id === id)).filter(Boolean);
  grid.innerHTML = paths
    .map((path) => {
      const unlocked = isPathUnlocked(path);
      const progress = getPathProgressPercent(path.id);
      const meta = getProgressionMeta(path.id);
      const icon = getTechIcon(path.id, path.title);
      const status = getStatusIcon(progress, unlocked);
      const level = meta.levelTitle || path.title;
      const click = unlocked ? `openCourse('${path.id}');showSection('learnSection')` : `showLockPreview('${path.id}');showSection('learnSection')`;
      return `<div class="glass-card dashboard-course-card ${unlocked ? "" : "locked"}" onclick="${click}">
        <div class="course-card-top">
          <span class="tech-logo" aria-hidden="true">${icon}</span>
          <span class="status-icon" title="Status">${status}</span>
        </div>
        <h4 class="course-name">${path.title}</h4>
        <span class="level-badge level-${meta.level}">${level}</span>
        <div class="course-progress-row">
          <span class="course-pct">${progress}%</span>
          <div class="glass-progress" style="flex:1;height:6px;"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
      </div>`;
    })
    .join("");
}

export function renderLearningRecommendations() {
  const el = document.getElementById("learningRecommendations");
  if (!el) return;
  const next = getNextLessonInfo();
  const pathMeta = LEARNING_PATHS.find((p) => p.id === next.pathId);
  const recs = [
    { icon: "📚", label: `Continue ${pathMeta?.title || "Python"}`, action: "continueLearning()" },
    { icon: "🎤", label: "Practice Interview Prep", action: "showSection('interviewSection')" },
    { icon: "💻", label: "Build a Real Project", action: "showSection('realProjectsSection')" },
    { icon: "🧪", label: "Try Code Lab", action: "showSection('codingLabSection')" }
  ];
  el.innerHTML = recs
    .map((r) => `<div class="rec-chip" onclick="${r.action}"><span class="rec-icon">${r.icon}</span><span>${r.label}</span></div>`)
    .join("");
}

export function syncDashboardFromProgress() {
  const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
  const cached = getCachedStats();

  const overall = cached?.overallProgress ?? getOverallProgress();
  const streak = Math.max(0, cached?.dayStreak ?? user.progress?.streak ?? 0);
  const points = Math.max(0, cached?.totalXp ?? user.progress?.points ?? 0);
  const hours = getHoursLearned();

  updateEl("streak", streak);
  updateEl("points", points);
  updateEl("hoursLearned", hours);
  updateEl("overallProgressPct", `${Math.max(0, Math.min(100, overall))}%`);

  const pathId = cached?.currentPathId || localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
  const pathMeta = LEARNING_PATHS.find((p) => p.id === pathId);
  const pathPct = Math.max(0, Math.min(100, cached?.currentPathProgress ?? getPathProgressPercent(pathId)));
  updateEl("activePathLabel", pathMeta?.title || "Python");
  updateEl("pathProgressLabel", `${pathPct}% of path complete`);

  const next = getNextLessonInfo();
  updateEl("continueLearningLabel", next.title || "Start your first lesson");
  updateEl("continuePathLabel", pathMeta?.title || "Python");
  renderLearningRecommendations();
  renderDashboardCourseCards();
}

export function continueLearning() {
  const last = JSON.parse(localStorage.getItem("nexusLastLesson") || "null");
  const pathId = last?.pathId || localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
  showSection("learnSection");
  openCourse(pathId);
  const lessonIndex = typeof last?.index === "number" ? last.index : 0;
  if (typeof window.openWorkspaceLesson === "function") {
    window.openWorkspaceLesson(lessonIndex);
  } else if (typeof window.openLesson === "function") {
    window.openLesson(lessonIndex);
  }
}
