import { Link } from 'react-router-dom'
import Citation from '../components/Citation'
import { ComingSoon, Eyebrow, Pill } from '../components/ui'
import { citedFrameworks, frameworksByCategory } from '../data/frameworks'

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
        Every framework is archived on Zenodo with a permanent DOI. Cite the software today;
        white papers and patents are on the way.
      </p>
      <nav className="flex flex-wrap gap-2 mt-6" aria-label="Research sections">
        <a href="#citations"><Pill active>Citations</Pill></a>
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
                <li key={f.slug} className="py-5 border-b border-rule grid md:grid-cols-[8rem_1fr] gap-2 md:gap-6">
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

      <div className="grid md:grid-cols-2 gap-4 mt-14">
        <div id="white-papers"><ComingSoon label="White papers">Technical write-ups for each framework.</ComingSoon></div>
        <div id="patents"><ComingSoon label="Patents">Filings will be listed here as they publish.</ComingSoon></div>
      </div>
    </div>
  )
}
