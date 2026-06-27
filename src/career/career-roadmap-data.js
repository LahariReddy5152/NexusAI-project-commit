/** Priority 6 — 10 independent career roadmap paths */
import { buildRoadmapPath } from "./career-roadmap-builder.js";

function stage(title, skills, milestones, interviewTopics) {
  return { title, skills, milestones, interviewTopics };
}

function path(spec) {
  return buildRoadmapPath(spec);
}

export const CAREER_ROADMAPS = [
  path({
    id: "ai-engineer",
    title: "AI Engineer",
    timeline: "6–9 months (15–25 hrs/week)",
    technologies: ["Python", "SQL", "REST APIs", "Embeddings", "RAG", "LangChain", "Docker", "AWS/GCP"],
    recommendedOrder: [
      "Python fundamentals → SQL → AI/ML foundations",
      "Prompt engineering → OpenAI APIs → Embeddings",
      "RAG systems → LangChain → AI agents",
      "Deploy AI services with Docker + cloud",
      "Portfolio projects + system design interview prep"
    ],
    projects: ["RAG Chatbot", "OpenAI Document Assistant", "AI Resume Analyzer"],
    certifications: ["AWS ML Specialty (optional)", "Google Professional ML Engineer (optional)", "NexusAI AI Fundamentals certificate"],
    interviewTopics: ["RAG architecture", "LLM evaluation", "Prompt design", "API rate limits", "System design for AI APIs"],
    stages: {
      beginner: stage("Beginner", ["Python syntax", "SQL queries", "HTTP/REST basics", "Git"], [
        "Complete Python fundamentals course",
        "Write 10 SQL JOIN practice queries",
        "Build a REST client calling a public API",
        "Understand vectors and embeddings conceptually"
      ], ["Python data structures", "SQL JOIN types", "What is an LLM?"]),
      intermediate: stage("Intermediate", ["FastAPI", "OpenAI APIs", "Vector DBs", "Prompt templates"], [
        "Build document Q&A with embeddings",
        "Implement chunking + retrieval pipeline",
        "Add evaluation metrics for answers",
        "Containerize API with Docker"
      ], ["RAG vs fine-tuning", "Chunk size tradeoffs", "Reducing hallucinations"]),
      advanced: stage("Advanced", ["Agents", "MLOps basics", "Observability", "Cost optimization"], [
        "Ship agent with tool use and guardrails",
        "Add tracing and latency dashboards",
        "Run load test and tune batch sizes",
        "Present end-to-end architecture review"
      ], ["Agent orchestration", "Production monitoring", "Cost/latency tradeoffs"])
    }
  }),

  path({
    id: "java-full-stack",
    title: "Java Full Stack Developer",
    timeline: "8–12 months",
    technologies: ["Java", "Spring Boot", "Hibernate/JPA", "SQL", "React", "JavaScript", "Maven", "Docker"],
    recommendedOrder: [
      "Java OOP → Collections → Exception handling",
      "SQL → JDBC → Spring Boot REST",
      "React + JavaScript frontend",
      "Full-stack integration project",
      "CI/CD and deployment"
    ],
    projects: ["Employee Management System", "Smart Expense Tracker", "API Gateway Service"],
    certifications: ["Oracle Java certification (optional)", "Spring Professional (optional)"],
    interviewTopics: ["Spring DI", "JPA relationships", "REST design", "React state management"],
    stages: {
      beginner: stage("Beginner", ["Java syntax", "OOP", "Collections", "SQL SELECT/JOIN"], [
        "Complete Java fundamentals",
        "Implement CRUD with JDBC",
        "Build CLI expense tracker",
        "Learn Git branching workflow"
      ], ["== vs equals", "ArrayList vs HashMap", "INNER vs LEFT JOIN"]),
      intermediate: stage("Intermediate", ["Spring Boot", "JPA", "React", "REST security basics"], [
        "REST API with Spring Boot + JPA",
        "React UI consuming your API",
        "Global exception handling",
        "Integration tests with Testcontainers"
      ], ["@Autowired types", "Transaction boundaries", "useEffect pitfalls"]),
      advanced: stage("Advanced", ["Microservices patterns", "Caching", "OAuth2", "K8s deploy"], [
        "Split monolith into 2 services",
        "Add Redis cache layer",
        "Secure API with JWT",
        "Deploy to cloud with health checks"
      ], ["Saga vs 2PC", "Cache invalidation", "JWT vs sessions"])
    }
  }),

  path({
    id: "backend-engineer",
    title: "Backend Engineer",
    timeline: "7–10 months",
    technologies: ["Java or Python", "Spring Boot/FastAPI", "PostgreSQL", "Redis", "Kafka", "Docker", "API design"],
    recommendedOrder: [
      "Language depth → SQL optimization",
      "REST + auth → messaging",
      "Caching + observability",
      "System design practice"
    ],
    projects: ["API Gateway Service", "Employee Management System", "ML Pipeline API"],
    certifications: ["AWS Solutions Architect Associate", "CKA (optional)"],
    interviewTopics: ["API design", "Database indexing", "Idempotency", "Rate limiting"],
    stages: {
      beginner: stage("Beginner", ["Language core", "SQL", "HTTP", "JSON"], [
        "Master language collections and concurrency basics",
        "Normalize a 3-table schema",
        "Build CRUD REST API",
        "Write unit tests for service layer"
      ], ["ACID properties", "HTTP verbs", "Status codes"]),
      intermediate: stage("Intermediate", ["Messaging", "Caching", "Migrations", "Logging"], [
        "Add Kafka/RabbitMQ event publish",
        "Redis cache-aside pattern",
        "Flyway/Alembic migrations",
        "Structured JSON logging"
      ], ["At-least-once delivery", "Cache stampede", "Connection pooling"]),
      advanced: stage("Advanced", ["Scalability", "SRE basics", "Multi-region"], [
        "Load test and fix bottlenecks",
        "Define SLOs and error budgets",
        "Design sharding strategy doc",
        "Chaos test failover scenario"
      ], ["Horizontal scaling", "CAP tradeoffs", "Backpressure"])
    }
  }),

  path({
    id: "frontend-engineer",
    title: "Frontend Engineer",
    timeline: "6–9 months",
    technologies: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Vite", "Testing Library", "Accessibility"],
    recommendedOrder: [
      "HTML/CSS → JavaScript ES6+",
      "React fundamentals → state management",
      "TypeScript → testing",
      "Performance + a11y → portfolio"
    ],
    projects: ["Job Tracker Kanban UI", "AI Learning Platform frontend", "Smart Expense Tracker PWA"],
    certifications: ["Meta Front-End Developer (optional)"],
    interviewTopics: ["Virtual DOM", "Performance", "Accessibility", "CSS layout"],
    stages: {
      beginner: stage("Beginner", ["HTML semantics", "CSS Flex/Grid", "JS DOM", "Fetch API"], [
        "Build responsive landing page",
        "Todo app with localStorage",
        "Consume public REST API",
        "Fix 5 a11y issues in sample app"
      ], ["Event loop", "let vs const", "Flex vs Grid"]),
      intermediate: stage("Intermediate", ["React", "Hooks", "Router", "Forms"], [
        "Multi-page React app with router",
        "Custom hooks for data fetching",
        "Form validation library",
        "Component tests with RTL"
      ], ["useMemo vs useCallback", "Keys in lists", "Controlled inputs"]),
      advanced: stage("Advanced", ["TypeScript", "Performance", "Design systems"], [
        "Migrate app to TypeScript",
        "Code-split routes + lazy load",
        "Lighthouse score > 90",
        "Publish component library Storybook"
      ], ["Core Web Vitals", "SSR vs CSR", "Bundle analysis"])
    }
  }),

  path({
    id: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    timeline: "9–12 months",
    technologies: ["Python", "NumPy/Pandas", "Scikit-learn", "PyTorch", "SQL", "MLflow", "Statistics"],
    recommendedOrder: [
      "Python + statistics → SQL",
      "Classic ML → deep learning basics",
      "Feature engineering → model evaluation",
      "Model serving → monitoring"
    ],
    projects: ["ML Pipeline", "Smart Expense categorization ML", "Kaggle-style notebook project"],
    certifications: ["AWS ML Specialty", "TensorFlow Developer (optional)"],
    interviewTopics: ["Bias-variance", "Cross-validation", "Feature leakage", "Model deployment"],
    stages: {
      beginner: stage("Beginner", ["Python data stack", "Statistics", "SQL", "EDA"], [
        "Pandas analysis on real dataset",
        "Hypothesis test exercise",
        "SQL aggregation queries",
        "Train first sklearn classifier"
      ], ["Overfitting", "Train/test split", "Precision vs recall"]),
      intermediate: stage("Intermediate", ["Feature engineering", "Pipelines", "Hyperparameter tuning"], [
        "End-to-end sklearn pipeline",
        "Grid search with cross-val",
        "Handle imbalanced classes",
        "MLflow experiment tracking"
      ], ["ROC-AUC", "Regularization", "Data leakage"]),
      advanced: stage("Advanced", ["Deep learning", "Serving", "Drift detection"], [
        "Train PyTorch model on GPU",
        "FastAPI inference endpoint",
        "Batch vs online inference design",
        "Monitor drift with PSI metric"
      ], ["CNN vs Transformer use cases", "Batching inference", "A/B model tests"])
    }
  }),

  path({
    id: "generative-ai-engineer",
    title: "Generative AI Engineer",
    timeline: "6–8 months",
    technologies: ["Python", "OpenAI APIs", "Prompt engineering", "RAG", "LangChain", "Vector DBs", "Eval frameworks"],
    recommendedOrder: [
      "LLM fundamentals → prompt engineering",
      "OpenAI APIs → embeddings",
      "RAG → LangChain/LCEL",
      "Agents + production hardening"
    ],
    projects: ["RAG Chatbot", "OpenAI Document Assistant", "Agentic RAG"],
    certifications: ["OpenAI/DeepLearning.AI short courses", "NexusAI Prompt Engineering cert"],
    interviewTopics: ["Prompt injection", "RAG eval", "Token economics", "Guardrails"],
    stages: {
      beginner: stage("Beginner", ["LLM basics", "Prompt patterns", "API auth", "JSON output"], [
        "Few-shot prompt library",
        "Chat completions integration",
        "Structured output with schema",
        "Token usage dashboard"
      ], ["Temperature effects", "System vs user prompts", "API keys security"]),
      intermediate: stage("Intermediate", ["RAG", "Chunking", "Hybrid search", "Streaming"], [
        "Ingest PDF corpus to vector DB",
        "Streaming SSE chat endpoint",
        "Citation in responses",
        "Faithfulness eval on 30 QAs"
      ], ["Re-ranking", "Context window limits", "Embedding model choice"]),
      advanced: stage("Advanced", ["Agents", "Multi-tool", "Safety", "Cost controls"], [
        "LangGraph agent with 3 tools",
        "Human-in-loop for risky actions",
        "Budget cap per user session",
        "Red-team prompt injection tests"
      ], ["Tool loop limits", "Eval harness design", "Fallback models"])
    }
  }),

  path({
    id: "data-engineer",
    title: "Data Engineer",
    timeline: "8–11 months",
    technologies: ["Python", "SQL", "Spark", "Airflow", "Kafka", "S3/Data Lake", "dbt", "Warehouse (Snowflake/BigQuery)"],
    recommendedOrder: [
      "SQL mastery → Python ETL scripts",
      "Batch pipelines → orchestration",
      "Streaming → data modeling",
      "Quality + governance"
    ],
    projects: ["ML Pipeline ingest layer", "Batch ETL to warehouse", "Streaming analytics mini-pipeline"],
    certifications: ["Databricks Data Engineer Associate", "GCP Professional Data Engineer (optional)"],
    interviewTopics: ["Star schema", "Partitioning", "Idempotent pipelines", "Data quality"],
    stages: {
      beginner: stage("Beginner", ["Advanced SQL", "Python", "CSV/Parquet", "Basic ETL"], [
        "Window functions SQL drill",
        "Python script: CSV → cleaned Parquet",
        "Document star schema for sales data",
        "Schedule cron ETL job"
      ], ["Slowly changing dimensions", "Normalization", "Parquet vs CSV"]),
      intermediate: stage("Intermediate", ["Airflow", "Spark basics", "Data modeling"], [
        "Airflow DAG with retries",
        "Spark aggregation job",
        "dbt models with tests",
        "Data quality checks in pipeline"
      ], ["DAG dependencies", "Shuffle optimization", "Incremental models"]),
      advanced: stage("Advanced", ["Streaming", "Lakehouse", "Governance"], [
        "Kafka → Spark Streaming job",
        "Iceberg/Delta table experiment",
        "Lineage documentation",
        "PII masking pipeline"
      ], ["Exactly-once semantics", "Compaction", "GDPR erase patterns"])
    }
  }),

  path({
    id: "devops-engineer",
    title: "DevOps Engineer",
    timeline: "7–10 months",
    technologies: ["Linux CLI", "Docker", "Kubernetes", "Terraform", "CI/CD", "Prometheus/Grafana", "Git"],
    recommendedOrder: [
      "Linux + networking → Docker",
      "CI/CD → Kubernetes",
      "IaC → monitoring",
      "Incident response practice"
    ],
    projects: ["Dockerize full-stack app", "K8s deploy with Helm", "CI/CD pipeline for Java API"],
    certifications: ["CKA", "AWS DevOps Engineer", "Terraform Associate"],
    interviewTopics: ["CI/CD design", "K8s troubleshooting", "IaC modules", "SLIs/SLOs"],
    stages: {
      beginner: stage("Beginner", ["Shell", "Git", "Docker images", "Networking basics"], [
        "Shell script automation task",
        "Multi-stage Dockerfile",
        "docker-compose local stack",
        "Debug container networking issue"
      ], ["Layers in Docker", "Ports vs volumes", "Git rebase vs merge"]),
      intermediate: stage("Intermediate", ["K8s workloads", "Helm", "CI pipelines"], [
        "Deploy app to minikube/kind",
        "Helm chart with values",
        "GitHub Actions build+test+push",
        "Rolling update rollout"
      ], ["Pods vs Deployments", "Liveness vs readiness", "Pipeline stages"]),
      advanced: stage("Advanced", ["Terraform", "Observability", "Security"], [
        "Terraform module for VPC+cluster",
        "Prometheus alerts + Grafana dashboard",
        "Secrets management integration",
        "Game day incident simulation"
      ], ["State backends", "HPA metrics", "RBAC in K8s"])
    }
  }),

  path({
    id: "cloud-engineer",
    title: "Cloud Engineer",
    timeline: "7–11 months",
    technologies: ["AWS or Azure", "VPC/VNet", "IAM", "S3/Blob", "EC2/VM", "RDS", "Load balancers", "CloudFormation/Terraform"],
    recommendedOrder: [
      "Cloud fundamentals → IAM",
      "Compute + storage → networking",
      "Managed databases → HA design",
      "Cost optimization + security"
    ],
    projects: ["Deploy RAG API on ECS/Cloud Run", "Multi-tier VPC architecture doc", "Disaster recovery runbook"],
    certifications: ["AWS Solutions Architect Associate", "AZ-104 Azure Administrator"],
    interviewTopics: ["Well-Architected pillars", "HA/DR", "IAM policies", "Cost allocation"],
    stages: {
      beginner: stage("Beginner", ["Cloud console", "IAM users/roles", "S3 basics", "EC2 launch"], [
        "Create least-privilege IAM role",
        "Static site on S3 + CloudFront",
        "Launch EC2 with security group",
        "Billing alarm setup"
      ], ["Shared responsibility model", "Regions/AZs", "Public vs private subnet"]),
      intermediate: stage("Intermediate", ["VPC design", "RDS", "ALB", "Auto scaling"], [
        "3-tier VPC diagram implemented",
        "RDS Multi-AZ database",
        "ALB + auto scaling group",
        "Backup and restore drill"
      ], ["NAT gateway purpose", "Security groups vs NACLs", "RDS failover"]),
      advanced: stage("Advanced", ["Multi-region", "IaC", "Security compliance"], [
        "CloudFormation/Terraform full stack",
        "Cross-region replication plan",
        "GuardDuty/Security Hub review",
        "Cost optimization report"
      ], ["RTO/RPO", "Landing zone", "Tagging strategy"])
    }
  }),

  path({
    id: "mlops-engineer",
    title: "MLOps Engineer",
    timeline: "8–12 months",
    technologies: ["Python", "Docker", "K8s", "MLflow", "Airflow", "Model serving", "Monitoring", "CI/CD for ML"],
    recommendedOrder: [
      "ML basics → experiment tracking",
      "Pipeline automation → model registry",
      "Serving + monitoring → retraining triggers"
    ],
    projects: ["ML Pipeline with MLflow", "Model serving on K8s", "Drift monitoring dashboard"],
    certifications: ["AWS ML Specialty", "Google MLOps on GCP"],
    interviewTopics: ["Train/serve skew", "Canary deployments", "Feature stores", "Model registry"],
    stages: {
      beginner: stage("Beginner", ["ML workflow", "Git", "Docker", "MLflow tracking"], [
        "Log experiments in MLflow",
        "Containerize training script",
        "Version dataset with DVC or tags",
        "Reproduce run from commit hash"
      ], ["Experiment vs model registry", "Artifact storage", "Reproducibility"]),
      intermediate: stage("Intermediate", ["Pipelines", "Model registry", "Batch inference"], [
        "Airflow/Prefect training pipeline",
        "Promote model to staging registry",
        "Batch inference job on schedule",
        "Automated tests on data schema"
      ], ["Pipeline orchestration", "Model stages", "Schema validation"]),
      advanced: stage("Advanced", ["Online serving", "Monitoring", "Automated retrain"], [
        "KServe/Seldon or FastAPI canary deploy",
        "Latency + drift dashboards",
        "Alert → retrain workflow",
        "Postmortem on failed deployment"
      ], ["Shadow deployment", "Data drift PSI", "Rollback strategy"])
    }
  })
];

