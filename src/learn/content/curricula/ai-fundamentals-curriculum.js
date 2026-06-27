import { buildLesson } from "../lesson-builder.js";

export const AI_FUNDAMENTALS_CURRICULUM = [
  buildLesson({
    title: "ML Foundations",
    description: "AI vs ML, supervised and unsupervised learning, and the ML workflow",
    difficulty: "Beginner",
    duration: "30 min",
    codeLang: "python",
    overview: "Machine Learning is a subset of AI where systems learn patterns from data instead of explicit rules. This lesson distinguishes AI vs ML, covers supervised and unsupervised learning, and outlines the end-to-end ML workflow used in production.",
    theory: "Artificial Intelligence is the broad goal of machines performing tasks that require human-like intelligence. Machine Learning achieves AI by optimizing model parameters on data. Supervised learning uses labeled examples (input → target). Unsupervised learning finds structure in unlabeled data (clusters, anomalies). Reinforcement learning optimizes actions via rewards.",
    explanation: "A typical ML pipeline: define problem → collect/clean data → feature engineering → train model → evaluate on holdout set → deploy → monitor drift. Models generalize from training data; poor data or leakage causes production failures.",
    realWorldExample: "Spam filters (supervised classification), customer segmentation (unsupervised clustering), and recommendation engines (matrix factorization / deep learning) all ship as ML components inside larger products.",
    architectureDiagram: `┌──────────┐   ┌─────────────┐   ┌─────────┐   ┌──────────┐
│ Raw Data │──►│ Features    │──►│ Model   │──►│ Prediction│
│ (logs,   │   │ Engineering │   │ Training│   │ API      │
│  tables) │   └─────────────┘   └─────────┘   └──────────┘
└──────────┘         │                │
                     ▼                ▼
               ┌──────────┐    ┌──────────┐
               │ Labels   │    │ Metrics  │
               │ (supervised)   │ & Monitor│
               └──────────┘    └──────────┘`,
    flowDiagram: `Problem definition → Data collection → Train/validation split → Model selection → Train → Evaluate metrics → Deploy → Monitor drift`,
    syntax: `# Supervised classification sketch\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = LogisticRegression().fit(X_train, y_train)\nprint(model.score(X_test, y_test))`,
    practicalExample: `# Unsupervised: customer segments\nfrom sklearn.cluster import KMeans\nimport numpy as np\nfeatures = np.column_stack([spend, visits])\nkmeans = KMeans(n_clusters=3, random_state=42).fit(features)\nlabels = kmeans.labels_`,
    bestPractices: ["Hold out test data never seen during training", "Track data lineage and label quality", "Start with simple baselines", "Document metrics and failure modes"],
    commonMistakes: ["Training on test data (leakage)", "Optimizing accuracy on imbalanced data", "Deploying without monitoring", "Confusing correlation with causation"],
    exercise: "Given churn labels, train a logistic regression baseline and report precision/recall on a test split.",
    assignment: "Compare supervised vs unsupervised approaches for fraud detection—when is each appropriate?",
    miniProject: "Build a tabular ML mini-pipeline: CSV load → train/test split → train two models → pick best by F1 → save metrics JSON.",
    quizQuestions: [
      { question: "ML is best described as:", options: ["Only rules", "Learning from data", "Only neural nets", "Only robotics"], correct: 1 },
      { question: "Supervised learning requires:", options: ["Labels", "No data", "Only images", "Kubernetes"], correct: 0 },
      { question: "Unsupervised learning often finds:", options: ["Only labels", "Clusters/patterns", "HTTP routes", "CSS"], correct: 1 }
    ],
    interviewQuestions: ["AI vs ML vs deep learning?", "Explain bias-variance tradeoff.", "How do you detect data leakage?"],
    summary: "ML foundations: know supervised vs unsupervised, respect the train/test split, and ship baselines before complex models.",
    resources: ["scikit-learn docs", "Google ML Crash Course", "Fast.ai practical ML"]
  }),
  buildLesson({
    title: "Neural Networks",
    description: "Perceptrons, layers, activation functions, backpropagation, and training",
    difficulty: "Intermediate",
    duration: "35 min",
    codeLang: "python",
    overview: "Neural networks learn hierarchical representations by composing layers of neurons with non-linear activations. They power vision, speech, and language models when tabular ML is insufficient.",
    theory: "A neuron computes weighted sum + bias passed through activation (ReLU, sigmoid). Stacking layers creates universal approximators. Backpropagation computes gradients via chain rule; optimizers (SGD, Adam) update weights. Loss functions (cross-entropy, MSE) define training objectives.",
    explanation: "Input layer receives features; hidden layers learn representations; output layer produces predictions. Regularization (dropout, weight decay) reduces overfitting. Batch normalization stabilizes training.",
    realWorldExample: "Image classifiers, speech recognition, and LLM transformers are large neural networks trained on GPUs/TPUs with massive datasets.",
    architectureDiagram: `Input (features)\n    │\n    ▼\n┌─────────────┐\n│ Hidden +    │\n│ ReLU layers │\n└──────┬──────┘\n       ▼\n┌─────────────┐\n│ Output +    │\n│ softmax     │\n└─────────────┘`,
    flowDiagram: `Forward pass → Compute loss → Backprop gradients → Optimizer step → Repeat epochs → Validate`,
    syntax: `import torch\nimport torch.nn as nn\nclass MLP(nn.Module):\n  def __init__(self):\n    super().__init__()\n    self.net = nn.Sequential(nn.Linear(784,128), nn.ReLU(), nn.Linear(128,10))\n  def forward(self, x): return self.net(x)`,
    practicalExample: `# Train loop sketch\nmodel = MLP()\nopt = torch.optim.Adam(model.parameters(), lr=1e-3)\nfor x, y in loader:\n  opt.zero_grad()\n  loss = nn.CrossEntropyLoss()(model(x), y)\n  loss.backward()\n  opt.step()`,
    exercise: "Train a 2-layer MLP on MNIST subset; plot training loss.",
    assignment: "Explain vanishing gradients and one technique to mitigate them.",
    miniProject: "Classify handwritten digits with a small CNN; report accuracy and confusion matrix.",
    bestPractices: ["Normalize inputs", "Use dropout for regularization", "Track train vs validation loss", "Start with smaller models"],
    commonMistakes: ["No validation split", "Learning rate too high", "Training on full test set", "Ignoring class imbalance"],
    quizQuestions: [
      { question: "ReLU helps with:", options: ["Non-linearity", "SQL joins", "HTML", "DNS"], correct: 0 },
      { question: "Backprop computes:", options: ["Gradients", "UI colors", "Git branches", "Indexes"], correct: 0 }
    ],
    interviewQuestions: ["Explain forward vs backward pass.", "CNN vs MLP for images?"],
    summary: "Neural nets stack non-linear layers trained with backprop. Start small, watch overfitting, scale with data and compute.",
    resources: ["PyTorch tutorials", "3Blue1Brown neural nets", "Deep Learning book (Goodfellow)"]
  })
];

