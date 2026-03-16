const steps = [
  { icon: '✍️', label: 'Developer writes code' },
  { icon: '🔍', label: 'Exposure gates scan the diff' },
  { icon: '✅', label: 'BLOCK 🚫 / WARN ⚠️ / PASS ✅' },
]

const gates = [
  'CVE detection', 'Secrets exposure', 'Dependency vulnerabilities',
  'Container image scanning', 'SBOM analysis', 'Exposed endpoints',
  'Misconfiguration detection', 'License risk',
]

export default function ExposureGate() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          🔍 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          ExposureGate
        </h1>
        <p className="text-accent-cyan text-lg">
          CVE & Exposure Scanning — Pre-Commit & Pre-Merge Exposure Gate
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          An AI-powered gate that scans code changes against known CVEs, exposed secrets,
          and vulnerability patterns before every commit and merge. Maps findings to CVE IDs —
          providing traceable exposure evidence and actionable remediation.
        </p>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary">How it works</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="bg-surface border border-subtle rounded-xl px-6 py-4 text-center flex-1 min-w-[160px]">
                <div className="text-2xl mb-2">{step.icon}</div>
                <p className="text-text-muted text-sm">{step.label}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="text-subtle text-xl hidden sm:block">→</span>
              )}
            </div>
          ))}
        </div>
        <div className="bg-surface border border-subtle rounded-xl p-6">
          <p className="text-text-muted text-sm mb-3">Exposure gates include:</p>
          <div className="flex flex-wrap gap-2">
            {gates.map((gate) => (
              <span
                key={gate}
                className="px-3 py-1 rounded-full border border-subtle text-text-muted text-xs"
              >
                {gate}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full border border-subtle text-text-muted text-xs">
              + more
            </span>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-text-primary">Quick start</h2>
        <div className="bg-surface border border-subtle rounded-xl p-6 font-mono text-sm flex flex-col gap-3">
          <div>
            <span className="text-text-muted"># Install</span>
            <p className="text-accent-cyan mt-1">pip install exposuregate</p>
          </div>
          <div>
            <span className="text-text-muted"># Bootstrap your project</span>
            <p className="text-accent-cyan mt-1">exposuregate init</p>
          </div>
          <div>
            <span className="text-text-muted"># Scan staged changes</span>
            <p className="text-accent-cyan mt-1">exposuregate scan --mode pre-commit</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/exposuregate"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          View on GitHub ↗
        </a>
      </section>

    </div>
  )
}
