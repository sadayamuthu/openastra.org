const features = [
  {
    icon: '⚡',
    title: 'Zero configuration',
    description:
      'Downloads from NVD, OSV, and GitHub Advisory. No local data files to maintain.',
  },
  {
    icon: '🔬',
    title: 'Enriched output',
    description:
      'Every CVE gets severity (LOW / MEDIUM / HIGH / CRITICAL) and exploitability fields derived from configurable rules.',
  },
  {
    icon: '🔄',
    title: 'CI-ready',
    description:
      'Ships with a GitHub Actions workflow that regenerates the baseline daily and commits the result automatically.',
  },
]

export default function OEBC() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          📊 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          OEBC
        </h1>
        <p className="text-accent-cyan text-lg">
          Open Exposure Baseline Catalog — Enriched CVE & Vulnerability Data in machine-readable JSON
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          Merges NVD, OSV, and GitHub Advisory data into a single enriched JSON file —
          ready for exposure gates, vulnerability dashboards, IaC scanners, and
          dependency analysis tools.
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
            <p className="text-accent-cyan mt-1">pip install oebc</p>
          </div>
          <div>
            <span className="text-text-muted"># Generate enriched exposure baseline JSON</span>
            <p className="text-accent-cyan mt-1">oebc-generate --out exposure-baseline.json</p>
          </div>
          <div>
            <span className="text-text-muted"># Or run without installing</span>
            <p className="text-accent-cyan mt-1">python -m src.oebc.generate --out exposure-baseline.json</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/oebc"
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
