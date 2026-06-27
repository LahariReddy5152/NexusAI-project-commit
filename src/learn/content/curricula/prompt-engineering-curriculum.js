import { buildLesson } from "../lesson-builder.js";

export const PROMPT_ENGINEERING_CURRICULUM = [
  buildLesson({
    title: "Prompt Basics",
    description: "Zero-shot prompting, instructions, constraints, and output format",
    difficulty: "Beginner",
    duration: "25 min",
    codeLang: "python",
    overview: "Prompt engineering is the practice of designing inputs to LLMs to get reliable, useful outputs. This lesson covers zero-shot prompts, clear instructions, constraints, and formatting—before few-shot or chain-of-thought techniques.",
    theory: "LLMs predict tokens conditioned on context. Zero-shot prompting provides only instructions and the task—no examples. Quality depends on clarity, role, constraints, and specifying output format (JSON, bullets, steps). Temperature and max_tokens affect creativity and length.",
    explanation: "Structure prompts: (1) role/system context, (2) task, (3) constraints/guardrails, (4) input data, (5) output schema. Iterate with eval sets; small wording changes can shift behavior dramatically.",
    realWorldExample: "Support bots use zero-shot prompts with strict JSON schemas for ticket classification. Legal teams constrain models to cite provided documents only.",
    architectureDiagram: `User / App\n    │\n    ▼\n┌─────────────┐\n│ Prompt      │\n│ template    │\n└──────┬──────┘\n       ▼\n┌─────────────┐\n│ LLM API     │\n└──────┬──────┘\n       ▼\n  Parsed output`,
    flowDiagram: `Define task → Draft prompt → Run eval cases → Measure quality → Refine wording → Deploy with versioning`,
    syntax: `prompt = """You are a concise technical writer.\nTask: Summarize the text in 3 bullet points.\nConstraints: No invented facts. Max 60 words.\nText: {document}\n"""`,
    practicalExample: `messages = [\n  {"role": "system", "content": "You classify support tickets."},\n  {"role": "user", "content": "Ticket: 'Refund not received after 10 days'\\nReturn JSON: {category, urgency}"}\n]`,
    bestPractices: ["Be explicit about format", "Separate instructions from data", "Version prompts in git", "Evaluate on real user samples"],
    commonMistakes: ["Vague verbs ('analyze' without criteria)", "No negative constraints", "Huge unbounded context", "Ignoring model limits"],
    exercise: "Write zero-shot prompts for: sentiment analysis, meeting summary, and SQL generation from schema.",
    assignment: "Create a prompt rubric scoring clarity, constraints, and format specification (1–5 each).",
    miniProject: "Build a prompt tester CLI: load CSV of inputs, run prompt template, save outputs for review.",
    quizQuestions: [
      { question: "Zero-shot means:", options: ["No examples in prompt", "No model", "No API key", "No JSON"], correct: 0 },
      { question: "System message typically sets:", options: ["API URL", "Role and rules", "Database password", "CSS"], correct: 1 }
    ],
    interviewQuestions: ["Zero-shot vs few-shot?", "How do you reduce hallucinations in prompts?"],
    summary: "Strong basics: clear task, constraints, and output format. Evaluate before adding complexity.",
    resources: ["OpenAI prompt guide", "Anthropic prompt library", "DAIR prompt injection primer"]
  }),
  buildLesson({
    title: "Few-shot Prompting",
    description: "Example selection, ordering, and when few-shot beats fine-tuning",
    difficulty: "Beginner",
    duration: "28 min",
    codeLang: "python",
    overview: "Few-shot prompting includes input-output examples in the prompt to steer model behavior without weight updates. Learn to select diverse examples and when few-shot is enough vs fine-tuning.",
    theory: "In-context learning lets models infer patterns from examples embedded in the prompt. Example order and diversity affect results. More shots increase tokens and cost; diminishing returns after a handful for many tasks.",
    explanation: "Pick examples covering edge cases and label balance. Use consistent formatting between examples and expected answer. For classification, include one example per class when possible.",
    realWorldExample: "Invoice parsers use 3–5 JSON examples per vendor layout. Code assistants use few-shot for house style conventions.",
    architectureDiagram: `Prompt = instructions + Example 1 + Example 2 + ... + new input`,
    flowDiagram: `Curate examples → Format consistently → Test on holdout → Measure accuracy → Trim shots for cost`,
    syntax: `prompt = f"""Classify intent.\\nExample: 'reset password' -> account\\nExample: 'charge dispute' -> billing\\nInput: {user_text} ->"""`,
    practicalExample: `examples = [("track my order", "shipping"), ("cancel subscription", "billing")]\nshots = "\\n".join(f"Q: {q} A: {a}" for q,a in examples)\nprompt = f"{shots}\\nQ: {query} A:"`,
    bestPractices: ["Curate diverse representative examples", "Keep format consistent", "Trim shots to control cost", "Evaluate on held-out cases"],
    commonMistakes: ["Examples contradict instructions", "Too many shots blowing context", "Order bias in examples", "No eval set"],
    exercise: "Improve a sentiment classifier from 60% to 80% accuracy by curating 4 few-shot examples.",
    assignment: "Compare 0-shot, 2-shot, and 5-shot on the same eval set; plot accuracy vs token cost.",
    miniProject: "Few-shot email triage: 5 categories, 15 test emails, report confusion matrix.",
    quizQuestions: [
      { question: "Few-shot adds:", options: ["Examples to context", "More GPUs", "SQL indexes", "CSS"], correct: 0 },
      { question: "Example order can:", options: ["Never matter", "Bias model behavior", "Disable API", "Remove tokens"], correct: 1 }
    ],
    interviewQuestions: ["When is few-shot insufficient?", "How to pick examples?"],
    summary: "Few-shot is fast to iterate—curate examples like a dataset. Watch token limits and cost.",
    resources: ["OpenAI cookbook", "Lil'Log in-context learning"]
  }),
  buildLesson({
    title: "Chain of Thought",
    description: "Step-by-step reasoning prompts for math, logic, and multi-hop tasks",
    difficulty: "Intermediate",
    duration: "30 min",
    codeLang: "python",
    overview: "Chain-of-Thought (CoT) prompting asks the model to show intermediate reasoning before the final answer, improving accuracy on math, logic, and planning tasks.",
    theory: "CoT increases compute in the output channel but reduces errors by decomposing problems. Variants: zero-shot CoT ('think step by step'), few-shot CoT with worked examples, and self-consistency (sample multiple chains, majority vote).",
    explanation: "Use CoT when tasks require multiple hops; skip for simple extraction where latency matters. Parse final answer with delimiters or structured output.",
    realWorldExample: "Grading math homework, debugging assistance, and multi-step compliance checklists use CoT before a yes/no decision.",
    architectureDiagram: `Question → CoT reasoning tokens → Final answer\n(Self-consistency: N chains → vote)`,
    flowDiagram: `Prompt with CoT instruction → Model generates steps → Extract final line → Validate → Optional retry`,
    syntax: `prompt = "Solve step by step. Show reasoning, then answer on last line as ANSWER: <value>"`,
    practicalExample: `prompt = """A tank holds 120L. 25% is drained, then 15L added. How much now?\nThink step by step."""`,
    bestPractices: ["Ask for steps before final answer", "Use delimiters for parsing", "Set max tokens appropriately", "Validate final answer format"],
    commonMistakes: ["No delimiter for final answer", "CoT on simple extraction tasks", "Ignoring latency cost", "Skipping verification of final step"],
    exercise: "Create CoT prompts for 3 word problems; compare accuracy with and without CoT.",
    assignment: "Implement self-consistency with 3 samples and majority vote on a logic puzzle set.",
    miniProject: "CoT math tutor: user question → model steps → highlight final answer in UI.",
    quizQuestions: [
      { question: "CoT primarily improves:", options: ["Image resolution", "Multi-step reasoning", "DNS", "Joins"], correct: 1 },
      { question: "Self-consistency uses:", options: ["Multiple sampled chains", "One token only", "No model", "CSS"], correct: 0 }
    ],
    interviewQuestions: ["CoT vs tool use?", "Latency tradeoffs of CoT?"],
    summary: "CoT trades tokens for reasoning quality—evaluate on your task before defaulting to it.",
    resources: ["Wei et al. CoT paper", "OpenAI reasoning models guide"]
  })
];

