/** Technology logo icons for course cards */
const TECH_ICON_MAP = {
  python: "🐍",
  sql: "🗄️",
  java: "☕",
  html: "🌐",
  css: "🎨",
  javascript: "📜",
  typescript: "📘",
  react: "⚛️",
  spring: "🍃",
  hibernate: "💾",
  jpa: "📦",
  rest: "🔌",
  node: "🟢",
  express: "🚂",
  microservices: "🔗",
  postgresql: "🐘",
  mongodb: "🍃",
  redis: "🔴",
  docker: "🐳",
  kubernetes: "☸️",
  aws: "☁️",
  azure: "🔷",
  git: "📂",
  linux: "🐧",
  cicd: "🔄",
  "system-design": "🏗️",
  kafka: "📨",
  ai: "🤖",
  machine: "🧠",
  deep: "🔬",
  prompt: "✍️",
  llm: "💬",
  openai: "✨",
  rag: "📚",
  langchain: "⛓️",
  embedding: "🔢",
  vector: "📊",
  agent: "🤖",
  mcp: "🔧",
  deployment: "🚀",
  algorithm: "📐",
  data: "📊"
};

export function getTechIcon(pathId, title = "") {
  const id = (pathId || "").toLowerCase();
  const t = (title || "").toLowerCase();
  if (id.includes("python") || t.includes("python")) return TECH_ICON_MAP.python;
  if (id === "sql" || t === "sql") return TECH_ICON_MAP.sql;
  if (id.includes("java") || t.includes("java")) return TECH_ICON_MAP.java;
  if (id.includes("html")) return TECH_ICON_MAP.html;
  if (id === "css") return TECH_ICON_MAP.css;
  if (id.includes("javascript")) return TECH_ICON_MAP.javascript;
  if (id.includes("typescript")) return TECH_ICON_MAP.typescript;
  if (id.includes("react")) return TECH_ICON_MAP.react;
  if (id.includes("spring")) return TECH_ICON_MAP.spring;
  if (id.includes("hibernate")) return TECH_ICON_MAP.hibernate;
  if (id === "jpa") return TECH_ICON_MAP.jpa;
  if (id.includes("rest")) return TECH_ICON_MAP.rest;
  if (id === "node") return TECH_ICON_MAP.node;
  if (id === "express") return TECH_ICON_MAP.express;
  if (id.includes("microservice")) return TECH_ICON_MAP.microservices;
  if (id.includes("postgresql")) return TECH_ICON_MAP.postgresql;
  if (id.includes("mongodb")) return TECH_ICON_MAP.mongodb;
  if (id === "redis") return TECH_ICON_MAP.redis;
  if (id === "docker") return TECH_ICON_MAP.docker;
  if (id.includes("kubernetes")) return TECH_ICON_MAP.kubernetes;
  if (id === "aws") return TECH_ICON_MAP.aws;
  if (id.includes("azure")) return TECH_ICON_MAP.azure;
  if (id.includes("git")) return TECH_ICON_MAP.git;
  if (id === "linux") return TECH_ICON_MAP.linux;
  if (id === "cicd") return TECH_ICON_MAP.cicd;
  if (id.includes("system-design")) return TECH_ICON_MAP["system-design"];
  if (id.includes("kafka")) return TECH_ICON_MAP.kafka;
  if (id.includes("ai-fundamentals") || t === "ai") return TECH_ICON_MAP.ai;
  if (id.includes("machine-learning")) return TECH_ICON_MAP.machine;
  if (id.includes("deep-learning")) return TECH_ICON_MAP.deep;
  if (id.includes("prompt")) return TECH_ICON_MAP.prompt;
  if (id === "llms") return TECH_ICON_MAP.llm;
  if (id.includes("openai")) return TECH_ICON_MAP.openai;
  if (id.includes("rag")) return TECH_ICON_MAP.rag;
  if (id.includes("langchain")) return TECH_ICON_MAP.langchain;
  if (id.includes("embedding")) return TECH_ICON_MAP.embedding;
  if (id.includes("vector")) return TECH_ICON_MAP.vector;
  if (id.includes("agent")) return TECH_ICON_MAP.agent;
  if (id === "mcp") return TECH_ICON_MAP.mcp;
  if (id.includes("deployment")) return TECH_ICON_MAP.deployment;
  if (id.includes("algorithm")) return TECH_ICON_MAP.algorithm;
  if (id.includes("data-structure")) return TECH_ICON_MAP.data;
  return "📖";
}

export function getStatusIcon(progress, unlocked) {
  if (!unlocked) return "🔒";
  if (progress >= 100) return "✅";
  if (progress >= 50) return "📈";
  if (progress > 0) return "▶️";
  return "○";
}
