import { Link } from 'react-router-dom'
import { frameworksByCategory } from '../data/frameworks'
import { DoiTag } from './ui'
import { splitIndex } from '../lib/indexColumns'

function Row({ fw }) {
  return (
    <li>
      <Link
        to={`/${fw.slug}`}
        className="group flex items-baseline gap-3 py-2 border-b border-rule hover:border-rust transition-colors"
      >
        <span className="font-mono text-xs text-ink-muted w-6 shrink-0">{String(fw.number).padStart(2, '0')}</span>
        <span className="font-medium group-hover:text-rust transition-colors shrink-0">{fw.name}</span>
        <span className="text-sm text-ink-muted truncate flex-1 hidden sm:block">{fw.summary}</span>
        {fw.zenodo && <DoiTag />}
      </Link>
    </li>
  )
}

function Category({ group }) {
  return (
    <div>
      <h3 className="font-serif italic text-xl mt-6 mb-1">
        {group.category.numeral}. {group.category.name}
      </h3>
      <ul>
        {group.frameworks.map((fw) => <Row key={fw.slug} fw={fw} />)}
      </ul>
    </div>
  )
}

const ASIDE = 5 // the featured citation's height, in rows

export default function FrameworkIndex({ aside }) {
  const groups = frameworksByCategory()
  const k = splitIndex(groups, aside ? ASIDE : 0)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
      <div>
        {groups.slice(0, k).map((g) => <Category key={g.category.id} group={g} />)}
      </div>
      <div>
        {groups.slice(k).map((g) => <Category key={g.category.id} group={g} />)}
        {aside && <div className="mt-8">{aside}</div>}
      </div>
    </div>
  )
}
