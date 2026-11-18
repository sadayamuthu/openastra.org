# OpenAstra Events (`/events`): design

Date: 2026-11-18 · Status: draft for approval

## Intent

OpenAstra wants a community side: talks, a podcast/webcast, community-published,
peer-reviewed papers (in the style of CSA and Cyber Risk Alliance) and, eventually,
a conference. Those are four separate projects, and the conference is dropped for now. This design covers only the first
step: **a home for an online tech-talk series, "OpenAstra Talks", given by the
founder and the lab's authors.**

Each talk presents one framework or research area, so the series promotes the
frameworks, connects visitors to their authors, and builds an audience
for the later projects (podcast, call for papers).

## Decided with the owner

- **Address:** `openastra.org/events`, inside the existing site (not a subdomain).
- **Shape:** one hub (option A in the wireframe), not a "Community" section with
  separate pillars. It can split into pillars later, once each has content.
- **First event:** an online tech talk; the speakers are the founder and authors.
- **Item types:** two, not three. *Live* (talks, online now, in person later; a
  webcast is simply an online talk) and *On demand* (recordings of past talks, and later
  podcast episodes). "Podcast" is not a separate thing yet.
- **Build approach:** talks live in a data file in the repo, with Luma for
  registration and YouTube Live for streaming (approach 1 below).
- **Wireframes:** `docs/wire/events.html` is the full wireframe (hub in all states,
  talk page before/during/after, mobile, nav/footer).

## Goals

1. `/events` hub: the next talk at the top, then upcoming talks, then on-demand recordings.
2. A page per talk at `/events/<slug>`: title, date/time, summary, speakers, related
   framework(s), Register and Add-to-calendar buttons, and a video area.
3. A talk changes from *upcoming* to *live* to *past* based on its date alone, with no edit needed:
   - upcoming: countdown + Register
   - live (start → start + duration): embedded YouTube live stream
   - past: embed `recordingUrl` if set; otherwise keep embedding `streamUrl` (a YouTube
     Live URL turns into the recording by itself, so overrunning talks aren't cut off
     and nobody has to edit the file right after a talk); only with neither does it
     show "Recording coming soon"
4. Adding a talk means adding one entry to `src/data/events.js` in a PR.
5. "Events" appears in the navbar and footer (between Research and About).
6. Shared links preview the talk: `/events` and every `/events/<slug>` are served as
   real HTML files with their own title, description and Open Graph / Twitter tags, and
   load with HTTP 200 (not via the `404.html` fallback), so LinkedIn/X previews and
   search engines see each talk.

## Non-goals (this round)

- In-person events: the data model should allow a `location`, but nothing is designed for venues or maps.
- Podcast feed/RSS, call for papers, peer review: call for papers appears only as a
  "soon" tab and card on the hub, with no page behind it. The podcast appears only as a
  "Later" placeholder card under On demand.
- Conference: dropped for now; not mentioned anywhere on the site.
- Accounts, logins, comments, or any server/backend.
- Collecting emails on openastra.org: Luma holds the attendee list.

## Anti-goals

- A hub that looks dead. With zero upcoming talks the page must still read well
  (e.g. "Next talk announced soon", plus recordings); never an empty list.
- Looking like an embedded third-party widget. The pages are in the site's own style
  (paper/ink/rust, Newsreader/Inter, the existing `Eyebrow`, `Pill`, `Button` components).
- Wrong times. Times are stored in UTC and shown in the visitor's own time zone,
  with the zone named. A talk shown at the wrong hour is a failure.

## Approaches considered

1. **Data file + Luma + YouTube Live: chosen.** Talks live in a repo file, and the pages
   use the site's own design. Luma handles sign-ups, confirmation and
   reminder emails, and calendar invites, and lets the owner export the list. YouTube Live streams the talk and keeps the
   recording. Fits GitHub Pages with no server. Trade-off: the sign-up list lives in Luma.
2. *Embed a Luma calendar on /events*: least code, but the hub looks like Luma, talk
   pages live on lu.ma (lost links to authors/frameworks, SEO goes to lu.ma).
3. *Own backend (Supabase / Cloudflare Workers) for registration*: owns the list,
   but brings email delivery, consent/privacy and spam handling before the first talk. Revisit at conference scale.

## Design

### Data: `src/data/events.js`

