/**
 * Pass-through enrichment — no generic boilerplate. Lessons must ship complete content.
 */
export function enrichLesson(lesson) {
  return {
    objectives: [],
    bestPractices: [],
    commonMistakes: [],
    quizQuestions: [],
    interviewQuestions: [],
    resources: [],
    ...lesson
  };
}

export function tierForIndex(i, total) {
  const r = (i + 1) / total;
  if (r <= 0.34) return "Beginner";
  if (r <= 0.67) return "Intermediate";
  return "Advanced";
}
