# Changelog

All notable changes to NexusAI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-06-27

### Fixed
- Packaged Electron `ENOTDIR` startup failure when SQLite paths targeted read-only `app.asar`
- Deferred server import until `NEXUSAI_DATA_DIR` points to Electron `userData`

### Changed
- Light mode is the default theme with accessibility contrast improvements across all pages
- SQLite database path in desktop builds: `%APPDATA%\nexusai\nexusai.db`
- Lahari branding and refreshed light-mode screenshots in README and release docs
- Final UI polish for learn workspace, projects, career analyzer, profile, and code lab

### Added
- Centralized data path module (`server/data-paths.js`) with asar write guard
- Release notes for v1.1.0 and attached screenshot copy pipeline

## [1.0.0] - 2026-06-26

### Added
- Full-stack AI engineering learning platform (web + Windows desktop)
- Learning portal with Python, SQL, Java, Spring Boot, AI, RAG, LangChain, and OpenAI curricula
- Real Projects workspace with step builders and GitHub integration
- Interview Prep: mock, technical, system design, and AI tracks
- Career tools: resume analyzer, job tailoring, roadmap builder
- Virtual Recruiter AI mentor with context-aware modes
- Express 5 REST API with JWT authentication and SQLite persistence
- OpenAPI 3 specification and Swagger UI
- Official NexusAI logo and favicon asset pipeline
- Electron desktop application with embedded server
- Windows NSIS installer and portable executable
- Native desktop notifications
- Verification scripts for phases 1–8 and 10

### Changed
- Replaced localStorage-only prototype auth with production JWT + database flow
- Premium light mode UI (default) with accessibility contrast pass across all pages; optional dark mode
- Electron userData stores SQLite at `%APPDATA%\nexusai\nexusai.db`
- README and release screenshots updated to light mode with demo user Lahari

### Fixed
- Windows electron-builder code-sign symlink extraction failure
- Packaged application resource path resolution
- Logo SVG invalid character encoding in export pipeline
- Session token UNIQUE constraint on consecutive logins
- Notifications module parse error blocking dashboard scripts
- Phase 11 stabilization: navigation, persistence, responsive layout

### Known limitations
- Windows desktop only; no macOS/Linux installer in v1.0.0
- Executables are unsigned (Windows SmartScreen warning possible)
- OpenAI live responses require `OPENAI_API_KEY` environment variable

[1.1.0]: https://github.com/LahariReddy5152/NexusAI-project-commit/releases/tag/v1.1.0
[1.0.0]: https://github.com/LahariReddy5152/NexusAI-project-commit/releases/tag/v1.0.0
