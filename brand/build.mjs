#!/usr/bin/env node
// OpenAstra brand kit builder.
// Generates every logo, social, app-icon, web and motion asset from the A1 "Open Orbit" geometry.
// Requires on PATH: hb-view (harfbuzz), rsvg-convert (librsvg), ffmpeg.
// Usage: node brand/build.mjs            (writes brand/** and copies web icons into public/)

import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(ROOT, '..', 'public')
const FONTS = join(ROOT, 'fonts')
const TMP = mkdtempSync(join(tmpdir(), 'oa-brand-'))

// ── Tokens ────────────────────────────────────────────────────────────────
export const C = {
  paper: '#F6F3EC', card: '#FFFDF8', ink: '#1B1B1B', muted: '#5E5B55',
  rule: '#D9D4C8', rust: '#B4441F', rustLight: '#E0724A',
}
const THEMES = {
  paper: { bg: C.paper, ring: C.ink, star: C.rust, text: C.ink, muted: C.muted, accent: C.rust, wash: '#E8E3D8', rule: '#CFC9BC' },
  ink: { bg: C.ink, ring: C.paper, star: C.rustLight, text: C.paper, muted: '#B5B0A6', accent: C.rustLight, wash: '#2B2A27', rule: '#3A3935' },
}

// ── Mark geometry (100u grid) ─────────────────────────────────────────────
// Ring: r34 about (50,50), open from −10° to −80°. Star: concave 4-point, centre (77,23).
const RING = 'M83.48 44.10 A34 34 0 1 1 55.90 16.52'
const RING_LEN = 172.09 // 290° of r34
const STAR = 'M77 10 Q79 21 90 23 Q79 25 77 36 Q75 25 64 23 Q75 21 77 10Z'
const STAR_SMALL = 'M78 6 Q81 19 95 22 Q81 25 78 38 Q75 25 61 22 Q75 19 78 6Z' // favicon cut, ≤48px

function mark({ ring = C.ink, star = C.rust, small = false, stroke, ringExtra = '', starTransform = '' } = {}) {
  const sw = stroke ?? (small ? 13 : 10)
  const t = starTransform ? ` transform="${starTransform}"` : ''
  return `<path d="${RING}" fill="none" stroke="${ring}" stroke-width="${sw}" stroke-linecap="round"${ringExtra}/>` +
    `<path d="${small ? STAR_SMALL : STAR}" fill="${star}"${t}/>`
}
// Place the 100u mark box centred on (cx, cy) at `box` px.
function placeMark(cx, cy, box, opts) {
  const k = box / 100
  return `<g transform="translate(${r(cx - 50 * k)} ${r(cy - 50 * k)}) scale(${r(k, 5)})">${mark(opts)}</g>`
}
const r = (n, d = 2) => +n.toFixed(d)

