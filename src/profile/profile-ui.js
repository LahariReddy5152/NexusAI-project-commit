/** Profile page sync */
import { LEARNING_PATHS, getPathProgressPercent } from "../learn/learn-data.js";
import { getOverallProgress } from "../dashboard/dashboard-activity.js";
import { renderProfileNotifications } from "../notifications/notifications.js";
import { INTERVIEW_SECTION_IDS, loadSectionProgress } from "../interview/interview-progress.js";
import { getGithubUsername } from "../projects/github-integration.js";
import { api, getToken } from "../shared/api-client.js";

function renderAvatar(el, avatar) {
  if (!el) return;
  if (avatar?.type === "custom" && avatar?.url) {
    const src = avatar.url.startsWith("/") ? avatar.url : avatar.url;
    el.innerHTML = `<img src="${src}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
  } else if (avatar?.type === "female") {
    el.textContent = "👩";
  } else if (avatar?.type === "male") {
    el.textContent = "👨";
  } else {
    el.textContent = "👤";
  }
}

async function loadAchievementsSummary() {
  if (getToken()) {
    const { ok, data } = await api("/achievements");
    if (ok && data.summary) return data.summary;
  }

  let githubCount = 0;
  if (getGithubUsername()) {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith("projectGithub_")) githubCount += 1;
    }
  }

  return {
    courses: LEARNING_PATHS.filter((p) => getPathProgressPercent(p.id) >= 100).length,
    projects: JSON.parse(localStorage.getItem("nexusCompletedProjects") || "[]").length,
    interviews: INTERVIEW_SECTION_IDS.reduce((sum, id) => sum + (loadSectionProgress(id).attempted || 0), 0),
    github: githubCount,
    certs: JSON.parse(localStorage.getItem("nexusCertificates") || "[]").length
  };
}

async function renderAchievementsCompact() {
  const el = document.getElementById("profileAchievementsCompact");
  if (!el) return;

  const summary = await loadAchievementsSummary();
  const chips = [
    { icon: "📚", value: summary.courses || 0, label: "Courses" },
    { icon: "🛠", value: summary.projects || 0, label: "Projects" },
    { icon: "🎤", value: summary.interviews || 0, label: "Interviews" },
    { icon: "🐙", value: summary.github || 0, label: "GitHub" },
    { icon: "🏆", value: summary.certs || 0, label: "Certs" }
  ];

  el.innerHTML = chips
    .map(
      (c) => `<div class="achievement-chip" title="${c.label} completed">
      <span class="ach-icon">${c.icon}</span>
      <span class="ach-value">${c.value}</span>
      <span class="ach-label">${c.label}</span>
    </div>`
    )
    .join("");
}

export async function syncProfilePage() {
  if (getToken()) {
    const { ok, data } = await api("/users/profile");
    if (ok && data.user) {
      localStorage.setItem("nexusUser", JSON.stringify({ ...data.user, ...(data.profile || {}) }));
    }
  }

  const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
  const xp = user.progress?.points || 0;
  const level = xp >= 5000 ? "Expert" : xp >= 2500 ? "Advanced" : xp >= 1000 ? "Intermediate" : xp >= 300 ? "Learner" : "Beginner";

  setText("profileName", user.name || "—");
  setText("profileEmail", user.email || "—");
  setText("profileDisplayName", user.name || "—");
  setText("profileDisplayEmail", user.email || "—");
  setText("profileLevel", level);
  setText("profileStreak", `${user.progress?.streak || 0} days`);
  setText("profileHours", `${user.progress?.hours || Math.floor(getOverallProgress() / 2)} hours`);

  renderAvatar(document.getElementById("profileAvatarDisplay"), user.avatar);
  await renderAchievementsCompact();
  renderProfileNotifications();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
