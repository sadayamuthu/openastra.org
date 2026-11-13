# OpenAstra.org Redesign: Research Lab

**Date:** 2026-11-13
**Status:** Approved (wireframes v2, `.superpowers/brainstorm/…/full-site-a-v2.html`)

## Intent

Rebuild openastra.org from scratch with a new look. The site should read as an
independent research lab for autonomous-systems security: categorized open
frameworks, each with a citable Zenodo release, plus "coming soon" placeholders
for white papers and patents. The current site is a dark, cyan, flat list of
products with one hand-written page per product and an 8-link navbar. It
doesn't scale to 10 frameworks and doesn't show the research record.

## Goals

- Add three new frameworks: **MergeLock**, **Unasked**, **ZeroEgress**.
- Group all frameworks into four categories:
  - **I. Agentic:** MergeLock, Unasked, ZeroEgress, CyberLake
  - **II. Security Controls:** ControlGate, ExposureGate, OpenGPL
  - **III. Security Catalog:** OCBC, OEBC
  - **IV. Observability:** anySQL (un-hidden)
- Show a Zenodo citation (APA-style text and a `https://doi.org/…` link) for
  every framework that has one, on its page, on Research and on Home.
- Add "Coming soon" sections for **White papers** and **Patents**.
- Use a new visual language: direction A, "Research Lab".

## Non-goals

- No real white papers or patent content. Both are "Coming soon" only.
- No mention of the double-blind USENIX submission, and no hints at patent topics.
- No dark mode, CMS, search or analytics.
- No change to the deploy pipeline (GitHub Pages + 404.html SPA fallback).

## Anti-goals

- Calling Zenodo software records "papers". They are labeled **citations**.
- Breaking existing URLs. `/controlgate`, `/exposuregate`, `/ocbc`, `/oebc`,
  `/opengpl`, `/cyberlake` and `/anysql` keep working.
- Losing content from the existing product pages. Their copy, steps, gate
  lists, features and quick starts move into the new data model.

## Approaches considered

1. **Data-driven template (chosen).** A single `frameworks.js` data module
   drives the home index, frameworks page, research citations, routes and a
   single `FrameworkPage` template. Adding framework #11 means adding one
   object. The cost is a one-time migration of 7 existing pages into data.
2. **Restyle each hand-written page.** Less migration work, but 10
   near-duplicate files, and citation and category data would be repeated
   across Home, Research and every page.
3. **MDX/content files per framework.** Most flexible prose, but it adds
   tooling (MDX plugin) for little gain at this size.

## Visual language

- Colors as Tailwind tokens: `paper #F6F3EC` (page), `card #FFFDF8`,
  `ink #1B1B1B` (text), `ink-muted` (ink at ~60%), `rule` (ink at ~15%),
  `rust #B4441F` (single accent: links, hover, "coming soon").
- Type: **Newsreader** (serif) for headings, category names and citations;
  **Inter** for UI and body; **JetBrains Mono** for code, numbers and DOIs. Loaded
  from Google Fonts.
- Editorial layout: thick 2px rule under the nav, thin rules between rows,
  numbered index (`01`–`10`), roman-numeral italic category headings,
  dashed borders for "coming soon" boxes, dark code blocks.
- Responsive: index and card grids collapse to one column on mobile. The navbar
  wraps under the logo on small screens (no hamburger needed for 4 links).

## Information architecture

| Route | Page |
|---|---|
| `/` | Home |
| `/frameworks` | All frameworks by category, with filter chips (`?category=agentic`) |
| `/:slug` for each framework | Framework page (template) |
| `/research` | Zenodo citations by category, then White papers and Patents (coming soon) |
| `/patents` | Patents, coming soon |
| `/about` | Lab + author + links |
| `*` | Not found |

Framework slugs: `mergelock`, `unasked`, `zero-egress`, `cyberlake`,
`controlgate`, `exposuregate`, `opengpl`, `ocbc`, `oebc`, `anysql`.

