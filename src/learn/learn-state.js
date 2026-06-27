/** @module learn/learn-state — mutable learning portal state */
export let currentPathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
export let currentLessonIndex = null;
export let completedLessons = [];
export let activePathCategory = "all";
export let activePathDifficulty = "all";

export function setCurrentPathId(id) {
  currentPathId = id;
  localStorage.setItem("nexusCurrentPath", id);
}

export function setCurrentLessonIndex(index) {
  currentLessonIndex = index;
}

export function setCompletedLessons(list) {
  completedLessons = list;
}

export function setActivePathCategory(category) {
  activePathCategory = category;
}

export function setActivePathDifficulty(difficulty) {
  activePathDifficulty = difficulty;
}
