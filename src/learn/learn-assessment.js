/**
 * Placement assessment UI — theory, coding, practical, challenge project
 */
import { LEARNING_PATHS } from "./learn-data.js";
import {
  buildPlacementAssessment,
  setAssessmentScore,
  ASSESSMENT_PASS_PERCENT,
  getProgressionMeta,
  getAssessmentScore
} from "./learn-progression.js";

export { buildPlacementAssessment };

let activeAssessmentPathId = null;
let assessmentAnswers = {};

export function openPlacementAssessment(pathId) {
  activeAssessmentPathId = pathId;
  assessmentAnswers = {};
  const assessment = buildPlacementAssessment(pathId);
  const meta = getProgressionMeta(pathId);
  const existing = getAssessmentScore(pathId);

  let overlay = document.getElementById("placementAssessmentOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "placementAssessmentOverlay";
    overlay.className = "placement-assessment-overlay hidden";
    document.body.appendChild(overlay);
  }

  const theoryHtml = assessment.theoryQuestions.map((q, i) => `
    <div class="assessment-block glass-card">
      <p class="muted-text">${q.topic} · Theory</p>
      <p><strong>${q.question}</strong></p>
      ${q.options.map((opt, oi) => `
        <label class="assessment-option">
          <input type="radio" name="theory_${i}" value="${oi}" onchange="setAssessmentAnswer('theory_${i}', ${oi})"> ${opt}
        </label>`).join("")}
    </div>`).join("");

  const codingHtml = assessment.codingQuestions.map((q, i) => `
    <div class="assessment-block glass-card">
      <p class="muted-text">${q.topic} · Coding</p>
      <p>${q.prompt}</p>
      <textarea class="assessment-textarea" rows="5" placeholder="Write your code here…" oninput="setAssessmentAnswer('coding_${i}', this.value)"></textarea>
    </div>`).join("");

  const practicalHtml = assessment.practicalExercises.map((q, i) => `
    <div class="assessment-block glass-card">
      <p class="muted-text">${q.topic} · Practical</p>
      <p>${q.prompt}</p>
      <textarea class="assessment-textarea" rows="4" placeholder="Your approach…" oninput="setAssessmentAnswer('practical_${i}', this.value)"></textarea>
    </div>`).join("");

  overlay.innerHTML = `
    <div class="placement-assessment-modal glass-card">
      <button class="close-btn assessment-close" onclick="closePlacementAssessment()">×</button>
      <h2>${meta.levelTitle} Placement Assessment</h2>
      <p class="section-subtitle">Score ${ASSESSMENT_PASS_PERCENT}% or higher to unlock the next level without completing every lesson.</p>
      ${existing ? `<p class="assessment-prior-score">Previous best: <strong>${existing}%</strong></p>` : ""}
      <div class="assessment-sections">
        <h3>Theory Questions</h3>${theoryHtml}
        <h3>Coding Questions</h3>${codingHtml}
        <h3>Practical Exercises</h3>${practicalHtml}
        <h3>Challenge Project</h3>
        <div class="assessment-block glass-card">
          <p><strong>${assessment.challengeProject.title}</strong></p>
          <p>${assessment.challengeProject.prompt}</p>
          <textarea class="assessment-textarea" rows="5" placeholder="Describe your mini project plan and key implementation steps…" oninput="setAssessmentAnswer('challenge', this.value)"></textarea>
        </div>
      </div>
      <div class="assessment-actions">
        <button class="glass-btn" onclick="closePlacementAssessment()">Cancel</button>
        <button class="primary-btn" onclick="submitPlacementAssessment()">Submit Assessment</button>
      </div>
    </div>`;

  overlay.classList.remove("hidden");
}

export function setAssessmentAnswer(key, value) {
  assessmentAnswers[key] = value;
}

export function closePlacementAssessment() {
  document.getElementById("placementAssessmentOverlay")?.classList.add("hidden");
  activeAssessmentPathId = null;
}

export function submitPlacementAssessment() {
  if (!activeAssessmentPathId) return;
  const assessment = buildPlacementAssessment(activeAssessmentPathId);
  let earned = 0;
  let possible = 0;

  assessment.theoryQuestions.forEach((q, i) => {
    possible += 10;
    const ans = assessmentAnswers[`theory_${i}`];
    if (Number(ans) === q.correct) earned += 10;
  });

  assessment.codingQuestions.forEach((q, i) => {
    possible += 15;
    const ans = (assessmentAnswers[`coding_${i}`] || "").trim();
    if (ans.length > 40) earned += 15;
    else if (ans.length > 10) earned += 8;
  });

  assessment.practicalExercises.forEach((q, i) => {
    possible += 10;
    const ans = (assessmentAnswers[`practical_${i}`] || "").trim();
    if (ans.length > 50) earned += 10;
    else if (ans.length > 15) earned += 5;
  });

  possible += 25;
  const challenge = (assessmentAnswers.challenge || "").trim();
  if (challenge.length > 80) earned += 25;
  else if (challenge.length > 30) earned += 12;

  const score = possible ? Math.round((earned / possible) * 100) : 0;
  setAssessmentScore(activeAssessmentPathId, Math.max(score, getAssessmentScore(activeAssessmentPathId)));

  const path = LEARNING_PATHS.find((p) => p.id === activeAssessmentPathId);
  const meta = getProgressionMeta(activeAssessmentPathId);
  const finalScore = getAssessmentScore(activeAssessmentPathId);
  const passed = finalScore >= ASSESSMENT_PASS_PERCENT;

  const resultEl = document.createElement("div");
  resultEl.className = `assessment-result-banner ${passed ? "passed" : "failed"}`;
  resultEl.textContent = passed
    ? `${meta.levelTitle} Assessment passed (${finalScore}%). The next level in this technology track is now unlocked.`
    : `${meta.levelTitle} Assessment score: ${finalScore}%. You need ${ASSESSMENT_PASS_PERCENT}% to unlock the next level via assessment.`;
  document.querySelector(".placement-assessment-modal")?.prepend(resultEl);

  setTimeout(() => {
    closePlacementAssessment();
    if (typeof window.renderCourseCatalog === "function") window.renderCourseCatalog();
    if (typeof window.renderCoursePage === "function" && window.currentPathId === path?.id) window.renderCoursePage();
  }, passed ? 1200 : 2200);
}
