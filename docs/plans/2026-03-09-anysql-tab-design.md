# anySQL Tab + Project Updates Design

**Date:** 2026-03-09
**Approach:** All changes in one pass (Option A)

## Summary

Add anySQL as a fully integrated product (navbar tab, page, home card, footer link) and update existing project info for OpenGPL (name change, website link).

## Files to Change

### New file: `src/pages/AnySQL.jsx`

Follows the same structure as `ControlGate.jsx`:

- **Hero:** Icon `🗄️`, badge "Product", title "anySQL", subtitle "SQL Analytics for AI Systems", tagline "From vibes to queries.", description of SQL-based analytics over LLM responses, agent traces, and RAG pipelines.
- **How it works (3 steps):**
  1. `🔌` Wrap your LLM client with anySQL
  2. `📊` Auto-logs calls to 6 canonical SQL tables
  3. `🔍` Query with standard SQL or built-in analytics
- **Quick start:**
  ```
  pip install anysql-sdk
  ```
  ```python
  import anysql
  db = anysql.init()
  client = anysql.claude(anthropic_client)
  df = db.rag_failure_modes()
  ```
- **CTAs:** "View on GitHub ↗" → `https://github.com/sadayamuthu/anySQL` and "Website ↗" → `https://anysql.org`

### `src/components/Navbar.jsx`

- Add `<NavLink to="/anysql">anySQL</NavLink>` after the OpenGPL link.

### `src/App.jsx`

- Import `AnySQL` from `./pages/AnySQL`
- Add `<Route path="/anysql" element={<AnySQL />} />`

### `src/pages/Home.jsx`

- Add 4th `ProductCard`: icon `🗄️`, name "anySQL", tagline "SQL Analytics for AI Systems", description about querying AI telemetry with SQL, href `/anysql`
- Add "Explore anySQL" hero CTA (border button style)
- Update grid to accommodate 4 cards (let it wrap or use `sm:grid-cols-4`)
- Update OpenGPL ProductCard tagline to "Governance Policy Language for AI Systems"

### `src/pages/OpenGPL.jsx`

- Change subtitle from "Generative Policy Language for AI Systems" → "Governance Policy Language for AI Systems"
- Add second CTA button "Website ↗" → `https://opengpl.org`

### `src/components/Footer.jsx`

- Add anySQL link → `https://github.com/sadayamuthu/anySQL`

## Success Criteria

- anySQL tab appears in navbar and routes to `/anysql`
- anySQL product card and CTA appear on home page
- anySQL footer link present
- OpenGPL shows "Governance Policy Language" everywhere (not "Generative")
- OpenGPL page has website link to `https://opengpl.org`
- All existing tests pass; new AnySQL page has a corresponding test file
