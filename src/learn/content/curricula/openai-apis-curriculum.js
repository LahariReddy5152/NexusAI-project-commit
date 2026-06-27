import { buildLesson } from "../lesson-builder.js";

const LESSONS = [
  {
    title: "Chat Completions",
    overview: "The Chat Completions API sends role-based messages (system, user, assistant) to OpenAI models and returns generated replies—the core interface for conversational AI.",
    theory: "Messages array defines conversation state. Models (gpt-4o, gpt-4o-mini) differ in capability and cost. Parameters: temperature, max_tokens, top_p, stop sequences. Multi-turn: append assistant replies to messages for context.",
    explanation: "Use system message for policies; user for tasks. Trim history to fit context window. Handle finish_reason (stop, length, content_filter). Retry transient 429/5xx with exponential backoff.",
    realWorldExample: "Support widget maintains last 10 turns, calls chat.completions, streams tokens to UI.",
    architectureDiagram: `Client app → HTTPS → api.openai.com/v1/chat/completions → Model → JSON response`,
    flowDiagram: `Build messages[] → POST API → Parse choice.message → Append to history → Display`,
    syntax: `from openai import OpenAI\nclient = OpenAI()\nr = client.chat.completions.create(\n  model="gpt-4o-mini",\n  messages=[{"role":"user","content":"Hello"}]\n)`,
    practicalExample: `history = [{"role":"system","content":"You are helpful."}]\ndef chat(user):\n  history.append({"role":"user","content":user})\n  r = client.chat.completions.create(model="gpt-4o-mini", messages=history)\n  reply = r.choices[0].message.content\n  history.append({"role":"assistant","content":reply})\n  return reply`,
    exercise: "Implement multi-turn CLI with /reset and token estimate before send.",
    assignment: "Add retry wrapper for 429 with jittered backoff.",
    miniProject: "FastAPI /chat endpoint with session history in Redis.",
    quiz: [
      { question: "Chat API uses:", options: ["Messages array", "Only raw strings", "SQL queries", "CSS files"], correct: 0 },
      { question: "finish_reason 'length' means:", options: ["Hit max_tokens", "Network down", "Invalid key", "SQL error"], correct: 0 }
    ],
    interview: ["How to manage context length?", "Error handling strategy?", "Model selection criteria?"]
  },
  {
    title: "Embeddings API",
    overview: "The Embeddings API converts text into numerical vectors for semantic search, clustering, and RAG indexing.",
    theory: "Models like text-embedding-3-small output fixed-length vectors. Input can be string or array for batching. dimensions parameter optionally reduces size. Same model required for index and query.",
    explanation: "Batch inputs to reduce HTTP overhead. Cache embeddings for static documents. Normalize vectors if your index expects unit length.",
    realWorldExample: "Nightly job embeds product catalog; API queries embed user search text for vector lookup.",
    architectureDiagram: `Text batch → embeddings.create → float[][] → vector database`,
    flowDiagram: `Prepare texts → API call → Store vectors + metadata → Query time similarity`,
    syntax: `resp = client.embeddings.create(\n  model="text-embedding-3-small",\n  input=["doc one", "doc two"]\n)\nvectors = [d.embedding for d in resp.data]`,
    practicalExample: `import numpy as np\ndef cosine(a,b):\n  a,b=np.array(a),np.array(b)\n  return float(np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)))`,
    exercise: "Embed 100 sentences; find nearest neighbor for 5 queries.",
    assignment: "Compare cost/latency: 100 single requests vs 1 batch of 100.",
    miniProject: "Embedding cache keyed by SHA256 of text in SQLite.",
    quiz: [
      { question: "Embeddings API returns:", options: ["Vectors", "JPEG images", "SQL tables", "HTML"], correct: 0 },
      { question: "Query and index must share:", options: ["Same embedding model", "Different random models", "No model", "Only CSS"], correct: 0 }
    ],
    interview: ["Batching benefits?", "Dimension reduction tradeoffs?", "When to re-embed?"]
  },
  {
    title: "Function Calling",
    overview: "Function calling lets models emit structured tool invocations—arguments JSON matching your schema—for reliable integration with APIs and databases.",
    theory: "Define tools array with function name, description, parameters (JSON Schema). Model may return tool_calls instead of user-facing text. You execute tools, append tool role messages, model produces final answer.",
    explanation: "Write precise descriptions—model chooses tools from names/descriptions. Validate args before execution. Limit tool set per request to reduce confusion.",
    realWorldExample: "Assistant calls get_weather and book_meeting functions; server executes and returns JSON observations.",
    architectureDiagram: `LLM → tool_calls JSON → Your executor → tool results → LLM final reply`,
    flowDiagram: `User ask → Model picks tool → Execute → Return observation → Model summarizes`,
    syntax: `tools=[{"type":"function","function":{"name":"get_order","description":"Fetch order by id","parameters":{"type":"object","properties":{"id":{"type":"string"}},"required":["id"]}}}]`,
    practicalExample: `if msg.tool_calls:\n  for tc in msg.tool_calls:\n    args = json.loads(tc.function.arguments)\n    result = get_order(**args)`,
    exercise: "Implement weather + calculator tools with argument validation.",
    assignment: "Log and replay tool call traces for debugging.",
    miniProject: "Order lookup chatbot with two function tools and mock DB.",
    quiz: [
      { question: "tool_calls contain:", options: ["Function name and arguments", "Only images", "SQL migrations", "CSS"], correct: 0 },
      { question: "You must validate:", options: ["Arguments before execution", "Nothing", "Only colors", "Git SHA"], correct: 0 }
    ],
    interview: ["Function calling vs JSON mode?", "Security of tool execution?", "Multi-tool turns?"]
  },
  {
    title: "Streaming",
    overview: "Streaming returns tokens incrementally via SSE—improving perceived latency for chat UIs and long generations.",
    theory: "Set stream=True on chat.completions.create. Iterate chunks; delta.content holds new tokens. Handle stream end and errors mid-stream. Client disconnect should cancel upstream if supported.",
    explanation: "Buffer tokens for display; flush on punctuation for smoother UI. Aggregate full text server-side for logging. Don't assume first chunk has role metadata only—handle empty deltas.",
    realWorldExample: "Docs assistant renders answer word-by-word while user reads partial response.",
    architectureDiagram: `Client SSE ← API stream ← Model token generator`,
    flowDiagram: `Open stream → For each chunk append delta → On done persist full text`,
    syntax: `stream = client.chat.completions.create(model="gpt-4o-mini", messages=msgs, stream=True)\nfor chunk in stream:\n  if chunk.choices[0].delta.content:\n    print(chunk.choices[0].delta.content, end="")`,
    practicalExample: `async def stream_response(msgs):\n  stream = await client.chat.completions.create(..., stream=True)\n  async for event in stream:\n    yield event.choices[0].delta.content or ""`,
    exercise: "Build terminal streaming chat with typing indicator simulation.",
    assignment: "Handle client disconnect cancelling OpenAI stream in FastAPI.",
    miniProject: "React frontend consuming SSE stream from Python backend.",
    quiz: [
      { question: "Streaming improves:", options: ["Perceived latency", "SQL index size", "JVM heap", "DNS TTL"], correct: 0 },
      { question: "stream=True returns:", options: ["Iterable chunks", "Single blob only", "Image file", "Database row"], correct: 0 }
    ],
    interview: ["SSE vs WebSocket?", "Mid-stream errors?", "Logging partial streams?"]
  },
  {
    title: "Rate Limits",
    overview: "OpenAI rate limits cap requests and tokens per minute—requiring backoff, queuing, and capacity planning in production.",
    theory: "Limits vary by tier and model (RPM, TPM). 429 responses include retry-after hints. Burst traffic triggers throttling. Monitor usage dashboard and request limit increases before launch.",
    explanation: "Implement token bucket or queue workers. Exponential backoff with jitter on 429. Shard workloads across models if appropriate. Cache identical requests.",
    realWorldExample: "Launch day queue absorbs spikes; workers respect TPM budget per deployment.",
    architectureDiagram: `Traffic → Rate limiter queue → Worker pool → OpenAI API`,
    flowDiagram: `Request → Check budget → Queue if over → Retry 429 → Success/metrics`,
    syntax: `import time, random\ndef call_with_backoff(fn, max_retries=5):\n  for i in range(max_retries):\n    try: return fn()\n    except RateLimitError: time.sleep(2**i + random.random())`,
    practicalExample: `headers = response.headers  # retry-after, x-ratelimit-remaining-tokens`,
    exercise: "Simulate 429 handler with mock client; verify backoff timing.",
    assignment: "Capacity plan: DAU × avg tokens × peak factor → required TPM tier.",
    miniProject: "Redis-backed request queue with TPM counter per minute window.",
    quiz: [
      { question: "HTTP 429 means:", options: ["Rate limited", "Success", "Not found", "Invalid JSON"], correct: 0 },
      { question: "Backoff should use:", options: ["Jitter", "Zero delay always", "Infinite retry instantly", "Delete API key"], correct: 0 }
    ],
    interview: ["RPM vs TPM?", "Design for spikes?", "When to request increase?"]
  },
  {
    title: "Batch API",
    overview: "The Batch API processes large volumes of requests asynchronously at lower cost—ideal for offline embedding, classification, and eval jobs.",
    theory: "Upload JSONL input file; create batch job; poll status; download output file within 24h window. Discounted vs realtime. Not for interactive latency-sensitive paths.",
    explanation: "Each line is independent request. Validate JSONL schema before upload. Monitor failed lines in output. Combine with eval pipelines overnight.",
    realWorldExample: "Nightly batch embeds 2M support tickets for analytics warehouse.",
    architectureDiagram: `JSONL file → Batch job → Queue processing → output.jsonl`,
    flowDiagram: `Prepare JSONL → Upload file → Create batch → Poll → Download results`,
    syntax: `batch = client.batches.create(\n  input_file_id=file_id,\n  endpoint="/v1/chat/completions",\n  completion_window="24h"\n)`,
    practicalExample: `# Each JSONL line:\n{"custom_id":"req-1","method":"POST","url":"/v1/chat/completions","body":{"model":"gpt-4o-mini","messages":[...]}}`,
    exercise: "Create 50-line JSONL for sentiment classification batch.",
    assignment: "Compare cost estimate: batch vs realtime for 100k requests.",
    miniProject: "Batch runner script: submit, poll, merge outputs to CSV.",
    quiz: [
      { question: "Batch API suits:", options: ["Offline bulk jobs", "Sub-100ms chat UI", "CSS only", "TCP routing"], correct: 0 },
      { question: "Input format is:", options: ["JSONL", "Binary EXE", "PNG", "WAV"], correct: 0 }
    ],
    interview: ["Batch vs realtime when?", "Failure line handling?", "SLA window implications?"]
  }
];

export const OPENAI_APIS_CURRICULUM = LESSONS.map((spec) =>
  buildLesson({
    title: spec.title,
    description: spec.overview.slice(0, 100),
    difficulty: spec.title === "Chat Completions" ? "Beginner" : "Intermediate",
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
    bestPractices: ["Never expose API keys client-side", "Retry transient errors", "Log request ids", "Monitor token usage"],
    commonMistakes: ["Leaking keys in frontend", "No backoff on 429", "Unbounded message history", "Ignoring content_filter"],
    exercise: spec.exercise,
    assignment: spec.assignment,
    miniProject: spec.miniProject,
    quizQuestions: spec.quiz,
    interviewQuestions: spec.interview,
    summary: `${spec.title} is a building block for production OpenAI integrations—handle errors, cost, and security from day one.`,
    resources: ["OpenAI API reference", "OpenAI cookbook", "Platform rate limits docs"]
  })
);

export default OPENAI_APIS_CURRICULUM;
