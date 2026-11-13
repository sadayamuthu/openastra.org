const steps = [
  { icon: '🪪', label: 'Publish — add a cyberlake-agent.json manifest and prove ownership via DNS TXT' },
  { icon: '🔬', label: 'Verify — CyberLake signs a cryptographic identity and scans for prompt-injection, dependency, and exfiltration risk' },
  { icon: '🔑', label: 'Trust — review capabilities and provenance before granting credentials, then pin to a known-good version' },
]

export default function CyberLake() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          🌊 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          CyberLake
        </h1>
        <p className="text-accent-cyan text-lg">
          The trust layer for autonomous agents
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          A trust registry for AI agents. Anyone can publish a tool, MCP server, or agent —
          CyberLake verifies it before it ever gets credentials. Every entry carries a signed
          cryptographic identity, a capabilities manifest that shows the blast radius, a
          security and provenance score, and an immutable audit trail with version pinning.
          Know your agents before you give them the keys.
        </p>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-text-primary">How it works</h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
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
            <p className="text-accent-cyan mt-1">pip install cyberlake</p>
          </div>
          <div>
            <span className="text-text-muted"># Run the registry locally</span>
            <p className="text-accent-cyan mt-1">cyberlake serve</p>
          </div>
          <div>
            <span className="text-text-muted"># Verify an agent before it gets credentials</span>
            <p className="text-accent-cyan mt-1">cyberlake verify acme/invoice-reconciler</p>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="flex gap-4 flex-wrap">
        <a
          href="https://github.com/sadayamuthu/cyberlake"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-blue text-space font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
        >
          View on GitHub ↗
        </a>
        <a
          href="https://cyberlake.org"
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
