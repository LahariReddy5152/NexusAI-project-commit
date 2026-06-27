import { pythonCurriculum } from "../python/python-index.js";
import { enrichLesson, tierForIndex } from "./content/enrich-lesson.js";
import { applyPythonDepth, MODULES_LESSON } from "./content/python-depth.js";

function buildPythonFundamentalsCurriculum() {
  const lessons = pythonCurriculum.map((l) => enrichLesson(applyPythonDepth(l)));
  if (!lessons.some((l) => l.title === "Modules")) {
    const afterFile = lessons.findIndex((l) => l.title === "File Handling");
    const insertAt = afterFile >= 0 ? afterFile + 1 : lessons.length;
    lessons.splice(insertAt, 0, enrichLesson(applyPythonDepth(MODULES_LESSON)));
  }
  return lessons;
}
import { SQL_CURRICULUM } from "./content/curricula/sql-curriculum.js";
import { JAVA_CURRICULUM } from "./content/curricula/java-curriculum.js";
import { SPRING_BOOT_CURRICULUM } from "./content/curricula/spring-boot-curriculum.js";
import { AI_FUNDAMENTALS_CURRICULUM } from "./content/curricula/ai-fundamentals-curriculum.js";
import { PROMPT_ENGINEERING_CURRICULUM } from "./content/curricula/prompt-engineering-curriculum.js";
import { OPENAI_APIS_CURRICULUM } from "./content/curricula/openai-apis-curriculum.js";
import { RAG_SYSTEMS_CURRICULUM } from "./content/curricula/rag-systems-curriculum.js";
import { LANGCHAIN_CURRICULUM } from "./content/curricula/langchain-curriculum.js";
import { getPortalTopicTitles } from "./learn-portal-config.js";

export function createStandardLesson({ title, description, difficulty, duration, explanation, realWorldExample, syntax, practicalExample, bestPractices, commonMistakes, exercise, lang }) {
  const topic = title;
  return {
    title,
    description: description || `Learn ${topic} with practical examples.`,
    difficulty: difficulty || "Beginner",
    duration: duration || "20 min",
    explanation: explanation || "",
    realWorldExample: realWorldExample || "",
    syntax: syntax || "",
    practicalExample: practicalExample || "",
    bestPractices: bestPractices || [],
    commonMistakes: commonMistakes || [],
    quizQuestions: [],
    exercise: exercise || "",
    codeLang: lang || "python",
    miniProject: "",
    interviewQuestions: [],
    resources: []
  };
}

export function buildTopicCurriculum(topics, lang, pathTitle = "") {
  return topics.map((title, i) =>
    enrichLesson(createStandardLesson({ title, difficulty: tierForIndex(i, topics.length), lang }))
  );
}

const AI_FUNDAMENTALS_TOPICS = [
  "AI Fundamentals", "Machine Learning", "Deep Learning", "Prompt Engineering", "LLMs",
  "OpenAI APIs", "RAG", "LangChain", "Embeddings", "Vector Databases",
  "AI Agents", "Model Context Protocol", "AI Deployment", "AI Ethics", "AI Use Cases", "AI Project Lifecycle"
];

const PROMPT_ENGINEERING_TOPICS = [
  "Introduction", "Prompt Basics", "Zero-shot Prompting", "One-shot Prompting", "Few-shot Prompting",
  "Chain of Thought", "Role Prompting", "System Prompts", "Context Engineering", "Prompt Templates",
  "Prompt Debugging", "Structured Output", "JSON Prompting", "Prompt Chaining", "Multi-step Prompting",
  "RAG Prompting", "AI Agent Prompting", "Real-world Prompt Examples", "Best Practices", "Common Mistakes",
  "Exercises", "Quizzes"
];

