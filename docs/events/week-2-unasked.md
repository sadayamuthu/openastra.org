# Week 2: Unasked (recording kit)

**Publish:** Wed 16 Dec 2026, 11:00 AM ET / 16:00 UTC (schedule it in YouTube Studio)
**Session page:** https://openastra.org/events/unasked/
**Target length:** about 20 minutes. Everything shown comes from the public README and USAGE.md (v0.1.0).
**Next session:** after the holiday break, **ZeroEgress** on Wed 6 Jan 2027.

---

## Before you record

- [ ] Install unasked with `brew install sadayamuthu/tap/unasked`, then run `unasked version` and `unasked doctor`. Git must be 2.30 or newer.
- [ ] Claude Code is installed and logged in, for the live part. Codex also works.
- [ ] Demo repo is built with the script below, in a throwaway folder.
- [ ] Install the hooks **for the demo repo only**, so your global agent settings stay untouched: run `unasked hook install --project` inside the demo repo. It writes `.claude/settings.local.json` there. Afterwards, run `unasked hook uninstall` in that repo.
- [ ] Terminal is clean: large font, no API keys or tokens on screen or in history, notifications off. Claude Code's screen shows your account and model, so check what's visible.
- [ ] Show only released features (v0.1.0). Use your own visuals, not figures from any paper.

### Demo repo script

This is a small Go API whose `X-Request-Id` response header is used in 2 other files, which is the README's demo scenario.

```sh
mkdir unasked-demo && cd unasked-demo && git init -q -b main
mkdir -p internal/api internal/logging
cat > go.mod <<'EOF'
module example.com/shop

go 1.22
EOF
cat > internal/api/headers.go <<'EOF'
package api

import "net/http"

// SetHeaders adds the standard response headers.
func SetHeaders(w http.ResponseWriter, requestID string) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Request-Id", requestID)
}
EOF
cat > internal/api/handler.go <<'EOF'
package api

import "net/http"

// Products lists products.
func Products(w http.ResponseWriter, r *http.Request) {
	SetHeaders(w, r.Header.Get("X-Request-Id"))
	w.Write([]byte(`[]`))
}
EOF
cat > internal/logging/log.go <<'EOF'
package logging

import "net/http"

// RequestID returns the X-Request-Id used to correlate logs.
func RequestID(r *http.Request) string { return r.Header.Get("X-Request-Id") }
EOF
git add -A && git commit -qm "base"
```

---

## Two ways to run the demo

### A. Live with Claude Code (the real flow, record first)

1. In the demo repo, run `unasked hook install --project`, then `unasked doctor`. The output shows the hook installed.
2. Start `claude` and give it the README's prompt:
   > Add rate limiting to the public API: 60 requests per minute per client, answer 429 with a Retry-After header
3. When Claude stops, the **stop hook runs unasked**. If it finds an unasked hunk the agent made, it hands the `[unasked report]` back to Claude, which drops the hunk or explains itself. This hand-back is the highlight of the video.
4. Then run `unasked` yourself to see the full report, including the "You asked:" line and "agent said:" quotes.

**Be honest about non-determinism.** An agent won't overstep on every run. If Claude only does what you asked, the report is `clean` (every hunk invited). That's a fine result to show ("this is what a good session looks like"). Then switch to demo B to show a deletion being caught.

### B. Without an agent (scripted backup, always the same)

Simulate an agent that added rate limiting and also quietly deleted the header. Run this on a branch in the demo repo:

```sh
git checkout -qb agent/rate-limit
cat > internal/api/ratelimit.go <<'EOF'
package api

import (
	"net/http"
	"sync"
	"time"
)

// RateLimit allows 60 requests per minute per client and answers 429 with Retry-After.
func RateLimit(next http.Handler) http.Handler {
	var mu sync.Mutex
	seen := map[string][]time.Time{}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		now := time.Now()
		recent := seen[r.RemoteAddr][:0]
		for _, t := range seen[r.RemoteAddr] {
			if now.Sub(t) < time.Minute {
				recent = append(recent, t)
			}
		}
		if len(recent) >= 60 {
			mu.Unlock()
			w.Header().Set("Retry-After", "60")
			w.WriteHeader(http.StatusTooManyRequests)
			return
		}
		seen[r.RemoteAddr] = append(recent, now)
		mu.Unlock()
		next.ServeHTTP(w, r)
	})
}
EOF
# the change nobody asked for: drop the X-Request-Id header
sed -i.bak '/X-Request-Id/d' internal/api/headers.go && rm internal/api/headers.go.bak
```

I tested this on 2026-11-18 with `ghcr.io/sadayamuthu/unasked:latest`. `unasked --since main` prints:

```
Session (none) (0 turns)
transcript: none · adapter level: diff-only
warning: transcript: none

2 hunks changed · 0 invited · 1 unasked · 1 unclear
result: unasked

UNASKED
  h01  internal/api/headers.go:7-7   deletion  ⚠ deleted header X-Request-Id still referenced in 2 files

UNCLEAR
  h02  internal/api/ratelimit.go:1-32   feature  added RateLimit
        no usable prompt

unasked --drop h01   revert the unasked hunks
unasked --keep h01       accept it on this branch
```

This exits with code 2. Then:
- `unasked --drop h01` prints `dropped h01 (snapshot …; undo with: unasked undo)`. The header line is back and `ratelimit.go` is untouched.
- `unasked undo` prints `undone (snapshot …)`, which restores the files byte for byte.

Explain on camera why it says "unclear" here: with no agent transcript there's no prompt to compare against. That's exactly how the CI mode behaves (see segment 9).

---

## Outline (about 20 min)

| # | Time | Segment | What to show |
|---|---|---|---|
| 1 | 0:00 | **Hook** | "I asked my agent to add rate limiting. It also deleted a header two other files still use, and told me it was 'deprecated'." |
| 2 | 1:00 | **The problem** | Agents do extra work: "while I'm here" refactors, loosened tests, bumped dependencies, deleted "unused" code. In a big diff it's easy to miss. |
| 3 | 3:00 | **What Unasked is** | After an agent stops, it reads **what you asked** and **what the agent said before each edit**, scores every hunk and lists the ones nobody asked for. Local and deterministic: no model, no network. Show the README's "What it flags" table (deletion, test and dependency are errors; feature, refactor and collateral are warnings). |
| 4 | 5:00 | **Install** | `brew install sadayamuthu/tap/unasked`, `unasked version`, `unasked doctor`. Mention .deb/.rpm, Windows binaries, Docker and the GitHub Action. |
| 5 | 6:00 | **Hooks** | `unasked hook install --project` in the demo repo. Explain the start hook (snapshot, so your own earlier work is never blamed) and the stop hook (report, fed back to the agent). |
| 6 | 7:30 | **Demo A: live session** | The Claude Code prompt from above. Show the stop hook handing `[unasked report]` back, and the agent reacting. Then run `unasked` for the full report: "You asked:", verdicts, and "agent said:" with tells such as "while I'm here" underlined. |
| 7 | 11:00 | **Drop, keep, undo** | `unasked --drop h01` (only those hunks, verified, snapshotted), then `unasked undo`. Then `unasked --keep h05 --reason "needed for the migration"` for something you did want. Point out that **agents can't keep deletions, test or dependency changes**; only you can. |
| 8 | 13:30 | **Demo B: the deletion** | If demo A came out clean, show the scripted branch: `unasked --since main` reports `deletion ⚠ … still referenced in 2 files`, then drop and undo. |
| 9 | 15:00 | **In CI** | The GitHub Action (`fetch-depth: 0`, `sadayamuthu/unasked@v0`). CI has **no transcript**, so it judges the diff alone. Deletions, tests and dependency changes fail the check until a human looks. `fail-on: never` and `comment: true` options. |
| 10 | 16:30 | **Exit codes and JSON** | 0 clean, 1 unclear, 2 unasked, 3 error. `--format json` for scripts and `--format md` for PR comments. `unasked stats` for a trend over time. |
| 11 | 17:30 | **Limits (be honest)** | Scoring is lexical (English words, stemmed). Claude Code and Codex only, in preview. On the small labelled fixture set, 2 of 17 flagged hunks were ones a human would call invited. Nothing leaves your machine, and captured transcripts are stored with tight file permissions. |
| 12 | 18:30 | **Wrap-up** | GitHub link, Zenodo DOI, "ask questions in the comments". **Holiday break**, back **Wed 6 Jan with ZeroEgress**. |