const PE_EXTENDED = [
  {
    title: "Role Prompting",
    overview: "Role prompting assigns persona, expertise level, and tone so the model behaves like a domain expert or brand voice consistently.",
    theory: "System or user messages declare role: 'You are a senior SRE reviewing incidents.' Roles set priors on vocabulary and caution level. Combine with constraints to bound hallucination risk.",
    explanation: "Be specific: audience, goals, forbidden behaviors. Avoid contradictory roles. Test role drift on long conversations; re-inject role in system message if needed.",
    realWorldExample: "Banking assistant role: licensed-style disclaimers, no investment promises, formal tone.",
    architectureDiagram: `System: role + rules → User message → LLM → Role-consistent reply`,
    flowDiagram: `Define persona → Encode in system prompt → Test edge cases → Version in registry`,
    syntax: `SYSTEM = """You are a patient Python tutor for beginners.\nExplain simply. Use short examples. Never write unsafe code."""`,
    practicalExample: `messages=[{"role":"system","content":SYSTEM},{"role":"user","content":"Explain list comprehensions"}]`,
    exercise: "Write three roles for the same 'summarize article' task; compare outputs.",
    assignment: "Define brand voice rubric and score 20 responses from different role prompts.",
    miniProject: "Role library YAML + CLI that swaps personas for a chat demo.",
    quiz: [
      { question: "Role prompts primarily shape:", options: ["Tone and expertise", "TCP routing", "SQL indexes", "JVM GC"], correct: 0 },
      { question: "Roles should be:", options: ["Specific and consistent", "Vague", "Contradictory", "Empty"], correct: 0 }
    ],
    interview: ["Role vs system prompt?", "Role drift in long chats?", "Safety boundaries?"]
  },
  {
    title: "System Prompts",
    overview: "System prompts set persistent global instructions: capabilities, refusals, tool policies, and output contracts across a session.",
    theory: "In chat APIs, system message has highest authority in stack. Layer: safety policies, tool usage rules, format requirements. Keep stable; version in git. User messages should not override safety system rules.",
    explanation: "Split system prompt into sections: identity, capabilities, constraints, format. Avoid megaprompts—use retrieval for dynamic facts. Log system version with each trace.",
    realWorldExample: "Enterprise copilot system prompt enforces 'answer only from retrieved docs' and citation format.",
    architectureDiagram: `System prompt (policy) + Tools config + User/assistant turns`,
    flowDiagram: `Author system prompt → Eval suite → Deploy version → Monitor violations`,
    syntax: `{"role":"system","content":"You must cite chunk ids. Refuse legal advice. Output JSON only."}`,
    practicalExample: `SYSTEM_V2 = open("prompts/support_system_v2.txt").read()`,
    exercise: "Add citation-required clause; verify model cites on 10 RAG cases.",
    assignment: "Diff system v1 vs v2 and explain expected behavior changes.",
    miniProject: "Prompt registry: load system prompt by version env var.",
    quiz: [
      { question: "System message sets:", options: ["Global behavior rules", "Database password", "CSS theme", "Git branch"], correct: 0 },
      { question: "System prompts should be:", options: ["Version controlled", "Never tested", "Random per request", "Only in user msg"], correct: 0 }
    ],
    interview: ["System vs developer message?", "How to test system changes?", "Injection via user text?"]
  },
  {
    title: "RAG Prompting",
    overview: "RAG prompting instructs the model how to use retrieved context: cite sources, abstain when insufficient, and avoid blending external knowledge.",
    theory: "Template slots: {context}, {question}. Instructions: 'If answer not in context, say I don't know.' Citation formats: [doc_id] or footnotes. Reduce hallucination by penalizing uncited claims in eval.",
    explanation: "Order context chunks by relevance score. Deduplicate overlapping chunks. Cap total tokens; summarize chunks if needed. Separate instructions from raw context with delimiters.",
    realWorldExample: "Policy bot answers with paragraph + bullet sources linking to PDF sections.",
    architectureDiagram: `Retriever → context block → RAG prompt template → LLM → cited answer`,
    flowDiagram: `Retrieve → Format context → Fill template → Generate → Validate citations`,
    syntax: `prompt = f"""Use ONLY the context below.\\nContext:\\n{context}\\n\\nQuestion: {q}\\nCite chunk ids."""`,
    practicalExample: `context="\\n---\\n".join(f"[{c['id']}] {c['text']}" for c in chunks)`,
    exercise: "Write RAG prompt with abstention rule; test on missing-info questions.",
    assignment: "Measure faithfulness before/after adding citation instructions.",
    miniProject: "RAG answer UI highlighting cited chunk spans.",
    quiz: [
      { question: "RAG prompts should instruct:", options: ["Ground in retrieved context", "Ignore context", "Invent citations", "Skip retrieval"], correct: 0 },
      { question: "Delimiters help:", options: ["Separate instructions from data", "Speed up GPU", "Parse SQL", "Style CSS"], correct: 0 }
    ],
    interview: ["Abstention wording?", "Citation formats?", "Context ordering?"]
  },
  {
    title: "Agent Prompting",
    overview: "Agent prompting teaches models to plan, select tools, observe results, and iterate—powering ReAct and multi-step automation.",
    theory: "ReAct pattern: Thought → Action → Observation loops. Tool schemas describe APIs model may call. Stop conditions: final answer token, max steps, budget. Guardrails on allowed tools per user role.",
    explanation: "Clear tool descriptions and argument JSON schemas. Force structured action blocks for parsing. Log each step for debugging. Human approval for destructive tools.",
    realWorldExample: "Sales agent queries CRM, drafts email, waits for human approve before send.",
    architectureDiagram: `Planner LLM ↔ Tool router → APIs/DB → Observations back to LLM`,
    flowDiagram: `User goal → Plan step → Call tool → Observe → Repeat → Final answer`,
    syntax: `tools=[{"type":"function","function":{"name":"search_orders","parameters":{...}}}]\n# model returns tool_calls → execute → feed results`,
    practicalExample: `# loop: if message.tool_calls: run tool; append tool result message`,
    exercise: "Design 3 tools for calendar agent; write system prompt for safe booking.",
    assignment: "Enumerate failure modes when tool returns empty or errors.",
    miniProject: "ReAct loop script with mock search and calculator tools.",
    quiz: [
      { question: "ReAct alternates:", options: ["Reasoning and actions", "Only embeddings", "SQL only", "CSS only"], correct: 0 },
      { question: "Tool schemas help:", options: ["Model pick valid calls", "Delete database", "Compile Java", "Paint UI"], correct: 0 }
    ],
    interview: ["Agent vs chain?", "Max steps tradeoffs?", "Human-in-the-loop when?"]
  },
  {
    title: "Structured Output",
    overview: "Structured output constrains LLM responses to JSON, enums, or function arguments—enabling reliable downstream parsing.",
    theory: "JSON mode / response_format json_object. Function calling returns typed args. Validate with Pydantic/jsonschema after generation. Repair loops on parse failure with error feedback.",
    explanation: "Provide schema in prompt and API where supported. Few-shot JSON examples help. Never trust without validation—models can emit invalid JSON.",
    realWorldExample: "Invoice extractor returns {vendor, date, line_items[]} parsed into accounting API.",
    architectureDiagram: `LLM → JSON/function args → Validator → Typed object → App logic`,
    flowDiagram: `Define schema → Prompt + response_format → Parse → Validate → Retry if invalid`,
    syntax: `response = client.chat.completions.create(\n  model="gpt-4o-mini",\n  response_format={"type":"json_object"},\n  messages=[...]\n)`,
    practicalExample: `from pydantic import BaseModel\nclass Ticket(BaseModel):\n  category: str\n  urgency: int`,
    exercise: "Extract meeting {title, date, attendees[]} from text; validate with Pydantic.",
    assignment: "Build retry prompt that feeds validation errors back to model.",
    miniProject: "Form-filler API: unstructured email → structured JSON for CRM.",
    quiz: [
      { question: "Structured output enables:", options: ["Reliable parsing", "Free hallucinations", "No schema", "Only images"], correct: 0 },
      { question: "After LLM JSON you should:", options: ["Validate schema", "Trust blindly", "Skip checks", "Delete output"], correct: 0 }
    ],
    interview: ["JSON mode vs function calling?", "Repair strategies?", "Schema design tips?"]
  }
];

for (const spec of PE_EXTENDED) {
  PROMPT_ENGINEERING_CURRICULUM.push(
    buildLesson({
      title: spec.title,
      description: spec.overview.slice(0, 100),
      difficulty: "Intermediate",
      duration: "26 min",
      codeLang: "python",
      overview: spec.overview,
      theory: spec.theory,
      explanation: spec.explanation,
      realWorldExample: spec.realWorldExample,
      architectureDiagram: spec.architectureDiagram,
      flowDiagram: spec.flowDiagram,
      syntax: spec.syntax,
      practicalExample: spec.practicalExample,
      bestPractices: ["Version prompts in git", "Evaluate on real utterances", "Add safety guardrails", "Log prompts in staging"],
      commonMistakes: ["No regression evals", "Overlong prompts", "Missing parse validation", "Ignoring injection"],
      exercise: spec.exercise,
      assignment: spec.assignment,
      miniProject: spec.miniProject,
      quizQuestions: spec.quiz,
      interviewQuestions: spec.interview,
      summary: `${spec.title} strengthens production LLM apps—measure, validate, and version every change.`,
      resources: ["OpenAI docs", "Anthropic guides", "LangChain prompting"]
    })
  );
}

export default PROMPT_ENGINEERING_CURRICULUM;
