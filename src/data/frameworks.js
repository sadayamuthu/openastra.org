export const AUTHOR = 'Sadayamuthu, K.'
export const GITHUB = 'https://github.com/sadayamuthu'

export const categories = [
  {
    id: 'agentic',
    numeral: 'I',
    name: 'Agentic',
    blurb: 'Tools for working safely alongside AI coding agents: what they merge, what they change, where your code goes, and which agents you trust.',
  },
  {
    id: 'security-controls',
    numeral: 'II',
    name: 'Security Controls',
    blurb: 'Gates and policies that enforce NIST-grade controls before code merges and while AI systems run.',
  },
  {
    id: 'security-catalog',
    numeral: 'III',
    name: 'Security Catalog',
    blurb: 'Machine-readable baselines of controls and exposures, rebuilt weekly, that the gates read from.',
  },
  {
    id: 'observability',
    numeral: 'IV',
    name: 'Observability',
    blurb: 'See what your AI systems actually did, with tools you already know.',
  },
  {
    id: 'identity',
    numeral: 'V',
    name: 'Identity & Access',
    blurb: 'Who an agent is, what it may do, and on whose behalf: short-lived identities and delegated authorization.',
  },
  {
    id: 'governance',
    numeral: 'VI',
    name: 'Governance & Compliance',
    blurb: 'Machine-checkable policy for AI systems, mapped to ISO 42001 and the NIST AI RMF.',
  },
  {
    id: 'threat-modeling',
    numeral: 'VII',
    name: 'Threat Modeling & Risk',
    blurb: 'Attack paths, threat catalogs and risk scores for agent deployments, mapped to OWASP and MITRE ATLAS.',
  },
  {
    id: 'runtime',
    numeral: 'VIII',
    name: 'Runtime Security',
    blurb: 'Checks on the agent\'s tool path while it runs: inspection, enforcement and isolation of every tool call.',
  },
  {
    id: 'data-security',
    numeral: 'IX',
    name: 'Data Security & Privacy',
    blurb: 'Keeping RAG and vector stores inside their permissions, and catching leaks and poisoning.',
  },
  {
    id: 'resilience',
    numeral: 'X',
    name: 'Resilience & Recovery',
    blurb: 'How agents fail, how to stop them, and how to undo what they did.',
  },
]

export const STAGES = [
  { id: 'write', label: 'Write' },
  { id: 'review', label: 'Review' },
  { id: 'merge', label: 'Merge' },
  { id: 'run', label: 'Run' },
]

