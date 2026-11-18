import { existsSync } from 'node:fs'
import { events } from './events'
import { FIXTURE_EVENTS } from '../test/eventsFixture'
import { getAuthor } from './authors'
import { getFramework } from './frameworks'
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
