import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const lines = css.split(/\r?\n/);
const chunkSize = 340;
const outDir = path.join(root, "src/shared/styles");
const files = [];

for (let i = 0; i < lines.length; i += chunkSize) {
  const n = Math.floor(i / chunkSize) + 1;
  const name = `styles-part-${String(n).padStart(2, "0")}.css`;
  const chunk = lines.slice(i, i + chunkSize).join("\n") + "\n";
  fs.writeFileSync(path.join(outDir, name), chunk);
  files.push(name);
}

const imports = files.map((f) => `@import url("./${f}");`).join("\n") + "\n";
fs.writeFileSync(path.join(outDir, "index.css"), imports);

const rootCss = `/* NexusAI — modular styles entry */\n${files.map((f) => `@import url("./src/shared/styles/${f}");`).join("\n")}\n`;
fs.writeFileSync(path.join(root, "style.css"), rootCss);
console.log("Split CSS into", files.length, "parts");
