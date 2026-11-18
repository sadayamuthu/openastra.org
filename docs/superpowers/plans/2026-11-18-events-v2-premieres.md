# Events v2 ("Framework of the week" premieres) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/events` into the 7-week "Framework of the week" series of recorded YouTube Premieres with live chat Q&A. Remove Call for papers, and link each framework page to its session.

**Architecture:** Builds on the shipped v1 (`src/data/events.js`, `src/lib/events.js`, `src/pages/Events.jsx`, `src/pages/EventPage.jsx`, `src/components/EventMedia.jsx`, `src/components/TalkActions.jsx`, `scripts/prerender-events.mjs`). A new `delivery` field drives all wording through one pure helper, `deliveryCopy(event)`. Series fields (`series`, `week`) drive a numbered schedule on the hub. Status logic is unchanged: a premiere is "live" for its `durationMin` window.

**Tech Stack:** React 19, react-router-dom 6, Tailwind 3, Vite 7, Vitest 4 + Testing Library (jsdom), Node ≥ 20. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-18-events-design.md`. The "Revision 2" section wins over the rest. Wireframe: `docs/wire/events-v2.html`.

## Global Constraints

- No new npm dependencies. `src/data/events.js` stays import-free, and `src/lib/events.js` stays importable by plain Node.
- Schedule is Wednesdays 16:00 UTC (11 AM EST). Hub eyebrow, exactly: `Framework of the week · Wednesdays 11 AM ET · 16:00 UTC · Free`.
- "Call for papers" must not appear anywhere in `src/` or `scripts/` (case-insensitive), apart from tests that assert its absence. "Conference" must not appear either.
- Times shown to visitors use the visitor's zone (existing `formatWhen`/`formatShortDate`).
- Register on Luma renders only when `registerUrl` is set; Add to calendar always renders for non-past talks.
- `delivery` defaults to `'premiere'` when absent.

## Review Focus

1. **The series is entirely upcoming (launch day):** the hub shows the featured Week 1, all 7 rows, and the On-demand empty state. *(Task 3 test `launch-day hub`.)*
2. **The holiday gap:** a "Break · back Wed 6 Jan" row appears between weeks 2 and 3, and only where consecutive sessions are more than 8 days apart. *(Task 1 test `seriesRows inserts a break for gaps > 8 days`.)*
3. **A premiere left open:** at start time the badge shows "PREMIERING NOW". After the window it shows the same video as the recording. *(Covered by the existing `videoFor` and status tests, plus Task 2's badge test.)*
4. **Paired sessions:** weeks 4 and 5 list two frameworks, and both framework pages link to the same session. *(Task 4 test.)*
5. **Missing links before Luma exists:** no Register button, Add to calendar still present, no broken iframe. *(Task 2 test.)*

---

### Task 1: Series data and helpers

**Files:** Modify `src/data/events.js`, `src/data/events.test.js`, `src/lib/events.js`, `src/lib/events.test.js`, `src/test/eventsFixture.js` (add `delivery`/`series`/`week` to fixtures as needed).

**Interfaces (Produces, `src/lib/events.js`):**
- `deliveryCopy(event)` returns `{ eyebrow, where, badge, badgeShort, watch, startsIn, og }`:
  - premiere (default): `{ eyebrow: 'Webcast · Premiere with live Q&A · Free', where: 'YouTube Premiere · questions in live chat', badge: 'PREMIERING NOW', badgeShort: 'PREMIERE', watch: 'Watch & ask in chat', startsIn: 'Premieres in', og: 'Webcast premiere · Free' }`
  - live: `{ eyebrow: 'Tech talk · Online · Free', where: 'Online · YouTube Live', badge: 'LIVE NOW', badgeShort: 'LIVE', watch: 'Watch live', startsIn: 'Starts in', og: 'Online · Free' }`
- `seriesEvents(list, seriesId)` returns events with that `series`, sorted by `week`.
- `seriesRows(list, seriesId)` returns `Array<{ type: 'session', event } | { type: 'break', resumes: Event }>`. A break is inserted before a session whose `start` is more than 8 days after the previous session's `start`.
- `rowState(event, now, featured)` returns `'premiering' | 'next' | 'upcoming' | 'watch' | 'recording-soon'`. The rules: live → premiering; `featured?.slug === event.slug` → next; upcoming → upcoming; past with `videoFor(...).kind !== 'none'` → watch; otherwise recording-soon.
- `sessionForFramework(list, frameworkSlug, now)` returns the live session listing that framework if there is one, else the soonest upcoming, else the most recent past, else `null`.
- `toIcs`: `LOCATION` becomes the talk page URL (`${siteUrl}/events/<slug>/`).

**Data (`src/data/events.js`).** Seven entries. Common fields: `kind: 'talk'`, `format: 'online'`, `delivery: 'premiere'`, `series: 'framework-of-the-week'`, `speakers: ['karthikeyan-sadayamuthu']`, `registerUrl: null`, `streamUrl: null`, `recordingUrl: null`.

| week | slug | start | durationMin | frameworks | title | subtitle |
|---|---|---|---|---|---|---|
| 1 | `mergelock` | `2026-12-09T16:00:00Z` | 60 | `['mergelock']` | Merge conflicts git can't see | MergeLock: a merge gate for parallel AI agents |
| 2 | `unasked` | `2026-12-16T16:00:00Z` | 60 | `['unasked']` | The edits you never asked for | Unasked: reviewing what your coding agent changed |
| 3 | `zero-egress` | `2027-01-06T16:00:00Z` | 60 | `['zero-egress']` | An AI code editor that works offline | ZeroEgress: local models, nothing leaves your machine |
| 4 | `ocbc-controlgate` | `2027-01-13T16:00:00Z` | 75 | `['ocbc','controlgate']` | Compliance controls, from catalog to gate | OCBC + ControlGate |
| 5 | `oebc-exposuregate` | `2027-01-20T16:00:00Z` | 75 | `['oebc','exposuregate']` | Exploited vulnerabilities, from catalog to gate | OEBC + ExposureGate |
| 6 | `anysql` | `2027-01-27T16:00:00Z` | 60 | `['anysql']` | SQL analytics for AI systems | anySQL: query LLM calls, agent traces and RAG pipelines |
| 7 | `opengpl` | `2027-02-03T16:00:00Z` | 60 | `['opengpl']` | Governance policy for AI systems | OpenGPL: a declarative policy language for generative AI |

Summaries, one paragraph each, verbatim:
1. When several AI agents work on parallel branches, git merges their changes cleanly even when they contradict each other. This session shows how MergeLock compares branches before they meet and reports the conflicts git won't: changed signatures, deleted symbols still in use, and the same function written twice.
2. When a coding agent stops, how do you know what it changed that you never asked for? This session shows how Unasked scores every hunk of the diff against your request, lists the unrequested edits, and reverts exactly those.
3. Chat, agent mode and autocomplete that talk only to model servers you run yourself. This session walks through ZeroEgress: no telemetry, no cloud sign-in, and a runtime guard that blocks and logs every other connection.
4. How OCBC merges NIST SP 800-53 Rev. 5, SP 800-53B baselines and FedRAMP into one machine-readable catalog, and how ControlGate uses it to check code changes before every commit and merge, mapping findings to control IDs.
5. How OEBC merges NVD, OSV and GitHub Advisory data into one enriched exposure catalog, and how ExposureGate uses it to grade the dependency versions a change adds, with KEV-listed CVEs failing the gate, offline and fail-closed.
6. Query LLM responses, agent traces and RAG pipelines with standard SQL. This session shows how anySQL logs every AI API call into canonical tables and answers real questions with DuckDB, with no configuration.
7. A declarative policy language for generative AI: how agents behave, what they can access and produce, and how they show compliance. This session introduces OpenGPL with worked policies.

The header comment documents `delivery` (`'premiere'` | `'live'`, default premiere), `series` and `week`, and the weekly workflow: "create the Luma event and the YouTube Premiere, then paste `registerUrl` and `streamUrl`".

- [ ] **Step 1: Failing tests.**
  - `src/lib/events.test.js`:
    - `deliveryCopy` for premiere, for live, and for a missing `delivery` (→ premiere).
    - `seriesRows inserts a break for gaps > 8 days`: using the real `events`, expect 8 rows with a break at index 2 whose `resumes.slug === 'zero-egress'`, and 7 sessions in week order.
    - `rowState`, one case per state.
    - `sessionForFramework` for `controlgate` and `ocbc` (both give `ocbc-controlgate`), a past-only case, and `null` for an unknown slug.
    - `toIcs` LOCATION equals `https://openastra.org/events/<slug>/`.
  - `src/data/events.test.js`:
    - `delivery` is `premiere` or `live` when present.
    - Series weeks are unique and run 1..N.
    - Every series start is a Wednesday at `16:00:00Z`.
    - Every shipped framework (`shippedFrameworks()`) appears in exactly one framework-of-the-week session.
