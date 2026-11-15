import { Link } from 'react-router-dom'
import { Button, Eyebrow, Pill } from '../components/ui'
import { GITHUB, frameworksByCategory } from '../data/frameworks'
import { AUTHORS, authorPath } from '../data/authors'

function PersonCard({ person }) {
  return (
    <li>
      <Link
        to={authorPath(person)}
        className="group h-full border border-rule rounded-sm p-5 flex flex-col gap-3 hover:border-ink transition-colors"
      >
        <p className="text-xs text-rust font-medium">{person.role}</p>
        <h3 className="font-serif text-xl group-hover:text-rust">{person.name}</h3>
        {person.placeholder ? (
          <p className="border border-dashed border-ink/30 rounded-sm px-3 py-3 text-center text-sm text-ink-muted">
            Profile coming soon
          </p>
        ) : (
          <>
            <p className="text-sm text-ink-muted">{person.title}</p>
            <div className="flex flex-wrap gap-1.5">
              {person.expertise.slice(0, 4).map((e) => <Pill key={e}>{e}</Pill>)}
            </div>
          </>
        )}
        <span className="mt-auto text-sm text-ink-muted group-hover:text-ink">View profile →</span>
      </Link>
    </li>
  )
}

export default function About() {
  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Eyebrow>About</Eyebrow>
          <h1 className="font-serif text-5xl mt-3">About OpenAstra</h1>
          <p className="font-serif text-2xl leading-snug mt-6">
            OpenAstra is an independent research lab focused on the security of autonomous systems.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            We build open source frameworks that make AI agents and the code they write
            verifiable, and that make NIST compliance traceable, automated, and accessible to
            every engineering team, from solo developers to enterprise cloud teams. Most
            frameworks ship with a citable Zenodo release.
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

      <section id="authors" aria-labelledby="authors-heading" className="mt-20">
        <Eyebrow>People</Eyebrow>
        <h2 id="authors-heading" className="font-serif text-4xl mt-3 mb-8">Authors &amp; contributors</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUTHORS.map((p) => <PersonCard key={p.name} person={p} />)}
        </ul>
      </section>
    </div>
  )
}
