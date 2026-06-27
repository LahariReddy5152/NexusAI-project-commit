import { getProgressionMeta } from "./learn-progression.js";
import { getTechnologyForPath } from "./learn-technologies.js";
import { LEARNING_PATHS } from "./learn-data.js";
import { showSection } from "../app/app-navigation.js";

export function renderLearnBreadcrumb(segments) {
  const el = document.getElementById("learnBreadcrumb");
  if (!el) return;
  if (!segments?.length) {
    el.classList.add("hidden");
    el.innerHTML = "";
    return;
  }
  el.classList.remove("hidden");
  el.innerHTML = segments
    .map((seg, i) => {
      const isLast = i === segments.length - 1;
      if (isLast) return `<span class="breadcrumb-current">${seg.label}</span>`;
      return `<button type="button" class="breadcrumb-link" onclick="${seg.action || ""}">${seg.label}</button><span class="breadcrumb-sep">›</span>`;
    })
    .join("");
}

export function breadcrumbForCatalog() {
  renderLearnBreadcrumb([
    { label: "Dashboard", action: "showSection('dashboardSection')" },
    { label: "Learn" }
  ]);
}

export function breadcrumbForTechnology(techName, techId) {
  renderLearnBreadcrumb([
    { label: "Dashboard", action: "showSection('dashboardSection')" },
    { label: "Learn", action: "backToCourseCatalog()" },
    { label: techName, action: `openTechnology('${techId}')` }
  ]);
}

export function breadcrumbForLevel(pathId) {
  const tech = getTechnologyForPath(pathId);
  const meta = getProgressionMeta(pathId);
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  renderLearnBreadcrumb([
    { label: "Dashboard", action: "showSection('dashboardSection')" },
    { label: "Learn", action: "backToCourseCatalog()" },
    { label: tech?.name || path?.title || "Course", action: tech ? `openTechnology('${tech.id}')` : "backToCourseCatalog()" },
    { label: meta.levelTitle || path?.title || "Level" }
  ]);
}

export function breadcrumbForLesson(pathId, lessonTitle) {
  const tech = getTechnologyForPath(pathId);
  const meta = getProgressionMeta(pathId);
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  renderLearnBreadcrumb([
    { label: "Dashboard", action: "showSection('dashboardSection')" },
    { label: "Learn", action: "backToCourseCatalog()" },
    { label: tech?.name || path?.title || "Course", action: tech ? `openTechnology('${tech.id}')` : "backToCourseCatalog()" },
    { label: meta.levelTitle || path?.title || "Level", action: `openCourse('${pathId}')` },
    { label: lessonTitle }
  ]);
}
