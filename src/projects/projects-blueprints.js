/** Priority 4 — full project blueprints (core + live) */
import { buildProject } from "./project-builder.js";

export const CORE_PROJECT_NAMES = [
  "AI Resume Analyzer",
  "Smart Expense Tracker",
  "Employee Management System",
  "AI Interview Coach",
  "RAG Chatbot",
  "OpenAI Document Assistant",
  "Job Tracker",
  "AI Learning Platform"
];

export const LIVE_PROJECT_NAMES = [
  "LLM Science Exam",
  "AI Math Olympiad",
  "Open LLM Leaderboard",
  "Agentic RAG"
];

const CORE_BLUEPRINTS = {
  "AI Resume Analyzer": buildProject({
    level: "Intermediate",
    overview:
      "Production-grade resume analysis platform that scores ATS compatibility, extracts skills, and generates role-specific improvement plans using NLP and optional LLM critique.",
    businessProblem:
      "Candidates submit hundreds of resumes with inconsistent formatting and keyword gaps; recruiters miss qualified applicants because ATS filters reject 75% of resumes before human review.",
    requirements: [
      "Parse PDF and plain-text resumes",
      "Compute ATS match score against job descriptions",
      "Highlight missing skills and weak sections",
      "Export improvement report as PDF",
      "Track score history per user"
    ],
    functionalRequirements: [
      "Upload resume (PDF/DOCX/TXT) with size validation",
      "Paste job description and run keyword overlap analysis",
      "Display section scores: contact, experience, skills, education",
      "LLM-powered rewrite suggestions for bullet points",
      "Save analysis runs with timestamps"
    ],
    nonFunctionalRequirements: [
      "P95 analysis latency under 8 seconds for 2-page resumes",
      "PII encrypted at rest (AES-256)",
      "GDPR-compliant data deletion within 30 days",
      "99.5% uptime for API tier",
      "Support 500 concurrent analyses on single API node"
    ],
    architectureDiagram: `┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ React SPA   │────▶│ API Gateway  │────▶│ Resume Service  │
│ Upload UI   │     │ JWT + Rate   │     │ Parse + Score   │
└─────────────┘     └──────┬───────┘     └────────┬────────┘
                           │                       │
                    ┌──────▼───────┐        ┌──────▼────────┐
                    │ Auth Service │        │ LLM Critique    │
                    │ OAuth2/JWT   │        │ (OpenAI API)    │
                    └──────────────┘        └─────────────────┘
                           │                       │
                    ┌──────▼───────────────────────▼────────┐
                    │ PostgreSQL (users, analyses, scores) │
                    └──────────────────────────────────────┘`,
    flowDiagram: `User uploads resume
      │
      ▼
Extract text (pdfplumber / mammoth)
      │
      ▼
Tokenize sections → skills NER → keyword match vs JD
      │
      ▼
Compute ATS score (0–100) + gap list
      │
      ▼
Optional LLM critique → structured JSON suggestions
      │
      ▼
Persist analysis → render dashboard + PDF export`,
    folderStructure: `ai-resume-analyzer/
├── frontend/                 # React + Vite
│   ├── src/components/       # UploadPanel, ScoreCard, GapList
│   └── src/api/              # Typed API client
├── backend/
│   ├── app/main.py           # FastAPI entry
│   ├── parsers/              # pdf, docx, text
│   ├── scoring/              # ATS heuristics + weights
│   ├── llm/                  # critique prompts
│   └── models/               # SQLAlchemy schemas
├── migrations/               # Alembic
├── tests/                    # unit + integration
└── docker-compose.yml`,
    frontendDesign:
      "Three-column layout: upload zone (drag-drop), live score gauge with section breakdown, and actionable gap cards. Dark/light theme. Mobile: stacked cards with sticky score header.",
    backendDesign:
      "FastAPI async endpoints; Celery worker for heavy PDF parsing; Redis cache for repeated JD keyword sets; structured Pydantic responses for all analysis payloads.",
    databaseDesign:
      "users(id, email, password_hash); resumes(id, user_id, raw_text, file_hash); job_descriptions(id, user_id, text); analyses(id, resume_id, jd_id, score, gaps_json, created_at); api_keys for service accounts.",
    apiSpecifications: `POST /api/v1/auth/register — create account
POST /api/v1/auth/login — JWT access + refresh
POST /api/v1/resumes — multipart upload, returns resume_id
POST /api/v1/analyses — body: { resume_id, jd_text } → { score, sections[], gaps[] }
GET  /api/v1/analyses/{id} — full report with LLM suggestions
GET  /api/v1/analyses — paginated history
DELETE /api/v1/users/me — GDPR erase`,
    authenticationAuthorization:
      "JWT access (15 min) + refresh (7 days) in HttpOnly cookies; RBAC roles: user, admin; analyses scoped to owner user_id; admin can view aggregate metrics only.",
    deploymentStrategy:
      "Docker Compose locally; production: frontend on Vercel/CloudFront, API on ECS Fargate with auto-scaling on CPU; RDS PostgreSQL Multi-AZ; secrets in AWS Secrets Manager.",
    testingStrategy:
      "Unit: parser fixtures for 20 resume samples; scoring regression suite with golden scores ±2; integration: full upload→analyze flow; contract tests for OpenAPI schema.",
    cicdStrategy:
      "GitHub Actions: lint (ruff, eslint) → unit tests → build images → deploy staging on main merge → manual promote to prod with smoke tests.",
    monitoringLogging:
      "Structured JSON logs with request_id; Prometheus metrics (latency_histogram, analysis_score_distribution); Sentry for exceptions; CloudWatch alarms on 5xx > 1%.",
    interviewQuestions: [
      "How do you prevent resume PII from leaking into LLM training logs?",
      "What signals beyond keywords improve ATS scoring accuracy?",
      "How would you A/B test scoring algorithm changes?"
    ],
    implementation: [
      "Scaffold FastAPI + React monorepo",
      "Implement PDF text extraction with fallback OCR",
      "Build weighted ATS scoring engine",
      "Add OpenAI critique with JSON schema output",
      "Wire auth, persistence, and PDF export"
    ]
  }),

  "Smart Expense Tracker": buildProject({
    level: "Beginner",
    overview:
      "Personal finance app for logging expenses, categorizing spend with ML-assisted labels, budgeting by category, and monthly insight reports.",
    businessProblem:
      "Households lose visibility into discretionary spending; manual spreadsheets are abandoned within weeks because categorization is tedious.",
    requirements: [
      "CRUD expenses with amount, date, category, merchant",
      "Monthly budgets per category with alerts",
      "Charts: spend by category, trend over time",
      "Receipt photo upload (optional OCR)",
      "Export CSV for tax season"
    ],
    functionalRequirements: [
      "User registers and creates budget profiles",
      "Add expense via form or quick-add widget",
      "Auto-suggest category from merchant name",
      "Dashboard shows burn rate vs budget",
      "Email/push alert at 80% and 100% budget"
    ],
    nonFunctionalRequirements: [
      "Page load under 2s on 3G",
      "Offline-first mobile PWA with sync",
      "Decimal precision for currency (no float errors)",
      "WCAG 2.1 AA for forms and charts"
    ],
    architectureDiagram: `┌──────────────┐    ┌─────────────┐    ┌──────────────────┐
│ PWA Client   │───▶│ REST API    │───▶│ Expense Service  │
│ React + SW   │    │ Spring Boot │    │ Budget Engine    │
└──────────────┘    └──────┬──────┘    └────────┬─────────┘
                           │                     │
                    ┌──────▼──────┐       ┌──────▼─────────┐
                    │ Auth (JWT)  │       │ Category ML    │
                    └─────────────┘       │ (optional)     │
                                          └────────────────┘
                           │
                    ┌──────▼──────────────────────────┐
                    │ PostgreSQL + Redis cache        │
                    └─────────────────────────────────┘`,
    flowDiagram: `User logs expense (amount, merchant)
      │
      ▼
Validate + persist → update category aggregates
      │
      ▼
Check budget thresholds → trigger alert if exceeded
      │
      ▼
Refresh dashboard charts (cached 60s)
      │
      ▼
End-of-month rollup → insight report`,
    folderStructure: `smart-expense-tracker/
├── client/                   # React PWA
├── server/                   # Spring Boot 3
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── domain/
├── db/migrations/
└── tests/`,
    frontendDesign:
      "Bottom nav: Dashboard, Add, Budgets, Reports. FAB for quick expense. Chart.js donut for categories; line chart for 6-month trend. Color-coded budget bars (green/amber/red).",
    backendDesign:
      "Spring Boot layered architecture; @Transactional expense writes; scheduled job for monthly rollups; WebSocket optional for live dashboard updates.",
    databaseDesign:
      "users; categories(id, name, icon); budgets(user_id, category_id, monthly_limit); expenses(id, user_id, amount_cents, category_id, merchant, spent_at); alerts(id, budget_id, threshold_pct, sent_at).",
    apiSpecifications: `POST /api/auth/signup
POST /api/auth/login
GET  /api/expenses?from=&to=&category=
POST /api/expenses — { amount, merchant, categoryId, date }
PUT  /api/expenses/{id}
DELETE /api/expenses/{id}
GET  /api/budgets
PUT  /api/budgets/{categoryId} — { monthlyLimit }
GET  /api/reports/monthly?year=&month=
GET  /api/export/csv?year=`,
    authenticationAuthorization:
      "JWT bearer; users access only their expenses; shared household accounts via invite link with read-only or edit role.",
    deploymentStrategy:
      "Frontend: Netlify; Backend: Railway or Render; PostgreSQL managed instance; Redis for session cache.",
    testingStrategy:
      "JUnit service tests with Testcontainers Postgres; API tests with MockMvc; frontend Vitest for budget calculation helpers.",
    cicdStrategy:
      "GitHub Actions: mvn test → docker build → deploy on tag v*.*.*",
    monitoringLogging:
      "Spring Actuator /health, /metrics; Logback JSON; UptimeRobot external ping.",
    interviewQuestions: [
      "Why store money as integer cents instead of float?",
      "How do you handle timezone boundaries for daily spend totals?",
      "Design idempotent expense sync from offline PWA."
    ],
    implementation: [
      "Create Spring Boot project with JPA entities",
      "Build React dashboard with Chart.js",
      "Implement budget alert job",
      "Add CSV export and PWA manifest"
    ]
  }),

  "Employee Management System": buildProject({
    level: "Intermediate",
    overview:
      "HR portal for employee records, department hierarchy, leave requests, and manager approval workflows with audit trails.",
    businessProblem:
      "Mid-size companies track employees in spreadsheets; leave conflicts, stale org charts, and compliance gaps create payroll errors and audit risk.",
    requirements: [
      "Employee CRUD with department assignment",
      "Manager hierarchy and approval chains",
      "Leave request workflow (pending/approved/rejected)",
      "Role-based access (HR, Manager, Employee)",
      "Audit log for sensitive changes"
    ],
    functionalRequirements: [
      "HR admin imports employees via CSV",
      "Employee submits leave with date range and type",
      "Manager receives notification and approves/rejects",
      "Org chart view by department",
      "Search employees by name, skill, department"
    ],
    nonFunctionalRequirements: [
      "SOC2-friendly audit logging",
      "Session timeout 30 minutes",
      "Support 10,000 employee records",
      "Backup daily with 30-day retention"
    ],
    architectureDiagram: `┌────────────┐   ┌───────────────┐   ┌────────────────────┐
│ Admin UI   │──▶│ API Layer     │──▶│ Employee Service   │
│ Manager UI │   │ Spring Security│   │ Leave Workflow     │
└────────────┘   └───────┬───────┘   └─────────┬──────────┘
                         │                     │
                  ┌──────▼──────┐       ┌──────▼──────────┐
                  │ Notification│       │ Audit Service   │
                  │ Email/Queue │       │ immutable log   │
                  └─────────────┘       └─────────────────┘
                         │
                  ┌──────▼────────────────────────────┐
                  │ PostgreSQL (employees, leaves)   │
                  └─────────────────────────────────┘`,
    flowDiagram: `Employee submits leave request
      │
      ▼
Validate balance + overlapping dates
      │
      ▼
Route to manager (workflow state: PENDING)
      │
      ▼
Manager approves → deduct leave balance → notify HR
      │
      ▼
Audit entry written → calendar updated`,
    folderStructure: `employee-management/
├── frontend/                 # React admin + employee portals
├── backend/
│   ├── employee/
│   ├── leave/
│   ├── workflow/
│   └── audit/
├── docker/
└── tests/e2e/`,
    frontendDesign:
      "HR dashboard: employee table with filters, bulk actions. Employee self-service: profile, leave calendar, request form. Manager inbox: pending approvals queue.",
    backendDesign:
      "Spring Boot + Spring State Machine for leave workflow; domain events for notifications; separate read models for org chart queries.",
    databaseDesign:
      "employees(id, name, email, dept_id, manager_id, hire_date); departments; leave_balances(employee_id, type, days); leave_requests(id, status, from_date, to_date); audit_log(entity, action, actor, payload, ts).",
    apiSpecifications: `GET  /api/employees?page=&q=
POST /api/employees
PUT  /api/employees/{id}
GET  /api/org-chart
POST /api/leave-requests
PATCH /api/leave-requests/{id}/approve
PATCH /api/leave-requests/{id}/reject
GET  /api/audit?entityType=&from=`,
    authenticationAuthorization:
      "Spring Security RBAC: ROLE_HR, ROLE_MANAGER, ROLE_EMPLOYEE; managers see direct reports only; HR sees all; field-level mask on salary fields.",
    deploymentStrategy:
      "On-prem Docker or AWS ECS; RDS PostgreSQL; SES for email notifications.",
    testingStrategy:
      "Workflow integration tests for approve/reject paths; security tests for horizontal privilege escalation; load test org-chart query.",
    cicdStrategy:
      "Jenkins or GitHub Actions: test → SonarQube gate → deploy to staging → HR UAT sign-off.",
    monitoringLogging:
      "Audit log shipped to SIEM; Actuator metrics; alert on failed login spikes.",
    interviewQuestions: [
      "How do you model manager hierarchy changes without breaking pending approvals?",
      "Design multi-level approval for extended leave.",
      "How would you implement GDPR right-to-erasure for ex-employees?"
    ],
    implementation: [
      "Model employees and departments in JPA",
      "Implement leave state machine",
      "Build manager approval UI",
      "Add audit interceptor on sensitive endpoints"
    ]
  }),

  "AI Interview Coach": buildProject({
    level: "Advanced",
    overview:
      "Mock interview platform with track-based question banks (Python, Java, System Design, AI), timed answers, rubric scoring, and LLM-enhanced feedback.",
    businessProblem:
      "Candidates practice interviews alone without structured feedback; generic question lists do not match role level or weak skill areas.",
    requirements: [
      "Tracks: Python, Java, SQL, System Design, AI/ML",
      "Timed mock sessions with 5–10 questions",
      "Rubric scoring: clarity, depth, tradeoffs, examples",
      "Session history and improvement trends",
      "Optional voice-to-text answer capture"
    ],
    functionalRequirements: [
      "User selects track and difficulty",
      "Display question with countdown timer",
      "Submit answer → instant rubric + LLM narrative feedback",
      "Dashboard: scores over time, weakest topics",
      "Shareable session summary PDF"
    ],
    nonFunctionalRequirements: [
      "LLM feedback under 12s P95",
      "Graceful degradation if LLM unavailable (rule-based only)",
      "Store 100 sessions per user minimum"
    ],
    architectureDiagram: `┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│ Interview UI│───▶│ Session API  │───▶│ Question Bank   │
│ Timer+Input │    │              │    │ (per track)     │
└─────────────┘    └──────┬───────┘    └─────────────────┘
                          │
                   ┌──────▼───────┐    ┌─────────────────┐
                   │ Evaluator    │───▶│ OpenAI GPT-4o   │
                   │ Rules + LLM  │    │ structured JSON │
                   └──────┬───────┘    └─────────────────┘
                          │
                   ┌──────▼────────────────────────────┐
                   │ PostgreSQL sessions, scores, trends │
                   └─────────────────────────────────────┘`,
    flowDiagram: `Select track + difficulty
      │
      ▼
Load question set → start timer
      │
      ▼
User submits answer text
      │
      ▼
Rule rubric (structure, keywords) + LLM critique
      │
      ▼
Merge scores → save session → show feedback + next question`,
    folderStructure: `ai-interview-coach/
├── web/                      # Next.js or React
├── api/
│   ├── questions/            # YAML banks per track
│   ├── evaluator/
│   │   ├── rubric.py
│   │   └── llm_feedback.py
│   └── sessions/
└── prompts/                  # evaluation templates`,
    frontendDesign:
      "Split view: question panel left, answer editor right, timer bar top. Post-answer: score breakdown radar chart and bullet feedback. History tab with sparkline.",
    backendDesign:
      "FastAPI; question bank loaded from versioned YAML; evaluator returns { rubric_scores, llm_feedback, overall }; async OpenAI calls with timeout fallback.",
    databaseDesign:
      "users; tracks(id, name); questions(id, track_id, difficulty, text); sessions(id, user_id, track_id, started_at); answers(id, session_id, question_id, text, rubric_json, score).",
    apiSpecifications: `GET  /api/tracks
GET  /api/sessions/new?track=&difficulty= — returns session_id + questions[]
POST /api/sessions/{id}/answers — { question_id, text } → feedback
GET  /api/sessions/{id}/summary
GET  /api/users/me/stats — trend data
POST /api/sessions/{id}/complete`,
    authenticationAuthorization:
      "JWT auth; users read own sessions only; admin manages question banks; rate limit 20 evaluations/hour per user.",
    deploymentStrategy:
      "Vercel frontend + Fly.io API; PostgreSQL; Redis rate limiter.",
    testingStrategy:
      "Golden-file tests for rubric on sample answers; mock OpenAI in CI; E2E Playwright full mock session.",
    cicdStrategy:
      "PR checks: pytest + eslint; staging deploy previews per PR.",
    monitoringLogging:
      "Log evaluation latency and token usage; dashboard for average scores by track.",
    interviewQuestions: [
      "How do you reduce bias in automated interview scoring?",
      "When should rule-based scoring override LLM feedback?",
      "Design anti-cheat for take-home vs live modes."
    ],
    implementation: [
      "Seed question banks for 3 tracks",
      "Build rubric engine with weighted dimensions",
      "Integrate OpenAI with JSON schema response",
      "Create session history dashboard"
    ]
  }),

  "RAG Chatbot": buildProject({
    level: "Intermediate",
    overview:
      "Document-grounded chatbot that ingests knowledge bases, retrieves relevant chunks, and answers with inline citations to reduce hallucinations.",
    businessProblem:
      "Support teams answer repetitive product questions manually; generic chatbots hallucinate specs and create liability.",
    requirements: [
      "Upload PDF/Markdown knowledge docs",
      "Chunk, embed, and index in vector store",
      "Chat UI with streaming responses",
      "Citations linking to source chunks",
      "Admin re-index on doc updates"
    ],
    functionalRequirements: [
      "Multi-file ingest with progress bar",
      "Semantic search top-k retrieval",
      "Prompt template with context injection",
      "Conversation history per session",
      "Feedback thumbs up/down on answers"
    ],
    nonFunctionalRequirements: [
      "Retrieval recall@5 > 0.85 on eval set",
      "Streaming first token < 2s",
      "Isolate tenant data in multi-tenant mode"
    ],
    architectureDiagram: `┌──────────┐   ┌────────────┐   ┌───────────────┐
│ Chat UI  │──▶│ Chat API   │──▶│ RAG Pipeline  │
│ Stream   │   │ SSE        │   │ Retrieve+Gen  │
└──────────┘   └─────┬──────┘   └───────┬───────┘
                     │                  │
              ┌──────▼──────┐    ┌──────▼────────┐
              │ Ingest API  │    │ Vector DB     │
              │ Chunk+Embed │    │ pgvector/Chroma│
              └─────────────┘    └───────────────┘`,
    flowDiagram: `Admin uploads documents
      │
      ▼
Chunk (512 tokens, 64 overlap) → embed → upsert vectors
      │
      ▼
User asks question → embed query → top-k retrieval
      │
      ▼
Build prompt with context → stream LLM response + cite sources`,
    folderStructure: `rag-chatbot/
├── app/
│   ├── ingest/
│   ├── retrieval/
│   ├── generation/
│   └── api/routes.py
├── frontend/
├── eval/                     # ragas or custom metrics
└── infra/docker-compose.yml`,
    frontendDesign:
      "ChatGPT-style thread UI; citation chips below each answer open source drawer; sidebar doc list with index status.",
    backendDesign:
      "LangChain or custom pipeline; hybrid search optional (BM25 + vector); background Celery tasks for ingest.",
    databaseDesign:
      "documents(id, filename, status); chunks(id, doc_id, text, embedding_id); conversations; messages(role, content, citations_json).",
    apiSpecifications: `POST /api/ingest — multipart files
POST /api/chat — { message, conversation_id } → SSE stream
GET  /api/conversations
GET  /api/documents
DELETE /api/documents/{id}
POST /api/feedback — { message_id, rating }`,
    authenticationAuthorization:
      "API keys for embed widget; JWT for admin ingest; tenant_id column on all rows for isolation.",
    deploymentStrategy:
      "Docker: api + worker + postgres/pgvector; scale workers horizontally for ingest backlog.",
    testingStrategy:
      "Eval harness with 50 QA pairs; regression on citation accuracy; load test concurrent chats.",
    cicdStrategy:
      "CI runs eval suite; block merge if faithfulness drops > 5%.",
    monitoringLogging:
      "Trace retrieval ids per answer; log hallucination reports from negative feedback.",
    interviewQuestions: [
      "Chunk size vs retrieval precision tradeoffs?",
      "How do you handle contradictory documents?",
      "When to add re-ranking?"
    ],
    implementation: [
      "Implement ingest pipeline with pgvector",
      "Build streaming chat endpoint",
      "Add citation extraction from retrieved chunks",
      "Create eval notebook with golden questions"
    ]
  }),

  "OpenAI Document Assistant": buildProject({
    level: "Intermediate",
    overview:
      "Assistant for summarizing, Q&A, and structured extraction from long documents using OpenAI APIs with cost controls and audit logs.",
    businessProblem:
      "Legal and operations teams spend hours reading contracts and reports; ad-hoc ChatGPT usage leaks sensitive docs and lacks audit trails.",
    requirements: [
      "Upload documents up to 100 pages",
      "Summarize, Q&A, and extract fields (dates, parties, amounts)",
      "Token usage dashboard per user",
      "Prompt templates per use case",
      "Export results to Word/PDF"
    ],
    functionalRequirements: [
      "Document upload with virus scan hook",
      "Select task: summary / Q&A / extraction",
      "Streaming output with cancel button",
      "Save prompts and outputs linked to doc version",
      "Org-wide template library"
    ],
    nonFunctionalRequirements: [
      "Never send docs to model without user consent banner",
      "Encrypt files at rest S3 SSE-KMS",
      "Configurable model tier (gpt-4o-mini vs gpt-4o)"
    ],
    architectureDiagram: `┌─────────────┐   ┌────────────────┐   ┌──────────────────┐
│ Web Client  │──▶│ Document API   │──▶│ OpenAI Client    │
│ Tasks UI    │   │ Job Queue      │   │ Chat Completions │
└─────────────┘   └───────┬────────┘   └──────────────────┘
                          │
                   ┌──────▼──────┐   ┌────────────────────┐
                   │ S3 Storage  │   │ Usage Metering       │
                   └─────────────┘   │ tokens, cost USD   │
                                     └────────────────────┘`,
    flowDiagram: `Upload PDF → store S3 → extract text
      │
      ▼
User picks task template → estimate tokens → confirm
      │
      ▼
Call OpenAI with structured output schema
      │
      ▼
Persist result + usage → render + export`,
    folderStructure: `openai-document-assistant/
├── client/
├── server/
│   ├── openai/               # client wrapper, retries
│   ├── documents/
│   ├── tasks/                # summary, qa, extract
│   └── billing/
└── templates/                # prompt YAML`,
    frontendDesign:
      "Wizard: upload → choose task → preview token estimate → run. Results pane with markdown render and copy/export buttons.",
    backendDesign:
      "Node Express or Python FastAPI; BullMQ job queue for long docs; map-reduce summarization for >128k context.",
    databaseDesign:
      "users; documents(id, s3_key, page_count); tasks(id, doc_id, type, prompt_version); results(id, task_id, output_json); usage_logs(user_id, tokens, model, cost).",
    apiSpecifications: `POST /api/documents
GET  /api/documents/{id}
POST /api/tasks — { document_id, type, options }
GET  /api/tasks/{id}/stream — SSE
GET  /api/usage/summary?month=
GET  /api/templates`,
    authenticationAuthorization:
      "SSO via OIDC; org admin sets model allowlist and monthly token budget per team.",
    deploymentStrategy:
      "AWS: S3 + Lambda/ECS API; CloudFront frontend; Secrets Manager for OPENAI_API_KEY.",
    testingStrategy:
      "Mock OpenAI in unit tests; snapshot tests for extraction JSON schema; penetration test file upload.",
    cicdStrategy:
      "Terraform plan on infra PR; blue-green API deploy.",
    monitoringLogging:
      "Datadog APM on OpenAI latency; alert on cost spike > 2x daily average.",
    interviewQuestions: [
      "How do you summarize documents longer than context window?",
      "Design retry strategy for OpenAI 429 errors.",
      "How to prevent prompt injection from document content?"
    ],
    implementation: [
      "S3 upload with pre-signed URLs",
      "OpenAI wrapper with exponential backoff",
      "Build summary and extraction templates",
      "Usage metering dashboard"
    ]
  }),

  "Job Tracker": buildProject({
    level: "Beginner",
    overview:
      "Application CRM for job seekers: log companies, stages, contacts, follow-ups, and interview dates with pipeline analytics.",
    businessProblem:
      "Candidates lose track of applications across email threads; without pipeline visibility they miss follow-ups and repeat prep for wrong stages.",
    requirements: [
      "Kanban board by stage (Applied, Phone, Onsite, Offer, Rejected)",
      "Application detail: role, salary range, notes, links",
      "Reminder for follow-up dates",
      "Conversion funnel stats",
      "Import from LinkedIn job URL metadata"
    ],
    functionalRequirements: [
      "Drag-drop cards between stages",
      "Add interview events to calendar export (.ics)",
      "Tag applications by skill focus",
      "Search and filter by company or stage",
      "Weekly email digest of pending actions"
    ],
    nonFunctionalRequirements: [
      "Works fully client-side with optional cloud sync",
      "Responsive mobile layout",
      "Data export JSON anytime"
    ],
    architectureDiagram: `┌────────────────┐     ┌─────────────────┐
│ React Kanban   │────▶│ REST API        │
│ LocalStorage   │     │ (optional sync) │
└────────────────┘     └────────┬────────┘
                                │
                         ┌──────▼──────────┐
                         │ PostgreSQL      │
                         │ applications    │
                         └─────────────────┘`,
    flowDiagram: `Add application card (company, role, stage)
      │
      ▼
Update stage on progress → log history event
      │
      ▼
Set follow-up reminder → notify on due date
      │
      ▼
Aggregate funnel metrics → dashboard insights`,
    folderStructure: `job-tracker/
├── src/
│   ├── components/KanbanBoard.tsx
│   ├── hooks/useApplications.ts
│   ├── store/                  # zustand + persist
│   └── api/                    # optional backend
├── server/                     # optional Express API
└── tests/`,
    frontendDesign:
      "Horizontal Kanban columns; card shows company logo, role, days in stage. Detail drawer: timeline, notes, links. Stats bar: response rate, avg days to offer.",
    backendDesign:
      "Optional Express + Prisma API for multi-device sync; webhooks for reminder emails via SendGrid.",
    databaseDesign:
      "applications(id, user_id, company, role, stage, salary_min, salary_max, applied_at); stage_history(app_id, from_stage, to_stage, at); reminders(app_id, due_at, sent).",
    apiSpecifications: `GET  /api/applications
POST /api/applications
PATCH /api/applications/{id} — { stage, notes, ... }
POST /api/applications/{id}/history
GET  /api/stats/funnel
POST /api/reminders
GET  /api/export/json`,
    authenticationAuthorization:
      "Magic-link email auth or Google OAuth; strict user_id scoping on all application rows.",
    deploymentStrategy:
      "Static SPA on GitHub Pages for offline mode; optional Fly.io API for sync tier.",
    testingStrategy:
      "Unit tests for stage transition rules; E2E drag-drop with Playwright.",
    cicdStrategy:
      "GitHub Actions: test → deploy SPA to Pages on main.",
    monitoringLogging:
      "Client-side error boundary reporting; server logs reminder job success rate.",
    interviewQuestions: [
      "How model application stages as state machine?",
      "Design conflict resolution for offline sync.",
      "Metrics that matter for job search analytics?"
    ],
    implementation: [
      "Build Kanban with @dnd-kit",
      "Persist to localStorage with export",
      "Add funnel stats calculations",
      "Optional Express sync API"
    ]
  }),

  "AI Learning Platform": buildProject({
    level: "Advanced",
    overview:
      "Full-stack learning portal with courses, lessons, quizzes, progress tracking, and AI tutor — mirroring production ed-tech architecture.",
    businessProblem:
      "Self-taught engineers lack structured paths and measurable progress; fragmented tutorials do not adapt to skill gaps.",
    requirements: [
      "Course catalog with modules and lessons",
      "Rich lesson content (text, code, diagrams)",
      "Quizzes with instant feedback",
      "Per-user progress and certificates",
      "AI tutor chat grounded in current lesson"
    ],
    functionalRequirements: [
      "Browse and enroll in courses",
      "Mark lessons complete; unlock sequential content",
      "Take quizzes; store scores per lesson",
      "Dashboard: XP, streak, completion %",
      "AI tutor answers questions about active lesson only"
    ],
    nonFunctionalRequirements: [
      "Support 50k MAU on single region",
      "Lesson page LCP < 2.5s",
      "Accessible keyboard navigation for all lessons"
    ],
    architectureDiagram: `┌──────────────┐   ┌─────────────┐   ┌─────────────────┐
│ Learn SPA    │──▶│ Course API  │──▶│ Content Service │
│ Modules/Quiz │   │             │   │ CMS or JSON     │
└──────────────┘   └──────┬──────┘   └─────────────────┘
                          │
                   ┌──────▼──────┐   ┌─────────────────┐
                   │ Progress API│   │ AI Tutor (RAG)  │
                   └──────┬──────┘   └─────────────────┘
                          │
                   ┌──────▼──────────────────────────────┐
                   │ PostgreSQL users, progress, scores  │
                   └─────────────────────────────────────┘`,
    flowDiagram: `User enrolls in course
      │
      ▼
Load module → lesson content → mark complete
      │
      ▼
Quiz submission → score saved → unlock next lesson
      │
      ▼
AI tutor retrieves current lesson context → answers question
      │
      ▼
Course 80% complete → issue certificate`,
    folderStructure: `ai-learning-platform/
├── apps/web/                 # React learn portal
├── apps/api/                 # NestJS or FastAPI
├── packages/content/         # lesson JSON schemas
├── packages/ui/
└── infra/`,
    frontendDesign:
      "Course sidebar nav, lesson reader with tabs (Theory, Code, Quiz), progress ring on dashboard, certificate modal on completion.",
    backendDesign:
      "REST + optional GraphQL; progress service with idempotent complete events; tutor service wraps RAG over lesson chunks.",
    databaseDesign:
      "courses; modules; lessons; enrollments; lesson_progress(user, lesson_id, completed_at); quiz_attempts(score); certificates(user, course_id, issued_at).",
    apiSpecifications: `GET  /api/courses
GET  /api/courses/{id}/curriculum
POST /api/enrollments
POST /api/lessons/{id}/complete
POST /api/quizzes/{id}/submit
GET  /api/users/me/progress
POST /api/tutor/chat — { lesson_id, message }
GET  /api/certificates/{id}`,
    authenticationAuthorization:
      "JWT + refresh; students see enrolled content only; instructors edit course drafts; admin publishes courses.",
    deploymentStrategy:
      "Monorepo Turborepo; web on Vercel; API on Render; CDN for static lesson assets.",
    testingStrategy:
      "Contract tests for curriculum API; E2E enroll→complete→certificate flow; tutor grounding eval set.",
    cicdStrategy:
      "Nx affected tests on PR; content schema validation in CI.",
    monitoringLogging:
      "Track lesson drop-off funnels; tutor hallucination reports; uptime on API SLO 99.9%.",
    interviewQuestions: [
      "How do you prevent users from skipping locked lessons via API?",
      "Design progress sync for offline mobile.",
      "How to ground AI tutor without leaking other courses?"
    ],
    implementation: [
      "Define lesson JSON schema and seed one course",
      "Build progress engine with locks",
      "Implement quiz grading service",
      "Add lesson-scoped RAG tutor"
    ]
  })
};