```js
export const events = [
  {
    slug: 'securing-parallel-agents',          // URL: /events/<slug>
    title: "Merge conflicts git can't see",
    subtitle: 'Securing parallel coding agents',
    kind: 'talk',                               // only 'talk' for now
    format: 'online',                           // 'online' | 'in-person' (later)
    start: '2026-12-12T17:00:00Z',              // UTC, ISO 8601
    durationMin: 60,                            // talk + Q&A; ends the "live" window
    summary: 'One paragraph: what it covers, who it is for.',
    speakers: ['karthikeyan-sadayamuthu', 'vinodh-kannan-sadayamuthu'], // author slugs
    frameworks: ['mergelock'],                  // framework slugs; may be [] (talk on a research area)
    registerUrl: 'https://lu.ma/…',
    streamUrl: 'https://www.youtube.com/watch?v=…',     // live stream (optional until known)
    recordingUrl: null,                         // set after the talk; may equal streamUrl
  },
]
```

Speakers resolve through `src/data/authors.js` (the same slugs `authorPath` uses), and
frameworks through `getFramework`. Data tests check that every slug resolves, slugs
are unique, and `start` parses as UTC.

### Status (pure function, tested)

`eventStatus(event, now)` → `'upcoming' | 'live' | 'past'`, where live is
`start ≤ now < start + durationMin`. The talk page re-checks status every minute so a
page left open flips to the stream at start time.

### `/events` hub

- Eyebrow "OpenAstra Talks · Online", h1 "Events".
- Tabs (`Pill`s): All · Live & upcoming · On demand · Call for papers *(soon)*. No Conference tab (dropped for now).
  "Live & upcoming" lists upcoming and live talks, "On demand" lists every past talk (newest first).
  A past talk with no video yet still appears, as a card marked "Recording soon", so a
  finished talk never disappears from the hub. The "soon" tab is a
  non-clickable dashed pill, like the existing "Coming soon" styling.
- Featured card: the next upcoming (or currently live) talk with date, speakers,
  Register and Add-to-calendar.
- Upcoming list, then On-demand list (newest first).
- Empty states: no upcoming → "Next talk announced soon"; no recordings → "Recordings appear here after each talk".

### `/events/<slug>` talk page

- Back link, eyebrow (kind · format · Free), title, date/time in the visitor's zone, duration.
- Register (opens Luma) + Add to calendar (download a generated `.ics` file; no service needed).
- Video area by status: countdown → YouTube embed of `streamUrl` → embed of `recordingUrl`.
- Summary, speakers (linked to `/about/<slug>` profiles), related frameworks (linked to
  framework pages, DOI tag only when the framework has one). The section is hidden when
  `frameworks` is empty.
- Hidden on past talks: Register, Add to calendar.
- `durationMin` covers talk + Q&A; the page shows it as one length (e.g. "60 min, incl. Q&A").
- Document title: `<title> · Events · OpenAstra`.
- Unknown slug → existing NotFound page.

### Link previews and indexing (decided: yes)

- A post-build script (e.g. `scripts/prerender-events.mjs`, run after `vite build`
  in `npm run build`) reads `src/data/events.js` and writes
  `dist/events/index.html` and `dist/events/<slug>/index.html`: copies of
  `dist/index.html` with `<title>`, `meta description`, `og:*`, `twitter:*` and
  `link rel=canonical` replaced for that page. React then mounts as normal.
- Talk description = `summary`; title = `<title> · OpenAstra Talks`; the og:description
  leads with the date in UTC (e.g. "Thu 12 Dec 2026, 17:00 UTC · Online · Free").
- Image: the site's `og-image.png` unless the event sets an optional `image` field
  (a 1200×630 file in `public/events/`). Generated per-talk images are a later step.
- Also writes `dist/sitemap.xml` entries for the events pages (create the sitemap if none exists).
- The deploy workflow needs no extra step if this runs inside `npm run build`; a test
  checks that the build output contains each talk's HTML file with its own `og:title`.

### Site integration

- Routes `/events` and `/events/:slug` in `src/App.jsx`. No framework slug collides with `events`.
- `NAV_LINKS` gains Events (navbar + footer pick it up).
- Home: no change this round (could later get a "Next talk" strip).

## Calls made in review (owner to confirm)

- Per-talk preview image defaults to the site's OG image; a custom one is optional per talk.
- Talks that run over keep showing the stream (see goal 3), instead of cutting to "Recording coming soon".
- Past talks without a recording still show under On demand, marked "Recording soon".
- A talk can be about a research area with no framework (`frameworks: []`).

## Left to the builder

- Countdown granularity and copy; exact `.ics` fields.
- YouTube embed parameters (privacy-enhanced `youtube-nocookie.com` preferred).
- Whether the hub's tabs filter in place or use a `?tab=` query (the Frameworks page uses `?category=`; follow it).
- Component split and file names beyond those named here.

## Owner to-dos (outside the code)

- Create a free Luma account/calendar and a YouTube channel able to go live.
- Pick the first talk's title, date and speakers; the wireframe entries are placeholders.
