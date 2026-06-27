// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function renderCodeBlock(code, lang) {
    if (!code) return "";
    const lines = String(code).split("\n");
    const numbered = lines.map((line, i) =>
        `<tr><td class="code-ln">${i + 1}</td><td class="code-line">${escapeHtml(line)}</td></tr>`
    ).join("");
    const blockId = "code-" + Math.random().toString(36).slice(2, 9);
    return `
<div class="code-block-wrapper" data-lang="${lang || "python"}">
  <div class="code-block-header">
    <span class="code-lang-badge">${(lang || "code").toUpperCase()}</span>
    <button type="button" class="copy-code-btn" onclick="copyCodeBlock('${blockId}')">Copy Code</button>
  </div>
  <div class="code-block-body">
    <table class="code-table" id="${blockId}"><tbody>${numbered}</tbody></table>
  </div>
</div>`;
}

function copyCodeBlock(blockId) {
    const table = document.getElementById(blockId);
    if (!table) return;
    const code = [...table.querySelectorAll(".code-line")].map((td) => td.textContent).join("\n");
    navigator.clipboard.writeText(code).then(() => {
        const btn = table.closest(".code-block-wrapper")?.querySelector(".copy-code-btn");
        if (btn) { const orig = btn.textContent; btn.textContent = "Copied!"; setTimeout(() => { btn.textContent = orig; }, 1500); }
    }).catch(() => alert("Copy failed — select code manually."));
}

function loadCompletedLessons() {
    try {
        completedLessons = JSON.parse(localStorage.getItem(`nexusCompleted_${currentPathId}`) || "[]");
    } catch { completedLessons = []; }
}

function saveCompletedLessons() {
    localStorage.setItem(`nexusCompleted_${currentPathId}`, JSON.stringify(completedLessons));
}

function getActiveCurriculum() {
    return getCurriculumForPath(currentPathId) || [];
}

function renderLearningPathTabs() {
    const container = document.getElementById("learningPathTabs");
    if (!container) return;
    container.innerHTML = LEARNING_PATHS.filter((p) => activePathCategory === "all" || p.category === activePathCategory).map((path) => {
        const unlocked = isPathUnlocked(path);
        const progress = getPathProgressPercent(path.id);
        const active = path.id === currentPathId ? " active" : "";
        const locked = unlocked ? "" : " locked";
        return `<button class="path-tab${active}${locked}" onclick="selectLearningPath('${path.id}')" title="${unlocked ? path.subtitle : "Requires " + path.unlockPercent + "% on prerequisite"}">
            ${unlocked ? "" : '<span class="lock-icon">🔒</span>'}
            <span class="path-tab-title">${path.title}</span>
            <span class="path-tab-progress">${progress}%</span>
        </button>`;
    }).join("");
}

function filterPathCategory(category, event) {
    activePathCategory = category;
    document.querySelectorAll(".category-tab").forEach((t) => t.classList.remove("active"));
    if (event?.target) event.target.classList.add("active");
    renderLearningPathTabs();
}

function selectLearningPath(pathId) {
    const path = LEARNING_PATHS.find((p) => p.id === pathId);
    if (!path) return;
    if (!isPathUnlocked(path)) {
        alert(`🔒 ${path.title} is locked.\n\nComplete ${path.unlockPercent}% of the prerequisite path to unlock.`);
        return;
    }
    currentPathId = pathId;
    localStorage.setItem("nexusCurrentPath", pathId);
    currentLessonIndex = null;
    loadCompletedLessons();
    const titleEl = document.getElementById("activePathTitle");
    const subEl = document.getElementById("activePathSubtitle");
    if (titleEl) titleEl.textContent = path.title;
    if (subEl) subEl.textContent = path.subtitle;
    renderLearningPathTabs();
    renderModulesGrid();
    updateLearningPathProgress();
    renderDailyChallenge();
    document.getElementById("lessonView")?.classList.add("hidden");
    document.getElementById("learningPathView")?.classList.remove("hidden");
}

