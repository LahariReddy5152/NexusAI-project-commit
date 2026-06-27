/** NexusAI API client — real backend integration */
const API_BASE = "/api";

export function getToken() {
  return localStorage.getItem("nexusToken");
}

export function setSession(token, user, rememberMe = false) {
  localStorage.setItem("nexusToken", token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", user?.role || "user");
  localStorage.setItem("nexusUser", JSON.stringify({ ...user, progress: user.progress || { points: 0, streak: 0, hours: 0 } }));
  if (rememberMe) localStorage.setItem("nexusRememberMe", "1");
  else localStorage.removeItem("nexusRememberMe");
}

export function clearSession() {
  localStorage.removeItem("nexusToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("nexusRememberMe");
  localStorage.removeItem("nexusDashboardStats");
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch {
    data = { success: false, message: res.statusText };
  }

  if (res.status === 401 && !path.startsWith("/auth/")) {
    clearSession();
    if (!window.location.pathname.includes("index.html") && window.location.pathname !== "/") {
      window.location.href = "index.html";
    }
  }

  return { ok: res.ok, status: res.status, data };
}

export async function signup(payload) {
  return api("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
}

export async function login(payload) {
  const { ok, data } = await api("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  if (ok && data.token) setSession(data.token, data.user, payload.rememberMe);
  return { ok, data };
}

export async function forgotPassword(email) {
  return api("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

export async function resetPassword(token, newPassword) {
  return api("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) });
}

export async function fetchMe() {
  return api("/auth/me");
}

export async function logoutApi() {
  const token = getToken();
  if (token) await api("/auth/logout", { method: "POST" });
  clearSession();
}

export async function syncUserData() {
  const { ok, data } = await fetchMe();
  if (!ok) return false;

  const user = { ...data.user, ...(data.profile || {}) };
  if (data.stats) {
    user.progress = {
      points: data.stats.totalXp || 0,
      streak: data.stats.dayStreak || 0,
      hours: data.stats.hoursLearned || 0
    };
    const { applyStatsToLocal, pullDashboardStats } = await import("../dashboard/dashboard-stats-store.js");
    applyStatsToLocal(data.stats);
    await pullDashboardStats();
  }
  localStorage.setItem("nexusUser", JSON.stringify(user));
  localStorage.setItem("userRole", user.role || "user");

  const { syncProjectsFromServer } = await import("../projects/project-sync.js");
  await syncProjectsFromServer();

  const { hydrateInterviewFromServer } = await import("../interview/interview-progress.js");
  const interview = await api("/progress/interview");
  if (interview.ok && interview.data.state) {
    hydrateInterviewFromServer(interview.data.state);
  }

  const { loadRemoteState } = await import("./user-persistence.js");
  const learnSession = await loadRemoteState("learn_session", null);
  if (learnSession?.pathId) {
    localStorage.setItem("nexusCurrentPath", learnSession.pathId);
    if (typeof learnSession.index === "number") {
      localStorage.setItem("nexusLastLesson", JSON.stringify(learnSession));
    }
  }

  const { loadCodeLabFromServer } = await import("../coding-lab/coding-lab.js");
  await loadCodeLabFromServer();

  const notif = await api("/notifications");
  if (notif.ok) {
    localStorage.setItem("nexusNotifications", JSON.stringify(notif.data.notifications || []));
  }

  const achievements = await api("/achievements");
  if (achievements.ok) {
    localStorage.setItem("nexusAchievementsSummary", JSON.stringify(achievements.data.summary || {}));
  }

  return true;
}

export async function aiChat(message, mode, context = {}) {
  const { ok, data } = await api("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message, mode, context })
  });
  return ok ? data : { success: false, reply: data.message || "AI unavailable" };
}

export async function analyzeResumeApi(text) {
  return api("/resume/analyze", { method: "POST", body: JSON.stringify({ text }) });
}

export async function tailorResumeApi(resume, jobDescription) {
  return api("/resume/tailor", { method: "POST", body: JSON.stringify({ resume, jobDescription }) });
}

export async function githubConnect(username, token) {
  return api("/github/connect", { method: "POST", body: JSON.stringify({ username, token }) });
}

export async function githubPush(url, projectName, progress, message) {
  return api("/github/push", {
    method: "POST",
    body: JSON.stringify({ url, projectName, progress, message })
  });
}

export async function githubCommits(url) {
  return api(`/github/commits?url=${encodeURIComponent(url)}`);
}

export async function evaluateSpeech(transcript, questionContext = "") {
  return api("/speech/evaluate", {
    method: "POST",
    body: JSON.stringify({ transcript, questionContext })
  });
}

export async function uploadFile(type, file) {
  const form = new FormData();
  form.append("file", file);
  return api(`/uploads/${type}`, { method: "POST", body: form });
}

export async function saveInterviewProgress(state, sectionId, entry) {
  return api("/progress/interview", {
    method: "PUT",
    body: JSON.stringify({ ...state, sectionId, entry })
  });
}

export async function pushNotificationApi(title, type = "info") {
  return api("/notifications", { method: "POST", body: JSON.stringify({ title, type }) });
}

export async function markNotificationReadApi(id) {
  return api(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsReadApi() {
  return api("/notifications/read-all", { method: "PATCH" });
}

export async function deleteNotificationApi(id) {
  return api(`/notifications/${id}`, { method: "DELETE" });
}

export async function archiveNotificationApi(id) {
  return api(`/notifications/${id}/archive`, { method: "PATCH" });
}

export function speakText(text) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}