export const frameworks = [
  // ───────────── I. Agentic ─────────────
  {
    slug: 'mergelock',
    name: 'MergeLock',
    number: 1,
    category: 'agentic',
    stage: 'merge',
    summary: "Merge conflicts git can't see between parallel agent branches",
    tagline: "Catches the merge conflicts git can't see between parallel AI agent branches.",
    description:
      'A git-native merge gate. mergelock check compares two branches before they meet and reports the conflicts git itself won\'t tell you about: a function whose signature changed on one branch while the other added calls to the old signature, a symbol deleted on one side but still used on the other, the same function written twice.',
    problem:
      'Two agents edit different files. Git merges cleanly. The build breaks, because one agent changed a signature and the other added a caller.',
    steps: [
      { title: 'Merge in memory', text: 'Computes the merge from commits with git merge-tree. Your working tree is never touched.' },
      { title: 'Parse both sides', text: 'Builds a symbol graph of each branch with tree-sitter (TypeScript, JavaScript, Python).' },
      { title: 'Report conflicts', text: 'Flags semantic conflicts with severities, in a pre-push hook, in CI, or for an agent over MCP.' },
    ],
    highlights: {
      title: 'What it detects',
      items: ['textual', 'add_add', 'modify_delete', 'signature_caller', 'duplicate_definition'],
    },
    quickstart: [
      { comment: 'Install (Homebrew, macOS and Linux)', lines: ['brew install sadayamuthu/tap/mergelock'] },
      { comment: 'Check two branches before they meet', lines: ['mergelock check my-branch main'] },
      { comment: 'Or run it in Docker as an MCP server', lines: ['docker run -i --rm -v "$PWD":/repo ghcr.io/sadayamuthu/mergelock'] },
    ],
    facts: [
      ['Languages', 'TS · JS · Python'],
      ['Interfaces', 'CLI · MCP · GitHub Action'],
      ['Packages', 'brew · deb · rpm · Docker'],
      ['Requires', 'git 2.38+'],
    ],
    links: { github: `${GITHUB}/mergelock` },
    packages: [
      { label: 'Homebrew', url: 'https://github.com/sadayamuthu/homebrew-tap/blob/main/Formula/mergelock.rb' },
      { label: 'Docker', url: 'https://github.com/sadayamuthu/mergelock/pkgs/container/mergelock' },
      { label: '.deb / .rpm / binaries', url: 'https://github.com/sadayamuthu/mergelock/releases/latest' },
      { label: 'GitHub Action', url: 'https://github.com/sadayamuthu/mergelock/blob/main/action.yml' },
      { label: 'MCP Registry', url: 'https://registry.modelcontextprotocol.io/v0/servers?search=io.github.sadayamuthu/mergelock' },
    ],
    zenodo: { doi: '10.5281/zenodo.23637443', title: 'mergelock: a git-native merge gate', version: '0.1.5', year: 2026, date: '2026-10-25' },
  },
  {
    slug: 'unasked',
    name: 'Unasked',
    number: 2,
    category: 'agentic',
    stage: 'review',
    summary: 'Finds and reverts the edits you never asked for',
    tagline: 'See what your coding agent changed that you never asked for.',
    description:
      'When an AI coding agent stops, unasked reads what you asked for and what the agent said before each edit, scores every hunk of the diff, and lists the ones nobody asked for: the "unused" function it deleted, the test it loosened, the dependency it bumped. Then unasked --drop reverts exactly those hunks and nothing else.',
    problem:
      'You asked for rate limiting. The agent also deleted a header two other files still use, loosened a test, and bumped a dependency, all in the same diff.',
    steps: [
      { title: 'Read intent', text: 'Reads your prompts and the agent transcript (Claude Code, Codex).' },
      { title: 'Score every hunk', text: 'Each hunk is invited, unclear or unasked, and is labeled deletion, test, dependency, feature, refactor or collateral.' },
      { title: 'Drop and undo', text: '--drop reverts only the unasked hunks and verifies the result; unasked undo restores it byte for byte.' },
    ],
    highlights: {
      title: 'What it flags',
      items: ['deletion', 'test', 'dependency', 'feature', 'refactor', 'collateral'],
    },
    quickstart: [
      { comment: 'Install: download a .deb, .rpm or binary from Releases, or run in Docker', lines: ['docker run --rm -v "$PWD":/repo ghcr.io/sadayamuthu/unasked --since origin/main'] },
      { comment: 'After your agent stops: report unasked hunks', lines: ['unasked'] },
      { comment: 'Revert exactly those hunks, and undo if needed', lines: ['unasked --drop', 'unasked undo'] },
    ],
    facts: [
      ['Works with', 'Claude Code · Codex'],
      ['Network', 'None. Local and deterministic'],
      ['Packages', 'deb · rpm · Docker · binaries'],
      ['Requires', 'git 2.30+'],
    ],
    links: { github: `${GITHUB}/unasked` },
    packages: [
      { label: 'Docker', url: 'https://github.com/sadayamuthu/unasked/pkgs/container/unasked' },
      { label: '.deb / .rpm / binaries', url: 'https://github.com/sadayamuthu/unasked/releases/latest' },
      { label: 'GitHub Action', url: 'https://github.com/sadayamuthu/unasked/blob/main/action.yml' },
    ],
    zenodo: { doi: '10.5281/zenodo.23637740', title: 'unasked: see what your coding agent changed that you never asked for', version: '0.1.0', year: 2026, date: '2026-10-25' },
  },
  {
    slug: 'zero-egress',
    name: 'ZeroEgress',
    number: 3,
    category: 'agentic',
    stage: 'write',
    summary: 'Offline AI code editor; nothing leaves your machine',
    tagline: 'An AI code editor that works offline.',
    description:
      'Chat, agent mode, background agents, quick edit and autocomplete, talking only to model servers you run yourself: Ollama, vLLM, LM Studio or oMLX. Telemetry, auto-update, the online marketplace and cloud sign-in are removed, and a runtime guard blocks and logs every other connection.',
    problem:
      'AI code editors send your code, prompts and telemetry to services you don\'t control, which rules them out for regulated and air-gapped work.',
    steps: [
      { title: 'Connect a local model', text: 'First run finds a local Ollama (or vLLM, LM Studio, oMLX) and recommends a model.' },
      { title: 'Code with agents', text: 'Chat, quick edit, autocomplete, and background agents in their own git worktrees, with every change reviewed.' },
      { title: 'Prove zero egress', text: 'A runtime guard blocks any other connection and lists it under ZeroEgress: Network.' },
    ],
    highlights: {
      title: 'Removed or blocked',
      items: ['Telemetry', 'Auto-update', 'Extension marketplace', 'Cloud sign-in', 'Crash upload', 'Remote tunnels'],
    },
    quickstart: [
      { comment: 'Download for macOS, Windows or Linux', lines: ['https://github.com/sadayamuthu/zero-egress/releases/latest'] },
      { comment: 'Run a local model', lines: ['ollama pull qwen2.5-coder:14b'] },
      { comment: 'Debian / Ubuntu', lines: ['sudo apt install ./zero-egress_<v>_amd64.deb'] },
    ],
    facts: [
      ['Models', 'Ollama · vLLM · LM Studio · oMLX'],
      ['Platforms', 'macOS · Windows · Linux'],
      ['Telemetry', 'None'],
    ],
    links: { github: `${GITHUB}/zero-egress` },
    packages: [
      { label: '.dmg / .exe / .deb / .rpm / AppImage', url: 'https://github.com/sadayamuthu/zero-egress/releases/latest' },
    ],
    zenodo: { doi: '10.5281/zenodo.23679808', title: 'ZeroEgress: an AI code editor that works offline', version: '0.1.0', year: 2026, date: '2026-10-26' },
  },
  {
    slug: 'switchyard',
    name: 'switchyard',
    number: 11,
    category: 'runtime',
    stage: 'run',
    summary: 'The shared MCP proxy core for OpenAstra runtime tools',
    tagline: 'The shared MCP proxy core for OpenAstra runtime tools.',
    description:
      'A Go library that sits between an AI agent and its MCP tool servers, passes every message through untouched, and lets a tool plug in code that runs on each call: observe it, delay it, block it, answer it, or rewrite the result. AgentChaos, AgentLock, AgentTaint, AgentFuse, AgentRewind and AgentBox are built on it, and stack by chaining.',
    problem:
      'Six tools need to sit on the agent\'s tool path. Without a shared core, each re-implements MCP framing, request matching, cancellation and pass-through, and the six proxies may interfere when stacked.',
    steps: [
      { title: 'Transparent by default', text: 'With no hooks, a client can\'t tell switchyard is there: same capabilities, tools, notifications and errors.' },
      { title: 'Hook by MCP method', text: 'A hook sees each request before it goes upstream and the response on the way back, and can continue, rewrite, block, answer or hang.' },
      { title: 'Trace every hop', text: 'Hooked requests, decisions and responses are written as versioned JSONL events, with a shared ID across a chain.' },
    ],
    highlights: {
      title: 'A hook can',
      items: ['observe', 'delay', 'block', 'answer', 'rewrite'],
    },
    quickstart: [
      { comment: 'Add the library to your Go module', lines: ['go get github.com/sadayamuthu/switchyard@latest'] },
      { comment: 'Or install the pass-through debug proxy', lines: ['go install github.com/sadayamuthu/switchyard/cmd/switchyard@latest'] },
      { comment: 'Trace every call to an MCP server', lines: ['switchyard --trace trace.jsonl -- <cmd> [args...]'] },
    ],
    facts: [
      ['Kind', 'Go library · debug binary'],
      ['Transport', 'stdio (HTTP planned)'],
      ['Traces', 'Versioned JSONL'],
      ['Requires', 'Go 1.26+'],
    ],
    links: { github: `${GITHUB}/switchyard` },
    packages: [
      { label: 'Go package', url: 'https://pkg.go.dev/github.com/sadayamuthu/switchyard' },
      { label: 'Release', url: 'https://github.com/sadayamuthu/switchyard/releases/latest' },
    ],
  },
  {
    slug: 'agentchaos',
    name: 'AgentChaos',
    number: 12,
    category: 'resilience',
    stage: 'run',
    summary: 'Chaos engineering for AI agents',
    tagline: 'Breaks the world around an agent and reports how it fails.',
    description:
      'agentchaos deliberately breaks the world around an agent (tool timeouts, malformed responses, partial failures) and reports how the agent fails: safely, by retrying forever, by making things up to fill the gap, or by passing the failure on to other agents. It runs the agent against its real tools through a fault-injecting MCP proxy built on switchyard.',
    problem:
      'Agents are tested on the happy path. In production, APIs time out, return half a page, or return an error the model reads as an instruction, and almost nobody tests how the agent behaves then.',
    steps: [
      { title: 'Wrap the tools', text: 'Runs the agent against its real tools through a fault-injecting MCP proxy (stdio in v0).' },
      { title: 'Inject faults', text: 'YAML experiments make a tool hang, lag, fail, return partial results or return malformed data.' },
      { title: 'Grade behaviour', text: 'Records what the agent did next and scores each experiment against the expected safe behaviour, in a JSON report.' },
    ],
    highlights: {
      title: 'Faults in v0',
      items: ['timeout', 'slow', 'error', 'partial', 'malformed'],
    },
    quickstart: [
      { comment: 'Install the CLI', lines: ['go install github.com/sadayamuthu/agentchaos/cmd/agentchaos@latest'] },
      { comment: 'Run an experiment file against a real agent', lines: ['agentchaos run experiments/support-agent.yaml'] },
    ],
    facts: [
      ['Interfaces', 'CLI · MCP proxy'],
      ['Report', 'JSON'],
      ['Built on', 'switchyard'],
      ['Requires', 'Go 1.26+'],
    ],
    links: { github: `${GITHUB}/agentchaos` },
    packages: [
      { label: 'Go package', url: 'https://pkg.go.dev/github.com/sadayamuthu/agentchaos/cmd/agentchaos' },
      { label: 'Release', url: 'https://github.com/sadayamuthu/agentchaos/releases/latest' },
    ],
  },
  {
    slug: 'cyberlake',
    name: 'CyberLake',
    lab: true,
    category: 'agentic',
    stage: 'run',
    summary: 'Trust registry for agents and MCP servers',
    tagline: 'The trust layer for autonomous agents.',
    description:
      'A trust registry for AI agents. Anyone can publish a tool, MCP server, or agent, and CyberLake verifies it before it ever gets credentials. Every entry carries a signed cryptographic identity, a capabilities manifest that shows the blast radius, a security and provenance score, and an immutable audit trail with version pinning. Know your agents before you give them the keys.',
    steps: [
      { title: 'Publish', text: 'Add a cyberlake-agent.json manifest and prove ownership via DNS TXT.' },
      { title: 'Verify', text: 'CyberLake signs a cryptographic identity and scans for prompt-injection, dependency, and exfiltration risk.' },
      { title: 'Trust', text: 'Review capabilities and provenance before granting credentials, then pin to a known-good version.' },
    ],
    status: 'Coming soon',
    facts: [
      ['Status', 'Coming soon'],
      ['Kind', 'Registry'],
      ['Identity', 'Signed, DNS-verified'],
      ['Audit', 'Immutable, version-pinned'],
    ],
    links: { github: `${GITHUB}/cyberlake` },
  },

  // ───────────── II. Security Controls ─────────────
  {
    slug: 'controlgate',
    name: 'ControlGate',
    number: 4,
    category: 'security-controls',
    stage: 'review',
    summary: 'NIST 800-53 pre-commit and pre-merge compliance gate',
    tagline: 'NIST RMF & FedRAMP cloud security hardening, as a pre-commit and pre-merge compliance gate.',
    description:
      'An AI-powered agent skill that scans your code changes against NIST SP 800-53 Rev. 5 and FedRAMP before every commit and merge. Maps findings directly to specific NIST control IDs, providing traceable compliance evidence and actionable remediation.',
    steps: [
      { title: 'Developer writes code', text: 'Work as usual. ControlGate runs at pre-commit and at PR time.' },
      { title: '18 security gates scan the diff', text: 'Each finding maps to a specific NIST SP 800-53 control ID.' },
      { title: 'Verdict', text: 'BLOCK, WARN or PASS, with remediation guidance.' },
    ],
    highlights: {
      title: 'Security gates include',
      items: ['Secrets detection', 'Cryptography validation', 'IAM policy checks', 'Supply chain verification', 'Infrastructure-as-code analysis', 'SBOM generation', 'Audit logging', 'Input validation', '+ 10 more'],
    },
    quickstart: [
      { comment: 'Install', lines: ['pip install controlgate'] },
      { comment: 'Bootstrap your project', lines: ['controlgate init'] },
      { comment: 'Scan staged changes', lines: ['controlgate scan --mode pre-commit --format markdown'] },
    ],
    facts: [
      ['Framework', 'NIST SP 800-53 Rev. 5'],
      ['Controls', '370 non-negotiable'],
      ['Baselines', 'FedRAMP'],
      ['Runs at', 'Pre-commit · PR'],
    ],
    links: { github: `${GITHUB}/controlgate` },
    packages: [
      { label: 'PyPI', url: 'https://pypi.org/project/controlgate/' },
    ],
    zenodo: { doi: '10.5281/zenodo.23980530', title: 'ControlGate: A Pre-Commit and Pre-Merge NIST SP 800-53 Compliance Gate', version: '0.2.1', year: 2026, date: '2026-11-05' },
  },
  {
    slug: 'exposuregate',
    name: 'ExposureGate',
    number: 5,
    category: 'security-controls',
    stage: 'merge',
    summary: 'Exploited-vulnerability gate for dependency lockfiles',
    tagline: 'Exploited-CVE grading for lockfiles, as a pre-commit and pre-merge exposure gate.',
    description:
      'A command-line gate that grades the dependency versions a code change adds to its lockfiles before commit and merge. Every added or changed version, direct and transitive, is matched to OSV advisories, and their CVE aliases are tiered by the Open Exposure Baseline Catalog (OEBC): KEV-listed CVEs are CRITICAL, and EPSS and CVSS set the lower tiers. Scans never touch the network and fail closed on missing or stale data.',
    steps: [
      { title: 'Change a lockfile', text: 'Add or bump a dependency. ExposureGate runs at pre-commit and at PR time.' },
      { title: 'Grade every added version', text: 'Each added or changed pin, direct and transitive, is matched to OSV advisories and tiered by OEBC.' },
      { title: 'Verdict', text: 'PASS, WARN, BLOCK or DENY, as JSON and Markdown.' },
    ],
    highlights: {
      title: 'What it grades',
      items: ['requirements*.txt', 'poetry.lock', 'uv.lock', 'package-lock.json (v2, v3)', 'Direct and transitive pins', 'KEV, EPSS and CVSS tiers', 'Offline scans', 'Fails closed on stale data', 'Historical replay'],
    },
    quickstart: [
      { comment: 'Install', lines: ['pip install exposuregate'] },
      { comment: 'Download OEBC and the OSV exports (the only network step)', lines: ['exposuregate update-data'] },
      { comment: 'Grade the staged lockfiles', lines: ['exposuregate scan'] },
      { comment: 'Grade a pull request', lines: ['exposuregate scan --mode pr --target-branch main'] },
    ],
    facts: [
      ['Ecosystems', 'PyPI · npm'],
      ['Data', 'OEBC · OSV'],
      ['Verdicts', 'PASS · WARN · BLOCK · DENY'],
      ['Runs at', 'Pre-commit · PR'],
    ],
    links: { github: `${GITHUB}/exposuregate` },
    packages: [
      { label: 'PyPI', url: 'https://pypi.org/project/exposuregate/' },
      { label: 'GitHub Action', url: 'https://github.com/sadayamuthu/exposuregate/blob/main/action.yml' },
      { label: 'Pre-commit hook', url: 'https://github.com/sadayamuthu/exposuregate/blob/main/.pre-commit-hooks.yaml' },
    ],
    zenodo: { doi: '10.5281/zenodo.24241823', title: 'ExposureGate: exploited-vulnerability gate for dependency lockfiles in pre-commit and CI', version: '0.1.0', year: 2026, date: '2026-11-15' },
  },
  // ───────────── V. Identity & Access ─────────────
  {
    slug: 'openapl',
    name: 'OpenAPL',
    number: 9,
    category: 'identity',
    stage: 'run',
    summary: 'Access policy language for humans and AI agents',
    tagline: 'Who can do what, for whom, and the proof of it.',
    description:
      'An open, declarative access policy language for humans, agents and services, enforced at any gateway. It evaluates the whole delegation chain, from the human who started the work through every agent it passed through to the agent calling the tool, and returns ALLOW, DENY or REQUIRE_APPROVAL with the entitlements, policies and control references behind the decision. No LLM sits in the decision path.',
    problem:
      'A support agent hands a refund to a refund agent. The gateway sees only the last hop, so nobody can say which human the refund is for, whether that human could have done it, or what the agent could reach if it were hijacked.',
    steps: [
      { title: 'Declare access', text: 'Principals, owners, entitlements and delegation in .apl.yaml files; an agent declares the humans it acts_for.' },
      { title: 'Decide at the gateway', text: 'A sidecar answers Envoy ext_authz and AuthZEN 1.0, so a gateway such as agentgateway checks every MCP tool call.' },
      { title: 'Prove the decision', text: 'Each decision records the chain, entitlements and controls behind it; explain shows what a compromised agent could reach.' },
    ],
    highlights: {
      title: 'Decisions',
      items: ['ALLOW', 'DENY', 'REQUIRE_APPROVAL'],
    },
    quickstart: [
      { comment: 'Install the SDK and CLI from a clone (Python 3.11+)', lines: ['pip install -e sdk', 'openapl validate spec/examples'] },
      {
        comment: 'Decide one request along a delegation chain',
        lines: [
          'openapl decide spec/examples \\',
          '  --chain user:alice@acme.com,support-agent,refund-agent \\',
          '  --origin-claims \'{"groups": ["support-staff"]}\' \\',
          '  --action payments.refund --resource order/123 \\',
          '  --attr order_id=123 --attr amount=150 --attr account_status=open \\',
          '  --purpose customer-refund --task-id t1',
          '# DECISION: ALLOW (with amount=350: REQUIRE_APPROVAL)',
        ],
      },
      { comment: 'What could this agent reach if it were compromised?', lines: ['openapl explain spec/examples support-agent'] },
    ],
    facts: [
      ['Decisions', 'Deterministic · no LLM'],
      ['Wire', 'AuthZEN 1.0 · Envoy ext_authz'],
      ['Ships as', 'Spec · Python SDK · CLI · sidecar'],
      ['Licenses', 'CC BY 4.0 spec · Apache-2.0 code'],
    ],
    links: { github: `${GITHUB}/openapl` },
    // TODO(openapl): paste the Zenodo DOI once the v0.1.0 deposit is published.
    // The DOI test in frameworks.test.js fails until then, so this cannot merge without it.
    zenodo: { doi: 'TODO', title: 'OpenAPL: Access Policy Language for humans and AI agents', version: '0.1.0', year: 2026, date: '2026-11-19' },
  },

  // ───────────── VI. Governance & Compliance ─────────────
  {
    slug: 'opengpl',
    name: 'OpenGPL',
    number: 10,
    category: 'governance',
    stage: 'write',
    summary: 'Declarative governance policy language for AI',
    tagline: 'Governance Policy Language for AI systems.',
    description:
      'An open, declarative policy language purpose-built for generative AI systems. Define how AI agents behave, what resources they can access, what they can produce, and how they demonstrate compliance, at runtime and at rest.',
    steps: [
      { title: 'Write policies', text: 'Declare behavior in .gpl files.' },
      { title: 'Evaluate at runtime', text: 'AI agents load and evaluate policies through the SDK, CLI or Docker sidecar.' },
      { title: 'Decide with evidence', text: 'ALLOW, DENY or AUDIT, with traceable evidence mapped to NIST AI RMF, FedRAMP and ISO 42001.' },
    ],
    quickstart: [
      {
        comment: 'Example policy (policy.gpl)',
        lines: ['policy "restrict-pii-output" {', '  agent: *', '  action: generate', '  resource: user_data', '  effect: deny', '  when: output.contains_pii == true', '}'],
      },
    ],
    facts: [
      ['Mappings', 'NIST AI RMF · FedRAMP · ISO 42001'],
      ['Ships as', 'SDK · CLI · Docker sidecar'],
    ],
    links: { github: `${GITHUB}/opengpl`, website: 'https://opengpl.org' },
    packages: [
      { label: 'PyPI', url: 'https://pypi.org/project/opengpl-sdk/' },
      { label: 'Docker (sidecar)', url: 'https://github.com/sadayamuthu/opengpl/pkgs/container/opengpl%2Fsidecar' },
    ],
    zenodo: { doi: '10.5281/zenodo.23844061', title: 'OpenGPL: Governance Policy Language', version: '0.2.0', year: 2026, date: '2026-10-31' },
  },

  // ───────────── III. Security Catalog ─────────────
  {
    slug: 'ocbc',
    name: 'OCBC',
    number: 6,
    category: 'security-catalog',
    stage: 'foundation',
    summary: 'NIST 800-53 + FedRAMP as one enriched JSON catalog',
    tagline: 'Open Controls Baseline Catalog: enriched SP 800-53 Rev. 5 in machine-readable JSON.',
    description:
      'Merges the full NIST SP 800-53 Rev. 5 control catalog with SP 800-53B baseline profiles and FedRAMP OSCAL baselines into a single enriched JSON file, ready for policy engines, compliance dashboards, IaC scanners, and cloud-provider mapping tools.',
    steps: [
      { title: 'Fetch', text: 'Downloads source OSCAL profiles directly from NIST and GSA FedRAMP automation repos.' },
      { title: 'Enrich', text: 'Adds severity and non_negotiable fields to every control from configurable rules.' },
      { title: 'Publish', text: 'Regenerated daily in CI and committed automatically.' },
    ],
    features: [
      { title: 'Zero configuration', text: 'Downloads source OSCAL profiles directly from NIST and GSA FedRAMP automation repos. No local data files to maintain.' },
      { title: 'Enriched output', text: 'Every control gets severity (LOW / MEDIUM / HIGH / CRITICAL) and non_negotiable (boolean) fields derived from configurable rules.' },
      { title: 'CI-ready', text: 'Ships with a GitHub Actions workflow that regenerates the baseline weekly and commits the result automatically.' },
    ],
    quickstart: [
      { comment: 'Download the latest catalog (no install)', lines: ['curl -s https://openastra.org/ocbc/catalog/v0.1/latest.json -o catalog.json'] },
      { comment: 'Or use the CLI', lines: ['pip install ocbc', 'ocbc fetch --out catalog.json'] },
      { comment: 'Generate from the live NIST and FedRAMP sources', lines: ['ocbc generate --out my-catalog.json'] },
    ],
    facts: [
      ['Sources', 'NIST SP 800-53 Rev. 5 · 800-53B · FedRAMP OSCAL'],
      ['Format', 'JSON'],
      ['Updated', 'Daily'],
    ],
    links: { github: `${GITHUB}/ocbc` },
    packages: [
      { label: 'PyPI', url: 'https://pypi.org/project/ocbc/' },
      { label: 'Latest catalog (.json)', url: 'https://openastra.org/ocbc/catalog/v0.1/latest.json' },
      { label: 'Baseline JSON release', url: 'https://github.com/sadayamuthu/ocbc/releases/latest' },
    ],
    zenodo: { doi: '10.5281/zenodo.23980534', title: 'OCBC: Open Controls Baseline Catalog, a Machine-Readable NIST SP 800-53 Rev. 5 and FedRAMP Catalog', version: 'baseline-2026-03-27', year: 2026, date: '2026-11-05' },
  },
  {
    slug: 'oebc',
    name: 'OEBC',
    number: 7,
    category: 'security-catalog',
    stage: 'foundation',
    summary: 'NVD + OSV + GHSA exposure catalog, enriched with EPSS and KEV',
    tagline: 'Open Exposure Baseline Catalog: enriched CVE & vulnerability data in machine-readable JSON.',
    description:
      'Merges NVD, OSV, and GitHub Advisory data into a single enriched JSON file, ready for exposure gates, vulnerability dashboards, IaC scanners, and dependency analysis tools.',
    steps: [
      { title: 'Fetch', text: 'Downloads from NVD, OSV, and GitHub Advisory.' },
      { title: 'Enrich', text: 'Adds severity and exploitability fields to every CVE from configurable rules.' },
      { title: 'Publish', text: 'Regenerated daily in CI and committed automatically.' },
    ],
    features: [
      { title: 'Zero configuration', text: 'Downloads from NVD, OSV, and GitHub Advisory. No local data files to maintain.' },
      { title: 'Enriched output', text: 'Every CVE gets severity (LOW / MEDIUM / HIGH / CRITICAL) and exploitability fields derived from configurable rules.' },
      { title: 'CI-ready', text: 'Ships with a GitHub Actions workflow that regenerates the baseline weekly and commits the result automatically.' },
    ],
    quickstart: [
      { comment: 'Download the latest catalog (no install)', lines: ['curl -L https://openastra.org/oebc/catalog/v0.1/latest.json.gz | gunzip > oebc_catalog.json'] },
      { comment: 'Or build it from source', lines: ['git clone https://github.com/sadayamuthu/oebc.git', 'cd oebc', 'make install-dev', 'make generate'] },
    ],
    facts: [
      ['Sources', 'NVD · OSV · GitHub Advisory'],
      ['Format', 'JSON'],
      ['Updated', 'Daily'],
    ],
    links: { github: `${GITHUB}/oebc` },
    packages: [
      { label: 'Latest catalog (.json.gz)', url: 'https://openastra.org/oebc/catalog/v0.1/latest.json.gz' },
      { label: 'Catalog release', url: 'https://github.com/sadayamuthu/oebc/releases/latest' },
    ],
    zenodo: { doi: '10.5281/zenodo.23980544', title: 'OEBC: Open Exposure Baseline Catalog, a CVE Exposure Baseline Enriched with EPSS and CISA KEV', version: 'baseline-2026-06-14', year: 2026, date: '2026-11-05' },
  },

  // ───────────── IV. Observability ─────────────
  {
    slug: 'anysql',
    name: 'anySQL',
    number: 8,
    category: 'observability',
    stage: 'run',
    summary: 'SQL over LLM calls, agent traces and RAG pipelines',
    tagline: 'SQL analytics for AI systems.',
    description:
      'An open-source engine that lets you query LLM responses, agent traces, and RAG pipelines using standard SQL. Auto-logs every AI API call into six canonical tables, then surfaces insights through DuckDB queries with zero configuration. From vibes to queries.',
    steps: [
      { title: 'Wrap your client', text: 'Wrap your LLM client with anySQL.' },
      { title: 'Auto-log', text: 'Every call lands in 6 canonical SQL tables, in-memory on DuckDB and persisted to SQLite.' },
      { title: 'Query', text: 'Use standard SQL or the built-in analytics.' },
    ],
    quickstart: [
      { comment: 'Install', lines: ['pip install anysql-sdk'] },
      { comment: 'Wrap your client and run analytics', lines: ['import anysql', 'db = anysql.init()', 'client = anysql.claude(db).wrap(anthropic_client)', 'df = db.rag_failure_modes()'] },
    ],
    facts: [
      ['Engine', 'DuckDB · SQLite'],
      ['Config', 'Zero'],
    ],
    links: { github: `${GITHUB}/anySQL`, website: 'https://anysql.org' },
    packages: [
      { label: 'PyPI', url: 'https://pypi.org/project/anysql-sdk/' },
    ],
    zenodo: { doi: '10.5281/zenodo.23980548', title: 'anySQL: SQL Analytics for AI Systems', version: '0.1.1', year: 2026, date: '2026-11-05' },
  },
]

