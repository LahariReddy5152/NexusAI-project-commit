/**
 * Learning progression — technologies are independent; levels chain within a technology only.
 * Unlock next level: complete previous level OR pass previous level assessment (≥80%).
 */
import { LEARNING_PATHS, getCurriculumForPath, getPathProgressPercent } from "./learn-data.js";

export const ASSESSMENT_PASS_PERCENT = 80;

/** @type {Record<string, { technologyId: string, level: string, levelTitle: string, previousPathId: string|null }>} */
export const PROGRESSION_META = {
  "python-fundamentals": { technologyId: "python", level: "beginner", levelTitle: "Beginner Python", previousPathId: null },
  "python-intermediate": { technologyId: "python", level: "intermediate", levelTitle: "Intermediate Python", previousPathId: "python-fundamentals" },
  "advanced-python": { technologyId: "python", level: "advanced", levelTitle: "Advanced Python", previousPathId: "python-intermediate" },

  "java-fundamentals": { technologyId: "java", level: "beginner", levelTitle: "Beginner Java", previousPathId: null },
  "advanced-java": { technologyId: "java", level: "advanced", levelTitle: "Advanced Java", previousPathId: "java-fundamentals" },

  sql: { technologyId: "sql", level: "beginner", levelTitle: "Beginner SQL", previousPathId: null },
  postgresql: { technologyId: "sql", level: "intermediate", levelTitle: "Intermediate SQL", previousPathId: "sql" },

  javascript: { technologyId: "javascript", level: "beginner", levelTitle: "Beginner JavaScript", previousPathId: null },
  "advanced-javascript": { technologyId: "javascript", level: "advanced", levelTitle: "Advanced JavaScript", previousPathId: "javascript" },

  node: { technologyId: "node", level: "beginner", levelTitle: "Beginner Node.js", previousPathId: null },
  express: { technologyId: "node", level: "advanced", levelTitle: "Advanced Node.js", previousPathId: "node" },

  docker: { technologyId: "docker", level: "beginner", levelTitle: "Beginner Docker", previousPathId: null },
  kubernetes: { technologyId: "docker", level: "advanced", levelTitle: "Advanced Docker", previousPathId: "docker" },

  aws: { technologyId: "aws", level: "beginner", levelTitle: "Beginner AWS", previousPathId: null },
  "azure-basics": { technologyId: "aws", level: "advanced", levelTitle: "Advanced Cloud", previousPathId: "aws" },

  "git-github": { technologyId: "git-github", level: "beginner", levelTitle: "Beginner Git", previousPathId: null },
  cicd: { technologyId: "git-github", level: "advanced", levelTitle: "Advanced CI/CD", previousPathId: "git-github" },

  "data-structures": { technologyId: "data-structures", level: "beginner", levelTitle: "Beginner DSA", previousPathId: null },
  algorithms: { technologyId: "data-structures", level: "advanced", levelTitle: "Advanced Algorithms", previousPathId: "data-structures" },

  "ai-fundamentals": { technologyId: "ai", level: "beginner", levelTitle: "Beginner AI", previousPathId: null },
  "machine-learning": { technologyId: "ai", level: "intermediate", levelTitle: "Intermediate AI", previousPathId: "ai-fundamentals" },
  "deep-learning": { technologyId: "ai", level: "advanced", levelTitle: "Advanced AI", previousPathId: "machine-learning" },

  "prompt-engineering": { technologyId: "prompt-engineering", level: "beginner", levelTitle: "Beginner Prompting", previousPathId: null },
  llms: { technologyId: "prompt-engineering", level: "advanced", levelTitle: "Advanced LLMs", previousPathId: "prompt-engineering" },

  embeddings: { technologyId: "embeddings", level: "beginner", levelTitle: "Beginner Embeddings", previousPathId: null },
  "vector-databases": { technologyId: "embeddings", level: "advanced", levelTitle: "Advanced Vector DBs", previousPathId: "embeddings" },

  "rag-systems": { technologyId: "rag", level: "beginner", levelTitle: "Beginner RAG", previousPathId: null },
  langchain: { technologyId: "rag", level: "intermediate", levelTitle: "Intermediate RAG", previousPathId: "rag-systems" },
  "ai-agents": { technologyId: "rag", level: "advanced", levelTitle: "Advanced Agents", previousPathId: "langchain" },
  mcp: { technologyId: "rag", level: "expert", levelTitle: "MCP", previousPathId: "ai-agents" },

  "spring-boot": { technologyId: "spring-boot", level: "beginner", levelTitle: "Beginner Spring Boot", previousPathId: null },
  "spring-security": { technologyId: "spring-boot", level: "advanced", levelTitle: "Advanced Spring Security", previousPathId: "spring-boot" },

  hibernate: { technologyId: "hibernate", level: "beginner", levelTitle: "Beginner Hibernate", previousPathId: null },
  jpa: { technologyId: "hibernate", level: "advanced", levelTitle: "Advanced JPA", previousPathId: "hibernate" },

  "openai-apis": { technologyId: "openai-apis", level: "beginner", levelTitle: "Beginner OpenAI APIs", previousPathId: null },
  "ai-deployment": { technologyId: "openai-apis", level: "advanced", levelTitle: "Advanced AI Deployment", previousPathId: "openai-apis" }
};

