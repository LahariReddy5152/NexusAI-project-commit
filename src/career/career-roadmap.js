/** Career Roadmap UI — independent paths, assessments, progress */
import { CAREER_ROADMAPS, getRoadmapById, getAssessmentQuestions } from "./career-roadmap-data.js";
import {
  ASSESSMENT_PASS_PERCENT,
  loadMilestones,
  saveMilestone,
  loadPathProgress,
  syncProgress,
  checkStageUnlocked,
  saveAssessmentResult,
  loadAssessmentResults
} from "./career-roadmap-progress.js";

let activePathId = null;
let activeAssessment = null;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&#39;");
}

export function renderCareerRoadmap() {
  const list = document.getElementById("careerRoadmapList");
  const detail = document.getElementById("careerRoadmapDetail");
  if (!list) return;

  if (detail) detail.classList.add("hidden");
  list.classList.remove("hidden");
  activePathId = null;

  list.innerHTML = `
    <p class="muted-text">Select any career path — no prerequisites between paths. Progress is tracked separately for each role.</p>
    <div class="career-paths-grid">
      ${CAREER_ROADMAPS.map((p) => {
        const prog = loadPathProgress(p.id);
        syncProgress(p.id, p.milestoneIds.length, p.milestoneIds);
        const updated = loadPathProgress(p.id);
        return `
          <div class="glass-card career-path-card" data-path="${p.id}">
            <h4>${esc(p.title)}</h4>
            <p class="muted-text">Timeline: ${esc(p.timeline)}</p>
            <div class="progress-bar"><div class="progress-fill" style="width:${updated.completionPercent}%"></div></div>
            <p>${updated.completionPercent}% complete · Stage: ${updated.currentStage}</p>
            <button type="button" class="glass-btn" onclick="openCareerRoadmapPath('${p.id}')">Open Roadmap</button>
          </div>`;
      }).join("")}
    </div>`;
}

export function openCareerRoadmapPath(pathId) {
  const roadmap = getRoadmapById(pathId);
  if (!roadmap) return;
  activePathId = pathId;

  const list = document.getElementById("careerRoadmapList");
  const detail = document.getElementById("careerRoadmapDetail");
  const content = document.getElementById("careerRoadmapDetailContent");
  if (!content) return;

  list?.classList.add("hidden");
  detail?.classList.remove("hidden");
  hideAssessmentPanel();

  syncProgress(pathId, roadmap.milestoneIds.length, roadmap.milestoneIds);
  const progress = loadPathProgress(pathId);
  const milestones = loadMilestones(pathId);
  const assessments = loadAssessmentResults(pathId);

  const stageHtml = (stageKey) => {
    const stage = roadmap.stages[stageKey];
    const unlocked = checkStageUnlocked(pathId, stageKey, roadmap.milestoneIds);
    const prefix = stageKey === "beginner" ? "b" : stageKey === "intermediate" ? "i" : "a";
    const ids = roadmap.milestoneIds.filter((id) => id.startsWith(`${prefix}-`));

    const milestoneList = ids
      .map((mid, idx) => {
        const label = stage.milestones[idx] || `Milestone ${idx + 1}`;
        const checked = milestones[mid] ? "checked" : "";
        const disabled = unlocked ? "" : "disabled";
        return `<label><input type="checkbox" data-milestone="${mid}" ${checked} ${disabled} onchange="toggleCareerMilestone('${pathId}','${mid}',this.checked)"> ${esc(label)}</label>`;
      })
      .join("");

    const assessBtn =
      stageKey !== "beginner"
        ? `<button type="button" class="glass-btn" onclick="startCareerAssessment('${pathId}','${stageKey}')" ${unlocked ? "" : ""}>Take ${stageKey} placement assessment (80% to unlock)</button>
           <p class="muted-text">Assessment: ${assessments[stageKey]?.passed ? `Passed ${assessments[stageKey].score}%` : "Not passed yet"}</p>`
        : "";

    return `
      <div class="roadmap-stage ${unlocked ? "" : "roadmap-stage-locked"}">
        <h4>${esc(stage.title)} ${unlocked ? "" : "🔒"}</h4>
        <p><strong>Skills:</strong> ${stage.skills.map(esc).join(", ")}</p>
        <p><strong>Interview topics:</strong> ${stage.interviewTopics.map(esc).join("; ")}</p>
        <h5>Milestones</h5>
        <div class="roadmap-milestones">${milestoneList || "<p>Complete assessment to unlock milestones.</p>"}</div>
        ${assessBtn}
      </div>`;
  };

  content.innerHTML = `
    <h3>${esc(roadmap.title)}</h3>
    <p><strong>Estimated timeline:</strong> ${esc(roadmap.timeline)}</p>
    <p><strong>Completion:</strong> ${progress.completionPercent}% (${progress.milestonesDone}/${progress.milestonesTotal} milestones)</p>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress.completionPercent}%"></div></div>

    <h4>Technologies Required</h4>
    <ul>${roadmap.technologies.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>

    <h4>Recommended Order</h4>
    <ol>${roadmap.recommendedOrder.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>

    <h4>Projects</h4>
    <ul>${roadmap.projects.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>

    <h4>Certifications</h4>
    <ul>${roadmap.certifications.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>

    <h4>Interview Preparation Topics</h4>
    <ul>${roadmap.interviewTopics.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>

    <h4>Skill Progress by Stage</h4>
    ${stageHtml("beginner")}
    ${stageHtml("intermediate")}
    ${stageHtml("advanced")}

    <div id="careerRoadmapSkillTrack" class="roadmap-skill-track">
      <h4>Skill Progress Tracking</h4>
      <p>Beginner: ${milestoneProgress(pathId, roadmap, "beginner")}% ·
         Intermediate: ${milestoneProgress(pathId, roadmap, "intermediate")}% ·
         Advanced: ${milestoneProgress(pathId, roadmap, "advanced")}%</p>
    </div>`;
}

