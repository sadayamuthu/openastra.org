import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import EventMedia from '../components/EventMedia'
import TalkActions from '../components/TalkActions'
import { Button, DoiTag, Eyebrow } from '../components/ui'
import { events } from '../data/events'
import { authorPath, getAuthor } from '../data/authors'
import { getFramework } from '../data/frameworks'
import { deliveryCopy, eventStatus, findEvent, formatDuration, formatWhen } from '../lib/events'
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
  const copy = deliveryCopy(event)
  const live = eventStatus(event, now) === 'live'
  const facts = [
    ['When', formatWhen(event)],
    ['Where', copy.where],
    ['Cost', 'Free'],
    ['Length', formatDuration(event)],
  ]

  return (
    <article className="max-w-page mx-auto px-4 sm:px-6 py-10">
      <Link to="/events" className="text-sm text-ink-muted hover:text-ink">← All events</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2">
          {live && (
            <p className="mb-3 text-[11px] font-medium tracking-[0.14em] text-rust">
              <span aria-hidden="true">●</span> {copy.badge}
            </p>
          )}
          <Eyebrow className="text-rust">{event.week ? `Week ${event.week} · ${copy.eyebrow}` : copy.eyebrow}</Eyebrow>
          <h1 className="font-serif text-4xl sm:text-5xl mt-3">{event.title}</h1>
          {event.subtitle && <p className="font-serif italic text-xl text-ink-muted mt-3">{event.subtitle}</p>}
          {!past && (
            <div className="lg:hidden mt-5">
              <p className="text-sm text-ink-muted">{formatWhen(event)} · {formatDuration(event)}</p>
              <TalkActions event={event} className="flex mt-4" />
            </div>
          )}
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
              <TalkActions event={event} className="hidden lg:flex mt-5" />
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
              <Label>{fws.length > 1 ? 'Frameworks in this session' : 'Related framework'}</Label>
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
