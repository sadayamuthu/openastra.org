import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eyebrow } from '../components/ui'
import { getCategory, getLabProject, openAreaProjects, repoDocs } from '../data/frameworks'
import NotFound from './NotFound'

const chip =
  'inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-ink/30 text-sm hover:border-rust hover:text-rust transition-colors'
const solidChip =
  'inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-ink bg-ink text-paper text-sm hover:bg-rust hover:border-rust transition-colors'

const SHOWN_DOCS = ['thesis', 'governance']

function Block({ title, id, children }) {
  return (
    <section aria-labelledby={id} className="py-8 border-t border-rule">
      <h2 id={id} className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">{title}</h2>
      {children}
    </section>
  )
}

// One open-area lab project: what it is, that it's in the lab, and links to its
// repo, thesis and governance.
export default function LabProjectPage({ slug }) {
  const project = getLabProject(slug)

  useEffect(() => {
    if (project) document.title = `${project.name} · In the lab · OpenAstra`
  }, [project])

  if (!project) return <NotFound />

  const category = getCategory(project.category)
  const repo = repoDocs(project.repo)
  const links = [
    { label: 'GitHub', url: project.repo, solid: true },
    ...(repo?.docs ?? []).filter((d) => SHOWN_DOCS.includes(d.id)).map((d) => ({ label: d.label, url: d.url })),
  ]
  const related = openAreaProjects().filter((p) => p.category === project.category && p.slug !== project.slug)

  return (
    <article className="max-w-page mx-auto px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
        <Link to="/lab" className="hover:text-ink">In the lab</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/lab?group=${category.id}`} className="hover:text-ink">{category.numeral}. {category.name}</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{project.name}</span>
      </nav>

      <header className="py-10 max-w-3xl">
        <Eyebrow>In the lab · {category.numeral}. {category.name}</Eyebrow>
        <h1 className="font-serif text-5xl sm:text-6xl tracking-tight mt-3">{project.name}</h1>
        <p className="font-serif text-xl sm:text-2xl mt-4 leading-snug">{project.summary}</p>
        <p className="text-ink-muted mt-4 leading-relaxed">{project.description}</p>
        <ul aria-label="Project links" className="flex flex-wrap gap-2 mt-6">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.url} target="_blank" rel="noreferrer" className={l.solid ? solidChip : chip}>
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </header>

      <Block title="Status" id="lab-status">
        <div className="border border-dashed border-ink/30 rounded-sm p-6 flex flex-col gap-1">
          <p className="font-serif text-2xl text-rust">In the lab</p>
          <p className="text-sm text-ink-muted">
            Design stage: there is no code yet, and the design may change. It joins the framework index, with a
            citable release, when it ships. Read the thesis for the idea, or watch the repository to follow along.
          </p>
        </div>
      </Block>

      {related.length > 0 && (
        <Block title={`Also in the lab: ${category.name}`} id="lab-related">
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={r.to} className="flex justify-between gap-4 py-2 border-b border-rule hover:text-rust">
                  <span>{r.name}</span>
                  <span className="text-sm text-ink-muted truncate">{r.summary} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Block>
      )}
    </article>
  )
}
