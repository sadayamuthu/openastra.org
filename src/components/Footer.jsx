import { Link } from 'react-router-dom'
import { GITHUB } from '../data/frameworks'
import { NAV_LINKS } from '../data/nav'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="max-w-page mx-auto px-4 sm:px-6 py-8 border-t-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-ink-muted">
        <p className="flex flex-wrap items-center gap-x-1.5">
          <Logo size={18} className="text-ink gap-1.5" wordmarkClassName="text-base" /> · Independent research · Autonomous systems security
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-ink">{l.label}</Link>
          ))}
          <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-ink">GitHub ↗</a>
        </div>
        <p>© {new Date().getFullYear()} · Open source</p>
      </div>
    </footer>
  )
}