function milestoneProgress(pathId, roadmap, stageKey) {
  const prefix = stageKey === "beginner" ? "b" : stageKey === "intermediate" ? "i" : "a";
  const ids = roadmap.milestoneIds.filter((id) => id.startsWith(`${prefix}-`));
  if (!ids.length) return 0;
  const m = loadMilestones(pathId);
  const done = ids.filter((id) => m[id]).length;
  return Math.round((done / ids.length) * 100);
}

export function closeCareerRoadmapDetail() {
  renderCareerRoadmap();
}

export function toggleCareerMilestone(pathId, milestoneId, checked) {
  saveMilestone(pathId, milestoneId, checked);
  const roadmap = getRoadmapById(pathId);
  if (roadmap) syncProgress(pathId, roadmap.milestoneIds.length, roadmap.milestoneIds);
  openCareerRoadmapPath(pathId);
}

export function startCareerAssessment(pathId, targetStage) {
  const roadmap = getRoadmapById(pathId);
  const level = targetStage === "advanced" ? "advanced" : "intermediate";
  if (level === "advanced" && roadmap && !checkStageUnlocked(pathId, "intermediate", roadmap.milestoneIds)) {
    const resultEl = document.getElementById("careerAssessmentResult");
    if (resultEl) resultEl.textContent = "Unlock the intermediate stage first (milestones or assessment).";
    return;
  }
  const questions = getAssessmentQuestions(pathId, level);
  if (!questions.length) return;

  activePathId = pathId;
  activeAssessment = { pathId, level, questions, answers: [] };

  const panel = document.getElementById("careerRoadmapAssessmentPanel");
  const body = document.getElementById("careerAssessmentBody");
  if (!panel || !body) return;

  body.innerHTML = `
    <h4>${esc(getRoadmapById(pathId)?.title || pathId)} — ${level} placement</h4>
    <p>Pass with ${ASSESSMENT_PASS_PERCENT}% or higher to unlock this stage without completing all prior milestones.</p>
    ${questions
      .map(
        (q, qi) => `
      <div class="assessment-q" data-qi="${qi}">
        <p><strong>Q${qi + 1}.</strong> ${esc(q.question)}</p>
        ${q.options.map((opt, oi) => `<label><input type="radio" name="caq${qi}" value="${oi}"> ${esc(opt)}</label>`).join("<br>")}
      </div>`
      )
      .join("")}
    <button type="button" class="glass-btn" onclick="submitCareerAssessment()">Submit Assessment</button>
    <p id="careerAssessmentResult"></p>`;

  panel.classList.remove("hidden");
}

export function submitCareerAssessment() {
  if (!activeAssessment) return;
  const { pathId, level, questions } = activeAssessment;
  let correct = 0;
  questions.forEach((q, qi) => {
    const sel = document.querySelector(`input[name="caq${qi}"]:checked`);
    if (sel && Number(sel.value) === q.correct) correct++;
  });
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= ASSESSMENT_PASS_PERCENT;
  saveAssessmentResult(pathId, level, score, passed);

  const resultEl = document.getElementById("careerAssessmentResult");
  if (resultEl) {
    resultEl.innerHTML = passed
      ? `<strong>Passed ${score}%</strong> — ${level} stage unlocked for this path.`
      : `<strong>Score ${score}%</strong> — need ${ASSESSMENT_PASS_PERCENT}% to unlock. Review milestones and retry.`;
  }

  if (passed) {
    setTimeout(() => {
      hideAssessmentPanel();
      openCareerRoadmapPath(pathId);
    }, 1200);
  }
}

function hideAssessmentPanel() {
  document.getElementById("careerRoadmapAssessmentPanel")?.classList.add("hidden");
  activeAssessment = null;
}

export function cancelCareerAssessment() {
  hideAssessmentPanel();
}
