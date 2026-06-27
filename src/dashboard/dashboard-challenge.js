/**
 * NexusAI — Adaptive daily challenges by learning path
 */
(function () {
    const CHALLENGES = {
        "python-fundamentals": [
            { title: "List Comprehension Sprint", desc: "Build squares for 1–10 using a list comprehension.", question: "What is the output of [x**2 for x in range(1, 6)]?" },
            { title: "F-String Formatter", desc: "Write a function that formats a profile with f-strings.", question: "Format name and role in one f-string line." },
            { title: "Dictionary Counter", desc: "Count word frequency in a sentence with a dict.", question: "Count occurrences of each word in a sample sentence." }
        ],
        "advanced-python": [
            { title: "Decorator Challenge", desc: "Create a timing decorator for any function.", question: "Explain how @wraps preserves function metadata." },
            { title: "Generator Pipeline", desc: "Build a generator filtering a large dataset.", question: "Yield only even numbers from an input stream." }
        ],
        "java-fundamentals": [
            { title: "OOP Modeling", desc: "Design BankAccount with deposit and withdraw.", question: "Why encapsulate balance as private?" },
            { title: "Collections Sort", desc: "Sort employees by salary with Comparable.", question: "Difference between ArrayList and LinkedList?" }
        ],
        "javascript": [
            { title: "Array Filter", desc: "Filter products by price and category with ES6.", question: "Implement filter + map on a product array." },
            { title: "Async Fetch Mock", desc: "Write async/await to simulate API data.", question: "What does Promise.all do with 3 fetch calls?" }
        ],
        "react": [
            { title: "Counter Component", desc: "Build a counter with useState hooks.", question: "When does useEffect run after mount?" },
            { title: "Props Drill", desc: "Pass user data from parent to child.", question: "Props vs state — when to use each?" }
        ],
        "rest-apis": [
            { title: "REST Endpoint Design", desc: "Design CRUD routes for a tasks API.", question: "Which HTTP method is idempotent: PUT or POST?" },
            { title: "Status Code Quiz", desc: "Match scenarios to status codes.", question: "When do you return 404 vs 400?" }
        ],
        "spring-boot": [
            { title: "REST Controller", desc: "Sketch @RestController with GET and POST.", question: "Explain @Autowired constructor injection." },
            { title: "DI Wiring", desc: "Wire service and repository layers.", question: "What is the Spring application context?" }
        ],
        "ai-fundamentals": [
            { title: "RAG Pipeline", desc: "Sketch chunk → embed → retrieve → generate.", question: "When is RAG better than fine-tuning?" },
            { title: "ML vs DL", desc: "Choose ML or DL for tabular fraud data.", question: "What is the bias-variance tradeoff?" }
        ],
        "prompt-engineering": [
            { title: "Chain of Thought", desc: "Write a CoT prompt for a word problem.", question: "Why does CoT improve reasoning accuracy?" },
            { title: "Few-Shot Template", desc: "Create 3-shot sentiment classification prompt.", question: "Zero-shot vs few-shot — tradeoffs?" }
        ],
        default: [
            { title: "Daily Lesson", desc: "Complete one lesson to keep your streak.", question: "Review today's lesson summary." },
            { title: "Quiz Run", desc: "Score 100% on a lesson quiz.", question: "Retake one quiz from your current path." }
        ]
    };

    function resolveKey(pathId) {
        if (!pathId) return "default";
        if (pathId.includes("python")) return "python-fundamentals";
        if (pathId.includes("java") && !pathId.includes("script")) return "java-fundamentals";
        if (pathId === "react") return "react";
        if (pathId === "rest-apis") return "rest-apis";
        if (pathId === "spring-boot") return "spring-boot";
        if (pathId === "javascript" || pathId === "advanced-javascript") return "javascript";
        if (pathId === "ai-fundamentals") return "ai-fundamentals";
        if (pathId === "prompt-engineering") return "prompt-engineering";
        return CHALLENGES[pathId] ? pathId : "default";
    }

    function getForPath(pathId) {
        const key = resolveKey(pathId);
        return CHALLENGES[key] || CHALLENGES.default;
    }

    function pickChallenge(pathId) {
        const list = getForPath(pathId);
        const hourSlot = Math.floor(Date.now() / 3600000);
        return list[hourSlot % list.length];
    }

    function render(pathId, pathTitle) {
        const c = pickChallenge(pathId);
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set("challengePathLabel", pathTitle || "Learning Path");
        set("dailyChallengeTitle", c.title);
        set("dailyChallengeDesc", c.desc);
        set("dailyChallengeQuestion", c.question || "");
    }

    window.NexusChallenges = { getForPath, pickChallenge, render, resolveKey };
})();
