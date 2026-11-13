import { Link, NavLink } from 'react-router-dom'
import { GITHUB } from '../data/frameworks'
import { NAV_LINKS } from '../data/nav'


const linkClass = ({ isActive }) =>
  `text-sm pb-0.5 border-b transition-colors ${
    isActive ? 'text-ink border-rust' : 'text-ink-muted border-transparent hover:text-ink'
  }`

export default function Navbar() {
  return (
    <header className="bg-paper/95 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-page mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b-2 border-ink">
        <Link to="/" className="font-serif text-xl tracking-tight text-ink">
          OpenAstra
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </nav>
    </header>
  )
}
