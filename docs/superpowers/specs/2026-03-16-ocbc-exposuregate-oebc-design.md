# Design: OCBC Rename + ExposureGate + OEBC

**Date:** 2026-03-16
**Status:** Approved

## Summary

Three changes to the OpenAstra website:
1. Rename the NCSB product to **OCBC** (Open Controls Baseline Catalog)
2. Add **ExposureGate** — a pre-commit/pre-merge exposure scanning gate (mirrors ControlGate)
3. Add **OEBC** (Open Exposure Baseline Catalog) — a machine-readable JSON catalog of CVE/vulnerability data (mirrors OCBC)

Approach: flat expansion — new products added exactly like existing ones (page, route, navbar link, footer link, home card).

---

## Files Changed

| Action | File | Notes |
|--------|------|-------|
| Rename + update | `src/pages/NCSB.jsx` → `src/pages/OCBC.jsx` | Title, tagline, copy, install commands, GitHub URL |
| Rename + update | `src/pages/NCSB.test.jsx` → `src/pages/OCBC.test.jsx` | Update assertions |
| Create | `src/pages/ExposureGate.jsx` | New product page |
| Create | `src/pages/ExposureGate.test.jsx` | New test file |
| Create | `src/pages/OEBC.jsx` | New product page |
| Create | `src/pages/OEBC.test.jsx` | New test file |
| Update | `src/App.jsx` | Import OCBC (drop NCSB), route `/ncsb` → `/ocbc`, add `/exposuregate` and `/oebc` routes. Drop `/ncsb` entirely (no redirect needed). |
| Update | `src/components/Navbar.jsx` | "NCSB"/`/ncsb` → "OCBC"/`/ocbc`, add ExposureGate and OEBC links |
| Update | `src/components/Navbar.test.jsx` | Update NCSB assertions to OCBC, add ExposureGate/OEBC assertions |
| Update | `src/components/Footer.jsx` | "NCSB" → "OCBC" with new GitHub URL, add ExposureGate and OEBC links |
| Update | `src/components/Footer.test.jsx` | Update NCSB assertions (link text + href) to OCBC, add ExposureGate/OEBC assertions |
| Update | `src/pages/Home.jsx` | NCSB card → OCBC, add ExposureGate + OEBC cards, update hero buttons, grid class `lg:grid-cols-4` → `lg:grid-cols-3` |
| Update | `src/pages/Home.test.jsx` | Update NCSB assertions to OCBC, add ExposureGate/OEBC assertions |

---

## Page Content

### OCBC (renamed from NCSB)

- **Title:** OCBC
- **Tagline:** Open Controls Baseline Catalog — Enriched SP 800-53 Rev. 5 in machine-readable JSON
- **Description:** Merges the full NIST SP 800-53 Rev. 5 control catalog with SP 800-53B baseline profiles and FedRAMP OSCAL baselines into a single enriched JSON file — ready for policy engines, compliance dashboards, IaC scanners, and cloud-provider mapping tools.
- **Features:** Zero configuration, Enriched output, CI-ready (unchanged from NCSB)
- **Quick start (3 commands):**
  ```
  pip install ocbc
  ocbc-generate --out baseline.json
  python -m src.ocbc.generate --out baseline.json
  ```
- **GitHub:** `https://github.com/sadayamuthu/ocbc`

### ExposureGate (new)

- **Icon:** 🔍
- **Title:** ExposureGate
- **Tagline:** CVE & Exposure Scanning — Pre-Commit & Pre-Merge Exposure Gate
- **Description:** An AI-powered gate that scans code changes against known CVEs, exposed secrets, and vulnerability patterns before every commit and merge. Maps findings to CVE IDs — providing traceable exposure evidence and actionable remediation.
- **How it works:** 3-step flow — Developer writes code → Exposure gates scan the diff → BLOCK / WARN / PASS
- **Exposure gates (8 named + label "+ more"):**
  CVE detection, Secrets exposure, Dependency vulnerabilities, Container image scanning, SBOM analysis, Exposed endpoints, Misconfiguration detection, License risk — then `+ more` (no specific count)
- **Quick start (3 commands):**
  ```
  pip install exposuregate
  exposuregate init
  exposuregate scan --mode pre-commit
  ```
  Note: no `--format markdown` flag (unlike ControlGate — intentionally omitted).
- **GitHub:** `https://github.com/sadayamuthu/exposuregate`

### OEBC (new)

- **Icon:** 📊
- **Title:** OEBC
- **Tagline:** Open Exposure Baseline Catalog — Enriched CVE & Vulnerability Data in machine-readable JSON
- **Description:** Merges NVD, OSV, and GitHub Advisory data into a single enriched JSON file — ready for exposure gates, vulnerability dashboards, IaC scanners, and dependency analysis tools.
- **Features:**
  - Zero configuration — Downloads from NVD, OSV, and GitHub Advisory. No local data files to maintain.
  - Enriched output — Every CVE gets severity (LOW / MEDIUM / HIGH / CRITICAL) and exploitability fields derived from configurable rules.
  - CI-ready — Ships with a GitHub Actions workflow that regenerates the baseline daily.
