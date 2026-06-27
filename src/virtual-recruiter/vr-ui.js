import { LEARNING_PATHS, getPathProgressPercent } from "../learn/learn-data.js";
import { getOverallProgress } from "../dashboard/dashboard-activity.js";
import { getNextLessonInfo, getLessonsToday } from "../dashboard/dashboard-sync.js";
import { VR_MODES, VR_MODE_MAP, normalizeModeId, SECTION_VR_MODE } from "./vr-modes.js";

export function getRecruiterContext() {
  const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
  const pathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
  const pathMeta = LEARNING_PATHS.find((p) => p.id === pathId);
  const next = getNextLessonInfo();
  return {
    name: user.name || "Learner",
    pathId,
    pathTitle: pathMeta?.title || "Python Fundamentals",
    pathProgress: getPathProgressPercent(pathId),
    progress: getOverallProgress(),
    streak: user.progress?.streak || Math.max(1, Math.floor(getOverallProgress() / 5)),
    lessonsToday: getLessonsToday(),
    nextLesson: next.title,
    xp: user.progress?.points || 0
  };
}

/** Silent startup — no automatic greetings */
export function renderVirtualRecruiterGreeting() {
  const greetEl = document.getElementById("recruiterGreeting");
  if (greetEl) {
    greetEl.innerHTML = "";
    greetEl.classList.add("hidden");
  }
}

export function renderRecruiterClock() {
  const el = document.getElementById("recruiterClock");
  if (!el) return;
  const now = new Date();
  el.textContent = `${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · ${now.toLocaleTimeString()}`;
}

export function renderVrHistoryList() {
  const list = document.getElementById("vrHistoryList");
  if (!list) return;
  try {
    const history = JSON.parse(localStorage.getItem("nexusRecruiterHistory") || "[]").slice(-20).reverse();
    list.innerHTML = history.length
      ? history.map((h) => {
          const modeLabel = VR_MODE_MAP[normalizeModeId(h.mode)]?.label || h.mode || "Assistant";
          const snippet = (h.text || "").slice(0, 100);
          return `<li><strong>${h.role === "user" ? "You" : "Recruiter"}</strong> <span class="muted-text">[${modeLabel}]</span>: ${snippet}${h.text?.length > 100 ? "…" : ""}</li>`;
        }).join("")
      : "<li>No history yet — send a message to start.</li>";
  } catch {
    list.innerHTML = "<li>No history yet</li>";
  }
}

export function showVrPanel(section) {
  const clock = document.getElementById("recruiterClock");
  const hints = document.getElementById("mentorHints");
  const modeRow = document.querySelector(".vr-mode-row");
  const hist = document.getElementById("vrHistoryPanel");
  const messages = document.getElementById("chatMessages");
  const inputRow = document.getElementById("chatInputRow");

  const showChat = section !== "history";
  if (clock) clock.classList.toggle("hidden", section === "history");
  if (hints) hints.classList.toggle("hidden", section === "history");
  if (modeRow) modeRow.classList.toggle("hidden", section === "history");
  if (messages) messages.classList.toggle("hidden", !showChat);
  if (inputRow) inputRow.classList.toggle("hidden", !showChat);
  if (hist) {
    hist.classList.toggle("hidden", section !== "history");
    if (section === "history") renderVrHistoryList();
  }
}

export function minimizeRecruiter() {
  const box = document.getElementById("chatbotBox");
  if (box) box.classList.toggle("vr-minimized");
}

export function setMentorMode(mode, userInitiated = false) {
  const select = document.getElementById("mentorMode");
  const normalized = normalizeModeId(mode);
  if (select) {
    select.value = normalized;
    if (userInitiated) select.dataset.userOverride = "1";
    else delete select.dataset.userOverride;
  }
  const hints = document.getElementById("mentorHints");
  const cfg = VR_MODE_MAP[normalized];
  if (hints) hints.textContent = cfg ? `Mode: ${cfg.label} — ${cfg.hint}` : `Mode: ${normalized}`;
}

export function onMentorModeChange() {
  setMentorMode(document.getElementById("mentorMode")?.value, true);
}

export function applyVrModeForSection(sectionId) {
  const mode = SECTION_VR_MODE[sectionId];
  if (mode) setMentorMode(mode, false);
}

export function renderMentorModeOptions() {
  const select = document.getElementById("mentorMode");
  if (!select || select.dataset.vrModesBuilt) return;
  select.innerHTML = VR_MODES.map((m) => `<option value="${m.id}">${m.label}</option>`).join("");
  select.dataset.vrModesBuilt = "1";
  select.value = "general-assistant";
  onMentorModeChange();
}
