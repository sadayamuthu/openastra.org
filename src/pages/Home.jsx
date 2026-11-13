import { Link } from 'react-router-dom'
import FrameworkIndex from '../components/FrameworkIndex'
import Pipeline from '../components/Pipeline'
import Citation from '../components/Citation'
import { Button, ComingSoon, Eyebrow, Pill } from '../components/ui'
import { citedFrameworks, doiUrl, frameworks, getFramework } from '../data/frameworks'

function Section({ label, children, className = '' }) {
  const id = label.toLowerCase().replace(/\W+/g, '-')
  return (
    <section aria-labelledby={id} className={`py-10 border-t border-rule ${className}`}>
      <h2 id={id} className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-2">{label}</h2>
      {children}
    </section>
  )
}

export default function Home() {
  const cited = citedFrameworks()
  const latest = [...cited].sort((a, b) => b.zenodo.date.localeCompare(a.zenodo.date) || a.number - b.number).slice(0, 3)

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-14 sm:py-20 max-w-3xl">
        <Eyebrow>Independent research lab · Autonomous systems security</Eyebrow>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight mt-4">
          Security research for the age of <em className="text-rust">autonomous agents</em>.
        </h1>
        <p className="text-lg text-ink-muted mt-6 max-w-2xl leading-relaxed">
          Open frameworks with citable, versioned releases that make AI agents, and the code
          they write, verifiable, governable, and compliant.
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          <Pill>{frameworks.length} open frameworks</Pill>
          <Pill>{cited.length} Zenodo DOIs</Pill>
          <Pill soon>Patents coming soon</Pill>
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          <Button to="/frameworks" variant="solid">Browse frameworks</Button>
          <Button to="/research">Research &amp; citations</Button>
        </div>
      </section>

      <Section label="The index">
        <FrameworkIndex
          aside={
            <div className="bg-card border border-rule rounded-sm p-5">
              <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-3">Cite this · Featured</p>
              <Citation framework={getFramework('mergelock')} compact />
            </div>
          }
        />
      </Section>

      <Section label="Where each framework fits">
        <p className="font-serif text-2xl mb-6 max-w-2xl">Guardrails at every stage of the agent lifecycle.</p>
        <Pipeline />
      </Section>

      <Section label="Latest on Zenodo">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ul>
              {latest.map((f) => (
                <li key={f.slug} className="py-3 border-b border-rule flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <Link to={`/${f.slug}`} className="font-serif text-lg hover:text-rust">{f.zenodo.title}</Link>
                  <a href={doiUrl(f.zenodo.doi)} target="_blank" rel="noreferrer" className="font-mono text-xs text-rust underline underline-offset-2 shrink-0">
                    doi.org/{f.zenodo.doi} ↗
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/research" className="inline-block mt-4 text-sm hover:text-rust">All {cited.length} citations →</Link>
          </div>
          <div className="flex flex-col gap-4">
            <ComingSoon label="White papers" />
            <ComingSoon label="Patents" />
          </div>
        </div>
      </Section>
    </div>
  )
}
