# GitHub repository setup

Apply these settings at https://github.com/LahariReddy5152/NexusAI-project-commit/settings

## Description

```
NexusAI — AI engineering learning platform with projects, interview prep, Virtual Recruiter, and Windows desktop app
```

## Topics

```
ai, learning-platform, electron, nodejs, express, sqlite, jwt, interview-prep, portfolio-project, virtual-assistant, education, desktop-app, openapi, swagger
```

## Create release v1.0.0

### Option A — GitHub web UI

1. Go to **Releases → Draft a new release**
2. Tag: `v1.0.0`
3. Title: `NexusAI v1.0.0 — AI Engineering Learning Platform`
4. Paste contents from `docs/RELEASE_v1.0.0.md`
5. Attach assets:
   - `dist/NexusAI-Setup-1.0.0.exe`
   - `dist/NexusAI-Portable-1.0.0.exe`
6. Publish release

### Option B — GitHub CLI

```bash
winget install GitHub.cli
gh auth login
gh release create v1.0.0 ^
  --title "NexusAI v1.0.0 — AI Engineering Learning Platform" ^
  --notes-file docs/RELEASE_v1.0.0.md ^
  dist/NexusAI-Setup-1.0.0.exe ^
  dist/NexusAI-Portable-1.0.0.exe
```

## Push launch preparation files

```bash
git add README.md CHANGELOG.md docs/ scripts/generate-screenshots.mjs scripts/verify-phase9.mjs
git commit -m "docs: Phase 9 GitHub release and portfolio preparation"
git push origin main
git tag v1.0.0
git push origin v1.0.0
```