const AI_EXTENDED = [
  {
    title: "LLMs",
    overview: "Large Language Models are transformer-based networks trained on vast text to predict tokens—powering chat, code, and reasoning APIs.",
    theory: "Decoder-only transformers (GPT family) use self-attention across context. Training: next-token prediction on corpora. Inference: autoregressive sampling with temperature/top_p. Context window limits how much text fits in one request.",
    explanation: "Tokens are subword units; costs scale with tokens in + out. System + user messages shape behavior. Larger models cost more but handle nuance; smaller models suit classification and routing.",
    realWorldExample: "Support copilot routes tickets with a small model, drafts replies with a large model, and summarizes threads when context fits window.",
    architectureDiagram: `Tokens in → Embedding layer → Transformer blocks (attention) → LM head → next token logits`,
    flowDiagram: `Tokenize prompt → Forward pass → Sample next token → Append → Repeat until stop`,
    syntax: `from openai import OpenAI\nclient = OpenAI()\nresp = client.chat.completions.create(model="gpt-4o-mini", messages=[{"role":"user","content":"Explain RAG in 2 sentences"}])\nprint(resp.choices[0].message.content)`,
    practicalExample: `import tiktoken\nenc = tiktoken.encoding_for_model("gpt-4o")\ntokens = enc.encode("Hello, world")\nprint(len(tokens), "tokens")`,
    exercise: "Compare outputs of same prompt at temperature 0 vs 0.9 on a creative task.",
    assignment: "Estimate monthly API cost for 10k users × 5 requests/day given token counts.",
    miniProject: "CLI chat loop with token counting and conversation history trimming.",
    quiz: [
      { question: "LLMs fundamentally predict:", options: ["Next token", "SQL indexes", "Pixel colors", "TCP packets"], correct: 0 },
      { question: "Context window limits:", options: ["Input size per request", "CPU cores", "Disk quota", "CSS length"], correct: 0 }
    ],
    interview: ["Transformer vs RNN for language?", "Temperature effect?", "How to handle long documents?"]
  },
  {
    title: "Embeddings",
    overview: "Embeddings map text to dense vectors where semantic similarity equals geometric closeness—foundation for search and RAG.",
    theory: "Embedding models (text-embedding-3-small, sentence-transformers) produce fixed-dimension vectors. Cosine similarity measures relatedness. Embeddings are deterministic for same model + input; normalize for stable distance metrics.",
    explanation: "Embed queries and documents with the same model. Store vectors in pgvector, Pinecone, or Chroma. Batch embed for throughput; cache embeddings for static corpora.",
    realWorldExample: "Product search embeds titles/descriptions; user query embedding retrieves top-k similar SKUs in milliseconds.",
    architectureDiagram: `Text → Embedding model → vector[d] → Vector index → nearest neighbors`,
    flowDiagram: `Chunk text → Batch embed → Index vectors → Query embed → similarity search`,
    syntax: `from openai import OpenAI\nclient = OpenAI()\nvec = client.embeddings.create(model="text-embedding-3-small", input="refund policy").data[0].embedding`,
    practicalExample: `import numpy as np\na = np.array(vec1); b = np.array(vec2)\nsim = np.dot(a,b) / (np.linalg.norm(a)*np.linalg.norm(b))`,
    exercise: "Embed 20 FAQ questions and return top-3 matches for a new user query.",
    assignment: "Benchmark embedding latency batch size 1 vs 64 on your hardware.",
    miniProject: "Semantic FAQ search: embed corpus JSON, Flask API /search?q=.",
    quiz: [
      { question: "Cosine similarity measures:", options: ["Angle between vectors", "SQL join cost", "HTTP status", "GC time"], correct: 0 },
      { question: "Query and docs must use:", options: ["Same embedding model", "Different random seeds always", "Only CSV", "No index"], correct: 0 }
    ],
    interview: ["Embeddings vs keyword search?", "How to update index when docs change?", "Dimensionality tradeoffs?"]
  },
  {
    title: "RAG Overview",
    overview: "Retrieval-Augmented Generation fetches relevant documents at query time and grounds LLM answers in that context—reducing hallucinations.",
    theory: "Pipeline: ingest → chunk → embed → index → retrieve top-k → inject into prompt → generate. Retrieval quality caps answer quality. Citations require passing chunk metadata to the model.",
    explanation: "Chunk size overlaps trade context vs precision. Hybrid search combines keyword + vector. Re-rankers improve top results before prompting.",
    realWorldExample: "HR bot retrieves policy PDF chunks for each question and answers with cited sections only.",
    architectureDiagram: `Docs → Chunker → Embedder → Vector DB\nQuery → Retriever → Prompt + chunks → LLM → Answer`,
    flowDiagram: `User question → embed query → retrieve k chunks → build prompt → LLM → cite sources`,
    syntax: `context = "\\n\\n".join(c.text for c in retrieved_chunks)\nprompt = f"Answer using only:\\n{context}\\n\\nQuestion: {q}"`,
    practicalExample: `results = index.query(vector=query_emb, top_k=5, include_metadata=True)\ncontext = [m["text"] for m in results["matches"]]`,
    exercise: "Build minimal RAG: 10 markdown files, retrieve top-2, answer with citations.",
    assignment: "List failure modes when retrieval returns irrelevant chunks.",
    miniProject: "Company wiki RAG with ingestion script and chat UI.",
    quiz: [
      { question: "RAG reduces:", options: ["Hallucinations vs pure LLM", "Need for any LLM", "Database size always", "Tokens used"], correct: 0 },
      { question: "Retrieval step selects:", options: ["Relevant chunks", "CSS themes", "TCP ports", "JVM flags"], correct: 0 }
    ],
    interview: ["RAG vs fine-tuning?", "What if retrieval is wrong?", "Chunking strategies?"]
  },
  {
    title: "Fine-tuning",
    overview: "Fine-tuning adapts a base model's weights on domain-specific labeled examples—useful for tone, format, and specialized tasks at scale.",
    theory: "Supervised fine-tuning (SFT) on input-output pairs. RLHF/DPO align preferences. Requires curated dataset, eval split, and compute. Inference uses same API with custom model id.",
    explanation: "Prefer prompting + RAG first. Fine-tune when you have thousands of quality examples and stable task definition. Watch overfitting and regression on general capabilities.",
    realWorldExample: "Legal firm fine-tunes on clause extraction pairs after RAG plateaued on format consistency.",
    architectureDiagram: `Base model + labeled dataset → Training job → Custom model → Inference API`,
    flowDiagram: `Prepare JSONL → Upload → Train → Evaluate on holdout → Deploy model id`,
    syntax: `# OpenAI fine-tuning sketch\n# client.fine_tuning.jobs.create(training_file="file-abc", model="gpt-4o-mini-2024-07-18")`,
    practicalExample: `{"messages":[{"role":"user","content":"Extract date"},{"role":"assistant","content":"2025-01-15"}]}`,
    exercise: "Design 50-example JSONL for a single-task classifier; define eval metrics.",
    assignment: "Decision doc: fine-tune vs RAG vs bigger model for your use case.",
    miniProject: "Fine-tune mini model on support ticket categorization (synthetic data).",
    quiz: [
      { question: "Fine-tuning updates:", options: ["Model weights", "Only CSS", "SQL schema", "DNS records"], correct: 0 },
      { question: "Try first before fine-tuning:", options: ["Prompting and RAG", "Deleting data", "Disabling eval", "More GPUs only"], correct: 0 }
    ],
    interview: ["When is fine-tuning worth it?", "Data quality requirements?", "Catastrophic forgetting?"]
  },
  {
    title: "Evaluation",
    overview: "AI evaluation measures quality beyond demos—offline datasets, human review, and automated judges before production releases.",
    theory: "Metrics: accuracy, F1, BLEU/ROUGE (generation), faithfulness (RAG). LLM-as-judge is useful but biased. Golden sets regression-test prompt changes. Online metrics: thumbs, escalation rate, task success.",
    explanation: "Build eval sets from real user failures. Track per-version scores in CI. Pair automatic metrics with periodic human audit for high-risk domains.",
    realWorldExample: "Release gate blocks prompt v2 if faithfulness drops >5% on 200-case golden set.",
    architectureDiagram: `Candidate system → Eval harness → Metrics dashboard → Pass/fail gate`,
    flowDiagram: `Curate cases → Run pipeline → Score → Compare baseline → Ship or rollback`,
    syntax: `scores = []\nfor case in eval_set:\n  pred = pipeline(case.input)\n  scores.append(faithfulness(pred, case.expected_sources))`,
    practicalExample: `from sklearn.metrics import classification_report\nprint(classification_report(y_true, y_pred))`,
    exercise: "Create 15 RAG eval cases with expected citation doc ids.",
    assignment: "Design human rubric (1–5) for helpfulness and safety; pilot on 30 responses.",
    miniProject: "Eval runner CLI: load YAML cases, call API, output CSV metrics.",
    quiz: [
      { question: "Golden set is for:", options: ["Regression testing", "Training only", "CSS lint", "Docker build"], correct: 0 },
      { question: "LLM-as-judge risk:", options: ["Bias and variance", "Free perfect labels", "No API cost", "Replaces all humans always"], correct: 0 }
    ],
    interview: ["Offline vs online eval?", "RAG faithfulness metrics?", "When to use humans?"]
  },
  {
    title: "MLOps",
    overview: "MLOps applies DevOps practices to ML and LLM systems: versioning data, models, prompts, and monitoring production behavior.",
    theory: "Version datasets, prompts, and model ids together. CI runs eval gates. Feature stores for tabular ML; prompt registries for LLMs. Monitor latency, cost, drift, and error rates.",
    explanation: "Package inference in containers. Blue-green model deployments. Log prompts/responses with PII redaction. Rollback path when metrics degrade.",
    realWorldExample: "Team tags each release with git SHA + prompt version + embedding model version for reproducible incidents.",
    architectureDiagram: `Git → CI eval → Registry → Deploy → Monitor → Feedback loop`,
    flowDiagram: `Change artifact → Run eval → Promote version → Deploy → Alert on drift`,
    syntax: `# mlflow or custom metadata\nrun.log_param("prompt_version", "v3.2")\nrun.log_metric("faithfulness", 0.91)`,
    practicalExample: `manifest = {"model":"gpt-4o-mini","prompt":"support_v3","embed":"text-embedding-3-small"}`,
    exercise: "Draft MLflow-style log schema for one RAG pipeline run.",
    assignment: "Write on-call runbook for rolling back a bad prompt deployment.",
    miniProject: "GitHub Action that runs eval script and fails PR if score drops.",
    quiz: [
      { question: "MLOps emphasizes:", options: ["Reproducible deployments", "No logging", "Manual only releases", "Skipping tests"], correct: 0 },
      { question: "Prompt versioning belongs in:", options: ["Git/registry", "Random files", "Browser cache", "CSS"], correct: 0 }
    ],
    interview: ["ML vs LLM ops differences?", "What to log in production?", "Rollback strategy?"]
  },
  {
    title: "Responsible AI",
    overview: "Responsible AI covers fairness, safety, privacy, and transparency—required for regulated and customer-facing intelligent systems.",
    theory: "Bias enters via data and feedback loops. PII must be redacted in logs and training. Content filters block policy violations. Human review for high-stakes decisions. Document limitations clearly to users.",
    explanation: "Threat model: prompt injection, data exfiltration, toxic outputs. Mitigate with input/output filters, least-privilege tools, and retrieval boundaries. GDPR: lawful basis for processing personal data in prompts.",
    realWorldExample: "Healthcare assistant refuses diagnosis, cites sources, and escalates emergencies to humans per policy.",
    architectureDiagram: `User input → Safety filter → Model → Output filter → User + audit log`,
    flowDiagram: `Identify risks → Mitigate in design → Test red team → Monitor → Incident response`,
    syntax: `# Policy layer example\nif contains_pii(user_input): redact(user_input)\nif violates_policy(output): return safe_fallback()`,
    practicalExample: `SYSTEM = "You are a tutor. Do not provide medical diagnoses. Cite sources."`,
    exercise: "Red-team your RAG bot with 10 prompt injection attempts; document fixes.",
    assignment: "One-page model card: intended use, limitations, and monitored harms.",
    miniProject: "Add output moderation step and audit log table for flagged responses.",
    quiz: [
      { question: "Prompt injection targets:", options: ["Model instruction bypass", "SQL indexes", "CSS grid", "JVM heap"], correct: 0 },
      { question: "PII in logs should be:", options: ["Redacted or avoided", "Published", "Sold", "Ignored always"], correct: 0 }
    ],
    interview: ["Prompt injection defenses?", "Bias sources in LLM apps?", "When require human in loop?"]
  }
];

for (const spec of AI_EXTENDED) {
  AI_FUNDAMENTALS_CURRICULUM.push(
    buildLesson({
      title: spec.title,
      description: spec.overview.slice(0, 100),
      difficulty: spec.title === "Responsible AI" ? "Beginner" : "Intermediate",
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
      bestPractices: ["Establish baselines before scaling complexity", "Document datasets and eval splits", "Monitor drift and feedback", "Pair metrics with business KPIs"],
      commonMistakes: ["Shipping without offline eval", "Treating demos as production proof", "Ignoring privacy constraints", "No rollback plan"],
      exercise: spec.exercise,
      assignment: spec.assignment,
      miniProject: spec.miniProject,
      quizQuestions: spec.quiz,
      interviewQuestions: spec.interview,
      summary: `${spec.title} is core AI engineering knowledge—always pair capability with evaluation and governance.`,
      resources: ["Hugging Face course", "OpenAI docs", "NIST AI RMF"]
    })
  );
}

export default AI_FUNDAMENTALS_CURRICULUM;
