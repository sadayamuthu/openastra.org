# Week 4: OCBC + ControlGate, compliance controls from catalog to gate (recording kit)

**Publish:** Wed 13 Jan 2027, 11:00 AM ET / 16:00 UTC (schedule it in YouTube Studio)
**Session page:** https://openastra.org/events/ocbc-controlgate/
**Target length:** about 25 minutes (a paired session). Everything shown comes from the public READMEs: **OCBC 0.1.0** (PyPI) and **ControlGate 0.2.1** (PyPI).
**Next session:** Week 5, **OEBC + ExposureGate**, on Wed 20 Jan 2027.

The story: **OCBC** turns NIST SP 800-53 Rev. 5, SP 800-53B and FedRAMP into one enriched, machine-readable catalog. **ControlGate** uses that catalog to check every commit and PR, mapping each finding to a control ID.

---

## ⚠️ Fix or decide before recording

I tested both tools on 2026-11-18 in a clean Python virtualenv. Three findings affect what you say on camera:

1. **ControlGate doesn't download its catalog from OCBC yet.** `controlgate catalog-info` shows
   `Project: NIST Cloud Security Baseline (NCSB) 0.2.0`. It downloads from `sadayamuthu/nist-cloud-security-baseline`,
   not from `openastra.org/ocbc/…`. **The data is identical.** I compared all 1,196 controls: the same severity,
   non_negotiable flag, baseline and FedRAMP membership, and control text, with the same 370 non-negotiable controls, both
   generated on 2026-03-27. Options:
   - **(Recommended)** Before 13 Jan, point ControlGate's `CATALOG_URL` (`src/controlgate/catalog_downloader.py`) at
     `https://openastra.org/ocbc/catalog/v0.1/latest.json`, release it, and update the README's "Data Source" section. Then "catalog to gate" is literally true on screen.
   - Or say on camera: "ControlGate ships with the same enriched catalog, published today as OCBC (formerly NCSB)."
2. **`--gov --baseline moderate` still prints `Framework: NIST`** in the report header, and gave the same verdict as the
   NIST scan in my test. It may be a labelling bug. Check it before showing FedRAMP mode, or describe `--gov` without demoing it.
3. **Any change to a `.tf` file blocks the commit.** It raises `CM-3` (HIGH, non-negotiable), even with
   `change_control: { action: warn }` in `.controlgate.yml`, because `thresholds.block_on: [HIGH]` takes precedence. The demo below
   presents this honestly ("infrastructure changes need review"). If that isn't intended, fix it before recording.

Also note: OCBC's `latest.json` was generated on **2026-03-27**. The workflow checks daily but republishes only when NIST or FedRAMP
change, so say "checked daily, updated when the sources change", not "regenerated every day".

---

## Before you record

- [ ] Python 3.11 or newer in a fresh virtualenv: `python -m venv .venv && source .venv/bin/activate && pip install ocbc controlgate`. Run `ocbc --version`, which prints `ocbc 0.1.0`. (ControlGate has no `--version` flag; use `pip show controlgate`.)
- [ ] `jq` is installed, for the catalog queries.
- [ ] Demo repo is built with the script below, in a throwaway folder.
- [ ] Use an **obviously fake** key in the demo file. The one below is fake and contains "fake", but don't commit or push it anywhere.
- [ ] Decide on items 1–3 above.
- [ ] Clean terminal, large font, no real credentials on screen.

### Part 1: OCBC (tested)

```sh
mkdir ocbc-demo && cd ocbc-demo
curl -s https://openastra.org/ocbc/catalog/v0.1/latest.json | jq '.count'        # → 1196 (no install)
ocbc fetch --out catalog.json                                                   # → Wrote 1196 controls to catalog.json
jq '.generated_at_utc, .framework' catalog.json
jq '.controls[] | select(.control_id=="AC-2") | {control_id, control_name, severity, non_negotiable, baseline_membership, fedramp_membership}' catalog.json
jq '[.controls[] | select(.non_negotiable)] | length' catalog.json                # → 370
jq '[.controls[] | select(.non_negotiable and .family=="AC")] | length' catalog.json  # → 46
jq '[.controls[].severity] | group_by(.) | map({(.[0]): length}) | add' catalog.json
# → {"CRITICAL":83,"HIGH":138,"LOW":773,"MEDIUM":202}
```

Show a few controls, for example `AC-2` (MEDIUM, non-negotiable), `AC-2(1)` (HIGH, enhancement → parent `AC-2`), `IA-5` and `SC-13`.
Explain the severity rule from the README: first appears in Low → MEDIUM, in Moderate → HIGH, in High → CRITICAL, in no baseline → LOW.

### Part 2: ControlGate (tested)

