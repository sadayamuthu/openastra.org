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

| Action | File |
|--------|------|
| Rename + update | `src/pages/NCSB.jsx` → `src/pages/OCBC.jsx` |
| Rename + update | `src/pages/NCSB.test.jsx` → `src/pages/OCBC.test.jsx` |
| Update | `src/App.jsx` |
| Update | `src/components/Navbar.jsx` |
| Update | `src/components/Footer.jsx` |
| Update | `src/pages/Home.jsx` |
| Create | `src/pages/ExposureGate.jsx` |
| Create | `src/pages/ExposureGate.test.jsx` |
| Create | `src/pages/OEBC.jsx` |
| Create | `src/pages/OEBC.test.jsx` |

---

## Page Content

### OCBC (renamed from NCSB)

- **Title:** OCBC
- **Tagline:** Open Controls Baseline Catalog — Enriched SP 800-53 Rev. 5 in machine-readable JSON
- **Description:** Merges the full NIST SP 800-53 Rev. 5 control catalog with SP 800-53B baseline profiles and FedRAMP OSCAL baselines into a single enriched JSON file — ready for policy engines, compliance dashboards, IaC scanners, and cloud-provider mapping tools.
- **Features:** Zero configuration, Enriched output, CI-ready (unchanged from NCSB)
- **Install:** `pip install ocbc` / `ocbc-generate --out baseline.json`
- **GitHub:** `https://github.com/sadayamuthu/ocbc`

### ExposureGate (new)

- **Icon:** 🔍
- **Title:** ExposureGate
- **Tagline:** CVE & Exposure Scanning — Pre-Commit & Pre-Merge Exposure Gate
- **Description:** An AI-powered gate that scans code changes against known CVEs, exposed secrets, and vulnerability patterns before every commit and merge. Maps findings to CVE IDs — providing traceable exposure evidence and actionable remediation.
- **How it works:** 3-step flow — Developer writes code → Exposure gates scan the diff → BLOCK / WARN / PASS
- **Exposure gates:** CVE detection, Secrets exposure, Dependency vulnerabilities, Container image scanning, SBOM analysis, Exposed endpoints, Misconfiguration detection, License risk (+ more)
- **Install:** `pip install exposuregate` / `exposuregate init` / `exposuregate scan --mode pre-commit`
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
- **Install:** `pip install oebc` / `oebc-generate --out exposure-baseline.json`
- **GitHub:** `https://github.com/sadayamuthu/oebc`

---

## Home Page

### Hero buttons
`Explore ControlGate · Explore OCBC · Explore OpenGPL · Explore anySQL · Explore ExposureGate · Explore OEBC`

### Products grid (2×3)

| Card | Icon | Tagline |
|------|------|---------|
| ControlGate | 🛡️ | NIST RMF & FedRAMP Compliance Gate |
| OCBC | 📋 | Open Controls Baseline Catalog |
| OpenGPL | 📜 | Governance Policy Language for AI Systems |
| anySQL | 🗄️ | SQL Analytics for AI Systems |
| ExposureGate | 🔍 | CVE & Exposure Scanning Gate |
| OEBC | 📊 | Open Exposure Baseline Catalog |

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
| `/ocbc` | OCBC |
| `/opengpl` | OpenGPL |
| `/anysql` | AnySQL |
| `/exposuregate` | ExposureGate |
| `/oebc` | OEBC |

---

## Testing

Each new/renamed page gets a test file with 4 tests:
1. Renders the product name heading
2. Renders the key content section (features / how it works)
3. Renders the install snippet
4. Renders GitHub CTA link with correct href
