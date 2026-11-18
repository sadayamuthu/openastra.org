// Talks and events. Add one entry per talk (newest anywhere; order does not matter).
// This file must stay import-free: a plain Node script reads it at build time.
//
// {
//   slug: 'securing-parallel-agents',          // URL: /events/<slug>
//   title: "Merge conflicts git can't see",
//   subtitle: 'Securing parallel coding agents',
//   kind: 'talk',                               // only 'talk' for now
//   format: 'online',                           // 'online' | 'in-person' (later)
//   start: '2026-12-12T17:00:00Z',              // UTC, exactly YYYY-MM-DDTHH:MM:SSZ
//   durationMin: 60,                            // premiere/live: talk + Q&A, ends the "live" window. Recorded: optional, shown as "N min"
//   summary: 'One paragraph: what it covers, who it is for.',
//   speakers: ['karthikeyan-sadayamuthu', 'vinodh-kannan-sadayamuthu'], // author slugs
//   frameworks: ['mergelock'],                  // framework slugs; may be [] (talk on a research area)
//   registerUrl: 'https://lu.ma/…',             // optional; for recorded sessions it only powers a "Get a reminder on Luma" button
//   streamUrl: 'https://www.youtube.com/watch?v=…',     // premiere/live stream (optional until known)
//   videoUrl: 'https://www.youtube.com/watch?v=…',      // recorded: the published video; paste once released
//   image: 'merge-conflicts.png',               // optional; file name in public/events/, 1200x630, used for link previews
//   recordingUrl: null,                         // set after the talk; may equal streamUrl (recorded sessions: leave null; videoUrl is enough)
//   delivery: 'recorded',                       // 'recorded' (video published on YouTube, Q&A in comments) | 'premiere' (YouTube Premiere + live chat) | 'live'; default 'premiere'
//   series: 'framework-of-the-week',            // optional series id
//   week: 1,                                    // position in the series (1..N, unique)
// },
//
// YouTube URL forms accepted for streamUrl / videoUrl / recordingUrl:
//   https://www.youtube.com/watch?v=ID   https://youtu.be/ID
//   https://www.youtube.com/live/ID      https://www.youtube.com/embed/ID
//   (m.youtube.com and music.youtube.com hosts work too)
//
// Weekly routine (recorded series): publish/schedule the video for Wed 11 AM ET (16:00 UTC), paste its link as videoUrl.
// Tip: schedule the video in YouTube Studio and paste its link before Wednesday — the page shows only 'Coming …' until the release time.
// A Luma registerUrl is optional (reminder button only).
//
// WARNING: renaming or removing a slug breaks every link already shared for that talk.
export const events = [
  {
    slug: 'mergelock',
    title: "Merge conflicts git can't see",
    subtitle: "MergeLock: a merge gate for parallel AI agents",
    kind: 'talk',
    format: 'online',
    delivery: 'recorded',
    series: 'framework-of-the-week',
    week: 1,
    start: '2026-12-09T16:00:00Z',
    summary: "When several AI agents work on parallel branches, git merges their changes cleanly even when they contradict each other. This session shows how MergeLock compares branches before they meet and reports the conflicts git won't: changed signatures, deleted symbols still in use, and the same function written twice.",
    speakers: ['karthikeyan-sadayamuthu'],
    frameworks: ['mergelock'],
    registerUrl: null,
    videoUrl: null,
    recordingUrl: null,
  },
  {
    slug: 'unasked',
    title: "The edits you never asked for",
    subtitle: "Unasked: reviewing what your coding agent changed",
    kind: 'talk',
    format: 'online',
    delivery: 'recorded',
    series: 'framework-of-the-week',
    week: 2,
    start: '2026-12-16T16:00:00Z',
    summary: "When a coding agent stops, how do you know what it changed that you never asked for? This session shows how Unasked scores every hunk of the diff against your request, lists the unrequested edits, and reverts exactly those.",
    speakers: ['karthikeyan-sadayamuthu'],
    frameworks: ['unasked'],
    registerUrl: null,
    videoUrl: null,
    recordingUrl: null,
  },
  {
    slug: 'zero-egress',
    title: "An AI code editor that works offline",
    subtitle: "ZeroEgress: local models, nothing leaves your machine",
    kind: 'talk',
    format: 'online',
    delivery: 'recorded',
    series: 'framework-of-the-week',
    week: 3,
    start: '2027-01-06T16:00:00Z',
    summary: "Chat, agent mode and autocomplete that talk only to model servers you run yourself. This session walks through ZeroEgress: no telemetry, no cloud sign-in, and a runtime guard that blocks and logs every other connection.",
    speakers: ['karthikeyan-sadayamuthu'],
    frameworks: ['zero-egress'],
    registerUrl: null,
    videoUrl: null,
    recordingUrl: null,
  },
  {
    slug: 'ocbc-controlgate',
    title: "Compliance controls, from catalog to gate",
    subtitle: "OCBC + ControlGate",
    kind: 'talk',
    format: 'online',
    delivery: 'recorded',
    series: 'framework-of-the-week',
    week: 4,
    start: '2027-01-13T16:00:00Z',
    summary: "How OCBC merges NIST SP 800-53 Rev. 5, SP 800-53B baselines and FedRAMP into one machine-readable catalog, and how ControlGate uses it to check code changes before every commit and merge, mapping findings to control IDs.",
    speakers: ['karthikeyan-sadayamuthu'],
    frameworks: ['ocbc', 'controlgate'],
    registerUrl: null,
    videoUrl: null,
    recordingUrl: null,
  },
  {
    slug: 'oebc-exposuregate',
    title: "Exploited vulnerabilities, from catalog to gate",
    subtitle: "OEBC + ExposureGate",
    kind: 'talk',
    format: 'online',
    delivery: 'recorded',
    series: 'framework-of-the-week',
    week: 5,
    start: '2027-01-20T16:00:00Z',
    summary: "How OEBC merges NVD, OSV and GitHub Advisory data into one enriched exposure catalog, and how ExposureGate uses it to grade the dependency versions a change adds, with KEV-listed CVEs failing the gate, offline and fail-closed.",
    speakers: ['karthikeyan-sadayamuthu'],
    frameworks: ['oebc', 'exposuregate'],
    registerUrl: null,
    videoUrl: null,
    recordingUrl: null,
  },
  {
    slug: 'anysql',
    title: "SQL analytics for AI systems",
    subtitle: "anySQL: query LLM calls, agent traces and RAG pipelines",
    kind: 'talk',
    format: 'online',
    delivery: 'recorded',
    series: 'framework-of-the-week',
    week: 6,
    start: '2027-01-27T16:00:00Z',
    summary: "Query LLM responses, agent traces and RAG pipelines with standard SQL. This session shows how anySQL logs every AI API call into canonical tables and answers real questions with DuckDB, with no configuration.",
    speakers: ['karthikeyan-sadayamuthu'],
    frameworks: ['anysql'],
    registerUrl: null,
    videoUrl: null,
    recordingUrl: null,
  },
  {
    slug: 'opengpl',
    title: "Governance policy for AI systems",
    subtitle: "OpenGPL: a declarative policy language for generative AI",
    kind: 'talk',
    format: 'online',
    delivery: 'recorded',
    series: 'framework-of-the-week',
    week: 7,
    start: '2027-02-03T16:00:00Z',
    summary: "A declarative policy language for generative AI: how agents behave, what they can access and produce, and how they show compliance. This session introduces OpenGPL with worked policies.",
    speakers: ['karthikeyan-sadayamuthu'],
    frameworks: ['opengpl'],
    registerUrl: null,
    videoUrl: null,
    recordingUrl: null,
  },
]

// Set to your lu.ma calendar URL to show a Follow button when no talk is scheduled.
export const LUMA_CALENDAR_URL = null
