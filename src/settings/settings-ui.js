/** Settings — theme, accent, notifications; persisted to SQLite */
import { getToken } from "../shared/api-client.js";
import { loadRemoteState, saveRemoteStateDebounced } from "../shared/user-persistence.js";

const ACCENT_VARS = {
  rose: { primary: "#be185d", gradient: "linear-gradient(135deg, #fb7185, #c084fc, #38bdf8)" },
  lavender: { primary: "#9333ea", gradient: "linear-gradient(135deg, #c084fc, #a855f7, #818cf8)" },
  sky: { primary: "#0284c7", gradient: "linear-gradient(135deg, #38bdf8, #0ea5e9, #6366f1)" },
  pink: { primary: "#db2777", gradient: "linear-gradient(135deg, #f9a8d4, #ec4899, #c084fc)" }
};

function readLocalSettings() {
  return {
    theme: localStorage.getItem("nexusTheme") || "light",
    accent: localStorage.getItem("nexusAccent") || "rose",
    notifications: JSON.parse(localStorage.getItem("nexusNotifyPrefs") || "{}")
  };
}

let settingsHydrating = false;

function persistSettings() {
  if (settingsHydrating || !getToken()) return;
  const settings = readLocalSettings();
  saveRemoteStateDebounced("user_settings", settings);
}

export function setTheme(mode) {
  const safe = mode === "dark" ? "dark" : "light";
  document.body.classList.toggle("theme-dark", safe === "dark");
  document.body.classList.toggle("light-mode", safe === "light");
  localStorage.setItem("nexusTheme", safe);
  document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.themeBtn === safe);
  });
  const logo = document.querySelector(".nexusai-logo--sidebar");
  if (logo) {
    logo.src = safe === "dark" ? "assets/logo/nexusai-wordmark.svg" : "assets/logo/nexusai-wordmark-light.svg";
  }
  persistSettings();
}

export function setAccent(accent) {
  const vars = ACCENT_VARS[accent] || ACCENT_VARS.rose;
  document.documentElement.style.setProperty("--accent-primary", vars.primary);
  localStorage.setItem("nexusAccent", accent in ACCENT_VARS ? accent : "rose");
  document.querySelectorAll(".accent-swatch").forEach((sw) => {
    sw.classList.toggle("active", sw.dataset.accent === accent);
  });
  persistSettings();
}

export async function initTheme() {
  settingsHydrating = true;
  if (getToken()) {
    const remote = await loadRemoteState("user_settings", null);
    if (remote) {
      setTheme(remote.theme || "light");
      setAccent(remote.accent || "rose");
      initNotificationSettings(remote.notifications || {});
      settingsHydrating = false;
      return;
    }
  }
  const local = readLocalSettings();
  setTheme(local.theme);
  setAccent(local.accent);
  initNotificationSettings(local.notifications);
  settingsHydrating = false;
}

export function toggleDarkMode() {
  setTheme(document.body.classList.contains("theme-dark") ? "light" : "dark");
}

function initNotificationSettings(saved = {}) {
  const email = document.getElementById("notifyEmail");
  const desktop = document.getElementById("notifyDesktop");
  const learning = document.getElementById("notifyLearning");
  if (!email && !desktop && !learning) return;

  if (email) email.checked = saved.email !== false;
  if (desktop) desktop.checked = saved.desktop !== false;
  if (learning) learning.checked = saved.learning !== false;

  [email, desktop, learning].forEach((el) => {
    el?.removeEventListener("change", saveNotificationSettings);
    el?.addEventListener("change", saveNotificationSettings);
  });
}

export function saveNotificationSettings() {
  const prefs = {
    email: document.getElementById("notifyEmail")?.checked !== false,
    desktop: document.getElementById("notifyDesktop")?.checked !== false,
    learning: document.getElementById("notifyLearning")?.checked !== false
  };
  localStorage.setItem("nexusNotifyPrefs", JSON.stringify(prefs));
  persistSettings();
}

export function saveAccountSettings() {
  if (typeof window.saveProfile === "function") {
    window.saveProfile();
  }
}
