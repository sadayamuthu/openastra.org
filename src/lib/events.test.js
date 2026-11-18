import { FIXTURE_EVENTS as E, FIXTURE_NOW as NOW } from '../test/eventsFixture'
import { eventStatus, upcomingEvents, pastEvents, featuredEvent, findEvent, formatWhen, formatTime,
  formatDuration, formatShortDate, formatDayMonth, toIcs, youtubeEmbedUrl, videoFor, deliveryCopy, seriesRows, rowState,
  sessionForFramework, videoLink, featuredForHub } from './events'
import { events } from '../data/events'
const at = (iso) => new Date(iso)
const live = E.find((e) => e.slug === 'merge-conflicts')

it('eventStatus boundaries', () => {
  expect(eventStatus(live, at('2026-12-12T16:59:59.999Z'))).toBe('upcoming')
  expect(eventStatus(live, at('2026-12-12T17:00:00Z'))).toBe('live')
  expect(eventStatus(live, at('2026-12-12T17:59:59.999Z'))).toBe('live')
  expect(eventStatus(live, at('2026-12-12T18:00:00Z'))).toBe('past')
})
it('orders upcoming soonest first and past newest first', () => {
  expect(upcomingEvents(E, NOW).map((e) => e.slug)).toEqual(['merge-conflicts', 'controls-as-code'])
  expect(pastEvents(E, NOW).map((e) => e.slug)).toEqual(['introducing-openastra', 'research-agenda'])
})
it('features the live talk, else the next one, else nothing', () => {
  expect(featuredEvent(E, NOW).slug).toBe('merge-conflicts')
  expect(featuredEvent(E, at('2026-12-20T00:00:00Z')).slug).toBe('controls-as-code')
  expect(featuredEvent(E, at('2028-01-01T00:00:00Z'))).toBeNull()
  expect(featuredEvent([], NOW)).toBeNull()
})
it('finds by slug', () => {
  expect(findEvent(E, 'controls-as-code').title).toBeTruthy()
  expect(findEvent(E, 'nope')).toBeUndefined()
})
it("formatWhen shows the visitor's zone and date", () => {
  expect(formatWhen(live, { timeZone: 'Asia/Kolkata' })).toMatch(/Sat 12 Dec 2026 · 10:30 PM (IST|GMT\+5:30)/)
  expect(formatWhen(live, { timeZone: 'Pacific/Auckland' })).toMatch(/Sun 13 Dec 2026 · 6:00 AM/)
  expect(formatWhen(live, { timeZone: 'UTC' })).toMatch(/5:00 PM UTC/)
})
it('formatTime shows time with the visitor zone', () => {
  expect(formatTime(live, { timeZone: 'Asia/Kolkata' })).toMatch(/^10:30 PM (IST|GMT\+5:30)$/)
  expect(formatTime(live, { timeZone: 'UTC' })).toBe('5:00 PM UTC')
})
it('formats duration including Q&A', () => {
  expect(formatDuration(live)).toBe('60 min, incl. Q&A')
})
it('toIcs builds a valid event', () => {
  const ics = toIcs(live)
  ;['BEGIN:VCALENDAR', 'BEGIN:VEVENT', 'UID:merge-conflicts@openastra.org', 'DTSTART:20261212T170000Z',
    'DTEND:20261212T180000Z', 'URL:https://openastra.org/events/merge-conflicts/', 'END:VCALENDAR']
    .forEach((l) => expect(ics.split('\r\n')).toContain(l))
})
it('toIcs escapes text fields', () => {
  const ics = toIcs({ ...live, title: 'A, B; C\\D', summary: 'line1\nline2' })
  expect(ics).toContain('SUMMARY:A\\, B\\; C\\\\D')
  expect(ics).toContain('DESCRIPTION:line1\\nline2')
})
it('youtubeEmbedUrl accepts the common forms and rejects others', () => {
  const id = 'abc123DEF45', out = `https://www.youtube-nocookie.com/embed/${id}`
  ;[`https://www.youtube.com/watch?v=${id}`, `https://youtu.be/${id}`, `https://www.youtube.com/live/${id}?si=x`,
    `https://www.youtube.com/embed/${id}`, `https://m.youtube.com/watch?v=${id}`,
    `https://music.youtube.com/watch?v=${id}`].forEach((u) => expect(youtubeEmbedUrl(u)).toBe(out))
  ;[null, '', 'https://vimeo.com/1', 'not a url'].forEach((u) => expect(youtubeEmbedUrl(u)).toBeNull())
})
it('videoFor picks countdown, stream, recording or none', () => {
  expect(videoFor(E.find((e) => e.slug === 'controls-as-code'), NOW).kind).toBe('countdown')
  expect(videoFor(live, NOW)).toEqual({ kind: 'stream', embed: 'https://www.youtube-nocookie.com/embed/abc123DEF45' })
  expect(videoFor(E.find((e) => e.slug === 'introducing-openastra'), NOW).embed).toContain('rec11111111')
  expect(videoFor(live, at('2026-12-13T00:00:00Z')).kind).toBe('recording') // overrun: stream URL kept
  expect(videoFor(E.find((e) => e.slug === 'research-agenda'), NOW)).toEqual({ kind: 'none', embed: null })
})
it('formatShortDate is uppercase day-month-year in the given zone', () => {
  expect(formatShortDate(live, { timeZone: 'UTC' })).toBe('12 DEC 2026')
  expect(formatShortDate(live, { timeZone: 'Pacific/Auckland' })).toBe('13 DEC 2026')
})
it('uses fixed English month abbreviations (never ICU "Sept")', () => {
  const sep = { ...live, start: '2026-09-12T17:00:00Z' }
  expect(formatShortDate(sep, { timeZone: 'UTC' })).toBe('12 SEP 2026')
  expect(formatWhen(sep, { timeZone: 'UTC' })).toMatch(/^Sat 12 Sep 2026 · 5:00 PM UTC$/)
})

