# Changelog

All notable changes to NexusAI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
- Verification scripts for phases 1–8

### Changed
- Replaced localStorage-only prototype auth with production JWT + database flow
- Modular CSS architecture (12 style parts) with cosmic crimson design system
- Electron packaged static root uses `app.getAppPath()` for `app.asar` support

### Fixed
- Windows electron-builder code-sign symlink extraction failure
- Packaged application resource path resolution
- Logo SVG invalid character encoding in export pipeline

### Known limitations
- Windows desktop only; no macOS/Linux installer in v1.0.0
- Executables are unsigned (Windows SmartScreen warning possible)
- OpenAI live responses require `OPENAI_API_KEY` environment variable

[1.0.0]: https://github.com/LahariReddy5152/NexusAI-project-commit/releases/tag/v1.0.0
