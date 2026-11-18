import { FIXTURE_EVENTS as E, FIXTURE_NOW as NOW } from '../test/eventsFixture'
import { eventStatus, upcomingEvents, pastEvents, featuredEvent, findEvent, formatWhen,
  formatDuration, toIcs, youtubeEmbedUrl, videoFor } from './events'
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
it('formats duration including Q&A', () => {
  expect(formatDuration(live)).toBe('60 min, incl. Q&A')
})
it('toIcs builds a valid event', () => {
  const ics = toIcs(live)
  ;['BEGIN:VCALENDAR', 'BEGIN:VEVENT', 'UID:merge-conflicts@openastra.org', 'DTSTART:20261212T170000Z',
    'DTEND:20261212T180000Z', 'URL:https://openastra.org/events/merge-conflicts', 'END:VCALENDAR']
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
    `https://www.youtube.com/embed/${id}`].forEach((u) => expect(youtubeEmbedUrl(u)).toBe(out))
  ;[null, '', 'https://vimeo.com/1', 'not a url'].forEach((u) => expect(youtubeEmbedUrl(u)).toBeNull())
})
it('videoFor picks countdown, stream, recording or none', () => {
  expect(videoFor(E[1], NOW).kind).toBe('countdown')
  expect(videoFor(live, NOW)).toEqual({ kind: 'stream', embed: 'https://www.youtube-nocookie.com/embed/abc123DEF45' })
  expect(videoFor(E.find((e) => e.slug === 'introducing-openastra'), NOW).embed).toContain('rec11111111')
  expect(videoFor(live, at('2026-12-13T00:00:00Z')).kind).toBe('recording') // overrun: stream URL kept
  expect(videoFor(E.find((e) => e.slug === 'research-agenda'), NOW)).toEqual({ kind: 'none', embed: null })
})
