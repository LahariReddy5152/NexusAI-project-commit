import {
  getToken,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
  archiveNotificationApi
} from "../shared/api-client.js";

const STORAGE_KEY = "nexusNotifications";

function useApi() {
  return !!getToken();
}

async function fetchNotificationsFromApi() {
  const token = getToken();
  if (!token) return getNotificationsLocal();
  const res = await fetch("/api/notifications", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return getNotificationsLocal();
  const data = await res.json();
  const list = data.notifications || [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

function getNotificationsLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getNotifications() {
  return getNotificationsLocal();
}

export async function pushNotification(title, type = "info") {
  if (useApi()) {
    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, type })
    });
    await fetchNotificationsFromApi();
  } else {
    const list = getNotificationsLocal();
    list.unshift({
      id: `n-${Date.now()}`,
      title,
      type,
      read: false,
      time: new Date().toLocaleString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 30)));
  }
  renderNotificationBell();
  renderProfileNotifications();
  if (typeof window !== "undefined" && window.nexusDesktop?.showNotification) {
    window.nexusDesktop.showNotification(title, type);
  }
}

export async function markNotificationRead(id) {
  if (useApi()) await markNotificationReadApi(id);
  else {
    const list = getNotificationsLocal().map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  await refreshNotifications();
}

export async function markAllNotificationsRead() {
  if (useApi()) await markAllNotificationsReadApi();
  else {
    const list = getNotificationsLocal().map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  await refreshNotifications();
}

export async function deleteNotification(id) {
  if (useApi()) await deleteNotificationApi(id);
  else {
    const list = getNotificationsLocal().filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  await refreshNotifications();
}

export async function archiveNotification(id) {
  if (useApi()) await archiveNotificationApi(id);
  await refreshNotifications();
}

export function getUnreadCount() {
  return getNotificationsLocal().filter((n) => !n.read && !n.archived).length;
}

function renderNotificationList(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const list = getNotificationsLocal().filter((n) => !n.archived);
  if (!list.length) {
    el.innerHTML = `<p class="muted-text">No notifications yet.</p>`;
    return;
  }
  el.innerHTML = list
    .map(
      (n) => `<div class="notification-item${n.read ? "" : " unread"}" data-id="${n.id}" onclick="markNotificationRead('${n.id}')">
      <div class="notification-item-title">${n.title}</div>
      <div class="notification-item-time">${n.time || ""}</div>
    </div>`
    )
    .join("");
}

async function refreshNotifications() {
  if (useApi()) await fetchNotificationsFromApi();
  renderNotificationBell();
  renderProfileNotifications();
}

export function renderNotificationBell() {
  const badge = document.getElementById("notificationBadge");
  const count = getUnreadCount();
  if (badge) {
    badge.textContent = count > 9 ? "9+" : String(count);
    badge.style.display = count > 0 ? "flex" : "none";
  }
  renderNotificationList("notificationDropdownList");
}

export function renderProfileNotifications() {
  renderNotificationList("profileNotificationsList");
}

export function toggleNotificationDropdown() {
  const dd = document.getElementById("notificationDropdown");
  if (dd) dd.classList.toggle("open");
}

export async function initNotifications() {
  if (useApi()) await fetchNotificationsFromApi();
  renderNotificationBell();
  renderProfileNotifications();
  document.addEventListener("click", (e) => {
    const wrap = document.querySelector(".notification-wrap");
    if (wrap && !wrap.contains(e.target)) {
      document.getElementById("notificationDropdown")?.classList.remove("open");
    }
  });
}

export function notifyCourseUnlocked(courseName) {
  pushNotification(`Course unlocked: ${courseName}`, "course");
}

export function notifyAssessmentPassed(courseName, score) {
  pushNotification(`Assessment passed: ${courseName} (${score}%)`, "assessment");
}

export function notifyProjectMilestone(projectName) {
  pushNotification(`Project milestone completed: ${projectName}`, "project");
}

export function notifyGithubSync() {
  pushNotification("GitHub sync completed", "sync");
}

export function notifyInterviewScoreImproved(score) {
  pushNotification(`Interview score improved to ${score}%`, "interview");
}
