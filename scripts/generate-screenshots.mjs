/**
 * Generate portfolio and README screenshots for NexusAI v1.1.0 (light mode)
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { startServer } from "../server/start.js";

const OUT = path.join("docs", "screenshots");
const VIEWPORT = { width: 1440, height: 900 };
const DEMO_USER = {
  name: "Lahari",
  email: "laharireddy5152@gmail.com",
  password: "Screenshot123!"
};

async function seedUser(port) {
  const base = `http://127.0.0.1:${port}`;

  await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: DEMO_USER.name, email: DEMO_USER.email, password: DEMO_USER.password })
  }).catch(() => {});

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_USER.email, password: DEMO_USER.password, rememberMe: true })
  });
  const data = await login.json();
  return { token: data.token, email: DEMO_USER.email, name: DEMO_USER.name };
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
    const nav = document.querySelector(`[data-section="${id}"]`);
    if (nav) nav.classList.add("active");
  }, sectionId);
  await page.waitForTimeout(600);
}

async function forceLightTheme(page) {
  await page.evaluate(() => {
    document.body.classList.remove("theme-dark");
    document.body.classList.add("light-mode");
    localStorage.setItem("nexusTheme", "light");
    const logo = document.querySelector(".nexusai-logo--sidebar");
    if (logo) logo.src = "assets/logo/nexusai-wordmark-light.svg";
    document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.themeBtn === "light");
    });
  });
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
    localStorage.setItem("nexusTheme", "light");
    localStorage.setItem("nexusUser", JSON.stringify({
      name,
      email,
      role: "user",
      avatar: { type: "male" },
      progress: { points: 420, streak: 7, hours: 28 }
    }));
  }, { token: user.token, email: user.email, name: user.name });

  await page.goto(`${base}/dashboard.html`, { waitUntil: "networkidle", timeout: 60000 });
  await forceLightTheme(page);
  await page.waitForTimeout(1500);

  const shots = [
    ["02-dashboard.png", "dashboardSection"],
    ["03-learn.png", "learnSection"],
    ["04-projects.png", "realProjectsSection"],
    ["05-interview-prep.png", "interviewSection"],
    ["06-career.png", "jobModeSection"],
    ["09-profile.png", "profileSection"],
    ["10-code-lab.png", "codingLabSection"]
  ];

  for (const [file, section] of shots) {
    await showSection(page, section);
    await forceLightTheme(page);
    await capture(page, path.join(OUT, file));
  }

  await showSection(page, "learnSection");
  await forceLightTheme(page);
  await page.evaluate(() => {
    if (typeof window.openLearnWorkspace === "function") {
      window.openLearnWorkspace("python-fundamentals", 0);
    }
  });
  await page.waitForTimeout(1000);
  await capture(page, path.join(OUT, "11-python-workspace.png"));

  await showSection(page, "dashboardSection");
  await forceLightTheme(page);
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
  body{font-family:"Segoe UI",sans-serif;background:linear-gradient(135deg,#fff5f7,#fae8ff,#e0f2fe);min-height:100vh;display:flex;align-items:center;justify-content:center;color:#0f172a}
  .card{background:rgba(255,255,255,.94);border:1px solid rgba(244,114,182,.25);border-radius:20px;padding:40px 48px;width:520px;box-shadow:0 24px 64px rgba(148,163,184,.22)}
  .logo{font-size:28px;font-weight:700;letter-spacing:2px;margin-bottom:8px;color:#0f172a}
  .logo span{color:#0284c7}
  .tag{color:#64748b;font-size:12px;letter-spacing:4px;margin-bottom:28px}
  h2{font-size:18px;margin-bottom:16px;color:#0f172a}
  .bar{height:8px;background:rgba(148,163,184,.2);border-radius:99px;overflow:hidden;margin:20px 0}
  .fill{height:100%;width:72%;background:linear-gradient(90deg,#fb7185,#c084fc,#38bdf8)}
  ul{list-style:none;font-size:14px;color:#334155;line-height:2}
  .btn{display:inline-block;margin-top:24px;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#fb7185,#c084fc,#38bdf8);color:#fff;font-weight:600}
</style></head>
<body><div class="card">
  <div class="logo">NEXUS<span>AI</span></div>
  <div class="tag">LEARN · BUILD · GROW</div>
  <h2>Installing NexusAI 1.1.0 for Lahari</h2>
  <div class="bar"><div class="fill"></div></div>
  <ul>
    <li>✓ Desktop shortcut</li>
    <li>✓ Start menu entry</li>
    <li>✓ Embedded SQLite database</li>
    <li>✓ Virtual Recruiter AI mentor</li>
  </ul>
  <div class="btn">NexusAI-Setup-1.1.0.exe</div>
</div></body></html>`;

  const installerPath = path.join(OUT, "_installer-mock.html");
  fs.writeFileSync(installerPath, installerHtml);
  await page.goto(`file:///${installerPath.replace(/\\/g, "/")}`, { waitUntil: "load" });
  await capture(page, path.join(OUT, "08-desktop-installer.png"));
  fs.unlinkSync(installerPath);

  await browser.close();
  server.close();

  // Prefer attached WhatsApp captures for pages present in assets folder
  try {
    const { execSync } = await import("node:child_process");
    execSync("node scripts/copy-attached-screenshots.mjs", { stdio: "inherit", cwd: process.cwd() });
  } catch {
    console.warn("Attached screenshot copy skipped.");
  }

  console.log("Screenshot generation complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