const PATH_TOPIC_MAP = {
  html: ["HTML Basics", "Elements & Tags", "Forms", "Semantic HTML", "Accessibility", "SEO Basics", "Media Elements", "Tables"],
  css: ["Selectors", "Box Model", "Flexbox", "CSS Grid", "Animations", "Responsive Design", "Variables", "Preprocessors"],
  node: ["Node Basics", "NPM", "Modules", "File System", "Events", "Streams", "HTTP Server", "Environment"],
  express: ["Express Setup", "Routing", "Middleware", "REST APIs", "Error Handling", "Authentication", "Validation", "Deployment"],
  redis: ["Redis Basics", "Data Types", "Caching Patterns", "Pub/Sub", "Persistence", "TTL", "Pipelines", "Production"],
  "data-structures": ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs", "Hash Tables", "Heaps"],
  algorithms: ["Big O", "Sorting", "Searching", "Recursion", "Dynamic Programming", "Greedy", "Graph Algorithms", "Two Pointers"],
  "advanced-python": ["Decorators", "Generators", "Context Managers", "Async IO", "Type Hints", "Testing", "Packaging", "FastAPI", "Performance", "Async Python"],
  "python-intermediate": ["OOP", "Collections", "Exception Handling", "File Handling", "Modules", "Lists", "Dictionaries", "Sets"],
  "java-fundamentals": ["Core Java", "OOP", "Collections", "Streams", "Multithreading", "JDBC", "JVM", "Exception Handling", "File Handling"],
  "advanced-java": ["Streams API", "Lambdas", "Concurrency", "JVM Tuning", "Design Patterns", "Reactive Java", "Performance"],
  javascript: ["Variables", "Functions", "DOM", "ES6+", "Async/Await", "Modules", "Events", "Fetch API", "Error Handling", "NPM Basics"],
  "advanced-javascript": ["Closures", "Prototypes", "Event Loop", "Functional JS", "Performance", "Testing", "Webpack", "Security"],
  react: ["Components", "JSX", "Props & State", "Hooks", "Context", "Routing", "Forms", "Performance", "Testing React", "State Management"],
  typescript: ["Types", "Interfaces", "Generics", "Utility Types", "TS + React", "Strict Mode", "Declaration Files", "Advanced Types"],
  "spring-boot": ["Boot Basics", "REST Controllers", "Dependency Injection", "JPA Integration", "Security", "Testing", "Microservices Intro", "Actuator"],
  "spring-security": ["Authentication", "Authorization", "JWT", "OAuth2", "CSRF", "Security Config", "Method Security", "OAuth2 Resource Server"],
  hibernate: ["ORM Basics", "Entities", "Relationships", "HQL", "Caching", "Transactions", "Lazy Loading", "Performance Tuning"],
  jpa: ["Entity Mapping", "Repositories", "Queries", "Relationships", "Pagination", "Auditing", "Specifications", "Projections"],
  "rest-apis": ["HTTP Methods", "Status Codes", "REST Design", "Authentication", "JWT", "Versioning", "Error Handling", "Documentation", "Express", "Node.js"],
  microservices: ["Service Design", "API Gateway", "Service Discovery", "Resilience", "Observability", "Deployment", "Event-Driven", "Saga Pattern"],
  sql: ["SQL Fundamentals", "Joins", "Subqueries", "Indexes", "Views", "Stored Procedures", "Triggers", "Optimization", "PostgreSQL"],
  postgresql: ["Setup", "Data Types", "Advanced Queries", "JSONB", "Performance", "Backups", "Replication", "Extensions"],
  mongodb: ["Documents", "CRUD", "Aggregation", "Indexing", "Schema Design", "Atlas", "Transactions", "Change Streams"],
  docker: ["Images", "Containers", "Dockerfile", "Compose", "Volumes", "Networking", "Multi-stage Builds", "Security"],
  kubernetes: ["Pods", "Deployments", "Services", "ConfigMaps", "Ingress", "Helm Basics", "HPA", "Secrets"],
  aws: ["IAM", "EC2", "S3", "Lambda", "RDS", "CloudWatch", "VPC", "ECS"],
  "azure-basics": ["Azure Portal", "VMs", "Blob Storage", "Functions", "Azure SQL", "Monitor", "AKS Intro", "App Service"],
  "git-github": ["Git Basics", "Branching", "Pull Requests", "Merge Conflicts", "GitHub Actions", "Code Review", "Rebase", "Git Flow"],
  linux: ["Shell Basics", "File Permissions", "Processes", "Networking", "Cron", "Logs", "systemd", "SSH"],
  cicd: ["CI Concepts", "CD Pipelines", "GitHub Actions", "Jenkins", "Testing Gates", "Deployments", "Docker in CI", "Blue-Green Deploy"],
  "system-design": ["Requirements", "Scalability", "Databases", "Caching", "Load Balancing", "Tradeoffs", "CAP Theorem", "API Design"],
  "apache-kafka": ["Topics", "Producers", "Consumers", "Partitions", "Streams", "Operations", "Schema Registry", "Exactly-Once"],
  "machine-learning": ["Supervised Learning", "Unsupervised Learning", "Feature Engineering", "Model Evaluation", "Cross Validation", "Scikit-learn", "Pipelines", "Hyperparameter Tuning"],
  "deep-learning": ["Neural Networks", "Backpropagation", "CNNs", "RNNs", "Transformers", "Transfer Learning", "PyTorch Basics", "Training Tips"],
  llms: ["Transformer Architecture", "Tokenization", "Context Windows", "Fine-tuning vs RAG", "Inference Optimization", "Model Selection", "Prompt Caching", "Evals"],
  "openai-apis": ["Chat Completions", "Embeddings API", "Function Calling", "Streaming", "Rate Limits", "Cost Control", "Assistants API", "Batch API"],
  "rag-systems": ["Document Chunking", "Embeddings", "Retrieval", "Re-ranking", "Grounded Generation", "Evaluation", "Hybrid Search", "Citation"],
  langchain: ["Chains", "Agents", "Tools", "Memory", "Document Loaders", "Output Parsers", "LCEL", "Callbacks"],
  embeddings: ["Word Embeddings", "Sentence Embeddings", "Similarity Search", "OpenAI Embeddings", "Batch Processing", "Dimensionality", "Cosine Similarity", "Clustering"],
  "vector-databases": ["Pinecone", "Weaviate", "pgvector", "Indexing", "Hybrid Search", "Metadata Filtering", "Chroma", "Qdrant"],
  "ai-agents": ["ReAct Pattern", "Tool Use", "Multi-agent", "Planning", "Memory", "Guardrails", "Human-in-the-Loop", "Agent Evals"],
  mcp: ["MCP Protocol", "Context Servers", "Tool Registration", "Security", "Client Integration", "Best Practices", "Resources", "Transports"],
  "ai-deployment": ["Model Serving", "API Gateway", "Monitoring", "A/B Testing", "Latency Optimization", "Cost Management", "vLLM", "Container Deploy"]
};

