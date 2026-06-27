/** Interview Prep — Phase 4 side-by-side workspace */

import {

  SECTION_CONFIG,

  getQuestionsForSection,

  getQuestionById,

  getSectionRecommendations

} from "./interview-data.js";

import {

  saveSectionScore,

  loadSectionProgress,

  setSectionQuestionTotal,

  loadInterviewMeta,

  saveInterviewMeta,

  INTERVIEW_SECTION_IDS

} from "./interview-progress.js";

import { saveInterviewProgress, evaluateSpeech, getToken } from "../shared/api-client.js";

let activeSection = "mock";
let activeTopic = "all";

let activeDifficulty = "all";

let activeQuestionId = "";

let mockInputMode = "text";

let mockSessionActive = false;

let speechRecognition = null;



function panelId(section) {

  return `interviewPanel${section.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("")}`;

}



export function showInterviewPanel(section, event) {

  if (!SECTION_CONFIG[section]) return;

  activeSection = section;

  activeQuestionId = "";



  INTERVIEW_SECTION_IDS.forEach((id) => {

    document.getElementById(panelId(id))?.classList.add("hidden");

  });

  document.getElementById(panelId(section))?.classList.remove("hidden");



  document.querySelectorAll(".interview-nav-tabs .category-tab").forEach((t) => t.classList.remove("active"));

  if (event?.target) event.target.classList.add("active");

  else {

    document.querySelector(`.interview-nav-tabs .category-tab[onclick*="'${section}'"]`)?.classList.add("active");

  }



  const meta = loadInterviewMeta(section);

  activeTopic = meta.currentTopic || "all";

  activeDifficulty = meta.currentDifficulty || "all";

  mockInputMode = meta.mockInputMode || "text";



  renderSectionIntro(section);

  renderSubTopicNav(section);

  renderDifficultyFilter();

  renderMockInputModes();

  renderQuestionBank();

  renderProgressUI();

  renderRecommendations();

  updateMockSessionUI();

}



function renderSectionIntro(section) {

  const cfg = SECTION_CONFIG[section];

  const el = document.getElementById("interviewSectionIntro");

  if (!el || !cfg) return;

  el.innerHTML = `<h3>${cfg.label}</h3><p>${cfg.description}</p>`;

}



function renderSubTopicNav(section) {

  const nav = document.getElementById("interviewSubTopics");

  if (!nav) return;

  const cfg = SECTION_CONFIG[section];

  const topics = section === "mock"

    ? [{ id: "all", label: "All Topics" }, ...(cfg?.topics || [])]

    : cfg?.topics || [];



  if (!topics.length) {

    nav.innerHTML = "";

    return;

  }



  nav.innerHTML = `<div class="interview-topic-row">${topics

    .map(

      (t) =>

        `<button type="button" class="glass-btn interview-topic-btn ${activeTopic === t.id ? "active" : ""}" data-topic="${t.id}">${t.label}</button>`

    )

    .join("")}</div>`;



  nav.querySelectorAll(".interview-topic-btn").forEach((btn) => {

    btn.addEventListener("click", () => {

      activeTopic = btn.dataset.topic || "all";

      saveInterviewMeta(activeSection, { currentTopic: activeTopic });

      renderSubTopicNav(activeSection);

      renderQuestionBank();

    });

  });

}



function renderDifficultyFilter() {

  const sel = document.getElementById("interviewDifficulty");

  if (!sel) return;

  sel.value = activeDifficulty;

  sel.onchange = () => {

    activeDifficulty = sel.value;

    saveInterviewMeta(activeSection, { currentDifficulty: activeDifficulty });

    renderQuestionBank();

  };

}



function renderMockInputModes() {

  const panel = document.getElementById("mockInputModesPanel");

  if (!panel) return;

  const show = activeSection === "mock";

  panel.classList.toggle("hidden", !show);

  if (!show) return;



  panel.innerHTML = `

    <h4>Select response mode before starting</h4>

    <div class="mock-input-modes">

      <button type="button" class="glass-btn mock-mode-btn ${mockInputMode === "audio" ? "active" : ""}" data-mode="audio">🎤 Audio</button>

      <button type="button" class="glass-btn mock-mode-btn ${mockInputMode === "text" ? "active" : ""}" data-mode="text">✏️ Text</button>

      <button type="button" class="glass-btn mock-mode-btn ${mockInputMode === "video" ? "active" : ""}" data-mode="video">📹 Video</button>

    </div>

    <button type="button" class="glass-btn" id="startMockBtn">Start Mock Interview</button>`;



  panel.querySelectorAll(".mock-mode-btn").forEach((btn) => {

    btn.addEventListener("click", () => selectMockInputMode(btn.dataset.mode));

  });

  document.getElementById("startMockBtn")?.addEventListener("click", startMockInterview);

}



