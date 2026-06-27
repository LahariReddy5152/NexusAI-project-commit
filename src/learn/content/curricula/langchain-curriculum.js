import { buildLesson } from "../lesson-builder.js";

const LESSONS = [
  {
    title: "Chains",
    overview: "LangChain chains compose LLM calls and utilities into pipelines—prompt → model → parser—for repeatable workflows.",
    theory: "Classic chains: LLMChain, SequentialChain. LCEL (LangChain Expression Language) preferred now: prompt | model | parser with Runnable interface. Chains enable reuse, testing, and streaming.",
    explanation: "Keep chains single-purpose. Pass RunnableConfig for tags/metadata. Use fallbacks for model outages. Serialize prompts separately from code.",
    realWorldExample: "Support chain: classify ticket → route to specialized sub-chain → format JSON response.",
    architectureDiagram: `PromptTemplate → ChatModel → OutputParser → result`,
    flowDiagram: `Input dict → chain.invoke → parsed output`,
    syntax: `from langchain_openai import ChatOpenAI\nfrom langchain_core.prompts import ChatPromptTemplate\nchain = prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()`,
    practicalExample: `result = chain.invoke({"topic": "RAG"})\nfor chunk in chain.stream({"topic": "agents"}):\n  print(chunk, end="")`,
    exercise: "Build sequential chain: summarize → extract action items.",
    assignment: "Add fallback model if primary times out.",
    miniProject: "Three-chain router by ticket category.",
    quiz: [
      { question: "LCEL uses:", options: ["Pipe operator composition", "Only SQL", "CSS imports", "JVM bytecode"], correct: 0 },
      { question: "Chains help:", options: ["Reuse and test pipelines", "Delete vectors", "Style HTML", "Compile Java"], correct: 0 }
    ],
    interview: ["Chain vs agent?", "Streaming chains?", "Testing strategies?"]
  },
  {
    title: "Agents",
    overview: "LangChain agents let models decide which tools to call and iterate until completing a goal—beyond fixed chains.",
    theory: "AgentExecutor (legacy) or LangGraph for controlled loops. Tools are Runnables with schemas. Stopping: max iterations, return_direct tools, human approval.",
    explanation: "Start with few tools. Log agent steps. Use structured scratchpad. Prefer LangGraph for production control flow and checkpoints.",
    realWorldExample: "Research agent searches docs, reads pages, drafts report with citations.",
    architectureDiagram: `Agent → Tool calls → Environment → Observations → Agent`,
    flowDiagram: `Goal → plan → act → observe → loop until stop`,
    syntax: `from langgraph.prebuilt import create_react_agent\nagent = create_react_agent(model, tools)\nagent.invoke({"messages": [("user", "Find Q3 revenue")]})`,
    practicalExample: `for step in agent.stream({"messages": messages}):\n  print(step)`,
    exercise: "Create ReAct agent with search + calculator tools.",
    assignment: "Set max_iterations=5; analyze failure when exceeded.",
    miniProject: "Agent with human approve step before email tool.",
    quiz: [
      { question: "Agents differ from chains by:", options: ["Dynamic tool choice", "Fixed steps only", "No LLM", "SQL only"], correct: 0 },
      { question: "max_iterations prevents:", options: ["Infinite loops", "All errors", "Logging", "Embeddings"], correct: 0 }
    ],
    interview: ["Agent reliability issues?", "LangGraph benefits?", "Human-in-the-loop?"]
  },
  {
    title: "Tools",
    overview: "Tools wrap functions APIs with name, description, and schema so agents and models invoke capabilities safely.",
    theory: "@tool decorator or StructuredTool.from_function. Descriptions drive when model selects tool. Return strings model can read. Handle errors gracefully in tool body.",
    explanation: "Least privilege: expose only needed tools per agent. Validate inputs. Timeout long operations. Never pass secrets in tool descriptions.",
    realWorldExample: "CRM tool fetches account; SQL tool read-only with row limits.",
    architectureDiagram: `LLM → tool_call → Tool function → string observation`,
    flowDiagram: `Model selects tool → validate args → execute → return observation`,
    syntax: `from langchain_core.tools import tool\n@tool\ndef lookup_sku(sku: str) -> str:\n  """Fetch product name by SKU."""\n  return db.get(sku)`,
    practicalExample: `tools = [lookup_sku, search_docs]\nagent = create_react_agent(model, tools)`,
    exercise: "Write tool with pydantic args schema and unit test.",
    assignment: "Threat model: prompt injection via tool outputs.",
    miniProject: "Toolkit: weather API + internal HTTP tool with auth.",
    quiz: [
      { question: "Tool descriptions guide:", options: ["Model tool selection", "CSS layout", "DNS", "JVM GC"], correct: 0 },
      { question: "Tools should return:", options: ["Strings model can parse", "Binary images only", "Nothing", "SQL DDL"], correct: 0 }
    ],
    interview: ["Tool design best practices?", "Error handling?", "Security boundaries?"]
  },
  {
    title: "Memory",
    overview: "Memory persists conversation state across turns—buffer, window, or summary strategies balance context and token cost.",
    theory: "ChatMessageHistory stores messages. ConversationBufferWindowMemory keeps last k turns. Summary memory compresses older turns via LLM. Production: store sessions in Redis with TTL.",
    explanation: "Trim history to fit context. Summarize long threads asynchronously. Don't store secrets unencrypted. Tie session to user auth.",
    realWorldExample: "Shopping assistant remembers cart preferences within session; resets after checkout.",
    architectureDiagram: `Session store ← Memory → Chain/Agent → LLM`,
    flowDiagram: `Load history → append user msg → invoke → save assistant msg`,
    syntax: `from langchain.memory import ConversationBufferWindowMemory\nmemory = ConversationBufferWindowMemory(k=6, return_messages=True)`,
    practicalExample: `history = RedisChatMessageHistory(session_id="user-42")\nchain_with_history = RunnableWithMessageHistory(chain, get_session_history)`,
    exercise: "Implement sliding window memory keeping last 8 messages.",
    assignment: "Compare token usage: full buffer vs summary memory.",
    miniProject: "Redis-backed chat sessions with TTL and /reset endpoint.",
    quiz: [
      { question: "Window memory keeps:", options: ["Last k turns", "All messages forever", "Only system prompt", "SQL schema"], correct: 0 },
      { question: "Summary memory trades:", options: ["Detail for fewer tokens", "All accuracy", "Security", "Indexes"], correct: 0 }
    ],
    interview: ["Memory types?", "Production storage?", "PII in history?"]
  },
  {
    title: "Document Loaders",
    overview: "Document loaders ingest files and URLs into LangChain Document objects for chunking and retrieval pipelines.",
    theory: "Loaders: PyPDF, TextLoader, WebBaseLoader, Notion, etc. Return list[Document] with page_content + metadata. Combine with splitters before embedding.",
    explanation: "Normalize encodings. Capture source URLs and page numbers in metadata. Handle loader failures per file in batch jobs.",
    realWorldExample: "Nightly job loads S3 PDFs into documents, chunks, embeds to vector store.",
    architectureDiagram: `Source (PDF/URL) → Loader → Documents → Splitter → Embed`,
    flowDiagram: `Pick loader → load() → split → downstream RAG`,
    syntax: `from langchain_community.document_loaders import PyPDFLoader\nloader = PyPDFLoader("handbook.pdf")\ndocs = loader.load()`,
    practicalExample: `for doc in docs:\n  doc.metadata["source"] = "handbook.pdf"`,
    exercise: "Load mixed folder PDF+txt; uniform metadata schema.",
    assignment: "Error handling report for corrupted PDFs in batch.",
    miniProject: "Ingestion worker watching folder with loaders + chunker.",
    quiz: [
      { question: "Document loaders output:", options: ["Document objects", "Only images", "SQL tables", "CSS"], correct: 0 },
      { question: "Metadata should track:", options: ["Source and page", "Random only", "TCP port", "JVM flag"], correct: 0 }
    ],
    interview: ["Loader selection?", "Metadata design?", "Batch ingest patterns?"]
  },
  {
    title: "LCEL",
    overview: "LangChain Expression Language composes Runnables with | for streaming, batching, parallelism, and config—modern LangChain core pattern.",
    theory: "Runnable: invoke, batch, stream, ainvoke. pipe chains steps. RunnableParallel runs branches. RunnableLambda wraps functions. Configurable fields for runtime model swap.",
    explanation: "Prefer LCEL over legacy Chain classes. Use .with_config(tags=[]) for tracing. Stream tokens end-to-end to clients.",
    realWorldExample: "RAG LCEL: retriever | format_docs | prompt | model | parser with single stream().",
    architectureDiagram: `input → Runnable steps (|) → output\n         ↘ parallel branches`,
    flowDiagram: `Define pipeline → invoke/stream → LangSmith trace`,
    syntax: `rag_chain = (\n  {"context": retriever | format_docs, "question": RunnablePassthrough()}\n  | prompt | model | StrOutputParser()\n)`,
    practicalExample: `answer = rag_chain.invoke("What is our refund policy?")`,
    exercise: "Build LCEL chain with RunnableParallel for two prompts.",
    assignment: "Enable LangSmith tracing on chain; inspect spans.",
    miniProject: "Full RAG chain in LCEL with streaming endpoint.",
    quiz: [
      { question: "LCEL pipe operator:", options: ["Chains Runnables", "SQL JOIN", "CSS flex", "Git merge"], correct: 0 },
      { question: "Runnable supports:", options: ["stream and batch", "Only print", "No async", "Only Java"], correct: 0 }
    ],
    interview: ["LCEL vs legacy?", "Parallel runnables?", "Debugging traces?"]
  },
  {
    title: "RAG Integration",
    overview: "LangChain integrates retrievers, vector stores, and prompts into end-to-end RAG applications with minimal glue code.",
    theory: "VectorStoreRetriever from Chroma/Pinecone/pgvector. create_retrieval_chain or LCEL retriever pipe. Pass retrieved docs to prompt template. Return source documents in response for UI.",
    explanation: "Tune retriever search_kwargs k. Use MultiQueryRetriever for paraphrased searches. Return source_documents in API JSON for citations.",
    realWorldExample: "Internal wiki bot using Chroma + OpenAI with cited answers in Slack.",
    architectureDiagram: `Vector store ← embed ← ingest\nQuery → retriever → RAG chain → answer + sources`,
    flowDiagram: `Ingest docs → retriever ready → user query → RAG invoke → show cites`,
    syntax: `from langchain.chains import create_retrieval_chain\nchain = create_retrieval_chain(retriever, combine_docs_chain)`,
    practicalExample: `resp = chain.invoke({"input": "PTO policy?"})\nprint(resp["answer"], resp["context"])`,
    exercise: "Wire Chroma retriever into LCEL RAG with source docs in output.",
    assignment: "Eval recall@5 before/after MultiQueryRetriever.",
    miniProject: "Wiki RAG API returning answer + source list JSON.",
    quiz: [
      { question: "Retriever returns:", options: ["Relevant documents", "Only model weights", "CSS", "TCP packets"], correct: 0 },
      { question: "Source docs in API help:", options: ["Citations in UI", "Delete index", "Skip eval", "Disable LLM"], correct: 0 }
    ],
    interview: ["Retriever tuning?", "LangChain vector stores?", "Citation UX?"]
  },
  {
    title: "Production Patterns",
    overview: "Production LangChain apps need observability, config management, deployment patterns, and guardrails—not notebook prototypes.",
    theory: "LangSmith for traces/evals. Environment-based config for models and keys. Containerized API workers. Feature flags for agents. Rate limiting and caching at gateway.",
    explanation: "Separate ingest from serving. Version prompts in git. Run eval CI on chains. Redact PII in logs. Health checks on dependencies (vector DB, OpenAI).",
    realWorldExample: "Team runs LangSmith evals on PRs; deploys FastAPI + LangServe with autoscaling.",
    architectureDiagram: `API Gateway → LangChain service → LLM/Vector DB\nLangSmith ← traces\nCI ← eval suite`,
    flowDiagram: `PR → eval chain → deploy → monitor traces → rollback if SLO breach`,
    syntax: `import os\nos.environ["LANGCHAIN_TRACING_V2"] = "true"\nos.environ["LANGCHAIN_PROJECT"] = "prod-support"`,
    practicalExample: `from langserve import add_routes\nadd_routes(app, chain, path="/support")`,
    exercise: "Enable LangSmith on existing chain; capture one trace URL.",
    assignment: "Production checklist: secrets, rate limits, evals, rollback.",
    miniProject: "Dockerized LangServe app with health check and env config.",
    quiz: [
      { question: "LangSmith provides:", options: ["Tracing and evals", "Only CSS", "SQL migrations", "DNS hosting"], correct: 0 },
      { question: "Ingest and serving should:", options: ["Deploy separately", "Share one notebook only", "Skip monitoring", "Avoid tests"], correct: 0 }
    ],
    interview: ["Prod vs prototype gaps?", "LangServe use case?", "Eval in CI?"]
  }
];

