import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.NEXUSAI_DATA_DIR || path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "nexusai.db");
export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    avatar_json TEXT DEFAULT '{}',
    reset_token TEXT,
    reset_expires INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    remember_me INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    data_json TEXT DEFAULT '{}',
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS course_progress (
    user_id TEXT NOT NULL,
    path_id TEXT NOT NULL,
    progress_json TEXT NOT NULL,
    updated_at INTEGER,
    PRIMARY KEY (user_id, path_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS interview_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    section_id TEXT NOT NULL,
    data_json TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS project_progress (
    user_id TEXT NOT NULL,
    project_slug TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    data_json TEXT DEFAULT '{}',
    updated_at INTEGER,
    PRIMARY KEY (user_id, project_slug),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read INTEGER DEFAULT 0,
    archived INTEGER DEFAULT 0,
    deleted INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    value TEXT,
    data_json TEXT DEFAULT '{}',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS resume_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    score REAL,
    analysis_json TEXT DEFAULT '{}',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS github_connections (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    token TEXT,
    repos_json TEXT DEFAULT '[]',
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS uploads (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    mime_type TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS vr_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    mode TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS app_state (
    user_id TEXT NOT NULL,
    state_key TEXT NOT NULL,
    state_json TEXT NOT NULL,
    updated_at INTEGER,
    PRIMARY KEY (user_id, state_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export function parseJson(val, fallback = {}) {
  try {
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
}

export function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function getSessionByToken(token) {
  return db.prepare("SELECT * FROM sessions WHERE token = ? AND expires_at > ?").get(token, Date.now());
}

export function saveAppState(userId, key, data) {
  db.prepare(`
    INSERT INTO app_state (user_id, state_key, state_json, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, state_key) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at
  `).run(userId, key, JSON.stringify(data), Date.now());
}

export function loadAppState(userId, key, fallback = null) {
  const row = db.prepare("SELECT state_json FROM app_state WHERE user_id = ? AND state_key = ?").get(userId, key);
  return row ? parseJson(row.state_json, fallback) : fallback;
}