export function getFramework(slug) {
  return frameworks.find((f) => f.slug === slug)
}

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}

export function shippedFrameworks() {
  return frameworks.filter((f) => !f.lab).sort((a, b) => a.number - b.number)
}

export function frameworksByCategory() {
  return categories.map((category) => ({
    category,
    frameworks: shippedFrameworks()
      .filter((f) => f.category === category.id)
      .sort((a, b) => a.number - b.number),
  })).filter((g) => g.frameworks.length > 0)
}

export function doiUrl(doi) {
  return `https://doi.org/${doi}`
}

export function zenodoUrl(doi) {
  return `https://zenodo.org/doi/${doi}`
}

function versionLabel(version) {
  return /^\d/.test(version) ? `v${version}` : version
}

export function citationText(fw) {
  const z = fw.zenodo
  return `${AUTHOR} (${z.year}). ${z.title} (${versionLabel(z.version)}) [Software]. Zenodo. ${doiUrl(z.doi)}`
}

export function bibtex(fw) {
  const z = fw.zenodo
  const key = `sadayamuthu${z.year}${fw.slug.replace(/[^a-z0-9]/g, '')}`
  return [
    `@software{${key},`,
    `  author = {Sadayamuthu, Karthikeyan},`,
    `  title = {${z.title}},`,
    `  year = {${z.year}},`,
    `  version = {${z.version}},`,
    `  publisher = {Zenodo},`,
    `  doi = {${z.doi}},`,
    `  url = {${doiUrl(z.doi)}}`,
    `}`,
  ].join('\n')
}

