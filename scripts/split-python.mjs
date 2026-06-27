import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const src = fs.readFileSync(path.join(root, "src/python/python-data.js"), "utf8");
const match = src.match(/export const pythonCurriculum = (\[[\s\S]*\]);?\s*$/);
if (!match) throw new Error("Could not parse pythonCurriculum");
const arr = eval(match[1]);
const chunks = [[0, 4], [4, 7], [7, 10], [10, 14]];
const names = ["python-data-01", "python-data-02", "python-data-03", "python-data-04"];
const outDir = path.join(root, "src/python");

chunks.forEach(([start, end], i) => {
  const slice = arr.slice(start, end);
  const body = `export const lessons = ${JSON.stringify(slice, null, 4)};\n`;
  fs.writeFileSync(path.join(outDir, `${names[i]}.js`), body);
});

const index = `import { lessons as l1 } from "./python-data-01.js";
import { lessons as l2 } from "./python-data-02.js";
import { lessons as l3 } from "./python-data-03.js";
import { lessons as l4 } from "./python-data-04.js";

export const pythonCurriculum = [...l1, ...l2, ...l3, ...l4];
`;
fs.writeFileSync(path.join(outDir, "python-index.js"), index);
console.log("Split python into 4 parts,", arr.length, "lessons");