function initializeLearningPortal() {
    const legacy = localStorage.getItem("pythonCompletedLessons");
    if (legacy && !localStorage.getItem("nexusCompleted_python-fundamentals")) {
        localStorage.setItem("nexusCompleted_python-fundamentals", legacy);
    }
    loadCompletedLessons();
    renderLearningPathTabs();
    renderModulesGrid();
    updateLearningPathProgress();
}

function renderModulesGrid() {
    const grid = document.getElementById("pathModulesGrid");
    if (!grid) return;
    const curriculum = getActiveCurriculum();
    if (!curriculum.length) {
        grid.innerHTML = "<p class='muted-text'>Curriculum coming soon for this path.</p>";
        return;
    }
    grid.innerHTML = curriculum.map((module, index) => {
        const isCompleted = completedLessons.includes(index);
        return `<div class="module-card-learning ${isCompleted ? "completed" : ""}" onclick="openLesson(${index})">
            <h3>${module.title}</h3>
            <p class="module-description">${module.description}</p>
            <div class="module-meta">
                <span class="module-badge">${module.difficulty}</span>
                <span class="module-duration">${module.duration}</span>
            </div>
        </div>`;
    }).join("");
}

function updateLearningPathProgress() {
    const curriculum = getActiveCurriculum();
    const completed = completedLessons.length;
    const total = curriculum.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const estMins = total * 18;
    const estHours = Math.floor(estMins / 60);
    const estRemain = estMins - completed * 18;

    updateEl("pathModulesCompleted", completed);
    updateEl("pathTotalModules", total);
    updateEl("pathProgressPercent", `${percent}%`);
    const bar = document.getElementById("pathProgressBar");
    if (bar) bar.style.width = `${percent}%`;
    const estEl = document.getElementById("pathEstimatedTime");
    if (estEl) estEl.textContent = estRemain > 60 ? `~${Math.ceil(estRemain / 60)}h left` : `~${estRemain}m left`;
}

function updateEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function openLesson(index) {
    const curriculum = getActiveCurriculum();
    const module = curriculum[index];
    if (!module) return;
    currentLessonIndex = index;
    localStorage.setItem("nexusLastLesson", JSON.stringify({ pathId: currentPathId, index }));

    document.getElementById("lessonTitle").textContent = module.title;
    document.getElementById("lessonSubtitle").textContent = module.description;
    document.getElementById("lessonDifficulty").textContent = module.difficulty;
    document.getElementById("lessonDuration").textContent = module.duration;
    const xpEl = document.getElementById("lessonXp");
    if (xpEl) xpEl.textContent = "+50 XP";

    const tocItems = ["Explanation", "Real-World Example", "Syntax", "Code Example", "Best Practices", "Common Mistakes", "Quiz", "Practice Exercise"];
    document.getElementById("lessonTableOfContents").innerHTML = tocItems.map((item, i) =>
        `<li onclick="scrollToSection(${i})">${item}</li>`
    ).join("");

    renderLessonContent(module);
    updateMarkCompleteButton();
    document.getElementById("learningPathView").classList.add("hidden");
    document.getElementById("lessonView").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    logActivity(`Started lesson: ${module.title}`);
}

function renderLessonContent(module) {
    const lang = module.codeLang || "python";
    const quizHTML = module.quizQuestions.map((q, i) => `
        <div class="quiz-container" id="quiz-${i}">
            <div class="quiz-question">${i + 1}. ${q.question}</div>
            <div class="quiz-options">${q.options.map((opt, j) =>
                `<div class="quiz-option" onclick="checkQuizAnswer(${i}, ${j}, ${q.correct})">${String.fromCharCode(65 + j)}. ${opt}</div>`
            ).join("")}</div>
        </div>`).join("");

    document.getElementById("lessonContent").innerHTML = `
        <h2 id="section-explanation">Explanation</h2>
        <p>${module.explanation}</p>
        <h2 id="section-example">Real-World Example</h2>
        <p>${module.realWorldExample}</p>
        <h2 id="section-syntax">Syntax</h2>
        ${renderCodeBlock(module.syntax, lang)}
        <h2 id="section-practical">Code Example</h2>
        ${renderCodeBlock(module.practicalExample, lang)}
        <h2 id="section-best">Best Practices</h2>
        <ul>${module.bestPractices.map((p) => `<li>${p}</li>`).join("")}</ul>
        <h2 id="section-mistakes">Common Mistakes</h2>
        <ul>${module.commonMistakes.map((m) => `<li>${m}</li>`).join("")}</ul>
        <h2 id="section-quiz">Quiz</h2>
        <p class="muted-text">Test your knowledge:</p>
        ${quizHTML}
        <h2 id="section-exercise">Practice Exercise</h2>
        <div class="exercise-container"><div class="exercise-title">Practice Challenge</div><p>${module.exercise}</p></div>`;
}

