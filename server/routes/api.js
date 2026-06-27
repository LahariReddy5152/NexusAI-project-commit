import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db, getUserByEmail, getUserById, parseJson, saveAppState, loadAppState } from "../db.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { analyzeResume, tailorResume } from "../services/resume.service.js";
import { generateAiReply } from "../services/ai.service.js";
import {
  verifyConnection,
  createRepository,
  listRepositories,
  listCommits,
  parseRepoUrl,
  pushProgressCommit
} from "../services/github.service.js";
import { analyzeSpeechTranscript, synthesizeSpeechPayload } from "../services/speech.service.js";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataRoot = process.env.NEXUSAI_DATA_DIR || path.join(__dirname, "..", "..", "data");
const uploadsDir = path.join(dataRoot, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: parseJson(row.avatar_json, {}),
    createdAt: row.created_at
  };
}

function seedNotifications(userId) {
  const count = db.prepare("SELECT COUNT(*) as c FROM notifications WHERE user_id = ?").get(userId).c;
  if (count > 0) return;
  const now = Date.now();
  db.prepare(
    "INSERT INTO notifications (id, user_id, title, type, read, archived, deleted, created_at) VALUES (?, ?, ?, ?, 0, 0, 0, ?)"
  ).run(uuidv4(), userId, "Welcome to NexusAI", "info", now);
  db.prepare(
    "INSERT INTO notifications (id, user_id, title, type, read, archived, deleted, created_at) VALUES (?, ?, ?, ?, 0, 0, 0, ?)"
  ).run(uuidv4(), userId, "Complete your first lesson to earn XP", "course", now);
}

// ─── Auth ───
router.post("/auth/signup", async (req, res) => {
  const { name, email, password, avatar } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  }
  if (getUserByEmail(email)) {
    return res.status(409).json({ success: false, message: "User already exists" });
  }

  const id = uuidv4();
  const role = email.toLowerCase() === "lahareddy5152@gmail.com" ? "admin" : "user";
  const hash = await bcrypt.hash(password, 10);
  db.prepare(
    "INSERT INTO users (id, email, password_hash, name, role, avatar_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, email.toLowerCase(), hash, name, role, JSON.stringify(avatar || {}), Date.now());
  db.prepare("INSERT INTO profiles (user_id, data_json, updated_at) VALUES (?, ?, ?)").run(
    id,
    JSON.stringify({ progress: { points: 0, streak: 0, hours: 0 } }),
    Date.now()
  );
  seedNotifications(id);

  res.status(201).json({ success: true, message: "Signup successful" });
});

router.post("/auth/login", async (req, res) => {
  const { email, password, rememberMe } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = signToken(user.id, !!rememberMe);
  const expiresAt = Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
  db.prepare("INSERT INTO sessions (id, user_id, token, expires_at, remember_me) VALUES (?, ?, ?, ?, ?)").run(
    uuidv4(),
    user.id,
    token,
    expiresAt,
    rememberMe ? 1 : 0
  );

  res.json({ success: true, message: "Login successful", token, user: publicUser(user) });
});

router.post("/auth/forgot-password", (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const user = getUserByEmail(email);
  if (!user) {
    return res.json({ success: true, message: "If that email exists, a reset link was sent." });
  }

  const resetToken = uuidv4();
  const resetExpires = Date.now() + 3600000;
  db.prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?").run(resetToken, resetExpires, user.id);

  res.json({
    success: true,
    message: "Password reset link generated.",
    resetToken: process.env.NODE_ENV === "production" ? undefined : resetToken
  });
});

router.post("/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: "Token and new password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?").get(token, Date.now());
  if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

  const hash = await bcrypt.hash(newPassword, 10);
  db.prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?").run(hash, user.id);
  res.json({ success: true, message: "Password updated successfully" });
});

router.get("/auth/me", requireAuth, (req, res) => {
  const profile = db.prepare("SELECT data_json FROM profiles WHERE user_id = ?").get(req.user.id);
  res.json({ success: true, user: publicUser(req.user), profile: parseJson(profile?.data_json, {}) });
});

router.post("/auth/logout", requireAuth, (req, res) => {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(req.token);
  res.json({ success: true, message: "Logged out" });
});

// ─── Profile & state ───
router.get("/users/profile", requireAuth, (req, res) => {
  const profile = db.prepare("SELECT data_json FROM profiles WHERE user_id = ?").get(req.user.id);
  res.json({ success: true, user: publicUser(req.user), profile: parseJson(profile?.data_json, {}) });
});