export const citedFrameworks = () => frameworks.filter((f) => f.zenodo)

// ───────────── In the lab ─────────────
// Early-stage projects: no DOIs yet, so no numbers in the index.
// Domains are shown as plain text until each site is live.

export const LAB_GROUPS = [
  {
    id: 'openq',
    name: 'OpenQ suite',
    title: 'OpenQ: the quantum-safe suite',
    blurb: 'From "what\'s at risk" to "fixed", following NIST FIPS 203, 204 and 205.',
  },
  { id: 'agentic', name: 'Agentic', title: 'I. Agentic' },
  { id: 'security-controls', name: 'Security Controls', title: 'II. Security Controls' },
  { id: 'observability', name: 'Observability', title: 'IV. Observability' },
  { id: 'identity', name: 'Identity & Access', title: 'V. Identity & Access' },
  { id: 'threat-modeling', name: 'Threat Modeling & Risk', title: 'VII. AI Threat Modeling & Risk Assessment' },
  {
    id: 'runtime',
    name: 'Runtime Security',
    title: 'VIII. AI Runtime Security',
    blurb: 'Checks on the agent\'s tool path, built on the switchyard MCP proxy core and stacked in a chain.',
  },
  { id: 'data-security', name: 'Data Security & Privacy', title: 'IX. AI Data Security & Privacy' },
  { id: 'resilience', name: 'Resilience & Recovery', title: 'X. AI Resilience & Recovery' },
]

