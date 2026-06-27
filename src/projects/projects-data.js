/** Project blueprints, rendering, and exports */
import {
  PROJECT_BLUEPRINTS,
  CORE_PROJECT_NAMES,
  LIVE_PROJECT_NAMES,
  ALL_PROJECT_NAMES
} from "./projects-blueprints.js";
import {
  getProjectProgressKey,
  getProjectScoreKey,
  loadProjectProgress
} from "./project-progress.js";
import { getProjectMeta } from "./project-meta.js";

export {
  PROJECT_BLUEPRINTS,
  CORE_PROJECT_NAMES,
  LIVE_PROJECT_NAMES,
  ALL_PROJECT_NAMES,
  getProjectProgressKey,
  getProjectScoreKey
};

export function getProjectBlueprint(name) {
  return PROJECT_BLUEPRINTS[name] || null;
}

function listItems(items) {
  return (items || []).map((r) => `<li>${r}</li>`).join("");
}

function cell(title, content, extraClass = "") {
  return `<div class="project-detail-cell glass-card ${extraClass}">
    <h3 class="stat-title">${title}</h3>
    <div class="project-detail-body">${content}</div>
  </div>`;
}

export function renderProjectDetail(name) {
  const p = PROJECT_BLUEPRINTS[name];
  const holder = document.getElementById("projectDetailContent");
  if (!holder || !p) return false;

  const saved = loadProjectProgress(name);
  const meta = getProjectMeta(name);

  holder.innerHTML = `
    <div class="project-detail-grid">
      ${cell("Overview", `<p>${p.overview}</p><p class="stat-meta"><strong>Business Problem:</strong> ${p.businessProblem}</p>`)}
      ${cell("Requirements", `<ul class="project-detail-list">${listItems(p.requirements)}</ul><h4 class="stat-meta">Functional</h4><ul class="project-detail-list">${listItems(p.functionalRequirements)}</ul>`)}

      ${cell("Architecture Diagram", `<pre class="diagram-block">${p.architectureDiagram}</pre>`)}
      ${cell("Flow Diagram", `<pre class="diagram-block">${p.flowDiagram}</pre>`)}

      ${cell("Frontend", `<p>${p.frontendDesign}</p>`)}
      ${cell("Backend", `<p>${p.backendDesign}</p>`)}

      ${cell("Database", `<p>${p.databaseDesign}</p>`)}
      ${cell("API", `<pre class="diagram-block api-spec-block">${p.apiSpecifications}</pre>`)}

      ${cell("Testing", `<p>${p.testingStrategy}</p>`)}
      ${cell("Deployment", `<p>${p.deploymentStrategy}</p><p class="stat-meta">CI/CD: ${p.cicdStrategy}</p>`)}

      ${cell("Completion Status", `<p>${saved >= 80 ? "✓ Portfolio ready" : "In progress"}</p><p class="stat-meta">Level: ${p.level} · Stack: ${meta.stack}</p>`)}
      ${cell("Progress", `<div class="progress-bar glass-progress"><div class="progress-fill project-detail-progress" style="width:${saved}%"></div></div><p class="stat-value" style="font-size:1.5rem;margin-top:8px;">${saved}%</p>`)}

      ${cell("Folder Structure", `<pre class="diagram-block">${p.folderStructure}</pre>`, "project-detail-full")}
      ${cell("Implementation Steps", `<ol class="project-detail-list">${listItems(p.implementation)}</ol>`, "project-detail-full")}
      ${cell("Interview Questions", `<ul class="project-detail-list">${listItems(p.interviewQuestions)}</ul>`, "project-detail-full")}
    </div>`;
  return true;
}
