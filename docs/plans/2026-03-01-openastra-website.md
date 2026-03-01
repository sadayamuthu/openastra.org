# OpenAstra Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimalistic multi-page React website for openastra.com showcasing ControlGate and NCSB as products.

**Architecture:** Vite + React SPA with React Router for client-side routing across 3 pages (Home, ControlGate, NCSB). Tailwind CSS with a custom dark space theme. Pure presentational components — no state management.

**Tech Stack:** Node.js 18+, Vite 5, React 18, React Router 6, Tailwind CSS 3, Vitest, @testing-library/react

---

## Reference

**Design doc:** `docs/plans/2026-03-01-openastra-website-design.md`

**Color tokens (use these Tailwind class names after config):**
- `bg-space` → `#050A14`
- `bg-surface` → `#0D1424`
- `border-subtle` → `#1E2D4A`
- `text-primary` → `#F0F6FF`
- `text-muted` → `#7A90B0`
- `accent-blue` → `#4F8EF7`
- `accent-cyan` → `#00D4FF`

**GitHub URLs:**
- ControlGate: `https://github.com/sadayamuthu/controlgate`
- NCSB: `https://github.com/sadayamuthu/nist-cloud-security-baseline`

---

### Task 1: Scaffold Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

**Step 1: Initialize project**

Run from `/Users/karthik/git/openastra.com`:
```bash
npm create vite@latest . -- --template react
```
When prompted "Current directory is not empty", select **Ignore files and continue**.

**Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npx tailwindcss init -p
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: Server running at `http://localhost:5173`. Open in browser — see default Vite/React page. Stop with Ctrl+C.

**Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.jsx src/App.jsx src/App.css src/index.css tailwind.config.js postcss.config.js public/vite.svg src/assets/react.svg
git commit -m "feat: scaffold vite + react + tailwind project"
```

---

### Task 2: Configure Tailwind with custom colors and add test setup

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`

**Step 1: Replace `tailwind.config.js` entirely**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: '#050A14',
        surface: '#0D1424',
        subtle: '#1E2D4A',
        'accent-blue': '#4F8EF7',
        'accent-cyan': '#00D4FF',
        'text-primary': '#F0F6FF',
        'text-muted': '#7A90B0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 2: Replace `src/index.css` entirely**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-space text-text-primary font-sans;
  }
}

@layer utilities {
  .glow-cyan {
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }
  .glow-blue {
    box-shadow: 0 0 20px rgba(79, 142, 247, 0.3);
  }
}
```

**Step 3: Update `vite.config.js` to add Vitest config**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

**Step 4: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom'
```

**Step 5: Add test script to `package.json`**

In `package.json`, add to the `"scripts"` section:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

**Step 6: Run tests to verify setup (no tests yet, should pass with 0 tests)**

```bash
npm test -- --run
```
Expected: `No test files found` or `0 tests passed`.

**Step 7: Commit**

```bash
git add tailwind.config.js src/index.css vite.config.js src/test/setup.js package.json package-lock.json
git commit -m "feat: configure tailwind custom theme and vitest"
```

---