// Paused for now: the OpenQ suite, AgentID, OpenQA, OpenCIQ, OpenEQ and CyberLake
// are kept here but left off the site. Set to true to show them again.
const SHOW_PAUSED_LAB = false

const NEW_LAB_PROJECTS = [
  {
    name: 'OpenQR',
    domain: 'openqr.dev',
    group: 'openq',
    step: 'Know',
    category: 'security-catalog',
    summary: 'Post-quantum algorithm catalog',
    description: 'A machine-readable, daily-updated catalog of cryptographic algorithms, their NIST post-quantum status, library support, and migration mappings.',
  },
  {
    name: 'OpenQS',
    domain: 'openqs.org',
    group: 'openq',
    step: 'Find',
    category: 'security-controls',
    summary: 'Scan and gate quantum-vulnerable crypto',
    description: 'Finds quantum-vulnerable cryptography in code and infrastructure, produces a cryptography inventory, and gates new uses before merge.',
  },
  {
    name: 'OpenQO',
    domain: 'openqo.org',
    group: 'openq',
    step: 'Fix',
    category: 'security-controls',
    summary: 'Migrate to PQC and rotate keys',
    description: 'Automated changes to hybrid post-quantum cryptography, plus ordered certificate and key rotation, with Unasked-style checks on every change.',
  },
  {
    name: 'AgentID',
    domain: 'openid.ai',
    group: 'identity',
    category: 'identity',
    summary: 'Identity and scoped credentials for AI agents',
    description: 'Cryptographic identities for agents, short-lived task-scoped credentials, and verifiable on-behalf-of chains.',
  },
  {
    name: 'OpenQA',
    domain: 'openqa.dev',
    group: 'agentic',
    category: 'agentic',
    summary: 'Adversarial test suites for agents in CI',
    description: 'Repeatable adversarial suites (prompt injection, unasked edits, tool misuse, risky merges) run in CI, with a scorecard per run.',
  },
  {
    name: 'OpenCIQ',
    domain: 'openciq.com',
    group: 'observability',
    category: 'observability',
    summary: 'Continuous compliance scoring with OSCAL evidence',
    description: 'Each NIST control gets a live score with the evidence behind it, and FedRAMP SSP and POA&M documents are generated in OSCAL.',
  },
  {
    name: 'OpenEQ',
    domain: 'openeq.dev',
    group: 'observability',
    category: 'observability',
    summary: 'Egress record for AI agents and dev tools',
    description: 'A record of every outbound connection from agents, IDEs and MCP servers, with egress rules and a "what left this machine" report.',
  },
]

