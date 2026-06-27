/** Career Hub — Resume Analyzer & Tailor Resume only */
import { analyzeResumeApi, tailorResumeApi, uploadFile, getToken } from "../shared/api-client.js";

const ATS_KEYWORDS = [
  "python", "java", "sql", "spring", "react", "aws", "docker", "kubernetes",
  "api", "rest", "machine learning", "ai", "rag", "llm", "agile", "git",
  "typescript", "node", "fastapi", "postgresql", "microservices", "ci/cd"
];

const CAREER_PANELS = {
  resume: "careerResumePanel",
  tailor: "careerTailorPanel"
};

export function showCareerPanel(panel, event) {
  Object.values(CAREER_PANELS).forEach((id) => document.getElementById(id)?.classList.add("hidden"));
  document.getElementById(CAREER_PANELS[panel])?.classList.remove("hidden");
  document.querySelectorAll(".career-tab").forEach((t) => t.classList.remove("active"));
  if (event?.target) event.target.classList.add("active");
}

function getResumeText() {
  const pasted = document.getElementById("resumeText")?.value || "";
  const uploaded = document.getElementById("resumeUploadText")?.value || "";
  return (pasted || uploaded).trim();
}

export function handleResumeUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const hidden = document.getElementById("resumeUploadText");
    if (hidden) hidden.value = reader.result;
    const preview = document.getElementById("resumeUploadPreview");
    if (preview) preview.textContent = `Uploaded: ${file.name} (${Math.round(file.size / 1024)} KB)`;
    if (getToken()) await uploadFile("resume", file);
  };
  reader.readAsText(file);
}

export async function analyzeResume() {
  const text = getResumeText();
  if (!text) {
    setAnalyzerOutput("Paste or upload your resume to analyze.", [], [], [], 0);
    return;
  }

  if (getToken()) {
    const { ok, data } = await analyzeResumeApi(text);
    if (ok && data.success) {
      setAnalyzerOutput(
        data.suggestion,
        data.foundKeywords,
        data.missingKeywords,
        data.keywordSuggestions,
        data.atsScore,
        data.recommendations
      );
      localStorage.setItem("nexusCareerMode", JSON.stringify({ atsScore: data.atsScore, skillGaps: data.missingKeywords }));
      return;
    }
  }

  analyzeResumeLocal(text);
}

function analyzeResumeLocal(text) {
  const lower = text.toLowerCase();
  const found = ATS_KEYWORDS.filter((k) => lower.includes(k));
  const missing = ATS_KEYWORDS.filter((k) => !lower.includes(k)).slice(0, 10);
  const keywordSuggestions = missing.slice(0, 6).map((k) => `Add "${k}" where relevant in skills or experience bullets`);
  const score = Math.min(100, Math.round((found.length / ATS_KEYWORDS.length) * 100 + Math.min(text.length / 80, 15)));

  const recommendations = [];
  if (score < 60) recommendations.push("Restructure experience with quantified outcomes (e.g., reduced latency 40%).");
  if (missing.length > 4) recommendations.push("Integrate missing keywords naturally in a dedicated Skills section.");
  if (!lower.includes("project")) recommendations.push("Add 1–2 portfolio projects with tech stack and impact metrics.");
  if (text.split("\n").filter(Boolean).length < 12) recommendations.push("Expand content — ATS prefers detailed role descriptions.");
  recommendations.push("Use standard section headers: Summary, Experience, Skills, Education.");

  setAnalyzerOutput(
    score >= 75 ? "Strong ATS match. Polish with metrics and project links." : "Improve keyword coverage and quantify achievements.",
    found,
    missing,
    keywordSuggestions,
    score,
    recommendations
  );

  localStorage.setItem("nexusCareerMode", JSON.stringify({ atsScore: score, skillGaps: missing }));
}

function setAnalyzerOutput(suggestion, found, missing, keywordSuggestions, score, recommendations = []) {
  const scoreEl = document.getElementById("atsScore");
  if (scoreEl) scoreEl.textContent = `${score}%`;

  const skillsEl = document.getElementById("skillsList");
  if (skillsEl) skillsEl.innerHTML = found.length ? found.map((s) => `<li>${s}</li>`).join("") : "<li>None detected</li>";

  const gapEl = document.getElementById("skillGapList");
  if (gapEl) gapEl.innerHTML = missing.length ? missing.map((s) => `<li>${s}</li>`).join("") : "<li>Great coverage!</li>";

  const kwEl = document.getElementById("keywordSuggestions");
  if (kwEl) kwEl.innerHTML = keywordSuggestions.map((s) => `<li>${s}</li>`).join("") || "<li>No urgent keyword gaps</li>";

  const recEl = document.getElementById("resumeRecommendations");
  if (recEl) recEl.innerHTML = recommendations.map((r) => `<li>${r}</li>`).join("");

  const sugEl = document.getElementById("resumeSuggestions");
  if (sugEl) sugEl.textContent = suggestion;
}

export async function tailorResume() {
  const jd = (document.getElementById("jobDescriptionText")?.value || "").trim();
  const resume = (document.getElementById("tailorResumeText")?.value || getResumeText()).trim();
  const out = document.getElementById("tailoredResumeOutput");

  if (!jd || !resume) {
    if (out) out.textContent = "Paste both a job description and your resume to generate a tailored version.";
    return;
  }

  if (getToken()) {
    const { ok, data } = await tailorResumeApi(resume, jd);
    if (ok && data.success) {
      if (out) out.textContent = data.tailoredResume;
      localStorage.setItem("nexusTailoredResume", data.tailoredResume);
      return;
    }
  }

  tailorResumeLocal(resume, jd, out);
}

function tailorResumeLocal(resume, jd, out) {
  const jdLower = jd.toLowerCase();
  const resumeLower = resume.toLowerCase();
  const matched = ATS_KEYWORDS.filter((k) => jdLower.includes(k) && resumeLower.includes(k));
  const toAdd = ATS_KEYWORDS.filter((k) => jdLower.includes(k) && !resumeLower.includes(k)).slice(0, 8);

  const roleLine = jd.split("\n").find((l) => l.trim().length > 10) || "Target Role";
  const summary = `Results-driven engineer aligned with ${roleLine.trim().slice(0, 80)} — emphasizing ${matched.slice(0, 5).join(", ") || "core stack skills"}.`;

  const tailored = `${resume.split("\n")[0] || "Your Name"}

PROFESSIONAL SUMMARY
${summary}

TAILORED FOR THIS ROLE
${jd.split("\n").slice(0, 3).join("\n")}

KEY ALIGNMENT
${matched.map((k) => `• Demonstrated ${k} experience matching job requirements`).join("\n") || "• Highlight relevant project outcomes"}

RECOMMENDED ADDITIONS
${toAdd.map((k) => `• Weave "${k}" into experience bullets where truthful`).join("\n") || "• Resume already covers primary keywords"}

EXPERIENCE (optimized phrasing)
${resume.split("\n").slice(1).join("\n").trim() || resume}

---
Generated by NexusAI Tailor Resume — review and edit before submitting.`;

  if (out) out.textContent = tailored;
  localStorage.setItem("nexusTailoredResume", tailored);
}
