// ─── Learning Roadmap System ───────────────────────────────────────────────

function createStandardLesson({ title, description, difficulty, duration, explanation, realWorldExample, syntax, practicalExample, bestPractices, commonMistakes, exercise, lang }) {
    const topic = title;
    return {
        title,
        description: description || `Learn ${topic} with practical examples and industry context.`,
        difficulty: difficulty || "Beginner",
        duration: duration || "20 min",
        explanation: explanation || `${topic} is a core skill for AI engineers. Understanding this concept helps you build reliable, production-ready systems and communicate technical decisions clearly in interviews.`,
        realWorldExample: realWorldExample || `Teams use ${topic} when shipping features under deadlines — from startups building MVPs to enterprises scaling AI products serving millions of users.`,
        syntax: syntax || `# ${topic} — syntax overview\n# Refer to language docs for full API`,
        practicalExample: practicalExample || `# ${topic} example\nprint("Applying ${topic} in practice")`,
        bestPractices: bestPractices || [`Master ${topic} fundamentals before advanced patterns`, "Write readable, testable code", "Document assumptions and edge cases", "Review official documentation regularly"],
        commonMistakes: commonMistakes || ["Skipping foundational concepts", "Copy-pasting without understanding", "Ignoring error handling", "Not practicing with real exercises"],
        quizQuestions: [
            { question: `What is the primary purpose of ${topic}?`, options: ["Core engineering skill", "Optional decoration", "Deprecated technique", "Only for interviews"], correct: 0 },
            { question: `When should you apply ${topic}?`, options: ["Never", "In relevant real-world scenarios", "Only in theory", "Randomly"], correct: 1 },
            { question: `Best practice for learning ${topic}?`, options: ["Memorize only", "Practice + build projects", "Skip exercises", "Avoid documentation"], correct: 1 },
            { question: `Common mistake with ${topic}?`, options: ["Practicing regularly", "Rushing without fundamentals", "Reading docs", "Building mini projects"], correct: 1 },
            { question: `How does ${topic} help AI engineers?`, options: ["No benefit", "Builds production-ready skills", "Only for managers", "Replaces all other skills"], correct: 1 }
        ],
        exercise: exercise || `Create a small practice exercise applying ${topic}. Write code, test edge cases, and explain your approach in 3-5 sentences.`,
        codeLang: lang || "python"
    };
}

function buildTopicCurriculum(topics, difficulty, lang) {
    return topics.map((title) => createStandardLesson({ title, difficulty, lang }));
}

const AI_FUNDAMENTALS_TOPICS = [
    "What is AI", "Machine Learning", "Deep Learning", "Neural Networks", "NLP",
    "Computer Vision", "Generative AI", "Large Language Models", "AI Agents", "RAG",
    "Embeddings", "Vector Databases", "Fine Tuning", "AI Ethics", "AI Use Cases", "AI Project Lifecycle"
];

const PROMPT_ENGINEERING_TOPICS = [
    "Introduction", "Prompt Basics", "Zero-shot Prompting", "One-shot Prompting", "Few-shot Prompting",
    "Chain of Thought", "Role Prompting", "System Prompts", "Context Engineering", "Prompt Templates",
    "Prompt Debugging", "Structured Output", "JSON Prompting", "Prompt Chaining", "Multi-step Prompting",
    "RAG Prompting", "AI Agent Prompting", "Real-world Prompt Examples", "Best Practices", "Common Mistakes",
    "Exercises", "Quizzes"
];

