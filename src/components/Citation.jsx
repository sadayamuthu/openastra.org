import { useEffect, useRef, useState } from 'react'
import { AUTHOR, bibtex, citationText, doiUrl, zenodoUrl } from '../data/frameworks'

async function copy(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through: insecure context or permission denied
  }
  return false
}

function CopyButton({ label, text, children }) {
  const [state, setState] = useState('idle')
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = async () => {
    const ok = await copy(text)
    setState(ok ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2000)
  }

  const shown = state === 'copied' ? 'Copied' : state === 'failed' ? 'Select & copy' : children
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="px-3 py-1 rounded-sm border border-ink/30 text-xs hover:border-ink transition-colors"
    >
      {shown}
    </button>
  )
}

export default function Citation({ framework, compact = false }) {
  const z = framework.zenodo
  const url = doiUrl(z.doi)
  const version = /^\d/.test(z.version) ? `v${z.version}` : z.version
  return (
    <div className="flex flex-col gap-2">
      <p className="font-serif text-[15px] leading-snug select-all">
        {AUTHOR} ({z.year}). <i>{z.title}</i> ({version}) [Software]. Zenodo.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-rust underline underline-offset-2 break-all hover:text-ink"
        >
          {url}
        </a>
        <div className="flex flex-wrap gap-2">
          <CopyButton label="Copy citation" text={citationText(framework)}>Copy</CopyButton>
          <CopyButton label="Copy BibTeX" text={bibtex(framework)}>BibTeX</CopyButton>
          {!compact && (
            <a
              href={zenodoUrl(z.doi)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-sm border border-ink/30 text-xs hover:border-ink transition-colors"
            >
              Zenodo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