Navbar: **OpenAstra** wordmark · Frameworks · Research · Patents · About · GitHub ↗.

## Data model (`src/data/frameworks.js`)

```js
categories: [{ id: 'agentic', numeral: 'I', name: 'Agentic', blurb }, …]
frameworks: [{
  slug, name, number,            // number = display order 1..10
  category,                      // category id
  summary,                       // one line for the index row
  tagline,                       // hero subtitle
  description,                   // hero paragraph
  problem?,                      // optional "The problem" paragraph
  steps: [{ title, text }],      // "How it works"
  highlights?: { title, items: [string] }        // chips, e.g. gates
  features?: [{ title, text }]                   // feature cards
  quickstart: [{ comment, lines: [string] }],
  facts: [[label, value]],       // "At a glance"
  stage,                         // 'write'|'review'|'merge'|'run'|'foundation'
  links: { github, website? },
  zenodo?: { doi, title, version, year }   // concept DOI, real Zenodo title
}]
```

Helpers: `getFramework(slug)`, `byCategory()`, `citationText(fw)` (APA),
`bibtex(fw)` (`@software`), `doiUrl(doi)`.

Zenodo data (concept DOIs from the author's profile README, titles and versions from
the Zenodo API on 2026-11-13):

| Framework | Concept DOI | Title | Version |
|---|---|---|---|
| ZeroEgress | 10.5281/zenodo.23679808 | ZeroEgress: an AI code editor that works offline | 0.1.0 |
| MergeLock | 10.5281/zenodo.23637443 | mergelock: a git-native merge gate | 0.1.5 |
| Unasked | 10.5281/zenodo.23637740 | unasked: see what your coding agent changed that you never asked for | 0.1.0 |
| ControlGate | 10.5281/zenodo.23980530 | ControlGate: A Pre-Commit and Pre-Merge NIST SP 800-53 Compliance Gate | 0.2.1 |
| OpenGPL | 10.5281/zenodo.23844061 | OpenGPL: Governance Policy Language | 0.2.0 |
| OCBC | 10.5281/zenodo.23980534 | OCBC: Open Controls Baseline Catalog, a Machine-Readable NIST SP 800-53 Rev. 5 and FedRAMP Catalog | baseline-2026-03-27 |
| OEBC | 10.5281/zenodo.23980544 | OEBC: Open Exposure Baseline Catalog, a CVE Exposure Baseline Enriched with EPSS and CISA KEV | baseline-2026-06-14 |
| anySQL | 10.5281/zenodo.23980548 | anySQL: SQL Analytics for AI Systems | 0.1.1 |

CyberLake and ExposureGate have no DOI. They show no citation block and no DOI tag.

Author string: `Sadayamuthu, K.`; year 2026; publisher Zenodo; type `[Software]`.

## Pages

**Home.** Eyebrow "Independent research lab · Autonomous systems security";
serif H1 "Security research for the age of *autonomous agents*." (accent on
the last two words); sub-line; pills (10 open frameworks · 8 Zenodo DOIs ·
Patents coming soon); buttons Browse frameworks / Research. Then **The index**:
two columns of categories, numbered rows (name, summary, DOI tag), each a link.
A "Cite this" box features MergeLock. Then **Where each framework fits**: Write →
Review → Merge → Run stages, with Foundation (catalogs) underneath, derived from
`stage`. Then **Latest on Zenodo** (3 most recent by Zenodo date) next to two
dashed boxes, White papers and Patents, both "Coming soon". Footer.

**Frameworks.** H1 and filter chips (All + 4 categories). Each chip filters the list
in place and syncs `?category=`. For each category: italic heading, blurb, and a
grid of cards (number, name, summary, tags: DOI if present).

