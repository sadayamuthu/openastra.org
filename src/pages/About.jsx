import { Link } from 'react-router-dom'
import { Button, Eyebrow } from '../components/ui'
import { GITHUB, frameworksByCategory } from '../data/frameworks'

export default function About() {
  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <Eyebrow>About</Eyebrow>
        <h1 className="font-serif text-5xl mt-3">About OpenAstra</h1>
        <p className="font-serif text-2xl leading-snug mt-6">
          OpenAstra is an independent research lab focused on the security of autonomous systems.
        </p>
        <p className="text-ink-muted mt-4 leading-relaxed">
          We build open source frameworks that make AI agents and the code they write
          verifiable, and that make NIST compliance traceable, automated, and accessible to
          every engineering team, from solo developers to enterprise cloud teams. Every
          framework ships with a citable Zenodo release.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Button href={GITHUB} variant="solid">GitHub</Button>
          <Button to="/research">Citations</Button>
        </div>
      </div>
      <aside>
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted mb-2">Focus areas</p>
        <ul>
          {frameworksByCategory().map(({ category, frameworks }) => (
            <li key={category.id} className="border-b border-rule">
              <Link to={`/frameworks?category=${category.id}`} className="flex justify-between py-3 hover:text-rust">
                <span className="font-serif italic text-lg">{category.numeral}. {category.name}</span>
                <span className="font-mono text-xs text-ink-muted self-center">{frameworks.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
