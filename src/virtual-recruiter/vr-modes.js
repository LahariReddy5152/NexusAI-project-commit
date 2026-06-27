/** Virtual Recruiter — mode registry */
export const VR_MODES = [
  {
    id: "general-assistant",
    label: "General Assistant",
    hint: "Platform help, navigation, and general guidance"
  },
  {
    id: "career-advisor",
    label: "Career Advisor",
    hint: "Career paths, technologies, and certification recommendations"
  },
  {
    id: "resume-reviewer",
    label: "Resume Reviewer",
    hint: "Resume feedback, ATS tips, and missing skills detection"
  },
  {
    id: "interview-coach",
    label: "Interview Coach",
    hint: "Mock questions, technical & behavioral prep, feedback and scoring"
  },
  {
    id: "learning-mentor",
    label: "Learning Mentor",
    hint: "Lesson recommendations, next technologies, learning progress"
  },
  {
    id: "project-mentor",
    label: "Project Mentor",
    hint: "Project recommendations, completion review, improvements"
  },
  {
    id: "coding-assistant",
    label: "Coding Assistant",
    hint: "Write, explain, fix code, and provide hints"
  },
  {
    id: "job-search",
    label: "Job Search Assistant",
    hint: "Job search guidance, application tracking, interview prep links"
  }
];

/** Section → default VR mode (auto-switch on navigation) */
export const SECTION_VR_MODE = {
  dashboardSection: "general-assistant",
  learnSection: "learning-mentor",
  realProjectsSection: "project-mentor",
  projectDetailSection: "project-mentor",
  jobModeSection: "career-advisor",
  interviewSection: "interview-coach",
  codingLabSection: "coding-assistant"
};

export const VR_MODE_MAP = Object.fromEntries(VR_MODES.map((m) => [m.id, m]));

/** Legacy mode id aliases */
export const LEGACY_MODE_ALIASES = {
  learning: "learning-mentor",
  career: "career-advisor",
  interview: "interview-coach",
  resume: "resume-reviewer",
  project: "project-mentor",
  coding: "coding-assistant",
  general: "general-assistant"
};

export function normalizeModeId(mode) {
  return LEGACY_MODE_ALIASES[mode] || mode || "learning-mentor";
}
