# Research Agenda Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Identity & Access and Governance & Compliance categories, move OpenGPL and AgentID into them, and add a 10-area research agenda on /research.

**Architecture:** All changes are data-driven from `src/data/frameworks.js`. Two new categories, an `AGENDA` array whose projects are derived from categories, and `frameworksByCategory()` dropping empty groups so the pages that list shipped work never render an empty category. opengpl.org gets a separate one-line relabel.

**Tech Stack:** React 19, react-router 6, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-14-research-agenda-design.md`

## Global Constraints

- Categories, in order: I `agentic` Agentic · II `security-controls` Security Controls · III `security-catalog` Security Catalog · IV `observability` Observability · V `identity` Identity & Access · VI `governance` Governance & Compliance.
- Shipped numbers: MergeLock 1, Unasked 2, ZeroEgress 3, ControlGate 4, OCBC 5, OEBC 6, anySQL 7, OpenGPL 8.
- Agenda names VII–X: AI Threat Modeling & Risk Assessment, AI Runtime Security, AI Data Security & Privacy, AI Resilience & Recovery. Each is tagged "Open area".
- The OpenQ suite stays a /lab group and is not an agenda area.

## Review Focus

- `/frameworks?category=identity` (a category with no shipped work): treat it as unknown and show All. Test in Task 1.
- The /lab filter `?group=identity` shows AgentID. Test in Task 1.
- Agenda rows must not link to lab projects that have no page: only CyberLake and ExposureGate have one. Test in Task 2.
- At 375px, agenda rows stack without horizontal overflow. Visual check in Task 3.

---

### Task 1: Categories, moves and numbering

**Files:** `src/data/frameworks.js`, `src/pages/Frameworks.jsx`, and the tests `src/data/frameworks.test.js`, `src/pages/Frameworks.test.jsx`, `src/pages/Lab.test.jsx` and `src/pages/Home.test.jsx`.

**Interfaces:**
- Produces `categories` (6 entries).
- `frameworksByCategory()` returns only non-empty groups.
- `LAB_GROUPS` gains `{ id: 'identity', name: 'Identity & Access', title: 'V. Identity & Access' }`, placed after `observability`.

- [ ] Tests first:
  - `categories.map(c => c.id)` equals the six ids in order.
  - `getFramework('opengpl').category === 'governance'`.
  - The numbers of `shippedFrameworks()` in order are `[1..8]`, and the slugs are `mergelock, unasked, zeroegress, controlgate, ocbc, oebc, anysql, opengpl`.
  - The category ids of `frameworksByCategory()` exclude `identity`.
  - On the /frameworks page, there is no "Identity & Access" chip, a "Governance & Compliance" chip is present, `?category=governance` shows only OpenGPL, and `?category=identity` shows all 8.
  - At `/lab?group=identity`, AgentID is shown.
  - The Home index shows "VI. Governance & Compliance". Update the existing "four categories" test to five.
- [ ] Run the tests and watch them fail.
- [ ] Implement:
  - Add the two categories, with blurbs.
  - Move OpenGPL to `governance` with number 8, and renumber ControlGate 4, OCBC 5, OEBC 6, anySQL 7.
  - Move AgentID to `group: 'identity', category: 'identity'`.
  - Filter out empty groups in `frameworksByCategory`.
  - Frameworks chips and the `active` check use `frameworksByCategory()`.
- [ ] Run the tests until they pass, then commit.

### Task 2: Research agenda

**Files:** `src/data/frameworks.js` (`AGENDA`, `agenda()`), `src/pages/Research.jsx`, `src/data/frameworks.test.js` and `src/pages/Research.test.jsx`.

**Interfaces:**
- `AGENDA`: an array of 10 entries shaped `{ numeral, name, topics, category? }`.
- `agenda()` returns each entry plus:
  - `shipped`: the shipped frameworks of its category.
  - `lab`: the lab projects of its category, shaped `{ name, to? }`.

- [ ] Tests first:
  - `agenda()` has length 10, and the numerals run I to X.
  - VII–X have no category, and `shipped` and `lab` are empty.
  - Entry VI `shipped` is `[OpenGPL]`.
  - Entry V `lab` names are `['AgentID']`.
  - Research renders a region named "Research agenda" with 10 rows. It shows 4 "Open area" tags, and links for MergeLock `/mergelock` and OpenGPL `/opengpl`.
  - AgentID is shown, but not as a link.
  - The "Agenda" link has href `#agenda`.
  - The intro says "All eight frameworks".
- [ ] Run the tests and watch them fail.
- [ ] Implement:
  - The `#agenda` section after the citations.
  - Rows use `grid-cols-1 md:grid-cols-[3rem_1fr_1.3fr_auto]`.
  - Lab projects with `to` become dashed links, and the others are plain muted text with "(lab)".
- [ ] Run the tests until they pass, then commit.

### Task 3: Verify, and update opengpl.org

- [ ] In openastra.org, `npx vitest run`, `npm run lint` and `npm run build` pass, and scrollWidth is 375 on `/`, `/frameworks`, `/lab` and `/research`.
- [ ] In opengpl.org, a test first: the footer contains "VI. Governance & Compliance". Then change the Footer and the Home eyebrow. Test, lint and build, then commit on a branch.
