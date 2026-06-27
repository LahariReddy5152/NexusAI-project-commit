/**
 * Phase 8 — Production Windows desktop release verification
 */
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const APP_DATA = path.join(process.env.APPDATA || "", "nexusai", "data");
const DB_PATH = path.join(APP_DATA, "nexusai.db");

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function validateStatic() {
  const issues = [];
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const mainJs = fs.readFileSync("electron/main.js", "utf8");

  if (!mainJs.includes("app.getAppPath()")) issues.push("Packaged static root not using app.getAppPath()");
  if (!mainJs.includes("resolveResource")) issues.push("Packaged resource resolver missing");
  if (pkg.build?.win?.signAndEditExecutable !== false) issues.push("signAndEditExecutable not disabled");
  if (!pkg.build?.nsis?.createDesktopShortcut) issues.push("Desktop shortcut not configured");
  if (!pkg.build?.nsis?.createStartMenuShortcut) issues.push("Start menu shortcut not configured");
  if (!pkg.build?.nsis?.allowToChangeInstallationDirectory) issues.push("Install location selection not enabled");
  if (pkg.build?.nsis?.perMachine !== false) issues.push("Per-user installation not configured");
  if (!fs.existsSync("build/icon.ico")) issues.push("Installer icon missing");

  return issues;
}

function findArtifacts() {
  const dist = "dist";
  if (!fs.existsSync(dist)) return { installer: null, portable: null, unpacked: null };

  const files = fs.readdirSync(dist);
  const installer = files.find((f) => /NexusAI-Setup.*\.exe$/i.test(f)) || null;
  const portable = files.find((f) => /NexusAI-Portable.*\.exe$/i.test(f)) || null;
  const unpacked = path.join(dist, "win-unpacked", "NexusAI.exe");
  return {
    installer: installer ? path.join(dist, installer) : null,
    portable: portable ? path.join(dist, portable) : null,
    unpacked: fs.existsSync(unpacked) ? unpacked : null
  };
}

async function validateEmbeddedServer() {
  const issues = [];
  const dataDir = path.join(process.cwd(), "data", "phase8-test");
  fs.mkdirSync(dataDir, { recursive: true });
  process.env.NEXUSAI_DATA_DIR = dataDir;

  const staticRoot = process.cwd();
  const { startServer } = await import("../server/start.js");
  const { server, port } = await startServer({ host: "127.0.0.1", port: 0, staticRoot });

  const email = `phase8-${Date.now()}@test.com`;
  const pass = "TestPass123!";
  const base = `http://127.0.0.1:${port}`;
  const json = async (url, opts) => {
    const res = await fetch(url, opts);
    return { ok: res.ok, data: await res.json().catch(() => ({})) };
  };

  const index = await fetch(`${base}/index.html`);
  if (!index.ok) issues.push("Login page not served from static root");

  const logo = await fetch(`${base}/assets/logo/nexusai-wordmark.svg`);
  if (!logo.ok) issues.push("Logo assets not served");

  const signup = await json(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Phase8", email, password: pass })
  });
  if (!signup.ok) issues.push("Signup failed");

  const login = await json(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass })
  });
  if (!login.ok || !login.data.token) issues.push("Login failed");

  const auth = { Authorization: `Bearer ${login.data.token}`, "Content-Type": "application/json" };
  const ai = await json(`${base}/api/ai/chat`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ message: "Hello", mode: "interview-coach" })
  });
  if (!ai.ok || !ai.data.reply) issues.push("AI chat failed");

  const notif = await json(`${base}/api/notifications`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ title: "Phase 8", type: "info" })
  });
  if (!notif.ok) issues.push("Notifications failed");

  const dbFile = path.join(dataDir, "nexusai.db");
  if (!fs.existsSync(dbFile)) issues.push("SQLite database not created");

  server.close();
  return issues;
}

function validatePackagedLayout() {
  const issues = [];
  const asar = path.join("dist", "win-unpacked", "resources", "app.asar");
  if (!fs.existsSync(asar)) return ["Packaged app.asar missing — run npm run build:win"];

  const unpackedExe = path.join("dist", "win-unpacked", "NexusAI.exe");
  if (!fs.existsSync(unpackedExe)) issues.push("Unpacked NexusAI.exe missing");

  return issues;
}

async function ensureBuild() {
  const artifacts = findArtifacts();
  if (artifacts.installer && (artifacts.portable || artifacts.unpacked)) return artifacts;

  await new Promise((resolve, reject) => {
    const env = { ...process.env, CSC_IDENTITY_AUTO_DISCOVERY: "false" };
    const proc = spawn("npm", ["run", "build:win"], { shell: true, stdio: "inherit", env });
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`build exited ${code}`))));
  });
  return findArtifacts();
}

async function main() {
  const staticIssues = validateStatic();
  if (staticIssues.length) {
    console.log("NOT COMPLETED");
    staticIssues.forEach((i) => console.log(" -", i));
    process.exit(1);
  }

  try {
    const serverIssues = await validateEmbeddedServer();
    if (serverIssues.length) {
      console.log("NOT COMPLETED");
      serverIssues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }

    const artifacts = await ensureBuild();
    const layoutIssues = validatePackagedLayout();
    if (layoutIssues.length) {
      console.log("NOT COMPLETED");
      layoutIssues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }

    if (!artifacts.installer) {
      console.log("NOT COMPLETED");
      console.log(" - NexusAI Setup installer not found in dist/");
      process.exit(1);
    }

    const installerSize = fs.statSync(artifacts.installer).size;
    const portablePath = artifacts.portable || artifacts.unpacked;
    const portableSize = portablePath ? fs.statSync(portablePath).size : 0;

    const report = {
      status: "COMPLETED",
      installer: path.resolve(artifacts.installer),
      installerSize: formatBytes(installerSize),
      portable: portablePath ? path.resolve(portablePath) : null,
      portableSize: portablePath ? formatBytes(portableSize) : null,
      appData: APP_DATA,
      database: DB_PATH
    };

    fs.mkdirSync("dist/release-notes", { recursive: true });
    fs.writeFileSync(
      path.join("dist", "release-notes", "phase8-artifacts.json"),
      JSON.stringify(report, null, 2)
    );

    console.log("COMPLETED");
    console.log(JSON.stringify(report, null, 2));
  } catch (e) {
    console.log("BLOCKED");
    console.log(String(e.message || e));
    process.exit(2);
  }
}

main();
