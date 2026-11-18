// Pure helpers for /events. No JSX or browser globals at load: also imported by Node scripts.

const MIN = 60 * 1000

export const eventEnd = (event) => new Date(new Date(event.start).getTime() + event.durationMin * MIN)

export function eventStatus(event, now) {
  const t = now.getTime()
  if (t < new Date(event.start).getTime()) return 'upcoming'
  if (t < eventEnd(event).getTime()) return 'live'
  return 'past'
}

const startMs = (e) => new Date(e.start).getTime()

export const upcomingEvents = (list, now) =>
  list.filter((e) => eventStatus(e, now) !== 'past').sort((a, b) => startMs(a) - startMs(b))

export const pastEvents = (list, now) =>
  list.filter((e) => eventStatus(e, now) === 'past').sort((a, b) => startMs(b) - startMs(a))

export function featuredEvent(list, now) {
  const up = upcomingEvents(list, now)
  return up.find((e) => eventStatus(e, now) === 'live') || up[0] || null
}

export const findEvent = (list, slug) => list.find((e) => e.slug === slug)

export function formatWhen(event, { timeZone } = {}) {
  const d = new Date(event.start)
  const tz = timeZone ? { timeZone } : {}
  const parts = (opts, locale) =>
    Object.fromEntries(new Intl.DateTimeFormat(locale, { ...opts, ...tz }).formatToParts(d).map((p) => [p.type, p.value]))
  const date = parts({ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }, 'en-GB')
  const time = parts({ hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }, 'en-US')
  return `${date.weekday} ${date.day} ${date.month} ${date.year} · ${time.hour}:${time.minute} ${time.dayPeriod} ${time.timeZoneName}`
}

export function formatShortDate(event, { timeZone } = {}) {
  const tz = timeZone ? { timeZone } : {}
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', ...tz })
    .format(new Date(event.start))
    .toUpperCase()
}

export const formatDuration = (event) => `${event.durationMin} min, incl. Q&A`

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsText = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

export function toIcs(event, siteUrl = 'https://openastra.org') {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenAstra//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.slug}@openastra.org`,
    `DTSTAMP:${icsDate(new Date(event.start))}`,
    `DTSTART:${icsDate(new Date(event.start))}`,
    `DTEND:${icsDate(eventEnd(event))}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(event.summary)}`,
    `URL:${siteUrl}/events/${event.slug}`,
    'LOCATION:Online',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export const icsHref = (event) => 'data:text/calendar;charset=utf-8,' + encodeURIComponent(toIcs(event))

export function youtubeEmbedUrl(url) {
  if (!url) return null
  let u
  try { u = new URL(url) } catch { return null }
  const host = u.hostname.replace(/^www\./, '')
  let id = null
  if (host === 'youtu.be') id = u.pathname.split('/')[1]
  else if (host === 'youtube.com') {
    const [, kind, rest] = u.pathname.split('/')
    if (kind === 'watch') id = u.searchParams.get('v')
    else if (kind === 'live' || kind === 'embed') id = rest
  }
  return id && /^[\w-]+$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export function videoFor(event, now) {
  const status = eventStatus(event, now)
  if (status === 'upcoming') return { kind: 'countdown', embed: null }
  if (status === 'live') return { kind: 'stream', embed: youtubeEmbedUrl(event.streamUrl) }
  const embed = youtubeEmbedUrl(event.recordingUrl) || youtubeEmbedUrl(event.streamUrl)
  return embed ? { kind: 'recording', embed } : { kind: 'none', embed: null }
}