it('deliveryCopy: premiere, live, and default', () => {
  const premiere = { eyebrow: 'Webcast · Premiere with live Q&A · Free', where: 'YouTube Premiere · questions in live chat',
    badge: 'PREMIERING NOW', badgeShort: 'PREMIERE', watch: 'Watch & ask in chat', startsIn: 'Premieres in', og: 'Webcast premiere · Free',
    qa: 'In the YouTube live chat' }
  expect(deliveryCopy({ delivery: 'premiere' })).toEqual(premiere)
  expect(deliveryCopy({})).toEqual(premiere)
  expect(deliveryCopy({ delivery: 'live' })).toEqual({ eyebrow: 'Tech talk · Online · Free', where: 'Online · YouTube Live',
    badge: 'LIVE NOW', badgeShort: 'LIVE', watch: 'Watch live', startsIn: 'Starts in', og: 'Online · Free', qa: 'In the YouTube live chat' })
})
it('seriesRows inserts a break for gaps > 8 days', () => {
  const rows = seriesRows(events, 'framework-of-the-week')
  expect(rows).toHaveLength(8)
  expect(rows[2].type).toBe('break')
  expect(rows[2].resumes.slug).toBe('zero-egress')
  const sessions = rows.filter((r) => r.type === 'session').map((r) => r.event)
  expect(sessions).toHaveLength(7)
  expect(sessions.map((e) => e.week)).toEqual([1, 2, 3, 4, 5, 6, 7])
})
it('rowState covers each state', () => {
  const [liveE, next, , past, noVideo] = [E[0], E[1], null, E[2], E[3]]
  expect(rowState(liveE, NOW, next)).toBe('premiering')
  expect(rowState(next, NOW, next)).toBe('next')
  expect(rowState(next, NOW, null)).toBe('upcoming')
  expect(rowState(past, NOW, next)).toBe('watch')
  expect(rowState(noVideo, NOW, next)).toBe('recording-soon')
})
it('sessionForFramework prefers live, then upcoming, then past, else null', () => {
  const now = new Date('2026-12-09T16:30:00Z')
  expect(sessionForFramework(events, 'mergelock', now).slug).toBe('mergelock')
  expect(sessionForFramework(events, 'controlgate', new Date('2026-11-18T00:00:00Z')).slug).toBe('ocbc-controlgate')
  expect(sessionForFramework(events, 'ocbc', new Date('2026-11-18T00:00:00Z')).slug).toBe('ocbc-controlgate')
  expect(sessionForFramework(events, 'unasked', new Date('2028-01-01T00:00:00Z')).slug).toBe('unasked')
  expect(sessionForFramework(events, 'nope', NOW)).toBeNull()
})
it('toIcs LOCATION is the talk page URL', () => {
  expect(toIcs(live).split('\r\n')).toContain('LOCATION:https://openastra.org/events/merge-conflicts/')
})
it('formatDayMonth is weekday day month in the given zone', () => {
  expect(formatDayMonth({ start: '2026-01-06T16:00:00Z' }, { timeZone: 'UTC' })).toBe('Tue 6 Jan')
  expect(formatDayMonth({ start: '2026-01-06T16:00:00Z' }, { timeZone: 'Pacific/Auckland' })).toBe('Wed 7 Jan')
})