export function getRoadmapById(id) {
  return CAREER_ROADMAPS.find((r) => r.id === id) || null;
}

/** Assessment questions — unlock intermediate/advanced per path (5 each, path-specific) */
export function getAssessmentQuestions(pathId, level) {
  const bank = ASSESSMENT_BANK[pathId]?.[level];
  return bank || [];
}

const ASSESSMENT_BANK = {};

function aq(q, opts, correct) {
  return { question: q, options: opts, correct };
}

function buildAssessments(pathId, intermediate, advanced) {
  ASSESSMENT_BANK[pathId] = { intermediate, advanced };
}

// AI Engineer
buildAssessments("ai-engineer", [
  aq("Best first step for private-doc Q&A?", ["Fine-tune 70B model day one", "RAG with embeddings + retrieval", "Only prompt engineering", "Ignore evaluation"], 1),
  aq("Embeddings are used to?", ["Compile Python", "Represent text as vectors for similarity", "Replace SQL", "Encrypt API keys"], 1),
  aq("Chunk overlap helps?", ["Reduce storage only", "Preserve context across chunk boundaries", "Eliminate need for vector DB", "Speed up training"], 1),
  aq("Production LLM apps need?", ["No logging", "Rate limits and observability", "Single giant prompt only", "Ignore cost"], 1),
  aq("RAG reduces hallucinations by?", ["Guessing faster", "Grounding answers in retrieved sources", "Removing citations", "Using higher temperature"], 1)
], [
  aq("Agent guardrails should include?", ["Unlimited tool loops", "Max iterations and human approval for risky tools", "No audit log", "Disable timeouts"], 1),
  aq("LLM cost control tactic?", ["Max tokens per request and caching", "Always use largest model", "No batching", "Ignore usage metrics"], 0),
  aq("Evaluating RAG quality often uses?", ["Only BLEU on random text", "Faithfulness/recall on golden Q&A set", "No test set", "UI color scheme"], 1),
  aq("Tracing in AI services helps?", ["Hide latency", "Debug retrieval and generation steps", "Remove metrics", "Skip errors"], 1),
  aq("Prompt injection defense?", ["Trust all document text blindly", "Separate instructions from untrusted content + filters", "Publish API keys", "Disable auth"], 1)
]);

