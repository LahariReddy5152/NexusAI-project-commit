/** Project card metadata — icons, stacks, display labels */
export const PROJECT_CARD_META = {
  "AI Resume Analyzer": { icon: "📄", stack: "Python · FastAPI · React · PostgreSQL", displayName: "Resume Analyzer" },
  "Smart Expense Tracker": { icon: "💰", stack: "Python · Flask · SQLite · Chart.js", displayName: "Smart Money Tracker" },
  "Employee Management System": { icon: "👥", stack: "Java · Spring Boot · MySQL · React", displayName: "Employee Management System" },
  "AI Interview Coach": { icon: "🎤", stack: "Python · OpenAI · WebRTC · Redis", displayName: "AI Interview Coach" },
  "RAG Chatbot": { icon: "🤖", stack: "Python · LangChain · Pinecone · FastAPI", displayName: "RAG Chatbot" },
  "OpenAI Document Assistant": { icon: "📑", stack: "Node.js · Express · OpenAI · MongoDB", displayName: "OpenAI Document Assistant" },
  "Job Tracker": { icon: "📋", stack: "React · Node.js · PostgreSQL", displayName: "Job Tracker" },
  "AI Learning Platform": { icon: "🎓", stack: "React · Node.js · PostgreSQL · OpenAI", displayName: "AI Learning Platform" },
  "LLM Science Exam": { icon: "🏆", stack: "Python · HuggingFace · Kaggle", displayName: "LLM Science Exam" },
  "AI Math Olympiad": { icon: "🏆", stack: "Python · PyTorch · Kaggle", displayName: "AI Math Olympiad" },
  "Open LLM Leaderboard": { icon: "🏆", stack: "Python · vLLM · HuggingFace", displayName: "Open LLM Leaderboard" },
  "Agentic RAG": { icon: "🏆", stack: "Python · LangChain · Vector DB · Agents", displayName: "Agentic RAG Pipeline" }
};

export function getProjectStatus(progress) {
  if (progress >= 100) return { label: "Complete", class: "status-complete" };
  if (progress >= 80) return { label: "Portfolio Ready", class: "status-ready" };
  if (progress > 0) return { label: "In Progress", class: "status-progress" };
  return { label: "Not Started", class: "status-new" };
}

export function getProjectMeta(name) {
  return PROJECT_CARD_META[name] || { icon: "💻", stack: "Full Stack", displayName: name };
}
