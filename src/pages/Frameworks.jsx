import { Link, useSearchParams } from 'react-router-dom'
import { frameworksByCategory, labProjects, shippedFrameworks } from '../data/frameworks'
import { DoiTag, Eyebrow, Pill } from '../components/ui'

function Card({ fw }) {
  return (
    <Link
      to={`/${fw.slug}`}
      className="group bg-card border border-rule rounded-sm p-5 flex flex-col gap-2 hover:border-ink transition-colors"
    >
      <span className="font-mono text-xs text-ink-muted">{String(fw.number).padStart(2, '0')}</span>
      <h3 className="font-serif text-2xl group-hover:text-rust transition-colors">{fw.name}</h3>
      <p className="text-sm text-ink-muted leading-relaxed flex-1">{fw.summary}</p>
      <div className="flex gap-2 pt-1">{fw.zenodo && <DoiTag />}</div>
    </Link>
  )
}

export default function Frameworks() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('category')
  const all = frameworksByCategory()
  const active = all.some((g) => g.category.id === requested) ? requested : null
  const groups = all.filter((g) => !active || g.category.id === active)

  const select = (id) => setParams(id ? { category: id } : {}, { replace: true })

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-14">
      <Eyebrow>
        {shippedFrameworks().length} open frameworks
        {active && ` · ${groups.reduce((n, g) => n + g.frameworks.length, 0)} shown`}
      </Eyebrow>
      <div className="flex flex-wrap items-baseline justify-between gap-4 mt-3">
        <h1 className="font-serif text-5xl">Frameworks</h1>
        <Link to="/lab" className="text-sm hover:text-rust">{labProjects().length} more in the lab →</Link>
      </div>
      <div className="flex flex-wrap gap-2 mt-6" role="group" aria-label="Filter by category">
        <Pill active={!active} onClick={() => select(null)}>All</Pill>
        {all.map(({ category: c }) => (
          <Pill key={c.id} active={active === c.id} onClick={() => select(c.id)}>{c.name}</Pill>
        ))}
      </div>

      {groups.map((g) => (
        <section key={g.category.id} id={g.category.id} className="mt-12 pt-6 border-t border-rule">
          <h2 className="font-serif italic text-3xl">{g.category.numeral}. {g.category.name}</h2>
          <p className="text-ink-muted mt-1 mb-6 max-w-2xl">{g.category.blurb}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {g.frameworks.map((fw) => <Card key={fw.slug} fw={fw} />)}
          </div>
        </section>
      ))}
    </div>
  )
}
