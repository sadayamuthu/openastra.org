// Pure helpers for /events. No JSX or browser globals at load: also imported by Node scripts.

const MIN = 60 * 1000

const isRecorded = (e) => e?.delivery === 'recorded'

// Recorded sessions have no live window: they end the moment they start.
export const eventEnd = (event) =>
  new Date(new Date(event.start).getTime() + (isRecorded(event) ? 0 : event.durationMin * MIN))

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

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatWhen(event, { timeZone } = {}) {
  const d = new Date(event.start)
  const tz = timeZone ? { timeZone } : {}
  const parts = (opts, locale) =>
    Object.fromEntries(new Intl.DateTimeFormat(locale, { ...opts, ...tz }).formatToParts(d).map((p) => [p.type, p.value]))
  const date = parts({ weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' }, 'en-GB')
  const time = parts({ hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }, 'en-US')
  return `${date.weekday} ${date.day} ${MONTHS[date.month - 1]} ${date.year} · ${time.hour}:${time.minute} ${time.dayPeriod} ${time.timeZoneName}`
}

export function formatTime(event, { timeZone } = {}) {
  const tz = timeZone ? { timeZone } : {}
  const t = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short', ...tz })
      .formatToParts(new Date(event.start))
      .map((p) => [p.type, p.value]),
  )
  return `${t.hour}:${t.minute} ${t.dayPeriod} ${t.timeZoneName}`
}

export function formatShortDate(event, { timeZone } = {}) {
  const tz = timeZone ? { timeZone } : {}
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', ...tz })
      .formatToParts(new Date(event.start))
      .map((x) => [x.type, x.value]),
  )
  return `${p.day} ${MONTHS[p.month - 1]} ${p.year}`.toUpperCase()
}

export function formatDayMonth(event, { timeZone } = {}) {
  const tz = timeZone ? { timeZone } : {}
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric', ...tz })
      .formatToParts(new Date(event.start))
      .map((x) => [x.type, x.value]),
  )
  return `${p.weekday} ${Number(p.day)} ${MONTHS[p.month - 1]}`
}

export function formatDuration(event) {
  if (isRecorded(event)) return event.durationMin ? `${event.durationMin} min` : null
  return `${event.durationMin} min, incl. Q&A`
}

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
    `URL:${siteUrl}/events/${event.slug}/`,
    `LOCATION:${siteUrl}/events/${event.slug}/`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export const icsHref = (event) => 'data:text/calendar;charset=utf-8,' + encodeURIComponent(toIcs(event))

export function youtubeEmbedUrl(url) {
  if (!url) return null
  let u
  try { u = new URL(url) } catch { return null }
  const host = u.hostname.replace(/^(www|m|music)\./, '')
  let id = null
  if (host === 'youtu.be') id = u.pathname.split('/')[1]
  else if (host === 'youtube.com') {
    const [, kind, rest] = u.pathname.split('/')
    if (kind === 'watch') id = u.searchParams.get('v')
    else if (kind === 'live' || kind === 'embed') id = rest
  }
  return id && /^[\w-]+$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

const pastVideoUrl = (e) => e.recordingUrl || e.videoUrl || e.streamUrl || null

// The YouTube URL to open for "Watch on YouTube".
export const videoLink = (event) => pastVideoUrl(event)

export function videoFor(event, now) {
  const status = eventStatus(event, now)
  if (isRecorded(event)) {
    if (status === 'upcoming') return { kind: 'coming', embed: null }
    const embed = youtubeEmbedUrl(event.recordingUrl) || youtubeEmbedUrl(event.videoUrl) || youtubeEmbedUrl(event.streamUrl)
    return embed ? { kind: 'recording', embed } : { kind: 'none', embed: null }
  }
  if (status === 'upcoming') return { kind: 'countdown', embed: null }
  if (status === 'live') return { kind: 'stream', embed: youtubeEmbedUrl(event.streamUrl) }
  const embed = youtubeEmbedUrl(event.recordingUrl) || youtubeEmbedUrl(event.videoUrl) || youtubeEmbedUrl(event.streamUrl)
  return embed ? { kind: 'recording', embed } : { kind: 'none', embed: null }
}

const DELIVERY = {
  premiere: {
    eyebrow: 'Webcast · Premiere with live Q&A · Free',
    where: 'YouTube Premiere · questions in live chat',
    badge: 'PREMIERING NOW',
    badgeShort: 'PREMIERE',
    watch: 'Watch & ask in chat',
    startsIn: 'Premieres in',
    og: 'Webcast premiere · Free',
    qa: 'In the YouTube live chat',
  },
  live: {
    eyebrow: 'Tech talk · Online · Free',
    where: 'Online · YouTube Live',
    badge: 'LIVE NOW',
    badgeShort: 'LIVE',
    watch: 'Watch live',
    startsIn: 'Starts in',
    og: 'Online · Free',
    qa: 'In the YouTube live chat',
  },
  recorded: {
    eyebrow: 'Recorded session · Free',
    where: 'YouTube · recorded session',
    qa: 'In the YouTube comments',
    watch: 'Watch on YouTube',
    og: 'Recorded session · Free',
    badge: null,
    badgeShort: null,
    startsIn: null,
  },
}

export const deliveryCopy = (event) => DELIVERY[event?.delivery] || DELIVERY.premiere

export const seriesEvents = (list, seriesId) =>
  list.filter((e) => e.series === seriesId).sort((a, b) => a.week - b.week)

const DAY = 24 * 60 * MIN

export function seriesRows(list, seriesId) {
  const rows = []
  let prev = null
  for (const event of seriesEvents(list, seriesId)) {
    if (prev && startMs(event) - startMs(prev) > 8 * DAY) rows.push({ type: 'break', resumes: event })
    rows.push({ type: 'session', event })
    prev = event
  }
  return rows
}

// Hub feature: the newest recorded session released in the last 7 days, else the next upcoming one.
export function featuredForHub(list, now) {
  const t = now.getTime()
  const recent = list
    .filter((e) => isRecorded(e) && startMs(e) <= t && startMs(e) > t - 7 * DAY)
    .sort((a, b) => startMs(b) - startMs(a))[0]
  return recent || featuredEvent(list, now)
}

export function rowState(event, now, featured) {
  const status = eventStatus(event, now)
  if (isRecorded(event)) {
    if (status === 'upcoming') return 'coming'
    return videoFor(event, now).kind !== 'none' ? 'watch' : 'video-soon'
  }
  if (status === 'live') return 'premiering'
  if (featured?.slug === event.slug) return 'next'
  if (status === 'upcoming') return 'upcoming'
  return videoFor(event, now).kind !== 'none' ? 'watch' : 'recording-soon'
}

export function sessionForFramework(list, frameworkSlug, now) {
  const mine = list.filter((e) => e.frameworks?.includes(frameworkSlug))
  return (
    mine.find((e) => eventStatus(e, now) === 'live') ||
    upcomingEvents(mine, now)[0] ||
    pastEvents(mine, now)[0] ||
    null
  )
}
