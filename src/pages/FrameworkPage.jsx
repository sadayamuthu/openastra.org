import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Citation from '../components/Citation'
import { Button, CodeBlock, Eyebrow } from '../components/ui'
import { doiUrl, frameworks, getCategory, getFramework } from '../data/frameworks'
import NotFound from './NotFound'

function Block({ title, children }) {
  return (
    <section className="py-8 border-t border-rule">
      <h2 className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function FrameworkPage({ slug }) {
  const fw = getFramework(slug)

  useEffect(() => {
    document.title = fw ? `${fw.name} · OpenAstra` : 'Not found · OpenAstra'
  }, [fw])

  if (!fw) return <NotFound />

  const category = getCategory(fw.category)
  const related = frameworks.filter((f) => f.category === fw.category && f.slug !== fw.slug)
  const facts = fw.zenodo ? [...fw.facts, ['DOI', fw.zenodo.doi]] : fw.facts

  return (
    <article className="max-w-page mx-auto px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
        <Link to="/frameworks" className="hover:text-ink">Frameworks</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/frameworks?category=${category.id}`} className="hover:text-ink">{category.numeral}. {category.name}</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{fw.name}</span>
      </nav>

      <header className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
        <div className="lg:col-span-2">
          <Eyebrow>{String(fw.number).padStart(2, '0')} · {category.name}</Eyebrow>
          <h1 className="font-serif text-5xl sm:text-6xl tracking-tight mt-3">{fw.name}</h1>
          <p className="font-serif text-xl sm:text-2xl mt-4 leading-snug">{fw.tagline}</p>
          <p className="text-ink-muted mt-4 leading-relaxed max-w-2xl">{fw.description}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button href={fw.links.github} variant="solid">GitHub</Button>
            {fw.links.website && <Button href={fw.links.website}>Website</Button>}
            {fw.zenodo && <Button href={doiUrl(fw.zenodo.doi)}>DOI</Button>}
          </div>
        </div>
        <aside className="bg-card border border-rule rounded-sm p-5 self-start">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-2">At a glance</p>
          <dl>
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2 border-b border-rule last:border-0 text-sm">
                <dt className="text-ink-muted">{k}</dt>
                <dd className={`text-right ${k === 'DOI' ? 'font-mono text-xs' : ''}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </header>

      {fw.problem && (
        <Block title="The problem">
          <p className="font-serif text-xl sm:text-2xl leading-snug max-w-3xl">{fw.problem}</p>
        </Block>
      )}

      <Block title="How it works">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fw.steps.map((s, i) => (
            <li key={s.title} className="border border-dashed border-ink/30 rounded-sm p-4">
              <p className="font-mono text-xs text-rust">{i + 1}</p>
              <p className="font-medium mt-1">{s.title}</p>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </Block>

      {fw.highlights && (
        <Block title={fw.highlights.title}>
          <ul className="flex flex-wrap gap-2">
            {fw.highlights.items.map((item) => (
              <li key={item} className="px-3 py-1 rounded-full border border-ink/25 text-sm font-mono">{item}</li>
            ))}
          </ul>
        </Block>
      )}

      {fw.features && (
        <Block title="Key features">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fw.features.map((f) => (
              <div key={f.title} className="bg-card border border-rule rounded-sm p-5">
                <p className="font-serif text-lg">{f.title}</p>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </Block>
      )}

      <Block title="Quick start">
        <CodeBlock blocks={fw.quickstart} />
      </Block>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-rule">
        {fw.zenodo && (
          <section className="py-8">
            <h2 className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">Cite this</h2>
            <div className="bg-card border border-rule rounded-sm p-5">
              <Citation framework={fw} />
            </div>
          </section>
        )}
        {related.length > 0 && (
          <section className="py-8">
            <h2 className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">Related in {category.name}</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/${r.slug}`} className="flex justify-between gap-4 py-2 border-b border-rule hover:text-rust">
                    <span>{r.name}</span>
                    <span className="text-sm text-ink-muted truncate">{r.summary} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
