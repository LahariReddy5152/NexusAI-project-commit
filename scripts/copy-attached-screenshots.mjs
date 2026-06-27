/**
 * Copy attached WhatsApp light-mode screenshots into docs/screenshots/
 */
import fs from "fs";
import path from "path";

const ASSETS = path.resolve(
  "C:/Users/lahar/.cursor/projects/c-Users-lahar-OneDrive-Desktop-AI-Engineer-new/assets"
);
const OUT = path.join(process.cwd(), "docs", "screenshots");

const MAP = [
  ["3.12.06_PM-52846f65", "02-dashboard.png"],
  ["3.12.06_PM__1_", "03-learn.png"],
  ["3.12.18_PM__1_", "04-projects.png"],
  ["3.12.18_PM-530852e9", "11-python-workspace.png"],
  ["3.12.18_PM__3_", "06-career.png"],
  ["3.12.19_PM__1_-1afbd80f", "09-profile.png"],
  ["3.12.19_PM-3bfde3b8", "10-code-lab.png"]
];

if (!fs.existsSync(ASSETS)) {
  console.error("Assets folder not found:", ASSETS);
  process.exit(1);
}

const files = fs.readdirSync(ASSETS);
fs.mkdirSync(OUT, { recursive: true });

for (const [needle, target] of MAP) {
  const match = files.find((f) => f.includes(needle));
  if (!match) {
    console.warn("Missing asset for", target);
    continue;
  }
  fs.copyFileSync(path.join(ASSETS, match), path.join(OUT, target));
  console.log("Copied", target);
}

console.log("Attached screenshot copy complete.");
