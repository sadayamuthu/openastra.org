# Week 3: ZeroEgress (recording kit)

**Publish:** Wed 6 Jan 2027, 11:00 AM ET / 16:00 UTC (schedule it in YouTube Studio). This is the first session after the holiday break.
**Session page:** https://openastra.org/events/zero-egress/
**Target length:** about 20 minutes. Everything shown comes from the public README and EGRESS.md, release **v0.1.13** (2026-11-02).
**Next session:** Week 4, **OCBC + ControlGate**, on Wed 13 Jan 2027.

> Unlike weeks 1 and 2, this is a desktop app, so this kit was **not run end to end**. The steps come from the
> README and EGRESS.md. Items marked 🔁 should be checked once in a rehearsal before you record.

---

## Before you record

- [ ] **Install the latest release, v0.1.13**, from GitHub Releases. Never use the **0.1.0 `.deb`**: it registered Microsoft's apt repository (see the README advisory). The Zenodo DOI is for 0.1.0, which is fine to cite, but demo the latest.
  - Apple silicon: `ZeroEgress-0.1.13-arm64-unsigned.dmg`; Intel: `-x64-unsigned.dmg`.
  - The build is **unsigned**, so macOS blocks the first launch. On macOS 15 or later: open it once, then **System Settings → Privacy & Security → Open Anyway**. Or run `xattr -dr com.apple.quarantine /Applications/ZeroEgress.app`. Do this before recording, or show it briefly as a tip.
