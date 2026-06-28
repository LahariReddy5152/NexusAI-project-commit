# NexusAI v1.1.0 — Release Notes

**Release title:** NexusAI v1.1.0 — Light Mode & Desktop Stability Update

**Release date:** June 2026

---

## Overview

**NexusAI v1.1.0** is a stability and polish release focused on packaged desktop reliability, light-mode UX, accessibility contrast, and updated release assets. All changes since v1.0.0 are included in this build.

---

## What's new in v1.1.0

### Desktop & data
- **Electron startup fix** — server bootstrap deferred until `userData` paths are configured
- **SQLite userData migration** — database stored at `%APPDATA%\nexusai\nexusai.db` (not inside read-only `app.asar`)
- **ENOTDIR fix** — eliminated filesystem writes to packaged archive paths on Windows startup
- Lazy database initialization and centralized data paths via `server/data-paths.js`

### UI & accessibility
- **Light mode default** — application opens in light mode; dark mode remains optional in Settings
- **Accessibility contrast pass** — high-contrast text across Dashboard, Learn, Python workspace, Projects, Interview Prep, Career, Code Lab, Profile, and Settings
- **Virtual Recruiter** — floating button visibility improved in light mode; popup remains dark-themed only
- **Lahari branding** — consistent demo user name and email across UI, VR, and documentation

### Documentation & assets
- Updated README, CHANGELOG, and portfolio copy for v1.1.0
- Refreshed light-mode screenshots in `docs/screenshots/`
- Attached WhatsApp captures used as source of truth where available
- Final UI polish across learn workspace, project cards, career analyzer, and code lab

### Platform (carried from v1.0.0)
- Full-stack learning platform with JWT auth and SQLite persistence
- Virtual Recruiter AI mentor, interview prep, career tools, and code lab
- Windows NSIS installer and portable executable

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
- **NexusAI-Setup-1.1.0.exe** — NSIS installer (recommended)
- **NexusAI-Portable-1.1.0.exe** — portable executable (no install)

Or build locally:

```bash
npm install
npm run build:win
```

**Desktop data:** `%APPDATA%\nexusai\nexusai.db`

### Optional environment

```env
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-production-secret
```

---

## Changelog (v1.1.0)

### Fixed
- Packaged Electron `ENOTDIR` startup failure when creating SQLite folders inside `app.asar`
- Server module import order causing writes before `NEXUSAI_DATA_DIR` was set
- Notifications module parse error blocking dashboard navigation (v1.0.0 stabilization)

### Changed
- Default theme is light mode with pastel palette and accessibility-focused contrast
- SQLite path uses Electron `app.getPath("userData")` in production builds
- Demo user branding standardized to **Lahari** (`laharireddy5152@gmail.com`)
- Release screenshots and documentation updated to light mode

### Added
- `server/data-paths.js` centralized writable path resolution with asar guard
- Dashboard stats and cross-feature SQLite sync (projects, interview, settings, code lab)
- Phase 10 end-to-end verification script (`scripts/verify-phase10.mjs`)
- Attached screenshot copy pipeline (`scripts/copy-attached-screenshots.mjs`)

---

## Screenshots

Light mode UI screenshots (demo user **Lahari**) are in `docs/screenshots/`:

| File | Page |
|------|------|
| `01-login.png` | Login |
| `02-dashboard.png` | Dashboard |
| `03-learn.png` | Learn |
| `04-projects.png` | Real Projects |
| `05-interview-prep.png` | Interview Prep |
| `06-career.png` | Career |
| `07-virtual-recruiter.png` | Virtual Recruiter |
| `08-desktop-installer.png` | Windows installer |
| `09-profile.png` | Profile |
| `10-code-lab.png` | Code Lab |
| `11-python-workspace.png` | Python workspace |

---

## Known limitations

- **Windows only** for desktop installer; macOS and Linux builds not yet configured
- **No code signing** on Windows executables (SmartScreen may warn on first run)
- **OpenAI** requires `OPENAI_API_KEY`; without it, rule-based AI fallback is used
- **SQLite experimental API** — Node.js emits experimental warning (harmless in dev)
- **GitHub Release assets** must be uploaded manually if not published via CI

---

## Assets included in this release

| File | Description |
|------|-------------|
| `NexusAI-Setup-1.1.0.exe` | Windows NSIS installer (~96 MB) |
| `NexusAI-Portable-1.1.0.exe` | Portable Windows app (~96 MB) |

---

## Links

- **Repository:** https://github.com/LahariReddy5152/NexusAI-project-commit
- **Previous release:** [v1.0.0](https://github.com/LahariReddy5152/NexusAI-project-commit/releases/tag/v1.0.0)
- **API docs:** http://localhost:5000/api/docs (when server is running)
- **Author:** [Lahari Reddy](https://github.com/LahariReddy5152)