// Java Full Stack
buildAssessments("java-full-stack", [
  aq("Spring preferred injection style?", ["Field injection only", "Constructor injection", "No injection", "Static methods only"], 1),
  aq("JPA @ManyToOne maps?", ["Many parents per child incorrectly", "Many entities to one parent FK", "Only many-to-many", "Replaces SQL"], 1),
  aq("React useEffect deps array empty means?", ["Run every render", "Run once after mount", "Never run", "Delete state"], 1),
  aq("REST idempotent method?", ["POST always", "PUT for replace", "PATCH always creates", "CONNECT for CRUD"], 1),
  aq("SQL INNER JOIN returns?", ["All left rows only", "Matching rows in both tables", "Only NULLs", "Duplicates only"], 1)
], [
  aq("JWT vs server session for SPA?", ["JWT can scale statelessly with short TTL", "Sessions never expire", "JWT never needs refresh", "Neither needs HTTPS"], 0),
  aq("Redis cache-aside pattern?", ["App loads cache on miss then DB", "DB writes cache only never read", "Delete all keys hourly always", "Skip TTL"], 0),
  aq("Microservice boundary by?", ["Random classes", "Business capability and team ownership", "One giant DB table", "No API contracts"], 1),
  aq("Testcontainers used for?", ["UI theming", "Integration tests with real DB in Docker", "Git hooks only", "CSS"], 1),
  aq("Global exception handler in Spring?", ["@ControllerAdvice", "@Autowired only", "@Entity", "@Table"], 0)
]);

