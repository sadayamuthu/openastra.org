import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, DoiTag, Eyebrow, Pill } from '../components/ui'
import { citedFrameworks, doiUrl } from '../data/frameworks'
import { getAuthor } from '../data/authors'
import NotFound from './NotFound'

function Label({ children }) {
  return <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-3">{children}</p>
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <Label>{title}</Label>
      {children}
    </section>
  )
}

export default function Profile() {
  const { slug } = useParams()
  const person = getAuthor(slug)

  useEffect(() => {
    if (person) document.title = `${person.name} · OpenAstra`
  }, [person])

  if (!person) return <NotFound />

  return (
    <article className="max-w-page mx-auto px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-muted">
        <Link to="/about" className="hover:text-ink">About</Link>
        <span aria-hidden="true"> / </span>
        <Link to="/about#authors" className="hover:text-ink">People</Link>
      </nav>

      <header className="mt-8">
        <Eyebrow className="text-rust">{person.role}</Eyebrow>
        <h1 className="font-serif text-5xl mt-3">{person.name}</h1>
        {person.title && <p className="text-ink-muted mt-3">{person.title}</p>}
        <div className="flex flex-wrap gap-3 mt-6">
          {person.links.map((l, i) => (
            <Button key={l.label} href={l.href} variant={i === 0 ? 'solid' : 'outline'}>{l.label}</Button>
          ))}
        </div>
      </header>

      {person.placeholder ? (
        <div className="mt-12 border border-dashed border-ink/30 rounded-sm p-10 text-center">
          <p className="font-serif text-2xl text-rust">Profile coming soon</p>
          <p className="text-sm text-ink-muted mt-2">
            Bio, research, and expertise will be added here. Meanwhile, see {person.name.split(' ')[0]}’s LinkedIn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
          <div className="lg:col-span-2">
            <Section title="Bio">
              {person.bio.map((p, i) => (
                <p key={i} className="leading-relaxed mt-4 first:mt-0">{p}</p>
              ))}
            </Section>

            <Section title="Research">
              <ul className="flex flex-col gap-3">
                {person.research.map((r) => (
                  <li key={r.area}>
                    <span className="font-serif italic text-lg">{r.area}.</span>{' '}
                    <span className="text-ink-muted">{r.detail}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {person.authoredFrameworks && (
              <Section title="Frameworks authored">
                <ul>
                  {citedFrameworks().map((f) => (
                    <li key={f.slug} className="border-b border-rule py-3 flex flex-wrap items-baseline justify-between gap-2">
                      <Link to={`/${f.slug}`} className="font-serif text-lg hover:text-rust">{f.name}</Link>
                      <a href={doiUrl(f.zenodo.doi)} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs text-ink-muted hover:text-ink">
                        <DoiTag /> {f.zenodo.doi}
                      </a>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="Peer review & service">
              <ul className="list-disc pl-5 text-ink-muted flex flex-col gap-1">
                {person.service.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Section>
          </div>

          <aside>
            <Section title="Expertise">
              <div className="flex flex-wrap gap-2">
                {person.expertise.map((e) => <Pill key={e}>{e}</Pill>)}
              </div>
            </Section>
            <Section title="Experience">
              <ul>
                {person.experience.map((x) => (
                  <li key={x.org} className="border-b border-rule py-2">
                    <p className="font-serif text-lg">{x.org}</p>
                    <p className="text-xs text-ink-muted flex justify-between gap-2">
                      <span>{x.role}</span>
                      <span className="font-mono whitespace-nowrap">{x.dates}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Credentials">
              <ul className="text-sm text-ink-muted flex flex-col gap-1">
                {person.credentials.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </Section>
          </aside>
        </div>
      )}
    </article>
  )
}
