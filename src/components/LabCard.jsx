import { Link } from 'react-router-dom'
import { Eyebrow } from './ui'

export function SoonTag() {
  return <span className="inline-flex px-2 py-0.5 rounded-full border border-dashed border-rust/60 text-rust text-[11px]">Coming soon</span>
}

function Domain({ project }) {
  if (project.to) {
    return (
      <Link to={project.to} className="font-mono text-xs text-ink-muted hover:text-rust">
        Details →
      </Link>
    )
  }
  return <span className="font-mono text-xs text-ink-muted">{project.domain}</span>
}

export default function LabCard({ project, eyebrow, detailed = false }) {
  const title = project.to ? (
    <Link to={project.to} className="hover:text-rust">{project.name}</Link>
  ) : (
    project.name
  )
  return (
    <article className="border border-dashed border-ink/30 rounded-sm p-4 flex flex-col gap-1.5 h-full">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h3 className="font-serif text-xl">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed flex-1">{detailed ? project.description : project.summary}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Domain project={project} />
        {detailed && <SoonTag />}
      </div>
    </article>
  )
}
