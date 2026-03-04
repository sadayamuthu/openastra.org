# Deployment Design: GitHub Pages + Custom Domain

**Date:** 2026-03-03
**Status:** Approved

## Overview

Deploy the openastra.com React/Vite SPA to GitHub Pages with automatic CI/CD via GitHub Actions, custom domain `openastra.com`, and TLS via Let's Encrypt.

## Architecture

```
git push → main branch
    → GitHub Actions: npm ci → npm run build → deploy dist/ → gh-pages branch
    → GitHub Pages serves gh-pages branch
    → DNS: openastra.com → GitHub Pages IPs
    → TLS: Let's Encrypt (auto-managed by GitHub Pages)
```

## Components

### 1. GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

Trigger: push to `main` branch

Steps:
1. Checkout code
2. Setup Node.js 20
3. `npm ci` (reproducible install from lockfile)
4. `npm run build` (Vite builds to `dist/`)
5. Copy `index.html` → `dist/404.html` (SPA routing fix)
6. Write `CNAME` file containing `openastra.com` to `dist/`
7. Deploy `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages`

### 2. Vite Configuration

Confirm `base: '/'` in `vite.config.js` (default — no subdirectory path needed).

### 3. DNS Records

Add at your domain registrar:

| Type  | Host | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | `<username>.github.io`   |

### 4. GitHub Pages Settings

In repo Settings → Pages:
- Source: `gh-pages` branch, `/ (root)`
- Custom domain: `openastra.com`
- Enforce HTTPS: enabled (after DNS propagation)

## SPA Routing Fix

React Router handles routing client-side. GitHub Pages returns its own 404 page for unknown paths. Fix: copy `index.html` to `404.html` in the build output. GitHub Pages serves the React app via 404.html, React Router reads `window.location` and renders the correct route.

## Notes

- DNS propagation can take up to 24–48 hours; HTTPS will activate after propagation
- The `CNAME` file in `dist/` persists the custom domain setting across deploys
- `npm ci` ensures builds are reproducible and deterministic
- GitHub Actions free tier: 2,000 minutes/month (more than enough for this site)
