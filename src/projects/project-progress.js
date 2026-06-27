/** Per-project progress, score, notes, checkpoints, milestones — synced to SQLite when logged in */

import { getToken } from "../shared/api-client.js";

export const CHECKPOINT_LABELS = [
  "Planning & requirements sign-off",
  "Architecture & data model approved",
  "Frontend MVP implemented",
  "Backend APIs integrated",
  "Database migrations applied",
  "Auth & authorization wired",
  "Tests passing in CI",
  "Deployed with monitoring"
];

export const MILESTONE_LABELS = [
  "Repository scaffold complete",
  "Core user flow working end-to-end",
  "Security review passed",
  "Staging deployment validated",
  "Portfolio demo recorded"
];

export function slugifyProjectName(name) {
  return String(name).replace(/\s+/g, "_");
}

export function getProjectProgressKey(name) {
  return `projectProgress_${slugifyProjectName(name)}`;
}

export function getProjectScoreKey(name) {
  return `projectScore_${slugifyProjectName(name)}`;
}

export function getProjectNotesKey(name) {
  return `projectNotes_${slugifyProjectName(name)}`;
}

export function getProjectCheckpointsKey(name) {
  return `projectCheckpoints_${slugifyProjectName(name)}`;
}

export function getProjectMilestonesKey(name) {
  return `projectMilestones_${slugifyProjectName(name)}`;
}

export function getProjectMinutesKey(name) {
  return `projectMinutes_${slugifyProjectName(name)}`;
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function loadCheckpoints(name) {
  const saved = readJson(getProjectCheckpointsKey(name), null);
  if (Array.isArray(saved) && saved.length === CHECKPOINT_LABELS.length) return saved;
  return CHECKPOINT_LABELS.map(() => false);
}

export function loadMilestones(name) {
  const saved = readJson(getProjectMilestonesKey(name), null);
  if (Array.isArray(saved) && saved.length === MILESTONE_LABELS.length) return saved;
  return MILESTONE_LABELS.map(() => false);
}

function scheduleProjectSync(name) {
  if (!getToken() || !name) return;
  import("./project-sync.js")
    .then(({ pushProjectToServer }) => pushProjectToServer(name))
    .catch(() => {});
}

export function saveCheckpoints(name, states) {
  localStorage.setItem(getProjectCheckpointsKey(name), JSON.stringify(states));
  scheduleProjectSync(name);
}

export function saveMilestones(name, states) {
  localStorage.setItem(getProjectMilestonesKey(name), JSON.stringify(states));
  scheduleProjectSync(name);
}

export function calcProgressFromCheckpoints(states) {
  if (!states.length) return 0;
  const done = states.filter(Boolean).length;
  return Math.round((done / states.length) * 100);
}

export function loadProjectProgress(name) {
  return Number(localStorage.getItem(getProjectProgressKey(name)) || 0);
}

export function saveProjectProgress(name, percent) {
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
  localStorage.setItem(getProjectProgressKey(name), String(clamped));
  scheduleProjectSync(name);
}

export function loadProjectScore(name) {
  const raw = localStorage.getItem(getProjectScoreKey(name));
  return raw === null ? 0 : Number(raw);
}

export function saveProjectScore(name, score) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  localStorage.setItem(getProjectScoreKey(name), String(clamped));
  scheduleProjectSync(name);
  return clamped;
}

export function loadProjectNotes(name) {
  return localStorage.getItem(getProjectNotesKey(name)) || "";
}

export function saveProjectNotes(name, text) {
  localStorage.setItem(getProjectNotesKey(name), text);
  scheduleProjectSync(name);
}

export function loadProjectMinutes(name) {
  return Number(localStorage.getItem(getProjectMinutesKey(name)) || 0);
}

export function saveProjectMinutes(name, minutes) {
  localStorage.setItem(getProjectMinutesKey(name), String(Math.max(0, Number(minutes) || 0)));
  scheduleProjectSync(name);
}

export function loadProjectState(name) {
  const checkpoints = loadCheckpoints(name);
  return {
    progress: loadProjectProgress(name) || calcProgressFromCheckpoints(checkpoints),
    score: loadProjectScore(name),
    notes: loadProjectNotes(name),
    checkpoints,
    milestones: loadMilestones(name),
    minutes: loadProjectMinutes(name)
  };
}
