import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm transition-colors duration-200 ${
      isActive ? 'text-accent-cyan' : 'text-text-muted hover:text-text-primary'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-subtle">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg">
          <span className="text-accent-cyan">✦</span>
          <span>OpenAstra</span>
        </Link>
        <div className="flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/controlgate" className={linkClass}>ControlGate</NavLink>
          <NavLink to="/ncsb" className={linkClass}>NCSB</NavLink>
          <a
            href="https://github.com/sadayamuthu"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </nav>
  )
}
