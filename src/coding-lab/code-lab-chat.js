/** Code Lab — ChatGPT-style coding assistant */
export function sendCodeLabMessage() {
  const input = document.getElementById("codeLabInput");
  const box = document.getElementById("codeLabMessages");
  const q = input?.value?.trim();
  if (!q || !box) return;

  appendMsg(box, "You", q);
  const response = buildCodeLabResponse(q);
  appendMsg(box, "Code Lab", response);
  input.value = "";
  box.scrollTop = box.scrollHeight;
}

function appendMsg(box, who, text) {
  const p = document.createElement("div");
  p.className = who === "You" ? "code-lab-user" : "code-lab-bot";
  p.innerHTML = `<strong>${who}:</strong><pre>${escape(text)}</pre>`;
  box.appendChild(p);
}

function escape(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildCodeLabResponse(question) {
  const q = question.toLowerCase();
  const lang = q.includes("java") ? "java" : q.includes("sql") ? "sql" : q.includes("react") || q.includes("javascript") ? "javascript" : "python";

  const hint = getHint(q, lang);
  const solution = getSolution(q, lang);
  const explanation = getExplanation(q, lang);
  const best = getBestPractices(lang);
  const alt = getAlternative(q, lang);

  return `💡 HINT\n${hint}\n\n✅ SOLUTION\n${solution}\n\n📖 EXPLANATION\n${explanation}\n\n⭐ BEST PRACTICES\n${best}\n\n🔄 ALTERNATIVE\n${alt}`;
}

function getHint(q, lang) {
  if (q.includes("reverse") || q.includes("string")) return "Think about iterating from the end, or using slice/step notation.";
  if (q.includes("sort") || q.includes("array") || q.includes("list")) return "Consider built-in sort methods and key functions for custom ordering.";
  if (q.includes("api") || q.includes("rest")) return "Map HTTP methods to CRUD operations. Use proper status codes.";
  return `Break the problem into input → process → output. What data structure fits best in ${lang}?`;
}

function getSolution(q, lang) {
  if (lang === "python") {
    if (q.includes("reverse")) return 'def reverse_string(s):\n    return s[::-1]\n\nprint(reverse_string("hello"))  # olleh';
    if (q.includes("fibonacci")) return 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a';
    return 'def solve(data):\n    """Replace with your logic."""\n    result = []\n    for item in data:\n        result.append(item)\n    return result';
  }
  if (lang === "java") return 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}';
  if (lang === "sql") return "SELECT column FROM table WHERE condition ORDER BY column LIMIT 10;";
  return 'function solve(input) {\n  return input;\n}\nconsole.log(solve("test"));';
}

function getExplanation(q, lang) {
  return `This ${lang} solution uses idiomatic patterns. The core algorithm runs in O(n) time for most linear passes. Read each line top-to-bottom: define inputs, transform data, return output.`;
}

function getBestPractices(lang) {
  const tips = {
    python: "Use type hints, descriptive names, and pytest for tests.",
    java: "Follow SOLID principles, use streams for collections, handle exceptions explicitly.",
    sql: "Use indexes, avoid SELECT *, parameterize queries to prevent injection.",
    javascript: "Prefer const/let, async/await for I/O, and eslint for consistency."
  };
  return tips[lang] || tips.python;
}

function getAlternative(q, lang) {
  if (lang === "python" && q.includes("reverse")) return 'Alternative: "".join(reversed(s)) — equally readable.';
  return "Consider a recursive approach for learning, but iterative is usually more memory-efficient.";
}

document.addEventListener("DOMContentLoaded", () => {
  window.buildCodeLabResponse = buildCodeLabResponse;
});