export const LEARNING_PATHS = [
  { id: "python-fundamentals", title: "Python", category: "core", subtitle: "Beginner Python — variables through modules" },
  { id: "python-intermediate", title: "Intermediate Python", category: "core", subtitle: "OOP, collections, files, and exceptions" },
  { id: "advanced-python", title: "Advanced Python", category: "core", subtitle: "Decorators, async, testing, and FastAPI" },
  { id: "sql", title: "SQL", category: "data", subtitle: "SELECT through stored procedures" },
  { id: "java-fundamentals", title: "Java", category: "core", subtitle: "Core Java for backend engineering" },
  { id: "html", title: "HTML", category: "frontend", subtitle: "Semantic markup and forms" },
  { id: "css", title: "CSS", category: "frontend", subtitle: "Layout, flexbox, grid, and animations" },
  { id: "javascript", title: "JavaScript", category: "frontend", subtitle: "Modern JavaScript fundamentals" },
  { id: "typescript", title: "TypeScript", category: "frontend", subtitle: "Type-safe JavaScript development" },
  { id: "react", title: "React", category: "frontend", subtitle: "Build dynamic UIs with React" },
  { id: "spring-boot", title: "Spring Boot", category: "backend", subtitle: "Production REST APIs with Spring" },
  { id: "hibernate", title: "Hibernate", category: "backend", subtitle: "ORM and persistence layer" },
  { id: "jpa", title: "JPA", category: "backend", subtitle: "Java Persistence API mastery" },
  { id: "rest-apis", title: "REST APIs", category: "backend", subtitle: "Design and build RESTful services" },
  { id: "node", title: "Node.js", category: "backend", subtitle: "Server-side JavaScript runtime" },
  { id: "express", title: "Express", category: "backend", subtitle: "Web framework for Node.js APIs" },
  { id: "microservices", title: "Microservices", category: "backend", subtitle: "Distributed system architecture" },
  { id: "postgresql", title: "PostgreSQL", category: "data", subtitle: "Advanced PostgreSQL for production" },
  { id: "mongodb", title: "MongoDB", category: "data", subtitle: "Document databases and NoSQL" },
  { id: "redis", title: "Redis", category: "data", subtitle: "Caching and in-memory data store" },
  { id: "docker", title: "Docker", category: "devops", subtitle: "Containerize applications" },
  { id: "kubernetes", title: "Kubernetes", category: "devops", subtitle: "Orchestrate containers at scale" },
  { id: "aws", title: "AWS", category: "devops", subtitle: "Cloud infrastructure on Amazon Web Services" },
  { id: "azure-basics", title: "Azure", category: "devops", subtitle: "Microsoft Azure cloud fundamentals" },
  { id: "git-github", title: "Git & GitHub", category: "devops", subtitle: "Version control and collaboration" },
  { id: "linux", title: "Linux", category: "devops", subtitle: "Command line and server administration" },
  { id: "cicd", title: "CI/CD", category: "devops", subtitle: "Automated build and deployment pipelines" },
  { id: "system-design", title: "System Design", category: "backend", subtitle: "Scalable architecture interviews" },
  { id: "data-structures", title: "Data Structures", category: "core", subtitle: "Arrays, trees, graphs, and hash tables" },
  { id: "algorithms", title: "Algorithms", category: "core", subtitle: "Sorting, DP, and graph algorithms" },
  { id: "apache-kafka", title: "Kafka", category: "backend", subtitle: "Event streaming and messaging" },
  { id: "ai-fundamentals", title: "AI", category: "ai", subtitle: "ML, LLMs, RAG, and AI engineering core" },
  { id: "machine-learning", title: "Machine Learning", category: "ai", subtitle: "Supervised, unsupervised, and model evaluation" },
  { id: "deep-learning", title: "Deep Learning", category: "ai", subtitle: "Neural networks, CNNs, and transformers" },
  { id: "prompt-engineering", title: "Prompt Engineering", category: "ai", subtitle: "Master prompting for production LLM apps" },
  { id: "llms", title: "LLMs", category: "ai", subtitle: "Large language models architecture and use" },
  { id: "openai-apis", title: "OpenAI APIs", category: "ai", subtitle: "GPT, embeddings, and API integration" },
  { id: "rag-systems", title: "RAG", category: "ai", subtitle: "Retrieval-augmented generation pipelines" },
  { id: "langchain", title: "LangChain", category: "ai", subtitle: "Chains, agents, and tool use" },
  { id: "embeddings", title: "Embeddings", category: "ai", subtitle: "Vector representations and semantic search" },
  { id: "vector-databases", title: "Vector Databases", category: "ai", subtitle: "Pinecone, Weaviate, and pgvector" },
  { id: "ai-agents", title: "AI Agents", category: "ai", subtitle: "Autonomous agents and tool orchestration" },
  { id: "mcp", title: "MCP", category: "ai", subtitle: "Model Context Protocol" },
  { id: "ai-deployment", title: "AI Deployment", category: "ai", subtitle: "Deploy LLM apps to production" },
  { id: "advanced-java", title: "Advanced Java", category: "core", subtitle: "Streams, concurrency, and JVM depth" },
  { id: "advanced-javascript", title: "Advanced JavaScript", category: "frontend", subtitle: "Closures, event loop, and patterns" },
  { id: "spring-security", title: "Spring Security", category: "backend", subtitle: "Secure authentication and authorization" }
];

