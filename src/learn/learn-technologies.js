/**
 * Technology groups for Learn catalog — independent technologies, level chains within each.
 */
import { LEARNING_PATHS, getPathProgressPercent } from "./learn-data.js";
import { getProgressionMeta, isPathUnlocked } from "./learn-progression.js";
import { getTechIcon } from "../shared/tech-icons.js";

export const TECHNOLOGY_GROUPS = [
  { id: "python", name: "Python", paths: ["python-fundamentals", "python-intermediate", "advanced-python"] },
  { id: "java", name: "Java", paths: ["java-fundamentals", "advanced-java"] },
  { id: "sql", name: "SQL", paths: ["sql", "postgresql"] },
  { id: "javascript", name: "JavaScript", paths: ["javascript", "advanced-javascript"] },
  { id: "typescript", name: "TypeScript", paths: ["typescript"] },
  { id: "html", name: "HTML", paths: ["html"] },
  { id: "css", name: "CSS", paths: ["css"] },
  { id: "react", name: "React", paths: ["react"] },
  { id: "spring-boot", name: "Spring Boot", paths: ["spring-boot", "spring-security"] },
  { id: "hibernate", name: "Hibernate", paths: ["hibernate", "jpa"] },
  { id: "node", name: "Node.js", paths: ["node", "express"] },
  { id: "rest-apis", name: "REST APIs", paths: ["rest-apis"] },
  { id: "microservices", name: "Microservices", paths: ["microservices"] },
  { id: "mongodb", name: "MongoDB", paths: ["mongodb"] },
  { id: "redis", name: "Redis", paths: ["redis"] },
  { id: "docker", name: "Docker", paths: ["docker", "kubernetes"] },
  { id: "aws", name: "AWS", paths: ["aws", "azure-basics"] },
  { id: "git-github", name: "Git & GitHub", paths: ["git-github", "cicd"] },
  { id: "linux", name: "Linux", paths: ["linux"] },
  { id: "system-design", name: "System Design", paths: ["system-design"] },
  { id: "data-structures", name: "Data Structures", paths: ["data-structures", "algorithms"] },
  { id: "kafka", name: "Kafka", paths: ["apache-kafka"] },
  { id: "ai", name: "AI Fundamentals", paths: ["ai-fundamentals", "machine-learning", "deep-learning"] },
  { id: "prompt-engineering", name: "Prompt Engineering", paths: ["prompt-engineering", "llms"] },
  { id: "openai-apis", name: "OpenAI APIs", paths: ["openai-apis", "ai-deployment"] },
  { id: "rag", name: "RAG", paths: ["rag-systems", "langchain", "ai-agents", "mcp"] },
  { id: "embeddings", name: "Embeddings", paths: ["embeddings", "vector-databases"] }
];

export function getTechnologyGroup(techId) {
  return TECHNOLOGY_GROUPS.find((t) => t.id === techId);
}

export function getTechnologyForPath(pathId) {
  const group = TECHNOLOGY_GROUPS.find((t) => t.paths.includes(pathId));
  if (group) return group;
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  return path ? { id: path.id, name: path.title, paths: [path.id] } : null;
}

export function getAggregateProgress(pathIds) {
  let total = 0;
  let sum = 0;
  pathIds.forEach((id) => {
    const p = getPathProgressPercent(id);
    sum += p;
    total += 1;
  });
  return total ? Math.round(sum / total) : 0;
}

export function getPrimaryLevel(pathIds) {
  for (const id of pathIds) {
    const path = LEARNING_PATHS.find((p) => p.id === id);
    if (path && isPathUnlocked(path)) {
      const meta = getProgressionMeta(id);
      return meta.levelTitle || path.title;
    }
  }
  const first = LEARNING_PATHS.find((p) => p.id === pathIds[0]);
  return getProgressionMeta(pathIds[0]).levelTitle || first?.title || "Beginner";
}

export function getTechIconForGroup(techId) {
  const group = getTechnologyGroup(techId);
  const pathId = group?.paths[0] || techId;
  return getTechIcon(pathId, group?.name || techId);
}
