/** App shell navigation and Virtual Recruiter toggle */
import { showVrPanel, onMentorModeChange, renderMentorModeOptions, applyVrModeForSection, renderRecruiterClock, minimizeRecruiter } from "../virtual-recruiter/vr-ui.js";

export function showSection(id) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });
  const target = document.getElementById(id);
  if (!target) {
    console.warn("Section not found:", id);
    return;
  }
  target.classList.remove("hidden");

  if (typeof window.setActiveNav === "function") {
    window.setActiveNav(id);
  }

  if (id !== "learnSection") {
    document.getElementById("lessonView")?.classList.add("hidden");
  }
  if (id === "learnSection" && typeof window.backToCourseCatalog === "function") {
    window.backToCourseCatalog();
  }

  applyVrModeForSection(id);
}

export function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("active");
}

export function toggleGlobalRecruiter() {
  const box = document.getElementById("chatbotBox");
  const btn = document.getElementById("vrToggleBtn");
  if (!box) return;
  renderMentorModeOptions();
  box.classList.toggle("hidden");
  box.classList.remove("vr-minimized");
  if (!box.classList.contains("hidden")) {
    renderRecruiterClock();
    if (typeof window.renderVrHistoryList === "function") window.renderVrHistoryList();
    showVrPanel("chat");
  }
  if (btn) btn.classList.toggle("hidden", !box.classList.contains("hidden"));
}

export function openRecruiterMode(mode) {
  const box = document.getElementById("chatbotBox");
  if (box?.classList.contains("hidden")) toggleGlobalRecruiter();
  renderMentorModeOptions();
  const select = document.getElementById("mentorMode");
  if (select) {
    const map = {
      resume: "resume-reviewer",
      interview: "interview-coach",
      career: "career-advisor",
      learning: "learning-mentor",
      project: "project-mentor",
      coding: "coding-assistant",
      general: "general-assistant",
      "job-search": "job-search"
    };
    select.value = map[mode] || mode || "general-assistant";
  }
  onMentorModeChange();
  showVrPanel("chat");
  renderRecruiterClock();
}

export { onMentorModeChange, minimizeRecruiter } from "../virtual-recruiter/vr-ui.js";

export function switchToLearningMode() {
  showSection("learnSection");
}

export function switchTab(tabName, clickEvent) {
  ["learnTab", "practiceTab", "quizTab"].forEach((id) => {
    document.getElementById(id)?.classList.add("hidden");
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`${tabName}Tab`)?.classList.remove("hidden");
  if (clickEvent?.target) {
    clickEvent.target.classList.add("active");
  } else {
    document.querySelector(`.tab-btn[onclick*="switchTab('${tabName}'"]`)?.classList.add("active");
  }
}

export function openCodeLabAssistant() {
  showSection("codingLabSection");
  openRecruiterMode("coding-assistant");
}