**Tips:**
- Before recording demo A, run `git status` so viewers see a clean starting point.
- When the report appears, zoom in on the `agent said:` line. It's the most relatable moment.
- Keep `unasked undo` in the video. It shows the tool is safe to try.

---

## YouTube

**Title** (under 70 characters):

> Unasked: see what your AI coding agent changed that you never asked for

Alternatives:
- *My AI agent deleted code I never asked it to. Here's how I catch it*
- *Framework of the week #2: Unasked, review your agent's extra edits*

**Description:**

```
You asked your AI coding agent for one thing. It also deleted an "unused" function, loosened a test, and bumped a dependency, and the diff is too big to notice.

Unasked is an open-source CLI that runs when your agent stops. It reads what you asked for and what the agent said before each edit, scores every hunk of the diff, and lists the ones nobody asked for: deletions still referenced elsewhere, test and CI changes, dependency bumps, drive-by refactors. Then `unasked --drop` reverts exactly those hunks, verified and snapshotted, and `unasked undo` puts them back. It's local and deterministic: no model, no network, nothing leaves your machine. Works with Claude Code and Codex, and in CI as a GitHub Action.

Week 2 of OpenAstra's Framework of the week: one open-source framework every Wednesday.
Questions? Ask in the comments.

⏱ Chapters
0:00 My agent did more than I asked
1:00 Why agents make unasked changes
3:00 What Unasked flags
5:00 Install
6:00 Hooks for Claude Code and Codex
7:30 Live: catching an agent's extra edit
11:00 Drop, keep and undo
13:30 A deletion still used in 2 files
15:00 Unasked in CI (GitHub Action)
16:30 Exit codes, JSON and Markdown output
17:30 Current limits
18:30 Next up, after the break

🔗 Links
GitHub: https://github.com/sadayamuthu/unasked
Usage guide: https://github.com/sadayamuthu/unasked/blob/main/USAGE.md
Session page: https://openastra.org/events/unasked/
Cite it (Zenodo DOI): https://doi.org/10.5281/zenodo.23637740
All sessions: https://openastra.org/events/

Install:
brew install sadayamuthu/tap/unasked

Next (after the holiday break, Wed 6 Jan): ZeroEgress, an AI code editor that works offline.

#AIagents #ClaudeCode #codereview #devtools #opensource
```

Update the chapter timestamps to match your final edit. YouTube needs the first chapter at 0:00 and at least three chapters.

**Pinned comment:**

> What's the most surprising "extra" change an AI agent has made in your repo? Questions about Unasked go here too, and I'll answer in the comments.
> Report a wrong verdict or request an agent: https://github.com/sadayamuthu/unasked/blob/main/CONTRIBUTING.md

**Paper (optional):** if Unasked has a published paper you want to point to, add a line:
`Paper: <title>, <venue>, <DOI>`. Link to it only; don't show its figures or text.

---

## After uploading

1. In YouTube Studio, set visibility to **Schedule** for Wed 16 Dec 2026, 11:00 AM ET.
2. Copy the video link.
3. In `src/data/events.js`, set the `unasked` entry's `videoUrl` to that link and merge. The site shows
   "Coming Wed 16 Dec" until 16:00 UTC, then the video.
4. In the demo repo, run `unasked hook uninstall` if you used `--project` hooks.
