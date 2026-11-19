# Week 1: MergeLock (recording kit)

**Publish:** Wed 9 Dec 2026, 11:00 AM ET / 16:00 UTC (schedule it in YouTube Studio)
**Session page:** https://openastra.org/events/mergelock/
**Target length:** about 20 minutes. Everything shown comes from the public README and USAGE.md (v0.1.5).

---

## Before you record

- [ ] Channel is phone-verified, so uploads longer than 15 minutes are allowed.
- [ ] mergelock is installed: `brew install sadayamuthu/tap/mergelock`, then `mergelock version`. Git must be 2.38 or newer.
- [ ] Demo repo is built with the script below, in a throwaway folder, not real work code.
- [ ] Terminal is clean: large font (18 pt or more), no API keys or tokens in the environment or history, notifications off.
- [ ] Show only released features (v0.1.5). Use your own visuals, not figures from any paper.

### Demo repo script

I tested this on 2026-11-18 with `ghcr.io/sadayamuthu/mergelock:latest`. Git merges the two branches
cleanly, but mergelock reports **1 error and 1 warning** and exits with **code 2**.

```sh
mkdir mergelock-demo && cd mergelock-demo && git init -q -b main && mkdir src
cat > src/auth.ts <<'EOF'
export function login(user: string): boolean {
  return user.length > 0
}
EOF
cat > src/app.ts <<'EOF'
import { login } from './auth'

export function start(user: string) {
  return login(user)
}
EOF
git add -A && git commit -qm "base: login(user)"

# Agent A changes login's signature and updates its own caller
git checkout -qb agent/auth
cat > src/auth.ts <<'EOF'
export function login(user: string, token: string): boolean {
  return user.length > 0 && token.length > 0
}
EOF
cat > src/app.ts <<'EOF'
import { login } from './auth'

export function start(user: string, token: string) {
  return login(user, token)
}
EOF
cat > src/price.ts <<'EOF'
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
EOF
git add -A && git commit -qm "agent/auth: login now requires a token"

# Agent B, working in parallel, still calls the old login(user)
git checkout -q main && git checkout -qb agent/checkout
cat > src/checkout.ts <<'EOF'
import { login } from './auth'

export function checkout(user: string, cents: number) {
  if (!login(user)) throw new Error('not logged in')
  return formatPrice(cents)
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
EOF
git add -A && git commit -qm "agent/checkout: add checkout flow"
git checkout -q main
```

Expected output of `mergelock check agent/auth agent/checkout --format text`:

```
conflict: agent/auth ↔ agent/checkout (base …)

error    high     signature_caller  login
  changed in agent/auth at src/auth.ts:1
  login(user: string): boolean → login(user: string, token: string): boolean
  call sites in agent/checkout:
    src/checkout.ts:4  login(user)
  → Update 1 call site in agent/checkout to the new signature, or merge agent/checkout first and rebase agent/auth.

warning  medium   duplicate_definition  formatPrice
  kind: same_name
  defined at src/price.ts:1
  defined at src/checkout.ts:8
  → … keep one definition and point callers at it.
```

---

## Outline (about 20 min)