- [ ] **Step 2:** `npx vitest run src/lib src/data`. Expected: FAIL.
- [ ] **Step 3:** Implement the helpers and the data.
- [ ] **Step 4:** Run `npx vitest run`. Expected: all PASS. Existing tests that assumed empty production data may need their mocks adjusted (e.g. `Events.empty.test.jsx` already mocks `[]`).
- [ ] **Step 5:** Commit `feat(events): framework-of-the-week series data and helpers`.

### Task 2: Premiere wording on the talk page, media and previews

**Files:** Modify `src/components/EventMedia.jsx`, `src/components/Countdown.jsx` (label prop if needed), `src/pages/EventPage.jsx`, `scripts/prerender-events.mjs`, plus their tests.

**Interfaces:** Consumes `deliveryCopy`. Changes:
- **Talk page:**
  - The eyebrow becomes `Week N · ${eyebrow}` when `week` is set, otherwise `eyebrow`.
  - The Where fact uses `where`.
  - The Related section heading is "Frameworks in this session" when there are 2+ frameworks.
- **EventMedia:**
  - The live badge is `● ${badgeShort}` in the video and `● ${badge}` above the title.
  - The countdown label is `startsIn`.
- **Prerender:**
  - The talk og:description is `${utcWhen} · ${og}.${summary}`.
  - The hub description is: `One OpenAstra framework a week: recorded sessions that premiere Wednesdays 11 AM ET with live Q&A in chat, then stay on demand.`

