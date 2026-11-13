import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { frameworks } from '../data/frameworks'

const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>)

describe('Home page', () => {
  it('leads with the research-lab headline', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Security research for the age of autonomous agents/)
  })

  it('indexes all 10 frameworks, each linking to its page', () => {
    renderHome()
    const index = screen.getByRole('region', { name: 'The index' })
    frameworks.forEach((f) => {
      expect(within(index).getByRole('link', { name: new RegExp(f.name) })).toHaveAttribute('href', `/${f.slug}`)
    })
  })

  it('shows the four categories', () => {
    renderHome()
    ;['Agentic', 'Security Controls', 'Security Catalog', 'Observability'].forEach((c) =>
      expect(screen.getAllByText(new RegExp(c)).length).toBeGreaterThan(0)
    )
  })

  it('features the MergeLock citation', () => {
    renderHome()
    expect(screen.getAllByRole('link', { name: 'https://doi.org/10.5281/zenodo.23637443' }).length).toBeGreaterThan(0)
  })

  it('shows White papers and Patents as Coming soon', () => {
    renderHome()
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
    expect(screen.getByText('White papers')).toBeInTheDocument()
  })

  it('maps frameworks onto the pipeline', () => {
    renderHome()
    const pipeline = screen.getByRole('region', { name: 'Where each framework fits' })
    ;['Write', 'Review', 'Merge', 'Run', 'Foundation'].forEach((s) => expect(within(pipeline).getByText(s)).toBeInTheDocument())
  })
})
