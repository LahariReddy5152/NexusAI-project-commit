/** Settings — theme and profile updates */
export function setTheme(mode) {
  if (mode === "light") {
    document.body.classList.add("light-mode");
    localStorage.setItem("nexusTheme", "light");
  } else {
    document.body.classList.remove("light-mode");
    localStorage.setItem("nexusTheme", "dark");
  }
}

export function initTheme() {
  if (localStorage.getItem("nexusTheme") === "light") document.body.classList.add("light-mode");
}

export function toggleDarkMode() {
  setTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
}
