import { Link } from 'react-router-dom'

export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted ${className}`}>
      {children}
    </p>
  )
}

export function Pill({ children, active = false, soon = false, className = '', ...props }) {
  const tone = active
    ? 'bg-ink text-paper border-ink'
    : soon
      ? 'border-dashed border-rust/60 text-rust'
      : 'border-ink/25 text-ink hover:border-ink'
  const cls = `inline-flex items-center px-3 py-1 rounded-full border text-xs transition-colors ${tone} ${className}`
  if (props.onClick) {
    return <button type="button" className={cls} aria-pressed={active} {...props}>{children}</button>
  }
  return <span className={cls} {...props}>{children}</span>
}

export function DoiTag() {
  return (
    <span className="inline-flex items-center px-1.5 py-px rounded border border-ink/25 font-mono text-[10px] tracking-wide text-ink-muted">
      DOI
    </span>
  )
}

const buttonBase =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-sm border text-sm font-medium transition-colors'
const buttonTone = {
  solid: 'bg-ink text-paper border-ink hover:bg-rust hover:border-rust',
  outline: 'border-ink text-ink hover:bg-ink hover:text-paper',
}

export function Button({ to, href, variant = 'outline', children, className = '', ...props }) {
  const cls = `${buttonBase} ${buttonTone[variant]} ${className}`
  if (to) {
    return <Link to={to} className={cls} {...props}>{children}</Link>
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls} {...props}>
      {children} <span aria-hidden="true">↗</span>
    </a>
  )
}

export function ComingSoon({ label, children, className = '' }) {
  return (
    <div className={`border border-dashed border-ink/30 rounded-sm p-6 text-center flex flex-col items-center gap-1 ${className}`}>
      <Eyebrow>{label}</Eyebrow>
      <p className="font-serif text-2xl text-rust">Coming soon</p>
      {children && <p className="text-sm text-ink-muted max-w-xs">{children}</p>}
    </div>
  )
}

export function CodeBlock({ blocks }) {
  return (
    <div className="bg-ink text-[#EDE7DA] rounded-sm p-5 font-mono text-[13px] leading-relaxed overflow-x-auto flex flex-col gap-3">
      {blocks.map((b, i) => (
        <div key={i}>
          <p className="text-[#EDE7DA]/50">{`# ${b.comment}`}</p>
          {b.lines.map((line, j) => (
            <p key={j} className="whitespace-pre">{line}</p>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SectionLabel({ children }) {
  return <Eyebrow className="mb-4">{children}</Eyebrow>
}