### Task 3: Build Navbar component

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Navbar.test.jsx`

**Step 1: Write the failing test — `src/components/Navbar.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {
  const renderNavbar = () =>
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

  it('renders the OpenAstra logo', () => {
    renderNavbar()
    expect(screen.getByText('OpenAstra')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /controlgate/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ncsb/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --run
```
Expected: FAIL — `Cannot find module './Navbar'`

**Step 3: Create `src/components/Navbar.jsx`**

```jsx
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm transition-colors duration-200 ${
      isActive ? 'text-accent-cyan' : 'text-text-muted hover:text-text-primary'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-subtle">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg">
          <span className="text-accent-cyan">✦</span>
          <span>OpenAstra</span>
        </Link>
        <div className="flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/controlgate" className={linkClass}>ControlGate</NavLink>
          <NavLink to="/ncsb" className={linkClass}>NCSB</NavLink>
          <a
            href="https://github.com/sadayamuthu"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </nav>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --run
```
Expected: PASS — 2 tests passed

**Step 5: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.test.jsx
git commit -m "feat: add Navbar component with sticky nav and active links"
```

---

### Task 4: Build Footer component

**Files:**
- Create: `src/components/Footer.jsx`
- Create: `src/components/Footer.test.jsx`

**Step 1: Write the failing test — `src/components/Footer.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/OpenAstra/i)).toBeInTheDocument()
  })

  it('renders ControlGate GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /controlgate/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/controlgate')
  })

  it('renders NCSB GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /ncsb/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/nist-cloud-security-baseline')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --run
```
Expected: FAIL — `Cannot find module './Footer'`

**Step 3: Create `src/components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-surface mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">
          © {new Date().getFullYear()} OpenAstra. Open source, MIT licensed.
        </p>
        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://github.com/sadayamuthu/controlgate"
            target="_blank"
            rel="noreferrer"
            className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
          >
            ControlGate ↗
          </a>
          <a
            href="https://github.com/sadayamuthu/nist-cloud-security-baseline"
            target="_blank"
            rel="noreferrer"
            className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
          >
            NCSB ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --run
```
Expected: PASS — all tests pass

**Step 5: Commit**

```bash
git add src/components/Footer.jsx src/components/Footer.test.jsx
git commit -m "feat: add Footer component with GitHub links"
```

---

### Task 5: Build ProductCard component

**Files:**
- Create: `src/components/ProductCard.jsx`
- Create: `src/components/ProductCard.test.jsx`

**Step 1: Write the failing test — `src/components/ProductCard.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

const props = {
  icon: '🛡️',
  name: 'ControlGate',
  tagline: 'NIST compliance gate',
  description: 'Scan code against NIST controls.',
  href: '/controlgate',
}

describe('ProductCard', () => {
  const renderCard = () =>
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    )

  it('renders product name', () => {
    renderCard()
    expect(screen.getByText('ControlGate')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    renderCard()
    expect(screen.getByText('NIST compliance gate')).toBeInTheDocument()
  })

  it('renders a Learn more link pointing to href', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /learn more/i })
    expect(link).toHaveAttribute('href', '/controlgate')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --run
```
Expected: FAIL — `Cannot find module './ProductCard'`

**Step 3: Create `src/components/ProductCard.jsx`**

```jsx
import { Link } from 'react-router-dom'

export default function ProductCard({ icon, name, tagline, description, href }) {
  return (
    <div className="bg-surface border border-subtle rounded-2xl p-8 flex flex-col gap-4 hover:border-accent-blue transition-colors duration-300">
      <div className="text-4xl">{icon}</div>
      <div>
        <h3 className="text-text-primary font-semibold text-xl">{name}</h3>
        <p className="text-accent-cyan text-sm mt-1">{tagline}</p>
      </div>
      <p className="text-text-muted text-sm leading-relaxed flex-1">{description}</p>
      <Link
        to={href}
        className="text-accent-blue text-sm font-medium hover:text-accent-cyan transition-colors duration-200"
      >
        Learn more →
      </Link>
    </div>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --run
```
Expected: PASS — all tests pass

**Step 5: Commit**

```bash
git add src/components/ProductCard.jsx src/components/ProductCard.test.jsx
git commit -m "feat: add reusable ProductCard component"
```

---

### Task 6: Set up App.jsx with React Router

**Files:**
- Modify: `src/App.jsx`
- Delete: `src/App.css` (no longer needed)

**Step 1: Replace `src/App.jsx` entirely**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ControlGate from './pages/ControlGate'
import NCSB from './pages/NCSB'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/controlgate" element={<ControlGate />} />
            <Route path="/ncsb" element={<NCSB />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
```

**Step 2: Delete the unused CSS file**

```bash
rm src/App.css
```

**Step 3: Note — pages don't exist yet**

The app will fail to run until Task 7-9 create the page components. That is expected.

**Step 4: Commit**

```bash
git add src/App.jsx
git rm src/App.css
git commit -m "feat: set up React Router with Navbar/Footer layout"
```

---

### Task 7: Build Home page

**Files:**
- Create: `src/pages/Home.jsx`
- Create: `src/pages/Home.test.jsx`

**Step 1: Write the failing test — `src/pages/Home.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home page', () => {
  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

  it('renders the hero headline', () => {
    renderHome()
    expect(screen.getByText(/The North Star for Autonomous Systems/i)).toBeInTheDocument()
  })

  it('renders both product cards', () => {
    renderHome()
    expect(screen.getByText('ControlGate')).toBeInTheDocument()
    expect(screen.getByText('NCSB')).toBeInTheDocument()
  })

  it('renders CTA buttons linking to product pages', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore controlgate/i })).toHaveAttribute('href', '/controlgate')
    expect(screen.getByRole('link', { name: /explore ncsb/i })).toHaveAttribute('href', '/ncsb')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --run
```
Expected: FAIL — `Cannot find module './Home'`

**Step 3: Create `src/pages/Home.jsx`**

```jsx
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col gap-32">

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-subtle text-text-muted text-xs tracking-widest uppercase">
          <span className="text-accent-cyan">✦</span> Open Source Security Tools
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-text-primary leading-tight max-w-3xl">
          The North Star for{' '}
          <span className="text-accent-cyan">Autonomous Systems</span>
        </h1>
        <p className="text-text-muted text-lg max-w-xl leading-relaxed">
          OpenAstra builds open source tools that bring NIST-grade security compliance
          into every developer's workflow — automatically, at commit time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/controlgate"
            className="px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
          >
            Explore ControlGate
          </Link>
          <Link
            to="/ncsb"
            className="px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
          >
            Explore NCSB
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary text-center">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProductCard
            icon="🛡️"
            name="ControlGate"
            tagline="NIST RMF & FedRAMP Compliance Gate"
            description="An AI-powered pre-commit and pre-merge security gate. Scans your code changes against 370 non-negotiable NIST SP 800-53 Rev. 5 controls across 18 security gates — before every commit."
            href="/controlgate"
          />
          <ProductCard
            icon="📋"
            name="NCSB"
            tagline="NIST Cloud Security Baseline"
            description="Merges NIST SP 800-53 Rev. 5, SP 800-53B, and FedRAMP OSCAL baselines into a single enriched JSON file. Zero configuration. CI-ready. Feed it directly into your policy engines."
            href="/ncsb"
          />
        </div>
      </section>

      {/* About */}
      <section className="flex flex-col items-center text-center gap-4 pb-8">
        <h2 className="text-2xl font-semibold text-text-primary">About OpenAstra</h2>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          OpenAstra is a research services company focused on autonomous systems security.
          We build open source tools that make NIST compliance traceable, automated, and
          accessible to every engineering team — from solo developers to enterprise cloud teams.
        </p>
      </section>

    </div>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- --run
```
Expected: PASS — all tests pass

**Step 5: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.test.jsx
git commit -m "feat: build Home page with hero, product cards, and about section"
```

---

### Task 8: Build ControlGate page

**Files:**
- Create: `src/pages/ControlGate.jsx`
- Create: `src/pages/ControlGate.test.jsx`

**Step 1: Write the failing test — `src/pages/ControlGate.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import ControlGate from './ControlGate'

describe('ControlGate page', () => {
  it('renders the product name', () => {
    render(<ControlGate />)
    expect(screen.getByRole('heading', { name: /controlgate/i })).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<ControlGate />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<ControlGate />)
    expect(screen.getByText(/pip install controlgate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<ControlGate />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/controlgate')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --run
```
Expected: FAIL — `Cannot find module './ControlGate'`

**Step 3: Create `src/pages/ControlGate.jsx`**

```jsx
const steps = [
  { icon: '✍️', label: 'Developer writes code' },
  { icon: '🔍', label: '18 security gates scan the diff' },
  { icon: '✅', label: 'BLOCK 🚫 / WARN ⚠️ / PASS ✅' },
]

const gates = [
  'Secrets detection', 'Cryptography validation', 'IAM policy checks',
  'Supply chain verification', 'Infrastructure-as-code analysis',
  'SBOM generation', 'Audit logging', 'Input validation',
]

export default function ControlGate() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          🛡️ Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          ControlGate
        </h1>
        <p className="text-accent-cyan text-lg">
          NIST RMF & FedRAMP Cloud Security Hardening — Pre-Commit & Pre-Merge Compliance Gate
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          An AI-powered agent skill that scans your code changes against NIST SP 800-53 Rev. 5
          and FedRAMP before every commit and merge. Maps findings directly to specific NIST
          control IDs — providing traceable compliance evidence and actionable remediation.
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
          <p className="text-text-muted text-sm mb-3">Security gates include:</p>
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
              + 10 more
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
            <p className="text-accent-cyan mt-1">pip install controlgate</p>
          </div>
          <div>
            <span className="text-text-muted"># Bootstrap your project</span>
            <p className="text-accent-cyan mt-1">controlgate init</p>
          </div>
          <div>
            <span className="text-text-muted"># Scan staged changes</span>
            <p className="text-accent-cyan mt-1">controlgate scan --mode pre-commit --format markdown</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/controlgate"
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

**Step 4: Run test to verify it passes**

```bash
npm test -- --run
```
Expected: PASS — all tests pass

**Step 5: Commit**

```bash
git add src/pages/ControlGate.jsx src/pages/ControlGate.test.jsx
git commit -m "feat: build ControlGate product page"
```

---

### Task 9: Build NCSB page

**Files:**
- Create: `src/pages/NCSB.jsx`
- Create: `src/pages/NCSB.test.jsx`

**Step 1: Write the failing test — `src/pages/NCSB.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import NCSB from './NCSB'

describe('NCSB page', () => {
  it('renders the product name', () => {
    render(<NCSB />)
    expect(screen.getByRole('heading', { name: /ncsb/i })).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<NCSB />)
    expect(screen.getByText(/zero configuration/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<NCSB />)
    expect(screen.getByText(/ncsb-generate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<NCSB />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/nist-cloud-security-baseline')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- --run
```
Expected: FAIL — `Cannot find module './NCSB'`

**Step 3: Create `src/pages/NCSB.jsx`**

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

export default function NCSB() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          📋 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          NCSB
        </h1>
        <p className="text-accent-cyan text-lg">
          NIST Cloud Security Baseline — Enriched SP 800-53 Rev. 5 in machine-readable JSON
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
            <p className="text-accent-cyan mt-1">pip install ncsb</p>
          </div>
          <div>
            <span className="text-text-muted"># Generate enriched baseline JSON</span>
            <p className="text-accent-cyan mt-1">ncsb-generate --out baseline.json</p>
          </div>
          <div>
            <span className="text-text-muted"># Or run without installing</span>
            <p className="text-accent-cyan mt-1">python -m src.ncsb.generate --out baseline.json</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/nist-cloud-security-baseline"
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

**Step 4: Run test to verify it passes**

```bash
npm test -- --run
```
Expected: PASS — all tests pass

**Step 5: Commit**

```bash
git add src/pages/NCSB.jsx src/pages/NCSB.test.jsx
git commit -m "feat: build NCSB product page"
```

---

### Task 10: Final polish — update index.html meta tags and verify full site

**Files:**
- Modify: `index.html`
- Delete: `public/vite.svg`, `src/assets/react.svg`

**Step 1: Replace `index.html` entirely**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="OpenAstra — The North Star for Autonomous Systems. Open source NIST security tools: ControlGate and NCSB." />
    <meta property="og:title" content="OpenAstra" />
    <meta property="og:description" content="The North Star for Autonomous Systems" />
    <meta property="og:type" content="website" />
    <title>OpenAstra — The North Star for Autonomous Systems</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 2: Remove unused default assets**

```bash
rm public/vite.svg src/assets/react.svg
```

**Step 3: Run all tests one final time**

```bash
npm test -- --run
```
Expected: PASS — all tests pass (Navbar, Footer, ProductCard, Home, ControlGate, NCSB)

**Step 4: Start dev server and manually verify all 3 pages**

```bash
npm run dev
```

Open `http://localhost:5173` — verify:
- [ ] Home page hero, two product cards, about section render
- [ ] Navbar links navigate to `/controlgate` and `/ncsb`
- [ ] ControlGate page shows install snippet and GitHub link
- [ ] NCSB page shows 3 feature cards and GitHub link
- [ ] Footer GitHub links present on all pages
- [ ] Site looks good on mobile (resize browser)

**Step 5: Build for production**

```bash
npm run build
```
Expected: `dist/` folder created with no errors.

**Step 6: Final commit**

```bash
git add index.html
git rm public/vite.svg src/assets/react.svg
git commit -m "feat: finalize meta tags, remove default assets — site complete"
```

---

## Summary

| Task | Component | Tests |
|---|---|---|
| 1 | Project scaffold | — |
| 2 | Tailwind config + Vitest | — |
| 3 | Navbar | 2 tests |
| 4 | Footer | 3 tests |
| 5 | ProductCard | 3 tests |
| 6 | App.jsx + Router | — |
| 7 | Home page | 3 tests |
| 8 | ControlGate page | 4 tests |
| 9 | NCSB page | 4 tests |
| 10 | Polish + verify | all pass |

**Total: 19 tests across 5 components/pages**