| # | Time | Segment | What to show |
|---|---|---|---|
| 1 | 0:00 | **Hook** | Two AI agents, two branches, and git says "merges cleanly". Then the build breaks. "This is the conflict git can't see." |
| 2 | 1:00 | **The problem** | Agents working in parallel on separate branches or worktrees. Git conflicts are about *text*. Agents break *meaning*: a changed signature on one side, an old call on the other. |
| 3 | 3:00 | **What MergeLock is** | A git-native merge gate. It compares two branches before they meet, never touches your working tree (`git merge-tree` + tree-sitter), and covers TS, JS and Python. Show the README's "What it detects" table (five rules, error or warning). |
| 4 | 5:00 | **Install** | `brew install sadayamuthu/tap/mergelock` and `mergelock version`. Mention .deb/.rpm, Docker, `go install` and the GitHub Action. Git 2.38 or newer is required. |
| 5 | 6:30 | **Demo: git says fine** | In the demo repo, `git log --oneline --all --graph`, then `git merge-tree --write-tree agent/auth agent/checkout`. It succeeds, so git sees no conflict. |
| 6 | 8:00 | **Demo: mergelock check** | `mergelock check agent/auth agent/checkout --format text`. Walk through the **signature_caller** error (the old `login(user)` call in checkout.ts) and the **duplicate_definition** warning (`formatPrice` written twice), plus the suggested fix lines. Show `echo $?`, which prints 2. |
| 7 | 10:30 | **Exit codes and JSON** | 0 clean, 1 warnings, 2 conflict, 3 error. Show the default `--format json` output briefly, the form scripts and agents use. Run `mergelock check agent/auth main` to show the clean, exit-0 case. |
| 8 | 12:00 | **Pre-push hook** | The USAGE.md recipe: `.git/hooks/pre-push` with `mergelock check HEAD origin/main --format text` and `[ $? -le 1 ]`. Warnings pass and conflicts block the push. |
| 9 | 13:30 | **In CI** | The GitHub Action snippet (`fetch-depth: 0`, `sadayamuthu/mergelock@v0`). It checks each PR against its base. |
| 10 | 15:00 | **With AI agents (MCP)** | `claude mcp add mergelock -- mergelock serve`, and the Cursor/Codex config. Paste the standing instruction from USAGE.md into CLAUDE.md or AGENTS.md: "After each commit, and before saying you're done, call the mergelock `check` tool…" Optionally show the Claude Code `Stop` hook that blocks finishing on a conflict. |
| 11 | 17:30 | **Limits (be honest)** | Semantic rules cover TS/JS/Python only. Calls through typed class fields and chained receivers aren't followed yet. It compares *commits*, so agents must commit often. |
| 12 | 18:30 | **Wrap-up** | GitHub link, Zenodo DOI, "ask questions in the comments", next week: **Unasked**, Wed 16 Dec. |

**Tips:**
- Keep the demo repo tiny, so the audience can read every file.
- Show `cat src/checkout.ts` before running the check, so the finding lands.
- Record the terminal at 1080p or higher.

---

## YouTube

**Title** (under 70 characters):

> MergeLock: catch the merge conflicts git can't see (AI agents)

Alternatives:
- *Parallel AI agents broke my build, and git said "no conflicts"*
- *Framework of the week #1: MergeLock, a merge gate for AI agents*

**Description:**

```
Two AI coding agents work on parallel branches. Git merges them cleanly, and the build breaks, because one agent changed a function's signature while the other added a call to the old one.

MergeLock is an open-source, git-native merge gate that catches those semantic conflicts before branches meet: changed signatures with stale callers, symbols deleted on one side but used on the other, and the same function written twice. It never touches your working tree, and it runs as a CLI, in a pre-push hook, in CI (GitHub Action), or for AI agents over MCP. Supports TypeScript, JavaScript and Python.

Week 1 of OpenAstra's Framework of the week: one open-source framework every Wednesday.
Questions? Ask in the comments.

⏱ Chapters
0:00 Git says "merges cleanly". The build breaks.
1:00 Why parallel agents create invisible conflicts
3:00 What MergeLock detects
5:00 Install
6:30 Demo: git sees no conflict
8:00 Demo: mergelock check
10:30 Exit codes and JSON output
12:00 Block bad pushes with a pre-push hook
13:30 Run it in CI (GitHub Action)
15:00 Give your AI agent a merge gate (MCP)
17:30 Current limits
18:30 Next week

🔗 Links
GitHub: https://github.com/sadayamuthu/mergelock
Usage guide: https://github.com/sadayamuthu/mergelock/blob/main/USAGE.md
Session page: https://openastra.org/events/mergelock/
Cite it (Zenodo DOI): https://doi.org/10.5281/zenodo.23637443
All sessions: https://openastra.org/events/

Install:
brew install sadayamuthu/tap/mergelock

Next week (Wed 16 Dec): Unasked, which shows what your coding agent changed that you never asked for.

#AIagents #git #devtools #opensource #AppSec
```

Update the chapter timestamps to match your final edit. YouTube needs the first chapter at 0:00 and at least three chapters.

**Pinned comment:**

> Questions about MergeLock or running parallel agents? Ask here. I'll answer in the comments.
> Report a missed conflict or request a language: https://github.com/sadayamuthu/mergelock/blob/main/CONTRIBUTING.md

**Paper (optional):** if MergeLock has a published paper you want to point to, add a line:
`Paper: <title>, <venue>, <DOI>`. Link to it only; don't show its figures or text.

---

## After uploading

1. In YouTube Studio, set visibility to **Schedule** for Wed 9 Dec 2026, 11:00 AM ET.
2. Copy the video link, for example `https://youtu.be/XXXXXXXXXXX`.
3. In `src/data/events.js`, set the `mergelock` entry's `videoUrl` to that link and merge. The site shows
   "Coming Wed 9 Dec" until 16:00 UTC, then the video.
