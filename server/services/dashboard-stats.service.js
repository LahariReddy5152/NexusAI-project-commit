import { db, parseJson } from "../db.js";

export const DEFAULT_STATS = {
  overall_progress: 0,
  day_streak: 0,
  hours_learned: 0,
  total_xp: 0,
  current_path_id: "python-fundamentals",
  current_path_progress: 0,
  last_activity_date: null,
  project_minutes: 0
};

const MINUTES_PER_LESSON = 18;
const XP_PER_LESSON = 50;

function clampInt(value, min = 0, max = 100) {
  const n = Math.round(Number(value) || 0);
  return Math.min(max, Math.max(min, n));
}

function clampFloat(value, min = 0, max = 99999) {
  const n = Number(value) || 0;
  return Math.min(max, Math.max(min, n));
}

function activityDateString(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}

function sanitizeCompletedLessons(list) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.filter((i) => Number.isInteger(i) && i >= 0))].sort((a, b) => a - b);
}

function computeStreak(lastDate, currentDate, currentStreak) {
  if (!currentDate) return Math.max(0, currentStreak || 0);
  if (!lastDate) return 1;
  if (lastDate === currentDate) return Math.max(1, currentStreak || 1);

  const last = Date.parse(`${lastDate}T00:00:00Z`);
  const curr = Date.parse(`${currentDate}T00:00:00Z`);
  if (Number.isNaN(last) || Number.isNaN(curr)) return 1;

  const diffDays = Math.round((curr - last) / 86400000);
  if (diffDays === 1) return Math.max(1, (currentStreak || 0) + 1);
  if (diffDays === 0) return Math.max(1, currentStreak || 1);
  return 1;
}

function rowToStats(row) {
  if (!row) return { ...DEFAULT_STATS };
  return {
    overall_progress: clampInt(row.overall_progress),
    day_streak: clampInt(row.day_streak, 0, 10000),
    hours_learned: clampFloat(row.hours_learned),
    total_xp: clampInt(row.total_xp, 0, 10000000),
    current_path_id: row.current_path_id || DEFAULT_STATS.current_path_id,
    current_path_progress: clampInt(row.current_path_progress),
    last_activity_date: row.last_activity_date || null,
    project_minutes: clampInt(row.project_minutes, 0, 1000000)
  };
}

function publicStats(stats) {
  return {
    overallProgress: stats.overall_progress,
    dayStreak: stats.day_streak,
    hoursLearned: Math.round(stats.hours_learned * 10) / 10,
    totalXp: stats.total_xp,
    currentPathId: stats.current_path_id,
    currentPathProgress: stats.current_path_progress,
    lastActivityDate: stats.last_activity_date
  };
}

export function recomputeProgressFromCourses(userId) {
  const rows = db
    .prepare("SELECT path_id, progress_json, updated_at FROM course_progress WHERE user_id = ?")
    .all(userId);

  let totalLessons = 0;
  let completedCount = 0;
  let lessonMinutes = 0;
  let currentPathId = DEFAULT_STATS.current_path_id;
  let currentPathProgress = 0;
  let latestUpdate = 0;

  for (const row of rows) {
    const data = parseJson(row.progress_json, {});
    const completed = sanitizeCompletedLessons(data.completedLessons);
    const total = clampInt(data.totalLessons, 0, 10000);
    const perLesson = clampInt(data.minutesPerLesson || MINUTES_PER_LESSON, 1, 240);

    totalLessons += total;
    completedCount += completed.length;
    lessonMinutes += completed.length * perLesson;

    const updatedAt = Number(data.updatedAt || row.updated_at || 0);
    if (updatedAt >= latestUpdate) {
      latestUpdate = updatedAt;
      currentPathId = row.path_id;
      currentPathProgress = total ? clampInt((completed.length / total) * 100) : 0;
    }
  }

  const overall = totalLessons ? clampInt((completedCount / totalLessons) * 100) : 0;
  const hours = clampFloat((lessonMinutes + 0) / 60);

  return { overall, hours, currentPathId, currentPathProgress, lessonMinutes };
}

function persistStats(userId, stats) {
  const normalized = rowToStats(stats);
  db.prepare(`
    INSERT INTO user_stats (
      user_id, overall_progress, day_streak, hours_learned, total_xp,
      current_path_id, current_path_progress, last_activity_date, project_minutes, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      overall_progress = excluded.overall_progress,
      day_streak = excluded.day_streak,
      hours_learned = excluded.hours_learned,
      total_xp = excluded.total_xp,
      current_path_id = excluded.current_path_id,
      current_path_progress = excluded.current_path_progress,
      last_activity_date = excluded.last_activity_date,
      project_minutes = excluded.project_minutes,
      updated_at = excluded.updated_at
  `).run(
    userId,
    normalized.overall_progress,
    normalized.day_streak,
    normalized.hours_learned,
    normalized.total_xp,
    normalized.current_path_id,
    normalized.current_path_progress,
    normalized.last_activity_date,
    normalized.project_minutes,
    Date.now()
  );
  return normalized;
}

export function ensureUserStats(userId) {
  const existing = db.prepare("SELECT * FROM user_stats WHERE user_id = ?").get(userId);
  if (existing) return rowToStats(existing);

  const profile = db.prepare("SELECT data_json FROM profiles WHERE user_id = ?").get(userId);
  const profileData = parseJson(profile?.data_json, {});
  const progress = profileData.progress || {};

  const stats = {
    ...DEFAULT_STATS,
    total_xp: clampInt(progress.points, 0, 10000000),
    day_streak: clampInt(progress.streak, 0, 10000),
    hours_learned: clampFloat(progress.hours)
  };

  const recomputed = recomputeProgressFromCourses(userId);
  stats.overall_progress = recomputed.overall;
  stats.hours_learned = clampFloat(recomputed.hours + stats.project_minutes / 60);
  stats.current_path_id = recomputed.currentPathId;
  stats.current_path_progress = recomputed.currentPathProgress;

  return persistStats(userId, stats);
}

