/**
 * Build a complete project blueprint with all Priority 4 required sections.
 */
export function buildProject(spec) {
  return {
    level: spec.level || "Intermediate",
    overview: spec.overview,
    businessProblem: spec.businessProblem,
    requirements: spec.requirements || [],
    functionalRequirements: spec.functionalRequirements || [],
    nonFunctionalRequirements: spec.nonFunctionalRequirements || [],
    architectureDiagram: spec.architectureDiagram,
    flowDiagram: spec.flowDiagram,
    folderStructure: spec.folderStructure,
    frontendDesign: spec.frontendDesign,
    backendDesign: spec.backendDesign,
    databaseDesign: spec.databaseDesign,
    apiSpecifications: spec.apiSpecifications,
    authenticationAuthorization: spec.authenticationAuthorization,
    deploymentStrategy: spec.deploymentStrategy,
    testingStrategy: spec.testingStrategy,
    cicdStrategy: spec.cicdStrategy,
    monitoringLogging: spec.monitoringLogging,
    interviewQuestions: spec.interviewQuestions || [],
    implementation: spec.implementation || []
  };
}

export const PROJECT_PLACEHOLDER_MARKERS = [
  "TBD",
  "coming soon",
  "placeholder",
  "lorem ipsum",
  "Blueprint loading"
];

export function hasProjectPlaceholder(text) {
  if (!text) return true;
  const t = String(text).toLowerCase();
  return PROJECT_PLACEHOLDER_MARKERS.some((m) => t.includes(m.toLowerCase()));
}
