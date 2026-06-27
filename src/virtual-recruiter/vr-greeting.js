/**
 * NexusAI — Virtual Recruiter context-aware greeting and replies
 */
(function () {
    function getTimeGreeting() {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 17) return "Good Afternoon";
        return "Good Evening";
    }

    function buildGreeting(ctx) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
        const lessonsToday = ctx.lessonsToday ?? 0;
        const nextLesson = ctx.nextLesson || "your first lesson";
        const path = ctx.pathTitle || "Python Fundamentals";

        return `
<p class="greeting-line"><strong>${getTimeGreeting()}, ${ctx.name || "Learner"}.</strong></p>
<p>Today is <strong>${dayName}</strong>.</p>
<p>Current Time: <strong>${timeStr}</strong></p>
<p>Welcome back.</p>
<p>You have completed <strong>${lessonsToday}</strong> lesson${lessonsToday === 1 ? "" : "s"} today.</p>
<p>Your next lesson is <strong>${nextLesson}</strong> on the <strong>${path}</strong> path.</p>
<p>Progress: <strong>${ctx.progress ?? 0}%</strong> · Streak: <strong>${ctx.streak ?? 0}</strong> days</p>
<p class="motivation">How can I help you today?</p>`;
    }

    function buildChatIntro(ctx) {
        return `${getTimeGreeting()}, ${ctx.name || "Learner"}! You're on ${ctx.pathTitle || "your learning path"}. Next up: ${ctx.nextLesson || "start learning"}. Progress ${ctx.progress ?? 0}%. How can I help?`;
    }

    function reply(message, ctx, mode) {
        const msg = message.toLowerCase();

        if (/dashboard|home|overview/.test(msg)) {
            return `Dashboard: You're on ${ctx.pathTitle}, ${ctx.progress}% complete, ${ctx.streak}-day streak. Use Continue Learning to resume ${ctx.nextLesson || "your lesson"}.`;
        }
        if (/progress|percent|completion/.test(msg)) {
            return `Your overall roadmap progress is ${ctx.progress}%. Current path: ${ctx.pathTitle}. Lessons completed today: ${ctx.lessonsToday ?? 0}.`;
        }
        if (/streak/.test(msg)) {
            return `Your current streak is ${ctx.streak} day${ctx.streak === 1 ? "" : "s"}. Complete a lesson today to keep it going.`;
        }
        if (/next lesson|continue|resume/.test(msg)) {
            return `Your next lesson is "${ctx.nextLesson || "Variables"}" in ${ctx.pathTitle}. Click Continue Learning on the dashboard or ask me to open Learn.`;
        }
        if (/course|path|learning path|current course/.test(msg)) {
            return `You're studying ${ctx.pathTitle}. ${ctx.pathProgress ?? 0}% of that path is complete.`;
        }
        if (/certification|certificate/.test(msg)) {
            return `Open Career → Certifications to view locked and earned certificates. Progress on ${ctx.pathTitle} unlocks related certs.`;
        }
        if (/project/.test(msg)) {
            return `Check Real Projects for portfolio builds. Your job readiness improves as you complete projects and lessons.`;
        }
        if (/challenge|daily/.test(msg)) {
            return `Today's challenge matches your ${ctx.pathTitle} path. Find it on the Dashboard under Daily Challenge.`;
        }
        if (/open learn|start learning|go to learn/.test(msg)) {
            if (typeof showSection === "function") showSection("learnSection");
            return `Opening Learn. Your path "${ctx.pathTitle}" is ready — start with ${ctx.nextLesson || "lesson 1"}.`;
        }

        if (mode === "interview-coach" || mode === "interview") {
            return `Interview Coach: open Interview Prep for mock, technical, and behavioral banks. Practice ${ctx.pathTitle}-related depth with scored feedback.`;
        }
        if (mode === "career-advisor" || mode === "career") {
            return `Career Advisor: open Career → Career Roadmap for 10 independent paths (AI Engineer, Java Full Stack, Cloud, etc.). No path blocks another.`;
        }
        if (mode === "project-mentor" || mode === "project") {
            return `Project Mentor: Real Projects has portfolio blueprints with per-project progress. Recommend building one project aligned to ${ctx.pathTitle}.`;
        }
        if (mode === "resume-reviewer" || mode === "resume") {
            return `Resume Reviewer: use Career → Resume Analyzer for ATS score and skill gaps. Ask me for bullet feedback and keyword tips.`;
        }
        if (mode === "learning-mentor" || mode === "learning") {
            return `Learning Mentor: continue ${ctx.pathTitle} — next lesson "${ctx.nextLesson}". Progress ${ctx.progress}%.`;
        }
        if (mode === "job-search") {
            return `Job Search Assistant: track applications in Career → Job Tracker. Ask for search strategy or interview prep links.`;
        }

        return null;
    }

    window.NexusRecruiter = { getTimeGreeting, buildGreeting, buildChatIntro, reply };
})();
