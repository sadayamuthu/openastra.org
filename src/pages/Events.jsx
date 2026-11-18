import { Link, useSearchParams } from 'react-router-dom'
import Countdown from '../components/Countdown'
import TalkActions from '../components/TalkActions'
import { Button, Eyebrow, Pill } from '../components/ui'
import { events, LUMA_CALENDAR_URL } from '../data/events'
import { getAuthor } from '../data/authors'
import { getFramework } from '../data/frameworks'
import {
  deliveryCopy, eventStatus, featuredEvent, formatDayMonth, formatShortDate, formatWhen, pastEvents, rowState,
  seriesRows, upcomingEvents, videoFor,
} from '../lib/events'
import { useNow } from '../lib/useNow'

const TABS = [
  ['all', 'All'],
  ['upcoming', 'Upcoming'],
  ['on-demand', 'On demand'],
]

const SERIES = 'framework-of-the-week'

function Section({ label, children, className = '', aside = null }) {
  const id = `events-${label.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <section aria-labelledby={id} className={`mt-12 ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <Eyebrow><span id={id}>{label}</span></Eyebrow>
        {aside}
      </div>
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
        {LUMA_CALENDAR_URL ? (
          <>
            <p className="mt-2 text-ink-muted">Follow the OpenAstra calendar on Luma to hear about new talks first.</p>
            <div className="mt-5"><Button href={LUMA_CALENDAR_URL} variant="solid">Follow on Luma</Button></div>
          </>
        ) : (
          <p className="mt-2 text-ink-muted">The first talk will be announced here.</p>
        )}
      </div>
    )
  }
  const live = eventStatus(event, now) === 'live'
  const copy = deliveryCopy(event)
  const speakers = names(event.speakers, getAuthor)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border border-rule bg-card rounded-sm p-6 mt-8">
      <div className="lg:col-span-2">
        <Eyebrow className="text-rust">
          {live ? (
            <span className="bg-rust text-paper px-2 py-1 rounded-sm"><span aria-hidden="true">●</span> {copy.badge}</span>
          ) : event.week ? `Week ${event.week} · Next premiere` : 'Next talk · Online'}
        </Eyebrow>
        <h2 className="font-serif text-3xl sm:text-4xl mt-3">{event.title}</h2>
        {event.subtitle && <p className="font-serif italic text-xl text-ink-muted mt-2">{event.subtitle}</p>}
        <p className="text-sm text-ink-muted mt-3">{formatWhen(event)}</p>
        {speakers.length > 0 && <p className="text-sm mt-1">{speakers.join(' · ')}</p>}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {live ? (
            <Button to={`/events/${event.slug}`} variant="solid">{copy.watch}</Button>
          ) : (
            <TalkActions event={event} className="flex">
              <Link to={`/events/${event.slug}`} className="text-sm hover:text-rust">Details →</Link>
            </TalkActions>
          )}
        </div>
      </div>
      {!live && <Countdown event={event} now={now} label={copy.startsIn} className="self-start" />}
    </div>
  )
}

function Row({ event }) {
  const sub = [...names(event.frameworks || [], getFramework), ...names(event.speakers, getAuthor)].join(' · ')
  return (
    <li className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7.5rem_1fr_auto] items-baseline gap-4 py-4 border-t border-rule">
      <span className="font-mono text-xs text-ink-muted">{formatShortDate(event)}</span>
      <div>
        <Link to={`/events/${event.slug}`} className="font-serif text-xl hover:text-rust">{event.title}</Link>
        {sub && <p className="text-sm text-ink-muted">{sub}</p>}
      </div>
      <span className="hidden sm:inline-flex font-mono text-[10px] tracking-wide border border-ink/25 rounded px-1.5 py-px text-ink-muted">ONLINE</span>
    </li>
  )
}

