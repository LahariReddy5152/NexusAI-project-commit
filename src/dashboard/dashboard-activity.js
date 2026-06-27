import { LEARNING_PATHS, getCurriculumForPath } from "../learn/learn-data.js";
import { getToken } from "../shared/api-client.js";
import { awardPointsOnServer } from "./dashboard-stats-store.js";

export function awardPoints(points) {
  const amount = Math.max(0, Number(points) || 0);
  if (!amount) return;

  try {
    const user = JSON.parse(localStorage.getItem("nexusUser") || "null");
    if (user) {
      if (!user.progress) user.progress = {};
      user.progress.points = Math.max(0, (user.progress.points || 0) + amount);
      localStorage.setItem("nexusUser", JSON.stringify(user));
    }
  } catch (e) {
    console.error("Failed to award points:", e);
  }

  if (getToken()) {
    awardPointsOnServer(amount).catch(() => {});
  }
}

export function logActivity(text) {
  const key = "nexusRecentActivity";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.unshift({ text, time: new Date().toLocaleString() });
  localStorage.setItem(key, JSON.stringify(list.slice(0, 12)));
}

export function renderRecentActivity() {
    const el = document.getElementById("recentActivity");
    if (!el) return;
    const list = JSON.parse(localStorage.getItem("nexusRecentActivity") || "[]");
    el.innerHTML = list.length
        ? list.map((a) => `<li><span class="activity-text">${a.text}</span><span class="activity-time">${a.time}</span></li>`).join("")
        : "<li>No activity yet — start learning to build your timeline.</li>";
}

export function getOverallProgress() {
    let total = 0, done = 0;
    LEARNING_PATHS.forEach((p) => {
        const c = getCurriculumForPath(p.id);
        total += c.length;
        done += JSON.parse(localStorage.getItem(`nexusCompleted_${p.id}`) || "[]").length;
    });
    return total ? Math.round((done / total) * 100) : 0;
}