// Backend Engineer
buildAssessments("backend-engineer", [
  aq("ACID 'I' stands for?", ["Isolation", "Integration", "Index", "Instance"], 0),
  aq("Idempotent POST alternative?", ["Use PUT with idempotency key", "Always duplicate", "Disable retries", "Delete DB"], 0),
  aq("429 status means?", ["OK", "Too Many Requests", "Not Found", "Created"], 1),
  aq("Connection pool sizing depends on?", ["Logo color", "DB max connections and app threads", "CSS", "Only CPU"], 1),
  aq("Message queue benefit?", ["Tight coupling", "Async decoupling of producers/consumers", "No durability", "Remove consumers"], 1)
], [
  aq("Cache stampede mitigation?", ["Lock or probabilistic early expiration", "Never cache", "Single thread global", "Ignore TTL"], 0),
  aq("SLO error budget means?", ["Unlimited downtime", "Allowed unreliability before stopping releases", "No metrics", "Delete alerts"], 1),
  aq("Backpressure strategy?", ["Unbounded queues always", "Drop/slow producers or queue limits", "Ignore consumer lag", "Infinite memory"], 1),
  aq("Horizontal scaling needs?", ["Shared nothing or externalized state", "Single server only", "No load balancer", "Sticky sessions always required"], 0),
  aq("Database index tradeoff?", ["Faster reads, slower writes", "Slower reads always", "No storage cost", "Removes joins"], 0)
]);

