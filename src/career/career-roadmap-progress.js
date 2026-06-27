/** Per-path career roadmap progress — isolated localStorage keys */

export const ASSESSMENT_PASS_PERCENT = 80;

export const CAREER_PATH_IDS = [
  "ai-engineer",
  "java-full-stack",
  "backend-engineer",
  "frontend-engineer",
  "machine-learning-engineer",
  "generative-ai-engineer",
  "data-engineer",
  "devops-engineer",
  "cloud-engineer",
  "mlops-engineer"
];

export function getRoadmapProgressKey(pathId) {
  return `careerRoadmapProgress_${pathId}`;
}

export function getRoadmapMilestonesKey(pathId) {
  return `careerRoadmapMilestones_${pathId}`;
}

export function getRoadmapUnlockKey(pathId) {
  return `careerRoadmapUnlock_${pathId}`;
}

export function getRoadmapAssessmentKey(pathId) {
  return `careerRoadmapAssessment_${pathId}`;
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function loadMilestones(pathId) {
  return readJson(getRoadmapMilestonesKey(pathId), {});
}

export function saveMilestone(pathId, milestoneId, done) {
  const m = loadMilestones(pathId);
  m[milestoneId] = done;
  localStorage.setItem(getRoadmapMilestonesKey(pathId), JSON.stringify(m));
  syncProgress(pathId);
  return m;
}

export function loadUnlocks(pathId) {
  return readJson(getRoadmapUnlockKey(pathId), { intermediate: false, advanced: false });
}

export function saveUnlock(pathId, stage, value) {
  const u = loadUnlocks(pathId);
  u[stage] = value;
  localStorage.setItem(getRoadmapUnlockKey(pathId), JSON.stringify(u));
  return u;
}

export function loadAssessmentResults(pathId) {
  return readJson(getRoadmapAssessmentKey(pathId), {});
}

export function saveAssessmentResult(pathId, level, score, passed) {
  const r = loadAssessmentResults(pathId);
  r[level] = { score, passed, ts: Date.now() };
  localStorage.setItem(getRoadmapAssessmentKey(pathId), JSON.stringify(r));
  if (passed && level === "intermediate") saveUnlock(pathId, "intermediate", true);
  if (passed && level === "advanced") saveUnlock(pathId, "advanced", true);
  syncProgress(pathId);
  return r;
}

export function loadPathProgress(pathId) {
  return readJson(getRoadmapProgressKey(pathId), {
    completionPercent: 0,
    milestonesDone: 0,
    milestonesTotal: 0,
    currentStage: "beginner"
  });
}

export function syncProgress(pathId, milestonesTotal = null, allMilestoneIds = null) {
  const milestones = loadMilestones(pathId);
  const done = Object.values(milestones).filter(Boolean).length;
  const total = (milestonesTotal ?? loadPathProgress(pathId).milestonesTotal) || 1;
  const completionPercent = total ? Math.round((done / total) * 100) : 0;

  let currentStage = "beginner";
  const unlocks = loadUnlocks(pathId);
  const results = loadAssessmentResults(pathId);

  if (allMilestoneIds?.length) {
    const intermediateOpen =
      unlocks.intermediate ||
      results.intermediate?.passed ||
      isStageMilestonesComplete(pathId, "beginner", allMilestoneIds);
    const advancedOpen =
      unlocks.advanced ||
      results.advanced?.passed ||
      isStageMilestonesComplete(pathId, "intermediate", allMilestoneIds);

    if (advancedOpen && intermediateOpen) currentStage = "advanced";
    else if (intermediateOpen) currentStage = "intermediate";
  } else if (unlocks.advanced) currentStage = "advanced";
  else if (unlocks.intermediate) currentStage = "intermediate";

  const progress = {
    completionPercent,
    milestonesDone: done,
    milestonesTotal: total,
    currentStage
  };
  localStorage.setItem(getRoadmapProgressKey(pathId), JSON.stringify(progress));
  return progress;
}

const STAGE_PREFIX = { beginner: "b", intermediate: "i", advanced: "a" };

export function isStageMilestonesComplete(pathId, stage, allMilestoneIds) {
  if (!allMilestoneIds) return false;
  const prefix = STAGE_PREFIX[stage];
  const stageIds = allMilestoneIds.filter((id) => id.startsWith(`${prefix}-`));
  if (!stageIds.length) return false;
  const m = loadMilestones(pathId);
  return stageIds.every((id) => m[id]);
}

export function isStageUnlocked(pathId, stage, allMilestoneIds) {
  if (stage === "beginner") return true;
  const unlocks = loadUnlocks(pathId);
  const results = loadAssessmentResults(pathId);
  if (stage === "intermediate") {
    return (
      unlocks.intermediate ||
      results.intermediate?.passed ||
      isStageMilestonesComplete(pathId, "beginner", allMilestoneIds)
    );
  }
  if (stage === "advanced") {
    const intermediateOpen =
      unlocks.intermediate ||
      results.intermediate?.passed ||
      isStageMilestonesComplete(pathId, "beginner", allMilestoneIds);
    if (!intermediateOpen) return false;
    return (
      unlocks.advanced ||
      results.advanced?.passed ||
      isStageMilestonesComplete(pathId, "intermediate", allMilestoneIds)
    );
  }
  return false;
}

/** Exported helper used by UI — needs milestone ids from roadmap data */
export function checkStageUnlocked(pathId, stage, allMilestoneIds) {
  return isStageUnlocked(pathId, stage, allMilestoneIds);
}
