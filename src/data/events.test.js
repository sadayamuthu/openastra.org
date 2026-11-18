import { existsSync } from 'node:fs'
import { events } from './events'
import { FIXTURE_EVENTS } from '../test/eventsFixture'
import { getAuthor } from './authors'
import { getFramework, shippedFrameworks } from './frameworks'
import { youtubeEmbedUrl } from '../lib/events'

describe.each([
  ['events', events],
  ['FIXTURE_EVENTS', FIXTURE_EVENTS],
])('%s data', (_name, list) => {
  it('has unique, url-safe slugs', () => {
    const slugs = list.map((e) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
  })
  it('has UTC ISO start times and positive durations', () => {
    list.forEach((e) => {
      expect(e.start).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
      expect(Number.isNaN(new Date(e.start).getTime())).toBe(false)
      expect(e.durationMin).toBeGreaterThan(0)
    })
  })
  it('resolves every speaker and framework', () => {
    list.forEach((e) => {
      e.speakers.forEach((s) => expect(getAuthor(s), s).toBeTruthy())
      e.frameworks.forEach((f) => expect(getFramework(f), f).toBeTruthy())
    })
  })
  it('has a title and summary', () => {
    list.forEach((e) => {
      expect(typeof e.title).toBe('string')
      expect(e.title.trim()).not.toBe('')
      expect(typeof e.summary).toBe('string')
      expect(e.summary.trim()).not.toBe('')
    })
  })
  it('has playable stream/recording URLs and an existing image', () => {
    list.forEach((e) => {
      if (e.streamUrl) expect(youtubeEmbedUrl(e.streamUrl), e.slug + ' streamUrl').toBeTruthy()
      if (e.recordingUrl) expect(youtubeEmbedUrl(e.recordingUrl), e.slug + ' recordingUrl').toBeTruthy()
      if (e.image) expect(existsSync('public/events/' + e.image), e.slug + ' image').toBe(true)
    })
  })
  it('uses https registration links', () => {
    list.forEach((e) => {
      if (e.registerUrl) expect(e.registerUrl.startsWith('https://')).toBe(true)
    })
  })
})

describe('framework-of-the-week series', () => {
  const series = events.filter((e) => e.series === 'framework-of-the-week')
  it('delivery is premiere or live when present', () => {
    events.forEach((e) => { if (e.delivery) expect(['premiere', 'live']).toContain(e.delivery) })
  })
  it('weeks are unique and run 1..N', () => {
    expect(series.map((e) => e.week).sort((a, b) => a - b)).toEqual(series.map((_, i) => i + 1))
  })
  it('every session is a Wednesday at 16:00:00Z', () => {
    series.forEach((e) => {
      expect(new Date(e.start).getUTCDay(), e.slug).toBe(3)
      expect(e.start.slice(11), e.slug).toBe('16:00:00Z')
    })
  })
  it('week order equals start order', () => {
    const by = (k) => [...series].sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0)).map((e) => e.slug)
    expect(by('week')).toEqual(by('start'))
  })
  it('every shipped framework appears in exactly one session', () => {
    shippedFrameworks().forEach((f) => {
      expect(series.filter((e) => e.frameworks.includes(f.slug)).length, `framework ${f.slug} needs exactly one framework-of-the-week session`).toBe(1)
    })
  })
})
