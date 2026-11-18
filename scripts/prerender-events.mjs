// Post-build step: stamps per-page link-preview meta into dist/index.html for
// /events and /events/<slug>, and writes dist/sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { events } from '../src/data/events.js'
import { MONTHS, deliveryCopy } from '../src/lib/events.js'

const SITE = 'https://openastra.org'

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Replace a tag matching `matcher` with `tag`, or insert before </head>.
function setTag(html, matcher, tag) {
  const re = new RegExp(`[ \\t]*${matcher}[^>]*>`)
  // Use a function replacer so `$` in values is never interpreted.
  if (re.test(html)) return html.replace(re, () => tag)
  return html.replace(/[ \t]*<\/head>/, () => `    ${tag}\n  </head>`)
}

const metaTag = (attr, key, value) => `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`

export function withMeta(html, { title, description, url, image }) {
  let out = html
  const meta = (attr, key, value) => {
    out = setTag(out, `<meta\\s+${attr}="${escapeRe(key)}"`, metaTag(attr, key, value))
  }
  out = out.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
  meta('name', 'description', description)
  meta('property', 'og:title', title)
  meta('property', 'og:description', description)
  meta('property', 'og:url', url)
  meta('property', 'og:image', image)
  meta('property', 'og:image:alt', title)
  meta('name', 'twitter:title', title)
  meta('name', 'twitter:description', description)
  meta('name', 'twitter:image', image)
  out = setTag(out, '<link\\s+rel="canonical"', `<link rel="canonical" href="${escapeHtml(url)}" />`)
  return out
}

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function utcWhen(iso) {
  const p = Object.fromEntries(dateFmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value]))
  return `${p.weekday} ${Number(p.day)} ${MONTHS[p.month - 1]} ${p.year}, ${p.hour}:${p.minute} UTC`
}

const utcDateOnly = (iso) => utcWhen(iso).replace(/,.*$/, '')

export function eventMeta(event, site = SITE) {
  const when = event.delivery === 'recorded' ? utcDateOnly(event.start) : utcWhen(event.start)
  return {
    title: `${event.title} · OpenAstra Talks`,
    description: `${when} · ${deliveryCopy(event).og}.${event.summary ? ` ${event.summary}` : ''}`,
    url: `${site}/events/${event.slug}/`,
    image: event.image ? `${site}/events/${event.image}` : `${site}/og-image.png`,
  }
}

export function hubMeta(site = SITE) {
  return {
    title: 'Events · OpenAstra',
    description:
      'One OpenAstra framework a week: a recorded session published every Wednesday on YouTube, with questions in the YouTube comments.',
    url: `${site}/events/`,
    image: `${site}/og-image.png`,
  }
}

export function renderPages(html, evts, site = SITE) {
  return [
    { path: 'events/index.html', html: withMeta(html, hubMeta(site)) },
    ...evts.map((e) => ({
      path: `events/${e.slug}/index.html`,
      html: withMeta(html, eventMeta(e, site)),
    })),
  ]
}

export function sitemap(site, { eventSlugs }) {
  const paths = ['/', '/events/', ...eventSlugs.map((s) => `/events/${s}/`)]
  const urls = paths.map((p) => `  <url><loc>${escapeHtml(site + p)}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function main() {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const dist = join(root, 'dist')
  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  const files = renderPages(html, events, SITE)
  files.push({
    path: 'sitemap.xml',
    html: sitemap(SITE, { eventSlugs: events.map((e) => e.slug) }),
  })
  for (const f of files) {
    const target = join(dist, f.path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, f.html)
    console.log(`prerender: wrote dist/${f.path}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
