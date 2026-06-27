function showSection(id){

    document.querySelectorAll(".section").forEach(section=>{
        section.classList.add("hidden");
    });

    const target = document.getElementById(id);
    if(!target) return;

    target.classList.remove("hidden");
}

function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle("active");
}

function toggleChatbot(){
    const box = document.getElementById("chatbotBox");
    if (!box) return;
    const wasHidden = box.classList.contains("hidden");
    box.classList.toggle("hidden");
    if (!box.classList.contains("hidden")) {
        box.classList.remove("minimized");
        if (typeof renderVirtualRecruiterGreeting === "function") renderVirtualRecruiterGreeting();
    }
    if (wasHidden) document.getElementById("chatbotBtn")?.classList.add("hidden");
}

function closeChatbot() {
    const box = document.getElementById("chatbotBox");
    const btn = document.getElementById("chatbotBtn");
    if (box) {
        box.classList.add("hidden");
        box.classList.remove("minimized");
    }
    if (btn) {
        btn.classList.remove("hidden");
    }
}

function minimizeChatbot() {
    const box = document.getElementById("chatbotBox");
    if (box && !box.classList.contains("hidden")) {
        box.classList.toggle("minimized");
        const modeSelect = box.querySelector("#mentorMode");
        if (modeSelect) {
            modeSelect.parentElement.style.display = box.classList.contains("minimized") ? "none" : "flex";
        }
    }
}

function switchToLearningMode(){
    showSection('learnSection');
}

function switchTab(tabName, clickEvent) {
    const tabIds = ["learnTab", "practiceTab", "quizTab"];

    tabIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add("hidden");
        }
    });

    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    const tabElement = document.getElementById(tabName + "Tab");
    if (tabElement) {
        tabElement.classList.remove("hidden");
    }

    if (clickEvent && clickEvent.target) {
        clickEvent.target.classList.add("active");
    } else {
        const fallbackButton = document.querySelector(`.tab-btn[onclick*="switchTab('${tabName}'"]`);
        if (fallbackButton) {
            fallbackButton.classList.add("active");
        }
    }
}