export function getProgressionMeta(pathId) {
  if (PROGRESSION_META[pathId]) return PROGRESSION_META[pathId];
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  return {
    technologyId: pathId,
    level: "beginner",
    levelTitle: path?.title || pathId,
    previousPathId: null
  };
}

export function getPreviousLevelPath(pathId) {
  const meta = getProgressionMeta(pathId);
  if (!meta.previousPathId) return null;
  return LEARNING_PATHS.find((p) => p.id === meta.previousPathId) || null;
}

export function getAssessmentScore(pathId) {
  return Number(localStorage.getItem(`nexusAssessment_${pathId}`) || 0);
}

export function setAssessmentScore(pathId, score) {
  localStorage.setItem(`nexusAssessment_${pathId}`, String(Math.min(100, Math.max(0, Math.round(score)))));
}

export function passedAssessment(pathId) {
  return getAssessmentScore(pathId) >= ASSESSMENT_PASS_PERCENT;
}

export function isPathLevelComplete(pathId) {
  return getPathProgressPercent(pathId) >= 100;
}

export function isPathUnlocked(path) {
  const meta = getProgressionMeta(path.id);
  if (!meta.previousPathId) return true;
  if (isPathLevelComplete(meta.previousPathId)) return true;
  if (passedAssessment(meta.previousPathId)) return true;
  return false;
}

export function getUnlockRequirements(pathId) {
  const meta = getProgressionMeta(pathId);
  const prev = getPreviousLevelPath(pathId);
  if (!prev) return null;
  const prevMeta = getProgressionMeta(prev.id);
  return {
    pathId,
    levelTitle: meta.levelTitle,
    previousPathId: prev.id,
    previousLevelTitle: prevMeta.levelTitle,
    previousCompletionPercent: getPathProgressPercent(prev.id),
    previousComplete: isPathLevelComplete(prev.id),
    assessmentScore: getAssessmentScore(prev.id),
    assessmentPassed: passedAssessment(prev.id),
    passPercent: ASSESSMENT_PASS_PERCENT
  };
}

export function getTechnologyLevels(technologyId) {
  return LEARNING_PATHS.filter((p) => getProgressionMeta(p.id).technologyId === technologyId).sort((a, b) => {
    const order = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
    return (order[getProgressionMeta(a.id).level] ?? 0) - (order[getProgressionMeta(b.id).level] ?? 0);
  });
}

export function hasCrossTechnologyPrerequisite(path) {
  return !!(path.prerequisite && getProgressionMeta(path.id).previousPathId !== path.prerequisite);
}

export function buildPlacementAssessment(pathId) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  const curriculum = getCurriculumForPath(pathId);
  const meta = getProgressionMeta(pathId);
  const theory = curriculum.slice(0, 4).flatMap((l) =>
    (l.quizQuestions || []).slice(0, 2).map((q) => ({ ...q, section: "theory", topic: l.title }))
  );
  const coding = curriculum.slice(0, 3).map((l) => ({
    type: "coding",
    topic: l.title,
    prompt: `Write a short ${l.title} code sample that demonstrates core concepts.`,
    lang: l.codeLang || "python"
  }));
  const practical = curriculum.slice(0, 2).map((l) => ({
    type: "practical",
    topic: l.title,
    prompt: l.exercise || `Complete a practical exercise for ${l.title}.`
  }));
  const challenge = {
    type: "challenge",
    title: `${meta.levelTitle} Challenge Project`,
    prompt: `Build a small ${path?.title || pathId} project combining ${curriculum.slice(0, 3).map((l) => l.title).join(", ")}.`
  };
  return {
    pathId,
    levelTitle: meta.levelTitle,
    theoryQuestions: theory.slice(0, 6),
    codingQuestions: coding,
    practicalExercises: practical,
    challengeProject: challenge
  };
}