function pathProgressForUser(userId, pathId) {
  const row = db.prepare("SELECT progress_json FROM course_progress WHERE user_id = ? AND path_id = ?").get(userId, pathId);
  if (!row) return 0;
  const data = parseJson(row.progress_json, {});
  const total = clampInt(data.totalLessons, 0, 10000);
  const completed = sanitizeCompletedLessons(data.completedLessons);
  return total ? clampInt((completed.length / total) * 100) : 0;
}

export function getDashboardStats(userId) {
  const stats = ensureUserStats(userId);
  const recomputed = recomputeProgressFromCourses(userId);
  const activePathId = stats.current_path_id || recomputed.currentPathId;
  const merged = {
    ...stats,
    overall_progress: recomputed.overall,
    current_path_id: activePathId,
    current_path_progress: pathProgressForUser(userId, activePathId)
  };

  merged.hours_learned = clampFloat(recomputed.hours + merged.project_minutes / 60);
  return publicStats(persistStats(userId, merged));
}

export function syncCourseProgressStats(userId, pathId, progressBody = {}) {
  ensureUserStats(userId);

  const sanitized = {
    ...progressBody,
    completedLessons: sanitizeCompletedLessons(progressBody.completedLessons),
    totalLessons: clampInt(progressBody.totalLessons, 0, 10000),
    minutesPerLesson: clampInt(progressBody.minutesPerLesson || MINUTES_PER_LESSON, 1, 240),
    updatedAt: Date.now()
  };

  if (pathId) {
    sanitized.currentPathId = pathId;
  }

  db.prepare(`
    INSERT INTO course_progress (user_id, path_id, progress_json, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, path_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = excluded.updated_at
  `).run(userId, pathId, JSON.stringify(sanitized), Date.now());

  const stats = ensureUserStats(userId);
  const recomputed = recomputeProgressFromCourses(userId);
  const next = {
    ...stats,
    overall_progress: recomputed.overall,
    hours_learned: clampFloat(recomputed.hours + stats.project_minutes / 60),
    current_path_id: pathId || recomputed.currentPathId,
    current_path_progress: sanitized.totalLessons
      ? clampInt((sanitized.completedLessons.length / sanitized.totalLessons) * 100)
      : recomputed.currentPathProgress
  };

  return publicStats(persistStats(userId, next));
}

export function recordDashboardActivity(userId, payload = {}) {
  const stats = ensureUserStats(userId);
  const today = activityDateString();
  const xpGain = clampInt(payload.xp, 0, 10000);
  const minutesGain = clampInt(payload.minutes, 0, 480);
  const pathId = payload.pathId || payload.currentPathId || stats.current_path_id;

  let next = { ...stats };

  if (payload.type === "lesson_complete" || payload.lessonComplete) {
    next.day_streak = computeStreak(stats.last_activity_date, today, stats.day_streak);
    next.last_activity_date = today;
    next.total_xp = clampInt(stats.total_xp + (xpGain || XP_PER_LESSON), 0, 10000000);
    next.current_path_id = pathId || stats.current_path_id;

    if (Array.isArray(payload.completedLessons)) {
      return syncAfterLesson(userId, pathId, payload, next);
    }
  } else if (xpGain > 0) {
    next.total_xp = clampInt(stats.total_xp + xpGain, 0, 10000000);
  }

  if (minutesGain > 0) {
    next.project_minutes = clampInt(stats.project_minutes + minutesGain, 0, 1000000);
  }

  const recomputed = recomputeProgressFromCourses(userId);
  next.overall_progress = recomputed.overall;
  next.hours_learned = clampFloat(recomputed.hours + next.project_minutes / 60);
  if (pathId) {
    next.current_path_id = pathId;
    const row = db.prepare("SELECT progress_json FROM course_progress WHERE user_id = ? AND path_id = ?").get(userId, pathId);
    if (row) {
      const data = parseJson(row.progress_json, {});
      const total = clampInt(data.totalLessons, 0, 10000);
      const completed = sanitizeCompletedLessons(data.completedLessons);
      next.current_path_progress = total ? clampInt((completed.length / total) * 100) : 0;
    }
  }

  return publicStats(persistStats(userId, next));
}

function syncAfterLesson(userId, pathId, payload, partialStats) {
  syncCourseProgressStats(userId, pathId, {
    completedLessons: payload.completedLessons,
    totalLessons: payload.totalLessons,
    minutesPerLesson: payload.minutesPerLesson || MINUTES_PER_LESSON
  });

  const stats = ensureUserStats(userId);
  const next = {
    ...stats,
    day_streak: partialStats.day_streak,
    last_activity_date: partialStats.last_activity_date,
    total_xp: partialStats.total_xp,
    current_path_id: pathId || stats.current_path_id
  };

  const recomputed = recomputeProgressFromCourses(userId);
  next.overall_progress = recomputed.overall;
  next.hours_learned = clampFloat(recomputed.hours + next.project_minutes / 60);
  next.current_path_progress =
    payload.totalLessons && Array.isArray(payload.completedLessons)
      ? clampInt((sanitizeCompletedLessons(payload.completedLessons).length / clampInt(payload.totalLessons, 1, 10000)) * 100)
      : recomputed.currentPathProgress;

  return publicStats(persistStats(userId, next));
}