```sh
mkdir cg-demo && cd cg-demo && git init -q -b main && echo "# demo" > README.md && git add -A && git commit -qm base
mkdir app infra
FAKE_KEY="sk_""live_51HfakeFAKEfake0000000000000000"   # split so secret scanners skip this doc; the file gets the full fake key
cat > app/payments.py <<EOF
import requests

API_KEY = "$FAKE_KEY"

def charge(amount):
    return requests.post("https://payments.example.com/charge",
                         json={"amount": amount}, verify=False)
EOF
cat > infra/main.tf <<'EOF'
resource "aws_security_group_rule" "ssh" {
  type        = "ingress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_s3_bucket_acl" "reports" {
  bucket = "reports"
  acl    = "public-read"
}
EOF
controlgate init          # interactive: baseline [moderate], CI workflow y/N … writes .controlgate.yml, .pre-commit-config.yaml, CONTROLGATE.md
git add app infra
controlgate scan --mode pre-commit --format markdown; echo "exit=$?"
```

Expected result: **`🚫 Verdict: BLOCK`, exit code 1**, with a table of all 18 gates and findings mapped to controls:

| Control | Gate | Finding | File |
|---|---|---|---|
| `SC-28` | Secrets | Hardcoded credential | `app/payments.py:3` |
| `SC-8` | Crypto / API | TLS certificate verification disabled | `app/payments.py:7` |
| `SC-7` | IaC | Unrestricted ingress `0.0.0.0/0`; public storage | `infra/main.tf` |
| `AC-3` | IAM | `acl = "public-read"` | `infra/main.tf:11` |
| `CM-3` | Change Control | Security-critical file modified, needs review | `infra/main.tf` |

Each finding shows its **severity from the catalog** (for example "HIGH (non-negotiable)") and a **remediation**. Reports are written to `.controlgate/reports/`.

**The fix:** move the key to an environment variable and drop `verify=False`:

```sh
cat > app/payments.py <<'EOF'
import os
import requests

API_KEY = os.environ["PAYMENTS_API_KEY"]

def charge(amount):
    return requests.post("https://payments.example.com/charge",
                         json={"amount": amount}, timeout=10)
EOF
git reset -q infra          # commit the app fix on its own
git add app
controlgate scan --mode pre-commit --format markdown; echo "exit=$?"   # → ✅ Verdict: PASS, exit 0
```

Then explain the infra file. Even with a tightened CIDR and a private ACL, a `.tf` change still raises **CM-3**: changes to
security-critical files need review. That's the point of change control (see note 3 above).

---

## Outline (about 25 min)

| # | Time | Segment | What to show |
|---|---|---|---|
| 1 | 0:00 | **Hook** | "A hardcoded API key, `verify=False` and an SSH port open to the world. NIST SP 800-53 has a control for each, and this commit is about to be blocked by them." |
| 2 | 1:00 | **The problem** | Compliance lives in PDFs and spreadsheets; code lives in git. Teams find out at audit time. FedRAMP and NIST controls need to be machine-readable, and checked where code changes. |
| 3 | 3:00 | **OCBC: what it is** | One JSON file merging NIST SP 800-53 Rev. 5, SP 800-53B (Low, Moderate, High, Privacy) and FedRAMP (LI-SaaS, Low, Moderate, High). Every control gets `severity` and `non_negotiable`. Stable URL, no install. Show the README "How it works" diagram. |
| 4 | 5:00 | **OCBC: demo** | `curl … latest.json \| jq '.count'`, then `ocbc fetch`. Look at `AC-2` and its enhancement `AC-2(1)`. Count the non-negotiable controls (370) and the severity mix. Mention the historical copies (`historical/YYYY-MM-DD.json`) and the JSON Schema (`schema/v0.1/ocbc.json`). |
| 5 | 8:00 | **OCBC: how it's built** | Fetched live from NIST's OSCAL content and GSA's FedRAMP automation repo. The severity rule. Checked daily in CI and published when sources change. `ocbc generate --non_negotiable_min_baseline high` to self-host or change the rule. |
| 6 | 10:00 | **From catalog to gate** | "Now let's enforce it." ControlGate runs **18 gates** over the diff, maps findings to **45 NIST controls**, and filters by your baseline. Show the README table of the 18 gates. (Say the data-source line from note 1.) |
| 7 | 12:00 | **ControlGate: setup** | `pip install controlgate`, then `controlgate init`: pick the baseline, optional CI workflow. Walk through `.controlgate.yml`: baseline, `gov`, per-gate `block`/`warn`, thresholds, exclusions. |
| 8 | 14:00 | **ControlGate: the blocked commit** | Stage the demo files and run `controlgate scan --mode pre-commit --format markdown`. Show **BLOCK**, the gate table, and each finding's control ID, severity, evidence and remediation. Run `echo $?`, which prints 1. |
| 9 | 17:00 | **Fix and pass** | Env-var key, TLS verification back on, then **PASS** (exit 0). The infra change still needs review (CM-3). |
| 10 | 18:30 | **Pre-commit, PR and CI** | `pip install pre-commit && pre-commit install`, then commit and watch it block. `controlgate scan --mode pr --target-branch main --format json markdown sarif`, where **SARIF** feeds GitHub Code Scanning. The GitHub Action from `hooks/github_action.yml`. `--mode full` for a first-time audit. |
| 11 | 20:30 | **AI agents** | ControlGate's skills for Claude Code, Cursor, Codex and Antigravity (`skills/`). The agent scans its own changes and applies remediations. (Optional; show one `skills/` file.) |
| 12 | 22:00 | **Limits (be honest)** | Pattern-based gates, so false positives are possible, and the test suite repo lists what's covered. Findings map to controls; this is **evidence, not certification**. FedRAMP mode: see note 2. Infrastructure changes always need review. |
| 13 | 23:30 | **Wrap-up** | Both GitHub links and Zenodo DOIs, "ask questions in the comments". Next week: **OEBC + ExposureGate**, exploited vulnerabilities from catalog to gate. |

