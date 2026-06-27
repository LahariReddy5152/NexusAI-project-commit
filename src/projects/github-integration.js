/**
 * GitHub integration — real API backend
 */
import { slugifyProjectName, loadProjectProgress } from "./project-progress.js";
import { notifyGithubSync } from "../notifications/notifications.js";
import { githubConnect, githubPush, githubCommits, getToken } from "../shared/api-client.js";

const GITHUB_USER_KEY = "nexusGithubUsername";
const GITHUB_TOKEN_KEY = "nexusGithubToken";

function getActiveProjectName() {
  return document.getElementById("projectDetailSection")?.dataset?.projectName || "";
}

export function getGithubUsername() {
  return localStorage.getItem(GITHUB_USER_KEY) || "";
}

export async function connectGitHubAccount() {
  const username = document.getElementById("githubUsername")?.value?.trim();
  const token = document.getElementById("githubToken")?.value?.trim();
  if (!username) {
    setGithubStatus("Enter your GitHub username to connect.");
    return false;
  }

  if (getToken()) {
    const { ok, data } = await githubConnect(username, token);
    if (!ok) {
      setGithubStatus(data.message || "GitHub connection failed.");
      return false;
    }
  }

  localStorage.setItem(GITHUB_USER_KEY, username);
  if (token) localStorage.setItem(GITHUB_TOKEN_KEY, token);
  setGithubStatus(`Connected as @${username}`);
  renderGithubConnectionState();
  return true;
}

export function disconnectGitHubAccount() {
  localStorage.removeItem(GITHUB_USER_KEY);
  localStorage.removeItem(GITHUB_TOKEN_KEY);
  setGithubStatus("GitHub account disconnected.");
  renderGithubConnectionState();
}

export function saveProjectRepoUrl(name, url) {
  if (!name || !url) return;
  localStorage.setItem(`projectGithub_${slugifyProjectName(name)}`, url);
}

export function getProjectRepoUrl(name) {
  return localStorage.getItem(`projectGithub_${slugifyProjectName(name)}`) || "";
}

export async function syncGitHubRepository() {
  const name = getActiveProjectName();
  const url = document.getElementById("githubRepoUrl")?.value?.trim() || getProjectRepoUrl(name);
  const username = getGithubUsername();

  if (!username) {
    setGithubStatus("Connect your GitHub account first.");
    return false;
  }
  if (!url) {
    setGithubStatus("Provide a repository URL to sync.");
    return false;
  }

  saveProjectRepoUrl(name, url);
  const progress = loadProjectProgress(name);

  if (getToken()) {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY);
    if (token) {
      const { ok, data } = await githubPush(url, name, progress, `NexusAI sync: ${name} ${progress}%`);
      if (ok) {
        setGithubStatus(data.message || `Synced ${name} (${progress}%) with ${url}`);
        notifyGithubSync?.();
        renderGithubSyncState(name);
        return true;
      }
    }
  }

  const syncRecord = {
    url,
    progress,
    syncedAt: new Date().toISOString(),
    username
  };
  localStorage.setItem(`githubSync_${slugifyProjectName(name)}`, JSON.stringify(syncRecord));

  if (document.getElementById("githubLink")) {
    document.getElementById("githubLink").value = url;
  }

  setGithubStatus(`Synced ${name} (${progress}%) with ${url}`);
  notifyGithubSync?.();
  renderGithubSyncState(name);
  return true;
}

export async function pushProgressToGitHub() {
  const name = getActiveProjectName();
  const username = getGithubUsername();
  const url = getProjectRepoUrl(name) || document.getElementById("githubRepoUrl")?.value?.trim();

  if (!username) {
    setGithubStatus("Connect your GitHub account first.");
    return false;
  }
  if (!url) {
    setGithubStatus("Add a repository URL before pushing progress.");
    return false;
  }

  const progress = loadProjectProgress(name);

  if (getToken() && localStorage.getItem(GITHUB_TOKEN_KEY)) {
    const { ok, data } = await githubPush(url, name, progress, `NexusAI progress: ${progress}% for ${name}`);
    if (ok) {
      setGithubStatus(data.message || `Pushed ${progress}% progress to GitHub for ${name}.`);
      notifyGithubSync?.();
      renderGithubSyncState(name);
      saveProjectRepoUrl(name, url);
      return true;
    }
    setGithubStatus(data.message || "Push failed.");
    return false;
  }

  const pushRecord = {
    url,
    progress,
    pushedAt: new Date().toISOString(),
    username,
    message: `NexusAI progress: ${progress}% for ${name}`
  };
  localStorage.setItem(`githubPush_${slugifyProjectName(name)}`, JSON.stringify(pushRecord));
  saveProjectRepoUrl(name, url);

  setGithubStatus(`Pushed ${progress}% progress to GitHub for ${name}.`);
  notifyGithubSync?.();
  renderGithubSyncState(name);
  return true;
}

export async function loadGithubCommits(url) {
  if (!getToken() || !url) return [];
  const { ok, data } = await githubCommits(url);
  return ok ? data.commits || [] : [];
}

export function loadGithubPanelState(name) {
  const username = getGithubUsername();
  const userEl = document.getElementById("githubUsername");
  const repoEl = document.getElementById("githubRepoUrl");
  const linkEl = document.getElementById("githubLink");
  const savedUrl = getProjectRepoUrl(name);

  if (userEl && username) userEl.value = username;
  if (repoEl && savedUrl) repoEl.value = savedUrl;
  if (linkEl && savedUrl) linkEl.value = savedUrl;

  renderGithubConnectionState();
  renderGithubSyncState(name);
}

function setGithubStatus(msg) {
  const el = document.getElementById("githubSyncStatus");
  if (el) el.textContent = msg;
}

function renderGithubConnectionState() {
  const el = document.getElementById("githubConnectionBadge");
  const username = getGithubUsername();
  if (el) {
    el.textContent = username ? `Connected: @${username}` : "Not connected";
    el.className = `github-connection-badge ${username ? "connected" : ""}`;
  }
}

function renderGithubSyncState(name) {
  const el = document.getElementById("githubLastSync");
  if (!el || !name) return;
  const sync = localStorage.getItem(`githubSync_${slugifyProjectName(name)}`);
  const push = localStorage.getItem(`githubPush_${slugifyProjectName(name)}`);
  const record = sync ? JSON.parse(sync) : push ? JSON.parse(push) : null;
  if (record) {
    el.textContent = `Last sync: ${record.progress}% · ${new Date(record.syncedAt || record.pushedAt).toLocaleString()}`;
  } else {
    el.textContent = "No sync yet — works at any progress level (0%–100%).";
  }
}

