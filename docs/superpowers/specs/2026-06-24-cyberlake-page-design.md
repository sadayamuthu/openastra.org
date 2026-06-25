# CyberLake Page — Design

**Date:** 2026-06-24
**Status:** Approved

## Goal

Add a new **CyberLake** product page to openastra.org following the existing
product-page pattern, and hide **anySQL** by commenting it out (code preserved,
not deleted).

CyberLake is a *trust registry for autonomous agents* — the "npm + Docker Hub +
cert authority" for AI agents. The whole value prop is verifiability and
security: anyone can publish a tool/MCP server/agent, and CyberLake's job is to
tell you whether you can trust it before it gets credentials and acts on your
behalf. Each entry carries a signed identity, a capabilities manifest, a
security/provenance score, and an immutable audit trail with version pinning.

This page is the **marketing/product page** describing that concept. We are not
building the registry itself — only the openastra.org page, mirroring the
existing `AnySQL.jsx` / `OEBC.jsx` pattern.

## Architecture

No new patterns. CyberLake mirrors the existing `AnySQL.jsx` page structure and
wiring. This is a purely additive change plus four comment-outs. All work stays
within the established React 19 + Vite + Tailwind conventions already used by
the other product pages.

## Components

### 1. New page — `src/pages/CyberLake.jsx`

Mirrors `AnySQL.jsx` section-for-section:

- **Hero**
  - Badge: `🌊 Product`
  - Title: `CyberLake`
  - Tagline: *"The trust layer for autonomous agents"*
  - Description: A trust registry for AI agents. Anyone can publish a tool, MCP
    server, or agent; CyberLake verifies it before it gets credentials. Every
    entry carries a signed cryptographic identity, a capabilities manifest
    (declared permissions — the blast radius), a security/provenance score, and
    an immutable audit trail with version pinning.

- **How it works** — 3 steps (lifecycle: publish → verify → trust):
  1. 🪪 **Publish** — Add a `cyberlake-agent.json` manifest and prove ownership
     via DNS TXT
  2. 🔬 **Verify** — CyberLake signs a cryptographic identity and scans for
     prompt-injection, dependency, and exfiltration risk → trust score
  3. 🔑 **Trust** — Review capabilities and provenance before granting
     credentials; pin to a known-good version

- **Quick start** — CLI-style block (self-hostable angle):
  ```
  # Install
  pip install cyberlake

  # Run the registry locally
  cyberlake serve

  # Verify an agent before it gets credentials
  cyberlake verify acme/invoice-reconciler
  ```

- **CTAs**
  - `https://github.com/sadayamuthu/cyberlake` — View on GitHub ↗
  - `https://cyberlake.org` — Website ↗

### 2. New test — `src/pages/CyberLake.test.jsx`

Mirrors `AnySQL.test.jsx`: renders the page and asserts the heading, tagline,
and key section content are present.

### 3. Wiring (additive)

- `src/App.jsx` — import `CyberLake` and add
  `<Route path="/cyberlake" element={<CyberLake />} />`
- `src/components/Navbar.jsx` — add
  `<NavLink to="/cyberlake" className={linkClass}>CyberLake</NavLink>`
- `src/pages/Home.jsx` — add an `Explore CyberLake` hero CTA and a
  `<ProductCard icon="🌊" name="CyberLake" tagline="The trust layer for autonomous agents" .../>`

## Hide anySQL (comment out, keep code)

Comment out the anySQL references in four spots, leaving `src/pages/AnySQL.jsx`
and `src/pages/AnySQL.test.jsx` on disk untouched:

- `src/components/Navbar.jsx` — the anySQL `NavLink`
- `src/App.jsx` — the anySQL **import and route together** (commenting the route
  alone would leave an unused import that ESLint flags)
- `src/pages/Home.jsx` — the anySQL hero CTA and the anySQL `ProductCard`

`AnySQL.test.jsx` continues to pass because the `AnySQL` component itself remains
intact.

## Error handling

Not applicable — static marketing page with no runtime data or user input.

## Testing & success criteria

- `npm test` passes: the new `CyberLake.test.jsx` is green and all existing
  tests are unaffected.
- `npm run lint` is clean: commenting the anySQL import alongside its route
  avoids unused-variable errors.
- anySQL is no longer reachable via the navbar, the home hero CTAs, or the
  products grid, and the `/anysql` route is removed (commented). The page code
  (`AnySQL.jsx`) is retained for easy restoration.
- CyberLake is reachable at `/cyberlake`, linked from the navbar, the home hero
  CTAs, and the products grid.

## Out of scope

- Building the actual CyberLake registry, manifest spec, verification handshake,
  scoring engine, or any backend.
- Deleting anySQL source files.
- Any changes to other product pages.
