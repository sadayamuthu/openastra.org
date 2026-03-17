# anySQL Tab + Project Updates Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add anySQL as a fully integrated product (navbar tab, dedicated page, home card + CTA, footer link) and update OpenGPL to reflect the new name "Governance Policy Language" and add its website link.

**Architecture:** All changes follow the existing ControlGate/OpenGPL pattern — a JSX page component + corresponding test file, with updates to Navbar, App.jsx, Home, and Footer. TDD throughout: write failing tests first, then implement.

**Tech Stack:** React, React Router, Vitest, @testing-library/react

---

### Task 1: AnySQL page — failing tests

**Files:**
- Create: `src/pages/AnySQL.test.jsx`

**Step 1: Write the failing tests**

```jsx
import { render, screen } from '@testing-library/react'
import AnySQL from './AnySQL'

describe('AnySQL page', () => {
  it('renders the product name', () => {
    render(<AnySQL />)
    expect(screen.getByRole('heading', { name: /anysql/i })).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<AnySQL />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<AnySQL />)
    expect(screen.getByText(/pip install anysql-sdk/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<AnySQL />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/anySQL')
  })

  it('renders Website CTA link', () => {
    render(<AnySQL />)
    const link = screen.getByRole('link', { name: /website/i })
    expect(link).toHaveAttribute('href', 'https://anysql.org')
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/AnySQL.test.jsx`
Expected: FAIL — "Cannot find module './AnySQL'"

---

### Task 2: AnySQL page — implementation

**Files:**
- Create: `src/pages/AnySQL.jsx`

**Step 1: Write the component**

```jsx
const steps = [
  { icon: '🔌', label: 'Wrap your LLM client with anySQL' },
  { icon: '📊', label: 'Auto-logs calls to 6 canonical SQL tables' },
  { icon: '🔍', label: 'Query with standard SQL or built-in analytics' },
]

export default function AnySQL() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          🗄️ Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          anySQL
        </h1>
        <p className="text-accent-cyan text-lg">
          SQL Analytics for AI Systems
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          An open-source engine that lets you query LLM responses, agent traces, and RAG
          pipelines using standard SQL. Auto-logs every AI API call into six canonical
          tables — then surfaces insights through DuckDB queries with zero configuration.
          From vibes to queries.
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
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-text-primary">Quick start</h2>
        <div className="bg-surface border border-subtle rounded-xl p-6 font-mono text-sm flex flex-col gap-3">
          <div>
            <span className="text-text-muted"># Install</span>
            <p className="text-accent-cyan mt-1">pip install anysql-sdk</p>
          </div>
          <div>
            <span className="text-text-muted"># Wrap your client and run analytics</span>
            <p className="text-accent-cyan mt-1">import anysql</p>
            <p className="text-accent-cyan">db = anysql.init()</p>
            <p className="text-accent-cyan">client = anysql.claude(anthropic_client)</p>
            <p className="text-accent-cyan">df = db.rag_failure_modes()</p>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="flex gap-4 flex-wrap">
        <a
          href="https://github.com/sadayamuthu/anySQL"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          View on GitHub ↗
        </a>
        <a
          href="https://anysql.org"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
        >
          Website ↗
        </a>
      </section>

    </div>
  )
}
```

**Step 2: Run tests to verify they pass**

Run: `npx vitest run src/pages/AnySQL.test.jsx`
Expected: PASS — 5 tests

**Step 3: Commit**

```bash
git add src/pages/AnySQL.jsx src/pages/AnySQL.test.jsx
git commit -m "feat: add AnySQL page"
```

---

### Task 3: Navbar — failing test

**Files:**
- Modify: `src/components/Navbar.test.jsx`

**Step 1: Add a failing test for the anySQL nav link**

Add this test inside the existing `describe('Navbar', ...)` block in `src/components/Navbar.test.jsx`:

```jsx
it('renders anySQL nav link', () => {
  renderNavbar()
  expect(screen.getByRole('link', { name: /anysql/i })).toBeInTheDocument()
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Navbar.test.jsx`
Expected: FAIL — "Unable to find an accessible element with the role 'link' and name matching /anysql/i"

---

### Task 4: Navbar — implementation

**Files:**
- Modify: `src/components/Navbar.jsx`

**Step 1: Add anySQL NavLink**

In `src/components/Navbar.jsx`, find the line:
```jsx
<NavLink to="/opengpl" className={linkClass}>OpenGPL</NavLink>
```
Add after it:
```jsx
<NavLink to="/anysql" className={linkClass}>anySQL</NavLink>
```

**Step 2: Run tests to verify they pass**

Run: `npx vitest run src/components/Navbar.test.jsx`
Expected: PASS — all tests

**Step 3: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.test.jsx
git commit -m "feat: add anySQL nav link"
```

---

### Task 5: App.jsx — add route (no new test needed)

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add AnySQL import and route**

Add the import at the top with the other page imports:
```jsx
import AnySQL from './pages/AnySQL'
```

Add the route inside `<Routes>`, after the OpenGPL route:
```jsx
<Route path="/anysql" element={<AnySQL />} />
```

**Step 2: Verify existing tests still pass**

Run: `npx vitest run`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add /anysql route"
```

---

### Task 6: Home page — failing tests

**Files:**
- Modify: `src/pages/Home.test.jsx`

**Step 1: Add failing tests**

Add these tests inside the existing `describe('Home page', ...)` block in `src/pages/Home.test.jsx`:

```jsx
it('renders anySQL product card', () => {
  renderHome()
  expect(screen.getByText('anySQL')).toBeInTheDocument()
})

it('renders Explore anySQL hero button', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /explore anysql/i })).toHaveAttribute('href', '/anysql')
})
```

