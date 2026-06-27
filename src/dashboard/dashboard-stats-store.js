/** SQLite-backed dashboard statistics sync */
import { api, getToken } from "../shared/api-client.js";
import { LEARNING_PATHS, getCurriculumForPath } from "../learn/learn-data.js";

const CACHE_KEY = "nexusDashboardStats";
const MINUTES_PER_LESSON = 18;
const XP_PER_LESSON = 50;

export function getCachedStats() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  } catch {
    return null;
  }
}

export function applyStatsToLocal(stats) {
  if (!stats) return;

  const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
  user.progress = {
    points: Math.max(0, stats.totalXp || 0),
    streak: Math.max(0, stats.dayStreak || 0),
    hours: Math.max(0, stats.hoursLearned || 0)
  };
  localStorage.setItem("nexusUser", JSON.stringify(user));

  if (stats.currentPathId) {
    localStorage.setItem("nexusCurrentPath", stats.currentPathId);
  }

  localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
  window.dispatchEvent(new CustomEvent("nexusDashboardUpdate", { detail: stats }));
}

export function applyCourseProgressToLocal(courses = []) {
  courses.forEach((course) => {
    const pathId = course.pathId || course.path_id;
    const completed = course.completedLessons;
    if (pathId && Array.isArray(completed)) {
      localStorage.setItem(`nexusCompleted_${pathId}`, JSON.stringify(completed));
    }
  });
}

export async function fetchDashboardStats() {
  if (!getToken()) return getCachedStats();

  const { ok, data } = await api("/dashboard/stats");
  if (ok && data.stats) {
    applyStatsToLocal(data.stats);
    return data.stats;
  }
  return getCachedStats();
}

function mergeLessonIndices(local, server) {
  const a = Array.isArray(local) ? local : [];
  const b = Array.isArray(server) ? server : [];
  return [...new Set([...a, ...b])].filter((i) => Number.isInteger(i) && i >= 0).sort((x, y) => x - y);
}

export async function syncCourseProgressFromServer() {
  if (!getToken()) return [];

  const { ok, data } = await api("/progress/courses");
  if (ok && Array.isArray(data.courses)) {
    applyCourseProgressToLocal(data.courses);
    return data.courses;
  }
  return [];
}

export async function syncCourseProgressBidirectional() {
  if (!getToken()) return;

  const { ok, data } = await api("/progress/courses");
  const serverCourses = ok && Array.isArray(data.courses) ? data.courses : [];
  const serverMap = new Map(
    serverCourses.map((c) => [c.pathId, Array.isArray(c.completedLessons) ? c.completedLessons : []])
  );

  for (const path of LEARNING_PATHS) {
    let local = [];
    try {
      local = JSON.parse(localStorage.getItem(`nexusCompleted_${path.id}`) || "[]");
    } catch {
      local = [];
    }

    const server = serverMap.get(path.id) || [];
    const merged = mergeLessonIndices(local, server);
    localStorage.setItem(`nexusCompleted_${path.id}`, JSON.stringify(merged));

    if (merged.length > server.length) {
      const totalLessons = getCurriculumForPath(path.id)?.length || 0;
      await pushCourseProgress(path.id, merged, totalLessons);
    }
  }
}

async function migrateLocalXpIfNeeded() {
  const cached = getCachedStats();
  const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
  const localXp = Math.max(0, user.progress?.points || 0);
  const serverXp = Math.max(0, cached?.totalXp || 0);
  if (localXp > serverXp) {
    await awardPointsOnServer(localXp - serverXp);
  }
}

export async function pullDashboardStats() {
  if (!getToken()) return getCachedStats();

  await syncCourseProgressBidirectional();
  await migrateLocalXpIfNeeded();
  return fetchDashboardStats();
}

export async function pushCourseProgress(pathId, completedLessons, totalLessons) {
  if (!getToken() || !pathId) return null;

  const body = {
    completedLessons,
    totalLessons: Math.max(0, totalLessons || 0),
    minutesPerLesson: MINUTES_PER_LESSON,
    updatedAt: Date.now()
  };

  const { ok, data } = await api(`/progress/courses/${encodeURIComponent(pathId)}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

  if (ok && data.stats) applyStatsToLocal(data.stats);
  return ok ? data.stats : null;
}

export async function recordLessonCompleteOnServer(pathId, completedLessons, totalLessons, xp = XP_PER_LESSON) {
  if (!getToken() || !pathId) return null;

  const { ok, data } = await api("/dashboard/activity", {
    method: "POST",
    body: JSON.stringify({
      type: "lesson_complete",
      lessonComplete: true,
      pathId,
      completedLessons,
      totalLessons: Math.max(0, totalLessons || 0),
      minutesPerLesson: MINUTES_PER_LESSON,
      xp: Math.max(0, xp),
      minutes: MINUTES_PER_LESSON
    })
  });

  if (ok && data.stats) applyStatsToLocal(data.stats);
  return ok ? data.stats : null;
}

export async function awardPointsOnServer(points) {
  const amount = Math.max(0, Number(points) || 0);
  if (!amount || !getToken()) return null;

  const { ok, data } = await api("/dashboard/activity", {
    method: "POST",
    body: JSON.stringify({ xp: amount })
  });

  if (ok && data.stats) applyStatsToLocal(data.stats);
  return ok ? data.stats : null;
}