const LIVE_BLUEPRINTS = {
  "LLM Science Exam": buildProject({
    level: "Advanced",
    overview:
      "Kaggle-style pipeline that answers multi-choice science questions using chain-of-thought prompting, self-consistency, and calibrated answer extraction.",
    businessProblem:
      "Science MCQ competitions require high accuracy under token budgets; naive zero-shot prompting underperforms on reasoning-heavy questions.",
    requirements: [
      "Load competition CSV with questions and choices",
      "CoT prompt with 5-shot examples",
      "Majority vote across 3 samples (self-consistency)",
      "Extract letter answer with robust parser",
      "Generate submission.csv"
    ],
    functionalRequirements: [
      "CLI: python pipeline.py --model gpt-4o --split train",
      "Cache LLM responses to disk for reproducibility",
      "Log per-question confidence and reasoning trace",
      "Holdout validation accuracy report",
      "Rate-limit aware batch runner"
    ],
    nonFunctionalRequirements: [
      "Resume interrupted runs from checkpoint file",
      "Cost cap flag --max-usd 50",
      "Deterministic seeds where temperature=0"
    ],
    architectureDiagram: `┌──────────┐   ┌─────────────┐   ┌──────────────┐
│ CSV Data │──▶│ CoT Runner  │──▶│ OpenAI API   │
└──────────┘   └──────┬──────┘   └──────────────┘
                      │
               ┌──────▼──────┐   ┌──────────────┐
               │ Vote+Parse  │──▶│ submission.csv│
               └─────────────┘   └──────────────┘`,
    flowDiagram: `Read question row
      │
      ▼
Build CoT prompt with choices A-D
      │
      ▼
3 sampled completions (temp 0.7)
      │
      ▼
Majority vote on extracted letter
      │
      ▼
Append to submission + checkpoint save`,
    folderStructure: `llm-science-exam/
├── data/train.csv
├── prompts/cot_fewshot.txt
├── pipeline.py
├── parse.py
├── cache/
└── notebooks/analysis.ipynb`,
    frontendDesign:
      "Optional Streamlit dashboard: run progress, accuracy chart, failure case browser.",
    backendDesign:
      "Python asyncio batch client; tenacity retries; parquet cache keyed by prompt hash.",
    databaseDesign:
      "SQLite run_history(question_id, model, answer, trace, cost); optional only for local experiments.",
    apiSpecifications: `N/A — batch CLI pipeline
Internal: run_batch(questions[]) -> predictions[]
Cache GET: disk cache by hash(prompt)
OpenAI: chat.completions.create model=gpt-4o`,
    authenticationAuthorization:
      "OPENAI_API_KEY via environment; never commit keys; Kaggle API token for dataset download.",
    deploymentStrategy:
      "Kaggle notebook kernel or local GPU-less batch; artifact upload to competition portal.",
    testingStrategy:
      "20-question golden set with expected letters; parser unit tests for messy outputs.",
    cicdStrategy:
      "GitHub Actions: pytest only; no auto-submit to Kaggle.",
    monitoringLogging:
      "Log tokens and USD per question; wandb optional for accuracy trends.",
    interviewQuestions: [
      "When does self-consistency help vs hurt budget?",
      "How to fix systematic parser failures on 'The answer is (B)' formats?"
    ],
    implementation: [
      "Implement CoT template with few-shot",
      "Add majority vote aggregator",
      "Build resilient answer regex parser",
      "Run validation and export CSV"
    ]
  }),

  "AI Math Olympiad": buildProject({
    level: "Advanced",
    overview:
      "Mathematical reasoning solver using step-by-step LLM chains, symbolic verification with SymPy, and failure analysis for competition math.",
    businessProblem:
      "Olympiad problems need rigorous reasoning; LLMs often produce plausible but wrong final numbers without verification.",
    requirements: [
      "Parse problem statements (LaTeX support)",
      "Multi-step reasoning chain",
      "SymPy verification of final numeric answer",
      "Failure bucket taxonomy",
      "Batch evaluation on problem set"
    ],
    functionalRequirements: [
      "Solver prompt enforces numbered steps",
      "Extract final answer in \\boxed{} format",
      "Compare with SymPy simplified form",
      "Flag problems for human review when verify fails",
      "Export results JSON with traces"
    ],
    nonFunctionalRequirements: [
      "Timeout 120s per hard problem",
      "Isolate code execution sandbox if using tool calls"
    ],
    architectureDiagram: `┌───────────┐   ┌────────────┐   ┌─────────────┐
│ Problems  │──▶│ LLM Solver │──▶│ Answer Parse│
└───────────┘   └─────┬──────┘   └──────┬──────┘
                      │                  │
               ┌──────▼──────┐    ┌──────▼──────┐
               │ SymPy Verify│    │ Failure Log │
               └─────────────┘    └─────────────┘`,
    flowDiagram: `Load problem text
      │
      ▼
LLM generates step-by-step solution
      │
      ▼
Parse \\boxed{answer}
      │
      ▼
SymPy equivalence check vs ground truth (if labeled)
      │
      ▼
Record pass/fail + error category`,
    folderStructure: `ai-math-olympiad/
├── problems/
├── solver/chain.py
├── verify/sympy_check.py
├── eval/run.py
└── reports/`,
    frontendDesign:
      "Jupyter notebook UI for interactive solve; HTML report for failure analysis.",
    backendDesign:
      "Python orchestration; optional LangChain math tool; no unsafe eval().",
    databaseDesign:
      "JSONL results file per run: { problem_id, trace, answer, verified, category }.",
    apiSpecifications: `CLI: python eval/run.py --limit 50
POST /internal/solve (optional FastAPI) { problem } -> { steps, answer, verified }`,
    authenticationAuthorization:
      "API keys in .env; sandbox denies network in verifier subprocess.",
    deploymentStrategy:
      "Local batch or Modal.com serverless for parallel solves.",
    testingStrategy:
      "Unit tests on 30 known problems with labels; regression when prompt changes.",
    cicdStrategy:
      "CI runs verifier tests only (no LLM spend).",
    monitoringLogging:
      "Histogram of verify pass rate by difficulty tag.",
    interviewQuestions: [
      "Limits of SymPy verification for proof problems?",
      "How to reduce cost on easy problems tier?"
    ],
    implementation: [
      "Build solver prompt with boxed answer format",
      "Implement SymPy checker",
      "Run eval harness and failure report"
    ]
  }),

  "Open LLM Leaderboard": buildProject({
    level: "Intermediate",
    overview:
      "Benchmark harness comparing open-source LLMs on MMLU subsets, latency, and cost — with sortable leaderboard UI.",
    businessProblem:
      "Teams pick models from hype not data; without standardized evals they overpay for capability they do not need.",
    requirements: [
      "Configure model endpoints (Ollama, vLLM, APIs)",
      "Run eval tasks: MMLU-lite, HellaSwag sample",
      "Record accuracy, tokens/sec, cost per 1k tokens",
      "Leaderboard UI with filters",
      "Export results CSV"
    ],
    functionalRequirements: [
      "Add model via name + base URL + API key",
      "Queue eval jobs with progress",
      "Normalize scores 0-100 per task",
      "Composite score weighted by use case profile",
      "Historical run comparison"
    ],
    nonFunctionalRequirements: [
      "Parallel eval workers (4 default)",
      "Retry transient 5xx from model servers"
    ],
    architectureDiagram: `┌────────────┐   ┌─────────────┐   ┌──────────────┐
│ Dashboard  │──▶│ Eval API    │──▶│ Model Adapter│
└────────────┘   └──────┬──────┘   │ Ollama/OpenAI│
                        │          └──────────────┘
                 ┌──────▼──────┐
                 │ SQLite Runs │
                 └─────────────┘`,
    flowDiagram: `Register model endpoint
      │
      ▼
Select eval suite → enqueue job
      │
      ▼
Worker runs prompts → score responses
      │
      ▼
Aggregate metrics → update leaderboard rank`,
    folderStructure: `llm-leaderboard/
├── evals/mmlu_lite.py
├── adapters/
├── api/main.py
├── web/
└── results.db`,
    frontendDesign:
      "Sortable table: Model, MMLU, Latency p50, $/1M tokens, composite. Sparkline of last 5 runs.",
    backendDesign:
      "FastAPI job queue; adapter interface unify OpenAI-compatible APIs; sqlite store.",
    databaseDesign:
      "models(id, name, endpoint, config_json); runs(id, model_id, started_at); run_metrics(run_id, task, score, latency_ms, cost).",
    apiSpecifications: `POST /api/models
GET  /api/models
POST /api/evals/run — { model_id, tasks[] }
GET  /api/evals/{job_id}/status
GET  /api/leaderboard?sort=composite
GET  /api/export/csv`,
    authenticationAuthorization:
      "Admin password for eval triggers; read-only public leaderboard route.",
    deploymentStrategy:
      "HuggingFace Space Docker or single VPS with GPU optional for local models.",
    testingStrategy:
      "Mock adapter returns fixed outputs; metric math unit tests.",
    cicdStrategy:
      "Docker build on release tag.",
    monitoringLogging:
      "Job failure alerts; log model endpoint health checks.",
    interviewQuestions: [
      "How normalize scores across different eval tasks?",
      "Prevent benchmark overfitting when selecting models?"
    ],
    implementation: [
      "Build model adapter layer",
      "Implement MMLU-lite scorer",
      "Create leaderboard React table",
      "Add CSV export"
    ]
  }),

  "Agentic RAG": buildProject({
    level: "Advanced",
    overview:
      "Multi-agent system where a planner delegates to retrieval, calculator, and web tools — with memory and guardrails for enterprise Q&A.",
    businessProblem:
      "Single-shot RAG fails on questions needing calculation, multi-hop retrieval, or live data; agents coordinate tools but risk runaway loops.",
    requirements: [
      "Planner agent with ReAct loop",
      "Tools: vector retriever, Python calculator, web search",
      "Session memory (last 10 turns)",
      "Max 8 tool iterations guardrail",
      "Trace log for debugging"
    ],
    functionalRequirements: [
      "Streaming agent thoughts to UI (optional redaction)",
      "Tool call approval mode for production",
      "Citation pass-through from retriever tool",
      "Rate limit per user session",
      "Eval set for multi-hop questions"
    ],
    nonFunctionalRequirements: [
      "P95 end-to-end < 30s with 3 tool calls",
      "Sandboxed calculator (no file/network IO)"
    ],
    architectureDiagram: `┌──────────┐   ┌───────────────┐   ┌─────────────────┐
│ Chat UI  │──▶│ Orchestrator  │──▶│ Planner Agent   │
└──────────┘   │ LangGraph     │   └────────┬────────┘
               └───────┬───────┘            │
                       │         ┌──────────┼──────────┐
                       │         ▼          ▼          ▼
                       │    Retriever  Calculator  WebSearch
                       │         │          │          │
                       └─────────┴──────────┴──────────┘
                                 ▼
                          Synthesizer → Answer`,
    flowDiagram: `User query received
      │
      ▼
Planner decides next action (tool or respond)
      │
      ▼
Execute tool → append observation to memory
      │
      ▼
Loop until final answer or max iterations
      │
      ▼
Guardrail filter → stream response`,
    folderStructure: `agentic-rag/
├── agents/planner.py
├── tools/retriever.py
├── tools/calculator.py
├── tools/web.py
├── graph/orchestrator.py
├── api/server.py
└── eval/multi_hop.json`,
    frontendDesign:
      "Chat with expandable tool-call cards showing inputs/outputs; trace download for support.",
    backendDesign:
      "LangGraph state machine; Redis session memory; OpenAI function calling for tool schemas.",
    databaseDesign:
      "sessions; traces(session_id, steps_json); vector store for retriever tool corpus.",
    apiSpecifications: `POST /api/agent/chat — SSE { message, session_id }
GET  /api/sessions/{id}/trace
POST /api/admin/reindex
GET  /api/health`,
    authenticationAuthorization:
      "JWT sessions; role tool_policy restricts web search to trusted users; audit every tool invocation.",
    deploymentStrategy:
      "Kubernetes deployment with HPA on API; secrets via Vault.",
    testingStrategy:
      "Trajectory tests: expected tool sequence for 15 fixtures; mock web search.",
    cicdStrategy:
      "Eval gate blocks deploy if multi-hop accuracy drops.",
    monitoringLogging:
      "OpenTelemetry spans per tool call; alert on iteration limit hits > 10% of sessions.",
    interviewQuestions: [
      "When agents beat plain RAG?",
      "Stop runaway tool loops in production?",
      "Cost control strategies for agent stacks?"
    ],
    implementation: [
      "Define tool schemas and planner prompt",
      "Wire LangGraph with iteration cap",
      "Build trace UI",
      "Run multi-hop eval suite"
    ]
  })
};

export const PROJECT_BLUEPRINTS = { ...CORE_BLUEPRINTS, ...LIVE_BLUEPRINTS };

export const ALL_PROJECT_NAMES = [...CORE_PROJECT_NAMES, ...LIVE_PROJECT_NAMES];
