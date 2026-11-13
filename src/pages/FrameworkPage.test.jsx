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

describe('FrameworkPage packages', () => {
  it('lists package links under Install from', () => {
    render(<MemoryRouter><FrameworkPage slug="anysql" /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Install from' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /PyPI/ })).toHaveAttribute('href', 'https://pypi.org/project/anysql-sdk/')
  })

  it('omits the section when a framework has no packages', () => {
    render(<MemoryRouter><FrameworkPage slug="cyberlake" /></MemoryRouter>)
    expect(screen.queryByRole('heading', { name: 'Install from' })).toBeNull()
  })
})

describe('FrameworkPage headings', () => {
  it('marks At a glance as a heading', () => {
    render(<MemoryRouter><FrameworkPage slug="mergelock" /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'At a glance' })).toBeInTheDocument()
  })
})

describe('FrameworkPage coming soon', () => {
  it('shows a coming-soon notice instead of a quick start', () => {
    render(<MemoryRouter><FrameworkPage slug="exposuregate" /></MemoryRouter>)
    expect(screen.queryByRole('heading', { name: 'Quick start' })).toBeNull()
    expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0)
  })
})

describe('FrameworkPage for lab projects', () => {
  it('labels CyberLake as In the lab, without a number', () => {
    render(<MemoryRouter><FrameworkPage slug="cyberlake" /></MemoryRouter>)
    expect(screen.getByText(/In the lab · Agentic/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'In the lab' })).toHaveAttribute('href', '/lab')
  })
})