// Frontend Engineer
buildAssessments("frontend-engineer", [
  aq("Virtual DOM primary benefit?", ["Slower updates", "Efficient batched DOM updates via diffing", "No JS needed", "Replaces CSS"], 1),
  aq("Accessibility landmark roles help?", ["SEO only", "Screen reader navigation", "Remove keyboard", "Hide content"], 1),
  aq("CSS Grid best for?", ["2D layouts", "Only inline text", "Server routing", "SQL"], 0),
  aq("Fetch API returns promises for?", ["Sync file IO", "Async HTTP requests", "Database", "Docker"], 1),
  aq("Controlled input in React?", ["Value driven by state", "DOM only uncontrolled always", "No onChange", "Hidden field only"], 0)
], [
  aq("Code splitting reduces?", ["Initial bundle size", "Security", "HTML semantics", "Git size only"], 0),
  aq("LCP measures?", ["Largest Contentful Paint", "Lines of code", "Latency per CPU", "Login clicks"], 0),
  aq("useCallback used when?", ["Passing stable callbacks to memoized children", "Every variable", "Never in React", "Replace useState"], 0),
  aq("TypeScript benefit?", ["Catch type errors at compile time", "Slower runtime always", "No tooling", "Replace HTML"], 0),
  aq("SSR improves?", ["First paint and SEO for dynamic content", "Only client bundle", "Removes hydration", "Deletes CSS"], 0)
]);

