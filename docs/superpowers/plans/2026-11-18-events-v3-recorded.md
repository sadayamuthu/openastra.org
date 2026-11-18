# Events v3 (recorded sessions) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the 7-week Framework-of-the-week series from YouTube Premieres to simple recorded videos published each Wednesday. There is no countdown, no live chat and no calendar file, and questions go in the YouTube comments. Premiere and live modes keep working for later.

**Architecture:** Add a third `delivery` mode, `recorded`, to the existing helpers in `src/lib/events.js`, so every page reads its wording and behaviour from `deliveryCopy`, `eventStatus`, `videoFor` and `rowState`. The pages (`EventPage`, `EventMedia`, `TalkActions`, `Events`, `FrameworkSession`) and `scripts/prerender-events.mjs` branch on those helpers. The data switches to `recorded`.

**Tech Stack:** React 19, react-router-dom 6, Tailwind 3, Vite 7, Vitest 4 + Testing Library (jsdom), Node ≥ 20. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-18-events-design.md`. The "Revision 3" section binds and supersedes Revision 2's premiere format. Revision 2's schedule, series list, tabs and banners otherwise stand.

## Global Constraints

- No new npm dependencies. `src/data/events.js` stays import-free, and `src/lib/events.js` stays Node-importable.
- Premiere and live behaviour must keep working unchanged when `delivery` is `'premiere'` or `'live'`. Existing tests for those modes stay green, using fixtures that set `delivery` explicitly where needed.
- `deliveryCopy` default: absent `delivery` → `'premiere'`. Do not change the default. The real data sets `delivery: 'recorded'` explicitly.
- Recorded sessions never show a countdown, a "PREMIERING"/"LIVE" badge, a chat button or Add to calendar.
- Copy strings, verbatim, from the spec's Revision 3 section:
  - eyebrow `Recorded session · Free`
  - where `YouTube · recorded session`
  - qa `In the YouTube comments` (premiere/live: `In the YouTube live chat`)
  - watch `Watch on YouTube`
  - og `Recorded session · Free`
  - hub eyebrow `Framework of the week · New every Wednesday · Free`
  - hub lede `One OpenAstra framework a week: a recorded session published every Wednesday on YouTube. Watch it here and ask questions in the YouTube comments.`
  - reminder button `Get a reminder on Luma`
  - after-video line `Questions? Ask in the YouTube comments.`
- Dates and times shown to visitors use the visitor's zone. The prerender OG date for recorded sessions is UTC, date only.

## Review Focus

1. **Release moment:** one millisecond before `start` the page shows "Coming …". At `start` it shows the video if `videoUrl` is set, otherwise "Video coming soon". It is never "live". *(Task 1 tests.)*
2. **New this week:** a session released 6 days ago is featured as "New this week". At 8 days it is no longer featured, and the next upcoming session is. *(Task 1 `featuredForHub` tests.)*
3. **Owner pastes a link in a different YouTube form** (youtu.be, `/live/`, `m.`): it still embeds, and the data test catches bad links. *(Task 1 data test.)*
4. **Mixed modes:** a premiere fixture still shows its countdown and chat button, so recorded changes don't leak. *(Existing EventPage tests, plus one explicit premiere assertion in Task 2.)*
5. **No Luma link:** no reminder button and no empty space. *(Task 2 test.)*

---

### Task 1: Recorded mode in helpers and data

**Files:** Modify `src/lib/events.js`, `src/lib/events.test.js`, `src/data/events.js`, `src/data/events.test.js`, `src/test/eventsFixture.js` (add one recorded fixture if useful).

**Interfaces (Produces):**
- `eventEnd(event)`: for recorded, returns `new Date(event.start)`, so `eventStatus` is only `'upcoming'` or `'past'`.
- `videoFor(event, now)`:
  - recorded and upcoming → `{ kind: 'coming', embed: null }`;
  - recorded and past → embed of `recordingUrl || videoUrl || streamUrl`, as `{ kind: 'recording', embed }`, or `{ kind: 'none', embed: null }`.
  - Premiere and live are unchanged, except that their past branch also accepts `videoUrl` as a fallback.
- `deliveryCopy`:
  - adds `recorded: { eyebrow, where, qa, watch, og, badge: null, badgeShort: null, startsIn: null }` with the Global Constraints strings;
  - adds `qa: 'In the YouTube live chat'` to premiere and live.
- `videoLink(event)` returns the YouTube URL to open for "Watch on YouTube" (`recordingUrl || videoUrl || streamUrl || null`).
- `formatDuration(event)`:
  - recorded with `durationMin` → `${n} min`;
  - recorded without it → `null`;
  - premiere and live are unchanged (`${n} min, incl. Q&A`).
- `featuredForHub(list, now)`: the most recent recorded session with `start` in `(now − 7 days, now]`, else `featuredEvent(list, now)`.
- `rowState(event, now, featured)`: recorded → `'watch'` (past, with video), `'coming'` (upcoming) or `'video-soon'` (past, no video). Premiere and live are unchanged.
- `sessionForFramework` is unchanged.

**Data:** all 7 sessions get `delivery: 'recorded'` and `videoUrl: null`, and lose `durationMin` and `streamUrl` (keep `registerUrl: null`, `recordingUrl: null`). Update the header comment:
- document `delivery: 'recorded'` and `videoUrl`;
- describe the weekly routine: "publish/schedule the video for Wed 11 AM ET, paste its link as videoUrl";
- say Luma `registerUrl` is optional (reminder button).

- [ ] **Step 1: Failing tests** in `src/lib/events.test.js`:
  - `eventStatus` for a recorded event at start−1ms → upcoming, and at start → past, never live.
  - `videoFor` for recorded: coming, then none, then recording once `videoUrl` is set.
  - `deliveryCopy({delivery:'recorded'})` matches the strings.
  - `formatDuration` for the recorded variants.
  - `featuredForHub`: real data at `2026-12-15T00:00:00Z` → `mergelock` (released 9 Dec, within 7 days); at `2026-12-17T00:00:00Z` → `unasked`; at `2026-12-24T00:00:00Z` (8 days after unasked) → `zero-egress` (next upcoming); at `2026-11-20T00:00:00Z` → `mergelock` (upcoming).
  - `rowState` for the 3 recorded states.
  - `videoLink`.

  In `src/data/events.test.js`:
  - `delivery` ∈ premiere | live | recorded;
  - `durationMin > 0` required only for premiere and live;
  - `videoUrl` embeds when set;
  - all 7 series sessions are `recorded`.
- [ ] **Step 2:** `npx vitest run src/lib src/data`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `npx vitest run`. Page tests that used the real data's premiere wording may now fail: note which, and update only real-data assertions that this task's data change makes wrong, such as the series test's premiere expectations. Leave page behaviour for Tasks 2 and 3. If a page test needs behaviour from Tasks 2 and 3, mark it `it.todo` with a comment naming the task, and list it in the report.
- [ ] **Step 5:** Commit `feat(events): recorded delivery mode; series switches to recorded videos`.

### Task 2: Talk page, media, actions and previews for recorded

**Files:** Modify `src/components/EventMedia.jsx`, `src/components/TalkActions.jsx`, `src/pages/EventPage.jsx`, `scripts/prerender-events.mjs`, and their tests (`src/pages/EventPage.test.jsx`, `scripts/prerender-events.test.js`).

**Behaviour:**
- **EventMedia, `kind === 'coming'`:** a dashed box with `Coming <formatDayMonth>` (serif, rust) and the line `Published <formatTime> ` below (visitor's zone).
- **EventMedia, recorded with an embed:** the iframe, then `<Button href={videoLink(event)} variant="solid">Watch on YouTube</Button>`, then the line `Questions? Ask in the YouTube comments.` No badge.
- **EventMedia, `kind === 'none'` for recorded:** "Video coming soon".
- **TalkActions:** for recorded, render no Add to calendar. Render `Get a reminder on Luma` (Button href registerUrl) only when `registerUrl` is set and the session is upcoming. Render nothing at all (no empty wrapper) when there are no actions. Premiere and live are unchanged.
- **EventPage facts:** When (`formatWhen`), Where (`where`), Q&A (`qa`), Cost Free, Length (only if `formatDuration` returns non-null). The eyebrow `Week N · ${eyebrow}`. The mobile block under the title shows `formatWhen` (plus ` · length` if any) and TalkActions.
- **Prerender:** for recorded, `og:description` = `${utcDateOnly} · Recorded session · Free.${summary}`, for example `Wed 9 Dec 2026 · Recorded session · Free. When several…`. Others are unchanged.

- [ ] **Step 1: Failing tests:**
  - EventPage with real data at `2026-11-20T00:00:00Z` on `/events/mergelock` shows:
    - `Coming Wed 9 Dec`;
    - eyebrow `Week 1 · Recorded session · Free`;
    - Where `YouTube · recorded session` and Q&A `In the YouTube comments`;
    - no countdown testid, no "Add to calendar", no "Register"/"reminder" link.
  - With a recorded fixture that has `videoUrl` and a past start: an iframe with the nocookie embed, a `Watch on YouTube` link to the original URL, and the questions line.
  - A recorded fixture with `registerUrl` and an upcoming start shows `Get a reminder on Luma`.
  - A premiere fixture still shows the countdown and its chat button.
  - Prerender for the real `mergelock` session contains `Wed 9 Dec 2026 · Recorded session · Free.`
- [ ] **Step 2:** Run; expect FAIL. **Step 3:** Implement. **Step 4:** `npx vitest run` and lint pass. **Step 5:** Commit `feat(events): recorded-session talk page and link previews`.

### Task 3: Hub and framework banner for recorded

**Files:** Modify `src/pages/Events.jsx`, `src/components/FrameworkSession.jsx`, and their tests (`Events*.test.jsx`, `FrameworkSession*.test.jsx`).

**Behaviour:**
- **Hub header:** eyebrow and lede verbatim from Global Constraints.
- **Featured card** uses `featuredForHub`:
  - Released recorded session → eyebrow `Week N · New this week`, title, subtitle, date, and a `▶ Watch` Button `to` the talk page.
  - Upcoming recorded session → eyebrow `Week N · Coming <formatDayMonth>`, title, subtitle, `formatWhen`, then TalkActions (reminder if set) and `Details →`. No countdown.
  - Premiere and live featured behaviour is unchanged.
  - The empty and post-series copy from Revision 2 remains.
- **Series row tags for recorded:**
  - `watch` → `▶ WATCH` (▶ aria-hidden);
  - `coming` → `COMING <formatDayMonth uppercased>`, for example `COMING WED 16 DEC`;
  - `video-soon` → `VIDEO COMING SOON`.
- **Framework banner for recorded:**
  - upcoming → `Framework of the week · New video <formatDayMonth>` + `Details →`;
  - past with video → `Framework of the week · Watch the session` + `Watch →`;
  - past without video → `Framework of the week · Video coming soon` + `Details →`.
- **On demand:** cards still list past sessions. A recorded card without video shows "Video coming soon".

- [ ] **Step 1: Failing tests:**
  - Launch-day hub with real data at `2026-11-20T00:00:00Z`:
    - eyebrow `Framework of the week · New every Wednesday · Free`;
    - featured `Week 1 · Coming Wed 9 Dec`, with no countdown;
    - row tags: Week 1 `COMING WED 9 DEC`, Week 2 `COMING WED 16 DEC`.
  - At `2026-12-15T00:00:00Z` with mergelock given a `videoUrl` (synthetic recorded events in a mocked file): featured `New this week`, a `▶ Watch` link to `/events/mergelock`, and row tag `▶ WATCH`.
  - A released row without video shows `VIDEO COMING SOON`.
  - `/mergelock` banner at `2026-11-20` reads `New video Wed 9 Dec`.
  - The recorded past/no-video banner reads `Video coming soon`.
  - Update or replace the Revision 2 premiere-specific hub assertions that relied on the real data (keep premiere coverage via fixtures).
- [ ] **Step 2:** Run; expect FAIL. **Step 3:** Implement. **Step 4:** `npx vitest run` and lint pass, and no `it.todo` from Task 1 is left. **Step 5:** Commit `feat(events): recorded sessions on the hub and framework pages`.

### Task 4: Verification

- [ ] Run `npm run lint && npx vitest run && npm run build`. Check that `dist/events/mergelock/index.html` og:description starts with `Wed 9 Dec 2026 · Recorded session · Free.`
- [ ] Run `grep -rin "premiering\|countdown" src/pages src/components`. Remaining uses must be premiere/live branches only (read them).
- [ ] Visual check at 1400 px and 390 px: `/events`, `/events/mergelock`, `/mergelock`.