const PATH_TOPIC_MAP = {
    "advanced-python": ["Decorators", "Generators", "Context Managers", "Async IO", "Type Hints", "Testing", "Packaging", "Performance"],
    "java-fundamentals": ["Java Basics", "OOP", "Collections", "Exception Handling", "Multithreading", "JVM Overview"],
    "advanced-java": ["Streams API", "Lambdas", "Concurrency", "JVM Tuning", "Design Patterns", "Memory Model"],
    "javascript": ["Variables", "Functions", "DOM", "ES6+", "Async/Await", "Modules"],
    "advanced-javascript": ["Closures", "Prototypes", "Event Loop", "Functional JS", "Performance", "Testing"],
    "react": ["Components", "JSX", "Props & State", "Hooks", "Context", "Routing"],
    "typescript": ["Types", "Interfaces", "Generics", "Utility Types", "TS + React", "Strict Mode"],
    "spring-boot": ["Boot Basics", "REST Controllers", "Dependency Injection", "JPA Integration", "Security", "Testing"],
    "spring-security": ["Authentication", "Authorization", "JWT", "OAuth2", "CSRF", "Security Config"],
    "hibernate": ["ORM Basics", "Entities", "Relationships", "HQL", "Caching", "Transactions"],
    "jpa": ["Entity Mapping", "Repositories", "Queries", "Relationships", "Pagination", "Auditing"],
    "rest-apis": ["HTTP Methods", "Status Codes", "REST Design", "Versioning", "Error Handling", "Documentation"],
    "microservices": ["Service Design", "API Gateway", "Service Discovery", "Resilience", "Observability", "Deployment"],
    "sql": ["SELECT Queries", "JOINs", "Aggregations", "Indexes", "Transactions", "Normalization"],
    "postgresql": ["Setup", "Data Types", "Advanced Queries", "JSONB", "Performance", "Backups"],
    "mongodb": ["Documents", "CRUD", "Aggregation", "Indexing", "Schema Design", "Atlas"],
    "docker": ["Images", "Containers", "Dockerfile", "Compose", "Volumes", "Networking"],
    "kubernetes": ["Pods", "Deployments", "Services", "ConfigMaps", "Ingress", "Helm Basics"],
    "aws": ["IAM", "EC2", "S3", "Lambda", "RDS", "CloudWatch"],
    "azure-basics": ["Azure Portal", "VMs", "Blob Storage", "Functions", "Azure SQL", "Monitor"],
    "git-github": ["Git Basics", "Branching", "Pull Requests", "Merge Conflicts", "GitHub Actions", "Code Review"],
    "linux": ["Shell Basics", "File Permissions", "Processes", "Networking", "Cron", "Logs"],
    "cicd": ["CI Concepts", "CD Pipelines", "GitHub Actions", "Jenkins", "Testing Gates", "Deployments"],
    "system-design": ["Requirements", "Scalability", "Databases", "Caching", "Load Balancing", "Tradeoffs"],
    "apache-kafka": ["Topics", "Producers", "Consumers", "Partitions", "Streams", "Operations"]
};