// Machine Learning Engineer
buildAssessments("machine-learning-engineer", [
  aq("Overfitting sign?", ["Low train error, high test error", "High both", "Zero error always good", "No variance"], 0),
  aq("Cross-validation purpose?", ["Leak test data into train", "Estimate generalization", "Remove labels", "Speed training only"], 1),
  aq("Precision important when?", ["False positives costly", "False negatives only matter always", "No labels", "Random guess"], 0),
  aq("Feature leakage means?", ["Using future info in training features", "Normal EDA", "More data", "Lower LR"], 0),
  aq("ROC-AUC measures?", ["Disk usage", "Classifier rank quality across thresholds", "GPU temp", "API latency"], 1)
], [
  aq("Batch inference suits?", ["Large offline scoring jobs", "Only 1ms online always", "No storage", "Training only"], 0),
  aq("PSI detects?", ["Population drift in features", "CSS bugs", "Git conflicts", "HTTP 404"], 0),
  aq("Regularization helps?", ["Reduce overfitting", "Increase overfitting", "Remove validation", "Delete test set"], 0),
  aq("MLflow tracks?", ["Experiments, params, metrics, artifacts", "Only CSS", "Emails", "DNS"], 0),
  aq("Imbalanced data tactic?", ["Class weights or resampling", "Ignore minority", "Remove metrics", "Always accuracy only"], 0)
]);