// ───────────── Open-area lab projects ─────────────
// Lab projects for agenda areas VII–X; each `area` is a category numeral. Their
// repos are public (design stage, no code yet) and each card links to its repo.
// switchyard (VIII) and AgentChaos (X) shipped and are in the index.
const repo = (name) => `${GITHUB}/${name}`

export const OPEN_AREA_PROJECTS = [
  {
    name: 'ThreatDiff',
    area: 'VII',
    repo: repo('threatdiff'),
    summary: 'Threat models generated from agent configuration, checked on every pull request',
    description: 'Reads what an agent can see and do (system prompt, tools, MCP servers, data sources and triggers), builds a capability graph, and finds paths from untrusted input to dangerous actions. On a pull request it reports only the attack paths the PR opens and closes.',
  },
  {
    name: 'OATC',
    area: 'VII',
    repo: repo('oatc'),
    summary: 'Open AI Threat Catalog',
    description: 'Merges the OWASP Top 10 for LLM Applications, the OWASP Top 10 for Agentic Applications and MITRE ATLAS into one cross-mapped JSON catalog, and maps each threat to the NIST SP 800-53 controls that mitigate it, using OCBC.',
  },
  {
    name: 'AgentRisk',
    area: 'VII',
    repo: repo('agentrisk'),
    summary: 'One risk score per AI agent',
    description: 'Scores an agent deployment on how much untrusted input reaches it, how sensitive its tools are, how much it does without a human, and how much of it can be undone, so a fleet can be ranked. The score comes with an explanation you can act on.',
  },
  {
    name: 'AgentLock',
    area: 'VIII',
    repo: repo('agentlock'),
    summary: 'Tool calls limited to what the user asked for',
    description: 'Turns the user\'s request into a capability envelope (the tools the agent may call, the argument values they may take, the recipients and paths they may touch) and enforces it at an MCP proxy, so a prompt injection that tries to widen the task is blocked before the call runs.',
  },
  {
    name: 'AgentTaint',
    area: 'VIII',
    repo: repo('agenttaint'),
    summary: 'Taint tracking for AI agents',
    description: 'Labels every piece of an agent\'s context by where it came from (the user, the system prompt, a web page, an email, a tool output) and follows those labels into tool-call arguments. Untrusted text that reaches a shell command, URL or email recipient is blocked or sent to a human.',
  },
  {
    name: 'AgentBox',
    area: 'VIII',
    repo: repo('agentbox'),
    summary: 'A disposable sandbox for every risky tool call',
    description: 'Runs each risky tool call (shell commands, code execution, file edits, package installs) in a short-lived microVM or WebAssembly sandbox with no network by default and a scratch filesystem, and checks the results against policy before anything is copied back.',
  },
  {
    name: 'Tripwire',
    area: 'IX',
    repo: repo('tripwire'),
    summary: 'Canary documents for RAG',
    description: 'Plants unique synthetic records in vector stores, one per permission boundary, tenant or retrieval path. When a canary shows up where it shouldn\'t (the wrong user\'s answer, a log, a trace, outbound traffic), you know a boundary failed, and which one.',
  },
  {
    name: 'ACLDrift',
    area: 'IX',
    repo: repo('acldrift'),
    summary: 'Permission drift detection for RAG indexes',
    description: 'Compares every indexed chunk with the access list of its source document (Google Drive, Confluence, SharePoint, GitHub and similar) and reports chunks that more people can retrieve than could ever read the original.',
  },
  {
    name: 'HubScan',
    area: 'IX',
    repo: repo('hubscan'),
    summary: 'Find poisoned documents in RAG corpora by geometry',
    description: 'Poisoned documents are written to be retrieved for as many queries as possible, which makes them hubs in embedding space. HubScan finds documents that rank highly for far more queries than they should, plus chunks with hidden instructions, without needing to know what the attack says.',
  },
  {
    name: 'AgentRewind',
    area: 'X',
    repo: repo('agentrewind'),
    summary: 'An undo log for AI agents',
    description: 'Records the action that would undo each agent action (delete the bucket it created, revert the commit it pushed), then rolls back a whole agent session in one command across the filesystem, git, cloud APIs and SaaS tools, newest action first.',
  },
  {
    name: 'AgentFuse',
    area: 'X',
    repo: repo('agentfuse'),
    summary: 'Circuit breakers and a kill switch for AI agent fleets',
    description: 'Sets per-agent and per-fleet limits on actions per minute, spend, distinct resources touched and error rate. When an agent trips one, AgentFuse revokes its credentials in one step and pauses the agents that depend on it, so one misbehaving agent doesn\'t take down the rest.',
  },
]