const STATE = {
  next: ['NEXT', 'border-rust text-rust'],
  upcoming: ['UPCOMING', 'border-ink/25 text-ink-muted'],
  premiering: [null, 'bg-rust border-rust text-paper'],
  watch: ['WATCH', 'border-ink text-ink'],
  'recording-soon': ['RECORDING SOON', 'border-ink/25 text-ink-muted'],
}

function SeriesRow({ row, now, featured }) {
  if (row.type === 'break') {
    return (
      <li className="py-3 border-t border-dashed border-rule font-mono text-xs text-ink-muted text-center">
        Holiday break · back {formatDayMonth(row.resumes)}
      </li>
    )
  }
  const { event } = row
  const state = rowState(event, now, featured)
  const [label, tone] = STATE[state]
  const sub = names(event.frameworks || [], getFramework).join(' · ')
  return (
    <li className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7.5rem_1fr_auto] items-baseline gap-4 py-4 border-t border-rule">
      <div className="font-mono text-xs text-ink-muted">
        <span className="block text-ink">Week {event.week}</span>
        <span>{formatShortDate(event)}</span>
      </div>
      <div>
        <Link to={`/events/${event.slug}`} className="font-serif text-xl hover:text-rust">{event.title}</Link>
        {sub && <p className="text-sm text-ink-muted">{sub}</p>}
        <p className="font-mono text-xs text-ink-muted mt-1 sm:hidden">{formatWhen(event)}</p>
      </div>
      <span className={`col-start-2 sm:col-start-auto justify-self-start sm:justify-self-end font-mono text-[10px] tracking-wide border rounded px-1.5 py-px ${tone}`}>
        {state === 'premiering' ? <><span aria-hidden="true">●</span> PREMIERING</> : label}
      </span>
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
  const rows = seriesRows(events, SERIES)
  const seriesCount = rows.filter((r) => r.type === 'session').length
  const upcoming = upcomingEvents(events, now).filter((e) => e !== featured && e.series !== SERIES)
  const past = pastEvents(events, now)
  const showUpcoming = tab !== 'on-demand'
  const showPast = tab !== 'upcoming'

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-14">
      <Eyebrow>Framework of the week · Wednesdays 11 AM ET · 16:00 UTC · Free</Eyebrow>
      <h1 className="font-serif text-5xl mt-3">Events</h1>
      <p className="text-ink-muted text-lg max-w-2xl mt-3">
        One OpenAstra framework a week, in a recorded session that premieres with live Q&amp;A in the chat. Ask the
        author anything while it plays, or watch on demand afterwards.
      </p>
      <div className="flex flex-wrap gap-2 mt-6" role="group" aria-label="Filter events">
        {TABS.map(([id, label]) => (
          <Pill key={id} active={tab === id} onClick={() => select(id)}>{label}</Pill>
        ))}
      </div>

      {showUpcoming && <Featured event={featured} now={now} />}

      {showUpcoming && seriesCount > 0 && (
        <Section
          label={`The series · ${seriesCount} weeks`}
          aside={LUMA_CALENDAR_URL && (
            <a href={LUMA_CALENDAR_URL} className="text-sm hover:text-rust" target="_blank" rel="noopener noreferrer">Follow on Luma ↗</a>
          )}
        >
          <ul>{rows.map((r) => <SeriesRow key={r.type === 'break' ? `break-${r.resumes.slug}` : r.event.slug} row={r} now={now} featured={featured} />)}</ul>
        </Section>
      )}

      {showUpcoming && upcoming.length > 0 && (
        <Section label="Upcoming">
          <ul>{upcoming.map((e) => <Row key={e.slug} event={e} />)}</ul>
        </Section>
      )}

      {showPast && (
        <Section label="On demand">
          {past.length === 0 && (
            <div className="mb-4">
              <p className="font-serif text-2xl">Recordings build up here</p>
              <p className="text-ink-muted">Each premiere stays available right after it airs.</p>
            </div>
          )}
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
    </div>
  )
}
