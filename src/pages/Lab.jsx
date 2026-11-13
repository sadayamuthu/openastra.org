import { useSearchParams } from 'react-router-dom'
import LabCard from '../components/LabCard'
import { Eyebrow, Pill } from '../components/ui'
import { LAB_GROUPS, labProjects, getCategory } from '../data/frameworks'

function eyebrowFor(p) {
  if (p.step) {
    const c = getCategory(p.category)
    return `${p.step} · ${c.numeral}. ${c.name}`
  }
  return null
}

export default function Lab() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('group')
  const active = LAB_GROUPS.some((g) => g.id === requested) ? requested : null
  const all = labProjects()
  const groups = LAB_GROUPS.filter((g) => !active || g.id === active)
    .map((g) => ({ ...g, projects: all.filter((p) => p.group === g.id) }))
    .filter((g) => g.projects.length > 0)

  const select = (id) => setParams(id ? { group: id } : {}, { replace: true })

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-14">
      <Eyebrow>In the lab · {all.length} projects</Eyebrow>
      <h1 className="font-serif text-5xl mt-3">What we're building next.</h1>
      <p className="text-ink-muted mt-4 max-w-2xl leading-relaxed">
        Early-stage projects in our focus areas. Nothing is published yet. Each one joins the framework
        index, with a citable release, when it ships.
      </p>
      <div className="flex flex-wrap gap-2 mt-6" role="group" aria-label="Filter by group">
        <Pill active={!active} onClick={() => select(null)}>All</Pill>
        {LAB_GROUPS.map((g) => (
          <Pill key={g.id} active={active === g.id} onClick={() => select(g.id)}>{g.name}</Pill>
        ))}
      </div>

      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`lab-${g.id}`} className="mt-12 pt-6 border-t border-rule">
          <h2 id={`lab-${g.id}`} className={`font-serif text-3xl ${g.id === 'openq' ? '' : 'italic'}`}>{g.title}</h2>
          {g.blurb && <p className="text-ink-muted mt-1 max-w-2xl">{g.blurb}</p>}
          <div className={`grid grid-cols-1 gap-4 mt-6 ${g.projects.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {g.projects.map((p) => (
              <LabCard key={p.name} project={p} eyebrow={eyebrowFor(p)} detailed />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-14 border border-dashed border-ink/30 rounded-sm p-6 text-center">
        <Eyebrow>Early access or collaboration</Eyebrow>
        <a href="https://github.com/sadayamuthu" target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm hover:text-rust">
          Follow along on GitHub ↗
        </a>
      </div>
    </div>
  )
}