export const LANGCHAIN_CURRICULUM = LESSONS.map((spec) =>
  buildLesson({
    title: spec.title,
    description: spec.overview.slice(0, 100),
    difficulty: spec.title === "Chains" ? "Beginner" : "Intermediate",
    duration: "28 min",
    codeLang: "python",
    overview: spec.overview,
    theory: spec.theory,
    explanation: spec.explanation,
    realWorldExample: spec.realWorldExample,
    architectureDiagram: spec.architectureDiagram,
    flowDiagram: spec.flowDiagram,
    syntax: spec.syntax,
    practicalExample: spec.practicalExample,
    bestPractices: ["Use LCEL for new code", "Trace with LangSmith", "Version prompts", "Limit agent tools"],
    commonMistakes: ["Notebook-only deploy", "No eval CI", "Huge agent toolsets", "Logging secrets"],
    exercise: spec.exercise,
    assignment: spec.assignment,
    miniProject: spec.miniProject,
    quizQuestions: spec.quiz,
    interviewQuestions: spec.interview,
    summary: `${spec.title} in LangChain enables maintainable LLM apps—compose with LCEL and operate with observability.`,
    resources: ["LangChain docs", "LangSmith", "LangGraph guides"]
  })
);

export default LANGCHAIN_CURRICULUM;
