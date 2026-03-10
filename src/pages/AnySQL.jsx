const steps = [
  { icon: '🔌', label: 'Wrap your LLM client with anySQL' },
  { icon: '📊', label: 'Auto-logs calls to 6 canonical SQL tables' },
  { icon: '🔍', label: 'Query with standard SQL or built-in analytics' },
]

export default function AnySQL() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          🗄️ Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          anySQL
        </h1>
        <p className="text-accent-cyan text-lg">
          SQL Analytics for AI Systems
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          An open-source engine that lets you query LLM responses, agent traces, and RAG
          pipelines using standard SQL. Auto-logs every AI API call into six canonical
          tables — then surfaces insights through DuckDB queries with zero configuration.
          From vibes to queries.
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
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-text-primary">Quick start</h2>
        <div className="bg-surface border border-subtle rounded-xl p-6 font-mono text-sm flex flex-col gap-3">
          <div>
            <span className="text-text-muted"># Install</span>
            <p className="text-accent-cyan mt-1">pip install anysql-sdk</p>
          </div>
          <div>
            <span className="text-text-muted"># Wrap your client and run analytics</span>
            <p className="text-accent-cyan mt-1">import anysql</p>
            <p className="text-accent-cyan">db = anysql.init()</p>
            <p className="text-accent-cyan">client = anysql.claude(anthropic_client)</p>
            <p className="text-accent-cyan">df = db.rag_failure_modes()</p>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="flex gap-4 flex-wrap">
        <a
          href="https://github.com/sadayamuthu/anySQL"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          View on GitHub ↗
        </a>
        <a
          href="https://anysql.org"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-subtle text-text-primary text-sm hover:border-accent-cyan transition-colors duration-200"
        >
          Website ↗
        </a>
      </section>

    </div>
  )
}