// Generative AI Engineer
buildAssessments("generative-ai-engineer", [
  aq("Few-shot prompting provides?", ["Examples in prompt for pattern", "GPU drivers", "SQL indexes", "Docker layers"], 0),
  aq("json_object response format helps?", ["Structured parseable outputs", "Faster GPUs", "Delete tokens", "Remove auth"], 0),
  aq("Embedding similarity used in?", ["Retrieval", "CSS flex", "Git merge", "Cron only"], 0),
  aq("High temperature causes?", ["More random outputs", "Deterministic only", "Lower cost always", "No effect"], 0),
  aq("System prompt role?", ["Set behavior and constraints", "Store passwords", "Replace database", "Compile Java"], 0)
], [
  aq("Re-ranking after retrieval?", ["Improves top-k relevance", "Removes vectors", "Deletes corpus", "Disables LLM"], 0),
  aq("Tool loop cap prevents?", ["Runaway agent costs/errors", "All answers", "Logging", "Citations"], 0),
  aq("Prompt injection from docs?", ["Untrusted content can override instructions", "Impossible", "Only on Linux", "Only in dev"], 0),
  aq("Hybrid search combines?", ["Keyword + vector search", "Only random", "CSS only", "FTP"], 0),
  aq("Fallback model strategy?", ["Degrade to cheaper model on errors", "Never retry", "Expose keys", "Skip monitoring"], 0)
]);

// Data Engineer
buildAssessments("data-engineer", [
  aq("Star schema fact table holds?", ["Measurable events/metrics", "Only dimensions", "UI components", "Dockerfiles"], 0),
  aq("Parquet advantage?", ["Columnar compression efficient analytics", "Human readable only", "No schema", "Slower always"], 0),
  aq("Airflow DAG is?", ["Workflow of tasks with dependencies", "CSS library", "React hook", "JWT"], 0),
  aq("Idempotent ETL means?", ["Safe to rerun without duplicates", "Always deletes data", "No schedules", "Manual only"], 0),
  aq("Window function SQL?", ["Aggregates over ordered partitions", "Only JOIN", "Deletes tables", "Git command"], 0)
], [
  aq("Kafka consumer group enables?", ["Parallel scalable consumption", "Single reader only", "No offsets", "CSS grid"], 0),
  aq("Incremental dbt model?", ["Processes only new/changed rows", "Full scan always required", "No tests", "Removes warehouse"], 0),
  aq("Data quality test example?", ["Assert not-null on key columns", "Skip validation", "Hide errors", "Delete lineage"], 0),
  aq("Lakehouse combines?", ["Data lake storage + warehouse features", "Only spreadsheets", "Frontend routing", "SMTP"], 0),
  aq("PII masking in pipelines?", ["Protect sensitive fields in downstream", "Publish all emails", "Remove encryption", "Ignore GDPR"], 0)
]);

