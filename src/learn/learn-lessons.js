import { getCurriculumForPath } from "./learn-data.js";
import { currentPathId, currentLessonIndex, completedLessons } from "./learn-state.js";
import { renderCodeBlock } from "./learn-code.js";
import { saveCompletedLessons, getActiveCurriculum, updateLearningPathProgress } from "./learn-navigation.js";
import { logActivity, awardPoints } from "../dashboard/dashboard-activity.js";
import { syncDashboardFromProgress, recordLessonToday } from "../dashboard/dashboard-sync.js";

export function openLesson(index) {
  if (typeof window.openWorkspaceLesson === "function") {
    window.openWorkspaceLesson(index);
  }
  const curriculum = getActiveCurriculum();
  const module = curriculum[index];
  if (module) logActivity(`Started lesson: ${module.title}`);
}

export function renderLessonContent(module) {
  const lang = module.codeLang || "python";
  const pathId = currentPathId;
  const completed = completedLessons.includes(currentLessonIndex) ? 100 : 0;
  const objectives = (module.objectives || []).map((o) => `<li>${o}</li>`).join("");
  const quizHTML = (module.quizQuestions || []).map((q, i) => `
    <div class="quiz-container" id="quiz-${i}">
      <div class="quiz-question">${i + 1}. ${q.question}</div>
      <div class="quiz-options">${q.options.map((opt, j) =>
        `<div class="quiz-option" onclick="checkQuizAnswer(${i}, ${j}, ${q.correct})">${String.fromCharCode(65 + j)}. ${opt}</div>`
      ).join("")}</div>
    </div>`).join("");

  let container = document.getElementById("lessonContentInner");
  if (!container) {
    container = document.createElement("div");
    container.id = "lessonContentInner";
    document.querySelector(".lesson-sections")?.appendChild(container);
  }

  container.innerHTML = `
    <section class="lesson-section-block" id="section-overview">
      <h2 class="section-heading">Overview</h2>
      <p class="section-body">${module.overview || module.description}</p>
    </section>
    <section class="lesson-section-block" id="section-theory">
      <h2 class="section-heading">Theory</h2>
      <p class="section-body">${module.theory || module.explanation}</p>
    </section>
    <section class="lesson-section-block" id="section-explanation">
      <h2 class="section-heading">Explanation</h2>
      <p class="section-body">${module.explanation}</p>
    </section>
    <section class="lesson-section-block" id="section-architecture">
      <h2 class="section-heading">Architecture Diagram</h2>
      <pre class="diagram-block">${module.architectureDiagram || "See lesson theory for architecture context."}</pre>
    </section>
    <section class="lesson-section-block" id="section-flow">
      <h2 class="section-heading">Flow Diagram</h2>
      <pre class="diagram-block">${module.flowDiagram || "Follow the step-by-step explanation above."}</pre>
    </section>
    <section class="lesson-section-block" id="section-example">
      <h2 class="section-heading">Examples</h2>
      <p class="section-body">${module.realWorldExample || "Apply the concepts in a small real-world scenario."}</p>
    </section>
    <section class="lesson-section-block" id="section-syntax">
      <h2 class="section-heading">Code Examples</h2>
      ${renderCodeBlock(module.syntax || module.practicalExample, lang)}
    </section>
    <section class="lesson-section-block" id="section-practical">
      <h2 class="section-heading">Practical Code</h2>
      ${renderCodeBlock(module.practicalExample || module.syntax, lang)}
    </section>
    <section class="lesson-section-block" id="section-objectives">
      <h2 class="section-heading">Learning Objectives</h2>
      <ul class="section-body">${objectives || "<li>Master the core concepts of this topic</li>"}</ul>
    </section>
    <section class="lesson-section-block" id="section-exercise">
      <h2 class="section-heading">Exercises</h2>
      <div class="exercise-container"><p class="section-body">${module.exercise || "Practice the syntax and patterns from this lesson."}</p></div>
    </section>
    <section class="lesson-section-block" id="section-quiz">
      <h2 class="section-heading">Quiz</h2>
      ${quizHTML || "<p class='section-body muted-text'>Review the lesson and attempt the exercises.</p>"}
    </section>
    <section class="lesson-section-block" id="section-assignment">
      <h2 class="section-heading">Assignment</h2>
      <p class="section-body">${module.assignment || "Complete a short assignment applying today's topic."}</p>
    </section>
    <section class="lesson-section-block" id="section-miniproject">
      <h2 class="section-heading">Mini Project</h2>
      <p class="section-body">${module.miniProject || "Build a small project combining this lesson's skills."}</p>
    </section>
    <section class="lesson-section-block" id="section-interview">
      <h2 class="section-heading">Interview Questions</h2>
      <ul class="section-body">${(module.interviewQuestions || []).map((q) => `<li>${q}</li>`).join("") || "<li>Review key concepts and explain them aloud.</li>"}</ul>
    </section>
    <section class="lesson-section-block" id="section-summary">
      <h2 class="section-heading">Summary</h2>
      <p class="section-body">${module.summary || module.notes || module.description}</p>
    </section>
    <section class="lesson-section-block" id="section-resources">
      <h2 class="section-heading">Resources</h2>
      <ul class="section-body">${(module.resources || []).map((r) => `<li>${r}</li>`).join("") || "<li>Official documentation and lesson references.</li>"}</ul>
    </section>
    <section class="lesson-section-block" id="section-progress">
      <h2 class="section-heading">Progress Tracking</h2>
      <p class="section-body">Lesson: <strong>${module.title}</strong> · Course: <strong>${pathId}</strong></p>
      <div class="progress-bar glass-progress"><div class="progress-fill" style="width:${completed}%"></div></div>
      <p class="stat-meta">${completed ? "✓ Lesson marked complete" : "Mark complete when finished"}</p>
    </section>`;
}

