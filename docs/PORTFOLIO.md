# NexusAI — Portfolio Assets

Use these materials for resumes, LinkedIn, interviews, and technical blogs.

---

## Resume project bullets

- Architected and shipped **NexusAI**, a full-stack AI engineering learning platform combining structured curricula, portfolio projects, interview prep, and an integrated Virtual Recruiter mentor across web and Windows desktop (Electron).
- Built a **production REST API** with Express 5, JWT authentication, bcrypt password hashing, and **SQLite persistence** for users, progress, notifications, and AI chat history.
- Implemented **9+ learning tracks** (Python, SQL, Java, Spring Boot, AI fundamentals, prompt engineering, RAG, LangChain, OpenAI APIs) with modular ES module frontend and progression sync.
- Delivered **interview preparation suite** with mock, technical, system design, and AI tracks plus speech evaluation API for spoken response scoring.
- Integrated **resume analyzer and job-tailoring engine**, GitHub project connectivity, and career roadmap builder with achievement tracking.
- Published **OpenAPI 3 documentation** with Swagger UI; created Playwright-based verification scripts covering backend, desktop, and release pipelines.
- Packaged **Windows desktop release** (NSIS installer + portable `.exe`, ~87 MB) with embedded server, native notifications, and per-user SQLite storage at `%APPDATA%\nexusai\data`.
- Designed official **NexusAI brand system** (circuit-style logo, SVG/PNG/ICO/ICNS pipeline) and cosmic burgundy glassmorphism UI with responsive dashboard shell.

---

## LinkedIn project description

**NexusAI — AI Engineering Learning & Career Platform**

I designed and built NexusAI, an end-to-end platform that helps software engineers learn AI development, build portfolio projects, and prepare for technical interviews — all in one workspace.

The platform includes multi-track learning paths, real-world project builders with GitHub integration, a Virtual Recruiter AI mentor, resume analysis, and a full interview preparation suite. On the backend, I implemented JWT authentication, SQLite persistence, and a documented REST API with OpenAI integration (optional).

NexusAI runs in the browser and as a **Windows desktop application** via Electron, with a production NSIS installer and portable build.

**Tech stack:** JavaScript (ES modules), Node.js, Express 5, SQLite, JWT, Electron, Playwright, OpenAPI/Swagger, HTML/CSS

**Links:** https://github.com/LahariReddy5152/NexusAI-project-commit

---

## 30-second project pitch

> NexusAI is an AI engineering learning platform I built to help developers **learn, build, and grow** in one place. It combines structured courses, hands-on projects with GitHub integration, interview prep with speech feedback, and a Virtual Recruiter AI mentor. I built the full stack — Express API, SQLite database, JWT auth — and packaged it as both a web app and a Windows desktop installer with Electron. It’s designed to feel like a premium developer tool, not a tutorial site.

---

## 2-minute interview explanation

**Problem:** Aspiring AI engineers often scatter their learning across docs, videos, LeetCode, and ChatGPT without a unified system for progress, projects, or interview readiness.

**Solution:** NexusAI is a single platform with four pillars — **Learn**, **Build**, **Interview**, and **Career** — plus a Virtual Recruiter that adapts to context (coding lab, interview coach, career advisor).

**Architecture:** The frontend is vanilla JavaScript ES modules with a modular CSS design system. The backend is Express 5 serving a REST API documented in OpenAPI 3. Authentication uses JWT with bcrypt-hashed passwords. Data persists in SQLite via Node’s built-in SQLite module. The AI layer calls OpenAI when an API key is present, with a rule-based fallback for offline demos.

**Desktop delivery:** Electron wraps the same web UI but boots an embedded Express server on localhost, stores data in the user’s AppData folder, and exposes native notifications through a preload IPC bridge. Windows builds use electron-builder with NSIS for install/uninstall and a portable executable.

**Technical decisions:** I chose vanilla JS over React to keep the bundle lightweight and the Electron package small. SQLite avoids external database setup for a desktop-first experience. Modular verification scripts (Playwright + API tests) validate each release phase.

**Outcome:** v1.0.0 ships with 200+ source files, a production Windows installer, complete logo system, and GitHub release artifacts ready for portfolio distribution.

---

## Architecture summary

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  Browser (localhost:5000)  │  Electron (embedded server)    │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     Presentation Layer                      │
│  index.html · dashboard.html · src/* (ES modules) · style.css│
└────────────────────────────┬────────────────────────────────┘
                             │ REST + JWT
┌────────────────────────────▼────────────────────────────────┐
│                       API Layer (Express 5)                   │
│  /api/auth · /api/ai · /api/resume · /api/github · /api/... │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
┌────────────▼────────────┐    ┌─────────────▼─────────────┐
│   SQLite (nexusai.db)   │    │   Services Layer          │
│   users · progress ·    │    │   AI · Resume · GitHub ·  │
│   notifications · chat  │    │   Speech                  │
└─────────────────────────┘    └─────────────┬─────────────┘
                                             │
                               ┌─────────────▼─────────────┐
                               │   OpenAI API (optional)   │
                               └───────────────────────────┘
```

**Key patterns:** Embedded server (Electron), JWT session guard, API client abstraction, modular feature folders under `src/`, phase-based verification scripts, asset pipeline for brand icons.

---

## Suggested GitHub repository metadata

| Field | Value |
|-------|-------|
| **Description** | NexusAI — AI engineering learning platform with projects, interview prep, Virtual Recruiter, and Windows desktop app |
| **Website** | https://github.com/LahariReddy5152/NexusAI-project-commit |
| **Topics** | `ai` `learning-platform` `electron` `nodejs` `express` `sqlite` `jwt` `interview-prep` `portfolio-project` `virtual-assistant` `education` `desktop-app` |