// DevOps Engineer
buildAssessments("devops-engineer", [
  aq("Docker image layer caching?", ["Speeds rebuilds when Dockerfile unchanged early", "Slows builds always", "Removes security", "Replaces K8s"], 0),
  aq("Readiness probe?", ["Traffic only when app ready", "Restart on any log", "Delete pod", "CSS check"], 0),
  aq("CI pipeline typical stages?", ["Build, test, artifact publish", "Only deploy prod", "No tests", "Manual only always"], 0),
  aq("Infrastructure as Code benefit?", ["Reproducible environments", "Secret in git plain", "No versioning", "Random drift"], 0),
  aq("Rolling update?", ["Gradual pod replacement", "Delete all at once always", "No versioning", "Only local"], 0)
], [
  aq("Terraform state stores?", ["Resource mapping metadata", "Only CSS", "User passwords plain", "React state"], 0),
  aq("Prometheus scrapes?", ["Metrics endpoints", "Only logs text", "HTML only", "Emails"], 0),
  aq("HPA scales on?", ["Metrics like CPU/custom", "Random", "Git commits only", "Color theme"], 0),
  aq("Secrets in K8s should use?", ["Secrets store/CSI not plain env in git", "Commit to GitHub", "Public ConfigMap", "No encryption"], 0),
  aq("SLO defines?", ["Target reliability level", "Salary only", "CSS breakpoint", "SQL dialect"], 0)
]);

// Cloud Engineer
buildAssessments("cloud-engineer", [
  aq("Availability Zone is?", ["Isolated DC within region", "Global DNS only", "IAM role", "S3 object"], 0),
  aq("IAM least privilege means?", ["Minimum permissions needed", "Admin always", "Public buckets", "No roles"], 0),
  aq("Public subnet typically has?", ["Route to internet gateway", "No routes", "Only private DB", "Offline only"], 0),
  aq("S3 durability model?", ["Designed for 11 9s durability", "Single disk only", "No redundancy", "Ephemeral only"], 0),
  aq("ALB operates at?", ["Layer 7 HTTP routing", "Layer 2 only", "DNS registrar", "Git"], 0)
], [
  aq("Multi-AZ RDS provides?", ["HA within region", "Global active-active always free", "No backups", "Removes subnets"], 0),
  aq("CloudFormation/Terraform for?", ["Declarative infra provisioning", "Frontend hooks", "ML training only", "Resume parsing"], 0),
  aq("RPO means?", ["Max acceptable data loss time", "CPU count", "CSS margin", "API key"], 0),
  aq("Cost allocation uses?", ["Tags on resources", "Random naming", "No billing", "Delete monitoring"], 0),
  aq("Shared responsibility: customer manages?", ["Data in cloud and OS config on IaaS", "Physical datacenter security only vendor", "Nothing", "Everything always vendor"], 0)
]);

// MLOps Engineer
buildAssessments("mlops-engineer", [
  aq("MLflow tracking logs?", ["Params, metrics, artifacts per run", "Only UI colors", "Git branches only", "DNS records"], 0),
  aq("Model registry stages?", ["Staging/production promotion", "Only delete", "No versioning", "CSS"], 0),
  aq("Train/serve skew caused by?", ["Different feature pipelines train vs prod", "More GPUs", "HTML", "FTP"], 0),
  aq("Containerizing training helps?", ["Reproducible environments", "Remove data versioning", "Skip tests", "No artifacts"], 0),
  aq("Batch scoring fits?", ["Large offline predictions", "Only 1 user online", "No storage", "Design docs only"], 0)
], [
  aq("Canary deployment?", ["Route small traffic to new model", "All users at once always", "No rollback", "Delete registry"], 0),
  aq("Data drift monitoring triggers?", ["Retrain or alert workflows", "Ignore metrics", "Remove validation", "Shut down API"], 0),
  aq("Feature store purpose?", ["Consistent online/offline features", "CSS themes", "Email only", "Replace Git"], 0),
  aq("KServe/Seldon used for?", ["Model serving on K8s", "SQL only", "Resume ATS", "Linux kernel"], 0),
  aq("Shadow deployment?", ["Compare new model without user impact", "Public prod only", "No metrics", "Remove auth"], 0)
]);

export { ASSESSMENT_BANK };