let aiFundamentalsCurriculum = AI_FUNDAMENTALS_CURRICULUM.map(enrichLesson);
let promptEngineeringCurriculum = PROMPT_ENGINEERING_CURRICULUM.map(enrichLesson);

const PRIORITY_CURRICULA = {
  sql: SQL_CURRICULUM,
  "java-fundamentals": JAVA_CURRICULUM,
  "spring-boot": SPRING_BOOT_CURRICULUM,
  "ai-fundamentals": AI_FUNDAMENTALS_CURRICULUM,
  "prompt-engineering": PROMPT_ENGINEERING_CURRICULUM,
  "openai-apis": OPENAI_APIS_CURRICULUM,
  "rag-systems": RAG_SYSTEMS_CURRICULUM,
  langchain: LANGCHAIN_CURRICULUM
};

const generatedCurriculumCache = {};

export function getCurriculumForPath(pathId) {
  const pathMeta = LEARNING_PATHS.find((p) => p.id === pathId);
  const pathTitle = pathMeta?.title || pathId;

  if (pathId === "python-fundamentals") {
    return buildPythonFundamentalsCurriculum();
  }
  if (pathId === "python-intermediate") {
    const intermediate = pythonCurriculum.filter((l) => l.difficulty === "Intermediate" || ["OOP", "File Handling", "Exception Handling", "Lists", "Tuples", "Dictionaries", "Sets"].includes(l.title));
    if (intermediate.length) return intermediate.map((l) => enrichLesson(applyPythonDepth(l)));
    return buildTopicCurriculum(PATH_TOPIC_MAP["python-intermediate"], "python", "Intermediate Python").map(enrichLesson);
  }
  if (PRIORITY_CURRICULA[pathId]) {
    return PRIORITY_CURRICULA[pathId].map(enrichLesson);
  }

  if (!generatedCurriculumCache[pathId]) {
    const portalTopics = getPortalTopicTitles(pathId);
    const topics = portalTopics.length ? portalTopics : PATH_TOPIC_MAP[pathId];
    if (topics?.length) {
      const lang = pathId.includes("java") ? "java"
        : pathId.includes("javascript") || pathId.includes("react") || pathId.includes("typescript") || pathId.includes("node") || pathId.includes("express") ? "javascript"
        : pathId.includes("sql") || pathId.includes("postgresql") ? "sql"
        : pathId.includes("html") ? "html"
        : pathId.includes("css") ? "css"
        : "python";
      generatedCurriculumCache[pathId] = buildTopicCurriculum(topics, lang, pathTitle).map(enrichLesson);
    }
  }
  return generatedCurriculumCache[pathId] || [];
}

export function getPathProgressPercent(pathId) {
  const completed = JSON.parse(localStorage.getItem(`nexusCompleted_${pathId}`) || "[]");
  const curriculum = getCurriculumForPath(pathId);
  if (!curriculum.length) return 0;
  return Math.round((completed.length / curriculum.length) * 100);
}
