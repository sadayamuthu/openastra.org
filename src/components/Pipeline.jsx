import { Link } from 'react-router-dom'
import { STAGES, frameworks } from '../data/frameworks'

function Names({ stage }) {
  const list = frameworks.filter((f) => f.stage === stage && !f.lab)
  return (
    <span className="flex flex-wrap justify-center gap-x-2">
      {list.map((f, i) => (
        <span key={f.slug}>
          <Link to={`/${f.slug}`} className="hover:text-rust">{f.name}</Link>
          {i < list.length - 1 && <span className="text-ink-muted"> · </span>}
        </span>
      ))}
    </span>
  )
}

function Stage({ label, stage, wide = false }) {
  return (
    <div className={`bg-card border border-rule rounded-sm px-3 py-3 text-center text-sm flex-1 ${wide ? 'w-full' : ''}`}>
      <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-rust mb-1">{label}</p>
      <Names stage={stage} />
    </div>
  )
}

export default function Pipeline() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col md:flex-row items-stretch gap-2">
        {STAGES.map((s, i) => (
          <div key={s.id} className="flex flex-col md:flex-row items-center gap-2 flex-1">
            <Stage label={s.label} stage={s.id} />
            {i < STAGES.length - 1 && <span aria-hidden="true" className="text-ink-muted rotate-90 md:rotate-0">→</span>}
          </div>
        ))}
      </div>
      <Stage label="Foundation" stage="foundation" wide />
      <p className="text-xs text-ink-muted text-center">The security catalogs are the data the gates read from.</p>
    </div>
  )
}
