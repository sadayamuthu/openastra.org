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
    blurb: 'Machine-readable baselines of controls and exposures, rebuilt daily, that the gates read from.',
  },
  {
    id: 'observability',
    numeral: 'IV',
    name: 'Observability',
    blurb: 'See what your AI systems actually did, with tools you already know.',
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
    slug: 'cyberlake',
    name: 'CyberLake',
    number: 4,
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
    status: 'In development',
    facts: [
      ['Status', 'In development'],
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
    number: 5,
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
    number: 6,
    category: 'security-controls',
    stage: 'merge',
    summary: 'CVE and exposure gate for every code change',
    tagline: 'CVE & exposure scanning, as a pre-commit and pre-merge exposure gate.',
    description:
      'An AI-powered gate that scans code changes against known CVEs, exposed secrets, and vulnerability patterns before every commit and merge. Maps findings to CVE IDs, providing traceable exposure evidence and actionable remediation.',
    steps: [
      { title: 'Developer writes code', text: 'Work as usual. ExposureGate runs at pre-commit and at PR time.' },
      { title: 'Exposure gates scan the diff', text: 'Findings map to CVE IDs.' },
      { title: 'Verdict', text: 'BLOCK, WARN or PASS, with remediation guidance.' },
    ],
    highlights: {
      title: 'Exposure gates include',
      items: ['CVE detection', 'Secrets exposure', 'Dependency vulnerabilities', 'Container image scanning', 'SBOM analysis', 'Exposed endpoints', 'Misconfiguration detection', 'License risk', '+ more'],
    },
    status: 'In development',
    facts: [
      ['Status', 'In development'],
      ['Runs at', 'Pre-commit · PR'],
    ],
    links: { github: `${GITHUB}/exposuregate` },
  },
  {
    slug: 'opengpl',
    name: 'OpenGPL',
    number: 7,
    category: 'security-controls',
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
    number: 8,
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
      { title: 'CI-ready', text: 'Ships with a GitHub Actions workflow that regenerates the baseline daily and commits the result automatically.' },
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
    number: 9,
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
      { title: 'CI-ready', text: 'Ships with a GitHub Actions workflow that regenerates the baseline daily and commits the result automatically.' },
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
    number: 10,
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

export function frameworksByCategory() {
  return categories.map((category) => ({
    category,
    frameworks: frameworks
      .filter((f) => f.category === category.id)
      .sort((a, b) => a.number - b.number),
  }))
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
