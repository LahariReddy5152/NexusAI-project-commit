/** @module shared/helpers — DOM and UI utilities */
export function updateEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function setJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
