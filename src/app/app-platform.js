import { LIVE_PROJECT_NAMES } from "../projects/projects-data.js";
import {
  persistCheckpointProgress,
  persistMilestones,
  persistProjectNotes,
  getActiveProjectName,
  saveProjectTimerMinutes,
  startCoreProject,
  startLiveProject
} from "../projects/projects-ui.js";
import { loadProjectMinutes, saveProjectScore } from "../projects/project-progress.js";
import { syncGitHubRepository, pushProgressToGitHub, saveProjectRepoUrl } from "../projects/github-integration.js";
import { api, getToken } from "../shared/api-client.js";

let timer;
let timerProject = "";

export function updateProgress() {
  persistCheckpointProgress();
}

export function updateMilestones() {
  persistMilestones();
}

export function saveProjectNotes() {
  persistProjectNotes();
}

export function updateProjectScore() {
  const name = getActiveProjectName();
  const input = document.getElementById("projectScoreInput");
  const scoreEl = document.getElementById("projectScore");
  if (!name || !input) return;
  const score = saveProjectScore(name, input.value);
  if (scoreEl) scoreEl.textContent = String(score);
}

export function submitProject() {
  const name = getActiveProjectName();
  const github = document.getElementById("githubLink")?.value?.trim() || document.getElementById("githubRepoUrl")?.value?.trim();
  const status = document.getElementById("projectSubmitStatus");
  if (github && name) saveProjectRepoUrl(name, github);
  pushProgressToGitHub();
  syncGitHubRepository();
  if (status) {
    status.textContent = github
      ? `Project submitted. GitHub: ${github}`
      : "Project submitted. Connect GitHub and add a repo URL for full sync.";
  }
  updateProgress();
}

export function startTimer() {
  const name = getActiveProjectName();
  if (!name) return;
  if (timer && timerProject === name) return;
  stopTimer();
  timerProject = name;
  timer = setInterval(() => {
    const mins = loadProjectMinutes(name) + 1;
    saveProjectTimerMinutes(mins);
    updateTime();
  }, 60000);
}

export function stopTimer() {
  clearInterval(timer);
  timer = null;
  timerProject = "";
}

export function updateTime() {
  const name = getActiveProjectName();
  const el = document.getElementById("timeSpent");
  if (el && name) el.innerText = loadProjectMinutes(name);
}

export function startProject(projectName) {
  if (LIVE_PROJECT_NAMES.includes(projectName)) startLiveProject(projectName);
  else startCoreProject(projectName);
}

export async function saveProfile() {
  const name = document.getElementById("editProfileName")?.value?.trim();
  const email = document.getElementById("editProfileEmail")?.value?.trim();
  const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");

  if (name) {
    user.name = name;
    localStorage.setItem("profileName", name);
    const el = document.getElementById("profileName");
    if (el) el.innerText = name;
    const welcome = document.getElementById("welcomeText");
    if (welcome) welcome.innerText = `Welcome Back, ${name}`;
  }
  if (email) {
    user.email = email;
    localStorage.setItem("profileEmail", email);
    const el = document.getElementById("profileEmail");
    if (el) el.innerText = email;
  }
  localStorage.setItem("nexusUser", JSON.stringify(user));

  if (getToken()) {
    await api("/users/profile", { method: "PUT", body: JSON.stringify({ name: user.name, email: user.email }) });
  }

  const msg = document.getElementById("profileSaveStatus");
  if (msg) msg.textContent = "Profile updated successfully.";
}

export function updateAnalytics() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
  set("dailyProgress", "—");
  set("weeklyProgress", "—");
  set("monthlyProgress", "—");
}

export function renderJobs() {
  const list = document.getElementById("jobApplications");
  if (!list) return;
  const jobs = JSON.parse(localStorage.getItem("jobApplications") || "[]");
  list.innerHTML = jobs.map((job) => `<li>${job.company} — ${job.status}</li>`).join("");
}

export function unlockCertificates() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("projectProgress_"));
  const anyComplete = keys.some((k) => Number(localStorage.getItem(k) || 0) >= 80);
  if (anyComplete) {
    document.querySelectorAll(".cert-status").forEach((cert) => {
      cert.innerText = "Unlocked";
    });
  }
}
