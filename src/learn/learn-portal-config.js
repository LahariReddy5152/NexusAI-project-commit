/**
 * Per-technology dedicated portal navigation — Priority 2
 * Each path has its own explicit nav array (no shared buildPortal tail).
 */

function slug(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function tab(id, label, type, extra = {}) {
  return { id, label, type, ...extra };
}

function topic(label) {
  return tab(slug(label), label, "topic", { topicTitle: label });
}

/** @type {Record<string, Array<{id:string,label:string,type:string,topicTitle?:string}>>} */
export const PORTAL_NAV_BY_ID = {
  "python-fundamentals": [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Variables"),
    topic("Data Types"),
    topic("Operators"),
    topic("Conditions"),
    topic("Loops"),
    topic("Functions"),
    topic("Collections"),
    topic("OOP"),
    topic("Exception Handling"),
    topic("File Handling"),
    topic("Modules"),
    topic("Decorators"),
    topic("Generators"),
    topic("Async Programming"),
    topic("FastAPI"),
    tab("projects", "Projects", "projects"),
    tab("assignments", "Assignments", "assignments"),
    tab("quiz", "Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("notes", "Notes", "notes"),
    tab("resources", "Resources", "resources"),
    tab("progress", "Progress", "progress"),
    tab("certificate", "Certificate", "certificate")
  ],

  "python-intermediate": [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("OOP"),
    topic("Collections"),
    topic("Lists"),
    topic("Dictionaries"),
    topic("Exception Handling"),
    topic("File Handling"),
    topic("Modules"),
    tab("projects", "Projects", "projects"),
    tab("assignments", "Assignments", "assignments"),
    tab("quiz", "Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  "java-fundamentals": [
    topic("Core Java"),
    topic("OOP"),
    topic("Collections"),
    topic("Streams"),
    topic("Multithreading"),
    topic("JDBC"),
    topic("JVM"),
    topic("Exception Handling"),
    topic("File Handling"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("projects", "Projects", "projects"),
    tab("resources", "Resources", "resources")
  ],

  sql: [
    topic("SQL Fundamentals"),
    topic("Joins"),
    topic("Subqueries"),
    topic("Indexes"),
    topic("Views"),
    topic("Stored Procedures"),
    topic("Triggers"),
    topic("Optimization"),
    topic("PostgreSQL"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("projects", "Projects", "projects")
  ],

  "advanced-python": [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Decorators"),
    topic("Context Managers"),
    topic("Generators"),
    topic("Async IO"),
    topic("Type Hints"),
    topic("Testing"),
    topic("Packaging"),
    topic("FastAPI Advanced"),
    topic("Performance"),
    topic("Metaclasses"),
    tab("projects", "Projects", "projects"),
    tab("assignments", "Assignments", "assignments"),
    tab("quiz", "Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  html: [
    tab("overview", "Overview", "overview"),
    topic("Document Structure"),
    topic("Semantic HTML"),
    topic("Forms & Inputs"),
    topic("Media Elements"),
    topic("Accessibility"),
    topic("SEO Markup"),
    tab("projects", "Mini Projects", "projects"),
    tab("quiz", "HTML Quiz", "quiz"),
    tab("resources", "Resources", "resources")
  ],

  css: [
    tab("overview", "Overview", "overview"),
    topic("Selectors"),
    topic("Box Model"),
    topic("Flexbox"),
    topic("CSS Grid"),
    topic("Animations"),
    topic("Responsive Design"),
    topic("CSS Variables"),
    tab("projects", "Layout Projects", "projects"),
    tab("interview-questions", "CSS Interview", "interview"),
    tab("resources", "Resources", "resources")
  ],

  javascript: [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Variables & Scope"),
    topic("Functions"),
    topic("DOM Manipulation"),
    topic("ES6+ Features"),
    topic("Async/Await"),
    topic("Modules"),
    topic("Events"),
    topic("Fetch API"),
    tab("projects", "JS Projects", "projects"),
    tab("quiz", "JavaScript Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  typescript: [
    tab("overview", "Overview", "overview"),
    topic("Basic Types"),
    topic("Interfaces"),
    topic("Generics"),
    topic("Utility Types"),
    topic("TS with React"),
    topic("Strict Mode"),
    topic("Declaration Files"),
    tab("projects", "TS Projects", "projects"),
    tab("quiz", "TypeScript Quiz", "quiz"),
    tab("resources", "Resources", "resources")
  ],

  react: [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Components"),
    topic("JSX"),
    topic("Props & State"),
    topic("Hooks"),
    topic("Context API"),
    topic("React Router"),
    topic("Forms"),
    topic("Performance"),
    topic("Testing React"),
    topic("State Management"),
    tab("projects", "React Projects", "projects"),
    tab("assignments", "Assignments", "assignments"),
    tab("quiz", "React Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  "spring-boot": [
    tab("overview", "Overview", "overview"),
    topic("Spring Boot Setup"),
    topic("REST Controllers"),
    topic("Dependency Injection"),
    topic("JPA Integration"),
    topic("Spring Security"),
    topic("Testing"),
    topic("Actuator"),
    topic("Configuration"),
    tab("projects", "Spring Projects", "projects"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("resources", "Resources", "resources")
  ],

  hibernate: [
    tab("overview", "Overview", "overview"),
    topic("ORM Basics"),
    topic("Entities"),
    topic("Relationships"),
    topic("HQL"),
    topic("Caching"),
    topic("Transactions"),
    topic("Performance Tuning"),
    tab("projects", "Hibernate Projects", "projects"),
    tab("resources", "Resources", "resources")
  ],

  jpa: [
    tab("overview", "Overview", "overview"),
    topic("Entity Mapping"),
    topic("Repositories"),
    topic("JPQL Queries"),
    topic("Relationships"),
    topic("Pagination"),
    topic("Auditing"),
    tab("projects", "JPA Projects", "projects"),
    tab("quiz", "JPA Quiz", "quiz"),
    tab("resources", "Resources", "resources")
  ],

  "rest-apis": [
    tab("overview", "Overview", "overview"),
    topic("HTTP Methods"),
    topic("Status Codes"),
    topic("REST Design"),
    topic("Authentication"),
    topic("JWT"),
    topic("Versioning"),
    topic("Error Handling"),
    topic("API Documentation"),
    tab("projects", "API Projects", "projects"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  node: [
    tab("overview", "Overview", "overview"),
    topic("Node Runtime"),
    topic("NPM & Modules"),
    topic("File System"),
    topic("Events & Streams"),
    topic("HTTP Server"),
    topic("Environment Config"),
    tab("projects", "Node Projects", "projects"),
    tab("quiz", "Node Quiz", "quiz"),
    tab("resources", "Resources", "resources")
  ],

  express: [
    tab("overview", "Overview", "overview"),
    topic("Express Setup"),
    topic("Routing"),
    topic("Middleware"),
    topic("REST Endpoints"),
    topic("Error Handling"),
    topic("Authentication"),
    tab("projects", "Express APIs", "projects"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  microservices: [
    tab("overview", "Overview", "overview"),
    topic("Service Design"),
    topic("API Gateway"),
    topic("Service Discovery"),
    topic("Resilience Patterns"),
    topic("Observability"),
    topic("Event-Driven"),
    topic("Saga Pattern"),
    tab("projects", "Microservice Projects", "projects"),
    tab("interview-questions", "System Design Q&A", "interview")
  ],

  postgresql: [
    tab("overview", "Overview", "overview"),
    topic("PostgreSQL Setup"),
    topic("Data Types"),
    topic("Advanced Queries"),
    topic("JSONB"),
    topic("Indexing"),
    topic("Replication"),
    tab("projects", "PostgreSQL Projects", "projects"),
    tab("resources", "Resources", "resources")
  ],

  mongodb: [
    tab("overview", "Overview", "overview"),
    topic("Documents"),
    topic("CRUD Operations"),
    topic("Aggregation"),
    topic("Indexing"),
    topic("Schema Design"),
    topic("Atlas"),
    tab("projects", "MongoDB Projects", "projects"),
    tab("quiz", "MongoDB Quiz", "quiz")
  ],

  redis: [
    tab("overview", "Overview", "overview"),
    topic("Redis Data Types"),
    topic("Caching Patterns"),
    topic("Pub/Sub"),
    topic("Persistence"),
    topic("TTL & Expiry"),
    topic("Production Redis"),
    tab("projects", "Redis Labs", "projects"),
    tab("resources", "Resources", "resources")
  ],

  docker: [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Images"),
    topic("Containers"),
    topic("Dockerfile"),
    topic("Docker Compose"),
    topic("Volumes"),
    topic("Networking"),
    topic("Multi-stage Builds"),
    topic("Registry & Security"),
    tab("projects", "Docker Projects", "projects"),
    tab("quiz", "Docker Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  kubernetes: [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Pods"),
    topic("Deployments"),
    topic("Services"),
    topic("ConfigMaps & Secrets"),
    topic("Ingress"),
    topic("Helm"),
    topic("HPA"),
    topic("Observability"),
    tab("projects", "K8s Projects", "projects"),
    tab("quiz", "Kubernetes Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  aws: [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("IAM"),
    topic("EC2"),
    topic("S3"),
    topic("Lambda"),
    topic("RDS"),
    topic("VPC"),
    topic("ECS"),
    topic("CloudWatch"),
    topic("API Gateway"),
    tab("projects", "AWS Projects", "projects"),
    tab("quiz", "AWS Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  "azure-basics": [
    tab("overview", "Overview", "overview"),
    topic("Azure Portal"),
    topic("Virtual Machines"),
    topic("Blob Storage"),
    topic("Azure Functions"),
    topic("Azure SQL"),
    topic("AKS Intro"),
    tab("projects", "Azure Projects", "projects"),
    tab("resources", "Resources", "resources")
  ],

  "git-github": [
    tab("overview", "Overview", "overview"),
    topic("Git Basics"),
    topic("Branching"),
    topic("Pull Requests"),
    topic("Merge Conflicts"),
    topic("GitHub Actions"),
    topic("Code Review"),
    tab("projects", "Workflow Projects", "projects"),
    tab("quiz", "Git Quiz", "quiz")
  ],

  linux: [
    tab("overview", "Overview", "overview"),
    topic("Shell Basics"),
    topic("File Permissions"),
    topic("Processes"),
    topic("Networking"),
    topic("Cron & Scheduling"),
    topic("systemd & Logs"),
    tab("projects", "Linux Labs", "projects"),
    tab("interview-questions", "Linux Interview", "interview")
  ],

  cicd: [
    tab("overview", "Overview", "overview"),
    topic("CI Concepts"),
    topic("CD Pipelines"),
    topic("GitHub Actions"),
    topic("Jenkins"),
    topic("Testing Gates"),
    topic("Blue-Green Deploy"),
    tab("projects", "Pipeline Projects", "projects"),
    tab("resources", "Resources", "resources")
  ],

  "system-design": [
    tab("overview", "Overview", "overview"),
    topic("Requirements Gathering"),
    topic("Scalability"),
    topic("Databases"),
    topic("Caching"),
    topic("Load Balancing"),
    topic("CAP Theorem"),
    topic("API Design"),
    tab("projects", "Design Case Studies", "projects"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  "data-structures": [
    tab("overview", "Overview", "overview"),
    topic("Arrays"),
    topic("Linked Lists"),
    topic("Stacks & Queues"),
    topic("Trees"),
    topic("Graphs"),
    topic("Hash Tables"),
    topic("Heaps"),
    tab("projects", "DSA Projects", "projects"),
    tab("quiz", "DSA Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  algorithms: [
    tab("overview", "Overview", "overview"),
    topic("Big O Notation"),
    topic("Sorting"),
    topic("Searching"),
    topic("Recursion"),
    topic("Dynamic Programming"),
    topic("Graph Algorithms"),
    tab("projects", "Algorithm Labs", "projects"),
    tab("quiz", "Algorithms Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  "apache-kafka": [
    tab("overview", "Overview", "overview"),
    topic("Topics & Partitions"),
    topic("Producers"),
    topic("Consumers"),
    topic("Kafka Streams"),
    topic("Schema Registry"),
    topic("Exactly-Once"),
    tab("projects", "Kafka Projects", "projects"),
    tab("resources", "Resources", "resources")
  ],

  "ai-fundamentals": [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("ML Foundations"),
    topic("Neural Networks"),
    topic("LLMs"),
    topic("Embeddings"),
    topic("RAG Overview"),
    topic("Fine-tuning"),
    topic("Evaluation"),
    topic("MLOps"),
    topic("Responsible AI"),
    tab("projects", "AI Projects", "projects"),
    tab("quiz", "AI Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  "machine-learning": [
    tab("overview", "Overview", "overview"),
    topic("Supervised Learning"),
    topic("Unsupervised Learning"),
    topic("Feature Engineering"),
    topic("Model Evaluation"),
    topic("Cross Validation"),
    topic("Scikit-learn"),
    topic("Hyperparameter Tuning"),
    tab("projects", "ML Projects", "projects"),
    tab("quiz", "ML Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  "deep-learning": [
    tab("overview", "Overview", "overview"),
    topic("Neural Networks"),
    topic("Backpropagation"),
    topic("CNNs"),
    topic("RNNs"),
    topic("Transformers"),
    topic("Transfer Learning"),
    topic("PyTorch"),
    tab("projects", "Deep Learning Projects", "projects"),
    tab("quiz", "DL Quiz", "quiz"),
    tab("resources", "Resources", "resources")
  ],

  "prompt-engineering": [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Prompt Basics"),
    topic("Few-shot Prompting"),
    topic("Chain of Thought"),
    topic("Role Prompting"),
    topic("System Prompts"),
    topic("RAG Prompting"),
    topic("Agent Prompting"),
    topic("Structured Output"),
    tab("projects", "Prompt Projects", "projects"),
    tab("quiz", "Prompt Quiz", "quiz"),
    tab("progress", "Progress", "progress")
  ],

  llms: [
    tab("overview", "Overview", "overview"),
    topic("Transformer Architecture"),
    topic("Tokenization"),
    topic("Context Windows"),
    topic("Fine-tuning vs RAG"),
    topic("Inference"),
    topic("Model Selection"),
    tab("projects", "LLM Projects", "projects"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("resources", "Resources", "resources")
  ],

  "openai-apis": [
    tab("overview", "Overview", "overview"),
    topic("Chat Completions"),
    topic("Embeddings API"),
    topic("Function Calling"),
    topic("Streaming"),
    topic("Rate Limits"),
    topic("Batch API"),
    tab("projects", "OpenAI Projects", "projects"),
    tab("quiz", "API Quiz", "quiz")
  ],

  "rag-systems": [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Document Chunking"),
    topic("Embeddings"),
    topic("Retrieval"),
    topic("Re-ranking"),
    topic("Grounded Generation"),
    topic("Hybrid Search"),
    topic("Evaluation"),
    topic("Pipeline Architecture"),
    tab("projects", "RAG Projects", "projects"),
    tab("quiz", "RAG Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  langchain: [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Chains"),
    topic("Agents"),
    topic("Tools"),
    topic("Memory"),
    topic("Document Loaders"),
    topic("LCEL"),
    topic("RAG Integration"),
    topic("Production Patterns"),
    tab("projects", "LangChain Projects", "projects"),
    tab("quiz", "LangChain Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  embeddings: [
    tab("overview", "Overview", "overview"),
    topic("Word Embeddings"),
    topic("Sentence Embeddings"),
    topic("Similarity Search"),
    topic("OpenAI Embeddings"),
    topic("Batch Processing"),
    topic("Clustering"),
    tab("projects", "Embedding Projects", "projects"),
    tab("quiz", "Embeddings Quiz", "quiz"),
    tab("resources", "Resources", "resources")
  ],

  "vector-databases": [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("Vector Search"),
    topic("Indexing Strategies"),
    topic("Metadata Filtering"),
    topic("pgvector"),
    topic("Pinecone"),
    topic("Weaviate"),
    topic("Chroma"),
    topic("Hybrid Search"),
    tab("projects", "Vector DB Projects", "projects"),
    tab("quiz", "Vector DB Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  "ai-agents": [
    tab("overview", "Overview", "overview"),
    topic("ReAct Pattern"),
    topic("Tool Use"),
    topic("Multi-agent Systems"),
    topic("Planning"),
    topic("Memory"),
    topic("Guardrails"),
    tab("projects", "Agent Projects", "projects"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("resources", "Resources", "resources")
  ],

  mcp: [
    tab("overview", "Overview", "overview"),
    tab("roadmap", "Roadmap", "roadmap"),
    topic("MCP Protocol"),
    topic("Context Servers"),
    topic("Tool Registration"),
    topic("Security"),
    topic("Client Integration"),
    topic("Transports"),
    topic("Best Practices"),
    tab("projects", "MCP Projects", "projects"),
    tab("quiz", "MCP Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("progress", "Progress", "progress")
  ],

  "ai-deployment": [
    tab("overview", "Overview", "overview"),
    topic("Model Serving"),
    topic("API Gateway"),
    topic("Monitoring"),
    topic("A/B Testing"),
    topic("Latency Optimization"),
    topic("vLLM"),
    tab("projects", "Deployment Projects", "projects"),
    tab("resources", "Resources", "resources")
  ],

  "advanced-java": [
    tab("overview", "Overview", "overview"),
    topic("Streams API"),
    topic("Lambdas"),
    topic("Concurrency"),
    topic("JVM Tuning"),
    topic("Design Patterns"),
    topic("Reactive Java"),
    tab("projects", "Advanced Java Projects", "projects"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  "advanced-javascript": [
    tab("overview", "Overview", "overview"),
    topic("Closures"),
    topic("Prototypes"),
    topic("Event Loop"),
    topic("Functional JS"),
    topic("Performance"),
    topic("Webpack"),
    tab("projects", "Advanced JS Projects", "projects"),
    tab("quiz", "Advanced JS Quiz", "quiz"),
    tab("interview-questions", "Interview Questions", "interview")
  ],

  "spring-security": [
    tab("overview", "Overview", "overview"),
    topic("Authentication"),
    topic("Authorization"),
    topic("JWT"),
    topic("OAuth2"),
    topic("CSRF Protection"),
    topic("Method Security"),
    tab("projects", "Security Projects", "projects"),
    tab("interview-questions", "Interview Questions", "interview"),
    tab("resources", "Resources", "resources")
  ]
};

export function getPortalNav(pathId) {
  return PORTAL_NAV_BY_ID[pathId] ? [...PORTAL_NAV_BY_ID[pathId]] : [];
}

export function getPortalTopicTitles(pathId) {
  return getPortalNav(pathId)
    .filter((item) => item.type === "topic")
    .map((item) => item.topicTitle || item.label);
}

export function findLessonIndexByTopic(curriculum, topicTitle) {
  const t = topicTitle.toLowerCase();
  const aliases = {
    "core java": ["java basics", "core java", "variables"],
    oop: ["oop", "object-oriented"],
    collections: ["collections", "lists", "tuples", "dictionaries", "sets"],
    "async programming": ["async python", "async programming", "async io"],
    modules: ["modules", "packages", "import"],
    "sql fundamentals": ["select", "sql fundamentals", "where"],
    postgresql: ["postgresql", "postgres"],
    jvm: ["jvm", "jvm overview", "jvm basics"],
    modules: ["modules", "packages"],
    streams: ["streams", "streams api", "streams intro"]
  };
  const search = [t, ...(aliases[t] || [])];

  for (const key of search) {
    let idx = curriculum.findIndex((l) => l.title.toLowerCase() === key);
    if (idx >= 0) return idx;
    idx = curriculum.findIndex(
      (l) => l.title.toLowerCase().includes(key) || key.includes(l.title.toLowerCase())
    );
    if (idx >= 0) return idx;
  }
  return -1;
}
