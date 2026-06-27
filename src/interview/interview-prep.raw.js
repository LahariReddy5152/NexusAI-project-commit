            content: "Focus on STAR answers, ownership stories, teamwork examples, and confidence in communication."
        },
        technical: {
            title: "Technical Interview",
            content: "Practice Java, Spring Boot, SQL, API design, and system design tradeoff explanations."
        },
        mock: {
            title: "Mock Interview",
            content: "Run timed answers, evaluate responses, save score, then improve weak areas with targeted follow-up."
        },
        practice: {
            title: "Practice Topics",
            content: "Practice STAR method, AI project storytelling, behavioral confidence, and review your interview feedback weekly."
        },
        project: {
            title: "Project Explanation",
            content: "Explain problem statement, architecture, implementation choices, impact metrics, and future improvements."
        },
        coach: {
            title: "AI Interview Coach",
            content: "Get guided feedback on your answers. Write responses in the tracker below and use Evaluate Answer for structured coaching."
        },
        company: {
            title: "Company-wise Interview Questions",
            content: "FAANG focuses on algorithms and system design. AI startups emphasize LLMs, RAG, and shipping velocity. Prepare 2 stories per company type."
        }
    };

    const selected = cardContent[type] || cardContent.hr;
    titleEl.innerText = selected.title;
    contentEl.innerText = selected.content;
}

function showPracticeProblem(){
    const problems = [
        'Build a function that reverses a string and validate it with test cases.',
        'Create a REST endpoint mockup for a simple task management API.',
        'Write a JavaScript snippet that filters an array of job postings by salary and location.',
        'Design a small Python script to parse JSON data and output key skills detected.'
    ];
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    alert('Practice Problem:\n' + randomProblem);
}

function getAIMentorResponse(userMessage, mode) {

    const message = userMessage.toLowerCase();
    const currentMode = mode || document.getElementById("mentorMode")?.value || "learning";

    if (typeof getRecruiterContext === "function" && window.NexusRecruiter) {
        const contextual = window.NexusRecruiter.reply(userMessage, getRecruiterContext(), currentMode);
        if (contextual) return contextual;
    }