function runCode(){

    const code =
    document.getElementById(
        "codeEditor"
    ).value;

    const output =
    document.getElementById(
        "codeOutput"
    );

    if(!code){

        output.innerText =
        "Please enter code.";

        return;

    }

    if(
        code.includes("print")
    ){

        output.innerText =
        "Python execution simulated successfully.";

    }
    else if(
        code.includes(
            "console.log"
        )
    ){

        output.innerText =
        "JavaScript execution simulated successfully.";

    }
    else{

        output.innerText =
        "Code validated successfully.";

    }

}
function openInterviewPrepCard(type) {
    const titleEl = document.getElementById("interviewPrepTitle");
    const contentEl = document.getElementById("interviewPrepContent");
    if (!titleEl || !contentEl) {
        return;
    }

    const cardContent = {
        hr: {
            title: "HR Interview",
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

    const learningResponses = {
        python: [
            "Learning Mode: Python is the foundation for AI. Master variables, functions, lists, dictionaries, OOP basics, and file handling.",
            "Python Tip: Start with control flow (if/else, loops), then move to functions and object-oriented programming.",
            "Pro: Python excels in AI/ML because of libraries like NumPy, Pandas, and scikit-learn. Build projects to reinforce learning."
        ],
        java: [
            "Learning Mode: Java is powerful for enterprise applications. Learn OOP deeply, Collections Framework, Streams API, and exception handling.",
            "Java Guide: Start with classes and objects, progress to inheritance, polymorphism, and design patterns.",
            "Recommendation: Practice JDBC for database connections and Spring Boot for REST API development."
        ],
        spring: [
            "Learning Mode: Spring Boot streamlines Java development. Focus on dependency injection, controllers, services, repositories, and JPA.",
            "Spring Expert: Learn Spring's core concepts: IoC containers, bean lifecycle, and aspect-oriented programming.",
            "Next: Master Spring Data JPA, Spring Security for authentication/authorization, and REST API best practices."
        ],
        sql: [
            "Learning Mode: SQL is essential for data management. Master SELECT, JOIN types, GROUP BY, WHERE clauses, and query optimization.",
            "SQL Deep: Learn indexing strategies, normalization principles (1NF, 2NF, 3NF), and how databases execute queries.",
            "Performance: Write efficient queries by understanding execution plans and avoiding N+1 query problems."
        ],
        docker: [
            "Learning Mode: Docker containerizes applications for consistency. Learn Dockerfiles, image layers, container networks, and volumes.",
            "Docker Expert: Understand multi-stage builds for optimization, environment variables for configuration, and health checks.",
            "Best Practice: Use Docker Compose for orchestrating multi-container applications locally."
        ],
        aws: [
            "Learning Mode: AWS provides cloud infrastructure. Start with EC2, S3 for storage, IAM for access control, and RDS for databases.",
            "AWS Growth: Progress to Lambda for serverless, CloudWatch for monitoring, and managed databases.",
            "Deployment: Use EC2 for traditional apps, ECS/Fargate for containers, and API Gateway for REST endpoints."
        ],
        kafka: [
            "Learning Mode: Kafka enables event-driven systems. Understand topics, partitions, producers, and consumers.",
            "Architecture: Kafka provides message durability and horizontal scaling for high-throughput systems.",
            "Use Case: Perfect for real-time data pipelines, log aggregation, and microservice communication."
        ],
        react: [
            "Learning Mode: React builds dynamic UIs with components, state, and hooks. Master JSX, component lifecycle, and event handling.",
            "React Advanced: Learn hooks (useState, useEffect, useContext), custom hooks, and performance optimization techniques.",
            "Patterns: Implement state management with Context API or Redux for complex applications."
        ],
        ai: [
            "Learning Mode: AI Engineering combines Python, ML algorithms, LLMs, and prompt engineering. Start with fundamentals.",
            "Roadmap: Python → NumPy/Pandas → Scikit-learn → Deep Learning (TensorFlow/PyTorch) → LLM applications.",
            "Current Focus: Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) are dominating AI engineering."
        ],
        rag: [
            "Learning Mode: RAG (Retrieval-Augmented Generation) combines retrieval with LLMs for accurate, cited answers.",
            "Components: Vector databases, embeddings, retrieval logic, and prompt engineering for LLM context.",
            "Implementation: Use LangChain, Pinecone, or Weaviate for production RAG systems."
        ],
        openai: [
            "Learning Mode: OpenAI APIs enable AI app development. GPT models, embedding APIs, and moderation tools are available.",
            "Integration: Use gpt-4 for reasoning, gpt-3.5-turbo for cost-effective solutions, and embeddings for semantic search.",
            "Best Practice: Implement rate limiting, error handling, and cost monitoring for production applications."
        ]
    };

    const interviewResponses = {
        java: [
            "Interview Mode: Java interviews focus on OOP fundamentals: inheritance, polymorphism, encapsulation, and abstraction.",
            "Prepare: Study Collections (List, Set, Map), Streams API, Exception Handling, multithreading (Thread, Synchronization).",
            "Also: Know JDBC, SQL basics, design patterns (Singleton, Factory, Observer), and String/Integer immutability."
        ],
        sql: [
            "Interview Mode: SQL questions cover JOINs (INNER, LEFT, RIGHT, FULL), GROUP BY, window functions, and query optimization.",
            "Key Topics: Indexes, normalization, transactions (ACID), stored procedures, and explain plan analysis.",
            "Practice: Optimize complex queries, handle NULL values correctly, and understand performance implications."
        ],
        spring: [
            "Interview Mode: Spring interviews test Dependency Injection, bean lifecycle, controllers, services, repositories, and transactions.",
            "Advanced: Spring Security (authentication/authorization), REST API design, microservices, and Spring Cloud basics.",
            "Practice: Explain Spring Boot auto-configuration, profile management, and external property configuration."
        ],
        python: [
            "Interview Mode: Python basics: data types, comprehensions, decorators, context managers, and exception handling.",
            "Advanced: Generators, async/await, GIL implications, and performance optimization techniques.",
            "Practical: Design patterns, unit testing with pytest, and code quality assessment."
        ],
        system: [
            "Interview Mode: System Design covers scalability, load balancing, caching (Redis), databases (SQL vs NoSQL), and API design.",
            "Architecture: Microservices vs monolith, message queues (Kafka), containerization (Docker/Kubernetes), and CDNs.",
            "Trade-offs: Consistency vs availability, horizontal vs vertical scaling, and cost optimization."
        ]
    };

    const careerResponses = {
        resume: [
            "Career Mode: Your resume should highlight measurable achievements (e.g., 'Reduced API latency by 40%' not 'Optimized code').",
            "Resume Tips: Include projects with GitHub links, technical skills with proficiency levels, and quantifiable results.",
            "ATS: Use keywords from job descriptions, avoid graphics, and keep format clean with standard sections."
        ],
        job: [
            "Career Mode: For job search success: maintain a strong GitHub with 3-5 portfolio projects showcasing different skills.",
            "Strategy: Apply to roles matching your current level (don't skip intermediate roles), tailor each application, and network actively.",
            "Preparation: Practice interviews, maintain an ATS-friendly resume, and track applications in a spreadsheet."
        ],
        linkedin: [
            "Career Mode: LinkedIn optimization: professional photo, detailed headline, complete experience descriptions, and endorsements.",
            "Visibility: Post technical insights, engage with content in your field, and request recommendations from colleagues.",
            "Networking: Connect with recruiters, industry leaders, and peers. Message them with personalized notes."
        ],
        interview: [
            "Career Mode: Interview prep: practice STAR method (Situation, Task, Action, Result) for behavioral questions.",
            "Technical: Study data structures, algorithms, system design, and be ready to explain past projects in detail.",
            "Confidence: Research the company, prepare questions, and practice speaking clearly under pressure."
        ]
    };

    const projectResponses = {
        resume: [
            "Project Mode: AI Resume Analyzer components: resume parsing (PDF extraction), ATS keyword matching, skill extraction using NLP.",
            "Features: Generate compatibility scores, identify skill gaps, provide improvement suggestions, and export reports.",
            "Tech Stack: Python (PyPDF2/pdfplumber), NLP (spaCy/NLTK), FastAPI backend, React frontend."
        ],
        chatbot: [
            "Project Mode: AI Chatbot architecture: conversation history management, context window handling, response generation, and error recovery.",
            "Features: Multi-turn conversations, conversation memory, mode switching, typing indicators, and smooth message delivery.",
            "Implementation: Use LLM APIs (OpenAI/Cohere), implement rate limiting, add fallback responses, and monitor costs."
        ],
        project: [
            "Project Mode: Choose projects that demonstrate full-stack capability: backend (APIs), frontend (UI), database integration, and deployment.",
            "Examples: Job tracker app, expense manager with analytics, real-time notifications, or ML model deployment.",
            "Portfolio Value: Include README, GitHub link, live demo, and brief explanation of technical decisions."
        ],
        learning: [
            "Project Mode: Combine learning goals with project building: learn Spring Boot BY building a microservice.",
            "Approach: Start small (CRUD app), add complexity (authentication, caching), then integrate with other services.",
            "Documentation: Explain architecture, deployment steps, and lessons learned for portfolio impact."
        ]
    };

    // Select appropriate response set
    let responseSet = {};
    if (currentMode === "learning") responseSet = learningResponses;
    else if (currentMode === "interview") responseSet = interviewResponses;
    else if (currentMode === "career") responseSet = careerResponses;
    else if (currentMode === "project") responseSet = projectResponses;

    // Find matching response
    for (const topic in responseSet) {
        if (message.includes(topic)) {
            const responses = responseSet[topic];
            const randomIndex = Math.floor(Math.random() * responses.length);
            return responses[randomIndex];
        }
    }

    // Default responses per mode
    if (currentMode === "learning") {
        return "Learning Mode: Which topic interests you? Examples: Python, Java, Spring Boot, SQL, Docker, AWS, Kafka, React, AI, RAG, or OpenAI. I'll provide detailed guidance for each.";
    } else if (currentMode === "interview") {
        return "Interview Mode: What technology do you need interview prep for? Examples: Java, SQL, Spring Boot, Python, System Design. I'll cover common questions and preparation strategies.";
    } else if (currentMode === "career") {
        return "Career Mode: Need help with resume, job search strategy, LinkedIn optimization, or interview preparation? Ask away!";
    } else if (currentMode === "project") {
        return "Project Mode: Interested in building an AI Resume Analyzer, Chatbot, Job Tracker, or other portfolio project? Tell me what you want to build!";
    }

    return "Please select a mentor mode (Learning, Interview, Career, or Project) and ask a question.";
}

function sendMessage(){

    const input=document.getElementById("chatInput");
    const messages=document.getElementById("chatMessages");
    const modeSelect=document.getElementById("mentorMode");

    const userText = input.value.trim();
    if(userText === "") return;

    const userMessageNode = document.createElement("p");
    userMessageNode.textContent = `You: ${userText}`;
    messages.appendChild(userMessageNode);

    const currentMode = modeSelect?.value || "learning";
    const aiResponse = getAIMentorResponse(userText, currentMode);
    const aiMessageNode = document.createElement("p");
    aiMessageNode.textContent = `Virtual Recruiter: ${aiResponse}`;
    messages.appendChild(aiMessageNode);

    input.value="";

    messages.scrollTop=messages.scrollHeight;
}
