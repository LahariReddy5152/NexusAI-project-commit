/** Phase 4 — structured interview question banks */
import { buildQuestion } from "./interview-builder.js";

export const MOCK_TOPICS = [
  { id: "all", label: "All Topics" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL" },
  { id: "spring-boot", label: "Spring Boot" },
  { id: "react", label: "React" },
  { id: "ai", label: "AI" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "system-design", label: "System Design" },
  { id: "behavioral", label: "Behavioral" },
  { id: "hr", label: "HR" }
];

export const SECTION_CONFIG = {
  mock: {
    label: "Mock Interview",
    description: "Practice with audio, text, or video responses. AI evaluates correctness, communication, confidence, clarity, and structure.",
    topics: MOCK_TOPICS.filter((t) => t.id !== "all")
  },
  technical: {
    label: "Technical Interview",
    description: "Depth questions across languages and frameworks with score tracking.",
    topics: [
      { id: "java", label: "Java" },
      { id: "spring-boot", label: "Spring Boot" },
      { id: "sql", label: "SQL" },
      { id: "python", label: "Python" },
      { id: "javascript", label: "JavaScript" },
      { id: "react", label: "React" },
      { id: "ai-ml", label: "AI/ML" }
    ]
  },
  "system-design": {
    label: "System Design",
    description: "HLD/LLD, scalability, data stores, caching, and messaging patterns.",
    topics: [
      { id: "hld", label: "HLD" },
      { id: "lld", label: "LLD" },
      { id: "scalability", label: "Scalability" },
      { id: "databases", label: "Databases" },
      { id: "caching", label: "Caching" },
      { id: "messaging", label: "Messaging Systems" }
    ]
  },
  "ai-track": {
    label: "AI Interview Track",
    description: "Prompt engineering, OpenAI APIs, RAG, LangChain, and agent architectures.",
    topics: [
      { id: "prompt-engineering", label: "Prompt Engineering" },
      { id: "openai-apis", label: "OpenAI APIs" },
      { id: "rag", label: "RAG" },
      { id: "langchain", label: "LangChain" },
      { id: "agents", label: "Agents" }
    ]
  }
};

const CRITERIA = {
  structure: "Clear structure (problem → approach → tradeoffs → result)",
  depth: "Technical depth appropriate to difficulty level",
  metrics: "Quantified impact or complexity where relevant",
  tradeoffs: "Explicit tradeoffs and alternatives considered",
  clarity: "Concise, interview-ready delivery"
};

function Q(id, section, topic, topicLabel, difficulty, question, sampleAnswer, extra = {}) {
  return buildQuestion({
    id,
    section,
    topic,
    topicLabel,
    difficulty,
    question,
    sampleAnswer,
    evaluationCriteria: extra.criteria || [CRITERIA.structure, CRITERIA.depth, CRITERIA.clarity],
    recommendations: extra.recommendations || []
  });
}

function matchesMockTopic(q, topicId) {
  if (!topicId || topicId === "all") return true;
  const rules = {
    frontend: () => q.topic === "javascript" || q.topic === "react",
    backend: () => q.section === "technical" && ["java", "spring-boot", "python"].includes(q.topic),
    java: () => q.topic === "java",
    python: () => q.topic === "python",
    sql: () => q.topic === "sql",
    "spring-boot": () => q.topic === "spring-boot",
    react: () => q.topic === "react",
    ai: () => q.section === "ai-track" || q.topic === "generative-ai",
    "machine-learning": () => q.topic === "ai-ml",
    "system-design": () => q.section === "system-design" || q.topic === "system-design",
    behavioral: () => q.section === "behavioral",
    hr: () => q.section === "hr"
  };
  return rules[topicId]?.() || q.topic === topicId || q.section === topicId;
}

export const INTERVIEW_QUESTIONS = [
  Q("mock-1", "mock", "behavioral", "Behavioral", "easy",
    "Tell me about yourself in 90 seconds for a backend engineer role.",
    "I'm a backend engineer with 3 years building Java/Spring APIs serving 2M daily requests. Recently I led migration to PostgreSQL read replicas, cutting p95 latency 40%. I'm passionate about reliable systems and am excited about this role because your platform scale matches problems I enjoy.",
    { criteria: [CRITERIA.structure, CRITERIA.clarity, "Hook in first 10 seconds"], recommendations: ["Record and remove filler words"] }),
  Q("mock-2", "mock", "system-design", "System Design", "medium",
    "Walk through a production incident you resolved under time pressure.",
    "Situation: payment API error rate spiked to 8% after deploy. Task: restore service within SLA. Action: rolled back canary, traced to connection pool misconfiguration, added pool metrics and integration test. Result: MTTR 22 minutes; no data loss; postmortem added autoscaling on pool saturation.",
    { criteria: ["STAR or timeline structure", "Concrete metrics"], recommendations: ["Prepare 2 incident stories"] }),
  Q("mock-3", "mock", "backend", "Backend", "hard",
    "Design and explain a feature you would ship in your first 90 days.",
    "I would ship observability for the checkout service: distributed tracing, SLO dashboard, alert runbooks. Phase 1: instrument top 5 endpoints. Phase 2: define SLOs with PM. Phase 3: error budget policy.",
    { criteria: [CRITERIA.tradeoffs, "Phased plan"], recommendations: ["End with measurable success criteria"] }),

  Q("tech-java-1", "technical", "java", "Java", "easy",
    "Explain the difference between == and equals() in Java.",
    "== compares references for objects (value for primitives). equals() compares logical equality when overridden. String literals interning makes == appear to work for strings but fails for new String objects. Always use equals() for content comparison; override hashCode when overriding equals.",
    { recommendations: ["Mention String pool example"] }),
  Q("tech-java-2", "technical", "java", "Java", "medium",
    "How does the Java memory model affect thread safety?",
    "JMM defines happens-before rules for visibility across threads. Without synchronization or volatile, writes may not be visible; reordering is allowed. I use synchronized, locks, or concurrent collections for shared mutable state; prefer immutability where possible.",
    { recommendations: ["Give volatile vs synchronized example"] }),
  Q("tech-java-3", "technical", "java", "Java", "hard",
    "Describe how you would diagnose a memory leak in a Spring Boot service.",
    "Capture heap dumps under load, analyze dominator tree in VisualVM or Eclipse MAT, identify growing collections or unclosed resources. Correlate with metrics; reproduce in staging. Fix root cause, add heap alerts, regression test with load.",
    { recommendations: ["Name specific tools"] }),

  Q("tech-spring-1", "technical", "spring-boot", "Spring Boot", "easy",
    "What is dependency injection and why use it in Spring?",
    "DI supplies dependencies from outside the class, enabling loose coupling and testability. Spring's IoC container wires beans via constructor injection (preferred), reducing hidden dependencies and easing mocks in unit tests.",
    { recommendations: ["Prefer constructor over field injection"] }),
  Q("tech-spring-2", "technical", "spring-boot", "Spring Boot", "medium",
    "How does Spring Boot auto-configuration work?",
    "Auto-config classes on classpath are conditionally applied via @ConditionalOn* annotations checking beans, properties, or classpath. spring.factories / AutoConfiguration.imports register them. Override with explicit @Configuration or exclude in application.properties.",
    { recommendations: ["Give one conditional example"] }),
  Q("tech-spring-3", "technical", "spring-boot", "Spring Boot", "hard",
    "Design global exception handling for a REST API.",
    "@ControllerAdvice with @ExceptionHandler methods mapping exceptions to ProblemDetail RFC 7807 responses. Log 5xx with correlation IDs; return safe messages to clients.",
    { recommendations: ["Discuss logging vs exposing internals"] }),

  Q("tech-sql-1", "technical", "sql", "SQL", "easy",
    "Difference between INNER JOIN and LEFT JOIN?",
    "INNER JOIN returns rows with matches in both tables. LEFT JOIN returns all left rows plus matching right rows; unmatched right columns are NULL. Use LEFT JOIN to preserve driving table rows when optional relations may be missing.",
    { recommendations: ["Draw small table example"] }),
  Q("tech-sql-2", "technical", "sql", "SQL", "medium",
    "What are clustered vs non-clustered indexes?",
    "Clustered index defines physical row order (one per table). Non-clustered is separate structure with pointers to data. Clustered suits range scans on primary key; non-clustered helps covering queries but adds write overhead.",
    { recommendations: ["Explain covering index"] }),
  Q("tech-sql-3", "technical", "sql", "SQL", "hard",
    "How do you prevent N+1 query problems in ORM applications?",
    "Use fetch joins, @EntityGraph, or batch fetching; profile SQL logs. For reports, use DTO projections or native queries. Set query timeouts and pagination; cache read-heavy reference data.",
    { recommendations: ["Spring Data example"] }),

  Q("tech-py-1", "technical", "python", "Python", "easy",
    "List vs tuple — when to use each?",
    "Lists are mutable, tuples immutable. Use tuples for fixed records, dict keys, and return bundles; lists for collections that change. Tuples have slightly lower memory and signal intent to readers.",
    { recommendations: ["Mention namedtuple/dataclass"] }),
  Q("tech-py-2", "technical", "python", "Python", "medium",
    "Explain decorators and a real use case.",
    "Decorators wrap functions to add cross-cutting behavior. Example: @retry on API calls, @timing for profiling, @login_required in Flask. They preserve metadata with functools.wraps.",
    { recommendations: ["Show minimal code sketch verbally"] }),
  Q("tech-py-3", "technical", "python", "Python", "hard",
    "How would you structure a FastAPI service for production?",
    "Layered: routers → services → repositories. Pydantic schemas for I/O; dependency injection for DB sessions; background tasks for async work; OpenTelemetry tracing; pytest with TestClient; Docker multi-stage build.",
    { recommendations: ["Mention async vs sync endpoints"] }),

  Q("tech-js-1", "technical", "javascript", "JavaScript", "easy",
    "Explain var, let, and const differences.",
    "var is function-scoped and hoisted; let/const are block-scoped with temporal dead zone. const prevents rebinding but objects remain mutable. Default to const, use let when reassignment needed, avoid var.",
    { recommendations: ["Hoisting example"] }),
  Q("tech-js-2", "technical", "javascript", "JavaScript", "medium",
    "What is the event loop in JavaScript?",
    "Single-threaded runtime processes call stack, then microtasks (promises), then macrotasks (setTimeout, I/O). Understanding order prevents race bugs and explains why heavy CPU blocks UI.",
    { recommendations: ["Microtask vs macrotask ordering"] }),
  Q("tech-react-1", "technical", "react", "React", "easy",
    "useState vs useEffect — when to use each?",
    "useState stores component state; useEffect runs side effects after render (fetch, subscriptions). Don't mirror props to state unnecessarily; derive values instead.",
    { recommendations: ["Dependency array pitfalls"] }),
  Q("tech-react-2", "technical", "react", "React", "medium",
    "How do you optimize a large React dashboard?",
    "Code split routes, memoize expensive components, virtualize long lists, defer non-critical data, use React Query for caching. Profile with React DevTools Profiler before optimizing.",
    { recommendations: ["Avoid premature memo"] }),

  Q("tech-aiml-1", "technical", "ai-ml", "AI/ML", "medium",
    "How do you detect model drift in production?",
    "Monitor input feature distributions (PSI), output confidence shifts, and business KPIs. Shadow deployments for new models; automated alerts; scheduled retraining triggers.",
    { recommendations: ["Define PSI threshold"] }),
  Q("tech-aiml-2", "technical", "ai-ml", "AI/ML", "hard",
    "Train/serve skew — how do you prevent it?",
    "Shared feature pipeline, same preprocessing code in training and serving, feature store, integration tests comparing batch vs online features on sample requests.",
    { recommendations: ["Version features"] }),

  Q("beh-star-1", "behavioral", "star", "STAR Method", "easy",
    "Describe a project where you missed a deadline.",
    "Situation: API migration due Friday. Task: deliver auth module. Action: flagged risk Tuesday, negotiated scope cut, pair-programmed critical path, daily updates. Result: shipped core auth on time; docs slipped to Monday with PM agreement.",
    { criteria: ["Full STAR", "Accountability without blame"], recommendations: ["Keep under 2 minutes"] }),
  Q("beh-lead-1", "behavioral", "leadership", "Leadership", "medium",
    "Tell me about leading a team through a difficult technical decision.",
    "Situation: monolith vs microservices debate. Task: align 5 engineers. Action: spike both options, scored on ops cost, velocity, failure modes; facilitated decision doc. Result: chose modular monolith; saved 6 months ops overhead.",
    { recommendations: ["Show facilitation not dictation"] }),
  Q("hr-intro-1", "hr", "introductions", "Introductions", "easy",
    "Walk me through your resume.",
    "Structure: current role + impact, prior relevant experience, education/certifications briefly, why this company. 2 minutes max; emphasize outcomes aligned to job description.",
    { recommendations: ["Mirror job posting keywords"] }),

  Q("sd-hld-1", "system-design", "hld", "HLD", "hard",
    "High-level design of a URL shortener.",
    "Requirements: create short URL, redirect, analytics optional. API → app servers → DB (base62 id); cache hot links; read-heavy CDN edge. Capacity estimate: 100M URLs, 10k RPS read.",
    { criteria: ["Requirements first", "Capacity math", CRITERIA.tradeoffs], recommendations: ["Discuss collision handling"] }),
  Q("sd-lld-1", "system-design", "lld", "LLD", "medium",
    "Low-level design of a parking lot system.",
    "Entities: ParkingLot, Floor, Spot, Ticket, Vehicle. Spot allocation strategy; thread-safe booking; payment interface. Class diagram: Spot.isAvailable(), TicketFactory.",
    { recommendations: ["SOLID principles"] }),
  Q("sd-scale-1", "system-design", "scalability", "Scalability", "hard",
    "How do you scale a read-heavy API 100x?",
    "Horizontal app replicas behind LB; read replicas; cache (Redis); CDN for static; async precompute; DB indexing and query tuning; eventual consistency where acceptable.",
    { recommendations: ["Bottleneck identification"] }),
  Q("sd-db-1", "system-design", "databases", "Databases", "medium",
    "SQL vs NoSQL for a social feed — tradeoffs?",
    "SQL: strong consistency, joins for small graphs. NoSQL/Cassandra: write-heavy feeds at scale, denormalized fan-out. Hybrid: SQL for user graph, Redis/Cassandra for feed cache.",
    { recommendations: ["CAP theorem mention"] }),
  Q("sd-cache-1", "system-design", "caching", "Caching", "medium",
    "Cache-aside vs write-through vs write-back?",
    "Cache-aside: app manages cache miss load—flexible, stale risk. Write-through: sync write to cache and DB—consistent, slower writes. Write-back: batch writes—fast, data loss risk on crash.",
    { recommendations: ["TTL strategy"] }),
  Q("sd-msg-1", "system-design", "messaging", "Messaging Systems", "hard",
    "When Kafka vs RabbitMQ vs SQS?",
    "Kafka: high-throughput event log, replay, stream processing. RabbitMQ: flexible routing, traditional queues. SQS: managed, simple, AWS-native, at-least-once.",
    { recommendations: ["Partitioning keys"] }),

  Q("ai-pe-1", "ai-track", "prompt-engineering", "Prompt Engineering", "medium",
    "How do you design prompts for consistent JSON output?",
    "System message defines schema; few-shot examples; response_format json_object; validate with Pydantic; retry on parse failure with error feedback; temperature 0 for extraction tasks.",
    { recommendations: ["Show schema in prompt"] }),
  Q("ai-rag-1", "ai-track", "rag", "RAG", "hard",
    "Design a RAG pipeline for internal docs.",
    "Ingest → chunk 512 tokens → embed → vector store → hybrid search → rerank → prompt with citations → eval faithfulness/recall. Refresh index on doc webhook.",
    { recommendations: ["Chunk overlap tuning"] }),
  Q("ai-lc-1", "ai-track", "langchain", "LangChain", "medium",
    "What is LCEL and why use it?",
    "LangChain Expression Language composes chains with | operator; supports streaming, async, batch, and parallel steps declaratively. Easier testing than nested function calls.",
    { recommendations: ["Compare to raw OpenAI SDK"] }),
  Q("ai-ag-1", "ai-track", "agents", "Agents", "hard",
    "How do you prevent runaway agent tool loops?",
    "Max iteration cap; duplicate action detection; cost budget per session; human approval for destructive tools; log traces; eval trajectories on golden tasks.",
    { recommendations: ["ReAct vs plan-and-execute"] })
];

export function getQuestionsForSection(sectionId, topicId = "all", difficulty = "all") {
  let pool;
  if (sectionId === "mock") {
    pool = INTERVIEW_QUESTIONS.filter((q) => q.section === "mock" || matchesMockTopic(q, topicId));
  } else {
    pool = INTERVIEW_QUESTIONS.filter((q) => q.section === sectionId);
  }

  return pool.filter((q) => {
    if (sectionId !== "mock" && topicId !== "all" && q.topic !== topicId) return false;
    if (difficulty !== "all" && q.difficulty !== difficulty) return false;
    return true;
  });
}

export function getQuestionById(id) {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id) || null;
}

export function getSectionRecommendations(sectionId, progress) {
  const recs = [];
  const questions = getQuestionsForSection(sectionId);
  const topics = [...new Set(questions.map((q) => q.topic))];
  if (progress.avgScore < 60) {
    recs.push("Review sample answers and practice structured responses.");
  }
  if (progress.attempted < 3) {
    recs.push(`Complete at least 3 questions in ${SECTION_CONFIG[sectionId]?.label || sectionId}.`);
  }
  if (progress.avgScore >= 80) {
    recs.push("Increase difficulty to hard and practice mock sessions with voice analysis.");
  }
  topics.slice(0, 2).forEach((t) => {
    const label = questions.find((q) => q.topic === t)?.topicLabel || t;
    recs.push(`Deepen practice in: ${label}.`);
  });
  return [...new Set(recs)].slice(0, 5);
}