export function selectMockInputMode(mode) {

  mockInputMode = mode || "text";

  saveInterviewMeta("mock", { mockInputMode: mockInputMode });

  renderMockInputModes();

  updateMockSessionUI();

}



export function startMockInterview() {

  if (!mockInputMode) {

    selectMockInputMode("text");

  }

  mockSessionActive = true;

  const questions = getQuestionsForSection("mock", activeTopic, activeDifficulty);

  if (questions.length) {

    selectInterviewQuestion(questions[Math.floor(Math.random() * questions.length)].id);

  }

  updateMockSessionUI();

  const status = document.getElementById("mockSessionStatus");

  if (status) {

    status.textContent = `Session active — respond via ${mockInputMode}. AI will evaluate your answer.`;

  }

}



function updateMockSessionUI() {
  const voiceBtn = document.getElementById("mockVoiceBtn");
  const videoNote = document.getElementById("mockVideoNote");
  const isMock = activeSection === "mock";

  document.getElementById("mockInputModesPanel")?.classList.toggle("hidden", !isMock);
  voiceBtn?.classList.toggle("hidden", !isMock || mockInputMode !== "audio" || !mockSessionActive);
  videoNote?.classList.toggle("hidden", !isMock || mockInputMode !== "video" || !mockSessionActive);
}



function renderQuestionBank() {

  const list = document.getElementById("interviewQuestionList");

  if (!list) return;



  const topic = activeTopic === "all" ? "all" : activeTopic;

  const questions = getQuestionsForSection(activeSection, topic, activeDifficulty);

  setSectionQuestionTotal(activeSection, getQuestionsForSection(activeSection).length);



  if (!questions.length) {

    list.innerHTML = "<li>No questions for this filter.</li>";

    return;

  }



  list.innerHTML = questions

    .map(

      (q) =>

        `<li class="interview-q-item ${q.id === activeQuestionId ? "active" : ""}" data-qid="${q.id}">

          <button type="button" class="interview-q-btn" onclick="selectInterviewQuestion('${q.id}')">

            <span class="difficulty-badge">${q.difficulty}</span>

            <span class="topic-badge">${q.topicLabel}</span>

            ${q.question}

          </button>

        </li>`

    )

    .join("");



  const pick = questions.find((q) => q.id === activeQuestionId) || questions[0];

  selectInterviewQuestion(pick.id);

}



export function selectInterviewQuestion(id) {

  const q = getQuestionById(id);

  if (!q) return;

  activeQuestionId = id;

  saveInterviewMeta(activeSection, { activeQuestionId: id });



  document.querySelectorAll(".interview-q-item").forEach((li) => {

    li.classList.toggle("active", li.dataset.qid === id);

  });



  const activeEl = document.getElementById("interviewActiveQuestion");

  const sampleEl = document.getElementById("interviewSampleAnswer");



  if (activeEl) {

    activeEl.innerHTML = `<div class="mock-question-box"><h4>AI Question</h4><p><strong>[${q.difficulty}] ${q.topicLabel}</strong></p><p>${q.question}</p></div>`;

  }

  if (sampleEl) {

    sampleEl.textContent = q.sampleAnswer;

  }

}



export function startMockVoiceCapture() {

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    document.getElementById("interviewFeedback").textContent = "Voice not supported in this browser — use text mode.";

    return;

  }

  if (speechRecognition) {

    speechRecognition.stop();

    speechRecognition = null;

    document.getElementById("mockVoiceBtn").textContent = "🎤 Start Voice Answer";

    return;

  }



  speechRecognition = new SpeechRecognition();

  speechRecognition.continuous = true;

  speechRecognition.interimResults = false;

  speechRecognition.lang = "en-US";

  const answerInput = document.getElementById("interviewAnswer");

  answerInput.value = "";



  speechRecognition.onresult = (e) => {

    const transcript = Array.from(e.results)

      .map((r) => r[0].transcript)

      .join(" ");

    answerInput.value = transcript;

  };

  speechRecognition.onend = () => {

    document.getElementById("mockVoiceBtn").textContent = "🎤 Start Voice Answer";

    speechRecognition = null;

  };

  speechRecognition.start();

  document.getElementById("mockVoiceBtn").textContent = "⏹ Stop Recording";

}



