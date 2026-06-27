/** Career and Interview hub section cards */
import { loadSectionProgress, INTERVIEW_SECTION_IDS } from "../interview/interview-progress.js";

export function renderInterviewHubCards() {
  const el = document.getElementById("interviewHubCards");
  if (!el) return;

  const tracks = [
    { id: "dsa", label: "DSA", icon: "🧩", panel: "technical", topic: "Data Structures" },
    { id: "java", label: "Java", icon: "☕", panel: "technical", topic: "Java" },
    { id: "spring", label: "Spring Boot", icon: "🍃", panel: "technical", topic: "Spring Boot" },
    { id: "sql", label: "SQL", icon: "🗄️", panel: "technical", topic: "SQL" },
    { id: "system", label: "System Design", icon: "🏗️", panel: "system-design", topic: "System Design" },
    { id: "behavioral", label: "Behavioral", icon: "💬", panel: "mock", topic: "Behavioral" }
  ];

  el.innerHTML = tracks
    .map((t) => {
      const prog = INTERVIEW_SECTION_IDS.reduce((s, id) => s + (loadSectionProgress(id).attempted || 0), 0);
      return `<button type="button" class="hub-card glass-card" onclick="openInterviewHubTrack('${t.panel}','${t.topic.replace(/'/g, "\\'")}')">
        <div class="hub-card-icon">${t.icon}</div>
        <h3>${t.label}</h3>
        <p>Practice questions & scoring</p>
        <span class="hub-stat">${prog} sessions logged</span>
      </button>`;
    })
    .join("");
}

export function openInterviewHubTrack(panel, topic) {
  if (typeof window.showInterviewPanel === "function") {
    window.showInterviewPanel(panel);
  }
  if (typeof window.generateInterviewQuestions === "function") {
    window.generateInterviewQuestions(topic);
  }
}

export function renderCareerHubCards() {
  const el = document.getElementById("careerHubCards");
  if (!el) return;

  const cards = [
    { id: "resume", label: "Resume Builder", icon: "📄", desc: "Analyze & optimize your resume", action: "showCareerPanel('resume')" },
    { id: "jobs", label: "Job Tracker", icon: "📋", desc: "Track applications & status", action: "showCareerPanel('tailor')" },
    { id: "applications", label: "Applications", icon: "📨", desc: "Manage submitted roles", action: "showCareerPanel('resume')" },
    { id: "certs", label: "Certifications", icon: "🏆", desc: "View earned certificates", action: "showSection('profileSection')" },
    { id: "skills", label: "Skill Gap Analysis", icon: "📊", desc: "Identify missing keywords", action: "showCareerPanel('resume')" }
  ];

  el.innerHTML = cards
    .map(
      (c) => `<button type="button" class="hub-card glass-card" onclick="${c.action}">
        <div class="hub-card-icon">${c.icon}</div>
        <h3>${c.label}</h3>
        <p>${c.desc}</p>
      </button>`
    )
    .join("");
}