- **Quick start (3 commands — matches OCBC pattern):**
  ```
  pip install oebc
  oebc-generate --out exposure-baseline.json
  python -m src.oebc.generate --out exposure-baseline.json
  ```
- **GitHub:** `https://github.com/sadayamuthu/oebc`

---

## Home Page

### Hero buttons (6 total)
`Explore ControlGate · Explore OCBC · Explore OpenGPL · Explore anySQL · Explore ExposureGate · Explore OEBC`

### Products grid

Grid class change: full resulting class string is `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (was `lg:grid-cols-4`). Yields 2 rows of 3.

| Card | Icon | Tagline | Description (card prop) |
|------|------|---------|------------------------|
| ControlGate | 🛡️ | NIST RMF & FedRAMP Compliance Gate | (unchanged) |
| OCBC | 📋 | Open Controls Baseline Catalog | Merges NIST SP 800-53 Rev. 5, SP 800-53B, and FedRAMP OSCAL baselines into a single enriched JSON file. Zero configuration. CI-ready. Feed it directly into your policy engines. |
| OpenGPL | 📜 | Governance Policy Language for AI Systems | (unchanged) |
| anySQL | 🗄️ | SQL Analytics for AI Systems | (unchanged) |
| ExposureGate | 🔍 | CVE & Exposure Scanning Gate | An AI-powered pre-commit and pre-merge exposure gate. Scans your code changes against known CVEs, vulnerability patterns, and exposure risks — before every commit. |
| OEBC | 📊 | Open Exposure Baseline Catalog | Merges NVD, OSV, and GitHub Advisory data into a single enriched JSON file. Zero configuration. CI-ready. Feed it directly into your exposure gates. |

---

## Navigation

### Navbar (left to right)
`Home · ControlGate · OCBC · OpenGPL · anySQL · ExposureGate · OEBC · GitHub ↗`

### Footer links
`ControlGate ↗ · OCBC ↗ · OpenGPL ↗ · anySQL ↗ · ExposureGate ↗ · OEBC ↗`

---

## Routes

| Route | Component |
|-------|-----------|
| `/` | Home |
| `/controlgate` | ControlGate |
| `/ocbc` | OCBC (replaces `/ncsb` — no redirect) |
| `/opengpl` | OpenGPL |
| `/anysql` | AnySQL |
| `/exposuregate` | ExposureGate |
| `/oebc` | OEBC |

---

## Testing

### OCBC.test.jsx
1. Renders heading `/ocbc/i`
2. Renders features section — `screen.getByText(/zero configuration/i)`
3. Renders install snippet — `screen.getByText(/ocbc-generate/i)`
4. GitHub CTA href — `https://github.com/sadayamuthu/ocbc`

### ExposureGate.test.jsx
1. Renders heading `/exposuregate/i`
2. Renders how it works section — `screen.getByText(/exposure gates scan the diff/i)`
3. Renders install snippet — `screen.getByText(/exposuregate scan/i)`
4. GitHub CTA href — `https://github.com/sadayamuthu/exposuregate`

### OEBC.test.jsx
1. Renders heading `/oebc/i`
2. Renders features section — `screen.getByText(/zero configuration/i)`
3. Renders install snippet — `screen.getByText(/oebc-generate/i)`
4. GitHub CTA href — `https://github.com/sadayamuthu/oebc`

### Navbar.test.jsx updates
- Replace assertion `/ncsb/i` link → `/ocbc/i` link pointing to `/ocbc`
- Add assertions for ExposureGate link → `/exposuregate`
- Add assertions for OEBC link → `/oebc`

### Footer.test.jsx updates
- Replace NCSB link text `/ncsb/i` and href `nist-cloud-security-baseline` → OCBC link text `/ocbc/i` and href `https://github.com/sadayamuthu/ocbc`
- Add ExposureGate link with href `https://github.com/sadayamuthu/exposuregate`
- Add OEBC link with href `https://github.com/sadayamuthu/oebc`

### Home.test.jsx updates
- Rename `it('renders ControlGate and NCSB product cards'` → `it('renders ControlGate and OCBC product cards'`
- Replace `screen.getByText('NCSB')` → `screen.getByText('OCBC')` inside that block
- Inside the existing `it('renders CTA buttons linking to product pages'` block, replace `/explore ncsb/i` href `/ncsb` → `/explore ocbc/i` href `/ocbc`
- Add new separate `it()` blocks (following the anySQL pattern at lines 41–49) for:
  - `it('renders ExposureGate product card')` — `getByText('ExposureGate')`
  - `it('renders Explore ExposureGate hero button')` — `getByRole('link', { name: /explore exposuregate/i })` with href `/exposuregate`
  - `it('renders OEBC product card')` — `getByText('OEBC')`
  - `it('renders Explore OEBC hero button')` — `getByRole('link', { name: /explore oebc/i })` with href `/oebc`
