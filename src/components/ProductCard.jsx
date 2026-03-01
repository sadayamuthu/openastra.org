import { Link } from 'react-router-dom'

export default function ProductCard({ icon, name, tagline, description, href }) {
  return (
    <div className="bg-surface border border-subtle rounded-2xl p-8 flex flex-col gap-4 hover:border-accent-blue transition-colors duration-300">
      <div className="text-4xl">{icon}</div>
      <div>
        <h3 className="text-text-primary font-semibold text-xl">{name}</h3>
        <p className="text-accent-cyan text-sm mt-1">{tagline}</p>
      </div>
      <p className="text-text-muted text-sm leading-relaxed flex-1">{description}</p>
      <Link
        to={href}
        className="text-accent-blue text-sm font-medium hover:text-accent-cyan transition-colors duration-200"
      >
        Learn more →
      </Link>
    </div>
  )
}