const LEARNING_PATHS = [
    { id: "python-fundamentals", title: "Python Fundamentals", category: "core", prerequisite: null, unlockPercent: 0, subtitle: "Master Python from variables to OOP" },
    { id: "advanced-python", title: "Advanced Python", category: "core", prerequisite: "python-fundamentals", unlockPercent: 50, subtitle: "Decorators, async, testing, and packaging" },
    { id: "java-fundamentals", title: "Java Fundamentals", category: "core", prerequisite: "python-fundamentals", unlockPercent: 30, subtitle: "Core Java for backend engineering" },
    { id: "advanced-java", title: "Advanced Java", category: "core", prerequisite: "java-fundamentals", unlockPercent: 50, subtitle: "Streams, concurrency, and JVM depth" },
    { id: "javascript", title: "JavaScript", category: "frontend", prerequisite: "python-fundamentals", unlockPercent: 20, subtitle: "Modern JavaScript fundamentals" },
    { id: "advanced-javascript", title: "Advanced JavaScript", category: "frontend", prerequisite: "javascript", unlockPercent: 50, subtitle: "Closures, event loop, and patterns" },
    { id: "react", title: "React", category: "frontend", prerequisite: "javascript", unlockPercent: 40, subtitle: "Build dynamic UIs with React" },
    { id: "typescript", title: "TypeScript", category: "frontend", prerequisite: "javascript", unlockPercent: 40, subtitle: "Type-safe JavaScript development" },
    { id: "spring-boot", title: "Spring Boot", category: "backend", prerequisite: "java-fundamentals", unlockPercent: 40, subtitle: "Production REST APIs with Spring" },
    { id: "spring-security", title: "Spring Security", category: "backend", prerequisite: "spring-boot", unlockPercent: 50, subtitle: "Secure authentication and authorization" },
    { id: "hibernate", title: "Hibernate", category: "backend", prerequisite: "java-fundamentals", unlockPercent: 40, subtitle: "ORM and persistence layer" },
    { id: "jpa", title: "JPA", category: "backend", prerequisite: "hibernate", unlockPercent: 50, subtitle: "Java Persistence API mastery" },
    { id: "rest-apis", title: "REST APIs", category: "backend", prerequisite: "python-fundamentals", unlockPercent: 25, subtitle: "Design and build RESTful services" },
    { id: "microservices", title: "Microservices", category: "backend", prerequisite: "rest-apis", unlockPercent: 50, subtitle: "Distributed system architecture" },
    { id: "sql", title: "SQL", category: "data", prerequisite: "python-fundamentals", unlockPercent: 20, subtitle: "Query and manage relational data" },
    { id: "postgresql", title: "PostgreSQL", category: "data", prerequisite: "sql", unlockPercent: 40, subtitle: "Advanced PostgreSQL for production" },
    { id: "mongodb", title: "MongoDB", category: "data", prerequisite: "sql", unlockPercent: 40, subtitle: "Document databases and NoSQL" },
    { id: "docker", title: "Docker", category: "devops", prerequisite: "rest-apis", unlockPercent: 30, subtitle: "Containerize applications" },
    { id: "kubernetes", title: "Kubernetes", category: "devops", prerequisite: "docker", unlockPercent: 50, subtitle: "Orchestrate containers at scale" },
    { id: "aws", title: "AWS", category: "devops", prerequisite: "docker", unlockPercent: 30, subtitle: "Cloud infrastructure on Amazon Web Services" },
    { id: "azure-basics", title: "Azure Basics", category: "devops", prerequisite: "aws", unlockPercent: 40, subtitle: "Microsoft Azure cloud fundamentals" },
    { id: "git-github", title: "Git & GitHub", category: "devops", prerequisite: null, unlockPercent: 0, subtitle: "Version control and collaboration" },
    { id: "linux", title: "Linux", category: "devops", prerequisite: null, unlockPercent: 0, subtitle: "Command line and server administration" },
    { id: "cicd", title: "CI/CD", category: "devops", prerequisite: "git-github", unlockPercent: 40, subtitle: "Automated build and deployment pipelines" },
    { id: "system-design", title: "System Design", category: "backend", prerequisite: "microservices", unlockPercent: 50, subtitle: "Scalable architecture interviews" },
    { id: "apache-kafka", title: "Apache Kafka", category: "backend", prerequisite: "microservices", unlockPercent: 50, subtitle: "Event streaming and messaging" },
    { id: "ai-fundamentals", title: "AI Fundamentals", category: "ai", prerequisite: "python-fundamentals", unlockPercent: 25, subtitle: "ML, LLMs, RAG, and AI engineering core" },
    { id: "prompt-engineering", title: "Prompt Engineering", category: "ai", prerequisite: "ai-fundamentals", unlockPercent: 30, subtitle: "Master prompting for production LLM apps" }
];

let aiFundamentalsCurriculum = buildTopicCurriculum(AI_FUNDAMENTALS_TOPICS, "Intermediate", "python");
let promptEngineeringCurriculum = buildTopicCurriculum(PROMPT_ENGINEERING_TOPICS, "Intermediate", "python");

