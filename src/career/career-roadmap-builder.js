/** Build career roadmap path objects */
export function buildRoadmapPath(spec) {
  const stages = spec.stages;
  const milestoneIds = [];
  ["beginner", "intermediate", "advanced"].forEach((stage) => {
    const prefix = stage === "beginner" ? "b" : stage === "intermediate" ? "i" : "a";
    (stages[stage]?.milestones || []).forEach((_, idx) => {
      milestoneIds.push(`${prefix}-${spec.id}-${idx}`);
    });
  });

  return {
    id: spec.id,
    title: spec.title,
    timeline: spec.timeline,
    technologies: spec.technologies,
    recommendedOrder: spec.recommendedOrder,
    projects: spec.projects,
    certifications: spec.certifications,
    interviewTopics: spec.interviewTopics,
    stages: spec.stages,
    milestoneIds
  };
}

export const PLACEHOLDER_MARKERS = [
  "coming soon",
  "lorem ipsum",
  "placeholder",
  "TBD",
  "linux placeholder",
  "generic ai career"
];

export function hasRoadmapPlaceholder(text) {
  if (!text) return true;
  const t = String(text).toLowerCase();
  return PLACEHOLDER_MARKERS.some((m) => t.includes(m));
}