- [ ] **Step 1: Failing tests.**
  - The premiere fixture (live at FIXTURE_NOW) shows `PREMIERING NOW` and the YouTube iframe.
  - A `delivery: 'live'` fixture shows `LIVE NOW`.
  - An upcoming talk shows "Premieres in" and the eyebrow `Week 4 · Webcast · Premiere with live Q&A · Free` (fixture with `week: 4`).
  - With no `registerUrl`, there is no Register link but Add to calendar is present.
  - The prerender og:description contains `· Webcast premiere · Free.`
- [ ] **Step 2:** Run; expect FAIL. **Step 3:** Implement. **Step 4:** `npx vitest run` passes. **Step 5:** Commit `feat(events): premiere wording on talk page, media and link previews`.

### Task 3: Hub: series schedule, tabs, no Call for papers

**Files:** Modify `src/pages/Events.jsx`, `src/pages/Events.test.jsx`, `src/pages/Events.empty.test.jsx`.

**Interfaces:** Consumes `seriesRows`, `rowState`, `deliveryCopy`, `formatShortDate`, `formatWhen`, `LUMA_CALENDAR_URL`. Layout per `docs/wire/events-v2.html` screen 1.

- **Header:**
  - The eyebrow is the exact Global Constraints string.
  - The lede, verbatim: "One OpenAstra framework a week, in a recorded session that premieres with live Q&A in the chat. Ask the author anything while it plays, or watch on demand afterwards."