const GROUP_ORDER = LAB_GROUPS.map((g) => g.id)
const AREA_CATEGORY = Object.fromEntries(categories.map((c) => [c.numeral, c.id]))

export function labProjects() {
  const fromFrameworks = frameworks
    .filter((f) => f.lab)
    .map((f) => ({ name: f.name, group: f.category, category: f.category, summary: f.summary, description: f.tagline, to: `/${f.slug}` }))
  const openAreas = OPEN_AREA_PROJECTS.map((p) => ({ ...p, group: AREA_CATEGORY[p.area], category: AREA_CATEGORY[p.area] }))
  const all = [...(SHOW_PAUSED_LAB ? [...NEW_LAB_PROJECTS, ...fromFrameworks] : []), ...openAreas]
  return GROUP_ORDER.flatMap((g) => all.filter((p) => p.group === g))
}

// Lab groups that currently have at least one project.
export function activeLabGroups() {
  const used = new Set(labProjects().map((p) => p.group))
  return LAB_GROUPS.filter((g) => used.has(g.id))
}

// ───────────── Repo docs ─────────────
// What each public repo has at its root, checked against GitHub on 2026-11-24.
// Update an entry when a repo adds a doc; add one for each new public repo.

export const DOC_KINDS = [
  { id: 'thesis', label: 'Thesis', file: 'THESIS.md' },
  { id: 'roadmap', label: 'Roadmap', file: 'ROADMAP.md' },
  { id: 'contributing', label: 'Contributing', file: 'CONTRIBUTING.md' },
  { id: 'governance', label: 'Governance', file: 'GOVERNANCE.md' },
  { id: 'maintainers', label: 'Maintainers', file: 'MAINTAINERS.md' },
  { id: 'citation', label: 'Citation', file: 'CITATION.cff' },
]

