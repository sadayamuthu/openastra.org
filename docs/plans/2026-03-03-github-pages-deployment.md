# GitHub Pages Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy the openastra.com React/Vite SPA to GitHub Pages with automatic CI/CD and a custom `openastra.com` domain with free TLS.

**Architecture:** Push to `main` triggers a GitHub Actions workflow that runs `npm ci && npm run build`, patches the output for SPA routing, then force-pushes the `dist/` folder to a `gh-pages` branch. GitHub Pages serves that branch. DNS A records at the registrar point `openastra.com` to GitHub's IPs.

**Tech Stack:** Vite 7, React 19, GitHub Actions, `peaceiris/actions-gh-pages@v4`, GitHub Pages, Let's Encrypt (via GitHub Pages HTTPS).

---

### Task 1: Create GitHub repository and push code

> This task is manual (CLI/browser steps). No code changes needed.

**Step 1: Create the repo on GitHub**

Go to https://github.com/new and create a new repository:
- Name: `openastra.com` (or your preferred name)
- Visibility: Public (GitHub Pages requires public repo on free plan)
- Do NOT initialize with README, .gitignore, or license

**Step 2: Add remote and push**

Run these in the project root:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
git branch -M main
git push -u origin main
```

Replace `<YOUR_USERNAME>` and `<REPO_NAME>` with your actual values.

**Expected:** Code appears on github.com under your account.

**Step 3: Note your GitHub username**

You'll need it in Task 2 for the CNAME record. Format: `<username>.github.io`

---

### Task 2: Create GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create the directory**

```bash
mkdir -p .github/workflows
```

**Step 2: Write the workflow file**

Create `.github/workflows/deploy.yml` with this exact content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Fix SPA routing (copy index.html to 404.html)
        run: cp dist/index.html dist/404.html

      - name: Write CNAME file
        run: echo "openastra.com" > dist/CNAME

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow for GitHub Pages"
git push
```

**Step 4: Verify workflow triggered**

Go to `https://github.com/<USERNAME>/<REPO>/actions` — you should see the workflow running. Wait ~2 minutes for it to complete (green checkmark).

**Expected:** A `gh-pages` branch now exists in your repo containing the built site files.

---

### Task 3: Enable GitHub Pages in repository settings

> Manual browser steps only.

**Step 1: Open Pages settings**

Go to: `https://github.com/<USERNAME>/<REPO>/settings/pages`

**Step 2: Set source**

Under "Build and deployment":
- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/ (root)`
- Click **Save**

**Step 3: Verify initial deployment**

After ~1 minute, the page should show:
> "Your site is live at https://<username>.github.io/<repo>/"

Visit that URL to confirm the site loads correctly.

**Step 4: Test React Router paths**

Navigate directly to a route like `https://<username>.github.io/<repo>/ncsb` — it should load the React app (not a 404 page). If it loads, the SPA fix is working.

---

### Task 4: Configure custom domain in GitHub Pages

> Manual browser steps only.

**Step 1: Add custom domain**

Still in `https://github.com/<USERNAME>/<REPO>/settings/pages`:
- Under "Custom domain", type: `openastra.com`
- Click **Save**

GitHub will attempt DNS verification. It will show a warning about DNS not being configured yet — that's expected.

**Note:** This writes a `CNAME` file to the `gh-pages` branch. However, our workflow already writes it, so it will persist across future deploys.

---

### Task 5: Configure DNS at your registrar

> Manual steps at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.).

**Step 1: Add A records for the apex domain (`openastra.com`)**

Add four A records pointing `@` (or blank host, means root domain) to GitHub's IP addresses:

| Type | Host | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | 3600 |
| A    | @    | 185.199.109.153 | 3600 |
| A    | @    | 185.199.110.153 | 3600 |
| A    | @    | 185.199.111.153 | 3600 |

**Step 2: Add CNAME for www subdomain**

| Type  | Host | Value                       | TTL  |
|-------|------|-----------------------------|------|
| CNAME | www  | `<username>.github.io`      | 3600 |

Replace `<username>` with your actual GitHub username.

**Step 3: Verify DNS propagation**

Run this command to check when DNS has propagated:
```bash
dig openastra.com +noall +answer
```

Expected output (once propagated):
```
openastra.com.  3600  IN  A  185.199.108.153
openastra.com.  3600  IN  A  185.199.109.153
...
```

DNS propagation can take 15 minutes to 48 hours depending on your registrar and TTL settings.

---

### Task 6: Enable HTTPS in GitHub Pages

> Manual browser steps. Do this after DNS has propagated.

**Step 1: Enforce HTTPS**

Go back to `https://github.com/<USERNAME>/<REPO>/settings/pages`:
- The "Enforce HTTPS" checkbox should now be available (enabled once DNS is verified)
- Check **Enforce HTTPS**
- Click **Save**

GitHub will provision a Let's Encrypt certificate automatically. This can take 15–30 minutes after DNS is confirmed.

**Step 2: Verify the live site**

Once HTTPS is active, visit:
- `https://openastra.com` → should load the React app
- `https://www.openastra.com` → should redirect to `https://openastra.com`
- `https://openastra.com/ncsb` → should load (SPA routing works)
- `http://openastra.com` → should redirect to HTTPS

---

### Task 7: Verify end-to-end CI/CD pipeline

**Step 1: Make a test change**

Edit any visible text in the app, e.g., change a heading in `src/App.jsx` or any page component.

**Step 2: Push to main**

```bash
git add -A
git commit -m "test: verify CI/CD pipeline end-to-end"
git push
```

**Step 3: Watch the Actions run**

Go to `https://github.com/<USERNAME>/<REPO>/actions` and verify:
1. Workflow triggers automatically
2. All steps pass (green)
3. `gh-pages` branch is updated

**Step 4: Confirm change live on openastra.com**

Wait ~2 minutes after the workflow completes, then visit `https://openastra.com` and verify your change is visible.

**Step 5: Revert test change if needed**

```bash
git revert HEAD
git push
```

---

## Summary of What Was Built

| Component | Location |
|-----------|----------|
| CI/CD workflow | `.github/workflows/deploy.yml` |
| Built site | `gh-pages` branch (auto-managed) |
| Custom domain config | `CNAME` file written during build |
| SPA routing fix | `dist/404.html` = copy of `dist/index.html` |

## Troubleshooting

**Site shows 404 after deploy:**
- Check GitHub Pages settings — source branch must be `gh-pages`
- Check the Actions run completed successfully
- Wait 2 minutes after workflow completes for GitHub CDN to update

**SPA routes show blank or 404:**
- Confirm `dist/404.html` exists in the `gh-pages` branch
- Check the "Fix SPA routing" step didn't fail in Actions

**HTTPS certificate not provisioning:**
- DNS must be fully propagated first (verify with `dig`)
- Wait up to 30 minutes after DNS is confirmed before checking again
- Ensure "Enforce HTTPS" is checked in Pages settings

**www doesn't work:**
- Confirm the CNAME record for `www` points to `<username>.github.io`
- GitHub Pages handles www → apex redirect automatically