describe('recorded delivery', () => {
  const rec = { slug: 'r', start: '2026-12-09T16:00:00Z', delivery: 'recorded', videoUrl: null, recordingUrl: null, streamUrl: null }
  const vid = 'https://www.youtube.com/watch?v=abc123DEF45'
  const emb = 'https://www.youtube-nocookie.com/embed/abc123DEF45'
  it('eventStatus is upcoming then past, never live', () => {
    expect(eventStatus(rec, at('2026-12-09T15:59:59.999Z'))).toBe('upcoming')
    expect(eventStatus(rec, at('2026-12-09T16:00:00Z'))).toBe('past')
    expect(eventStatus({ ...rec, durationMin: 60 }, at('2026-12-09T16:30:00Z'))).toBe('past')
  })
  it('videoFor: coming, none, recording', () => {
    expect(videoFor(rec, at('2026-12-09T15:00:00Z'))).toEqual({ kind: 'coming', embed: null })
    expect(videoFor(rec, at('2026-12-09T17:00:00Z'))).toEqual({ kind: 'none', embed: null })
    expect(videoFor({ ...rec, videoUrl: vid }, at('2026-12-09T17:00:00Z'))).toEqual({ kind: 'recording', embed: emb })
    expect(videoFor({ ...rec, videoUrl: vid }, at('2026-12-09T15:00:00Z'))).toEqual({ kind: 'coming', embed: null })
  })
  it('premiere past accepts videoUrl fallback', () => {
    expect(videoFor({ start: '2026-01-01T00:00:00Z', durationMin: 60, videoUrl: vid }, at('2026-02-01T00:00:00Z')).embed).toBe(emb)
  })
  it('deliveryCopy recorded', () => {
    expect(deliveryCopy(rec)).toEqual({ eyebrow: 'Recorded session · Free', where: 'YouTube · recorded session',
      qa: 'In the YouTube comments', watch: 'Watch on YouTube', og: 'Recorded session · Free',
      badge: null, badgeShort: null, startsIn: null })
  })
  it('formatDuration', () => {
    expect(formatDuration({ ...rec, durationMin: 45 })).toBe('45 min')
    expect(formatDuration(rec)).toBeNull()
    expect(formatDuration(live)).toBe('60 min, incl. Q&A')
  })
  it('videoLink', () => {
    expect(videoLink(rec)).toBeNull()
    expect(videoLink({ ...rec, streamUrl: 'S' })).toBe('S')
    expect(videoLink({ ...rec, streamUrl: 'S', videoUrl: 'V' })).toBe('V')
    expect(videoLink({ ...rec, streamUrl: 'S', videoUrl: 'V', recordingUrl: 'R' })).toBe('R')
  })
  it('rowState: watch, coming, video-soon', () => {
    const now = at('2026-12-09T17:00:00Z')
    expect(rowState({ ...rec, videoUrl: vid }, now, null)).toBe('watch')
    expect(rowState(rec, now, null)).toBe('video-soon')
    expect(rowState(rec, at('2026-12-09T10:00:00Z'), null)).toBe('coming')
    expect(rowState(rec, at('2026-12-09T10:00:00Z'), rec)).toBe('coming')
  })
  it('featuredForHub: recent release, else next upcoming', () => {
    const f = (iso) => featuredForHub(events, at(iso))?.slug
    expect(f('2026-12-15T00:00:00Z')).toBe('mergelock')
    expect(f('2026-12-17T00:00:00Z')).toBe('unasked')
    expect(f('2026-12-24T00:00:00Z')).toBe('zero-egress')
    expect(f('2026-11-20T00:00:00Z')).toBe('mergelock')
    expect(f('2028-01-01T00:00:00Z')).toBeUndefined()
  })
})
