import { Link } from 'react-router-dom'
import Citation from '../components/Citation'
import { ComingSoon, Eyebrow, Pill } from '../components/ui'
import { agenda, citedFrameworks, frameworksByCategory } from '../data/frameworks'

export default function Research() {
  const total = citedFrameworks().length
  const groups = frameworksByCategory()
    .map((g) => ({ ...g, frameworks: g.frameworks.filter((f) => f.zenodo) }))
    .filter((g) => g.frameworks.length > 0)

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-14">
      <Eyebrow>Research</Eyebrow>
      <h1 className="font-serif text-5xl mt-3">Research</h1>
      <p className="text-ink-muted mt-4 max-w-2xl leading-relaxed">
        All eight frameworks are archived on Zenodo with a permanent DOI. Cite the software today;
        white papers and patents are on the way.
      </p>
      <nav className="flex flex-wrap gap-2 mt-6" aria-label="Research sections">
        <a href="#citations"><Pill active>Citations</Pill></a>
        <a href="#agenda"><Pill>Agenda</Pill></a>
        <a href="#white-papers"><Pill soon>White papers · soon</Pill></a>
        <a href="#patents"><Pill soon>Patents · soon</Pill></a>
      </nav>

      <section id="citations" className="mt-12 pt-6 border-t-2 border-ink">
        <h2 className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted">Zenodo citations · {total}</h2>
        {groups.map((g) => (
          <div key={g.category.id} className="mt-8">
            <h3 className="font-serif italic text-2xl mb-2">{g.category.numeral}. {g.category.name}</h3>
            <ul>
              {g.frameworks.map((f) => (
                <li key={f.slug} className="py-5 border-b border-rule grid grid-cols-1 md:grid-cols-[8rem_1fr] gap-2 md:gap-6">
                  <Link to={`/${f.slug}`} className="font-medium hover:text-rust">{f.name} →</Link>
                  <Citation framework={f} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-xs text-ink-muted mt-4">
          DOIs resolve to the latest version of each record. Copy gives an APA-style reference; BibTeX gives an @software entry.
        </p>
      </section>

      <section id="agenda" aria-label="Research agenda" className="mt-14 pt-6 border-t-2 border-ink scroll-mt-24">
        <h2 className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted">Research agenda · 10 areas</h2>
        <h3 className="font-serif text-3xl mt-3">Where we work, and where we're going next.</h3>
        <p className="text-ink-muted mt-2 max-w-2xl">
          Six areas have projects today. Four are open: we're researching them, and there's nothing to ship yet.
        </p>
        <ol className="mt-6">
          {agenda().map((a) => {
            const open = a.shipped.length === 0 && a.lab.length === 0
            return (
              <li
                key={a.numeral}
                className="py-4 border-b border-rule grid grid-cols-1 md:grid-cols-[3rem_1fr_1.3fr_auto] gap-1 md:gap-4 items-baseline"
              >
                <span className="font-serif italic text-ink-muted">{a.numeral}</span>
                <span className="font-medium">{a.name}</span>
                <span className="text-sm text-ink-muted">{a.topics}</span>
                <span className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {open && (
                    <span className="px-2 py-0.5 rounded-full border border-dashed border-ink/30 text-xs text-ink-muted">Open area</span>
                  )}
                  {a.shipped.map((f) => (
                    <Link key={f.slug} to={`/${f.slug}`} className="text-rust hover:text-ink">{f.name}</Link>
                  ))}
                  {a.lab.map((p) =>
                    p.to ? (
                      <Link key={p.name} to={p.to} className="text-rust border-b border-dashed border-rust/50 hover:text-ink">{p.name} (lab)</Link>
                    ) : (
                      <span key={p.name} className="text-ink-muted">{p.name} (lab)</span>
                    )
                  )}
                </span>
              </li>
            )
          })}
        </ol>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-14">
        <div id="white-papers"><ComingSoon label="White papers">Technical write-ups for each framework.</ComingSoon></div>
        <div id="patents"><ComingSoon label="Patents">Filings will be listed here as they publish.</ComingSoon></div>
      </div>
    </div>
  )
}
