import { getRecruiterContext } from "./vr-ui.js";
import { pickResponse, MENTOR_DEFAULTS } from "./vr-knowledge.js";
import { normalizeModeId } from "./vr-modes.js";
import { aiChat, getToken } from "../shared/api-client.js";

export const HISTORY_KEY = "nexusRecruiterHistory";

let sessionTurns = [];

export function getSessionTurns() {
  return [...sessionTurns];
}

export function clearSessionMemory() {
  sessionTurns = [];
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(entry) {
  const list = loadHistory();
  list.push({ ...entry, time: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(-50)));
}

function sessionContextHint() {
  if (sessionTurns.length < 2) return "";
  const lastUser = [...sessionTurns].reverse().find((t) => t.role === "user");
  if (!lastUser) return "";
  return ` (Following up on: "${lastUser.text.slice(0, 72)}${lastUser.text.length > 72 ? "…" : ""}")`;
}

export async function getAIMentorResponse(userMessage, mode) {
  const message = userMessage.toLowerCase();
  const currentMode = normalizeModeId(mode || document.getElementById("mentorMode")?.value);

  if (/what time|what date|today|day is/.test(message)) {
    const now = new Date();
    return `Today is ${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}. The time is ${now.toLocaleTimeString()}.`;
  }

  if (/what did i ask|earlier|remember|last question|we discussed/.test(message)) {
    const lastUser = [...sessionTurns].reverse().find((t) => t.role === "user");
    if (lastUser) {
      return `In this session you asked: "${lastUser.text}". I can expand on that — what aspect do you want to dive into?`;
    }
    return "We haven't chatted yet this session. Ask me anything in the current mode.";
  }

  if (getToken()) {
    const context = typeof getRecruiterContext === "function" ? getRecruiterContext() : {};
    const result = await aiChat(userMessage, currentMode, context);
    if (result.success && result.reply) return result.reply + sessionContextHint();
  }

  if (typeof getRecruiterContext === "function" && window.NexusRecruiter) {
    const contextual = window.NexusRecruiter.reply(userMessage, getRecruiterContext(), currentMode);
    if (contextual) return contextual + sessionContextHint();
  }

  if (currentMode === "coding-assistant" && typeof window.buildCodeLabResponse === "function") {
    return window.buildCodeLabResponse(userMessage);
  }

  const reply = pickResponse(currentMode, message);
  return reply + sessionContextHint();
}

export async function sendMessage() {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  const modeSelect = document.getElementById("mentorMode");
  const userText = input?.value?.trim();
  if (!userText || !messages) return;

  const mode = normalizeModeId(modeSelect?.value || "learning-mentor");

  appendChat(messages, "You", userText);
  sessionTurns.push({ role: "user", text: userText, mode });

  const reply = await getAIMentorResponse(userText, mode);
  appendChat(messages, "Virtual Recruiter", reply);
  sessionTurns.push({ role: "assistant", text: reply, mode });
  if (sessionTurns.length > 24) sessionTurns = sessionTurns.slice(-24);

  saveHistory({ role: "user", text: userText, mode });
  saveHistory({ role: "assistant", text: reply, mode });
  if (typeof window.renderVrHistoryList === "function") window.renderVrHistoryList();
  input.value = "";
  messages.scrollTop = messages.scrollHeight;
}

function appendChat(box, who, text) {
  const p = document.createElement("p");
  p.className = who === "You" ? "user-msg" : "bot-msg";
  p.textContent = `${who}: ${text}`;
  box.appendChild(p);
}

export function clearRecruiterHistory() {
  localStorage.removeItem(HISTORY_KEY);
  clearSessionMemory();
  const messages = document.getElementById("chatMessages");
  if (messages) {
    messages.innerHTML = "";
    delete messages.dataset.greeted;
  }
  if (typeof window.renderVrHistoryList === "function") window.renderVrHistoryList();
}

export function restoreRecruiterHistory() {
  const messages = document.getElementById("chatMessages");
  if (!messages) return;
  const history = loadHistory().slice(-6);
  if (!history.length) {
    messages.innerHTML = "";
    delete messages.dataset.greeted;
    return;
  }
  messages.innerHTML = "";
  sessionTurns = [];
  history.forEach((h) => {
    appendChat(messages, h.role === "user" ? "You" : "Virtual Recruiter", h.text);
    sessionTurns.push({ role: h.role, text: h.text, mode: h.mode });
  });
  messages.dataset.greeted = "1";
}

export function getMentorDefault(mode) {
  return MENTOR_DEFAULTS[normalizeModeId(mode)] || MENTOR_DEFAULTS["learning-mentor"];
}