router.put("/users/profile", requireAuth, (req, res) => {
  const { name, email, profile } = req.body || {};
  if (name) db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, req.user.id);
  if (email && email !== req.user.email) {
    if (getUserByEmail(email)) return res.status(409).json({ success: false, message: "Email already in use" });
    db.prepare("UPDATE users SET email = ? WHERE id = ?").run(email.toLowerCase(), req.user.id);
  }
  if (profile) {
    db.prepare(
      "INSERT INTO profiles (user_id, data_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data_json = excluded.data_json, updated_at = excluded.updated_at"
    ).run(req.user.id, JSON.stringify(profile), Date.now());
  }
  const user = getUserById(req.user.id);
  res.json({ success: true, user: publicUser(user) });
});

router.put("/users/avatar", requireAuth, (req, res) => {
  const { avatar } = req.body || {};
  db.prepare("UPDATE users SET avatar_json = ? WHERE id = ?").run(JSON.stringify(avatar || {}), req.user.id);
  res.json({ success: true, avatar });
});

// ─── Progress sync ───
router.get("/progress/courses", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT path_id, progress_json FROM course_progress WHERE user_id = ?").all(req.user.id);
  res.json({ success: true, courses: rows.map((r) => ({ pathId: r.path_id, ...parseJson(r.progress_json) })) });
});

router.put("/progress/courses/:pathId", requireAuth, (req, res) => {
  db.prepare(`
    INSERT INTO course_progress (user_id, path_id, progress_json, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, path_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = excluded.updated_at
  `).run(req.user.id, req.params.pathId, JSON.stringify(req.body || {}), Date.now());
  res.json({ success: true });
});

router.get("/progress/projects", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT project_slug, progress, data_json FROM project_progress WHERE user_id = ?").all(req.user.id);
  res.json({
    success: true,
    projects: rows.map((r) => ({ slug: r.project_slug, progress: r.progress, ...parseJson(r.data_json) }))
  });
});

router.put("/progress/projects/:slug", requireAuth, (req, res) => {
  const { progress = 0, ...data } = req.body || {};
  db.prepare(`
    INSERT INTO project_progress (user_id, project_slug, progress, data_json, updated_at) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, project_slug) DO UPDATE SET progress = excluded.progress, data_json = excluded.data_json, updated_at = excluded.updated_at
  `).run(req.user.id, req.params.slug, progress, JSON.stringify(data), Date.now());
  res.json({ success: true });
});

router.get("/progress/interview", requireAuth, (req, res) => {
  res.json({ success: true, state: loadAppState(req.user.id, "interview", {}) });
});

router.put("/progress/interview", requireAuth, (req, res) => {
  saveAppState(req.user.id, "interview", req.body || {});
  const { sectionId, entry } = req.body || {};
  if (sectionId && entry) {
    db.prepare("INSERT INTO interview_history (id, user_id, section_id, data_json, created_at) VALUES (?, ?, ?, ?, ?)").run(
      uuidv4(),
      req.user.id,
      sectionId,
      JSON.stringify(entry),
      Date.now()
    );
  }
  res.json({ success: true });
});

router.get("/progress/state/:key", requireAuth, (req, res) => {
  res.json({ success: true, data: loadAppState(req.user.id, req.params.key, null) });
});

router.put("/progress/state/:key", requireAuth, (req, res) => {
  saveAppState(req.user.id, req.params.key, req.body);
  res.json({ success: true });
});

// ─── Notifications ───
router.get("/notifications", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM notifications WHERE user_id = ? AND deleted = 0 ORDER BY created_at DESC LIMIT 50")
    .all(req.user.id);
  res.json({
    success: true,
    notifications: rows.map((n) => ({
      id: n.id,
      title: n.title,
      type: n.type,
      read: !!n.read,
      archived: !!n.archived,
      time: new Date(n.created_at).toLocaleString()
    }))
  });
});

router.post("/notifications", requireAuth, (req, res) => {
  const { title, type = "info" } = req.body || {};
  if (!title) return res.status(400).json({ success: false, message: "Title required" });
  const id = uuidv4();
  db.prepare(
    "INSERT INTO notifications (id, user_id, title, type, read, archived, deleted, created_at) VALUES (?, ?, ?, ?, 0, 0, 0, ?)"
  ).run(id, req.user.id, title, type, Date.now());
  res.status(201).json({ success: true, id });
});

