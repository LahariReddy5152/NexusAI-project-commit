// Final Build Mode enhancements (non-breaking overlay)
(() => {
    const STORAGE_KEYS = {
        mentorHistory: "nexusMentorHistory",
        projectHub: "nexusProjectHubProgress",
        analytics: "nexusAnalytics",
        career: "nexusCareerMode",
        certificates: "nexusCertificates",
        quizScores: "nexusQuizScores",
        achievements: "nexusAchievements"
    };

    const INTERVIEW_BANK = {
        Java: {
            fundamentals: ["Explain JVM, JRE, and JDK differences.", "How does Java memory model influence thread safety?"],
            system: ["Design a scalable URL shortener in Java.", "How would you structure layered architecture in Spring?"],
            behavioral: ["Describe a time you debugged a difficult Java production issue.", "How do you prioritize refactoring in backend services?"]
        },
        SQL: {
            fundamentals: ["Difference between INNER JOIN and LEFT JOIN?", "What are clustered vs non-clustered indexes?"],
            system: ["How do you prevent N+1 query patterns?", "How do you design transaction boundaries for money transfer?"],
            behavioral: ["Describe a query optimization story.", "How do you handle schema migrations safely?"]
        },
        "Spring Boot": {
            fundamentals: ["What is dependency injection and why does it matter?", "How does Spring Boot auto-configuration work?"],
            system: ["Design resilient REST APIs with Spring Boot.", "How would you structure exception handling globally?"],
            behavioral: ["How did you improve maintainability in a Spring project?", "How do you debug bean wiring problems?" ]
        },
        "AI Engineer": {
            fundamentals: ["What is RAG and when would you use it?", "How do embeddings differ from fine-tuning?"],
            system: ["Design an AI resume analyzer workflow.", "How do you evaluate an LLM feature in production?"],
            behavioral: ["Tell me about mitigating hallucinations in an AI app.", "How do you balance latency, cost, and quality in AI systems?"]
        },
        React: {
            fundamentals: ["Explain useState vs useEffect.", "What is the virtual DOM and why does it matter?"],
            system: ["How would you optimize a large React dashboard?", "How do you manage global state at scale?"],
            behavioral: ["Describe a challenging UI bug you fixed.", "How do you approach component testing?"]
        }
    };

    const PROJECT_HUB = [
        {
            name: "Resume Analyzer",
            level: "Intermediate",
            overview: "Analyze resume text, estimate ATS score, and produce actionable improvements.",
            architecture: "Frontend input -> scoring service -> recommendation engine -> analytics store",
            folderStructure: "src/ui, src/core/scoring, src/core/recommendation, src/data, tests",
            technologies: ["JavaScript", "NLP heuristics", "LocalStorage", "REST-ready architecture"],
            implementationGuide: ["Parse resume text", "Detect skills and role keywords", "Score ATS match", "Generate targeted recommendations", "Track score trend"],
            features: ["Resume upload", "ATS scoring", "Missing skills analysis", "Improvement recommendations"],
            interviewQuestions: ["How do you design explainable scoring?", "How do you reduce false positives in keyword scoring?"],
            demoWorkflow: "Upload resume -> detect skills -> calculate ATS score -> show gaps and improvements"
        },
        {
            name: "RAG Assistant",
            level: "Beginner",
            overview: "Document-grounded assistant with retrieval-first answer generation.",
            architecture: "Document chunks -> retrieval -> response synthesis -> traceable output",
            folderStructure: "src/rag/chunks, src/rag/retrieval, src/rag/generation",
            technologies: ["Embeddings", "Vector Retrieval", "Prompting"],
            implementationGuide: ["Chunk documents", "Retrieve relevant context", "Generate grounded answer", "Measure response quality"],
            features: ["Context retrieval", "Grounded responses", "Low hallucination output", "Source-aware answers"],
            interviewQuestions: ["How do you reduce hallucinations in RAG?", "How do you evaluate retrieval quality?"],
            demoWorkflow: "Upload docs -> ask question -> retrieve context -> generate answer"
        },
        {
            name: "Interview Coach",
            level: "Intermediate",
            overview: "Mock interview engine with generated questions, answer evaluation, and scoring.",
            architecture: "Track selector -> question generator -> answer evaluator -> score persistence",
            folderStructure: "src/interview/questions, src/interview/evaluator, src/interview/store",
            technologies: ["Java", "Spring Boot", "SQL", "AI interview patterns"],
            implementationGuide: ["Generate role questions", "Capture answer", "Evaluate response quality", "Track readiness trends"],
            features: ["Java/Spring/SQL/AI tracks", "Answer evaluation", "Readiness scoring", "Feedback loop"],
            interviewQuestions: ["How do you score interview quality fairly?", "How do you give actionable feedback?"],
            demoWorkflow: "Pick track -> answer question -> receive feedback -> save score"
        },
        {
            name: "AI Mentor",
            level: "Intermediate",
            overview: "Context-aware mentor with learning, interview, project, and career guidance.",
            architecture: "Mentor mode selector -> response engine -> recommendation layer -> history",
            folderStructure: "src/mentor/modes, src/mentor/recommendations, src/mentor/history",
            technologies: ["JavaScript", "LocalStorage", "Recommendation logic"],
            implementationGuide: ["Interpret learner context", "Generate mode-aware advice", "Ask follow-up question", "Persist mentor history"],
            features: ["Context-aware guidance", "Career coaching", "Interview coaching", "Project recommendations"],
            interviewQuestions: ["How does mentor context improve guidance quality?", "How do you design useful follow-up prompts?"],
            demoWorkflow: "Choose mentor mode -> ask question -> get targeted guidance + follow-up"
        },
        {
            name: "Job Tracker",
            level: "Intermediate",
            overview: "Track applications, statuses, and career progress in one place.",
            architecture: "Application form -> status store -> analytics widgets",
            folderStructure: "src/jobs/input, src/jobs/store, src/jobs/insights",
            technologies: ["JavaScript", "LocalStorage", "Dashboard analytics"],
            implementationGuide: ["Save application", "Track status changes", "Measure interview conversion", "Show career insights"],
            features: ["Application logging", "Status tracking", "Date history", "Career insights"],
            interviewQuestions: ["How do you model application lifecycle states?", "How do you derive useful job search analytics?"],
            demoWorkflow: "Add application -> update status -> view readiness insights"
        }
    ];

    const CAREER_BASELINE_SKILLS = ["Java", "Python", "SQL", "Spring Boot", "AWS", "AI Engineering"];

    function safeGet(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function safeSet(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function computeCoreMetrics() {
        const completedLessons = safeGet("learningCompletedLessons", []);
        const projectProgress = Number(localStorage.getItem("projectProgress") || 0);
        const projectMinutes = Number(localStorage.getItem("projectMinutes") || 0);
        const jobs = safeGet("jobApplications", []);
        const quizScores = safeGet(STORAGE_KEYS.quizScores, [72, 81, 77]);
        const completedProjects = projectProgress >= 80 ? 1 : 0;
        const xp = Math.min(10000, completedLessons.length * 40 + completedProjects * 350 + Math.floor(projectMinutes / 5) * 5);
        const streak = Math.max(1, Math.min(365, Math.floor(completedLessons.length / 2) + Math.floor(projectMinutes / 30)));
        const avgQuiz = quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
        const weekly = Math.min(100, Math.round(completedLessons.length * 2.8 + completedProjects * 12));
        const monthly = Math.min(100, Math.round(completedLessons.length * 3.4 + completedProjects * 15));
        const readiness = Math.min(100, Math.round((xp / 10000) * 60 + avgQuiz * 0.4));

        return {
            xp,
            streak,
            lessonsCompleted: completedLessons.length,
            projectsCompleted: completedProjects,
            avgQuiz,
            weekly,
            monthly,
            readiness,
            jobsCount: jobs.length,
            hoursLearned: Math.max(1, Math.round(projectMinutes / 60))
        };
    }

    function updateText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = value;
        }
    }

    function renderProjectHubGrid() {
        const grid = document.querySelector(".real-projects-grid");
        if (!grid) {
            return;
        }

        grid.innerHTML = PROJECT_HUB.map((project) => `
            <div class="project-card-large">
                <h3>${project.name}</h3>
                <div class="project-meta">
                    <span class="difficulty">${project.level}</span>
                    <span class="duration">Portfolio</span>
                </div>
                <p class="skills">Skills: ${project.technologies.join(", ")}</p>
                <button onclick="startProject('${project.name.replace(/'/g, "\\'")}')">Open Blueprint</button>
            </div>
        `).join("");
    }

    function renderProjectDetailBlueprint(projectName) {
        const project = PROJECT_HUB.find((item) => item.name === projectName);
        const holder = document.querySelector(".project-detail-card");
        if (!holder || !project) {
            return;
        }

        holder.innerHTML = `
            <div class="card" style="margin-top: 16px;">
                <h3>Overview</h3>
                <p>${project.overview}</p>
                <h3>Architecture</h3>
                <p>${project.architecture}</p>
                <h3>Folder Structure</h3>
                <pre>${project.folderStructure}</pre>
                <h3>Technologies</h3>
                <ul>${project.technologies.map((t) => `<li>${t}</li>`).join("")}</ul>
                <h3>Features</h3>
                <ul>${(project.features || []).map((f) => `<li>${f}</li>`).join("")}</ul>
                <h3>Implementation Guide</h3>
                <ol>${project.implementationGuide.map((s) => `<li>${s}</li>`).join("")}</ol>
                <h3>Interview Questions</h3>
                <ul>${project.interviewQuestions.map((q) => `<li>${q}</li>`).join("")}</ul>
                <h3>Demo Workflow</h3>
                <p>${project.demoWorkflow || "Open blueprint and walk through build steps."}</p>
            </div>
        `;
    }

    function mentorResponse(message, metrics) {
        const text = message.toLowerCase();
        const trackHints = [];
        const mode = (document.getElementById("mentorMode")?.value || "learning");

        if (text.includes("interview")) {
            trackHints.push("Focus this week: Java concurrency, SQL joins/transactions, and one AI system design story.");
        }
        if (text.includes("project") || text.includes("portfolio")) {
            trackHints.push("Prioritize portfolio impact: finish one project blueprint with architecture + implementation notes + interview talking points.");
        }
        if (text.includes("roadmap") || text.includes("plan")) {
            trackHints.push(`Your roadmap signal: ${metrics.lessonsCompleted} lessons done, readiness ${metrics.readiness}%. Next step is high-impact project execution.`);
        }
        if (text.includes("resume") || text.includes("ats")) {
            trackHints.push("Resume guidance: quantify achievements, surface tech stack, and include architecture decisions per project.");
        }
        if (text.includes("java") || text.includes("spring")) {
            trackHints.push("Java track tip: combine Spring Core, JDBC transaction handling, and API error contracts in one showcase project.");
        }
        if (text.includes("python") || text.includes("ai")) {
            trackHints.push("AI track tip: demonstrate evaluation metrics, prompt strategy, and retrieval workflow with clear tradeoffs.");
        }
        if (text.includes("career") || text.includes("internship") || text.includes("recruiter")) {
            trackHints.push("Career tip: keep your resume role-targeted, quantify outcomes, and prepare one architecture-first project walkthrough.");
        }

        const modePrefix = mode === "interview"
            ? "Interview coaching mode active. "
            : mode === "project"
                ? "Project guidance mode active. "
                : mode === "career"
                    ? "Career guidance mode active. "
                    : "Learning recommendations mode active. ";

        const base = `${modePrefix}Progress snapshot: XP ${metrics.xp}, streak ${metrics.streak}, lessons ${metrics.lessonsCompleted}, projects ${metrics.projectsCompleted}, quiz avg ${metrics.avgQuiz}%.`;

        if (mode === "interview") {
            const prompt = text.includes("java") ? "Explain Java memory model and one concurrency pitfall."
                : text.includes("sql") ? "Write how you optimize a slow JOIN query step by step."
                : text.includes("spring") ? "Explain global exception handling in Spring Boot."
                : "Tell me one project story using Situation, Action, and measurable Result.";
            const scoreHint = text.length > 120 ? "Initial score signal: Good depth." : "Initial score signal: Add more detail and tradeoffs.";
            return `${base} Interview question: ${prompt} Feedback: structure answer in Problem -> Approach -> Tradeoffs -> Result. ${scoreHint}`;
        }

        if (mode === "project") {
            const projectHint = text.includes("rag") ? "For RAG Assistant: improve chunking + retrieval evaluation metrics."
                : text.includes("resume") ? "For Resume Analyzer: explain ATS scoring logic and false-positive handling."
                : "Pick one project, define architecture, implementation steps, and demo workflow.";
            return `${base} ${projectHint} Next step: complete one recruiter-ready project walkthrough.`;
        }

        if (mode === "career") {
            const careerHint = text.includes("resume") ? "Update resume with quantified outcomes and architecture bullets."
                : text.includes("internship") ? "Target backend/AI internship roles and align your portfolio stories."
                : "Strengthen role alignment with ATS keywords and interview storytelling.";
            return `${base} ${careerHint} Career advice: keep one-page resume, role-specific summary, and 2 strong project case studies.`;
        }

        const learningHint = text.includes("python") ? "Start with loops and functions practice, then build mini scripts."
            : text.includes("java") ? "Revise OOP, collections, and JDBC fundamentals with one mini backend task."
            : text.includes("spring") ? "Focus on controllers, services, and exception handling patterns."
            : "Follow learning path topics in sequence and close one practice gap per day.";
        return `${base} Learning advice: ${learningHint} ${trackHints.join(" ")}`.trim();
    }

    function loadMentorHistory() {
        return safeGet(STORAGE_KEYS.mentorHistory, []);
    }

    function saveMentorHistory(history) {
        safeSet(STORAGE_KEYS.mentorHistory, history.slice(-40));
    }

    function renderMentorHistory() {
        const messagesEl = document.getElementById("chatMessages");
        if (!messagesEl) {
            return;
        }
        const history = loadMentorHistory();
        messagesEl.innerHTML = history.map((m) => `<p>${m.role}: ${m.text}</p>`).join("");
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function generateInterviewQuestions(trackFilter) {
        const listEl = document.getElementById("interviewQuestionList");
        if (!listEl) {
            return;
        }

        const allTracks = trackFilter && INTERVIEW_BANK[trackFilter]
            ? [trackFilter]
            : Object.keys(INTERVIEW_BANK);
        const payload = [];
        allTracks.forEach((track) => {
            const bank = INTERVIEW_BANK[track];
            payload.push(`[${track}] ${bank.fundamentals[0]}`);
        });
        allTracks.forEach((track) => {
            const bank = INTERVIEW_BANK[track];
            payload.push(`[${track}] ${bank.system[0]}`);
        });

        listEl.innerHTML = payload.map((q) => `<li>${q}</li>`).join("");
        safeSet("nexusInterviewQuestions", payload);
        const quizScores = safeGet(STORAGE_KEYS.quizScores, []);
        if (quizScores.length < 8) {
            quizScores.push(70 + Math.floor(Math.random() * 21));
            safeSet(STORAGE_KEYS.quizScores, quizScores);
        }
        updateAnalyticsAndProfile();
    }

    function saveInterviewScore() {
        const scoreInput = document.getElementById("interviewScore");
        if (!scoreInput) return;
        
        const score = parseInt(scoreInput.value);
        if (isNaN(score) || score < 0 || score > 100) {
            alert("Please enter a valid score between 0 and 100");
            return;
        }

        const quizScores = safeGet(STORAGE_KEYS.quizScores, []);
        quizScores.push(score);
        safeSet(STORAGE_KEYS.quizScores, quizScores);

        const statusEl = document.getElementById("interviewScoreStatus");
        if (statusEl) {
            statusEl.innerText = `Score saved: ${score}. Total attempts: ${quizScores.length}`;
        }

        updateAnalyticsAndProfile();
    }

    function evaluateInterviewAnswer() {
        const answerInput = document.getElementById("interviewAnswer");
        const feedbackEl = document.getElementById("interviewFeedback");
        if (!answerInput || !feedbackEl) return;

        const answer = answerInput.value.trim();
        if (!answer) {
            feedbackEl.innerText = "Please write an answer before evaluating.";
            return;
        }

        const wordCount = answer.split(/\s+/).length;
        const hasStructure = answer.includes("Situation") || answer.includes("Task") || answer.includes("Action") || answer.includes("Result");
        const hasMetrics = /\d+%|\d+ (users|customers|requests|improvements|reduction|increase)/i.test(answer);
        
        let score = 50;
        let feedback = [];

        if (wordCount >= 50) {
            score += 15;
            feedback.push("✓ Good answer length");
        } else {
            feedback.push("⚠ Answer is too short - add more detail");
        }

        if (hasStructure) {
            score += 20;
            feedback.push("✓ Uses STAR method structure");
        }

        if (hasMetrics) {
            score += 15;
            feedback.push("✓ Includes measurable outcomes");
        }

        score = Math.min(100, score);
        feedbackEl.innerHTML = `
            <strong>Score: ${score}/100</strong><br>
            ${feedback.join("<br>")}
        `;

        answerInput.value = "";
    }

    function renderCareerModeInsights() {
        const cardGrid = document.querySelector("#jobModeSection .card-grid");
        if (!cardGrid) {
            return;
        }
        let panel = document.getElementById("careerModeInsights");
        if (!panel) {
            panel = document.createElement("div");
            panel.id = "careerModeInsights";
            panel.className = "card card-wide";
            cardGrid.appendChild(panel);
        }

        const career = safeGet(STORAGE_KEYS.career, null);
        const gaps = career?.skillGaps || ["AWS", "AI Engineering"];
        const roadmap = ["Strengthen Java + Spring API skills", "Build AI Resume Analyzer", "Complete RAG Assistant blueprint", "Practice cross-domain interview sets", "Track applications weekly"];
        const recommendations = ["Add system design section to project READMEs", "Show metrics for each project", "Keep ATS keywords role-aligned"];

        panel.innerHTML = `
            <h3>Career Mode Intelligence</h3>
            <p><strong>ATS Score:</strong> ${career?.atsScore || 0}%</p>
            <p><strong>Skill Gap Analysis:</strong></p>
            <ul>${gaps.map((g) => `<li>${g}</li>`).join("")}</ul>
            <p><strong>Learning Recommendations:</strong></p>
            <ul>${recommendations.map((r) => `<li>${r}</li>`).join("")}</ul>
            <p><strong>Career Roadmap Generator:</strong></p>
            <ol>${roadmap.map((r) => `<li>${r}</li>`).join("")}</ol>
        `;
    }

    function buildCertificates(metrics) {
        const trackDefs = [
            { name: "Python Foundations", done: metrics.lessonsCompleted >= 10 },
            { name: "Java Full Stack", done: metrics.lessonsCompleted >= 30 },
            { name: "AI Engineer Path", done: metrics.projectsCompleted >= 1 && metrics.avgQuiz >= 75 }
        ];

        const certs = safeGet(STORAGE_KEYS.certificates, []);
        const next = [...certs];
        trackDefs.forEach((track) => {
            const exists = next.some((c) => c.courseName === track.name);
            if (track.done && !exists) {
                const id = `NEX-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
                next.push({
                    certificateId: id,
                    completionDate: new Date().toISOString().slice(0, 10),
                    courseName: track.name
                });
            }
        });

        safeSet(STORAGE_KEYS.certificates, next);
        return next;
    }

    function renderCertificates(certs) {
        const list = document.getElementById("generatedCertificates");
        if (list) {
            list.innerHTML = certs.length
                ? certs.map((c) => `<li>${c.courseName} | ID: ${c.certificateId} | Date: ${c.completionDate} <button onclick="downloadCertificate('${c.certificateId}')">Download</button></li>`).join("")
                : "<li>No certificates generated yet.</li>";
        }

        const profileCerts = document.getElementById("profileCerts");
        if (profileCerts) {
            profileCerts.innerHTML = certs.length
                ? certs.map((c) => `<li>🏆 ${c.courseName} (${c.certificateId})</li>`).join("")
                : "<li>No certificates yet</li>";
        }

        const badgeList = document.getElementById("certificationBadges");
        if (badgeList) {
            const badges = certs.map((c) => `Badge: ${c.courseName}`);
            badgeList.innerHTML = (badges.length ? badges : ["No badges yet"]).map((b) => `<li>${b}</li>`).join("");
        }
    }

    function updateRecommendationEngine(metrics) {
        const nextTopic = metrics.readiness < 55
            ? "Java + Spring Boot Core"
            : metrics.readiness < 75
                ? "SQL Optimization + API Design"
                : "AI Interview Simulation + RAG System Design";
        const gapSummary = metrics.readiness < 65 ? "System Design, AI Evaluation" : "Distributed Architecture Depth";
        const suggestedProject = metrics.readiness < 70 ? "Interview Coach" : "RAG Assistant";

        updateText("recommendedNextTopic", nextTopic);
        updateText("recommendationSkillGaps", gapSummary);
        updateText("recommendedProject", suggestedProject);
    }

    function updatePortfolioMode(metrics, certs) {
        const skills = ["Java", "Python", "SQL", "Spring Boot", "AI Engineering", "Problem Solving"];
        const projects = PROJECT_HUB.map((p) => p.name);

        const skillsEl = document.getElementById("portfolioSkills");
        if (skillsEl) {
            skillsEl.innerHTML = skills.map((s) => `<li>${s}</li>`).join("");
        }

        const projectsEl = document.getElementById("portfolioProjects");
        if (projectsEl) {
            projectsEl.innerHTML = projects.map((p) => `<li>${p}</li>`).join("");
        }

        const certsEl = document.getElementById("portfolioCertificates");
        if (certsEl) {
            certsEl.innerHTML = (certs.length ? certs : [{ courseName: "No certificates yet" }]).map((c) => `<li>${c.courseName}</li>`).join("");
        }

        updateText("portfolioInterviewReadiness", `${metrics.readiness}%`);
        updateText("portfolioProgressStats", `XP ${metrics.xp} | Streak ${metrics.streak} days | Lessons ${metrics.lessonsCompleted} | Projects ${metrics.projectsCompleted} | Quiz ${metrics.avgQuiz}%`);
    }

    function downloadCertificate(certificateId) {
        const certs = safeGet(STORAGE_KEYS.certificates, []);
        const cert = certs.find((c) => c.certificateId === certificateId);
        if (!cert) {
            return;
        }

        const payload = [
            "NexusAI Certificate",
            `Course: ${cert.courseName}`,
            `Certificate ID: ${cert.certificateId}`,
            `Completion Date: ${cert.completionDate}`
        ].join("\n");

        const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${cert.courseName.replace(/\s+/g, "_")}_${cert.certificateId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    window.downloadCertificate = downloadCertificate;

    function updateAnalyticsAndProfile() {
        const metrics = computeCoreMetrics();
        safeSet(STORAGE_KEYS.analytics, metrics);

        updateText("points", metrics.xp);
        updateText("streak", metrics.streak);
        updateText("hours", metrics.hoursLearned);
        updateText("readiness", `${metrics.readiness}%`);
        updateText("completionPercent", `${Math.min(100, Math.round((metrics.lessonsCompleted / 35) * 100))}%`);

        updateText("dailyProgress", `${Math.max(5, Math.round(metrics.weekly * 0.55))}%`);
        updateText("weeklyProgress", `${metrics.weekly}%`);
        updateText("monthlyProgress", `${metrics.monthly}%`);
        updateText("topicCompletion", `${Math.min(100, Math.round((metrics.lessonsCompleted / 35) * 100))}%`);
        updateText("jobReadinessScore", `${metrics.readiness}%`);
        updateText("weakAreas", metrics.readiness < 65 ? "System Design, AWS" : "Advanced AI Evaluation");
        updateText("lessonsCompletedMetric", metrics.lessonsCompleted);
        updateText("projectsCompletedMetric", metrics.projectsCompleted);
        updateText("quizScoreMetric", `${metrics.avgQuiz}%`);
        updateText("skillGrowthMetric", `${Math.min(100, Math.round(metrics.lessonsCompleted * 2.5))}%`);
        updateText("learningInsightsMetric", metrics.avgQuiz >= 80 ? "Strong interview momentum this week" : "Increase mock interviews and SQL depth this week");

        updateText("profilePoints", metrics.xp.toLocaleString());
        updateText("profileStreak", `${metrics.streak} days`);
        updateText("profileHours", `${metrics.hoursLearned} hours`);
        updateText("profileLevel", metrics.readiness > 75 ? "Advanced" : metrics.readiness > 55 ? "Intermediate" : "Beginner");

        const achievements = [
            metrics.lessonsCompleted >= 10 ? "10+ Lessons Completed" : null,
            metrics.lessonsCompleted >= 25 ? "Python Track Builder" : null,
            metrics.lessonsCompleted >= 30 ? "Java Track Builder" : null,
            metrics.projectsCompleted >= 1 ? "Project Completer" : null,
            metrics.avgQuiz >= 80 ? "Quiz Performer" : null
        ].filter(Boolean);
        safeSet(STORAGE_KEYS.achievements, achievements);

        const achievementsEl = document.getElementById("profileAchievements");
        if (achievementsEl) {
            achievementsEl.innerHTML = (achievements.length ? achievements : ["Starting Out"]).map((a) => `<li>${a}</li>`).join("");
        }

        const courseMilestones = [];
        if (metrics.lessonsCompleted >= 25) {
            courseMilestones.push("Python Track");
        }
        if (metrics.lessonsCompleted >= 30) {
            courseMilestones.push("Java Full Stack Track");
        }
        if (metrics.projectsCompleted >= 1) {
            courseMilestones.push("Portfolio Project Track");
        }
        const coursesEl = document.getElementById("profileCourses");
        if (coursesEl) {
            coursesEl.innerHTML = (courseMilestones.length ? courseMilestones : ["In Progress"]).map((c) => `<li>${c}</li>`).join("");
        }

        const projectsEl = document.getElementById("profileProjects");
        if (projectsEl) {
            const projectList = metrics.projectsCompleted ? ["Resume Analyzer"] : ["No completed project yet"];
            projectsEl.innerHTML = projectList.map((p) => `<li>${p}</li>`).join("");
        }

        const certs = buildCertificates(metrics);
        renderCertificates(certs);
        updateRecommendationEngine(metrics);
        updatePortfolioMode(metrics, certs);
    }

    window.generateInterviewQuestions = generateInterviewQuestions;
    window.saveInterviewScore = saveInterviewScore;
    window.evaluateInterviewAnswer = evaluateInterviewAnswer;
})();
