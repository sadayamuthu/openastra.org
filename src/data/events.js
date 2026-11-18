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
//   durationMin: 60,                            // talk + Q&A; ends the "live" window
//   summary: 'One paragraph: what it covers, who it is for.',
//   speakers: ['karthikeyan-sadayamuthu', 'vinodh-kannan-sadayamuthu'], // author slugs
//   frameworks: ['mergelock'],                  // framework slugs; may be [] (talk on a research area)
//   registerUrl: 'https://lu.ma/…',
//   streamUrl: 'https://www.youtube.com/watch?v=…',     // live stream (optional until known)
//   image: 'merge-conflicts.png',               // optional; file name in public/events/, 1200x630, used for link previews
//   recordingUrl: null,                         // set after the talk; may equal streamUrl
// },
//
// YouTube URL forms accepted for streamUrl / recordingUrl:
//   https://www.youtube.com/watch?v=ID   https://youtu.be/ID
//   https://www.youtube.com/live/ID      https://www.youtube.com/embed/ID
//   (m.youtube.com and music.youtube.com hosts work too)
//
// WARNING: renaming or removing a slug breaks every link already shared for that talk.
export const events = []

// Set to your lu.ma calendar URL to show a Follow button when no talk is scheduled.
export const LUMA_CALENDAR_URL = null