- [ ] **Verify the download** (an on-camera moment): download `SHA256SUMS` next to the `.dmg`, then run `shasum -a 256 -c SHA256SUMS --ignore-missing`. It should print `OK`.
- [ ] **Ollama** is installed and running, and the model is pulled before recording (it's 9 GB):
  `ollama pull qwen2.5-coder:14b`. The README recommends 14B or larger for agent mode and background agents; 7B is enough for chat, Quick Edit and autocomplete. The README demo used an M3 Max, so plan to cut the waits for the model in editing.
- [ ] **Demo project:** a small **git** repo you own, with a few files, a test, and an uncommitted change. Background agents need a single folder inside a git repository. Don't use work code.
- [ ] **🔁 Rehearse the "blocked connection" moment** (segment 9) once, so you know exactly what it logs.
- [ ] **🔁 Rehearse Egress Proof** (segment 10): create the report and verify it.
- [ ] Use a fresh profile or a clean state, so no personal settings, file names or chat history show on screen. Turn notifications off.
- [ ] Optional, for the strongest proof: run **Little Snitch** or another outbound firewall that logs per process (EGRESS.md "Method A").
- [ ] Show only released features. Use your own visuals, not figures from any paper.

---

## Outline (about 20 min)

| # | Time | Segment | What to show |
|---|---|---|---|
| 1 | 0:00 | **Hook** | **Turn Wi-Fi off on camera.** "My AI code editor still works: chat, agent mode, autocomplete. Nothing leaves this laptop." |
| 2 | 1:00 | **The problem** | AI editors send code, prompts and telemetry to services you don't control. That rules them out for regulated, client-confidential or air-gapped work. |
| 3 | 2:30 | **What ZeroEgress is** | A fork of **VSCodium** (not affiliated with Microsoft or VSCodium). It talks only to model servers you run (**Ollama, vLLM, LM Studio, oMLX**), on loopback or your own network. Walk through the README table "What never leaves your machine": telemetry, auto-update, marketplace, cloud sign-in, crash upload and tunnels are removed, and **everything else is blocked and logged**. |
| 4 | 4:30 | **Install and verify** | Pick the `.dmg` from Releases (or `.exe`, `.deb`, `.rpm`, AppImage, `.tar.gz`). Run `shasum -a 256 -c SHA256SUMS`. Explain the unsigned-build first-launch step. |
| 5 | 6:00 | **Connect a model** | `ollama pull qwen2.5-coder:14b`. First run: welcome screen, then **Connect a model**, which finds Ollama at `127.0.0.1:11434` and recommends a model. Point out that it probes only 3 loopback addresses and never scans your network. Show the **Local** pill in the title bar. |
| 6 | 7:30 | **Quick Edit and chat** | Select code and press **Cmd+K**: the change shows as a diff with **Accept / Reject**. Press **Cmd+L** for chat. Optionally turn on autocomplete under Settings → **Editor** (it's off by default). |
| 7 | 9:30 | **Agent mode** | Ask the agent for a small change. It asks before editing files or running commands (**Approve / Cancel**), and every change waits for review (**Accept all / Reject all**, Cmd+Y / Cmd+N). |
| 8 | 11:30 | **Background agents** | Press **Shift+Cmd+A**, or use **Move to background**. The agent works in its own git worktree (branch `ze/agent-<id>`) while you keep editing. Review its changes one by one in the Agents view. A conflicting change is never applied silently: **Keep mine / Use agent's**. |
| 9 | 13:30 | **Prove it: the network log** | Open **View → Output → ZeroEgress: Network**. 🔁 Trigger one connection to a host you didn't configure. For example, open **Help → Toggle Developer Tools** and run `fetch('https://example.com')` in the console. Show it blocked and logged: `… blocked example.com:443 (caller: renderer)`. Paths and queries are never logged. |
| 10 | 15:00 | **Prove it: Egress Proof** | Settings → **Network & privacy → Egress Proof → Create report…** saves a signed PDF and JSON of every destination it connected to, built from an always-on local ledger (`host:port`, counts and times only, never code or prompts). 🔁 Verify it offline with `verify-egress-proof.mjs`, which is attached to the release. |
| 11 | 16:30 | **Your own model server** | Point **Models** at a bigger machine, for example `http://192.168.1.50:11434` (without `/v1`). The guard allows exactly that host:port, and an **internet** address gets a warning: "code you send will leave your network". It's your call. Show `OLLAMA_HOST=0.0.0.0 ollama serve` and keep the server behind your firewall. |
| 12 | 17:30 | **Limits (be honest)** | From EGRESS.md: the guard controls the editor's own traffic. **Terminal processes, stdio MCP servers, git to your own remote and extensions' child processes are out of scope.** A deliberately malicious extension can get past the guard, so install extensions only from `.vsix` you trust, and use an OS firewall for an independent check. The SBOM doesn't list everything yet. Agent mode needs a 14B+ model. |
| 13 | 18:30 | **Wrap-up** | GitHub link, Zenodo DOI, "ask questions in the comments". Next week: **OCBC + ControlGate**, compliance controls from catalog to gate. |

**Tips:**
- Keep Wi-Fi off from segment 5 to segment 10. It's the most convincing visual in the series.
- Cut model wait times in editing, and say so on camera or in a caption, as the README demo does.
- Use the README's own wording for the limits. Being upfront builds trust with a security audience.

---

## YouTube

**Title** (under 70 characters):

> ZeroEgress: an AI code editor that works with Wi-Fi off

Alternatives:
- *Use AI coding agents without sending your code anywhere*
- *Framework of the week #3: ZeroEgress, offline AI coding with local models*

**Description:**

```
Can you use an AI code editor when your code isn't allowed to leave the building? ZeroEgress is an open-source AI code editor (a fork of VSCodium) with chat, agent mode, background agents, quick edit and autocomplete, all talking only to model servers you run yourself: Ollama, vLLM, LM Studio or oMLX.

Telemetry, auto-update, the online marketplace, crash upload and cloud sign-in are removed. A runtime guard blocks every other connection and logs it, and the Egress Proof report gives you a signed record of every destination it connected to, which anyone can verify offline. In this session, we turn the Wi-Fi off and keep coding.

Week 3 of OpenAstra's Framework of the week: one open-source framework every Wednesday.
Questions? Ask in the comments.

⏱ Chapters
0:00 Wi-Fi off, AI still on
1:00 Why AI editors are a problem for sensitive code
2:30 What ZeroEgress removes and blocks
4:30 Install and verify the download
6:00 Connect a local model (Ollama)
7:30 Quick Edit and chat
9:30 Agent mode: approve, then review every change
11:30 Background agents in their own git worktrees
13:30 Proof 1: the blocked-connection log
15:00 Proof 2: the signed Egress Proof report
16:30 Use a model server on your network
17:30 What it doesn't cover
18:30 Next week

🔗 Links
GitHub: https://github.com/sadayamuthu/zero-egress
Download (latest release): https://github.com/sadayamuthu/zero-egress/releases/latest
How the egress guard works: https://github.com/sadayamuthu/zero-egress/blob/main/EGRESS.md
Session page: https://openastra.org/events/zero-egress/
Cite it (Zenodo DOI): https://doi.org/10.5281/zenodo.23679808
All sessions: https://openastra.org/events/

Model used: qwen2.5-coder:14b in Ollama (ollama pull qwen2.5-coder:14b)

ZeroEgress is built on VSCodium and is not affiliated with Microsoft or the VSCodium project.

Next week (Wed 13 Jan): OCBC + ControlGate, compliance controls from catalog to gate.

#AIcoding #LocalLLM #Ollama #privacy #devsecops #opensource
```

Update the chapter timestamps to match your final edit. YouTube needs the first chapter at 0:00 and at least three chapters.

**Pinned comment:**

> Which local model are you using for coding? Questions about ZeroEgress, air-gapped setups or the egress guard go here too.
> Found a connection to a host you didn't configure? That's a security bug: https://github.com/sadayamuthu/zero-egress/blob/main/SECURITY.md

**Branding note:** say "built on VSCodium" or "a fork of VSCodium". Don't use the VS Code logo or call it "VS Code" in the title or thumbnail. The README states it isn't affiliated with Microsoft or VSCodium.

**Paper (optional):** if ZeroEgress has a published paper you want to point to, add a line:
`Paper: <title>, <venue>, <DOI>`. Link to it only; don't show its figures or text.

---

## After uploading

1. In YouTube Studio, set visibility to **Schedule** for Wed 6 Jan 2027, 11:00 AM ET.
2. Copy the video link.
3. In `src/data/events.js`, set the `zero-egress` entry's `videoUrl` to that link and merge. The site shows
   "Coming Wed 6 Jan" until 16:00 UTC, then the video.
