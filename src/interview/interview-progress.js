/** Per-section interview progress and score isolation */

export const INTERVIEW_SECTION_IDS = ["mock", "technical", "system-design", "ai-track"];

export function getInterviewProgressKey(sectionId) {
  return `interviewProgress_${sectionId}`;
}

export function getInterviewScoresKey(sectionId) {
  return `interviewScores_${sectionId}`;
}

export function getInterviewMetaKey(sectionId) {
  return `interviewMeta_${sectionId}`;
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function loadSectionScores(sectionId) {
  return readJson(getInterviewScoresKey(sectionId), []);
}

export function saveSectionScore(sectionId, entry) {
  const scores = loadSectionScores(sectionId);
  scores.push({ ...entry, ts: Date.now() });
  localStorage.setItem(getInterviewScoresKey(sectionId), JSON.stringify(scores.slice(-100)));
  updateSectionProgress(sectionId);
  return scores;
}

export function loadSectionProgress(sectionId) {
  return readJson(getInterviewProgressKey(sectionId), {
    attempted: 0,
    total: 0,
    avgScore: 0,
    lastScore: 0
  });
}

export function updateSectionProgress(sectionId, totalQuestions = null) {
  const scores = loadSectionScores(sectionId);
  const attempted = scores.length;
  const avgScore = attempted
    ? Math.round(scores.reduce((s, e) => s + (e.score || 0), 0) / attempted)
    : 0;
  const lastScore = attempted ? scores[scores.length - 1].score : 0;
  const progress = {
    attempted,
    total: totalQuestions ?? loadSectionProgress(sectionId).total,
    avgScore,
    lastScore
  };
  localStorage.setItem(getInterviewProgressKey(sectionId), JSON.stringify(progress));
  return progress;
}

export function setSectionQuestionTotal(sectionId, total) {
  const progress = loadSectionProgress(sectionId);
  progress.total = total;
  localStorage.setItem(getInterviewProgressKey(sectionId), JSON.stringify(progress));
}

export function loadInterviewMeta(sectionId) {
  return readJson(getInterviewMetaKey(sectionId), {
    currentTopic: "",
    currentDifficulty: "all",
    activeQuestionId: "",
    mockInputMode: "text"
  });
}

export function saveInterviewMeta(sectionId, patch) {
  const meta = { ...loadInterviewMeta(sectionId), ...patch };
  localStorage.setItem(getInterviewMetaKey(sectionId), JSON.stringify(meta));
  return meta;
}
