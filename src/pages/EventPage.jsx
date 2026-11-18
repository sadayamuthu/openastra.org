import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import EventMedia from '../components/EventMedia'
import { Button, DoiTag, Eyebrow } from '../components/ui'
import { events } from '../data/events'
import { authorPath, getAuthor } from '../data/authors'
import { getFramework } from '../data/frameworks'
import { eventStatus, findEvent, formatDuration, formatWhen, icsHref } from '../lib/events'
import { useNow } from '../lib/useNow'
import NotFound from './NotFound'

function Label({ children }) {
  return <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-3">{children}</p>
}

export default function EventPage() {
  const { slug } = useParams()
  const now = useNow()
  const event = findEvent(events, slug)

  useEffect(() => {
    if (event) document.title = `${event.title} · Events · OpenAstra`
  }, [event])

  if (!event) return <NotFound />

  const past = eventStatus(event, now) === 'past'
  const speakers = event.speakers.map(getAuthor).filter(Boolean)
  const fws = (event.frameworks || []).map(getFramework).filter(Boolean)
  const facts = [
    ['When', formatWhen(event)],
    ['Where', 'Online · YouTube Live'],
    ['Cost', 'Free'],
    ['Length', formatDuration(event)],
  ]

  return (
    <article className="max-w-page mx-auto px-4 sm:px-6 py-10">
      <Link to="/events" className="text-sm text-ink-muted hover:text-ink">← All events</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2">
          <Eyebrow className="text-rust">Tech talk · Online · Free</Eyebrow>
          <h1 className="font-serif text-4xl sm:text-5xl mt-3">{event.title}</h1>
          {event.subtitle && <p className="font-serif italic text-xl text-ink-muted mt-3">{event.subtitle}</p>}
          <div className="mt-8">
            <EventMedia event={event} now={now} />
          </div>
          <p className="leading-relaxed mt-8">{event.summary}</p>
        </div>

        <aside className="flex flex-col gap-10">
          <div className="border border-rule bg-card rounded-sm p-5">
            <dl className="flex flex-col gap-3 text-sm">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted">{k}</dt>
                  <dd className="mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
            {!past && (
              <div className="flex flex-wrap gap-3 mt-5">
                {event.registerUrl && <Button href={event.registerUrl} variant="solid">Register on Luma</Button>}
                <a
                  href={icsHref(event)}
                  download={`${event.slug}.ics`}
                  className="inline-flex items-center px-4 py-2 rounded-sm border border-ink text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
                >
                  Add to calendar
                </a>
              </div>
            )}
          </div>

          {speakers.length > 0 && (
            <section>
              <Label>{speakers.length > 1 ? 'Speakers' : 'Speaker'}</Label>
              <ul className="flex flex-col gap-3">
                {speakers.map((a) => (
                  <li key={a.name}>
                    <Link to={authorPath(a)} className="font-serif text-lg hover:text-rust">{a.name}</Link>
                    <p className="text-sm text-ink-muted">{a.role}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {fws.length > 0 && (
            <section>
              <Label>{fws.length > 1 ? 'Related frameworks' : 'Related framework'}</Label>
              <ul className="flex flex-col gap-2">
                {fws.map((f) => (
                  <li key={f.slug} className="flex items-center gap-2">
                    <Link to={`/${f.slug}`} className="font-serif text-lg hover:text-rust">{f.name}</Link>
                    {f.zenodo && <DoiTag />}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  )
}
