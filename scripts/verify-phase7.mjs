/**
 * Phase 7 — Electron desktop application verification
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const BASE = "http://127.0.0.1";
const TEST_EMAIL = `phase7-${Date.now()}@test.com`;
const TEST_PASS = "TestPass123!";

function validateStatic() {
  const issues = [];
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

  if (pkg.main !== "electron/main.js") issues.push("Electron main entry missing");
  if (!fs.existsSync("electron/main.js")) issues.push("electron/main.js missing");
  if (!fs.existsSync("electron/preload.js")) issues.push("electron/preload.js missing");
  if (!fs.existsSync("build/icon.png")) issues.push("Application icon missing");
  if (!pkg.build?.nsis?.createDesktopShortcut) issues.push("Desktop shortcut not configured");
  if (!pkg.build?.nsis?.createStartMenuShortcut) issues.push("Start menu shortcut not configured");
  if (!pkg.scripts?.["build:win"]) issues.push("Windows build script missing");
  if (!fs.readFileSync("electron/preload.js", "utf8").includes("nexusDesktop")) {
    issues.push("Desktop preload bridge missing");
  }
  if (!fs.readFileSync("src/notifications/notifications.js", "utf8").includes("nexusDesktop")) {
    issues.push("Native notification bridge not wired");
  }
  if (!fs.readFileSync("server/db.js", "utf8").includes("NEXUSAI_DATA_DIR")) {
    issues.push("Electron userData path not supported in database");
  }

  return issues;
}

async function startTestServer() {
  const dataDir = path.join(process.cwd(), "data", "phase7-test");
  fs.mkdirSync(dataDir, { recursive: true });
  process.env.NEXUSAI_DATA_DIR = dataDir;
  const { startServer } = await import("../server/start.js");
  const { server, port } = await startServer({ host: "127.0.0.1", port: 0 });
  return { server, port, dataDir };
}

async function api(port, pathSuffix, options = {}) {
  const res = await fetch(`${BASE}:${port}/api${pathSuffix}`, options);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

async function validateBackend(port, dataDir) {
  const issues = [];
  const auth = { Authorization: "", "Content-Type": "application/json" };

  const signup = await api(port, "/auth/signup", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ name: "Electron User", email: TEST_EMAIL, password: TEST_PASS })
  });
  if (!signup.ok) issues.push("Signup failed in embedded server mode");

  const login = await api(port, "/auth/login", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS, rememberMe: true })
  });
  if (!login.ok || !login.data.token) issues.push("Login failed");
  auth.Authorization = `Bearer ${login.data.token}`;

  const ai = await api(port, "/ai/chat", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ message: "Hello", mode: "interview-coach" })
  });
  if (!ai.ok || !ai.data.reply) issues.push("AI chat failed");

  const resume = await api(port, "/resume/analyze", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ text: "Python Java SQL developer with REST API and Docker experience." })
  });
  if (!resume.ok) issues.push("Resume analyzer failed");

  const notif = await api(port, "/notifications", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ title: "Desktop test", type: "info" })
  });
  if (!notif.ok) issues.push("Notifications failed");

  const gh = await api(port, "/github/connect", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ username: "testuser" })
  });
  if (!gh.ok) issues.push("GitHub connect failed");

  const speech = await api(port, "/speech/evaluate", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ transcript: "I led a team to improve API latency by forty percent." })
  });
  if (!speech.ok) issues.push("Speech evaluation failed");

  const dbPath = path.join(dataDir, "nexusai.db");
  if (!fs.existsSync(dbPath)) issues.push("Database persistence file not created");

  return { issues, token: login.data.token, email: TEST_EMAIL };
}

async function validateBrowser(port, token, email) {
  const issues = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`${BASE}:${port}/index.html`, { waitUntil: "networkidle", timeout: 45000 });

  const remember = await page.$("#rememberMe");
  if (!remember) issues.push("Remember me missing on login");

  await page.addInitScript(({ t, em }) => {
    localStorage.setItem("nexusToken", t);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Electron User", email: em, role: "user" }));
  }, { t: token, em: email });

  await page.goto(`${BASE}:${port}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  for (const size of [
    { w: 1280, h: 800 },
    { w: 900, h: 800 },
    { w: 390, h: 844 }
  ]) {
    await page.setViewportSize({ width: size.w, height: size.h });
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (overflow) issues.push(`Horizontal scroll at ${size.w}px`);
  }

  await browser.close();
  return issues;
}

function findInstaller() {
  if (!fs.existsSync("dist")) return null;
  const files = fs.readdirSync("dist");
  const setup = files.find((f) => f.endsWith(".exe") && /Setup|Installer/i.test(f));
  if (setup) return setup;
  const portable = files.find((f) => f.endsWith(".exe") && !f.includes("unpacked"));
  return portable || null;
}

async function validateBuildArtifacts() {
  const issues = [];
  const unpacked = path.join("dist", "win-unpacked", "NexusAI.exe");
  if (!installer && !fs.existsSync(unpacked)) {
    issues.push("Windows installer (.exe) not found — run npm run build:win");
    return issues;
  }

  if (installer) {
    const stat = fs.statSync(path.join("dist", installer));
    if (stat.size < 100000) issues.push("Installer file suspiciously small");
  }

  if (fs.existsSync(unpacked)) {
    const iconOk = fs.existsSync(path.join("dist", "win-unpacked", "resources", "app", "build", "icon.png"));
    if (!iconOk) issues.push("Packaged icon missing");
  }

  return issues;
}

async function main() {
  const staticIssues = validateStatic();
  if (staticIssues.length) {
    console.log("NOT COMPLETED");
    staticIssues.forEach((i) => console.log(" -", i));
    process.exit(1);
  }

  let server;
  try {
    const started = await startTestServer();
    server = started.server;
    const port = started.port;

    const backend = await validateBackend(port, started.dataDir);
    if (backend.issues.length) {
      console.log("NOT COMPLETED");
      backend.issues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }

    const browserIssues = await validateBrowser(port, backend.token, backend.email);
    if (browserIssues.length) {
      console.log("NOT COMPLETED");
      browserIssues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }

    server.close();

    if (!findInstaller()) {
      console.log("Building Windows installer...");
      await new Promise((resolve, reject) => {
        const proc = spawn("npm", ["run", "build:win"], { shell: true, stdio: "inherit" });
        proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`build exited ${code}`))));
      });
    }

    const buildIssues = await validateBuildArtifacts();
    if (buildIssues.length) {
      console.log("NOT COMPLETED");
      buildIssues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }

    console.log("COMPLETED");
  } catch (e) {
    console.log("BLOCKED");
    console.log(String(e.message || e));
    process.exit(2);
  } finally {
    if (server) server.close();
  }
}

main();