function checkQuizAnswer(quizIndex, selectedIndex, correctIndex) {
    const quizEl = document.getElementById(`quiz-${quizIndex}`);
    const options = quizEl.querySelectorAll('.quiz-option');
    
    options.forEach((opt, i) => {
        opt.classList.remove('correct', 'incorrect');
        if (i === correctIndex) {
            opt.classList.add('correct');
        } else if (i === selectedIndex && selectedIndex !== correctIndex) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });
}

function scrollToSection(index) {
    const sections = [
        "section-explanation",
        "section-example",
        "section-syntax",
        "section-practical",
        "section-best",
        "section-mistakes",
        "section-quiz",
        "section-exercise"
    ];
    const element = document.getElementById(sections[index]);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateMarkCompleteButton() {
    const btn = document.getElementById("markCompleteBtn");
    if (!btn) return;

    const isCompleted = completedLessons.includes(currentLessonIndex);
    
    if (isCompleted) {
        btn.innerText = "✓ Completed";
        btn.classList.add("completed");
        btn.disabled = true;
    } else {
        btn.innerText = "✓ Mark Complete";
        btn.classList.remove("completed");
        btn.disabled = false;
    }
}

function markLessonComplete() {
    if (currentLessonIndex === null) return;
    if (!completedLessons.includes(currentLessonIndex)) {
        completedLessons.push(currentLessonIndex);
        saveCompletedLessons();
        recordLessonToday();
        const pointsEarned = 50;
        awardPoints(pointsEarned);
        updateMarkCompleteButton();
        renderModulesGrid();
        updateLearningPathProgress();
        renderLearningPathTabs();
        syncDashboardFromProgress();
        const mod = getActiveCurriculum()[currentLessonIndex];
        logActivity(`Completed: ${mod?.title || "lesson"} (+${pointsEarned} XP)`);
    }
}

function awardPoints(points) {
    try {
        const user = JSON.parse(localStorage.getItem("nexusUser"));
        if (user) {
            if (!user.progress) user.progress = {};
            user.progress.points = (user.progress.points || 0) + points;
            localStorage.setItem("nexusUser", JSON.stringify(user));
        }
    } catch (e) { console.error("Failed to award points:", e); }
}

function logActivity(text) {
    const key = "nexusRecentActivity";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const entry = { text, time: new Date().toLocaleString() };
    list.unshift(entry);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 12)));
    renderRecentActivity();
}

function renderRecentActivity() {
    const el = document.getElementById("recentActivity");
    if (!el) return;
    const list = JSON.parse(localStorage.getItem("nexusRecentActivity") || "[]");
    el.innerHTML = list.length
        ? list.map((a) => `<li><span class="activity-text">${a.text}</span><span class="activity-time">${a.time}</span></li>`).join("")
        : "<li>No activity yet — start learning to build your timeline.</li>";
}

function getOverallProgress() {
    let total = 0, done = 0;
    LEARNING_PATHS.forEach((p) => {
        const c = getCurriculumForPath(p.id);
        total += c.length;
        done += JSON.parse(localStorage.getItem(`nexusCompleted_${p.id}`) || "[]").length;
    });
    return total ? Math.round((done / total) * 100) : 0;
}

function getUserLevel(xp) {
    if (xp >= 5000) return "Expert";
    if (xp >= 2500) return "Advanced";
    if (xp >= 1000) return "Intermediate";
    if (xp >= 300) return "Learner";
    return "Beginner";
}

