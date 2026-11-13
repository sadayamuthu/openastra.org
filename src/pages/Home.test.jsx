import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { shippedFrameworks } from '../data/frameworks'

const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>)

describe('Home page', () => {
  it('leads with the research-lab headline', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Security research for the age of autonomous agents/)
  })

  it('indexes the 8 shipped frameworks, each linking to its page', () => {
    renderHome()
    const index = screen.getByRole('region', { name: 'The index' })
    shippedFrameworks().forEach((f) => {
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
    const latest = within(screen.getByRole('region', { name: 'Latest on Zenodo' }))
    expect(latest.getAllByText('Coming soon')).toHaveLength(2)
    expect(latest.getByText('White papers')).toBeInTheDocument()
  })

  it('maps frameworks onto the pipeline', () => {
    renderHome()
    const pipeline = screen.getByRole('region', { name: 'Where each framework fits' })
    ;['Write', 'Review', 'Merge', 'Run', 'Foundation'].forEach((s) => expect(within(pipeline).getByText(s)).toBeInTheDocument())
  })
})

describe('Home — In the lab', () => {
  it('shows the lab with the OpenQ suite and all 9 projects', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    const lab = within(screen.getByRole('region', { name: 'In the lab' }))
    expect(lab.getByText('OpenQ: the quantum-safe suite')).toBeInTheDocument()
    ;['OpenQR', 'OpenQS', 'OpenQO', 'AgentID', 'OpenQA', 'CyberLake', 'ExposureGate', 'OpenCIQ', 'OpenEQ'].forEach((n) =>
      expect(lab.getByText(n)).toBeInTheDocument()
    )
    expect(lab.getByRole('link', { name: /All 9/ })).toHaveAttribute('href', '/lab')
  })

  it('does not link domains that have no site yet', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.queryByRole('link', { name: /openqs\.org/ })).toBeNull()
    expect(screen.getByText('openqs.org')).toBeInTheDocument()
  })

  it('counts shipped and lab projects in the hero', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('8 open frameworks')).toBeInTheDocument()
    expect(screen.getByText('9 in the lab')).toBeInTheDocument()
  })
})
