/** Sync project progress with SQLite */
import { api, getToken } from "../shared/api-client.js";
import { ALL_PROJECT_NAMES } from "./projects-data.js";
import {
  slugifyProjectName,
  CHECKPOINT_LABELS,
  MILESTONE_LABELS,
  loadCheckpoints,
  loadMilestones,
  loadProjectNotes,
  loadProjectScore,
  loadProjectMinutes
} from "./project-progress.js";
import { getProjectStatus } from "./project-meta.js";

function resolveProjectName(slug) {
  return ALL_PROJECT_NAMES.find((n) => slugifyProjectName(n) === slug) || slug.replace(/_/g, " ");
}

export function applyProjectFromServer(row) {
  const name = resolveProjectName(row.slug);
  const progress = Math.max(0, Math.min(100, Number(row.progress) || 0));
  localStorage.setItem(`projectProgress_${slugifyProjectName(name)}`, String(progress));

  const data = row;
  if (data.status) localStorage.setItem(`projectStatus_${slugifyProjectName(name)}`, data.status);
  if (Array.isArray(data.checkpoints)) {
    localStorage.setItem(`projectCheckpoints_${slugifyProjectName(name)}`, JSON.stringify(data.checkpoints));
  }
  if (Array.isArray(data.milestones)) {
    localStorage.setItem(`projectMilestones_${slugifyProjectName(name)}`, JSON.stringify(data.milestones));
  }
  if (typeof data.notes === "string") {
    localStorage.setItem(`projectNotes_${slugifyProjectName(name)}`, data.notes);
  }
  if (data.score != null) {
    localStorage.setItem(`projectScore_${slugifyProjectName(name)}`, String(data.score));
  }
  if (data.minutes != null) {
    localStorage.setItem(`projectMinutes_${slugifyProjectName(name)}`, String(data.minutes));
  }
}

export async function syncProjectsFromServer() {
  if (!getToken()) return [];
  const { ok, data } = await api("/progress/projects");
  if (!ok || !Array.isArray(data.projects)) return [];
  data.projects.forEach(applyProjectFromServer);
  return data.projects;
}

export async function pushProjectToServer(name) {
  if (!getToken() || !name) return false;
  const slug = slugifyProjectName(name);
  const progress = Math.max(0, Math.min(100, Number(localStorage.getItem(`projectProgress_${slug}`) || 0)));
  const status = getProjectStatus(progress).label;
  const body = {
    progress,
    status,
    checkpoints: loadCheckpoints(name),
    milestones: loadMilestones(name),
    notes: loadProjectNotes(name),
    score: loadProjectScore(name),
    minutes: loadProjectMinutes(name)
  };
  const { ok } = await api(`/progress/projects/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
  return ok;
}