Also update the existing OpenGPL tagline test if one exists, or add:

```jsx
it('renders OpenGPL with Governance Policy Language tagline', () => {
  renderHome()
  expect(screen.getByText(/governance policy language/i)).toBeInTheDocument()
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/Home.test.jsx`
Expected: FAIL — anySQL card and CTA not found

---

### Task 7: Home page — implementation

**Files:**
- Modify: `src/pages/Home.jsx`

**Step 1: Add anySQL hero CTA**

Find the hero CTA section. Add a new button after the "Explore OpenGPL" link:
```jsx
<Link
  to="/anysql"
  className="px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
>
  Explore anySQL
</Link>
```

**Step 2: Update OpenGPL ProductCard tagline**

Find:
```jsx
tagline="Generative Policy Language for AI Systems"
```
Change to:
```jsx
tagline="Governance Policy Language for AI Systems"
```

**Step 3: Add anySQL ProductCard**

After the OpenGPL `<ProductCard ... />`, add:
```jsx
<ProductCard
  icon="🗄️"
  name="anySQL"
  tagline="SQL Analytics for AI Systems"
  description="Query LLM responses, agent traces, and RAG pipelines using standard SQL. Auto-logs every AI API call into six canonical tables with zero configuration. From vibes to queries."
  href="/anysql"
/>
```

**Step 4: Update grid columns**

Find:
```jsx
className="grid grid-cols-1 sm:grid-cols-3 gap-6"
```
Change to:
```jsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
```

**Step 5: Run tests to verify they pass**

Run: `npx vitest run src/pages/Home.test.jsx`
Expected: PASS — all tests

**Step 6: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.test.jsx
git commit -m "feat: add anySQL to home page, update OpenGPL tagline"
```

---

### Task 8: OpenGPL page — failing tests

**Files:**
- Modify: `src/pages/OpenGPL.test.jsx`

**Step 1: Add failing tests**

Add these tests inside the existing `describe('OpenGPL page', ...)` block:

```jsx
it('renders Governance Policy Language subtitle', () => {
  render(<OpenGPL />)
  expect(screen.getByText(/governance policy language/i)).toBeInTheDocument()
})

it('renders Website CTA link', () => {
  render(<OpenGPL />)
  const link = screen.getByRole('link', { name: /website/i })
  expect(link).toHaveAttribute('href', 'https://opengpl.org')
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/OpenGPL.test.jsx`
Expected: FAIL — "Governance Policy Language" not found, website link not found

---

### Task 9: OpenGPL page — implementation

**Files:**
- Modify: `src/pages/OpenGPL.jsx`

**Step 1: Update the subtitle**

Find:
```jsx
Generative Policy Language for AI Systems
```
Change to:
```jsx
Governance Policy Language for AI Systems
```

**Step 2: Add website CTA button**

Find the CTA section:
```jsx
<section>
  <a
    href="https://github.com/sadayamuthu/opengpl"
    ...
  >
    View on GitHub ↗
  </a>
</section>
```

Replace with:
```jsx
<section className="flex gap-4 flex-wrap">
  <a
    href="https://github.com/sadayamuthu/opengpl"
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
  >
    View on GitHub ↗
  </a>
  <a
    href="https://opengpl.org"
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
  >
    Website ↗
  </a>
</section>
```

**Step 3: Run tests to verify they pass**

Run: `npx vitest run src/pages/OpenGPL.test.jsx`
Expected: PASS — all tests

**Step 4: Commit**

```bash
git add src/pages/OpenGPL.jsx src/pages/OpenGPL.test.jsx
git commit -m "feat: update OpenGPL name to Governance Policy Language, add website link"
```

---

### Task 10: Footer — failing test

**Files:**
- Modify: `src/components/Footer.test.jsx`

**Step 1: Add a failing test**

Add this test inside the existing `describe('Footer', ...)` block:

```jsx
it('renders anySQL footer link', () => {
  render(<Footer />)
  const link = screen.getByRole('link', { name: /anysql/i })
  expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/anySQL')
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Footer.test.jsx`
Expected: FAIL — "Unable to find an accessible element with the role 'link' and name matching /anysql/i"

---

### Task 11: Footer — implementation

**Files:**
- Modify: `src/components/Footer.jsx`

**Step 1: Add anySQL link**

Find the OpenGPL link block:
```jsx
<a
  href="https://github.com/sadayamuthu/opengpl"
  target="_blank"
  rel="noreferrer"
  className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
>
  OpenGPL ↗
</a>
```

Add after it:
```jsx
<a
  href="https://github.com/sadayamuthu/anySQL"
  target="_blank"
  rel="noreferrer"
  className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
>
  anySQL ↗
</a>
```

**Step 2: Run tests to verify they pass**

Run: `npx vitest run src/components/Footer.test.jsx`
Expected: PASS — all tests

**Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: All tests pass

**Step 4: Commit**

```bash
git add src/components/Footer.jsx src/components/Footer.test.jsx
git commit -m "feat: add anySQL to footer"
```

---

### Task 12: Final verification

**Step 1: Run full test suite one more time**

Run: `npx vitest run`
Expected: All tests green, zero failures

**Step 2: Start dev server and manually check**

Run: `npm run dev`

Verify:
- Navbar shows: Home | ControlGate | NCSB | OpenGPL | anySQL | GitHub
- `/anysql` renders the anySQL page with install snippet, 3-step flow, GitHub + Website CTAs
- Home page shows 4 product cards including anySQL, and "Explore anySQL" hero button
- OpenGPL page shows "Governance Policy Language" subtitle and Website button to `https://opengpl.org`
- Footer shows anySQL link
