import { readFileSync } from 'node:fs'
import { escapeHtml, withMeta, eventMeta, hubMeta, renderPages, sitemap } from './prerender-events.mjs'
import { FIXTURE_EVENTS } from '../src/test/eventsFixture.js'

const html = readFileSync('index.html', 'utf8')
const site = 'https://openastra.org'

describe('prerender-events', () => {
  it('stamps talk meta', () => {
    const out = withMeta(html, eventMeta(FIXTURE_EVENTS[0], site))
    expect(out).toContain(
      '<meta property="og:title" content="Merge conflicts git can&#39;t see · OpenAstra Talks" />',
    )
    expect(out).toContain('<meta property="og:url" content="https://openastra.org/events/merge-conflicts/" />')
    expect(out).toContain('<link rel="canonical" href="https://openastra.org/events/merge-conflicts/" />')
    expect(out).toContain('og:description" content="Sat 12 Dec 2026, 17:00 UTC · Webcast premiere · Free.')
    for (const k of ['og:title', 'og:description', 'twitter:title']) {
      expect(out.match(new RegExp(`(?:property|name)="${k}"`, 'g')), k).toHaveLength(1)
    }
  })

  it('recorded sessions describe themselves as recorded', async () => {
    const { events } = await import('../src/data/events.js')
    const m = eventMeta(events.find((e) => e.slug === 'mergelock'), site)
    expect(m.description).toContain('Wed 9 Dec 2026 · Recorded session · Free. When several')
  })

  it('escapes HTML in meta', () => {
    const out = withMeta(html, { title: 'A "B" & <C>', description: 'd', url: site, image: site })
    expect(out).toContain('A &quot;B&quot; &amp; &lt;C&gt;')
    expect(out).not.toContain('<C>')
    expect(escapeHtml("'")).toBe('&#39;')
  })

  it('keeps the app shell', () => {
    const out = withMeta(html, eventMeta(FIXTURE_EVENTS[0], site))
    expect(out).toContain('<div id="root"></div>')
    expect(out).toContain('/src/main.jsx')
    expect(out.match(/<title>/g)).toHaveLength(1)
  })

  it('writes the hub with no events', () => {
    const pages = renderPages(html, [], site)
    expect(pages).toHaveLength(1)
    expect(pages[0].path).toBe('events/index.html')
  })

  it('renders a page per event', () => {
    const pages = renderPages(html, FIXTURE_EVENTS, site)
    expect(pages.map((p) => p.path)).toContain('events/merge-conflicts/index.html')
  })

  it('omits the summary sentence when there is none', () => {
    const m = eventMeta({ ...FIXTURE_EVENTS[0], summary: undefined }, site)
    expect(m.description).toBe('Sat 12 Dec 2026, 17:00 UTC · Webcast premiere · Free.')
    expect(m.description).not.toContain('undefined')
  })

  it('uses a fixed month abbreviation in the OG date', () => {
    const m = eventMeta({ ...FIXTURE_EVENTS[0], start: '2026-09-12T17:00:00Z' }, site)
    expect(m.description).toContain('Sat 12 Sep 2026, 17:00 UTC')
  })

  it('hub description describes the recorded series', () => {
    expect(hubMeta(site).description).toBe(
      'One OpenAstra framework a week: a recorded session published every Wednesday on YouTube, with questions in the YouTube comments.',
    )
  })

  it('hub url has a trailing slash', () => {
    expect(hubMeta(site).url).toBe('https://openastra.org/events/')
  })

  it('sitemap lists only served, trailing-slash URLs', () => {
    const xml = sitemap(site, { eventSlugs: ['merge-conflicts'] })
    expect(xml).toContain('<loc>https://openastra.org/</loc>')
    expect(xml).toContain('<loc>https://openastra.org/events/</loc>')
    expect(xml).toContain('<loc>https://openastra.org/events/merge-conflicts/</loc>')
    expect(xml.match(/<loc>/g)).toHaveLength(3)
  })

  it('robots.txt points at the sitemap', () => {
    const txt = readFileSync('public/robots.txt', 'utf8')
    expect(txt).toContain('User-agent: *')
    expect(txt).toContain('Allow: /')
    expect(txt).toContain('Sitemap: https://openastra.org/sitemap.xml')
  })
})
