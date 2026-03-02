const features = [
  {
    icon: '⚡',
    title: 'Zero configuration',
    description:
      'Downloads source OSCAL profiles directly from NIST and GSA FedRAMP automation repos. No local data files to maintain.',
  },
  {
    icon: '🔬',
    title: 'Enriched output',
    description:
      'Every control gets severity (LOW / MEDIUM / HIGH / CRITICAL) and non_negotiable (boolean) fields derived from configurable rules.',
  },
  {
    icon: '🔄',
    title: 'CI-ready',
    description:
      'Ships with a GitHub Actions workflow that regenerates the baseline daily and commits the result automatically.',
  },
]

export default function NCSB() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          📋 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          NCSB
        </h1>
        <p className="text-accent-cyan text-lg">
          NIST Cloud Security Baseline — Enriched SP 800-53 Rev. 5 in machine-readable JSON
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          Merges the full NIST SP 800-53 Rev. 5 control catalog with SP 800-53B baseline
          profiles and FedRAMP OSCAL baselines into a single enriched JSON file — ready
          for policy engines, compliance dashboards, IaC scanners, and cloud-provider mapping tools.
        </p>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary">Key features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-surface border border-subtle rounded-xl p-6 flex flex-col gap-3"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="text-text-primary font-semibold">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-text-primary">Quick start</h2>
        <div className="bg-surface border border-subtle rounded-xl p-6 font-mono text-sm flex flex-col gap-3">
          <div>
            <span className="text-text-muted"># Install</span>
            <p className="text-accent-cyan mt-1">pip install ncsb</p>
          </div>
          <div>
            <span className="text-text-muted"># Generate enriched baseline JSON</span>
            <p className="text-accent-cyan mt-1">ncsb-generate --out baseline.json</p>
          </div>
          <div>
            <span className="text-text-muted"># Or run without installing</span>
            <p className="text-accent-cyan mt-1">python -m src.ncsb.generate --out baseline.json</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/nist-cloud-security-baseline"
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
