/**
 * Generate portfolio and README screenshots for NexusAI v1.0.0
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { startServer } from "../server/start.js";

const OUT = path.join("docs", "screenshots");
const VIEWPORT = { width: 1440, height: 900 };

async function seedUser(port) {
  const email = `screenshot-${Date.now()}@nexusai.dev`;
  const password = "Screenshot123!";
  const base = `http://127.0.0.1:${port}`;

  await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alex Chen", email, password })
  });

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe: true })
  });
  const data = await login.json();
  return { token: data.token, email, name: "Alex Chen" };
}

async function capture(page, filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await page.screenshot({ path: filePath, fullPage: false });
  console.log("Created", filePath);
}

async function showSection(page, sectionId) {
  await page.evaluate((id) => {
    document.querySelectorAll(".section").forEach((el) => el.classList.add("hidden"));
    const target = document.getElementById(id);
    if (target) target.classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));
  }, sectionId);
  await page.waitForTimeout(600);
}

async function main() {
  const dataDir = path.join(process.cwd(), "data", "screenshot-session");
  fs.mkdirSync(dataDir, { recursive: true });
  process.env.NEXUSAI_DATA_DIR = dataDir;

  const { server, port } = await startServer({ host: "127.0.0.1", port: 0, staticRoot: process.cwd() });
  const base = `http://127.0.0.1:${port}`;
  const user = await seedUser(port);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });

  await page.goto(`${base}/index.html`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  await capture(page, path.join(OUT, "01-login.png"));

  await page.addInitScript(({ token, email, name }) => {
    localStorage.setItem("nexusToken", token);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({
      name,
      email,
      role: "user",
      avatar: { type: "male" },
      progress: { points: 420, streak: 7, hours: 28 }
    }));
  }, { token: user.token, email: user.email, name: user.name });

  await page.goto(`${base}/dashboard.html`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);

  const shots = [
    ["02-dashboard.png", "dashboardSection"],
    ["03-learn.png", "learnSection"],
    ["04-projects.png", "realProjectsSection"],
    ["05-interview-prep.png", "interviewSection"],
    ["06-career.png", "jobModeSection"]
  ];

  for (const [file, section] of shots) {
    await showSection(page, section);
    await capture(page, path.join(OUT, file));
  }

  await showSection(page, "dashboardSection");
  await page.evaluate(() => {
    const panel = document.getElementById("chatbotBox");
    const shell = document.getElementById("globalRecruiterShell");
    if (panel) panel.classList.remove("hidden");
    if (shell) shell.classList.add("open");
    const input = document.getElementById("chatInput");
    if (input) input.value = "How do I prepare for a system design interview?";
  });
  await page.waitForTimeout(800);
  await capture(page, path.join(OUT, "07-virtual-recruiter.png"));

  const installerHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>NexusAI Installer</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Segoe UI",sans-serif;background:linear-gradient(135deg,#1a0508,#2a0812);min-height:100vh;display:flex;align-items:center;justify-content:center;color:#fdf2f8}
  .card{background:rgba(20,4,10,.92);border:1px solid rgba(199,123,127,.35);border-radius:20px;padding:40px 48px;width:520px;box-shadow:0 24px 64px rgba(74,0,18,.6)}
  .logo{font-size:28px;font-weight:700;letter-spacing:2px;margin-bottom:8px}
  .logo span{color:#38bdf8}
  .tag{color:#d4a0a8;font-size:12px;letter-spacing:4px;margin-bottom:28px}
  h2{font-size:18px;margin-bottom:16px}
  .bar{height:8px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;margin:20px 0}
  .fill{height:100%;width:72%;background:linear-gradient(90deg,#fb7185,#c084fc,#38bdf8)}
  ul{list-style:none;font-size:14px;color:#e8a0a8;line-height:2}
  .btn{display:inline-block;margin-top:24px;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#be123c,#6b21a8);color:#fff;font-weight:600}
</style></head>
<body><div class="card">
  <div class="logo">NEXUS<span>AI</span></div>
  <div class="tag">LEARN · BUILD · GROW</div>
  <h2>Installing NexusAI 1.0.0</h2>
  <div class="bar"><div class="fill"></div></div>
  <ul>
    <li>✓ Desktop shortcut</li>
    <li>✓ Start menu entry</li>
    <li>✓ Embedded SQLite database</li>
    <li>✓ Virtual Recruiter AI mentor</li>
  </ul>
  <div class="btn">NexusAI-Setup-1.0.0.exe</div>
</div></body></html>`;

  const installerPath = path.join(OUT, "_installer-mock.html");
  fs.writeFileSync(installerPath, installerHtml);
  await page.goto(`file:///${installerPath.replace(/\\/g, "/")}`, { waitUntil: "load" });
  await capture(page, path.join(OUT, "08-desktop-installer.png"));
  fs.unlinkSync(installerPath);

  await browser.close();
  server.close();
  console.log("Screenshot generation complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
