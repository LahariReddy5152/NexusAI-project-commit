/**
 * Phase 6 — Real backend integrations verification
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";
const TEST_EMAIL = `phase6-${Date.now()}@test.com`;
const TEST_PASS = "TestPass123!";

function validateStatic() {
  const issues = [];
  if (!fs.existsSync("server/db.js")) issues.push("SQLite database module missing");
  if (!fs.existsSync("server/openapi.yaml")) issues.push("OpenAPI spec missing");
  if (!fs.existsSync("src/shared/api-client.js")) issues.push("API client missing");
  if (!fs.readFileSync("server/routes/api.js", "utf8").includes("/resume/analyze")) {
    issues.push("Resume analyze API missing");
  }
  if (!fs.readFileSync("server/routes/api.js", "utf8").includes("/ai/chat")) {
    issues.push("AI chat API missing");
  }
  if (!fs.readFileSync("server/routes/api.js", "utf8").includes("/github/connect")) {
    issues.push("GitHub API missing");
  }
  if (!fs.readFileSync("server/routes/api.js", "utf8").includes("/speech/evaluate")) {
    issues.push("Speech API missing");
  }
  if (!fs.readFileSync("server/routes/api.js", "utf8").includes("/uploads/")) {
    issues.push("Upload API missing");
  }
  if (!fs.readFileSync("index.html", "utf8").includes("rememberMe")) {
    issues.push("Remember me option missing");
  }
  return issues;
}

async function api(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, options);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function validateApi() {
  const issues = [];

  const signup = await api("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Phase6 User", email: TEST_EMAIL, password: TEST_PASS })
  });
  if (!signup.ok) issues.push(`Signup failed: ${signup.data.message}`);

  const login = await api("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS, rememberMe: true })
  });
  if (!login.ok || !login.data.token) issues.push("Login with remember me failed");
  const token = login.data.token;
  const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const me = await api("/auth/me", { headers: auth });
  if (!me.ok) issues.push("Protected /auth/me failed");

  const forgot = await api("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL })
  });
  if (!forgot.ok) issues.push("Forgot password failed");

  if (forgot.data.resetToken) {
    const reset = await api("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: forgot.data.resetToken, newPassword: "NewPass456!" })
    });
    if (!reset.ok) issues.push("Reset password failed");
  }

  const ai = await api("/ai/chat", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ message: "Give a Python hint", mode: "coding-assistant" })
  });
  if (!ai.ok || !ai.data.reply) issues.push("AI chat failed");

  const resume = await api("/resume/analyze", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ text: "Python Java SQL Spring React developer with REST API experience and 40% latency improvement." })
  });
  if (!resume.ok || typeof resume.data.atsScore !== "number") issues.push("Resume analyze failed");

  const tailor = await api("/resume/tailor", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      resume: "Python developer with FastAPI experience",
      jobDescription: "Looking for Python FastAPI React engineer with SQL skills"
    })
  });
  if (!tailor.ok || !tailor.data.tailoredResume) issues.push("Resume tailor failed");

  const ghConnect = await api("/github/connect", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ username: "testuser" })
  });
  if (!ghConnect.ok) issues.push("GitHub connect failed");

  const speech = await api("/speech/evaluate", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ transcript: "Situation: outage. Task: fix. Action: I led rollback. Result: 40% faster recovery." })
  });
  if (!speech.ok || !speech.data.scores) issues.push("Speech evaluate failed");

  const synth = await api("/speech/synthesize", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ text: "Hello interview candidate" })
  });
  if (!synth.ok) issues.push("Speech synthesize failed");

  const notif = await api("/notifications", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ title: "Phase 6 test", type: "info" })
  });
  if (!notif.ok) issues.push("Create notification failed");

  const notifList = await api("/notifications", { headers: auth });
  if (!notifList.ok || !notifList.data.notifications?.length) issues.push("List notifications failed");

  const progress = await api("/progress/interview", {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({ sectionId: "mock", entry: { score: 80 } })
  });
  if (!progress.ok) issues.push("Interview progress sync failed");

  const achievements = await api("/achievements", { headers: auth });
  if (!achievements.ok || !achievements.data.summary) issues.push("Achievements API failed");

  const openapi = await fetch(`${BASE}/api/openapi.yaml`);
  if (!openapi.ok) issues.push("OpenAPI spec not served");

  const docs = await fetch(`${BASE}/api/docs/`);
  if (!docs.ok) issues.push("Swagger docs not available");

  return { issues, token };
}

async function validateBrowser(token) {
  const issues = [];
  const consoleErrors = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.addInitScript(({ t, email }) => {
    localStorage.setItem("nexusToken", t);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Phase6", email, role: "user" }));
  }, { t: token, email: TEST_EMAIL });

  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  // Protected route without token redirects (fresh context — no init script)
  const b = page.context().browser();
  const protectedCtx = await b.newContext();
  const protectedPage = await protectedCtx.newPage();
  await protectedPage.goto(`${BASE}/dashboard.html`, { waitUntil: "domcontentloaded", timeout: 15000 });
  try {
    await protectedPage.waitForURL(/index\.html/, { timeout: 8000 });
  } catch {
    if (!protectedPage.url().includes("index.html")) issues.push("Protected route did not redirect without token");
  }
  await protectedCtx.close();

  await page.addInitScript(({ t, email }) => {
    localStorage.setItem("nexusToken", t);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("nexusUser", JSON.stringify({ name: "Phase6", email, role: "user" }));
  }, { t: token, email: TEST_EMAIL });
  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle", timeout: 45000 });

  // VR uses API
  await page.click("#vrToggleBtn");
  await page.fill("#chatInput", "Give me an interview tip");
  await page.click("#chatInputRow button");
  await page.waitForTimeout(800);
  const vrMsg = await page.textContent("#chatMessages");
  if (!vrMsg || vrMsg.length < 20) issues.push("VR chat did not respond");

  // Career resume analyze
  await page.click("button.nav-btn:has-text('Career')");
  await page.fill("#resumeText", "Python Java SQL React AWS developer with microservices and CI/CD experience.");
  await page.click("button:has-text('Analyze Resume')");
  await page.waitForTimeout(600);
  const ats = await page.textContent("#atsScore");
  if (!ats?.includes("%")) issues.push("Resume analyzer UI failed");

  // Profile achievements
  await page.click("button.nav-btn:has-text('Profile')");
  await page.waitForSelector(".achievement-chip", { timeout: 8000 });
  const chips = await page.$$(".achievement-chip");
  if (chips.length < 5) issues.push("Profile achievements missing");

  // Responsive checks
  for (const size of [
    { w: 1280, h: 800, label: "desktop" },
    { w: 900, h: 800, label: "tablet" },
    { w: 390, h: 844, label: "mobile" }
  ]) {
    await page.setViewportSize({ width: size.w, height: size.h });
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (overflow) issues.push(`Horizontal scroll on ${size.label}`);
  }

  const critical = consoleErrors.filter((e) => !/favicon|404|Failed to load resource/i.test(e));
  if (critical.length) issues.push(`Console errors: ${critical.slice(0, 2).join("; ")}`);

  await page.close();
  await browser.close();
  return issues;
}

async function main() {
  const staticIssues = validateStatic();
  if (staticIssues.length) {
    console.log("NOT COMPLETED");
    staticIssues.forEach((i) => console.log(" -", i));
    process.exit(1);
  }

  try {
    const { issues: apiIssues, token } = await validateApi();
    if (apiIssues.length) {
      console.log("NOT COMPLETED");
      apiIssues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }

    const browserIssues = await validateBrowser(token);
    if (browserIssues.length) {
      console.log("NOT COMPLETED");
      browserIssues.forEach((i) => console.log(" -", i));
      process.exit(1);
    }

    console.log("COMPLETED");
  } catch (e) {
    console.log("BLOCKED");
    console.log(String(e.message || e));
    process.exit(2);
  }
}

main();