**Tips:**
- Split the screen or alternate: the catalog JSON on one side, the ControlGate finding citing that control on the other.
  For example, show `SC-28` in `catalog.json`, then the `SC-28` blocking finding. That's the "catalog to gate" moment.
- Keep the demo key obviously fake, and blur it if you change it.

---

## YouTube

**Title** (under 70 characters):

> NIST 800-53 as code: from compliance catalog to commit gate

Alternatives:
- *Block insecure commits with NIST 800-53 and FedRAMP controls*
- *Framework of the week #4: OCBC + ControlGate, compliance as code*

**Description:**

```
NIST SP 800-53 and FedRAMP controls usually live in PDFs and spreadsheets, far from the code they're meant to protect. This session turns them into code in two steps.

OCBC (Open Controls Baseline Catalog) merges NIST SP 800-53 Rev. 5, SP 800-53B baselines and FedRAMP into one machine-readable JSON catalog, with severity and a non-negotiable flag on every control, at a stable URL with no install. ControlGate then scans every commit and pull request with 18 security gates (secrets, crypto, IAM, IaC, supply chain and more), maps each finding to a NIST control ID, and returns BLOCK, WARN or PASS with remediation, as a pre-commit hook, in CI, as SARIF for GitHub Code Scanning, or through AI coding agents.

Week 4 of OpenAstra's Framework of the week: one open-source framework every Wednesday.
Questions? Ask in the comments.

⏱ Chapters
0:00 This commit is about to be blocked
1:00 Why compliance needs to live next to code
3:00 OCBC: NIST 800-53 + FedRAMP in one JSON
5:00 Querying the catalog
8:00 How the catalog is built
10:00 From catalog to gate
12:00 Setting up ControlGate
14:00 A commit blocked by NIST controls
17:00 Fix it and pass
18:30 Pre-commit, PRs, CI and SARIF
20:30 ControlGate with AI coding agents
22:00 Current limits
23:30 Next week

🔗 Links
OCBC on GitHub: https://github.com/sadayamuthu/ocbc
OCBC catalog (latest): https://openastra.org/ocbc/catalog/v0.1/latest.json
ControlGate on GitHub: https://github.com/sadayamuthu/controlgate
ControlGate on PyPI: https://pypi.org/project/controlgate/
Session page: https://openastra.org/events/ocbc-controlgate/
Cite OCBC (Zenodo DOI): https://doi.org/10.5281/zenodo.23980534
Cite ControlGate (Zenodo DOI): https://doi.org/10.5281/zenodo.23980530
All sessions: https://openastra.org/events/

Install:
pip install ocbc controlgate

NIST content is public domain (U.S. Government work). ControlGate maps findings to controls as evidence; it is not a compliance certification.

Next week (Wed 20 Jan): OEBC + ExposureGate, exploited vulnerabilities from catalog to gate.

#NIST #FedRAMP #ComplianceAsCode #DevSecOps #opensource
```

Update the chapter timestamps to match your final edit. YouTube needs the first chapter at 0:00 and at least three chapters.

**Pinned comment:**

> Which baseline are you working toward: NIST Moderate, FedRAMP Moderate, High? Questions about OCBC or ControlGate go here.
> False positive or wrong control mapping? Open an issue: https://github.com/sadayamuthu/controlgate/issues

**Paper (optional):** if either tool has a published paper you want to point to, add a line:
`Paper: <title>, <venue>, <DOI>`. Link to it only; don't show its figures or text.

---

## After uploading

1. In YouTube Studio, set visibility to **Schedule** for Wed 13 Jan 2027, 11:00 AM ET.
2. Copy the video link.
3. In `src/data/events.js`, set the `ocbc-controlgate` entry's `videoUrl` to that link and merge. The site shows
   "Coming Wed 13 Jan" until 16:00 UTC, then the video. Both the OCBC and ControlGate framework pages link to it automatically.