function syncDashboardFromProgress() {
    const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
    const xp = user.progress?.points || 0;
    const streak = user.progress?.streak || Math.max(1, Math.floor(getOverallProgress() / 5));
    const overall = getOverallProgress();

    updateEl("streak", streak);
    updateEl("dashboardProgress", `${overall}%`);
    const bar = document.getElementById("dashboardProgressBar");
    if (bar) bar.style.width = `${overall}%`;

    const pathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
    const pathMeta = LEARNING_PATHS.find((p) => p.id === pathId);
    const pathPct = getPathProgressPercent(pathId);
    updateEl("activePathLabel", pathMeta?.title || "Python Fundamentals");
    updateEl("pathProgressLabel", `${pathPct}% of path complete`);

    const next = getNextLessonInfo();
    updateEl("continueLearningLabel", next.title ? `${next.title}` : "Start Python Fundamentals");
    renderRecentActivity();
    renderDailyChallenge();
}

function continueLearning() {
    const last = JSON.parse(localStorage.getItem("nexusLastLesson") || "null");
    showSection("learnSection");
    if (last?.pathId) {
        selectLearningPath(last.pathId);
        if (typeof last.index === "number") openLesson(last.index);
    } else {
        selectLearningPath("python-fundamentals");
    }
}

function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
}

function getLessonsToday() {
    const data = JSON.parse(localStorage.getItem("nexusLessonsToday") || "{}");
    if (data.date !== new Date().toDateString()) return 0;
    return data.count || 0;
}

function recordLessonToday() {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem("nexusLessonsToday") || "{}");
    const count = data.date === today ? (data.count || 0) + 1 : 1;
    localStorage.setItem("nexusLessonsToday", JSON.stringify({ date: today, count }));
}

function getNextLessonInfo() {
    const pathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
    const curriculum = getCurriculumForPath(pathId);
    if (!curriculum.length) return { title: "Start learning", pathId, index: 0 };
    const completed = JSON.parse(localStorage.getItem(`nexusCompleted_${pathId}`) || "[]");
    const nextIndex = curriculum.findIndex((_, i) => !completed.includes(i));
    if (nextIndex >= 0) return { title: curriculum[nextIndex].title, pathId, index: nextIndex };
    return { title: curriculum[0].title, pathId, index: 0 };
}

function getRecruiterContext() {
    const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
    const pathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
    const pathMeta = LEARNING_PATHS.find((p) => p.id === pathId);
    const next = getNextLessonInfo();
    return {
        name: user.name || "Learner",
        pathId,
        pathTitle: pathMeta?.title || "Python Fundamentals",
        pathProgress: getPathProgressPercent(pathId),
        progress: getOverallProgress(),
        streak: user.progress?.streak || Math.max(1, Math.floor(getOverallProgress() / 5)),
        lessonsToday: getLessonsToday(),
        nextLesson: next.title,
        xp: user.progress?.points || 0
    };
}

function renderDailyChallenge() {
    const pathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
    const pathMeta = LEARNING_PATHS.find((p) => p.id === pathId);
    if (window.NexusChallenges) {
        window.NexusChallenges.render(pathId, pathMeta?.title);
    }
}

function acceptDailyChallenge() {
    showSection("learnSection");
    const pathId = localStorage.getItem("nexusCurrentPath") || "python-fundamentals";
    selectLearningPath(pathId);
    logActivity(`Accepted daily challenge on ${pathId}`);
}

let greetingClockTimer = null;

function renderDashboardGreeting() {
    const user = JSON.parse(localStorage.getItem("nexusUser") || "{}");
    const name = user.name || "Learner";
    const now = new Date();

    updateEl("greetingPeriod", getTimeGreeting());
    updateEl("greetingName", name);
    updateEl("greetingDay", now.toLocaleDateString("en-US", { weekday: "long" }));
    updateEl("greetingDate", now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    updateEl("greetingClock", now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));

    const welcome = document.getElementById("welcomeText");
    if (welcome) welcome.textContent = `${getTimeGreeting()}, ${name.split(" ")[0]}`;
}

