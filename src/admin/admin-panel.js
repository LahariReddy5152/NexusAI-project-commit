/** Admin dashboard */
import { LEARNING_PATHS } from "../learn/learn-data.js";
import { getOverallProgress } from "../dashboard/dashboard-activity.js";

export function refreshAdminPanel() {
  if (localStorage.getItem("userRole") !== "admin") return;

  const users = JSON.parse(localStorage.getItem("nexusAdminUsers") || "[]");
  const current = JSON.parse(localStorage.getItem("nexusUser") || "null");
  if (current?.email && !users.find((u) => u.email === current.email)) {
    users.push({ name: current.name, email: current.email, joined: new Date().toISOString() });
    localStorage.setItem("nexusAdminUsers", JSON.stringify(users));
  }

  set("adminUsers", users.length || 1);
  set("adminCourses", `${LEARNING_PATHS.length} paths`);
  set("adminProjects", JSON.parse(localStorage.getItem("nexusCompletedProjects") || "[]").length);
  set("adminProgress", `${getOverallProgress()}%`);
  set("adminCertificates", JSON.parse(localStorage.getItem("nexusCertificates") || "[]").length);
  set("adminHours", JSON.parse(localStorage.getItem("nexusUser") || "{}").progress?.hours || 0);

  const activity = JSON.parse(localStorage.getItem("nexusRecentActivity") || "[]");
  const el = document.getElementById("adminActivity");
  if (el) {
    el.innerHTML = activity.slice(0, 8).map((a) => `<li>${a.text} <span class="muted-text">${a.time}</span></li>`).join("")
      || "<li>No activity recorded</li>";
  }
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
