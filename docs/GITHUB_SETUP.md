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

## Create release v1.1.0

### Option A — GitHub web UI

1. Go to **Releases → Draft a new release**
2. Tag: `v1.1.0`
3. Title: `NexusAI v1.1.0 — Light Mode & Desktop Stability Update`
4. Paste contents from `docs/RELEASE_v1.1.0.md`
5. Attach assets:
   - `dist/NexusAI-Setup-1.1.0.exe`
   - `dist/NexusAI-Portable-1.1.0.exe`
6. Publish release

### Option B — GitHub CLI

```bash
winget install GitHub.cli
gh auth login
gh release create v1.1.0 ^
  --title "NexusAI v1.1.0 — Light Mode & Desktop Stability Update" ^
  --notes-file docs/RELEASE_v1.1.0.md ^
  dist/NexusAI-Setup-1.1.0.exe ^
  dist/NexusAI-Portable-1.1.0.exe
```

## Previous release (v1.0.0)

See `docs/RELEASE_v1.0.0.md` and tag `v1.0.0`.

## Push release preparation files

```bash
git add README.md CHANGELOG.md docs/RELEASE_v1.1.0.md docs/GITHUB_SETUP.md
git commit -m "docs: prepare NexusAI v1.1.0 release notes and documentation"
git push origin main
git tag v1.1.0
git push origin v1.1.0
```
