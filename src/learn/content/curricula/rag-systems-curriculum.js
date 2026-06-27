import { buildLesson } from "../lesson-builder.js";

const LESSONS = [
  {
    title: "Document Chunking",
    overview: "Document chunking splits large sources into retrieval-sized segments—balancing context richness against embedding precision.",
    theory: "Fixed-size chunks (512–1024 tokens) with overlap preserve continuity. Semantic chunkers split on headings/paragraphs. Metadata (source, page, section) travels with each chunk for citations.",
    explanation: "Small chunks improve precision; large chunks improve context. Overlap 10–20% reduces boundary cuts. Preprocess: strip boilerplate, normalize whitespace, extract titles.",
    realWorldExample: "Legal corpus chunked by section with page metadata for pinpoint citations in answers.",
    architectureDiagram: `PDF/HTML → Parser → Chunker → [{text, metadata}] → Embed pipeline`,
    flowDiagram: `Load doc → Split strategy → Attach metadata → Output chunk list`,
    syntax: `def chunk_text(text, size=800, overlap=100):\n  start = 0\n  while start < len(text):\n    yield text[start:start+size]\n    start += size - overlap`,
    practicalExample: `from langchain_text_splitters import RecursiveCharacterTextSplitter\nsplitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)\nchunks = splitter.split_documents(docs)`,
    exercise: "Chunk a markdown file by headings; store heading path in metadata.",
    assignment: "Compare retrieval recall@5 for chunk sizes 256 vs 1024 on sample set.",
    miniProject: "Ingestion CLI: folder → chunked JSONL with metadata.",
    quiz: [
      { question: "Chunk overlap helps:", options: ["Avoid cutting sentences at boundaries", "Delete metadata", "Disable search", "Increase SQL joins"], correct: 0 },
      { question: "Metadata should include:", options: ["Source id and section", "Only random UUID", "CSS classes", "TCP port"], correct: 0 }
    ],
    interview: ["Chunk size tradeoffs?", "Semantic vs fixed splitting?", "Handling tables/code?"]
  },
  {
    title: "Embeddings",
    overview: "In RAG pipelines, embeddings turn chunks and queries into vectors stored in a searchable index.",
    theory: "Same model for ingest and query. Batch embed for throughput. Store embedding model version in index metadata for migrations. Normalize if index requires.",
    explanation: "Re-embed entire corpus when switching models. Deduplicate identical chunks. Track embedding cost in ingestion budget.",
    realWorldExample: "Support KB re-embeds nightly delta files only, versioning index as embed-v3-small.",
    architectureDiagram: `Chunks → Embed API → Vectors + ids → Vector store`,
    flowDiagram: `New docs → chunk → batch embed → upsert index → verify sample queries`,
    syntax: `vectors = client.embeddings.create(model="text-embedding-3-small", input=texts).data`,
    practicalExample: `index.upsert(vectors=[{"id":c.id,"values":c.embedding,"metadata":{"text":c.text}}])`,
    exercise: "Embed 500 chunks in batches of 64 with progress logging.",
    assignment: "Plan zero-downtime re-embed when model changes.",
    miniProject: "Dual-index migration script with eval comparison.",
    quiz: [
      { question: "Ingest and query embeddings must:", options: ["Use same model", "Use random models", "Skip index", "Use only SQL"], correct: 0 },
      { question: "Batching improves:", options: ["Throughput and cost", "HTML layout", "JVM tuning", "DNS"], correct: 0 }
    ],
    interview: ["Re-embed strategy?", "Embedding cache?", "Cost drivers?"]
  },
  {
    title: "Retrieval",
    overview: "Retrieval selects top-k relevant chunks for a user query using vector similarity and optional filters.",
    theory: "k tradeoff: low k misses context; high k adds noise and tokens. Metadata filters narrow domain (product, date). MMR diversifies results. Log scores for debugging.",
    explanation: "Tune k on eval set. Pre-filter by tenant/user permissions in metadata. Fallback to keyword if vector scores low.",
    realWorldExample: "Multi-tenant SaaS passes account_id filter so retrieval never crosses customers.",
    architectureDiagram: `Query embed → ANN search + filters → top-k chunks`,
    flowDiagram: `Query → embed → search index → rank → return chunks + scores`,
    syntax: `results = index.query(vector=q_vec, top_k=8, filter={"account_id": "acme"})`,
    practicalExample: `chunks = sorted(results, key=lambda r: r.score, reverse=True)[:5]`,
    exercise: "Implement retrieval with score threshold abstention.",
    assignment: "Measure recall@k vs k on labeled question-chunk pairs.",
    miniProject: "Retrieval API returning chunks + scores + metadata.",
    quiz: [
      { question: "Higher k generally:", options: ["Adds more context and noise", "Removes all tokens", "Disables LLM", "Fixes SQL"], correct: 0 },
      { question: "Metadata filters enforce:", options: ["Tenant isolation", "CSS themes", "Git branches", "JVM flags"], correct: 0 }
    ],
    interview: ["Choosing k?", "Permission filters?", "Low score handling?"]
  },
  {
    title: "Re-ranking",
    overview: "Re-ranking reorders initial retrieval candidates with a cross-encoder or LLM judge for better precision before prompting.",
    theory: "Bi-encoder retrieval is fast but approximate. Cross-encoders score query-passage pairs accurately but slowly—apply on top 20–50. LLM rerankers flexible but costly.",
    explanation: "Two-stage: retrieve 30, rerank to 5. Caching rerank scores for repeated queries. Measure nDCG@k improvement on eval.",
    realWorldExample: "Enterprise search retrieves 40 wiki chunks, cross-encoder reranks to best 6 for GPT prompt.",
    architectureDiagram: `Retriever (fast) → Candidate pool → Reranker (slow) → Top-n for LLM`,
    flowDiagram: `Vector top-30 → pairwise scores → sort → take top-5 → prompt`,
    syntax: `# pseudo: scores = [cross_encoder(q, c.text) for c in candidates]`,
    practicalExample: `from sentence_transformers import CrossEncoder\nreranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")\npairs = [[query, c.text] for c in candidates]`,
    exercise: "Compare answer quality with/without reranker on 20 questions.",
    assignment: "Latency budget: max rerank pairs given 500ms SLA.",
    miniProject: "Rerank step plugged into existing RAG pipeline.",
    quiz: [
      { question: "Reranking improves:", options: ["Precision of top results", "DNS TTL", "CSS grid", "Git merge"], correct: 0 },
      { question: "Cross-encoders are:", options: ["Slower than bi-encoder retrieval", "Free instant", "SQL only", "Image codecs"], correct: 0 }
    ],
    interview: ["Two-stage retrieval why?", "Reranker selection?", "Cost/latency tradeoff?"]
  },
  {
    title: "Grounded Generation",
    overview: "Grounded generation constrains the LLM to answer from retrieved evidence—reducing fabrication and enabling verifiable citations.",
    theory: "Prompt instructs: use only provided context. Post-check: entailment or citation overlap metrics. Abstain when context insufficient. Show sources in UI.",
    explanation: "Delimiter blocks for context. Ask model to quote chunk ids. Eval faithfulness automatically and with humans.",
    realWorldExample: "Medical FAQ cites PubMed chunk ids; refuses when retrieval empty.",
    architectureDiagram: `Chunks + strict prompt → LLM → Answer + citations → Faithfulness check`,
    flowDiagram: `Retrieve → prompt with rules → generate → validate cites → show user`,
    syntax: `prompt = """Answer ONLY from context. Cite [id].\\nIf unknown, say I don't know.\\nContext:\\n{ctx}\\nQ: {q}"""`,
    practicalExample: `def has_citation(answer, chunk_ids):\n  return any(cid in answer for cid in chunk_ids)`,
    exercise: "Add abstention on empty retrieval; test adversarial questions.",
    assignment: "Define faithfulness metric and baseline on 30 cases.",
    miniProject: "UI showing answer sentences linked to source chunks.",
    quiz: [
      { question: "Grounding reduces:", options: ["Hallucination", "Need for retrieval", "All latency", "SQL usage"], correct: 0 },
      { question: "Abstention is when:", options: ["Context insufficient", "Model always guesses", "Index deleted", "CSS fails"], correct: 0 }
    ],
    interview: ["Grounding prompt patterns?", "Faithfulness metrics?", "User trust UX?"]
  },
  {
    title: "Hybrid Search",
    overview: "Hybrid search combines dense vector similarity with sparse keyword (BM25) scores—improving recall on exact tokens and rare entities.",
    theory: "Weighted fusion: score = α * vector + (1-α) * BM25. Reciprocal Rank Fusion (RRF) merges ranked lists without tuning α. Good for SKUs, names, error codes.",
    explanation: "Tune α on eval data. Index same chunks in vector DB and search engine where supported (e.g., pgvector + tsvector).",
    realWorldExample: "IT runbook search matches error code EX-442 via BM25 and conceptual 'disk full' via vectors.",
    architectureDiagram: `Query → Vector index ─┐\n       → BM25 index  ─┼→ Fusion → top-k`,
    flowDiagram: `Run both searches → merge scores → dedupe → return unified ranking`,
    syntax: `# RRF sketch\ndef rrf(rank, k=60): return 1/(k+rank)`,
    practicalExample: `vector_hits = index.query(...)\nkeyword_hits = es.search(q=query)\nmerged = fuse_rrf(vector_hits, keyword_hits)`,
    exercise: "Implement RRF merge for two ranked lists in Python.",
    assignment: "A/B eval hybrid vs vector-only on entity-heavy queries.",
    miniProject: "Postgres pgvector + full-text hybrid search endpoint.",
    quiz: [
      { question: "Hybrid search helps with:", options: ["Exact tokens and semantics", "Only images", "CSS only", "TCP ports"], correct: 0 },
      { question: "RRF merges:", options: ["Ranked result lists", "Git branches", "JVM heaps", "DNS zones"], correct: 0 }
    ],
    interview: ["When hybrid beats vector?", "RRF vs weighted sum?", "Index design?"]
  },
  {
    title: "Evaluation",
    overview: "RAG evaluation measures retrieval quality and answer faithfulness—gating releases before user impact.",
    theory: "Retrieval: recall@k, MRR. Generation: faithfulness, answer relevance. Golden sets with question, expected docs, ideal answer facets. Track regressions per pipeline version.",
    explanation: "Automate nightly eval. Slice metrics by topic. Human review sample weekly for high-risk domains.",
    realWorldExample: "CI fails if faithfulness drops 3% after chunk size change.",
    architectureDiagram: `Eval cases → RAG pipeline → Auto metrics → Dashboard gate`,
    flowDiagram: `Load cases → run pipeline → score → compare baseline → report`,
    syntax: `for case in cases:\n  docs = retrieve(case.q)\n  ans = generate(case.q, docs)\n  log(recall(case.gold_ids, docs), faithfulness(ans, docs))`,
    practicalExample: `recall_at_k = len(gold & retrieved_ids) / len(gold)`,
    exercise: "Build 20-case eval JSON with gold chunk ids.",
    assignment: "Pick faithfulness method: LLM judge vs n-gram overlap pros/cons.",
    miniProject: "Eval harness integrated into GitHub Actions.",
    quiz: [
      { question: "recall@k measures:", options: ["Retrieval coverage", "CSS size", "TCP speed", "JVM GC"], correct: 0 },
      { question: "Golden sets detect:", options: ["Regressions", "Only UI colors", "Git author", "DNS TTL"], correct: 0 }
    ],
    interview: ["Key RAG metrics?", "LLM judge pitfalls?", "CI gating?"]
  },
  {
    title: "Pipeline Architecture",
    overview: "Production RAG architecture orchestrates ingestion, indexing, retrieval, generation, and observability as separable services.",
    theory: "Components: ingest worker, embedder, vector DB, query API, LLM gateway, eval service. Async queues for ingestion. Feature flags for reranker and hybrid. Observability: traces per request with chunk ids and latencies.",
    explanation: "Scale ingest independently from query. Cache frequent queries. Multi-region read replicas for index. Secrets in vault; PII scrubbing at ingest.",
    realWorldExample: "Kubernetes: ingest Deployment, query API HPA, Pinecone index, Datadog traces per RAG request.",
    architectureDiagram: `Ingest queue → Workers → Vector DB\nUser → API → Retrieve → LLM → Response\n        ↘ Metrics/Tracing`,
    flowDiagram: `Doc upload → async ingest → index ready → query path → log trace`,
    syntax: `# trace metadata\ntrace.set_tag("retrieval.k", 5)\ntrace.set_tag("chunks", chunk_ids)`,
    practicalExample: `architecture = {"ingest":"SQS","index":"pinecone","llm":"openai","api":"fastapi"}`,
    exercise: "Draw sequence diagram for query path with latencies per stage.",
    assignment: "SLA document: p95 targets for retrieve vs generate.",
    miniProject: "Docker Compose RAG stack: api + worker + local vector DB.",
    quiz: [
      { question: "Ingest and query should:", options: ["Scale independently", "Share one thread always", "Skip index", "Use only CSS"], correct: 0 },
      { question: "Tracing should capture:", options: ["Chunk ids and latencies", "Only UI colors", "Git user", "DNS"], correct: 0 }
    ],
    interview: ["Microservices vs monolith RAG?", "Failure isolation?", "Observability must-haves?"]
  }
];

