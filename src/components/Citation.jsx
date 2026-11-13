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

function CopyButton({ label, text, onFail, children }) {
  const [state, setState] = useState('idle')
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = async () => {
    const ok = await copy(text)
    if (!ok) {
      setState('idle')
      onFail(text)
      return
    }
    setState('copied')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2000)
  }

  const shown = state === 'copied' ? 'Copied' : children
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

function Fallback({ label, text }) {
  const ref = useRef()
  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [text])
  return (
    <label className="flex flex-col gap-1 text-xs text-ink-muted">
      <span>{label} · press ⌘C / Ctrl+C to copy</span>
      <textarea
        ref={ref}
        readOnly
        aria-label={label}
        value={text}
        rows={label === 'BibTeX' ? 9 : 3}
        className="w-full font-mono text-xs text-ink bg-paper border border-rule rounded-sm p-2"
      />
    </label>
  )
}

export default function Citation({ framework, compact = false }) {
  const [fallback, setFallback] = useState(null)
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
          <CopyButton label="Copy citation" text={citationText(framework)} onFail={(text) => setFallback({ label: 'Citation', text })}>Copy</CopyButton>
          <CopyButton label="Copy BibTeX" text={bibtex(framework)} onFail={(text) => setFallback({ label: 'BibTeX', text })}>BibTeX</CopyButton>
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
      {fallback && <Fallback label={fallback.label} text={fallback.text} />}
    </div>
  )
}
