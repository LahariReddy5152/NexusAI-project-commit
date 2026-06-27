import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const file = path.join(root, "src/app/app-platform.js");
let content = fs.readFileSync(file, "utf8");

content = content.replace(/^window\.\w+[\s\S]*?;\n/gm, "");
content = content.replace(/^window\.onload=function\(\)\{[\s\S]*?\n\}\n/m, "");
content = content.replace(/^renderJobs\(\);\n/m, "");
content = content.replace(/^unlockCertificates\(\);\n/m, "");
content = content.replace(
  /^const savedName =[\s\S]*?^\}\n/m,
  ""
);
content = content.replace(
  /^const savedEmail =[\s\S]*?^\}\n/m,
  ""
);

fs.writeFileSync(file, content);
console.log("cleaned app-platform.js");