**Framework page (template).** Breadcrumb (Frameworks / I. Agentic / Name);
number + category eyebrow; serif H1; tagline; description; buttons GitHub ↗,
Website ↗ (if any), DOI ↗ (if any). Side box "At a glance" (facts, plus DOI
row). The problem (optional). How it works (numbered steps). Highlights chips /
feature cards (optional). Quick start (dark code block). Cite this (if DOI).
Related: other frameworks in the same category. Sets `document.title`.

**Research.** H1 and intro; tabs/pills: Citations (active) · White papers
(soon) · Patents (soon). The pills are anchors, not filters. "Zenodo citations · 8"
grouped by category; each entry shows the APA text, the doi.org link and the
buttons **Copy** (APA), **BibTeX** (copies `@software{…}`) and **Zenodo ↗**
(`https://zenodo.org/doi/<doi>`). A "Copied" state shows for 2s. Then two
dashed "Coming soon" boxes: White papers, Patents.

**Patents.** Centered: eyebrow "Intellectual property", H1 Patents, "Coming
soon.", "This page will list each application as it's published." Nothing
else.

**About.** Short lab description (reuse current About copy, corrected
grammar), focus areas = the four categories, links: GitHub, Zenodo DOIs.

**Footer.** "OpenAstra · Independent research" · nav links · GitHub ↗ ·
© year · "Open source".

## Content for new frameworks (from their READMEs)

- **MergeLock:** a git-native merge gate. It compares two branches before they
  meet and reports conflicts git won't: signature changed vs. new callers,
  deleted-but-still-used symbols, duplicate definitions. It uses `git merge-tree`
  plus tree-sitter and never touches the working tree. Rules: textual, add_add,
  modify_delete, signature_caller, duplicate_definition. TS/JS/Python. CLI, MCP
  server, GitHub Action, Docker. Quick start: `brew install
  sadayamuthu/tap/mergelock`, `mergelock check my-branch main`.
- **Unasked:** scores every diff hunk against your prompts and the agent's
  transcript, and lists the hunks nobody asked for. `unasked --drop` reverts exactly
  those, and `unasked undo` restores them. Local, deterministic, no model, no network.
  Labels: deletion, test, dependency, feature, refactor, collateral.
  Works with Claude Code and Codex. Quick start: `brew install
  sadayamuthu/tap/unasked`, `unasked`, `unasked --drop`, `unasked undo`.
- **ZeroEgress:** an offline AI code editor (chat, agent mode, background
  agents, quick edit, autocomplete) that talks only to your own model servers
  (Ollama, vLLM, LM Studio, oMLX). Telemetry, auto-update, marketplace and
  cloud sign-in are removed. A runtime guard blocks and logs all other egress.
  Install: download from GitHub Releases (.dmg/.exe/.deb/.rpm/AppImage).

## Testing

Vitest + Testing Library, as today. Tests replace the per-product page tests:

- data integrity: 10 frameworks, unique slugs and numbers, every category
  non-empty, every DOI matches `10.5281/zenodo.\d+`, citation/BibTeX format.
- Navbar: 4 links and GitHub.
- Home: headline, all 10 index rows link to `/<slug>`, both coming-soon boxes.
- Frameworks: filter chips filter the list.
- FrameworkPage: renders for every slug; DOI link only when present;
  unknown slug → not found.
- Research: 8 citations with correct `https://doi.org/` hrefs; Copy calls the
  clipboard; white papers and patents show "Coming soon".
- Patents, About, NotFound: render.
- App routes: legacy URLs still render their framework.

`npm test`, `npm run lint` and `npm run build` must pass.

## Builder's calls (not discussed; mine)

- Old per-product page files and tests (`ControlGate.jsx`, … `AnySQL.jsx`,
  `ProductCard.jsx`) are deleted after their content moves into data.
- The uncommitted CyberLake page content is migrated the same way.
- `.superpowers/` is added to `.gitignore`.
- `index.html` meta description and title are updated to the new positioning.
- Clipboard failure (insecure context) falls back to selecting the text; no error UI.
