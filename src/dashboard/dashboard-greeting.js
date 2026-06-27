import { updateEl, getTimeGreeting } from "../shared/helpers.js";
import { getNextLessonInfo } from "./dashboard-sync.js";

let greetingClockTimer = null;

export function renderDashboardGreeting() {
    const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
    const name = user.name || "Lahari";
    const now = new Date();

    updateEl("greetingPeriod", getTimeGreeting());
    updateEl("greetingName", name);
    updateEl("greetingDate", now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));
    updateEl("greetingClock", now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));

    const welcome = document.getElementById("welcomeText");
    if (welcome) welcome.textContent = `${getTimeGreeting()}, ${name.split(" ")[0]}`;
}

export function startGreetingClock() {
    renderDashboardGreeting();
    if (greetingClockTimer) clearInterval(greetingClockTimer);
    greetingClockTimer = setInterval(renderDashboardGreeting, 1000);
}

export function getMotivationalMessage() {
    const msgs = [
        "Every lesson brings you closer to your AI engineering career.",
        "Consistency beats intensity — keep your streak alive!",
        "Today's effort is tomorrow's interview confidence.",
        "Build skills daily and your portfolio will speak for itself."
    ];
    return msgs[new Date().getDate() % msgs.length];
}

export function getTodaysPlan() {
    const next = getNextLessonInfo();
    return `Continue ${next.title} on your current path.`;
}
