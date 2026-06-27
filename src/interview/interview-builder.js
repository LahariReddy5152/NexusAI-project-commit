/** Build interview question objects with required Priority 5 fields */
export function buildQuestion(spec) {
  return {
    id: spec.id,
    section: spec.section,
    topic: spec.topic,
    topicLabel: spec.topicLabel || spec.topic,
    difficulty: spec.difficulty,
    question: spec.question,
    sampleAnswer: spec.sampleAnswer,
    evaluationCriteria: spec.evaluationCriteria || [],
    recommendations: spec.recommendations || []
  };
}

export const PLACEHOLDER_MARKERS = [
  "coming soon",
  "lorem ipsum",
  "placeholder",
  "TBD",
  "select a track"
];

export function hasInterviewPlaceholder(text) {
  if (!text) return true;
  const t = String(text).toLowerCase();
  return PLACEHOLDER_MARKERS.some((m) => t.includes(m));
}