export const RAG_SYSTEMS_CURRICULUM = LESSONS.map((spec) =>
  buildLesson({
    title: spec.title,
    description: spec.overview.slice(0, 100),
    difficulty: spec.title === "Document Chunking" ? "Beginner" : "Intermediate",
    duration: "30 min",
    codeLang: "python",
    overview: spec.overview,
    theory: spec.theory,
    explanation: spec.explanation,
    realWorldExample: spec.realWorldExample,
    architectureDiagram: spec.architectureDiagram,
    flowDiagram: spec.flowDiagram,
    syntax: spec.syntax,
    practicalExample: spec.practicalExample,
    bestPractices: ["Version embed model and index", "Eval before releases", "Filter by tenant", "Log retrieval traces"],
    commonMistakes: ["No eval golden set", "Huge chunks only", "Ignoring hybrid for entities", "Skipping abstention"],
    exercise: spec.exercise,
    assignment: spec.assignment,
    miniProject: spec.miniProject,
    quizQuestions: spec.quiz,
    interviewQuestions: spec.interview,
    summary: `${spec.title} is a critical layer in production RAG—optimize retrieval before chasing larger models.`,
    resources: ["LangChain RAG guide", "Pinecone learning center", "OpenAI embeddings docs"]
  })
);

export default RAG_SYSTEMS_CURRICULUM;
