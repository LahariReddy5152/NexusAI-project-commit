# NexusAI v1.0.0 — Release Notes

**Release title:** NexusAI v1.0.0 — AI Engineering Learning Platform

**Release date:** June 2026

---

## Overview

First production release of **NexusAI** — a full-stack AI engineering learning and career platform with web and Windows desktop delivery, real backend integrations, and an integrated Virtual Recruiter mentor.

---

## Feature summary

### Learning & projects
- Multi-track curricula: Python, SQL, Java, Spring Boot, AI fundamentals, prompt engineering, RAG, LangChain, OpenAI APIs
- Interactive lesson workspace with progression tracking
- Real-world project blueprints with GitHub integration

### Interview & career
- Mock, technical, system design, and AI-track interview modes
- Resume analyzer and job-tailoring engine
- Career roadmap builder with achievement tracking
- Speech evaluation for interview practice

### Virtual Recruiter
- Context-aware AI mentor (coding assistant, interview coach, career advisor)
- Integrated across dashboard, code lab, and interview workspace
- Backend-synced chat with OpenAI support (optional)

### Platform
- JWT authentication (signup, login, remember me, password reset)
- SQLite persistence for users, progress, and notifications
- Express 5 REST API with OpenAPI / Swagger documentation
- Cosmic burgundy glassmorphism UI with official NexusAI branding
- Electron Windows desktop app with NSIS installer and portable build

---

## Installation

### Web application

```bash
git clone https://github.com/LahariReddy5152/NexusAI-project-commit.git
cd NexusAI-project-commit
npm install
npm start
```

Open **http://localhost:5000**

### Windows desktop

Download from this release:
- **NexusAI-Setup-1.0.0.exe** — NSIS installer (recommended)
- **NexusAI-Portable-1.0.0.exe** — portable executable (no install)

Or build locally:

```bash
npm install
npm run build:win
```

**Desktop data:** `%APPDATA%\nexusai\data\nexusai.db`

### Optional environment

```env
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-production-secret
```

---

## Changelog

### Added
- Complete learning portal with 9+ technology curricula
- Real Projects workspace with GitHub connect, repos, and commit tracking
- Interview Prep with four dedicated tracks and speech evaluation
- Career mode with resume analyze/tailor APIs
- Virtual Recruiter with mode-specific AI responses
- SQLite backend with JWT auth and user progress sync
- OpenAPI 3 spec and Swagger UI at `/api/docs`
- Official NexusAI logo system (SVG, PNG, ICO, ICNS, favicon)
- Electron desktop shell with embedded Express server
- Windows NSIS installer and portable executable
- Native desktop notifications via Electron IPC
- Phase verification scripts (phases 1–8)

### Changed
- Migrated from localStorage-only auth to real JWT + SQLite backend
- Redesigned UI with cosmic crimson theme and modular CSS architecture
- Packaged Electron static assets via `app.getAppPath()` for `app.asar` compatibility

### Fixed
- Windows code-sign symlink blocker (`signAndEditExecutable: false`)
- Packaged application path resolution for production builds
- Logo SVG encoding issues for PNG export pipeline

---

## Known limitations

- **Windows only** for desktop installer; macOS and Linux builds not yet configured
- **No code signing** on Windows executables (SmartScreen may warn on first run)
- **OpenAI** requires `OPENAI_API_KEY`; without it, rule-based AI fallback is used
- **SQLite experimental API** — Node.js emits experimental warning (harmless in dev)
- **Single-user desktop** — no multi-tenant cloud deployment in this release
- **GitHub integration** uses username-based connect; OAuth flow not included
- **Automated E2E** for Virtual Recruiter UI visibility may fail in headless tests when panel is collapsed

---

## Assets included in this release

| File | Description |
|------|-------------|
| `NexusAI-Setup-1.0.0.exe` | Windows NSIS installer (~87 MB) |
| `NexusAI-Portable-1.0.0.exe` | Portable Windows app (~87 MB) |

---

## Links

- **Repository:** https://github.com/LahariReddy5152/NexusAI-project-commit
- **API docs:** http://localhost:5000/api/docs (when server is running)
- **Author:** [Lahari Reddy](https://github.com/LahariReddy5152)
