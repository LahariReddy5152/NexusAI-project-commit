/**
 * Phase 9 — GitHub release and portfolio preparation verification
 */
import fs from "fs";
import path from "path";

const SCREENSHOTS = [
  "docs/screenshots/01-login.png",
  "docs/screenshots/02-dashboard.png",
  "docs/screenshots/03-learn.png",
  "docs/screenshots/04-projects.png",
  "docs/screenshots/05-interview-prep.png",
  "docs/screenshots/06-career.png",
  "docs/screenshots/07-virtual-recruiter.png",
  "docs/screenshots/08-desktop-installer.png"
];

const DOCS = [
  "docs/RELEASE_v1.0.0.md",
  "docs/PORTFOLIO.md",
  "docs/GITHUB_SETUP.md",
  "CHANGELOG.md",
  "README.md"
];

const INSTALLER = "dist/NexusAI-Setup-1.0.0.exe";
const PORTABLE = "dist/NexusAI-Portable-1.0.0.exe";

function validateReadme() {
  const issues = [];
  const readme = fs.readFileSync("README.md", "utf8");

  if (!readme.includes("## Demo")) issues.push("README missing Demo section");
  if (!readme.includes("docs/screenshots/01-login.png")) issues.push("README screenshots not pointing to docs/screenshots/");
  if (!readme.includes("```mermaid")) issues.push("README missing architecture diagram");
  if (!readme.includes("LahariReddy5152/NexusAI-project-commit")) issues.push("README missing repository URL");
  if (!readme.includes("## Future roadmap")) issues.push("README missing roadmap");
  if (!readme.includes("## License")) issues.push("README missing license section");

  return issues;
}

function validatePortfolio() {
  const issues = [];
  const portfolio = fs.readFileSync("docs/PORTFOLIO.md", "utf8");

  if (!portfolio.includes("Resume project bullets")) issues.push("Portfolio missing resume bullets");
  if (!portfolio.includes("LinkedIn project description")) issues.push("Portfolio missing LinkedIn description");
  if (!portfolio.includes("30-second project pitch")) issues.push("Portfolio missing 30-second pitch");
  if (!portfolio.includes("2-minute interview explanation")) issues.push("Portfolio missing 2-minute explanation");
  if (!portfolio.includes("Architecture summary")) issues.push("Portfolio missing architecture summary");

  return issues;
}

function validateReleaseNotes() {
  const issues = [];
  const notes = fs.readFileSync("docs/RELEASE_v1.0.0.md", "utf8");

  if (!notes.includes("NexusAI v1.0.0")) issues.push("Release notes missing version title");
  if (!notes.includes("## Changelog")) issues.push("Release notes missing changelog");
  if (!notes.includes("## Known limitations")) issues.push("Release notes missing known limitations");
  if (!notes.includes("## Installation")) issues.push("Release notes missing installation");

  return issues;
}

function validateScreenshots() {
  const issues = [];
  for (const file of SCREENSHOTS) {
    if (!fs.existsSync(file)) {
      issues.push(`Screenshot missing: ${file}`);
      continue;
    }
    const size = fs.statSync(file).size;
    if (size < 5000) issues.push(`Screenshot too small: ${file}`);
  }
  return issues;
}

function validateInstallers() {
  const issues = [];
  if (!fs.existsSync(INSTALLER)) issues.push(`Installer missing: ${INSTALLER}`);
  else if (fs.statSync(INSTALLER).size < 50_000_000) issues.push("Installer suspiciously small");

  if (!fs.existsSync(PORTABLE)) issues.push(`Portable build missing: ${PORTABLE}`);
  return issues;
}

function main() {
  const issues = [
    ...DOCS.filter((f) => !fs.existsSync(f)).map((f) => `Doc missing: ${f}`),
    ...validateReadme(),
    ...validatePortfolio(),
    ...validateReleaseNotes(),
    ...validateScreenshots(),
    ...validateInstallers()
  ];

  if (issues.length) {
    console.log("NOT COMPLETED");
    issues.forEach((i) => console.log(" -", i));
    process.exit(1);
  }

  const report = {
    status: "COMPLETED",
    releaseNotes: path.resolve("docs/RELEASE_v1.0.0.md"),
    portfolio: path.resolve("docs/PORTFOLIO.md"),
    installer: path.resolve(INSTALLER),
    installerSizeMB: (fs.statSync(INSTALLER).size / (1024 * 1024)).toFixed(1),
    portable: path.resolve(PORTABLE),
    screenshots: SCREENSHOTS.map((p) => path.resolve(p)),
    githubRelease: "https://github.com/LahariReddy5152/NexusAI-project-commit/releases/tag/v1.0.0",
    manualStep: "Publish release via docs/GITHUB_SETUP.md if gh CLI unavailable"
  };

  console.log("COMPLETED");
  console.log(JSON.stringify(report, null, 2));
}

main();
