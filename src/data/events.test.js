import { events } from './events'
import { FIXTURE_EVENTS } from '../test/eventsFixture'
import { getAuthor } from './authors'
import { getFramework } from './frameworks'

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
  it('uses https registration links', () => {
    list.forEach((e) => {
      if (e.registerUrl) expect(e.registerUrl.startsWith('https://')).toBe(true)
    })
  })
})
