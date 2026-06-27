const MODE_HINTS = {
  "learning-mentor": "Focus on structured learning paths, next lessons, and progress tracking.",
  "resume-reviewer": "Provide ATS tips, keyword gaps, and resume improvements.",
  "coding-assistant": "Give hints first, then code examples with explanations.",
  "interview-coach": "Ask follow-up questions and score using STAR or technical rubrics.",
  "project-mentor": "Recommend portfolio projects and improvement steps.",
  "career-advisor": "Discuss career paths, certifications, and skill growth.",
  "general-assistant": "Help navigate NexusAI platform features.",
  "job-search": "Guide job search strategy and application tracking."
};

async function callOpenAI(message, mode, context = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const system = `You are NexusAI Virtual Recruiter in ${mode} mode. ${MODE_HINTS[mode] || ""} Be concise, actionable, and professional. User context: ${JSON.stringify(context).slice(0, 500)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 800
    })
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

function ruleBasedReply(message, mode) {
  const q = message.toLowerCase();
  const modeLabel = mode.replace(/-/g, " ");

  if (/write code|implement|create function/.test(q) && mode === "coding-assistant") {
    return "Coding Assistant: Describe the language, inputs, and expected output. I'll provide idiomatic starter code with complexity notes and edge cases.";
  }
  if (/fix|bug|error|debug/.test(q) && mode === "coding-assistant") {
    return "Paste your code and error message. I'll suggest likely causes — off-by-one, null checks, async issues, or type mismatches — and a minimal fix.";
  }
  if (/hint|stuck/.test(q) && mode === "coding-assistant") {
    return "Hint: Break the problem into input → process → output. What data structure fits best? Try solving a smaller example first.";
  }
  if (/explain/.test(q) && mode === "coding-assistant") {
    return "Share your code snippet. I'll walk through purpose, algorithm, time/space complexity, and edge cases line by line.";
  }
  if (/mock|interview|star/.test(q) && mode === "interview-coach") {
    return "Interview Coach: Use STAR for behavioral questions and Problem → Approach → Tradeoffs → Result for technical. Practice aloud and quantify impact.";
  }
  if (/resume|ats|keyword/.test(q)) {
    return "Resume Reviewer: Use Career → Resume Analyzer for ATS score, missing keywords, and tailored suggestions backed by real parsing.";
  }
  if (/learn|course|lesson|next/.test(q) && mode === "learning-mentor") {
    return "Learning Mentor: Complete lessons sequentially to unlock paths. Focus on one technology at a time and track progress on your dashboard.";
  }
  if (/project|portfolio/.test(q) && mode === "project-mentor") {
    return "Project Mentor: Pick a project matching your target role stack. Ship an MVP, connect GitHub, and document architecture decisions.";
  }

  return `${modeLabel}: I received your question — "${message.slice(0, 120)}". ${MODE_HINTS[mode] || "How can I help you next?"}`;
}

export async function generateAiReply(message, mode = "general-assistant", context = {}) {
  if (!message?.trim()) {
    return { success: false, message: "Message is required" };
  }

  const aiReply = await callOpenAI(message, mode, context);
  const reply = aiReply || ruleBasedReply(message, mode);

  return {
    success: true,
    reply,
    mode,
    provider: aiReply ? "openai" : "nexusai"
  };
}
