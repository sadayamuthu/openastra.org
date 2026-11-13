import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FrameworkPage from './FrameworkPage'
import { frameworks } from '../data/frameworks'

const renderSlug = (slug) => render(<MemoryRouter><FrameworkPage slug={slug} /></MemoryRouter>)

describe('FrameworkPage', () => {
  it.each(frameworks.map((f) => [f.slug, f.name]))('renders %s', (slug, name) => {
    renderSlug(slug)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(name)
    expect(document.title).toBe(`${name} · OpenAstra`)
  })

  it('shows Cite this and a doi.org link for MergeLock', () => {
    renderSlug('mergelock')
    expect(screen.getByRole('heading', { name: 'Cite this' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /doi\.org\/10\.5281\/zenodo\.23637443|DOI/ }).length).toBeGreaterThan(0)
  })

  it('omits citation and DOI for CyberLake', () => {
    renderSlug('cyberlake')
    expect(screen.queryByRole('heading', { name: 'Cite this' })).toBeNull()
    expect(screen.queryByRole('link', { name: /DOI|doi\.org/ })).toBeNull()
  })

  it('shows the category breadcrumb and related frameworks', () => {
    renderSlug('mergelock')
    expect(screen.getByRole('link', { name: 'Frameworks' })).toHaveAttribute('href', '/frameworks')
    expect(screen.getByRole('link', { name: /Unasked/ })).toHaveAttribute('href', '/unasked')
  })

  it('renders Not found for an unknown slug', () => {
    renderSlug('nope')
    expect(screen.getByText('Not found')).toBeInTheDocument()
  })
})