// ── Text → outlined paths (hb-view) ───────────────────────────────────────
let uid = 0
const shapeCache = new Map()
function shape({ str, italic = false, mono = false, size, color, wght = 400 }) {
  const font = mono ? 'JetBrainsMono.ttf' : italic ? 'Newsreader-Italic.ttf' : 'Newsreader.ttf'
  const vars = mono ? `wght=${wght}` : `opsz=${Math.min(72, Math.max(6, Math.round(size / 1.5)))},wght=${wght}`
  const key = [font, vars, r(size), color, str].join('|')
  if (!shapeCache.has(key)) {
    const out = join(TMP, `hb${shapeCache.size}.svg`)
    execFileSync('hb-view', [`--font-file=${join(FONTS, font)}`, `--variations=${vars}`, `--font-size=${r(size)}`,
      '--margin=0', `--foreground=${color.slice(1)}`, '--output-format=svg', '-o', out, str])
    const s = readFileSync(out, 'utf8')
    shapeCache.set(key, {
      w: +s.match(/<svg[^>]*\swidth="([\d.]+)/)[1],
      baseline: +(s.match(/<use[^>]*\sy="([\d.-]+)"/)?.[1] ?? size * 0.735),
      body: s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<rect[^>]*\/>/g, ''),
    })
  }
  return shapeCache.get(key)
}
const measure = (runs) => runs.reduce((a, x) => a + shape(x).w + (x.dx || 0), 0)
function drawRuns(runs, x, baseline) {
  let cx = x, out = ''
  for (const run of runs) {
    cx += run.dx || 0
    const s = shape(run)
    const p = `g${uid++}-`
    const body = s.body.replace(/id="/g, `id="${p}`).replace(/href="#/g, `href="#${p}`).replace(/url\(#/g, `url(#${p}`)
    out += `<g transform="translate(${r(cx)} ${r(baseline - s.baseline)})">${body}</g>`
    cx += s.w
  }
  return out
}

// ── Building blocks ───────────────────────────────────────────────────────
const wordmarkRuns = (F, color) => [
  { str: 'Open', size: F, color },
  { str: 'Astra', italic: true, size: F, color, dx: -0.015 * F },
]
const taglineRuns = (Ft, th) => [
  { str: 'Security research for the age of', size: Ft, color: th.text },
  { str: 'autonomous agents', italic: true, size: Ft, color: th.accent, dx: 0.12 * Ft },
  { str: '.', size: Ft, color: th.text },
]
const urlRuns = (Fu, th) => [{ str: 'openastra.org  ·  open frameworks  ·  citable releases', mono: true, size: Fu, color: th.muted }]

function lockup(F, th, { small = false } = {}) {
  const M = 1.16 * F, gap = 0.3 * F
  const wm = wordmarkRuns(F, th.text)
  return {
    w: M + gap + measure(wm),
    draw: (x, baseline) => placeMark(x + M / 2, baseline - 0.34 * F, M, { ring: th.ring, star: th.star, small }) + drawRuns(wm, x + M + gap, baseline),
  }
}

// Stacked text block: lockup / tagline / url. Returns {w,h,draw(x,top,align)}.
function stackBlock(F, th, { url = true } = {}) {
  const L = lockup(F, th), Ft = 0.4 * F, Fu = 0.19 * F
  const T = taglineRuns(Ft, th), U = urlRuns(Fu, th)
  const lines = [
    { w: L.w, base: 0.92 * F, draw: (x, b) => L.draw(x, b) },
    { w: measure(T), base: 0.92 * F + 0.95 * F, draw: (x, b) => drawRuns(T, x, b) },
  ]
  if (url) lines.push({ w: measure(U), base: 0.92 * F + 1.57 * F, draw: (x, b) => drawRuns(U, x, b) })
  const w = Math.max(...lines.map((l) => l.w))
  const h = url ? 2.55 * F : 2.0 * F
  return {
    w, h,
    draw: (x, top, align) => lines.map((l) => {
      const lx = align === 'left' ? x : align === 'right' ? x + w - l.w : x + (w - l.w) / 2
      return l.draw(lx, top + l.base)
    }).join(''),
  }
}

// Row block: lockup | rule | tagline (for very wide, short covers).
function rowBlock(F, th) {
  const L = lockup(F, th), Ft = 0.36 * F
  const T = taglineRuns(Ft, th)
  const gap = 0.55 * F
  const w = L.w + 2 * gap + measure(T)
  return {
    w, h: 1.2 * F,
    draw: (x, top) => {
      const b = top + 0.95 * F
      const rx = x + L.w + gap
      return L.draw(x, b) +
        `<rect x="${r(rx)}" y="${r(b - 0.92 * F)}" width="${r(Math.max(1.5, 0.025 * F))}" height="${r(1.12 * F)}" fill="${th.rule}"/>` +
        drawRuns(T, rx + gap, b - 0.34 * F + 0.34 * Ft)
    },
  }
}

const svgDoc = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + `</svg>`

// ── Compositions ──────────────────────────────────────────────────────────
function watermark(w, h, th, side) {
  const Wm = 1.25 * h
  const cx = side === 'right' ? w - 0.36 * Wm : 0.3 * Wm
  return `<g opacity="0.9">${placeMark(cx, 0.62 * h, Wm, { ring: th.wash, star: th.accent })}</g>`
}

function banner({ w, h, theme = 'paper', layout = 'stack', align = 'left', pad = 0.07, cy = 0.5, wm = 'right', maxW = 0.62, hFrac = 0.62, url = true }) {
  const th = THEMES[theme]
  const make = (F) => (layout === 'row' ? rowBlock(F, th) : stackBlock(F, th, { url }))
  const probe = make(100)
  const F = Math.min((hFrac * h) / (probe.h / 100), (maxW * w) / (probe.w / 100))
  const B = make(F)
  const x = align === 'left' ? pad * w : align === 'right' ? w - pad * w - B.w : (w - B.w) / 2
  const top = cy * h - B.h / 2
  return svgDoc(w, h, (wm ? watermark(w, h, th, wm) : '') + B.draw(x, top, align), th.bg)
}

function poster({ w, h, theme = 'paper', markY = 0.38 }) {
  const th = THEMES[theme]
  const M = 0.46 * w, cy = markY * h
  const F = 0.12 * w, Ft = 0.045 * w, Fu = 0.022 * w
  const wm = wordmarkRuns(F, th.text)
  const wb = cy + 0.39 * M + 1.3 * F
  const l1 = [{ str: 'Security research for the age of', size: Ft, color: th.text }]
  const l2 = [{ str: 'autonomous agents.', italic: true, size: Ft, color: th.accent }]
  const U = urlRuns(Fu, th)
  const center = (runs, b) => drawRuns(runs, (w - measure(runs)) / 2, b)
  return svgDoc(w, h,
    placeMark(w / 2, cy, M, { ring: th.ring, star: th.star }) +
    center(wm, wb) + center(l1, wb + 0.8 * F) + center(l2, wb + 0.8 * F + 1.35 * Ft) +
    center(U, h - (h / w > 1.5 ? 0.16 * h : Math.max(0.07 * h, 0.08 * w))), th.bg)
}

function avatar(size, theme = 'paper', { box = 0.8, small = false } = {}) {
  const th = THEMES[theme]
  return svgDoc(size, size, placeMark(size / 2, size / 2, box * size, { ring: th.ring, star: th.star, small }), th.bg)
}

function icon(size, { bg = C.paper, ring = C.ink, star = C.rust, box = 0.7, shape = 'square', small = size <= 72, stroke } = {}) {
  let back = ''
  if (bg && shape === 'square') back = `<rect width="${size}" height="${size}" fill="${bg}"/>`
  if (bg && shape === 'rounded') back = `<rect width="${size}" height="${size}" rx="${r(size * 0.22)}" fill="${bg}"/>`
  if (bg && shape === 'circle') back = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/>`
  return svgDoc(size, size, back + placeMark(size / 2, size / 2, box * size, { ring, star, small, stroke }))
}

// ── IO helpers ────────────────────────────────────────────────────────────
function ensure(p) { mkdirSync(dirname(p), { recursive: true }) }
function writeSvg(rel, svg) { const p = join(ROOT, rel); ensure(p); writeFileSync(p, svg); return p }
function png(rel, svg, w, h) {
  const src = join(TMP, `r${uid++}.svg`)
  writeFileSync(src, svg)
  const out = join(ROOT, rel); ensure(out)
  const args = [src, '-o', out]
  if (w) args.unshift('-w', String(w))
  if (h) args.unshift('-h', String(h))
  execFileSync('rsvg-convert', args)
  return out
}
function ico(rel, pngPaths) {
  const imgs = pngPaths.map((p) => readFileSync(p))
  const header = Buffer.alloc(6 + 16 * imgs.length)
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4)
  let offset = header.length
  imgs.forEach((buf, i) => {
    const size = buf.readUInt32BE(16) // PNG IHDR width
    const e = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, e); header.writeUInt8(size >= 256 ? 0 : size, e + 1)
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6)
    header.writeUInt32LE(buf.length, e + 8); header.writeUInt32LE(offset, e + 12)
    offset += buf.length
  })
  const out = join(ROOT, rel); ensure(out)
  writeFileSync(out, Buffer.concat([header, ...imgs]))
  return out
}
const log = (s) => process.stdout.write(s + '\n')

// ── 1. Logo SVG / PNG ─────────────────────────────────────────────────────
function buildLogos() {
  const markSvg = (opts, vb = '0 0 100 100') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="512" height="512" role="img" aria-label="OpenAstra">${mark(opts)}</svg>`
  const variants = {
    'openastra-mark': { ring: C.ink, star: C.rust },
    'openastra-mark-reversed': { ring: C.paper, star: C.rustLight },
    'openastra-mark-mono-ink': { ring: C.ink, star: C.ink },
    'openastra-mark-mono-white': { ring: '#FFFFFF', star: '#FFFFFF' },
    'openastra-mark-small': { ring: C.ink, star: C.rust, small: true },
  }
  for (const [name, opts] of Object.entries(variants)) {
    const svg = markSvg(opts)
    writeSvg(`logo/svg/${name}.svg`, svg)
    for (const s of opts.small ? [64, 128] : [256, 512, 1024]) png(`logo/png/${name}-${s}.png`, svg, s, s)
  }
  for (const [name, theme] of [['openastra-lockup', 'paper'], ['openastra-lockup-reversed', 'ink']]) {
    const F = 100, L = lockup(F, THEMES[theme]), pad = 0.12 * F
    const w = Math.ceil(L.w + 2 * pad), h = Math.ceil(1.42 * F)
    const svg = svgDoc(w, h, L.draw(pad, pad + 0.93 * F))
    writeSvg(`logo/svg/${name}.svg`, svg)
    png(`logo/png/${name}-2000w.png`, svg, 2000)
    png(`logo/png/${name}-on-bg-2000w.png`, svgDoc(w, h, L.draw(pad, pad + 0.93 * F), THEMES[theme].bg), 2000)
  }
  { // stacked
    const th = THEMES.paper, F = 100, M = 1.9 * F, wm = wordmarkRuns(F, th.text), ww = measure(wm)
    const w = Math.ceil(Math.max(M, ww) + 0.3 * F), h = Math.ceil(M + 1.35 * F)
    const svg = svgDoc(w, h, placeMark(w / 2, M / 2 + 0.05 * F, M, { ring: th.ring, star: th.star }) + drawRuns(wm, (w - ww) / 2, M + 0.95 * F))
    writeSvg('logo/svg/openastra-lockup-stacked.svg', svg)
    png('logo/png/openastra-lockup-stacked-1200w.png', svg, 1200)
  }
  { // wordmark only
    const wm = wordmarkRuns(100, C.ink), w = Math.ceil(measure(wm) + 20)
    const svg = svgDoc(w, 125, drawRuns(wm, 10, 92))
    writeSvg('logo/svg/openastra-wordmark.svg', svg)
    png('logo/png/openastra-wordmark-1600w.png', svg, 1600)
  }
  log('✓ logo')
}

// ── 2. Social ─────────────────────────────────────────────────────────────
function buildSocial() {
  const jobs = [
    // profile pictures (circle-safe: mark stays inside 80% of the crop)
    ['social/linkedin/linkedin-profile-400.png', avatar(400), 400],
    ['social/github/github-avatar-500.png', avatar(500), 500],
    ['social/x/x-profile-400.png', avatar(400), 400],
    ['social/facebook/facebook-profile-720.png', avatar(720), 720],
    ['social/instagram/instagram-profile-1080.png', avatar(1080), 1080],
    ['social/_profile/profile-1080-paper.png', avatar(1080, 'paper'), 1080],
    ['social/_profile/profile-1080-ink.png', avatar(1080, 'ink'), 1080],
    // covers & banners
    ['social/linkedin/linkedin-company-cover-1128x191.png', banner({ w: 1128, h: 191, layout: 'row', align: 'right', pad: 0.05, wm: 'left', maxW: 0.74, hFrac: 0.62 })],
    ['social/linkedin/linkedin-personal-cover-1584x396.png', banner({ w: 1584, h: 396, align: 'right', pad: 0.06, wm: 'left', maxW: 0.55, hFrac: 0.72 })],
    ['social/linkedin/linkedin-post-1200x627.png', banner({ w: 1200, h: 627, maxW: 0.7 })],
    ['social/github/github-social-preview-1280x640.png', banner({ w: 1280, h: 640, maxW: 0.68 })],
    ['social/github/github-readme-banner-1280x320.png', banner({ w: 1280, h: 320, maxW: 0.62, hFrac: 0.78 })],
    ['social/github/github-readme-banner-dark-1280x320.png', banner({ w: 1280, h: 320, theme: 'ink', maxW: 0.62, hFrac: 0.78 })],
    ['social/x/x-header-1500x500.png', banner({ w: 1500, h: 500, cy: 0.44, maxW: 0.58, hFrac: 0.6 })],
    ['social/x/x-post-1600x900.png', banner({ w: 1600, h: 900, maxW: 0.66 })],
    ['social/facebook/facebook-cover-1640x624.png', banner({ w: 1640, h: 624, align: 'center', maxW: 0.56, hFrac: 0.6 })],
    ['social/facebook/facebook-post-1200x630.png', banner({ w: 1200, h: 630, maxW: 0.7 })],
    ['social/instagram/instagram-post-1080x1080.png', poster({ w: 1080, h: 1080, markY: 0.33 })],
    ['social/instagram/instagram-post-dark-1080x1080.png', poster({ w: 1080, h: 1080, theme: 'ink', markY: 0.33 })],
    ['social/instagram/instagram-portrait-1080x1350.png', poster({ w: 1080, h: 1350, markY: 0.36 })],
    ['social/instagram/instagram-story-1080x1920.png', poster({ w: 1080, h: 1920, markY: 0.38 })],
    ['social/instagram/instagram-highlight-cover-1080x1920.png', svgDoc(1080, 1920, placeMark(540, 960, 560, { ring: C.paper, star: C.rustLight }), C.ink)],
    ['web/og-image-1200x630.png', banner({ w: 1200, h: 630, maxW: 0.7 })],
  ]
  for (const [rel, svg, size] of jobs) png(rel, svg, size, size)
  log('✓ social')
}

// ── 3. App icons ──────────────────────────────────────────────────────────
function buildAppIcons() {
  // iOS — single 1024 source; Xcode 14+ derives the rest. Light / dark / tinted appearances.
  png('app-icons/ios/AppIcon.appiconset/AppIcon-1024.png', icon(1024, { box: 0.66 }))
  png('app-icons/ios/AppIcon.appiconset/AppIcon-1024-dark.png', icon(1024, { bg: null, ring: C.paper, star: C.rustLight, box: 0.66 }))
  png('app-icons/ios/AppIcon.appiconset/AppIcon-1024-tinted.png', icon(1024, { bg: '#000000', ring: '#FFFFFF', star: '#C8C8C8', box: 0.66 }))
  writeSvg('app-icons/ios/AppIcon.appiconset/Contents.json', JSON.stringify({
    images: [
      { filename: 'AppIcon-1024.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
      { appearances: [{ appearance: 'luminosity', value: 'dark' }], filename: 'AppIcon-1024-dark.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
      { appearances: [{ appearance: 'luminosity', value: 'tinted' }], filename: 'AppIcon-1024-tinted.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
    ],
    info: { author: 'xcode', version: 1 },
  }, null, 2))
  for (const s of [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180]) png(`app-icons/ios/legacy/icon-${s}.png`, icon(s, { box: 0.7 }))

  // Android — adaptive (108dp → 432px @xxxhdpi; mark inside the 66dp safe circle) + legacy mipmaps + Play Store.
  png('app-icons/android/adaptive/ic_launcher_foreground.png', icon(432, { bg: null, box: 0.6 }))
  png('app-icons/android/adaptive/ic_launcher_background.png', svgDoc(432, 432, '', C.paper))
  png('app-icons/android/adaptive/ic_launcher_monochrome.png', icon(432, { bg: null, ring: '#FFFFFF', star: '#FFFFFF', box: 0.6 }))
  writeSvg('app-icons/android/adaptive/ic_launcher.xml',
    `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n  <background android:drawable="@mipmap/ic_launcher_background"/>\n  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n  <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>\n</adaptive-icon>\n`)
  for (const [dpi, s] of [['mdpi', 48], ['hdpi', 72], ['xhdpi', 96], ['xxhdpi', 144], ['xxxhdpi', 192]]) {
    png(`app-icons/android/mipmap-${dpi}/ic_launcher.png`, icon(s, { shape: 'rounded', box: 0.72 }))
    png(`app-icons/android/mipmap-${dpi}/ic_launcher_round.png`, icon(s, { shape: 'circle', box: 0.7 }))
  }
  png('app-icons/android/play-store-512.png', icon(512, { box: 0.66 }))

  // PWA
  png('app-icons/pwa/icon-192.png', icon(192, { shape: 'rounded', box: 0.72 }))
  png('app-icons/pwa/icon-512.png', icon(512, { shape: 'rounded', box: 0.72 }))
  png('app-icons/pwa/icon-maskable-512.png', icon(512, { box: 0.6 }))
  log('✓ app icons')
}

// ── 4. Web (favicons, manifest) ───────────────────────────────────────────
function buildWeb() {
  const vb = '8 2.5 90 90' // tight crop of the small cut
  const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><style>.r{stroke:${C.ink}}.s{fill:${C.rust}}@media (prefers-color-scheme:dark){.r{stroke:${C.paper}}.s{fill:${C.rustLight}}}</style><path class="r" d="${RING}" fill="none" stroke-width="13" stroke-linecap="round"/><path class="s" d="${STAR_SMALL}"/></svg>\n`
  writeSvg('web/favicon.svg', fav)
  const smallSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${mark({ small: true })}</svg>`
  const icoPngs = [16, 32, 48].map((s) => png(`web/favicon-${s}.png`, smallSvg, s, s))
  ico('web/favicon.ico', icoPngs)
  png('web/apple-touch-icon.png', icon(180, { box: 0.68, stroke: 11, small: false }))
  writeSvg('web/site.webmanifest', JSON.stringify({
    name: 'OpenAstra', short_name: 'OpenAstra',
    description: 'Security research for the age of autonomous agents.',
    start_url: '/', display: 'standalone', background_color: C.paper, theme_color: C.paper,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2) + '\n')

  // Copy the site-facing set into public/.
  const copies = [
    ['web/favicon.svg', 'favicon.svg'], ['web/favicon.ico', 'favicon.ico'], ['web/apple-touch-icon.png', 'apple-touch-icon.png'],
    ['web/site.webmanifest', 'site.webmanifest'], ['web/og-image-1200x630.png', 'og-image.png'],
    ['app-icons/pwa/icon-192.png', 'icon-192.png'], ['app-icons/pwa/icon-512.png', 'icon-512.png'], ['app-icons/pwa/icon-maskable-512.png', 'icon-maskable-512.png'],
  ]
  for (const [from, to] of copies) copyFileSync(join(ROOT, from), join(PUBLIC, to))
  log('✓ web (+ public/)')
}

// ── 5. Motion (GIF + MP4) ─────────────────────────────────────────────────
const clamp = (x) => Math.max(0, Math.min(1, x))
const easeOut = (x) => 1 - Math.pow(1 - x, 3)
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const backOut = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2)

// Intro loop (3.2s): ring draws → star pops in with a quarter turn → hold → ring retracts, star shrinks.
function introState(t) {
  const draw = easeOut(clamp(t / 0.9))
  const undraw = easeInOut(clamp((t - 2.7) / 0.5))
  const pop = clamp((t - 0.55) / 0.6)
  const out = easeInOut(clamp((t - 2.75) / 0.4))
  return { from: undraw, to: draw, starScale: backOut(pop) * (1 - out), starRot: -90 * (1 - easeOut(pop)) }
}
// Pulse loop (1.6s): ring static, star quarter-turns with a breath — seamless (4-fold symmetry).
function pulseState(t) {
  const p = easeInOut(clamp((t - 0.6) / 0.7))
  return { from: 0, to: 1, starScale: 1 + 0.22 * Math.sin(Math.PI * p), starRot: 90 * p }
}
function motionFrame({ from, to, starScale, starRot }, th) {
  const len = (to - from) * RING_LEN
  const ringExtra = len < 0.5 ? ' stroke-opacity="0"' : ` stroke-dasharray="${r(len)} 400" stroke-dashoffset="${r(-from * RING_LEN)}"`
  const st = `translate(77 23) rotate(${r(starRot)}) scale(${r(Math.max(0.0001, starScale), 4)}) translate(-77 -23)`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="-10" y="-10" width="120" height="120" fill="${th.bg}"/>${mark({ ring: th.ring, star: th.star, ringExtra, starTransform: st })}</svg>`
}
function renderMotion(name, stateFn, dur, { theme = 'paper', size = 512, fps = 30, formats = ['gif'], loops = 1, w, h }) {
  const th = THEMES[theme]
  const dir = mkdtempSync(join(TMP, 'f-'))
  const n = Math.round(dur * fps * loops)
  for (let i = 0; i < n; i++) {
    const t = (i / fps) % dur
    let svg = motionFrame(stateFn(t), th)
    if (w && h) { // place square animation inside a w×h canvas (e.g. stories)
      svg = svgDoc(w, h, `<svg x="${(w - size) / 2}" y="${(h - size) / 2}" width="${size}" height="${size}" viewBox="0 0 100 100">${svg.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`, th.bg)
    }
    const f = join(dir, `f${String(i).padStart(4, '0')}.svg`)
    writeFileSync(f, svg)
    execFileSync('rsvg-convert', [...(w ? [] : ['-w', String(size), '-h', String(size)]), f, '-o', f.replace('.svg', '.png')])
  }
  const input = ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', join(dir, 'f%04d.png')]
  for (const fmt of formats) {
    const out = join(ROOT, `motion/${name}.${fmt}`); ensure(out)
    if (fmt === 'gif') {
      execFileSync('ffmpeg', [...input, '-vf', 'split[a][b];[a]palettegen=max_colors=48:stats_mode=full[p];[b][p]paletteuse=dither=none', '-loop', '0', out])
    } else {
      execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out])
    }
  }
  rmSync(dir, { recursive: true, force: true })
  log(`✓ motion/${name} (${formats.join(', ')})`)
}
function buildMotion() {
  renderMotion('openastra-intro-512', introState, 3.2, { size: 512 })
  renderMotion('openastra-intro-dark-512', introState, 3.2, { size: 512, theme: 'ink' })
  renderMotion('openastra-pulse-256', pulseState, 1.6, { size: 256 })
  renderMotion('openastra-pulse-dark-256', pulseState, 1.6, { size: 256, theme: 'ink' })
  renderMotion('openastra-intro-1080', introState, 3.2, { size: 1080, formats: ['mp4'], loops: 3 })
  renderMotion('openastra-intro-dark-1080', introState, 3.2, { size: 1080, theme: 'ink', formats: ['mp4'], loops: 3 })
  renderMotion('openastra-story-1080x1920', introState, 3.2, { size: 700, w: 1080, h: 1920, formats: ['mp4'], loops: 3 })
}

// ── Run ───────────────────────────────────────────────────────────────────
const only = process.argv.slice(2)
const steps = { logos: buildLogos, social: buildSocial, apps: buildAppIcons, web: buildWeb, motion: buildMotion }
try {
  for (const [k, fn] of Object.entries(steps)) if (!only.length || only.includes(k)) fn()
} finally {
  rmSync(TMP, { recursive: true, force: true })
}
