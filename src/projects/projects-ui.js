/** Real Projects — grid catalog, detail view, GitHub */
import { showSection } from "../app/app-navigation.js";
import { getProjectBlueprint, renderProjectDetail, CORE_PROJECT_NAMES, LIVE_PROJECT_NAMES } from "./projects-data.js";
import { getProjectMeta, getProjectStatus, getEstimatedCompletion } from "./project-meta.js";
import {
  CHECKPOINT_LABELS,
  MILESTONE_LABELS,
  loadProjectState,
  saveCheckpoints,
  saveMilestones,
  saveProjectProgress,
  calcProgressFromCheckpoints,
  saveProjectNotes,
  loadProjectProgress,
  saveProjectMinutes
} from "./project-progress.js";
import { loadGithubPanelState } from "./github-integration.js";

let activeProjectName = "";

export function showProjectTab(tab, event) {
  document.getElementById("coreProjectsPanel")?.classList.toggle("hidden", tab !== "core");
  document.getElementById("liveProjectsPanel")?.classList.toggle("hidden", tab !== "live");
  document.querySelectorAll("#realProjectsSection .category-tab").forEach((t) => t.classList.remove("active"));
  event?.target?.classList.add("active");
}

function renderProjectCard(name, isLive = false) {
  const meta = getProjectMeta(name);
  const progress = loadProjectProgress(name);
  const status = getProjectStatus(progress);
  const bp = getProjectBlueprint(name);
  const level = bp?.level || "Intermediate";
  const fn = isLive ? `startLiveProject('${name.replace(/'/g, "\\'")}')` : `startCoreProject('${name.replace(/'/g, "\\'")}')`;

  const est = getEstimatedCompletion(name, progress);
  return `<div class="project-card-v2 glass-card" onclick="${fn}">
    <div class="project-card-top">
      <span class="project-icon" aria-hidden="true">${meta.icon}</span>
      <span class="project-status-badge ${status.class}">${status.label}</span>
    </div>
    <h3 class="project-card-name">${meta.displayName}</h3>
    <span class="level-badge level-${level.toLowerCase()}">${level}</span>
    <p class="project-stack">${meta.stack}</p>
    <div class="project-card-footer">
      <span class="project-pct">${progress}%</span>
      <div class="glass-progress project-card-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    </div>
    <p class="project-est-date">Est. completion: ${est}</p>
  </div>`;
}

export function renderProjectsGrid() {
  const core = document.getElementById("coreProjectsPanel");
  const live = document.getElementById("liveProjectsPanel");
  if (core) core.innerHTML = CORE_PROJECT_NAMES.map((n) => renderProjectCard(n, false)).join("");
  if (live) live.innerHTML = LIVE_PROJECT_NAMES.map((n) => renderProjectCard(n, true)).join("");
}

function renderCheckpoints(name, states) {
  const list = document.getElementById("projectCheckpointsList");
  if (!list) return;
  list.innerHTML = CHECKPOINT_LABELS.map(
    (_, i) =>
      `<label class="checkpoint-item"><input type="checkbox" data-checkpoint="${i}" ${states[i] ? "checked" : ""} onchange="updateProgress()"> ${CHECKPOINT_LABELS[i]}</label>`
  ).join("");
}

function renderMilestones(name, states) {
  const list = document.getElementById("projectMilestonesList");
  if (!list) return;
  list.innerHTML = MILESTONE_LABELS.map(
    (_, i) =>
      `<label class="checkpoint-item"><input type="checkbox" data-milestone="${i}" ${states[i] ? "checked" : ""} onchange="updateMilestones()"> ${MILESTONE_LABELS[i]}</label>`
  ).join("");
}

function applyProgressUI(name, state) {
  const fill = document.getElementById("progressFill");
  const text = document.getElementById("progressText");
  const scoreEl = document.getElementById("projectScore");
  const scoreInput = document.getElementById("projectScoreInput");
  const notes = document.getElementById("projectNotes");
  const timeEl = document.getElementById("timeSpent");
  const detailBar = document.querySelector(".project-detail-progress");
  const headerPct = document.getElementById("projectHeaderProgress");

  if (fill) fill.style.width = `${state.progress}%`;
  if (text) text.textContent = `${state.progress}%`;
  if (headerPct) headerPct.textContent = `${state.progress}%`;
  if (scoreEl) scoreEl.textContent = String(state.score);
  if (scoreInput) scoreInput.value = String(state.score);
  if (notes) notes.value = state.notes;
  if (timeEl) timeEl.textContent = String(state.minutes);
  if (detailBar) detailBar.style.width = `${state.progress}%`;
}

function openProjectDetail(name) {
  activeProjectName = name;
  const meta = getProjectMeta(name);
  const bp = getProjectBlueprint(name);
  document.getElementById("projectTitle").textContent = meta.displayName;
  document.getElementById("projectDescription").textContent = bp?.overview || `Complete the ${name} portfolio project.`;
  if (!renderProjectDetail(name)) {
    const holder = document.getElementById("projectDetailContent");
    if (holder) holder.innerHTML = `<div class="glass-card"><p>Blueprint not found for ${name}.</p></div>`;
  }

  const state = loadProjectState(name);
  renderCheckpoints(name, state.checkpoints);
  renderMilestones(name, state.milestones);
  applyProgressUI(name, state);
  const section = document.getElementById("projectDetailSection");
  if (section) section.dataset.projectName = name;
  loadGithubPanelState(name);
  showSection("projectDetailSection");
}

export function getActiveProjectName() {
  return activeProjectName || document.getElementById("projectDetailSection")?.dataset?.projectName || "";
}

export function persistCheckpointProgress() {
  const name = getActiveProjectName();
  if (!name) return 0;
  const states = CHECKPOINT_LABELS.map((_, i) => {
    const el = document.querySelector(`#projectCheckpointsList input[data-checkpoint="${i}"]`);
    return el?.checked || false;
  });
  saveCheckpoints(name, states);
  const percent = calcProgressFromCheckpoints(states);
  saveProjectProgress(name, percent);
  applyProgressUI(name, { ...loadProjectState(name), progress: percent });
  renderProjectsGrid();
  return percent;
}

export function persistMilestones() {
  const name = getActiveProjectName();
  if (!name) return;
  const states = MILESTONE_LABELS.map((_, i) => {
    const el = document.querySelector(`#projectMilestonesList input[data-milestone="${i}"]`);
    return el?.checked || false;
  });
  saveMilestones(name, states);
}

export function persistProjectNotes() {
  const name = getActiveProjectName();
  const notes = document.getElementById("projectNotes")?.value || "";
  if (name) saveProjectNotes(name, notes);
}

export function startCoreProject(name) {
  openProjectDetail(name);
}

export function startLiveProject(name) {
  openProjectDetail(name);
}

export function saveProjectTimerMinutes(minutes) {
  const name = activeProjectName;
  if (name) saveProjectMinutes(name, minutes);
}