export function analyzeVoiceResponse(text) {

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);

  const fillers = ["um", "uh", "like", "you know", "basically", "actually", "sort of", "kind of"];

  const fillerCount = fillers.reduce((n, f) => n + (text.toLowerCase().match(new RegExp(`\\b${f}\\b`, "g"))?.length || 0), 0);

  const unique = new Set(words);

  const repetitionRatio = words.length ? 1 - unique.size / words.length : 0;

  const wpm = words.length ? Math.round((words.length / Math.max(text.split(/[.!?]+/).length, 1)) * 15) : 0;

  const confidenceWords = ["i led", "i implemented", "i designed", "we shipped", "result was", "improved by"];

  const confidenceHits = confidenceWords.filter((c) => text.toLowerCase().includes(c)).length;



  const suggestions = [];

  if (fillerCount > 2) suggestions.push("Reduce filler words — pause briefly instead of saying um/like.");

  if (repetitionRatio > 0.15) suggestions.push("Improve clarity — avoid repeating the same phrases.");

  if (wpm > 180) suggestions.push("Slow speaking speed slightly for better clarity.");

  if (wpm < 90 && words.length > 20) suggestions.push("Speaking pace is slow — tighten structure to stay within time.");

  if (confidenceHits < 1) suggestions.push("Improve confidence — use active ownership language (I led, I implemented).");

  if (!/\bfirst|second|then|finally|because\b/i.test(text)) {

    suggestions.push("Improve structure — use signposting (First, Then, Result).");

  }

  if (suggestions.length === 0) suggestions.push("Strong delivery — maintain this clarity and structure.");



  return {

    fillerCount,

    repetitionRatio: Math.round(repetitionRatio * 100),

    wpm,

    confidenceHits,

    suggestions

  };

}



export async function evaluateInterviewAnswer() {

  const answerInput = document.getElementById("interviewAnswer");

  const feedbackEl = document.getElementById("interviewFeedback");

  const scoreInput = document.getElementById("interviewScore");

  const voicePanel = document.getElementById("voiceAnalysisPanel");

  if (!answerInput || !feedbackEl) return;



  const answer = answerInput.value.trim();

  if (!answer) {

    feedbackEl.textContent = "Provide a response before evaluating.";

    return;

  }



  const q = getQuestionById(activeQuestionId);

  const wordCount = answer.split(/\s+/).length;

  const hasSTAR = /situation|task|action|result/i.test(answer);

  const hasMetrics = /\d+%|\d+ (users|ms|seconds|requests|improvements)/i.test(answer);

  const hasTradeoff = /tradeoff|trade-off|however|alternatively/i.test(answer);

  const hasStructure = /\b(first|then|finally|because|step)\b/i.test(answer);



  let technical = 40;

  let communication = 50;

  let confidence = 50;

  let clarity = 50;

  let structure = 45;

  const notes = [];



  if (wordCount >= 40) {

    communication += 15;

    clarity += 10;

    notes.push("✓ Adequate detail");

  } else {

    notes.push("⚠ Expand with specifics");

  }



  if (hasSTAR) {

    structure += 25;

    notes.push("✓ STAR structure detected");

  } else if (hasStructure) {

    structure += 15;

    notes.push("✓ Structured delivery");

  }



  if (hasMetrics) {

    technical += 15;

    confidence += 10;

    notes.push("✓ Measurable outcomes");

  }



  if (hasTradeoff) {

    technical += 10;

    notes.push("✓ Tradeoffs discussed");

  }



  if (q) {

    const keywords = q.sampleAnswer.toLowerCase().split(/\W+/).filter((w) => w.length > 5);

    const matched = keywords.filter((k) => answer.toLowerCase().includes(k)).length;

    if (matched >= 3) {

      technical += 15;

      notes.push("✓ Key concepts covered");

    }

  }



  let voiceAnalysis = null;

  if (activeSection === "mock" && (mockInputMode === "audio" || mockInputMode === "video")) {
    if (getToken()) {
      const q = getQuestionById(activeQuestionId);
      const { ok, data } = await evaluateSpeech(answer, q?.question || "");
      if (ok && data.success) {
        voiceAnalysis = {
          fillerCount: data.fillerCount,
          repetitionRatio: data.repetitionRatio,
          wpm: data.wordsPerMinute,
          confidenceHits: data.confidenceHits,
          suggestions: data.suggestions
        };
      } else {
        voiceAnalysis = analyzeVoiceResponse(answer);
      }
    } else {
      voiceAnalysis = analyzeVoiceResponse(answer);
    }

    if (voiceAnalysis.fillerCount <= 2) clarity += 10;

    if (voiceAnalysis.confidenceHits >= 1) confidence += 15;

    if (voiceAnalysis.repetitionRatio < 15) clarity += 10;

  }



  const score = Math.min(

    100,

    Math.round((technical + communication + confidence + clarity + structure) / 5)

  );



  feedbackEl.innerHTML = `

    <strong>Overall: ${score}/100</strong>

    <div class="mock-session-grid" style="margin-top:10px">

      <div><strong>Technical:</strong> ${Math.min(100, technical)}</div>

      <div><strong>Communication:</strong> ${Math.min(100, communication)}</div>

      <div><strong>Confidence:</strong> ${Math.min(100, confidence)}</div>

      <div><strong>Clarity:</strong> ${Math.min(100, clarity)}</div>

      <div><strong>Structure:</strong> ${Math.min(100, structure)}</div>

    </div>

    <p style="margin-top:8px">${notes.join(" · ")}</p>`;



  if (voicePanel && voiceAnalysis) {

    voicePanel.classList.remove("hidden");

    voicePanel.innerHTML = `

      <h4>Voice Analysis</h4>

      <p>Filler words: ${voiceAnalysis.fillerCount} · Repetition: ${voiceAnalysis.repetitionRatio}% · Pace: ~${voiceAnalysis.wpm} wpm · Confidence signals: ${voiceAnalysis.confidenceHits}</p>

      <strong>Suggestions</strong>

      <ul>${voiceAnalysis.suggestions.map((s) => `<li>${s}</li>`).join("")}</ul>`;

  } else if (voicePanel) {

    voicePanel.classList.add("hidden");

  }



  if (scoreInput) scoreInput.value = String(score);

}