// Enrich key AI lessons with deeper content
aiFundamentalsCurriculum[0] = createStandardLesson({
    title: "What is AI",
    difficulty: "Beginner",
    explanation: "Artificial Intelligence (AI) is the field of building systems that perform tasks requiring human-like intelligence — perception, reasoning, learning, and decision-making. Modern AI engineering combines data, models, software, and cloud infrastructure.",
    realWorldExample: "Netflix recommends shows, Gmail filters spam, and GitHub Copilot suggests code — all powered by AI systems trained on data and deployed as production services.",
    syntax: "# AI system components\n# Data → Features → Model → API → User",
    practicalExample: "# Simple rule-based vs ML-based classification\nkeywords = ['refund', 'cancel', 'broken']\nticket = 'I want a refund for my order'\nprint('AI triage:', any(k in ticket.lower() for k in keywords))",
    exercise: "List 3 AI products you use daily. For each, identify: input data, model type, and user-facing output."
});
aiFundamentalsCurriculum[9] = createStandardLesson({
    title: "RAG",
    difficulty: "Advanced",
    explanation: "Retrieval-Augmented Generation (RAG) combines document retrieval with LLM generation. Instead of relying only on model memory, RAG fetches relevant context from a knowledge base and grounds answers in source material.",
    realWorldExample: "Enterprise support bots use RAG to answer policy questions from internal PDFs, reducing hallucinations and enabling cited responses.",
    syntax: "# RAG pipeline\n# 1. Chunk docs  2. Embed  3. Retrieve  4. Prompt LLM",
    practicalExample: "from typing import List\ndocs = ['Python is great for AI', 'RAG reduces hallucinations']\nquery = 'How does RAG help?'\n# Simplified retrieval by keyword overlap\nranked = sorted(docs, key=lambda d: sum(w in d.lower() for w in query.lower().split()), reverse=True)\ncontext = ranked[0]\nprint(f'Context: {context}\\nAnswer: Use retrieved context to ground LLM response.')",
    exercise: "Design a RAG flow for a company FAQ bot. Define chunk size, retrieval metric, and prompt template."
});

promptEngineeringCurriculum[5] = createStandardLesson({
    title: "Chain of Thought",
    difficulty: "Intermediate",
    explanation: "Chain of Thought (CoT) prompting asks the model to show intermediate reasoning steps before the final answer. This improves accuracy on math, logic, and multi-step problems.",
    realWorldExample: "Interview grading systems use CoT to evaluate whether a candidate's reasoning process is sound, not just the final answer.",
    syntax: 'prompt = """Solve step by step:\n1. Identify given data\n2. Apply formula\n3. State final answer"""\n',
    practicalExample: 'prompt = """A store has 24 apples. They sell 1/3 in the morning and 5 in the afternoon. How many remain? Think step by step."""\n# Expected: 24 - 8 - 5 = 11',
    exercise: "Write a CoT prompt for a system design question about scaling a chat API."
});

const generatedCurriculumCache = {};

function getCurriculumForPath(pathId) {
    if (pathId === "python-fundamentals") return pythonCurriculum;
    if (pathId === "ai-fundamentals") return aiFundamentalsCurriculum;
    if (pathId === "prompt-engineering") return promptEngineeringCurriculum;
    if (!generatedCurriculumCache[pathId] && PATH_TOPIC_MAP[pathId]) {
        const diff = pathId.includes("advanced") ? "Advanced" : "Intermediate";
        const lang = pathId.includes("java") ? "java" : pathId.includes("javascript") || pathId.includes("react") || pathId.includes("typescript") ? "javascript" : pathId.includes("sql") ? "sql" : "python";
        generatedCurriculumCache[pathId] = buildTopicCurriculum(PATH_TOPIC_MAP[pathId], diff, lang);
    }
    return generatedCurriculumCache[pathId] || [];
}

function getPathProgressPercent(pathId) {
    const completed = JSON.parse(localStorage.getItem(`nexusCompleted_${pathId}`) || "[]");
    const curriculum = getCurriculumForPath(pathId);
    if (!curriculum.length) return 0;
    return Math.round((completed.length / curriculum.length) * 100);
}

function isPathUnlocked(path) {
    if (!path.prerequisite) return true;
    return getPathProgressPercent(path.prerequisite) >= path.unlockPercent;
}

let currentPathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
let currentLessonIndex = null;
let completedLessons = [];
let activePathCategory = "all";
