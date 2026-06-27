import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");

function wrapFunctions(content) {
  return content.replace(/^function (\w+)/gm, "export function $1");
}

function processRaw(relIn, relOut, header = "", footer = "") {
  const inPath = path.join(root, relIn);
  const outPath = path.join(root, relOut);
  if (!fs.existsSync(inPath)) {
    console.warn("skip missing", relIn);
    return;
  }
  let body = fs.readFileSync(inPath, "utf8");
  body = wrapFunctions(body);
  fs.writeFileSync(outPath, header + body + footer);
  console.log("wrapped", relOut);
}

processRaw("src/app/app-navigation.raw.js", "src/app/app-navigation.js");
processRaw("src/app/app-coding-lab.raw.js", "src/coding-lab/coding-lab.js");
processRaw("src/interview/interview-prep.raw.js", "src/interview/interview-prep.js");
processRaw("src/app/app-platform.raw.js", "src/app/app-platform.js", `import { updateEl } from "../shared/helpers.js";\n`);

const analytics = fs.readFileSync(path.join(root, "src/dashboard/analytics-overlay.raw.js"), "utf8");
fs.writeFileSync(path.join(root, "src/dashboard/analytics-overlay.js"), analytics + "\n");

console.log("done");
