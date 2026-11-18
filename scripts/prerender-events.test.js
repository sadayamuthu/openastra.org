import { readFileSync } from 'node:fs'
import { escapeHtml, withMeta, eventMeta, renderPages, sitemap } from './prerender-events.mjs'
import { FIXTURE_EVENTS } from '../src/test/eventsFixture.js'

const html = readFileSync('index.html', 'utf8')
const site = 'https://openastra.org'

describe('prerender-events', () => {
  it('stamps talk meta', () => {
    const out = withMeta(html, eventMeta(FIXTURE_EVENTS[0], site))
    expect(out).toContain(
      '<meta property="og:title" content="Merge conflicts git can&#39;t see · OpenAstra Talks" />',
    )
    expect(out).toContain('<meta property="og:url" content="https://openastra.org/events/merge-conflicts" />')
    expect(out).toContain('<link rel="canonical" href="https://openastra.org/events/merge-conflicts" />')
    expect(out).toContain('og:description" content="Sat 12 Dec 2026, 17:00 UTC · Online · Free.')
    expect(out).toContain('name="twitter:title"')
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

  it('sitemap lists events and frameworks', () => {
    const xml = sitemap(site, {
      navPaths: ['/events', '/about'],
      frameworkSlugs: ['mergelock'],
      eventSlugs: ['merge-conflicts'],
    })
    expect(xml).toContain('<loc>https://openastra.org/events/merge-conflicts</loc>')
    expect(xml).toContain('<loc>https://openastra.org/mergelock</loc>')
    expect(xml).toContain('<loc>https://openastra.org/events</loc>')
  })
})
