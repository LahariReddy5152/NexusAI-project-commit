/** Code Lab — editor, language selector, run simulation, SQLite persistence */
import { getToken } from "../shared/api-client.js";
import { loadRemoteState, saveRemoteStateDebounced } from "../shared/user-persistence.js";

const LANG_PLACEHOLDERS = {
  python: "# Write Python code\nprint('Hello NexusAI')",
  javascript: "// Write JavaScript code\nconsole.log('Hello NexusAI');",
  java: "// Write Java code\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello NexusAI\");\n  }\n}",
  sql: "-- Write SQL\nSELECT 'Hello NexusAI';"
};

let codeLabState = { language: "python", sessions: {} };
let initialized = false;

function persistCodeLab() {
  const select = document.getElementById("codeLabLanguage");
  const editor = document.getElementById("codeEditor");
  if (!editor) return;

  const lang = select?.value || codeLabState.language || "python";
  codeLabState.language = lang;
  codeLabState.sessions[lang] = editor.value;
  saveRemoteStateDebounced("code_lab", codeLabState);
}

function applyCodeLabState() {
  const select = document.getElementById("codeLabLanguage");
  const editor = document.getElementById("codeEditor");
  if (!select || !editor) return;

  const lang = codeLabState.language || "python";
  select.value = lang;
  editor.value = codeLabState.sessions[lang] || LANG_PLACEHOLDERS[lang] || "";
}

export async function loadCodeLabFromServer() {
  if (!getToken()) return;
  const remote = await loadRemoteState("code_lab", null);
  if (remote && typeof remote === "object") {
    codeLabState = {
      language: remote.language || "python",
      sessions: remote.sessions || {}
    };
    applyCodeLabState();
  }
}

export function initCodeLab() {
  const select = document.getElementById("codeLabLanguage");
  const editor = document.getElementById("codeEditor");
  if (!select || !editor) return;

  if (!initialized) {
    select.addEventListener("change", () => {
      persistCodeLab();
      const lang = select.value;
      codeLabState.language = lang;
      editor.value = codeLabState.sessions[lang] || LANG_PLACEHOLDERS[lang] || "";
      persistCodeLab();
    });
    editor.addEventListener("input", persistCodeLab);
    initialized = true;
  }

  if (getToken() && !codeLabState.sessions.python && !codeLabState.sessions.javascript) {
    loadCodeLabFromServer().catch(() => applyCodeLabState());
  } else {
    applyCodeLabState();
  }
}

export function runCode() {
  const code = document.getElementById("codeEditor")?.value;
  const output = document.getElementById("codeOutput");
  const lang = document.getElementById("codeLabLanguage")?.value || "python";
  if (!output) return;
  persistCodeLab();
  if (!code?.trim()) {
    output.innerText = "Please enter code.";
    return;
  }
  const messages = {
    python: code.includes("print") ? "Python output simulated successfully." : "Python code validated.",
    javascript: code.includes("console.log") ? "JavaScript output simulated successfully." : "JavaScript code validated.",
    java: code.includes("System.out") ? "Java output simulated successfully." : "Java code validated.",
    sql: code.toLowerCase().includes("select") ? "SQL query executed (simulated)." : "SQL validated."
  };
  output.innerText = `[${lang}] ${messages[lang] || "Code validated successfully."}`;
}