- **Tabs:** All · Upcoming (`?tab=upcoming`) · On demand (`?tab=on-demand`). Remove the Call for papers pill and the `ComingSoon` card.
- **Featured card:**
  - The eyebrow is `Week N · Next premiere` (series) or `Next talk · Online` (otherwise).
  - While live, the eyebrow is the `● ${badge}` tag and the button is `deliveryCopy.watch`, linking to the talk page.
- **"The series" section** (`aria-labelledby`, heading "The series · 7 weeks", the count taken from the data):
  - It appears on the All and Upcoming tabs, plus "Follow on Luma ↗" when `LUMA_CALENDAR_URL` is set.
  - Session rows show week label, date and time (visitor's zone), title linking to the talk page, framework names, and a state tag: NEXT / UPCOMING / ● PREMIERING / WATCH / RECORDING SOON.
  - Break rows read `Holiday break · back <Wed 6 Jan>`.
  - Rows use the mobile grid from the v1 fix.
- **Other talks:** the "Upcoming" list now holds only non-series upcoming talks, and is hidden when there are none.
- **On demand:** unchanged grid. The empty copy becomes "Recordings build up here" with "Each premiere stays available right after it airs." Keep the podcast "Later" card.

- [ ] **Step 1: Failing tests.**
  - Tab labels are exactly `['All','Upcoming','On demand']`.
  - `queryByText(/call for papers/i)` is null.
  - `launch-day hub`: render with the real `events` and system time `2026-11-20T00:00:00Z`. Expect:
    - featured `Week 1 · Next premiere` and "Merge conflicts git can't see";
    - the series region has 7 session links in week order and a break row containing "back";
    - the Week 1 row has state NEXT and the others UPCOMING;
    - the On demand region shows "Recordings build up here".
  - With the fixture live: a "Watch & ask in chat" link to the talk.
  - `?tab=on-demand` hides the series region; `?tab=upcoming` hides On demand.
  - The empty-hub tests are updated to the new copy.
- [ ] **Step 2:** Run; expect FAIL. **Step 3:** Implement. **Step 4:** `npx vitest run` passes, lint clean. **Step 5:** Commit `feat(events): series schedule on the hub; remove call for papers`.

### Task 4: Framework page session banner

**Files:** Create `src/components/FrameworkSession.jsx`. Modify `src/pages/FrameworkPage.jsx` (render under the tagline, line ~50) and `src/pages/FrameworkPage.test.jsx`.

**Interfaces:** `<FrameworkSession slug={fw.slug} />` uses `events`, `useNow`, `sessionForFramework`, `eventStatus`, `formatWhen`, `deliveryCopy`. It renders nothing when there is no session. Otherwise it shows a dashed rust bordered row (wireframe screen 4):
- a `WEBCAST` tag;
- the text: upcoming `Framework of the week · Premieres <formatWhen>`, live `● PREMIERING NOW`, past `Framework of the week · Watch the session`;
- a `Details →` / `Watch →` link to `/events/<slug>`.

- [ ] **Step 1: Failing tests.** With the real data at system time `2026-11-20T00:00:00Z`:
  - `/mergelock` shows "Premieres" and links to `/events/mergelock`.
  - `/controlgate` and `/ocbc` both link to `/events/ocbc-controlgate`.
  - A framework with no session (mock `events: []`) renders no banner.
- [ ] **Step 2:** Run; expect FAIL. **Step 3:** Implement. **Step 4:** `npx vitest run` passes. **Step 5:** Commit `feat(events): link framework pages to their weekly session`.

### Task 5: Verification

- [ ] `npm run lint && npx vitest run && npm run build`. Then check that `dist/events/` has 7 talk folders plus `index.html`, and that the sitemap has 9 `<loc>` entries (`/`, `/events/`, and the 7 talks).
- [ ] Run `grep -ri "call for papers\|conference" src scripts`. Only absence assertions in tests may match.
- [ ] Check visually at 1400 px and 390 px against `docs/wire/events-v2.html`: hub, `/events/ocbc-controlgate`, `/mergelock`.
- [ ] Commit any fixes as `fix(events): …`.
