import { Link } from 'react-router-dom'
import { DOC_KINDS } from '../data/frameworks'

const chip =
  'inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-ink/30 text-sm hover:border-rust hover:text-rust transition-colors'

function External({ href, className, label, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} aria-label={label}>
      {children}
    </a>
  )
}

// Buttons for one repo's code, docs and license, for a framework page.
export function DocLinks({ repo }) {
  const items = [
    { label: 'Code', url: repo.code },
    ...repo.docs.map((d) => ({ label: d.label, url: d.url })),
    { label: `License · ${repo.license.label}`, url: repo.license.url },
  ]
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Project docs">
      {items.map((i) => (
        <li key={i.label}>
          <External href={i.url} className={chip}>
            {i.label} <span aria-hidden="true">↗</span>
          </External>
        </li>
      ))}
    </ul>
  )
}

const COLUMNS = [{ id: 'code', label: 'Code' }, ...DOC_KINDS, { id: 'license', label: 'License' }]

function cellFor(row, col) {
  if (!row.code) return null
  if (col.id === 'code') return { url: row.code, text: '↗' }
  if (col.id === 'license') return { url: row.license.url, text: `${row.license.label} ↗` }
  const doc = row.docs.find((d) => d.id === col.id)
  return doc ? { url: doc.url, text: '↗' } : null
}

function Name({ row }) {
  const label = (
    <>
      {row.name}
      {row.lab && <span className="text-ink-muted text-xs"> (lab)</span>}
    </>
  )
  return row.to ? <Link to={row.to} className="font-medium hover:text-rust">{label}</Link> : <span className="font-medium">{label}</span>
}

const Dash = () => <span className="text-ink-muted" aria-label="Not yet">–</span>

function Row({ row }) {
  return (
    <tr className="border-b border-rule">
      <th scope="row" className="py-2 pr-4 pl-4 text-left font-normal"><Name row={row} /></th>
      {COLUMNS.map((c) => {
        const cell = cellFor(row, c)
        return (
          <td key={c.id} className="py-2 px-2">
            {cell ? (
              <External href={cell.url} className="text-rust hover:text-ink" label={`${row.name} ${c.label}`}>{cell.text}</External>
            ) : (
              <Dash />
            )}
          </td>
        )
      })}
    </tr>
  )
}

const groupTitle = (c) => `${c.numeral}. ${c.name}`

// Every project's repo docs, grouped by category: a table on wide screens, a card
// per project on phones.
export function OpenSourceTable({ groups }) {
  return (
    <>
      <div className="hidden md:block mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-[0.1em] uppercase text-ink-muted border-b border-ink">
              <th scope="col" className="py-2 pr-4 font-medium">Project</th>
              {COLUMNS.map((c) => <th key={c.id} scope="col" className="py-2 px-2 font-medium">{c.label}</th>)}
            </tr>
          </thead>
          {groups.map(({ category, rows }) => (
            <tbody key={category.id} aria-label={groupTitle(category)}>
              <tr>
                <th scope="colgroup" colSpan={COLUMNS.length + 1} className="pt-6 pb-1 text-left font-serif italic font-normal text-xl">
                  {groupTitle(category)}
                </th>
              </tr>
              {rows.map((row) => <Row key={row.name} row={row} />)}
            </tbody>
          ))}
        </table>
      </div>

      <div className="md:hidden mt-6" data-testid="open-source-cards">
        {groups.map(({ category, rows }) => (
          <div key={category.id}>
            <h4 className="font-serif italic text-xl mt-6 mb-1">{groupTitle(category)}</h4>
            <ul>
              {rows.map((row) => (
                <li key={row.name} className="py-4 border-b border-rule">
                  <p><Name row={row} /></p>
                  {row.code ? (
                    <p className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-sm">
                      {COLUMNS.map((c) => {
                        const cell = cellFor(row, c)
                        if (!cell) return null
                        const text = c.id === 'license' ? `License · ${row.license.label}` : c.label
                        return <External key={c.id} href={cell.url} className="text-rust hover:text-ink">{text} ↗</External>
                      })}
                    </p>
                  ) : (
                    <p className="mt-1"><Dash /></p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}