router.patch("/notifications/:id/read", requireAuth, (req, res) => {
  db.prepare("UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

router.patch("/notifications/read-all", requireAuth, (req, res) => {
  db.prepare("UPDATE notifications SET read = 1 WHERE user_id = ?").run(req.user.id);
  res.json({ success: true });
});

router.patch("/notifications/:id/archive", requireAuth, (req, res) => {
  db.prepare("UPDATE notifications SET archived = 1 WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

router.delete("/notifications/:id", requireAuth, (req, res) => {
  db.prepare("UPDATE notifications SET deleted = 1 WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

// ─── Achievements ───
router.get("/achievements", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT type, value, data_json FROM achievements WHERE user_id = ?").all(req.user.id);
  const counts = {
    courses: loadAppState(req.user.id, "achievements_courses", 0),
    projects: loadAppState(req.user.id, "achievements_projects", 0),
    interviews: db.prepare("SELECT COUNT(*) as c FROM interview_history WHERE user_id = ?").get(req.user.id).c,
    github: db.prepare("SELECT repos_json FROM github_connections WHERE user_id = ?").get(req.user.id),
    certs: loadAppState(req.user.id, "achievements_certs", 0)
  };
  const githubRepos = parseJson(counts.github?.repos_json, []);
  res.json({
    success: true,
    achievements: rows,
    summary: {
      courses: counts.courses,
      projects: counts.projects,
      interviews: counts.interviews,
      github: githubRepos.length,
      certs: counts.certs
    }
  });
});

router.put("/achievements", requireAuth, (req, res) => {
  saveAppState(req.user.id, "achievements_summary", req.body || {});
  res.json({ success: true });
});

// ─── AI / Virtual Recruiter ───
router.post("/ai/chat", requireAuth, async (req, res) => {
  const { message, mode, context } = req.body || {};
  const result = await generateAiReply(message, mode || "general-assistant", context || {});
  if (!result.success) return res.status(400).json(result);

  db.prepare("INSERT INTO vr_messages (id, user_id, role, text, mode, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
    uuidv4(),
    req.user.id,
    "user",
    message,
    mode || "general-assistant",
    Date.now()
  );
  db.prepare("INSERT INTO vr_messages (id, user_id, role, text, mode, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
    uuidv4(),
    req.user.id,
    "assistant",
    result.reply,
    mode || "general-assistant",
    Date.now()
  );

  res.json(result);
});

router.get("/ai/history", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT role, text, mode, created_at FROM vr_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50")
    .all(req.user.id);
  res.json({ success: true, history: rows.reverse() });
});

// ─── Resume ───
router.post("/resume/analyze", requireAuth, (req, res) => {
  const { text } = req.body || {};
  const result = analyzeResume(text);
  if (!result.success) return res.status(400).json(result);

  db.prepare(
    "INSERT INTO resume_history (id, user_id, type, content, score, analysis_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(uuidv4(), req.user.id, "analyze", text?.slice(0, 50000), result.atsScore, JSON.stringify(result), Date.now());

  res.json(result);
});

router.post("/resume/tailor", requireAuth, (req, res) => {
  const { resume, jobDescription } = req.body || {};
  const result = tailorResume(resume, jobDescription);
  if (!result.success) return res.status(400).json(result);

  db.prepare(
    "INSERT INTO resume_history (id, user_id, type, content, score, analysis_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    uuidv4(),
    req.user.id,
    "tailor",
    resume?.slice(0, 50000),
    result.matchingScore,
    JSON.stringify({ jobDescription: jobDescription?.slice(0, 10000), ...result }),
    Date.now()
  );

  res.json(result);
});

router.get("/resume/history", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT id, type, score, created_at FROM resume_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20")
    .all(req.user.id);
  res.json({ success: true, history: rows });
});

// ─── GitHub ───
router.post("/github/connect", requireAuth, async (req, res) => {
  const { username, token } = req.body || {};
  if (!username) return res.status(400).json({ success: false, message: "Username required" });

  try {
    const verified = token ? await verifyConnection(username, token) : { login: username };
    db.prepare(`
      INSERT INTO github_connections (user_id, username, token, repos_json, updated_at) VALUES (?, ?, ?, '[]', ?)
      ON CONFLICT(user_id) DO UPDATE SET username = excluded.username, token = excluded.token, updated_at = excluded.updated_at
    `).run(req.user.id, verified.login, token || null, Date.now());
    res.json({ success: true, username: verified.login });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.delete("/github/connect", requireAuth, (req, res) => {
  db.prepare("DELETE FROM github_connections WHERE user_id = ?").run(req.user.id);
  res.json({ success: true });
});

router.get("/github/repos", requireAuth, async (req, res) => {
  const conn = db.prepare("SELECT * FROM github_connections WHERE user_id = ?").get(req.user.id);
  if (!conn?.token) return res.json({ success: true, repos: parseJson(conn?.repos_json, []) });

  try {
    const repos = await listRepositories(conn.token);
    db.prepare("UPDATE github_connections SET repos_json = ?, updated_at = ? WHERE user_id = ?").run(
      JSON.stringify(repos.map((r) => ({ name: r.name, url: r.html_url, private: r.private }))),
      Date.now(),
      req.user.id
    );
    res.json({ success: true, repos });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.post("/github/repos", requireAuth, async (req, res) => {
  const { name, description, isPrivate } = req.body || {};
  const conn = db.prepare("SELECT * FROM github_connections WHERE user_id = ?").get(req.user.id);
  if (!conn?.token) return res.status(400).json({ success: false, message: "Connect GitHub with a personal access token first" });

  try {
    const repo = await createRepository(conn.token, name, description, !!isPrivate);
    res.json({ success: true, repo: { name: repo.name, url: repo.html_url } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.get("/github/commits", requireAuth, async (req, res) => {
  const { url } = req.query;
  const conn = db.prepare("SELECT * FROM github_connections WHERE user_id = ?").get(req.user.id);
  if (!conn?.token) return res.status(400).json({ success: false, message: "GitHub not connected" });

  const parsed = parseRepoUrl(url);
  if (!parsed) return res.status(400).json({ success: false, message: "Invalid repository URL" });

  try {
    const commits = await listCommits(conn.token, parsed.owner, parsed.repo);
    res.json({
      success: true,
      commits: commits.map((c) => ({
        sha: c.sha?.slice(0, 7),
        message: c.commit?.message,
        date: c.commit?.author?.date,
        url: c.html_url
      }))
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

router.post("/github/push", requireAuth, async (req, res) => {
  const { url, projectName, progress, message } = req.body || {};
  const conn = db.prepare("SELECT * FROM github_connections WHERE user_id = ?").get(req.user.id);
  if (!conn?.token) return res.status(400).json({ success: false, message: "GitHub not connected with token" });

  const parsed = parseRepoUrl(url);
  if (!parsed) return res.status(400).json({ success: false, message: "Invalid repository URL" });

  const content = `# NexusAI Progress\n\nProject: ${projectName}\nProgress: ${progress}%\nUpdated: ${new Date().toISOString()}\n`;
  try {
    await pushProgressCommit(conn.token, parsed.owner, parsed.repo, message || `NexusAI: ${projectName} ${progress}%`, content);
    res.json({ success: true, message: `Pushed progress to ${parsed.owner}/${parsed.repo}` });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
});

// ─── Speech ───
router.post("/speech/transcribe", requireAuth, (req, res) => {
  const { transcript } = req.body || {};
  res.json({ success: true, transcript: transcript || "", engine: "client-speech-api" });
});

router.post("/speech/evaluate", requireAuth, (req, res) => {
  const { transcript, questionContext } = req.body || {};
  const result = analyzeSpeechTranscript(transcript, questionContext);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

router.post("/speech/synthesize", requireAuth, (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ success: false, message: "Text required" });
  res.json(synthesizeSpeechPayload(text));
});

// ─── Uploads ───
router.post("/uploads/:type", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const id = uuidv4();
  db.prepare(
    "INSERT INTO uploads (id, user_id, type, filename, filepath, mime_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, req.user.id, req.params.type, req.file.originalname, req.file.path, req.file.mimetype, Date.now());

  if (req.params.type === "resume" && req.file.mimetype?.includes("text")) {
    try {
      const text = fs.readFileSync(req.file.path, "utf8");
      saveAppState(req.user.id, "last_resume_upload", { text: text.slice(0, 50000), filename: req.file.originalname });
    } catch {
      /* binary resume formats */
    }
  }

  res.status(201).json({
    success: true,
    id,
    filename: req.file.originalname,
    url: `/api/uploads/${id}`,
    type: req.params.type
  });
});

router.get("/uploads/:id", requireAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM uploads WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ success: false, message: "Not found" });
  res.sendFile(path.resolve(row.filepath));
});

// Legacy compat
router.post("/ask", requireAuth, async (req, res) => {
  const result = await generateAiReply(req.body?.message, "general-assistant");
  res.json({ reply: result.reply });
});

router.get("/courses", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT path_id, progress_json FROM course_progress WHERE user_id = ?").all(req.user.id);
  res.json(rows.map((r) => ({ pathId: r.path_id, ...parseJson(r.progress_json) })));
});

export default router;
