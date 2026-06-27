/**
 * Build a complete lesson object with all Priority 3 required sections.
 */
export function buildLesson(spec) {
  const title = spec.title;
  return {
    title,
    description: spec.description,
    difficulty: spec.difficulty || "Beginner",
    duration: spec.duration || "20 min",
    overview: spec.overview,
    theory: spec.theory,
    explanation: spec.explanation,
    realWorldExample: spec.realWorldExample,
    architectureDiagram: spec.architectureDiagram,
    flowDiagram: spec.flowDiagram,
    objectives: spec.objectives || [],
    syntax: spec.syntax,
    practicalExample: spec.practicalExample,
    bestPractices: spec.bestPractices || [],
    commonMistakes: spec.commonMistakes || [],
    exercise: spec.exercise,
    assignment: spec.assignment,
    miniProject: spec.miniProject,
    quizQuestions: spec.quizQuestions || [],
    interviewQuestions: spec.interviewQuestions || [],
    summary: spec.summary,
    resources: spec.resources || [],
    notes: spec.notes,
    codeLang: spec.codeLang || "python"
  };
}

export function mergeLesson(base, extra) {
  if (!extra) return base;
  const merged = { ...base };
  for (const [k, v] of Object.entries(extra)) {
    if (v !== undefined && v !== null && v !== "") merged[k] = v;
  }
  return merged;
}

export const BOILERPLATE_MARKERS = [
  "grounded in computer science principles",
  "is a core skill for AI engineers",
  "is a core topic in",
  "Learn → Practice → Apply in Mini Project",
  "Concept flow diagram for this topic",
  "Build a mini project applying",
  "Explain ${topic} clearly in a technical interview"
];

export function hasBoilerplate(text) {
  if (!text) return false;
  const t = String(text).toLowerCase();
  return BOILERPLATE_MARKERS.some((m) => t.includes(m.replace("${topic}", "").toLowerCase()));
}