export function saveInterviewScore() {

  const scoreInput = document.getElementById("interviewScore");

  const statusEl = document.getElementById("interviewScoreStatus");

  if (!scoreInput) return;



  const score = parseInt(scoreInput.value, 10);

  if (Number.isNaN(score) || score < 0 || score > 100) {

    if (statusEl) statusEl.textContent = "Enter a valid score between 0 and 100.";

    return;

  }



  saveSectionScore(activeSection, {
    score,
    questionId: activeQuestionId,
    topic: activeTopic
  });

  if (getToken()) {
    saveInterviewProgress(
      {
        [`interviewProgress_${activeSection}`]: loadSectionProgress(activeSection),
        [`interviewScores_${activeSection}`]: JSON.parse(localStorage.getItem(`interviewScores_${activeSection}`) || "[]")
      },
      activeSection,
      { score, questionId: activeQuestionId, topic: activeTopic }
    );
  }



  const progress = loadSectionProgress(activeSection);

  if (statusEl) {

    statusEl.textContent = `Saved ${score} for ${SECTION_CONFIG[activeSection].label}. Attempts: ${progress.attempted} | Avg: ${progress.avgScore}%`;

  }



  renderProgressUI();

  renderRecommendations();

}



export function generateInterviewQuestions() {

  renderQuestionBank();

}



function renderProgressUI() {

  const el = document.getElementById("interviewProgressDisplay");

  if (!el) return;

  const progress = loadSectionProgress(activeSection);

  const pct = progress.total

    ? Math.min(100, Math.round((progress.attempted / progress.total) * 100))

    : 0;

  el.innerHTML = `

    <p class="stat-value">${progress.avgScore}%</p>

    <p class="muted-text">Average score</p>

    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>

    <p class="muted-text">Attempts: ${progress.attempted} · Last: ${progress.lastScore}%</p>`;

}



function renderRecommendations() {

  const el = document.getElementById("interviewRecommendations");

  if (!el) return;

  const progress = loadSectionProgress(activeSection);

  const recs = getSectionRecommendations(activeSection, progress);

  el.innerHTML = recs.map((r) => `<li>${r}</li>`).join("");

}



export function initInterviewSection() {

  if (!document.getElementById("interviewSection")) return;

  showInterviewPanel(activeSection);

}



export function openInterviewPrepCard(type) {

  const map = {

    mock: "mock",

    technical: "technical",

    system: "system-design",

    ai: "ai-track",

    coach: "mock"

  };

  showInterviewPanel(map[type] || "mock");

}



/** Legacy no-ops — timed mode removed */

export function startMockTimer() {}

export function stopMockTimer() {}


