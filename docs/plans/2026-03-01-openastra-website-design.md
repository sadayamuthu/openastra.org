# OpenAstra Website Design

**Date:** 2026-03-01
**Project:** openastra.com
**Stack:** Vite + React + React Router + Tailwind CSS

---

## Overview

A minimalistic, multi-page React website for OpenAstra — "The North Star for Autonomous Systems" — showcasing two open source products: ControlGate and NCSB.

---

## Brand & Visual Identity

**Tagline:** The North Star for Autonomous Systems
**Logo mark:** ✦ OpenAstra

### Color Palette

| Role | Name | Hex |
|---|---|---|
| Background | Deep space | `#050A14` |
| Surface (cards/nav) | Dark navy | `#0D1424` |
| Border | Subtle blue | `#1E2D4A` |
| Primary | Electric blue | `#4F8EF7` |
| Accent / CTA | Cyan glow | `#00D4FF` |
| Text primary | Near white | `#F0F6FF` |
| Text muted | Slate blue | `#7A90B0` |

**Typography:** Inter (Google Fonts)
**Aesthetic:** Dark space theme, minimal whitespace, subtle cyan glow on CTAs, no clutter.

---

## Pages & Navigation

### Routes

```
/               → Home
/controlgate    → ControlGate product page
/ncsb           → NCSB product page
```

### Navbar (sticky, minimal)

```
✦ OpenAstra          Home   ControlGate   NCSB   GitHub ↗
```

### Home (`/`)

1. **Hero** — Headline: *"The North Star for Autonomous Systems"*, subtitle about security-first open source tools, two CTA buttons → ControlGate / NCSB
2. **Products** — Two cards side by side with icon, name, one-liner, "Learn more →"
3. **About** — 2-sentence blurb on OpenAstra's mission

### ControlGate (`/controlgate`)

1. **Hero** — Product name + tagline: *"NIST RMF & FedRAMP Cloud Security Hardening — Pre-Commit & Pre-Merge Compliance Gate"*
2. **How it works** — 3-step flow: `commit → 18 gates scan → BLOCK / WARN / PASS`
3. **Quick start** — `pip install controlgate` code snippet
4. **CTA** — GitHub button → `https://github.com/sadayamuthu/controlgate`

### NCSB (`/ncsb`)

1. **Hero** — Product name + tagline: *"Enriched NIST SP 800-53 Rev. 5 security baseline in machine-readable JSON"*
2. **What it does** — 3 key features: zero-config, enriched output, CI-ready
3. **Quick start** — `ncsb-generate` code snippet
4. **CTA** — GitHub button → `https://github.com/sadayamuthu/nist-cloud-security-baseline`

### Footer (minimal)

Copyright + GitHub links for both products.

---

## File Structure

```
openastra.com/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # sticky nav with logo + links
│   │   ├── Footer.jsx        # minimal footer
│   │   └── ProductCard.jsx   # reusable card (used on Home)
│   ├── pages/
│   │   ├── Home.jsx          # hero + products + about
│   │   ├── ControlGate.jsx   # product detail page
│   │   └── NCSB.jsx          # product detail page
│   ├── App.jsx               # router setup
│   ├── main.jsx              # entry point
│   └── index.css             # tailwind directives + custom glows
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Technical Decisions

- **React Router `<BrowserRouter>`** with `<Routes>` — no hash routing
- **Tailwind config** extends theme with the custom color palette above
- **No state management** — pure presentational components
- **External links** (GitHub) open in `target="_blank" rel="noreferrer"`
- **Responsive** — mobile-first, stacks vertically on small screens
- **No JS animations** — keep it simple, CSS transitions only

---

## Products Reference

### ControlGate
- **GitHub:** https://github.com/sadayamuthu/controlgate
- **Install:** `pip install controlgate`
- **Key stat:** 18 security gates, 370 non-negotiable NIST controls

### NCSB (NIST Cloud Security Baseline)
- **GitHub:** https://github.com/sadayamuthu/nist-cloud-security-baseline
- **Install:** `pip install ncsb` / `ncsb-generate`
- **Key stat:** Merges NIST SP 800-53 Rev. 5 + FedRAMP baselines into single JSON
