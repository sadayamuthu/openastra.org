# OpenGPL — Add Project to Website Design

**Date:** 2026-03-04
**Project:** openastra.org
**Stack:** Vite + React + React Router + Tailwind CSS

---

## Overview

Add OpenGPL as a third product on the OpenAstra website, following the same pattern as ControlGate and NCSB. OpenGPL (Generative Policy Language) is an open, declarative policy language purpose-built for generative AI systems.

**GitHub:** https://github.com/sadayamuthu/opengpl

---

## Files to Change / Create

| File | Change |
|---|---|
| `src/pages/OpenGPL.jsx` | New product page |
| `src/pages/OpenGPL.test.jsx` | New test file (matching existing pattern) |
| `src/App.jsx` | Add `/opengpl` route |
| `src/components/Navbar.jsx` | Add "OpenGPL" nav link |
| `src/pages/Home.jsx` | Add third ProductCard + hero CTA button |
| `src/components/Footer.jsx` | Add OpenGPL GitHub footer link |

---

## OpenGPL Page Structure (`/opengpl`)

### Hero
- Badge: `📜 Product`
- Title: `OpenGPL`
- Cyan subtitle: `Generative Policy Language for AI Systems`
- Muted description: *"An open, declarative policy language purpose-built for generative AI systems. Define how AI agents behave, what resources they can access, what they can produce, and how they demonstrate compliance — at runtime and at rest."*

### How it works (3-step flow)
1. `📝` Write declarative `.gpl` policies
2. `🤖` AI agents load & evaluate policies at runtime
3. `✅` ALLOW / DENY / AUDIT with traceable evidence

### Quick start (policy snippet only — not a pip package)
```
# Example policy (policy.gpl)
policy "restrict-pii-output" {
  agent: *
  action: generate
  resource: user_data
  effect: deny
  when: output.contains_pii == true
}
```

### CTA
"View on GitHub ↗" → https://github.com/sadayamuthu/opengpl

---

## Home Page Updates

- Add third `ProductCard`:
  - icon: `📜`
  - name: `OpenGPL`
  - tagline: `Generative Policy Language for AI Systems`
  - description: `An open, declarative policy language for AI agents. Define behavior, resource access, and output constraints — with compliance evidence at runtime and at rest.`
  - href: `/opengpl`
- Add "Explore OpenGPL" CTA button in hero (alongside ControlGate and NCSB buttons)
- Products grid changes from `sm:grid-cols-2` to `sm:grid-cols-3`

## Navbar Update
Add `<NavLink to="/opengpl">OpenGPL</NavLink>` after NCSB.

## Footer Update
Add OpenGPL GitHub link alongside ControlGate and NCSB.

---

## Design Decisions

- Follows existing page pattern exactly — no new components needed
- Quick start shows a `.gpl` policy snippet (illustrative) — no install command since OpenGPL is a language spec, not a pip package
- Icon: `📜` to represent a policy/language document
- Products grid expands to 3 columns on sm+ screens