function startGreetingClock() {
    renderDashboardGreeting();
    if (greetingClockTimer) clearInterval(greetingClockTimer);
    greetingClockTimer = setInterval(renderDashboardGreeting, 1000);
}

function getMotivationalMessage() {
    const msgs = [
        "Every lesson brings you closer to your AI engineering career.",
        "Consistency beats intensity — keep your streak alive!",
        "Today's effort is tomorrow's interview confidence.",
        "Build skills daily and your portfolio will speak for itself."
    ];
    return msgs[new Date().getDate() % msgs.length];
}

function getTodaysPlan() {
    const next = getNextLessonInfo();
    return `Continue ${next.title} on your current path.`;
}

function renderVirtualRecruiterGreeting() {
    const ctx = getRecruiterContext();
    const html = window.NexusRecruiter
        ? window.NexusRecruiter.buildGreeting(ctx)
        : `<p>Welcome back, ${ctx.name}.</p>`;

    const greetEl = document.getElementById("recruiterGreeting");
    const welcomeCard = document.getElementById("recruiterWelcomeCard");
    if (greetEl) greetEl.innerHTML = html;
    if (welcomeCard) welcomeCard.innerHTML = html;

    const messages = document.getElementById("chatMessages");
    if (messages && !messages.dataset.greeted) {
        const intro = window.NexusRecruiter
            ? window.NexusRecruiter.buildChatIntro(ctx)
            : `Welcome back, ${ctx.name}!`;
        messages.innerHTML = `<p class="bot-msg">Virtual Recruiter: ${intro}</p>`;
        messages.dataset.greeted = "1";
    }
}

function showCareerPanel(panel, event) {
    const panels = ["overview", "resume", "coach", "notes", "certs", "jobs", "recruiter"];
    panels.forEach((p) => {
        const el = document.getElementById(`career${p.charAt(0).toUpperCase() + p.slice(1)}Panel`);
        if (el) el.classList.toggle("hidden", p !== panel);
    });
    document.querySelectorAll(".career-tab").forEach((t) => t.classList.remove("active"));
    if (event?.target) event.target.classList.add("active");
    else document.querySelector(`.career-tab[onclick*="'${panel}'"]`)?.classList.add("active");
    if (panel === "recruiter") renderVirtualRecruiterGreeting();
}

function summarizeNotes() {
    const text = document.getElementById("notesInput")?.value?.trim();
    const summaryEl = document.getElementById("notesSummary");
    const conceptsEl = document.getElementById("notesKeyConcepts");
    if (!text) { alert("Paste notes to summarize."); return; }
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 15);
    const summary = sentences.slice(0, 3).map((s) => s.trim()).join(". ") + ".";
    const words = text.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
    const freq = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    const concepts = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
    if (summaryEl) summaryEl.textContent = summary || "Could not extract summary — try longer notes.";
    if (conceptsEl) conceptsEl.innerHTML = concepts.map((c) => `<li>${c}</li>`).join("");
    logActivity("Summarized study notes");
}

function openInterviewTrack(track) {
    if (typeof generateInterviewQuestions === "function") generateInterviewQuestions(track);
    openInterviewPrepCard("technical");
    const titleEl = document.getElementById("interviewPrepTitle");
    const contentEl = document.getElementById("interviewPrepContent");
    if (titleEl) titleEl.textContent = `${track} Interview Questions`;
    if (contentEl) contentEl.textContent = `Practice ${track} fundamentals, system design, and behavioral follow-ups. Use Generate Dynamic Questions for a fresh set.`;
}

function backToLearningPath() {
    document.getElementById("lessonView").classList.add("hidden");
    document.getElementById("learningPathView").classList.remove("hidden");
    currentLessonIndex = null;
}

function previousLesson() {
    if (currentLessonIndex > 0) openLesson(currentLessonIndex - 1);
}

function nextLesson() {
    const curriculum = getActiveCurriculum();
    if (currentLessonIndex < curriculum.length - 1) openLesson(currentLessonIndex + 1);
}
