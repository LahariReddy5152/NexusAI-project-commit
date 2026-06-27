import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
let lines = fs.readFileSync(path.join(root, "src/app/app-platform.raw.js"), "utf8").split(/\r?\n/);

const out = [];
let skipUntilClose = false;
let parenDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (/^window\.onload/.test(line)) {
    skipUntilClose = true;
    parenDepth = 0;
    continue;
  }
  if (skipUntilClose) {
    if (line.includes("function(") || line.includes("function (")) parenDepth++;
    if (/^\}/.test(line) && !skipUntilClose) continue;
    if (skipUntilClose && line.trim() === "}") {
      skipUntilClose = false;
    }
    continue;
  }

  if (/^window\./.test(line)) {
    if (!line.trim().endsWith(";")) {
      while (i + 1 < lines.length && !lines[i].trim().endsWith(";")) i++;
    }
    continue;
  }

  if (line === "renderJobs();" || line === "unlockCertificates();" || line === "updateTime();") continue;

  if (/^const savedName/.test(line)) {
    while (i < lines.length && !/^export function updateAnalytics/.test(lines[i])) i++;
    i--;
    continue;
  }

  out.push(line.replace(/^function /, "export function "));
}

const header = [
  'import { showSection } from "./app-navigation.js";',
  "",
  "let timer;",
  'let minutes = Number(localStorage.getItem("projectMinutes")) || 0;',
  ""
];

fs.writeFileSync(path.join(root, "src/app/app-platform.js"), header.join("\n") + "\n" + out.join("\n") + "\n");
console.log("lines:", header.length + out.length);