export function checkQuizAnswer(quizIndex, selectedIndex, correctIndex) {
  const quizEl = document.getElementById(`quiz-${quizIndex}`);
  if (!quizEl) return;
  const options = quizEl.querySelectorAll(".quiz-option");
  options.forEach((opt, i) => {
    opt.classList.remove("correct", "incorrect");
    if (i === correctIndex) opt.classList.add("correct");
    else if (i === selectedIndex && selectedIndex !== correctIndex) opt.classList.add("incorrect");
    opt.style.pointerEvents = "none";
  });
}

export function updateMarkCompleteButton() {
  const btn = document.getElementById("markCompleteBtn");
  if (!btn) return;
  const isCompleted = currentLessonIndex !== null && completedLessons.includes(currentLessonIndex);
  if (isCompleted) {
    btn.textContent = "✓ Completed";
    btn.classList.add("completed");
    btn.disabled = true;
  } else {
    btn.textContent = "✓ Mark Complete";
    btn.classList.remove("completed");
    btn.disabled = false;
  }
}

export function markLessonComplete() {
  if (currentLessonIndex === null) return;
  if (!completedLessons.includes(currentLessonIndex)) {
    completedLessons.push(currentLessonIndex);
    saveCompletedLessons();
    recordLessonToday();
    const pointsEarned = 50;
    awardPoints(pointsEarned);
    updateMarkCompleteButton();
    updateLearningPathProgress();
    if (typeof window.renderWorkspaceSidebar === "function") window.renderWorkspaceSidebar(currentPathId);
    if (typeof window.renderWorkspaceChrome === "function") window.renderWorkspaceChrome(currentPathId);
    syncDashboardFromProgress();
    const mod = getActiveCurriculum()[currentLessonIndex];
    logActivity(`Completed: ${mod?.title || "lesson"} (+${pointsEarned} XP)`);
  }
}

export function backToLearningPath() {
  if (typeof window.renderWorkspaceChrome === "function") window.renderWorkspaceChrome(currentPathId);
}

export function previousLesson() {
  if (currentLessonIndex > 0) openLesson(currentLessonIndex - 1);
}

export function nextLesson() {
  const curriculum = getActiveCurriculum();
  if (currentLessonIndex !== null && currentLessonIndex < curriculum.length - 1) {
    openLesson(currentLessonIndex + 1);
  }
}
