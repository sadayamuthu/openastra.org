# OpenAstra Events (`/events`): design

Date: 2026-11-18 · Status: revision 2 draft for approval (revision 1 is built in PR #11)

## Revision 2: "Framework of the week" webcast premieres

Decided with the owner on 2026-11-18. Where this section conflicts with the rest of the
document, this section wins.

**What changes and why.** The series is mostly **recorded** sessions, not live talks.
Each one is a **YouTube Premiere**: the video is uploaded ahead of time and plays at a
scheduled time for everyone at once, with live chat beside it. The owner answers
questions in the chat while it plays. Afterwards the same link is the on-demand
recording. True live streaming comes later. This keeps the event feel (fixed time, Luma
reminders, live Q&A) without the risk of presenting live, and every session becomes
on-demand content.

**Schedule.** Wednesdays 16:00 UTC (9:30 PM IST · 4 PM GMT · 11 AM ET · 8 AM PT). This
is the best overlap for India, Europe and the US. There is a holiday break for the weeks of Dec 21 and 28.

| Week | Date (UTC) | Session | Frameworks | Length |
|---|---|---|---|---|
| 1 | Wed 2026-12-09 16:00 | MergeLock | mergelock | 60 min |
| 2 | Wed 2026-12-16 16:00 | Unasked | unasked | 60 min |
| 3 | Wed 2027-01-06 16:00 | ZeroEgress | zero-egress | 60 min |
| 4 | Wed 2027-01-13 16:00 | Compliance controls, from catalog to gate | ocbc, controlgate | 75 min |
| 5 | Wed 2027-01-20 16:00 | Exploited vulnerabilities, from catalog to gate | oebc, exposuregate | 75 min |
| 6 | Wed 2027-01-27 16:00 | anySQL | anysql | 60 min |
| 7 | Wed 2027-02-03 16:00 | OpenGPL | opengpl | 60 min |

"Length" is the premiere plus the chat Q&A, which is the `durationMin` live window.

**Changes to the build in PR #11:**

1. **Data.** `src/data/events.js` ships these 7 sessions: real titles, a one-paragraph
   summary each (from the framework's tagline and description), speaker
   `karthikeyan-sadayamuthu`, no `registerUrl` or `streamUrl` yet. The owner adds the
   links as each Luma event and Premiere is created. New fields:
   - `delivery: 'premiere' | 'live'` (default `'premiere'`): sets the wording below.
   - `series: 'framework-of-the-week'` and `week: 1..7`.
2. **Wording.** Premiere copy replaces "live talk" copy. The `live` variant keeps today's words for later.
   - Talk page eyebrow: *Webcast · Premiere with live Q&A · Free*
   - Facts "Where": *YouTube Premiere · questions in live chat*
   - Badge while it plays: **● PREMIERING NOW**
   - Hub button while it plays: **Watch & ask in chat**
   - The `.ics` LOCATION is the talk page URL. The OG description reads "Webcast premiere · Free."
   - Hub eyebrow: *Framework of the week · Wednesdays 11 AM ET · 16:00 UTC · Free* (owner chose ET as the headline time; every week of the series is EST, UTC−5). Lede: weekly recorded
     sessions, one framework at a time, premiering with live Q&A in chat, then on demand.
3. **Hub layout.** Next premiere (featured, with countdown), then **"The series"**: a
   numbered list of all 7 weeks. Each row shows the week number, the date in the visitor's
   zone, the title, the framework names, and a state: *Next*, *Upcoming*, *Watch*
   (past, has video) or *Recording soon*. Then On demand. The Upcoming list is
   replaced by the series list. Talks without a `series` still appear under Upcoming.
4. **Tabs.** All · Upcoming · On demand (`?tab=upcoming|on-demand`). "Live & upcoming" is renamed.
5. **Call for papers removed**: the tab, the hub card and every mention in code and copy.
   The podcast "Later" card stays.
6. **Framework pages** get a "Watch the session" link to their session (or "Premieres
   Wed 9 Dec": the date in the visitor's zone, linking to the talk page) when a session lists that framework.
7. **Empty Register.** Until `registerUrl` is set, the talk page and hub show no Register
   button. Add to calendar still works, so people can save the date before Luma exists.

**Unchanged:** routes, prerendered link previews, sitemap, nav, the status logic (a premiere is
"live" for its `durationMin` window), `LUMA_CALENDAR_URL`.

**Owner to-dos for week 1 (Dec 9):** verify the YouTube channel. Record MergeLock and upload it as
a Premiere for Wed Dec 9 16:00 UTC; this gives the `streamUrl`. Create the Luma calendar
(`LUMA_CALENDAR_URL`) and the week-1 event with the Premiere link (`registerUrl`).
Target: by about Dec 6.

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
