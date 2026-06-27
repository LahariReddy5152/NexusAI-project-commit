/** Mode-specific response banks for Virtual Recruiter */
import { normalizeModeId } from "./vr-modes.js";

const careerAdvisor = {
  path: [
    "Career Advisor: Open Career Roadmap for independent paths — AI Engineer, Java Full Stack, Backend, Frontend, ML, GenAI, Data, DevOps, Cloud, or MLOps. Each path has beginner → advanced stages.",
    "Based on your interests: backend-focused → Java Full Stack or Backend Engineer; AI apps → AI Engineer or Generative AI Engineer; data pipelines → Data Engineer."
  ],
  certification: [
    "Certifications to consider: AWS Solutions Architect (cloud/backend), CKA (DevOps), AWS ML Specialty (ML/MLOps), Oracle Java (full stack). Match cert to target role.",
    "Portfolio + one relevant cert often beats many unrelated certs. Complete NexusAI path certificates as you finish learning tracks."
  ],
  technology: [
    "Technology stack by goal: AI Engineer → Python, SQL, RAG, LangChain, Docker. Full Stack → Java, Spring Boot, React, SQL. DevOps → Linux CLI, Docker, K8s, Terraform, CI/CD."
  ]
};

const resumeReviewer = {
  ats: [
    "Resume Reviewer: Use standard headings (Experience, Skills, Education). Avoid tables/images in ATS systems. Mirror keywords from the job description naturally.",
    "ATS tip: List skills as a dedicated section and repeat critical keywords in bullet achievements — not stuffed in white text."
  ],
  skill: [
    "Missing skills detection: compare your resume to the role JD. Common gaps for AI roles: Python, SQL, Docker, REST APIs, one cloud provider, and one portfolio AI project.",
    "If you lack a skill, add a learning-in-progress line only if you can demonstrate progress (course, project) within weeks."
  ],
  feedback: [
    "Resume feedback: lead bullets with strong verbs and metrics ('Reduced API latency 40%', 'Served 2M requests/day'). One page for <10 years experience.",
    "Add GitHub links for 2–3 projects with one-line architecture notes in the resume."
  ]
};

const interviewCoach = {
  mock: [
    "Interview Coach: Run timed mock sessions in Interview Prep → Mock Interviews. Answer with STAR for behavioral and Problem→Approach→Tradeoffs→Result for technical.",
    "Mock question: 'Tell me about a production incident you resolved.' Score yourself on clarity, metrics, and ownership."
  ],
  technical: [
    "Technical question (Java): Explain HashMap internals and when to use ConcurrentHashMap.",
    "Technical question (AI): How does RAG reduce hallucinations compared to pure prompting?"
  ],
  behavioral: [
    "Behavioral question: Describe a conflict with a teammate and how you resolved it using STAR.",
    "Behavioral question: Tell me about a time you missed a deadline — what did you learn?"
  ],
  score: [
    "Scoring rubric: Structure (25%), depth (25%), metrics (25%), tradeoffs (25%). Aim for 80+ words with at least one number.",
    "After answering, save your score in Interview Prep to track improvement per section."
  ]
};

const learningMentor = {
  lesson: [
    "Learning Mentor: Your next lesson is in the Learn portal — continue your current path or open a new technology independently (no cross-path lock).",
    "Recommend completing fundamentals before advanced topics within the same technology."
  ],
  progress: [
    "Track progress on the Learn dashboard and per-course Progress tab. Placement assessments (80%+) can skip to intermediate/advanced within a technology.",
    "Aim for one lesson + one quiz per study session for retention."
  ],
  next: [
    "Next technologies: after Python fundamentals → SQL or FastAPI; after Java → Spring Boot; after AI fundamentals → RAG systems or OpenAI APIs."
  ]
};

const projectMentor = {
  recommend: [
    "Project Mentor: Core portfolio projects — AI Resume Analyzer, RAG Chatbot, Employee Management System, Job Tracker. Pick one aligned to your Career Roadmap path.",
    "Live projects tab includes LLM Science Exam and Agentic RAG for advanced AI depth."
  ],
  complete: [
    "Review completion: each project tracks checkpoints independently. Reach 80%+ completion before listing on resume.",
    "Add README with architecture diagram, API list, and setup steps for recruiters."
  ],
  improve: [
    "Improvements: add tests, deployment URL, monitoring, and a 2-minute demo video. Quantify impact in README."
  ]
};

const jobSearch = {
  search: [
    "Job Search Assistant: Target 15–20 quality applications per week. Tailor resume keywords per role. Use Career for resume analysis and tailoring.",
    "Focus companies where your stack matches — backend roles need API + SQL stories; AI roles need RAG/LLM project demos."
  ],
  application: [
    "Application tracking: log company, role, date, stage, and follow-up reminders.",
    "Follow up 5–7 business days after applying if no response — short, polite email referencing role ID."
  ],
  interview: [
    "Interview prep: use Interview Prep — Mock Interview for practice, Technical for stack depth, System Design for senior roles.",
    "Before onsite: prepare 3 STAR stories, 2 technical deep-dives, and 5 questions for the interviewer."
  ]
};

