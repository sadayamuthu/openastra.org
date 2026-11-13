# OpenAstra Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild openastra.org as a data-driven "Research Lab" site with 10 categorized frameworks, Zenodo citations, and coming-soon White papers and Patents.

**Architecture:** One data module (`src/data/frameworks.js`) feeds every page. A single `FrameworkPage` template replaces the 7 hand-written product pages. Routes are generated from the data, so legacy URLs (`/controlgate` …) are kept.

**Tech Stack:** React 19, react-router-dom 6, Tailwind 3, Vite 7, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-13-openastra-redesign-design.md`

## Global Constraints

- Colors: paper `#F6F3EC`, card `#FFFDF8`, ink `#1B1B1B`, rust `#B4441F`. No other accent color.
- Fonts: Newsreader (serif headings and citations), Inter (UI), JetBrains Mono (code, numbers, DOIs).
- DOIs are concept DOIs from the spec table; links are `https://doi.org/<doi>`.
- Zenodo records are called **citations**, never "papers".
- White papers and Patents show the exact text "Coming soon".
- No USENIX mention and no patent topic hints.
- Legacy slugs must keep resolving: controlgate, exposuregate, ocbc, oebc, opengpl, cyberlake, anysql.

## Review Focus

- Clipboard unavailable (`navigator.clipboard` undefined, as in http or jsdom): the Copy/BibTeX buttons must not throw. Test in Task 3.
- Unknown slug, e.g. `/foo`: render NotFound, not a blank page. Test in Task 5.
- `/frameworks?category=bogus`: treat it as "All", not an empty page. Test in Task 4.
- Frameworks without a DOI (CyberLake, ExposureGate) render no citation, DOI tag or DOI button. Test in Task 4.
- Mobile width: the navbar's 5 links must wrap, not overflow. Visual check in Task 6.

---

### Task 1: Theme, data module, helpers

**Files:**
- Modify: `tailwind.config.js`, `src/index.css`, `index.html`, `.gitignore`
- Create: `src/data/frameworks.js`, `src/data/frameworks.test.js`

**Interfaces:**
- Produces: `categories: {id, numeral, name, blurb}[]`; `frameworks: Framework[]` (shape per spec "Data model"); `getFramework(slug) → Framework|undefined`; `frameworksByCategory() → {category, frameworks}[]` (category order, number order); `doiUrl(doi) → string`; `citationText(fw) → string`; `bibtex(fw) → string`; `STAGES: {id, label}[]` = write/review/merge/run (+ foundation handled separately).
- Tailwind tokens: `paper card ink ink-muted rule rust`; fontFamily `serif sans mono`.

- [ ] **Step 1: Failing tests** in `frameworks.test.js`:
  - `frameworks.length === 10`; slugs unique; numbers are exactly 1..10.
  - every category has ≥1 framework; agentic = [mergelock, unasked, zero-egress, cyberlake] in that order.
  - 8 frameworks have `zenodo`; each `zenodo.doi` matches `/^10\.5281\/zenodo\.\d+$/`; cyberlake and exposuregate have none.
  - `doiUrl('10.5281/zenodo.23637443') === 'https://doi.org/10.5281/zenodo.23637443'`.
  - `citationText(getFramework('mergelock')) === 'Sadayamuthu, K. (2026). mergelock: a git-native merge gate (v0.1.5) [Software]. Zenodo. https://doi.org/10.5281/zenodo.23637443'`.
  - For OCBC, version `baseline-2026-03-27` renders `(baseline-2026-03-27)` with no `v` prefix (only numeric versions get `v`).
  - `bibtex(mergelock)` starts with `@software{sadayamuthu2026mergelock,` and contains `doi = {10.5281/zenodo.23637443}`.
  - `getFramework('nope') === undefined`.
- [ ] **Step 2:** `npx vitest run src/data` → FAIL (module missing).
- [ ] **Step 3: Implement the data.** Migrate copy, steps, gate lists, features and quick starts from each existing `src/pages/*.jsx` (CyberLake included) into the data. New frameworks use the spec's "Content for new frameworks". Stages: write = zero-egress, opengpl; review = unasked, controlgate; merge = mergelock, exposuregate; run = cyberlake, anysql; foundation = ocbc, oebc.
- [ ] **Step 4: Theme.** Add Tailwind tokens. In `index.css`, add the Google Fonts import for Newsreader (opsz, 400/500, italic), Inter and JetBrains Mono, and set `body bg-paper text-ink font-sans`. Update `index.html` title to "OpenAstra · Security research for autonomous agents" and update the meta description. Add `.superpowers/` to `.gitignore`.
- [ ] **Step 5:** `npx vitest run src/data` → PASS.
- [ ] **Step 6:** Commit `feat: framework data model and research-lab theme`.

### Task 2: Shell: Navbar, Footer, shared UI

