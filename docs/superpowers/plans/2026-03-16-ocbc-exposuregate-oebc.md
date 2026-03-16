# OCBC Rename + ExposureGate + OEBC Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename NCSB to OCBC site-wide, and add two new product pages — ExposureGate and OEBC — with full routing, navigation, and test coverage.

**Architecture:** Flat expansion — each new product gets a page component, test file, route in App.jsx, link in Navbar/Footer, and card on Home. Follows the two existing patterns: gate products (ControlGate) and catalog products (NCSB/OCBC).

**Tech Stack:** React 19, React Router v6, Vite, Vitest, @testing-library/react, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-16-ocbc-exposuregate-oebc-design.md`

---

## Chunk 1: Rename NCSB → OCBC

---

### Task 1: Update OCBC page test

**Files:**
- Create: `src/pages/OCBC.test.jsx` (rename from NCSB.test.jsx — delete original after)

- [ ] **Step 1: Create the updated test file**

Create `src/pages/OCBC.test.jsx` with this exact content:

```jsx
import { render, screen } from '@testing-library/react'
import OCBC from './OCBC'

describe('OCBC page', () => {
  it('renders the product name', () => {
    render(<OCBC />)
    expect(screen.getByRole('heading', { name: /ocbc/i })).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<OCBC />)
    expect(screen.getByText(/zero configuration/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<OCBC />)
    expect(screen.getByText(/ocbc-generate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<OCBC />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/ocbc')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- OCBC`
Expected: 4 failures — `Cannot find module './OCBC'`

---

### Task 2: Create OCBC page component

**Files:**
- Create: `src/pages/OCBC.jsx`
- Delete: `src/pages/NCSB.jsx` (after OCBC.jsx is created and tests pass)

- [ ] **Step 1: Create `src/pages/OCBC.jsx`**

```jsx
const features = [
  {
    icon: '⚡',
    title: 'Zero configuration',
    description:
      'Downloads source OSCAL profiles directly from NIST and GSA FedRAMP automation repos. No local data files to maintain.',
  },
  {
    icon: '🔬',
    title: 'Enriched output',
    description:
      'Every control gets severity (LOW / MEDIUM / HIGH / CRITICAL) and non_negotiable (boolean) fields derived from configurable rules.',
  },
  {
    icon: '🔄',
    title: 'CI-ready',
    description:
      'Ships with a GitHub Actions workflow that regenerates the baseline daily and commits the result automatically.',
  },
]

export default function OCBC() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          📋 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          OCBC
        </h1>
        <p className="text-accent-cyan text-lg">
          Open Controls Baseline Catalog — Enriched SP 800-53 Rev. 5 in machine-readable JSON
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          Merges the full NIST SP 800-53 Rev. 5 control catalog with SP 800-53B baseline
          profiles and FedRAMP OSCAL baselines into a single enriched JSON file — ready
          for policy engines, compliance dashboards, IaC scanners, and cloud-provider mapping tools.
        </p>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary">Key features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-surface border border-subtle rounded-xl p-6 flex flex-col gap-3"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="text-text-primary font-semibold">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-text-primary">Quick start</h2>
        <div className="bg-surface border border-subtle rounded-xl p-6 font-mono text-sm flex flex-col gap-3">
          <div>
            <span className="text-text-muted"># Install</span>
            <p className="text-accent-cyan mt-1">pip install ocbc</p>
          </div>
          <div>
            <span className="text-text-muted"># Generate enriched baseline JSON</span>
            <p className="text-accent-cyan mt-1">ocbc-generate --out baseline.json</p>
          </div>
          <div>
            <span className="text-text-muted"># Or run without installing</span>
            <p className="text-accent-cyan mt-1">python -m src.ocbc.generate --out baseline.json</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/ocbc"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          View on GitHub ↗
        </a>
      </section>

    </div>
  )
}
```

- [ ] **Step 2: Run OCBC tests to verify they pass**

Run: `npm test -- OCBC`
Expected: 4 passing

- [ ] **Step 3: Delete the old NCSB files**

```bash
rm src/pages/NCSB.jsx src/pages/NCSB.test.jsx
```

- [ ] **Step 4: Verify full test suite still passes**

Run: `npm test`
Expected: all tests pass except Navbar/Footer/Home (NCSB refs not yet updated — that's fine, next task)

---

### Task 3: Update Navbar for OCBC

**Files:**
- Modify: `src/components/Navbar.test.jsx`
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Update Navbar test — replace NCSB assertion, add OCBC**

In `src/components/Navbar.test.jsx`, replace the `it('renders navigation links'` block:

```jsx
it('renders navigation links', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /controlgate/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /ocbc/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run Navbar tests to verify the OCBC assertion fails**

Run: `npm test -- Navbar`
Expected: `renders navigation links` fails — no link matching `/ocbc/i`

- [ ] **Step 3: Update `src/components/Navbar.jsx` — replace NCSB link with OCBC**

Replace:
```jsx
<NavLink to="/ncsb" className={linkClass}>NCSB</NavLink>
```
With:
```jsx
<NavLink to="/ocbc" className={linkClass}>OCBC</NavLink>
```

- [ ] **Step 4: Run Navbar tests to verify they pass**

Run: `npm test -- Navbar`
Expected: all passing

---

### Task 4: Update Footer for OCBC

**Files:**
- Modify: `src/components/Footer.test.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: Update Footer test — replace NCSB assertion**

In `src/components/Footer.test.jsx`, replace the `it('renders NCSB GitHub link'` block:

```jsx
it('renders OCBC GitHub link', () => {
  render(<Footer />)
  const link = screen.getByRole('link', { name: /ocbc/i })
  expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/ocbc')
})
```

- [ ] **Step 2: Run Footer tests to verify the OCBC assertion fails**

Run: `npm test -- Footer`
Expected: `renders OCBC GitHub link` fails

- [ ] **Step 3: Update `src/components/Footer.jsx` — replace NCSB link**

Replace:
```jsx
<a
  href="https://github.com/sadayamuthu/nist-cloud-security-baseline"
  target="_blank"
  rel="noreferrer"
  className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
>
  NCSB ↗
</a>
```
With:
```jsx
<a
  href="https://github.com/sadayamuthu/ocbc"
  target="_blank"
  rel="noreferrer"
  className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
>
  OCBC ↗
</a>
```

- [ ] **Step 4: Run Footer tests to verify they pass**

Run: `npm test -- Footer`
Expected: all passing

---

### Task 5: Update Home page for OCBC

**Files:**
- Modify: `src/pages/Home.test.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Update Home test — rename it block and replace NCSB assertions**

In `src/pages/Home.test.jsx`:

1. Rename `it('renders ControlGate and NCSB product cards'` → `it('renders ControlGate and OCBC product cards'`
2. Replace `expect(screen.getByText('NCSB')).toBeInTheDocument()` → `expect(screen.getByText('OCBC')).toBeInTheDocument()`
3. Inside `it('renders CTA buttons linking to product pages'`, replace:
   ```js
   expect(screen.getByRole('link', { name: /explore ncsb/i })).toHaveAttribute('href', '/ncsb')
   ```
   With:
   ```js
   expect(screen.getByRole('link', { name: /explore ocbc/i })).toHaveAttribute('href', '/ocbc')
   ```

- [ ] **Step 2: Run Home tests to verify updated assertions fail**

Run: `npm test -- Home`
Expected: failures on OCBC card and hero button assertions

- [ ] **Step 3: Update `src/pages/Home.jsx` — rename NCSB → OCBC in hero button and product card**

Replace the NCSB hero button:
```jsx
<Link
  to="/ncsb"
  className="px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
>
  Explore NCSB
</Link>
```
With:
```jsx
<Link
  to="/ocbc"
  className="px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
>
  Explore OCBC
</Link>
```

Replace the NCSB ProductCard:
```jsx
<ProductCard
  icon="📋"
  name="NCSB"
  tagline="NIST Cloud Security Baseline"
  description="Merges NIST SP 800-53 Rev. 5, SP 800-53B, and FedRAMP OSCAL baselines into a single enriched JSON file. Zero configuration. CI-ready. Feed it directly into your policy engines."
  href="/ncsb"
/>
```
With:
```jsx
<ProductCard
  icon="📋"
  name="OCBC"
  tagline="Open Controls Baseline Catalog"
  description="Merges NIST SP 800-53 Rev. 5, SP 800-53B, and FedRAMP OSCAL baselines into a single enriched JSON file. Zero configuration. CI-ready. Feed it directly into your policy engines."
  href="/ocbc"
/>
```

- [ ] **Step 4: Run Home tests to verify they pass**

Run: `npm test -- Home`
Expected: all passing

---

### Task 6: Update App.jsx routing for OCBC

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Update `src/App.jsx`**

Replace:
```jsx
import NCSB from './pages/NCSB'
```
With:
```jsx
import OCBC from './pages/OCBC'
```

Replace:
```jsx
<Route path="/ncsb" element={<NCSB />} />
```
With:
```jsx
<Route path="/ocbc" element={<OCBC />} />
```

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: all tests pass

- [ ] **Step 3: Commit**

```bash
git add -A src/
git status
git commit -m "feat: rename NCSB to OCBC site-wide"
```

`git add -A` stages modified files, new files, and deleted files (NCSB.jsx and NCSB.test.jsx). Verify with `git status` that both NCSB files show as `deleted` and OCBC files show as `new file` before committing.

---

## Chunk 2: Add ExposureGate

---

### Task 7: Write ExposureGate page test

**Files:**
- Create: `src/pages/ExposureGate.test.jsx`

- [ ] **Step 1: Create `src/pages/ExposureGate.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import ExposureGate from './ExposureGate'

describe('ExposureGate page', () => {
  it('renders the product name', () => {
    render(<ExposureGate />)
    expect(screen.getByRole('heading', { name: /exposuregate/i })).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<ExposureGate />)
    expect(screen.getByText(/exposure gates scan the diff/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<ExposureGate />)
    expect(screen.getByText(/exposuregate scan/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<ExposureGate />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/exposuregate')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- ExposureGate`
Expected: 4 failures — `Cannot find module './ExposureGate'`

---

### Task 8: Create ExposureGate page component

**Files:**
- Create: `src/pages/ExposureGate.jsx`

- [ ] **Step 1: Create `src/pages/ExposureGate.jsx`**

```jsx
const steps = [
  { icon: '✍️', label: 'Developer writes code' },
  { icon: '🔍', label: 'Exposure gates scan the diff' },
  { icon: '✅', label: 'BLOCK 🚫 / WARN ⚠️ / PASS ✅' },
]

const gates = [
  'CVE detection', 'Secrets exposure', 'Dependency vulnerabilities',
  'Container image scanning', 'SBOM analysis', 'Exposed endpoints',
  'Misconfiguration detection', 'License risk',
]

export default function ExposureGate() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          🔍 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          ExposureGate
        </h1>
        <p className="text-accent-cyan text-lg">
          CVE & Exposure Scanning — Pre-Commit & Pre-Merge Exposure Gate
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          An AI-powered gate that scans code changes against known CVEs, exposed secrets,
          and vulnerability patterns before every commit and merge. Maps findings to CVE IDs —
          providing traceable exposure evidence and actionable remediation.
        </p>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary">How it works</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="bg-surface border border-subtle rounded-xl px-6 py-4 text-center flex-1 min-w-[160px]">
                <div className="text-2xl mb-2">{step.icon}</div>
                <p className="text-text-muted text-sm">{step.label}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="text-subtle text-xl hidden sm:block">→</span>
              )}
            </div>
          ))}
        </div>
        <div className="bg-surface border border-subtle rounded-xl p-6">
          <p className="text-text-muted text-sm mb-3">Exposure gates include:</p>
          <div className="flex flex-wrap gap-2">
            {gates.map((gate) => (
              <span
                key={gate}
                className="px-3 py-1 rounded-full border border-subtle text-text-muted text-xs"
              >
                {gate}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full border border-subtle text-text-muted text-xs">
              + more
            </span>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-text-primary">Quick start</h2>
        <div className="bg-surface border border-subtle rounded-xl p-6 font-mono text-sm flex flex-col gap-3">
          <div>
            <span className="text-text-muted"># Install</span>
            <p className="text-accent-cyan mt-1">pip install exposuregate</p>
          </div>
          <div>
            <span className="text-text-muted"># Bootstrap your project</span>
            <p className="text-accent-cyan mt-1">exposuregate init</p>
          </div>
          <div>
            <span className="text-text-muted"># Scan staged changes</span>
            <p className="text-accent-cyan mt-1">exposuregate scan --mode pre-commit</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/exposuregate"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          View on GitHub ↗
        </a>
      </section>

    </div>
  )
}
```

- [ ] **Step 2: Run ExposureGate tests to verify they pass**

Run: `npm test -- ExposureGate`
Expected: 4 passing

---

### Task 9: Wire ExposureGate into App, Navbar, Footer, Home

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Navbar.test.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Footer.test.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.test.jsx`

- [ ] **Step 1: Add ExposureGate tests to Navbar.test.jsx**

Add after the `it('renders anySQL nav link'` block:

```jsx
it('renders ExposureGate nav link', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /exposuregate/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Add ExposureGate test to Footer.test.jsx**

Add after the `it('renders anySQL footer link'` block:

```jsx
it('renders ExposureGate footer link', () => {
  render(<Footer />)
  const link = screen.getByRole('link', { name: /exposuregate/i })
  expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/exposuregate')
})
```

- [ ] **Step 3: Add ExposureGate tests to Home.test.jsx**

Add after the `it('renders Explore anySQL hero button'` block:

```jsx
it('renders ExposureGate product card', () => {
  renderHome()
  expect(screen.getByText('ExposureGate')).toBeInTheDocument()
})

it('renders Explore ExposureGate hero button', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /explore exposuregate/i })).toHaveAttribute('href', '/exposuregate')
})
```

- [ ] **Step 4: Run tests to verify new ExposureGate assertions fail**

Run: `npm test -- Navbar ; npm test -- Footer ; npm test -- Home`
Expected: new ExposureGate assertions fail in each suite

- [ ] **Step 5: Add ExposureGate to `src/App.jsx`**

Add import:
```jsx
import ExposureGate from './pages/ExposureGate'
```

Add route (after the `/anysql` route):
```jsx
<Route path="/exposuregate" element={<ExposureGate />} />
```

- [ ] **Step 6: Add ExposureGate link to `src/components/Navbar.jsx`**

Add after the anySQL NavLink:
```jsx
<NavLink to="/exposuregate" className={linkClass}>ExposureGate</NavLink>
```

- [ ] **Step 7: Add ExposureGate link to `src/components/Footer.jsx`**

Add after the anySQL link:
```jsx
<a
  href="https://github.com/sadayamuthu/exposuregate"
  target="_blank"
  rel="noreferrer"
  className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
>
  ExposureGate ↗
</a>
```

- [ ] **Step 8: Add ExposureGate to `src/pages/Home.jsx`**

Add hero button (after the anySQL button):
```jsx
<Link
  to="/exposuregate"
  className="px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
>
  Explore ExposureGate
</Link>
```

Add ProductCard (after the anySQL card):
```jsx
<ProductCard
  icon="🔍"
  name="ExposureGate"
  tagline="CVE & Exposure Scanning Gate"
  description="An AI-powered pre-commit and pre-merge exposure gate. Scans your code changes against known CVEs, vulnerability patterns, and exposure risks — before every commit."
  href="/exposuregate"
/>
```

Also update the products grid class from `lg:grid-cols-4` to `lg:grid-cols-3`:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

- [ ] **Step 9: Run all tests to verify they pass**

Run: `npm test`
Expected: all tests pass

- [ ] **Step 10: Commit**

```bash
git add src/pages/ExposureGate.jsx src/pages/ExposureGate.test.jsx \
  src/App.jsx \
  src/components/Navbar.jsx src/components/Navbar.test.jsx \
  src/components/Footer.jsx src/components/Footer.test.jsx \
  src/pages/Home.jsx src/pages/Home.test.jsx
git commit -m "feat: add ExposureGate product page and navigation"
```

---

## Chunk 3: Add OEBC

---

### Task 10: Write OEBC page test

**Files:**
- Create: `src/pages/OEBC.test.jsx`

- [ ] **Step 1: Create `src/pages/OEBC.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import OEBC from './OEBC'

describe('OEBC page', () => {
  it('renders the product name', () => {
    render(<OEBC />)
    expect(screen.getByRole('heading', { name: /oebc/i })).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<OEBC />)
    expect(screen.getByText(/zero configuration/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<OEBC />)
    expect(screen.getByText(/oebc-generate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<OEBC />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/oebc')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- OEBC`
Expected: 4 failures — `Cannot find module './OEBC'`

---

### Task 11: Create OEBC page component

**Files:**
- Create: `src/pages/OEBC.jsx`

- [ ] **Step 1: Create `src/pages/OEBC.jsx`**

```jsx
const features = [
  {
    icon: '⚡',
    title: 'Zero configuration',
    description:
      'Downloads from NVD, OSV, and GitHub Advisory. No local data files to maintain.',
  },
  {
    icon: '🔬',
    title: 'Enriched output',
    description:
      'Every CVE gets severity (LOW / MEDIUM / HIGH / CRITICAL) and exploitability fields derived from configurable rules.',
  },
  {
    icon: '🔄',
    title: 'CI-ready',
    description:
      'Ships with a GitHub Actions workflow that regenerates the baseline daily and commits the result automatically.',
  },
]

export default function OEBC() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          📊 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          OEBC
        </h1>
        <p className="text-accent-cyan text-lg">
          Open Exposure Baseline Catalog — Enriched CVE & Vulnerability Data in machine-readable JSON
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          Merges NVD, OSV, and GitHub Advisory data into a single enriched JSON file —
          ready for exposure gates, vulnerability dashboards, IaC scanners, and
          dependency analysis tools.
        </p>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary">Key features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-surface border border-subtle rounded-xl p-6 flex flex-col gap-3"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="text-text-primary font-semibold">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-text-primary">Quick start</h2>
        <div className="bg-surface border border-subtle rounded-xl p-6 font-mono text-sm flex flex-col gap-3">
          <div>
            <span className="text-text-muted"># Install</span>
            <p className="text-accent-cyan mt-1">pip install oebc</p>
          </div>
          <div>
            <span className="text-text-muted"># Generate enriched exposure baseline JSON</span>
            <p className="text-accent-cyan mt-1">oebc-generate --out exposure-baseline.json</p>
          </div>
          <div>
            <span className="text-text-muted"># Or run without installing</span>
            <p className="text-accent-cyan mt-1">python -m src.oebc.generate --out exposure-baseline.json</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/oebc"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          View on GitHub ↗
        </a>
      </section>

    </div>
  )
}
```

- [ ] **Step 2: Run OEBC tests to verify they pass**

Run: `npm test -- OEBC`
Expected: 4 passing

---

### Task 12: Wire OEBC into App, Navbar, Footer, Home

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Navbar.test.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Footer.test.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.test.jsx`

- [ ] **Step 1: Add OEBC tests to Navbar.test.jsx**

Add after the ExposureGate nav link test:

```jsx
it('renders OEBC nav link', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /oebc/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Add OEBC test to Footer.test.jsx**

Add after the ExposureGate footer link test:

```jsx
it('renders OEBC footer link', () => {
  render(<Footer />)
  const link = screen.getByRole('link', { name: /oebc/i })
  expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/oebc')
})
```

- [ ] **Step 3: Add OEBC tests to Home.test.jsx**

Add after the ExposureGate tests:

```jsx
it('renders OEBC product card', () => {
  renderHome()
  expect(screen.getByText('OEBC')).toBeInTheDocument()
})

it('renders Explore OEBC hero button', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /explore oebc/i })).toHaveAttribute('href', '/oebc')
})
```

- [ ] **Step 4: Run tests to verify new OEBC assertions fail**

Run: `npm test -- Navbar ; npm test -- Footer ; npm test -- Home`
Expected: new OEBC assertions fail in each suite

- [ ] **Step 5: Add OEBC to `src/App.jsx`**

Add import:
```jsx
import OEBC from './pages/OEBC'
```

Add route (after the `/exposuregate` route):
```jsx
<Route path="/oebc" element={<OEBC />} />
```

- [ ] **Step 6: Add OEBC link to `src/components/Navbar.jsx`**

Add after the ExposureGate NavLink:
```jsx
<NavLink to="/oebc" className={linkClass}>OEBC</NavLink>
```

- [ ] **Step 7: Add OEBC link to `src/components/Footer.jsx`**

Add after the ExposureGate link:
```jsx
<a
  href="https://github.com/sadayamuthu/oebc"
  target="_blank"
  rel="noreferrer"
  className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
>
  OEBC ↗
</a>
```

- [ ] **Step 8: Add OEBC to `src/pages/Home.jsx`**

Add hero button (after the ExposureGate button):
```jsx
<Link
  to="/oebc"
  className="px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
>
  Explore OEBC
</Link>
```

Add ProductCard (after the ExposureGate card):
```jsx
<ProductCard
  icon="📊"
  name="OEBC"
  tagline="Open Exposure Baseline Catalog"
  description="Merges NVD, OSV, and GitHub Advisory data into a single enriched JSON file. Zero configuration. CI-ready. Feed it directly into your exposure gates."
  href="/oebc"
/>
```

- [ ] **Step 9: Run full test suite**

Run: `npm test`
Expected: all tests pass

- [ ] **Step 10: Commit**

```bash
git add src/pages/OEBC.jsx src/pages/OEBC.test.jsx \
  src/App.jsx \
  src/components/Navbar.jsx src/components/Navbar.test.jsx \
  src/components/Footer.jsx src/components/Footer.test.jsx \
  src/pages/Home.jsx src/pages/Home.test.jsx
git commit -m "feat: add OEBC product page and navigation"
```
