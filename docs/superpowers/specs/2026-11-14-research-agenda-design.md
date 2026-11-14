# OpenAstra: Research Agenda and Two New Categories

**Date:** 2026-11-14
**Status:** Draft, awaiting approval

## Intent

The user wants OpenAstra to show a 10-area AI security research agenda (from a
roadmap they pasted), without weakening the site's rule that everything listed is
real. They chose option B: only areas that contain projects become site
categories, and the full ten areas live in a "Research agenda" block on /research.

## Categories (site)

| # | id | Name | Projects |
|---|---|---|---|
| I | `agentic` | Agentic | MergeLock, Unasked, ZeroEgress · lab: CyberLake, OpenQA |
| II | `security-controls` | Security Controls | ControlGate · lab: ExposureGate, OpenQS, OpenQO |
| III | `security-catalog` | Security Catalog | OCBC, OEBC · lab: OpenQR |
| IV | `observability` | Observability | anySQL · lab: OpenCIQ, OpenEQ |
| V | `identity` | Identity & Access | lab only: AgentID |
| VI | `governance` | Governance & Compliance | OpenGPL |

- OpenGPL moves from II to VI (it is the ISO 42001 governance framework).
- ZeroEgress stays in I. *My call:* it is a tool for working alongside AI coding
  agents, which is what "Agentic" means on this site. Moving it would make Data
  Security a seventh category with one project.
- AgentID moves from I to V.
- Pages that list shipped frameworks by category (Home index, /frameworks,
  /research citations, About) show only categories with shipped frameworks, so V
  appears on /lab but not as an empty group elsewhere. The /frameworks filter
  chips follow the same rule.
- Shipped numbering follows category order: MergeLock 1, Unasked 2, ZeroEgress 3,
  ControlGate 4, OCBC 5, OEBC 6, anySQL 7, OpenGPL 8.
- /lab gets a "V. Identity & Access" group holding AgentID.

## Research agenda (/research#agenda)

A new section on /research, linked by an "Agenda" pill beside Citations. Ten
numbered rows, each with the area name, its key topics (from the pasted list) and
either links to its projects (shipped or lab) or an "Open area" tag:

| # | Area | Projects |
|---|---|---|
| I | Agentic AI Security | category I |
| II | Security Controls | category II |
| III | Security Catalog | category III |
| IV | Observability & Monitoring | category IV |
| V | AI Identity & Access | category V |
| VI | AI Governance & Compliance | category VI |
| VII | AI Threat Modeling & Risk Assessment | Open area |
| VIII | AI Runtime Security | Open area |
| IX | AI Data Security & Privacy | Open area |
| X | AI Resilience & Recovery | Open area |

Areas I–VI link to their category. The agenda is data (`AGENDA` in
`src/data/frameworks.js`), with the projects derived from the category, so the
two never disagree. The OpenQ quantum-safe suite stays a group on /lab; it is not
an agenda area.

## Also fixed

- /research copy says "Eight of our ten frameworks are archived". It should say
  all eight shipped frameworks are archived.

## Sibling site

- opengpl.org Footer and Home eyebrow change "II. Security Controls" to
  "VI. Governance & Compliance". This is a separate PR in that repo.

## Non-goals

- No new routes. No changes to anySQL.org (it stays IV).
- No category pages for VII–X until a project exists.

## Approaches

1. **(A) All ten as categories:** empty "Open research area" cards for four or
   more categories. Rejected: about a third of the index would be empty.
2. **(B) Categories only where projects exist, plus an agenda on /research:**
   chosen by the user.
3. **(C) Agenda only, categories unchanged:** OpenGPL would stay mislabeled under
   Security Controls.

## Testing

TDD with Vitest:
- The category list has six entries.
- OpenGPL's category is `governance`.
- AgentID appears under V on /lab.
- The Home index and the /frameworks chips skip Identity.
- /research#agenda renders ten rows, with "Open area" on VII–X and project links
  on I–VI.
- The /frameworks?category=governance filter works.
- Shipped numbering is 1–8 in index order.

lint, build and 375px overflow checks must also pass.
