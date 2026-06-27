/** Profile page sync — statistics from SQLite */
import { LEARNING_PATHS, getPathProgressPercent } from "../learn/learn-data.js";
import { renderProfileNotifications } from "../notifications/notifications.js";
import { api, getToken } from "../shared/api-client.js";
import { getCachedStats } from "../dashboard/dashboard-stats-store.js";

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
  if (!getToken()) return null;
  const { ok, data } = await api("/achievements");
  if (ok && data.summary) return data.summary;
  return null;
}

async function loadProfileStats() {
  const cached = getCachedStats();
  if (cached) {
    return {
      xp: cached.totalXp || 0,
      streak: cached.dayStreak || 0,
      hours: cached.hoursLearned || 0
    };
  }
  if (!getToken()) return { xp: 0, streak: 0, hours: 0 };
  const { ok, data } = await api("/dashboard/stats");
  if (ok && data.stats) {
    return {
      xp: data.stats.totalXp || 0,
      streak: data.stats.dayStreak || 0,
      hours: data.stats.hoursLearned || 0
    };
  }
  return { xp: 0, streak: 0, hours: 0 };
}

async function renderAchievementsCompact() {
  const el = document.getElementById("profileAchievementsCompact");
  if (!el) return;

  const summary = await loadAchievementsSummary();
  if (!summary) {
    el.innerHTML = "<p class='muted-text'>Sign in to view achievements.</p>";
    return;
  }

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
      const stats = await loadProfileStats();
      localStorage.setItem(
        "nexusUser",
        JSON.stringify({
          ...data.user,
          ...(data.profile || {}),
          progress: { points: stats.xp, streak: stats.streak, hours: stats.hours }
        })
      );
    }
  }

  const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
  const stats = await loadProfileStats();
  const xp = stats.xp || user.progress?.points || 0;
  const level = xp >= 5000 ? "Expert" : xp >= 2500 ? "Advanced" : xp >= 1000 ? "Intermediate" : xp >= 300 ? "Learner" : "Beginner";

  setText("profileName", user.name || "Lahari");
  setText("profileEmail", user.email || "laharireddy5152@gmail.com");
  setText("profileDisplayName", user.name || "Lahari");
  setText("profileDisplayEmail", user.email || "laharireddy5152@gmail.com");
  setText("profileLevel", level);
  setText("profileStreak", `${stats.streak || 0} days`);
  setText("profileHours", `${stats.hours || 0} hours`);

  renderAvatar(document.getElementById("profileAvatarDisplay"), user.avatar);
  renderXpStats(xp, level);
  renderLearningHistory();
  await renderAchievementsCompact();
  renderProfileNotifications();
}

function renderXpStats(xp, level) {
  const xpEl = document.getElementById("profileXpValue");
  const bar = document.getElementById("profileXpBarFill");
  const next = xp >= 5000 ? 5000 : xp >= 2500 ? 5000 : xp >= 1000 ? 2500 : xp >= 300 ? 1000 : 300;
  const prev = xp >= 5000 ? 5000 : xp >= 2500 ? 2500 : xp >= 1000 ? 1000 : xp >= 300 ? 300 : 0;
  const pct = next === prev ? 100 : Math.round(((xp - prev) / (next - prev)) * 100);
  if (xpEl) xpEl.textContent = `${xp} XP · ${level}`;
  if (bar) bar.style.width = `${Math.min(pct, 100)}%`;
}

function renderLearningHistory() {
  const list = document.getElementById("profileLearningHistory");
  if (!list) return;
  const entries = LEARNING_PATHS.filter((p) => getPathProgressPercent(p.id) > 0)
    .sort((a, b) => getPathProgressPercent(b.id) - getPathProgressPercent(a.id))
    .slice(0, 8)
    .map((p) => `<li><span>${p.title}</span><span>${getPathProgressPercent(p.id)}%</span></li>`);
  list.innerHTML = entries.length ? entries.join("") : "<li><span>No lessons started yet</span><span>—</span></li>";
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