const ALL_DOCS = DOC_KINDS.map((d) => d.id)
const LICENSE_NAMES = { 'Apache-2.0': 'Apache 2.0', MIT: 'MIT' }

// Keyed by lowercase repo name.
const REPO_DOCS = {
  mergelock: { license: 'Apache-2.0', docs: ['contributing'] },
  unasked: { license: 'MIT', docs: ['contributing'] },
  'zero-egress': { license: 'Apache-2.0', licenseFile: 'LICENSE.txt', docs: ['contributing'] },
  switchyard: { license: 'Apache-2.0', docs: ALL_DOCS },
  agentchaos: { license: 'Apache-2.0', docs: ALL_DOCS },
  controlgate: { license: 'MIT', docs: ['contributing', 'citation'] },
  exposuregate: { license: 'MIT', docs: ['contributing', 'citation'] },
  openapl: { license: 'Apache-2.0', docs: ['contributing', 'citation'] },
  opengpl: { license: 'Apache-2.0', docs: ['contributing', 'citation'] },
  ocbc: { license: 'MIT', docs: ['contributing', 'citation'] },
  oebc: { license: 'MIT', docs: ['contributing', 'citation'] },
  anysql: { license: 'Apache-2.0', docs: ['roadmap', 'contributing', 'governance', 'maintainers', 'citation'] },
  // Open-area lab repos (VII–X).
  threatdiff: { license: 'Apache-2.0', docs: ALL_DOCS },
  oatc: { license: 'Apache-2.0', docs: ALL_DOCS },
  agentrisk: { license: 'Apache-2.0', docs: ALL_DOCS },
  agentlock: { license: 'Apache-2.0', docs: ALL_DOCS },
  agenttaint: { license: 'Apache-2.0', docs: ALL_DOCS },
  agentbox: { license: 'Apache-2.0', docs: ALL_DOCS },
  tripwire: { license: 'Apache-2.0', docs: ALL_DOCS },
  acldrift: { license: 'Apache-2.0', docs: ALL_DOCS },
  hubscan: { license: 'Apache-2.0', docs: ALL_DOCS },
  agentrewind: { license: 'Apache-2.0', docs: ALL_DOCS },
  agentfuse: { license: 'Apache-2.0', docs: ALL_DOCS },
}

const repoName = (url) => url.replace(`${GITHUB}/`, '')

// Code, docs and license links for one repo, or null when it has no public docs entry.
export function repoDocs(url) {
  const name = repoName(url)
  const entry = REPO_DOCS[name.toLowerCase()]
  if (!entry) return null
  const file = (f) => `${GITHUB}/${name}/blob/main/${f}`
  return {
    code: `${GITHUB}/${name}`,
    docs: DOC_KINDS.filter((d) => entry.docs.includes(d.id)).map((d) => ({ ...d, url: file(d.file) })),
    license: { id: entry.license, label: LICENSE_NAMES[entry.license] ?? entry.license, url: file(entry.licenseFile ?? 'LICENSE') },
  }
}

// One group per category, I to X: its shipped frameworks (by number), then its
// lab projects. Categories with neither are left out.
export function openSourceGroups() {
  const lab = labProjects()
  return categories
    .map((category) => ({
      category,
      rows: [
        ...shippedFrameworks()
          .filter((f) => f.category === category.id)
          .map((f) => ({ name: f.name, to: `/${f.slug}`, lab: false, ...repoDocs(f.links.github) })),
        ...lab
          .filter((p) => p.category === category.id)
          .map((p) => ({ name: p.name, to: p.to, lab: true, ...(p.repo && repoDocs(p.repo)) })),
      ],
    }))
    .filter((g) => g.rows.length > 0)
}

// ───────────── Research agenda ─────────────
// Ten focus areas, one per site category; their projects are derived from it so
// the agenda and the index never disagree.

export const AGENDA = [
  { numeral: 'I', name: 'Agentic AI Security', category: 'agentic', topics: 'Agent autonomy, multi-agent security, MCP and A2A, agent orchestration' },
  { numeral: 'II', name: 'Security Controls', category: 'security-controls', topics: 'Policy as code, guardrails, preventive and detective controls, enforcement' },
  { numeral: 'III', name: 'Security Catalog', category: 'security-catalog', topics: 'Control and threat catalogs, AI asset inventory, risk mappings' },
  { numeral: 'IV', name: 'Observability & Monitoring', category: 'observability', topics: 'Agent tracing, audit logging, anomaly detection, behavioral monitoring' },
  { numeral: 'V', name: 'AI Identity & Access', category: 'identity', topics: 'Agent identities, workload identity, delegated authorization, least privilege' },
  { numeral: 'VI', name: 'AI Governance & Compliance', category: 'governance', topics: 'NIST AI RMF, ISO 42001, regulatory compliance, continuous assurance' },
  { numeral: 'VII', name: 'AI Threat Modeling & Risk Assessment', category: 'threat-modeling', topics: 'OWASP LLM and Agentic Top 10, MITRE ATLAS, risk scoring, attack paths' },
  { numeral: 'VIII', name: 'AI Runtime Security', category: 'runtime', topics: 'Runtime guardrails, tool-call inspection, execution isolation, sandboxing' },
  { numeral: 'IX', name: 'AI Data Security & Privacy', category: 'data-security', topics: 'RAG security, data leakage prevention, vector store security, data poisoning' },
  { numeral: 'X', name: 'AI Resilience & Recovery', category: 'resilience', topics: 'Agent rollback, action recovery, kill switches, cascading failure prevention' },
]

export function agenda() {
  const lab = labProjects()
  return AGENDA.map((a) => ({
    ...a,
    shipped: shippedFrameworks().filter((f) => f.category === a.category),
    lab: lab.filter((p) => p.category === a.category).map(({ name, to, group }) => ({ name, to, group })),
  }))
}