**Files:**
- Modify: `src/components/Navbar.jsx`, `Navbar.test.jsx`, `Footer.jsx`, `Footer.test.jsx`
- Create: `src/components/ui.jsx` exporting `Eyebrow`, `Pill`, `Button` (internal `to` or external `href` with `target=_blank rel=noreferrer`), `ComingSoon({ label, children })` (dashed box, rust "Coming soon"), `CodeBlock({ blocks: {comment, lines}[] })`, `DoiTag`.

- [ ] **Step 1: Failing tests:** Navbar has links Frameworks `/frameworks`, Research `/research`, Patents `/patents`, About `/about`, and GitHub with href `https://github.com/sadayamuthu`. Wordmark "OpenAstra" links `/`. Navbar container has `flex-wrap`. Footer has the "Open source" text and the same internal links.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Active NavLink gets a rust underline. Thick 2px ink rule under the nav.
- [ ] **Step 4:** Run → PASS. Commit `feat: research-lab navbar, footer, ui primitives`.

### Task 3: Citation component

**Files:** Create `src/components/Citation.jsx`, `Citation.test.jsx`

**Interfaces:** `Citation({ framework, compact = false })`. It renders `citationText` (minus the URL) in serif, the doi.org link, and buttons Copy / BibTeX / Zenodo ↗ (`https://zenodo.org/doi/<doi>`). `compact` hides the Zenodo button.

- [ ] **Step 1: Failing tests:**
  - link `href === 'https://doi.org/10.5281/zenodo.23637443'`.
  - with `navigator.clipboard.writeText` mocked, clicking Copy calls it with `citationText(fw)` and the button shows "Copied".
  - clicking BibTeX calls it with `bibtex(fw)`.
  - with `navigator.clipboard` undefined, clicking Copy does not throw.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement (2s reset via `setTimeout`, cleared on unmount). **Step 4:** PASS. Commit `feat: citation component with copy and bibtex`.

### Task 4: Pages: Home, Frameworks, FrameworkPage

**Files:** Rewrite `src/pages/Home.jsx`, `Home.test.jsx`. Create `src/pages/Frameworks.jsx` (+test), `src/pages/FrameworkPage.jsx` (+test), and `src/components/FrameworkIndex.jsx` (numbered category index, used by Home) and `src/components/Pipeline.jsx`.

**Interfaces:** `FrameworkPage({ slug })` renders `NotFound` when the slug is unknown (NotFound comes from Task 5; create a minimal `src/pages/NotFound.jsx` here and test it in Task 5).

- [ ] **Step 1: Failing tests:**
  - Home: headline text matches `/Security research for the age of/`. There are 10 index links, with `/mergelock` … `/anysql` hrefs. Two "Coming soon" texts (White papers, Patents). Featured citation link to MergeLock's DOI.
  - Frameworks: all 10 names shown. Clicking the "Security Catalog" chip leaves only OCBC and OEBC. Rendered at `/frameworks?category=bogus`, it shows all 10.
  - FrameworkPage: for each of the 10 slugs, the h1 equals the name. MergeLock has a link with the doi.org href and a "Cite this" heading. CyberLake has no "Cite this" and no doi.org link. Related on MergeLock includes Unasked. Slug `nope` → text "Not found".
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement per the spec's "Pages" section and wireframe v2. Set `document.title = \`${name} · OpenAstra\`` in an effect.
- [ ] **Step 4:** PASS. Commit `feat: home, frameworks index and framework template`.

### Task 5: Research, Patents, About, NotFound, routing, cleanup

**Files:** Create `src/pages/Research.jsx`, `Patents.jsx`, `About.jsx` (+tests), finish `NotFound.jsx` (+test). Rewrite `src/App.jsx` and add `src/App.test.jsx`. Delete `src/pages/{ControlGate,ExposureGate,OCBC,OEBC,OpenGPL,AnySQL,CyberLake}.{jsx,test.jsx}` and `src/components/ProductCard.{jsx,test.jsx}`.

**Interfaces:** `App` exports a `AppRoutes` component (routes without the router) so tests can wrap it in a `MemoryRouter`. `App` = `BrowserRouter` + `AppRoutes`.

- [ ] **Step 1: Failing tests:**
  - Research: 8 doi.org links with hrefs equal to `doiUrl` of each DOI'd framework; the heading text "Zenodo citations"; "Coming soon" appears twice; no text matching `/paper/i` outside the "White papers" label.
  - Patents: "Coming soon." and the sentence "This page will list each application as it's published."
  - App: `/controlgate`, `/anysql` and `/zero-egress` render h1s ControlGate, anySQL and ZeroEgress. `/research` renders Research. `/does-not-exist` renders "Not found".
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement and delete the legacy files. **Step 4:** PASS.
- [ ] **Step 5:** `npm test -- --run`, `npm run lint` and `npm run build` all pass. Commit `feat: research, patents, about pages; data-driven routes`.

### Task 6: Visual verification

- [ ] Run `npm run dev`. Check `/`, `/frameworks`, `/mergelock`, `/research` and `/patents` at desktop width and at 375px: no horizontal scroll, and the navbar wraps.
- [ ] Fix any issues and commit `fix: responsive polish`.
