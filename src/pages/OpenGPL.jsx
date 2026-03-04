const steps = [
  { icon: '📝', label: 'Write declarative .gpl policies' },
  { icon: '🤖', label: 'AI agents load & evaluate policies at runtime' },
  { icon: '✅', label: 'ALLOW / DENY / AUDIT with traceable evidence' },
]

export default function OpenGPL() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-20">

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-xs tracking-widest uppercase">
          📜 Product
        </div>
        <h1 className="text-5xl font-bold text-text-primary leading-tight">
          OpenGPL
        </h1>
        <p className="text-accent-cyan text-lg">
          Generative Policy Language for AI Systems
        </p>
        <p className="text-text-muted text-base max-w-2xl leading-relaxed">
          An open, declarative policy language purpose-built for generative AI systems.
          Define how AI agents behave, what resources they can access, what they can produce,
          and how they demonstrate compliance — at runtime and at rest.
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
            <span className="text-text-muted"># Example policy (policy.gpl)</span>
            <p className="text-accent-cyan mt-1">{'policy "restrict-pii-output" {'}</p>
            <p className="text-accent-cyan pl-4">{'agent: *'}</p>
            <p className="text-accent-cyan pl-4">{'action: generate'}</p>
            <p className="text-accent-cyan pl-4">{'resource: user_data'}</p>
            <p className="text-accent-cyan pl-4">{'effect: deny'}</p>
            <p className="text-accent-cyan pl-4">{'when: output.contains_pii == true'}</p>
            <p className="text-accent-cyan">{'}'}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <a
          href="https://github.com/sadayamuthu/opengpl"
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
