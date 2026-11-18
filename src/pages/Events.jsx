import { Link, useSearchParams } from 'react-router-dom'
import Countdown from '../components/Countdown'
import { Button, ComingSoon, Eyebrow, Pill } from '../components/ui'
import { events } from '../data/events'
import { getAuthor } from '../data/authors'
import { getFramework } from '../data/frameworks'
import {
  eventStatus, featuredEvent, formatShortDate, formatWhen, icsHref, pastEvents, upcomingEvents, videoFor,
} from '../lib/events'
import { useNow } from '../lib/useNow'

const TABS = [
  ['all', 'All'],
  ['live', 'Live & upcoming'],
  ['on-demand', 'On demand'],
]

function Section({ label, children, className = '' }) {
  const id = `events-${label.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <section aria-labelledby={id} className={`mt-12 ${className}`}>
      <Eyebrow><span id={id}>{label}</span></Eyebrow>
      <div className="mt-3">{children}</div>
    </section>
  )
}

const names = (list, get) => list.map(get).filter(Boolean).map((x) => x.name)

function Featured({ event, now }) {
  if (!event) {
    return (
      <div className="border border-dashed border-ink/30 rounded-sm p-8 mt-8">
        <Eyebrow className="text-rust">Next talk</Eyebrow>
        <p className="font-serif text-3xl mt-2">Announced soon</p>
        <p className="mt-2 text-ink-muted">Follow the OpenAstra calendar on Luma to hear about new talks first.</p>
      </div>
    )
  }
  const live = eventStatus(event, now) === 'live'
  const speakers = names(event.speakers, getAuthor)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border border-rule bg-card rounded-sm p-6 mt-8">
      <div className="lg:col-span-2">
        <Eyebrow className="text-rust">
          {live ? <span className="bg-rust text-paper px-2 py-1 rounded-sm">● LIVE NOW</span> : 'Next talk · Online'}
        </Eyebrow>
        <h2 className="font-serif text-3xl sm:text-4xl mt-3">{event.title}</h2>
        {event.subtitle && <p className="font-serif italic text-xl text-ink-muted mt-2">{event.subtitle}</p>}
        <p className="text-sm text-ink-muted mt-3">{formatWhen(event)}</p>
        {speakers.length > 0 && <p className="text-sm mt-1">{speakers.join(' · ')}</p>}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {live ? (
            <Button to={`/events/${event.slug}`} variant="solid">Watch live</Button>
          ) : (
            <>
              {event.registerUrl && <Button href={event.registerUrl} variant="solid">Register on Luma</Button>}
              <a
                href={icsHref(event)}
                download={`${event.slug}.ics`}
                className="inline-flex items-center px-4 py-2 rounded-sm border border-ink text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
              >
                Add to calendar
              </a>
              <Link to={`/events/${event.slug}`} className="text-sm hover:text-rust">Details →</Link>
            </>
          )}
        </div>
      </div>
      {!live && <Countdown event={event} now={now} className="self-start" />}
    </div>
  )
}

function Row({ event }) {
  const sub = [...names(event.frameworks || [], getFramework), ...names(event.speakers, getAuthor)].join(' · ')
  return (
    <li className="grid grid-cols-[7.5rem_1fr_auto] items-baseline gap-4 py-4 border-t border-rule">
      <span className="font-mono text-xs text-ink-muted">{formatShortDate(event)}</span>
      <div>
        <Link to={`/events/${event.slug}`} className="font-serif text-xl hover:text-rust">{event.title}</Link>
        {sub && <p className="text-sm text-ink-muted">{sub}</p>}
      </div>
      <span className="font-mono text-[10px] tracking-wide border border-ink/25 rounded px-1.5 py-px text-ink-muted">ONLINE</span>
    </li>
  )
}

function Recording({ event, now }) {
  const none = videoFor(event, now).kind === 'none'
  const speakers = names(event.speakers, getAuthor)
  return (
    <div className="bg-card border border-rule rounded-sm overflow-hidden">
      <div className="aspect-video bg-ink text-paper flex items-center justify-center">
        {none ? <span className="text-sm">Recording soon</span> : <span aria-hidden="true" className="text-3xl">▶</span>}
      </div>
      <div className="p-4">
        <Eyebrow>{formatShortDate(event)} · Recording</Eyebrow>
        <Link to={`/events/${event.slug}`} className="block font-serif text-lg mt-1 hover:text-rust">{event.title}</Link>
        {speakers.length > 0 && <p className="text-sm text-ink-muted mt-1">{speakers.join(' · ')}</p>}
      </div>
    </div>
  )
}

export default function Events() {
  const now = useNow()
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab = TABS.some(([id]) => id === requested) ? requested : 'all'
  const select = (id) => setParams(id === 'all' ? {} : { tab: id }, { replace: true })

  const featured = featuredEvent(events, now)
  const upcoming = upcomingEvents(events, now).filter((e) => e !== featured)
  const past = pastEvents(events, now)
  const showUpcoming = tab !== 'on-demand'
  const showPast = tab !== 'live'

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-14">
      <Eyebrow>OpenAstra Talks · Online · Free</Eyebrow>
      <h1 className="font-serif text-5xl mt-3">Events</h1>
      <p className="text-ink-muted text-lg max-w-2xl mt-3">
        Talks from the people who build OpenAstra's frameworks: how each one works, why it exists, and what it
        catches. Live online, with recordings afterwards.
      </p>
      <div className="flex flex-wrap gap-2 mt-6" role="group" aria-label="Filter events">
        {TABS.map(([id, label]) => (
          <Pill key={id} active={tab === id} onClick={() => select(id)}>{label}</Pill>
        ))}
        <Pill soon>Call for papers · soon</Pill>
      </div>

      {showUpcoming && <Featured event={featured} now={now} />}

      {showUpcoming && upcoming.length > 0 && (
        <Section label="Upcoming">
          <ul>{upcoming.map((e) => <Row key={e.slug} event={e} />)}</ul>
        </Section>
      )}

      {showPast && (
        <Section label="On demand">
          {past.length === 0 && <p className="text-ink-muted mb-4">Recordings appear here after each talk</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {past.map((e) => <Recording key={e.slug} event={e} now={now} />)}
            <div className="border border-dashed border-ink/30 rounded-sm p-6 flex flex-col justify-center">
              <Eyebrow>Later</Eyebrow>
              <p className="font-serif text-2xl mt-1">Podcast</p>
              <p className="text-sm text-ink-muted">Episodes will appear here alongside recordings.</p>
            </div>
          </div>
        </Section>
      )}

      {tab === 'all' && (
        <div className="mt-12">
          <ComingSoon label="Call for papers">Community papers, peer reviewed, published with a DOI.</ComingSoon>
        </div>
      )}
    </div>
  )
}