const generalAssistant = {
  help: [
    "General Assistant: Use the sidebar to navigate — Dashboard for progress, Learn for courses, Projects for portfolio builds, Career for resume tools, Interview Prep for mock practice, Code Lab for coding workspace.",
    "Ask me how to navigate NexusAI or what to do next on your current page."
  ],
  platform: [
    "NexusAI helps you learn technologies, build projects, prepare for interviews, and manage your career — all with isolated progress per course and project.",
    "Your Virtual Recruiter mode switches automatically based on which page you're viewing."
  ]
};

const codingAssistant = {
  hint: [
    "Coding Assistant: Ask for hints before full solutions. Example: 'Give me a hint for reversing a linked list in Python.'",
    "Break problems into input → process → output. What data structure fits best?"
  ],
  write: [
    "To write code: describe the language, inputs, and expected output. I'll provide idiomatic starter code.",
    "Example: 'Write a FastAPI endpoint that returns health status' — I'll outline routes, models, and error handling."
  ],
  fix: [
    "Paste your code and error message. I'll suggest likely causes — off-by-one, null checks, async issues, or type mismatches.",
    "For debugging: reproduce minimally, add logging, then fix the smallest broken assumption."
  ],
  explain: [
    "Ask 'Explain this code' with a snippet. I'll walk line-by-line through logic and complexity.",
    "Good explanations cover purpose, algorithm, time/space complexity, and edge cases."
  ]
};

export const MENTOR_RESPONSE_SETS = {
  "general-assistant": generalAssistant,
  "career-advisor": careerAdvisor,
  "resume-reviewer": resumeReviewer,
  "interview-coach": interviewCoach,
  "learning-mentor": learningMentor,
  "project-mentor": projectMentor,
  "coding-assistant": codingAssistant,
  "job-search": jobSearch
};

export const MENTOR_DEFAULTS = {
  "general-assistant": "General Assistant: Ask about navigation, platform features, or what to do next.",
  "career-advisor": "Career Advisor: Ask about career paths, technologies to learn, or certifications.",
  "resume-reviewer": "Resume Reviewer: Ask for ATS tips, resume feedback, or missing skills.",
  "interview-coach": "Interview Coach: Request mock, technical, or behavioral questions.",
  "learning-mentor": "Learning Mentor: Ask what to learn next or how to track progress.",
  "project-mentor": "Project Mentor: Ask which project to build or how to improve your portfolio.",
  "coding-assistant": "Coding Assistant: Ask to write, explain, fix code, or give a hint.",
  "job-search": "Job Search Assistant: Ask about job search strategy or interview preparation."
};

export function pickResponse(modeId, message) {
  const mode = normalizeModeId(modeId);
  const text = message.toLowerCase();
  const set = MENTOR_RESPONSE_SETS[mode] || {};

  const keywordMap = {
    "general-assistant": { help: ["help", "how", "navigate", "where"], platform: ["nexus", "platform", "feature"] },
    "coding-assistant": { hint: ["hint", "tip", "stuck"], write: ["write", "code", "implement", "create"], fix: ["fix", "bug", "error", "debug"], explain: ["explain", "what does", "how does"] },
    "career-advisor": { path: ["path", "roadmap", "role", "career"], certification: ["cert", "certificate"], technology: ["tech", "stack", "learn", "skill"] },
    "resume-reviewer": { ats: ["ats", "keyword", "scan"], skill: ["missing", "gap", "skill"], feedback: ["feedback", "improve", "review", "resume"] },
    "interview-coach": { mock: ["mock", "practice", "timed"], technical: ["technical", "java", "sql", "spring", "python", "coding"], behavioral: ["behavioral", "star", "conflict", "leadership"], score: ["score", "rubric", "rate"] },
    "learning-mentor": { lesson: ["lesson", "course", "module"], progress: ["progress", "percent", "complete"], next: ["next", "what should", "recommend"] },
    "project-mentor": { recommend: ["recommend", "which project", "build", "portfolio"], complete: ["complete", "completion", "done", "percent"], improve: ["improve", "better", "suggestion"] },
    "job-search": { search: ["search", "apply", "find job"], application: ["application", "tracker", "follow"], interview: ["interview prep", "onsite", "prepare"] }
  };

  const aliases = keywordMap[mode] || {};
  for (const [topic, words] of Object.entries(aliases)) {
    if (words.some((w) => text.includes(w)) && set[topic]) {
      const arr = set[topic];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }

  for (const topic in set) {
    if (text.includes(topic)) {
      const arr = set[topic];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }

  const keys = Object.keys(set);
  if (keys.length) {
    const arr = set[keys[0]];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return MENTOR_DEFAULTS[mode] || MENTOR_DEFAULTS["general-assistant"];
}
