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

  it('shows the five categories with shipped work', () => {
    renderHome()
    ;['Agentic', 'Security Controls', 'Security Catalog', 'Observability', 'VI. Governance & Compliance'].forEach((c) =>
      expect(screen.getAllByText(new RegExp(c)).length).toBeGreaterThan(0)
    )
  })

  it('keeps citations out of the index; they live under Latest on Zenodo', () => {
    renderHome()
    const index = within(screen.getByRole('region', { name: 'The index' }))
    expect(index.queryByText(/Cite this/)).toBeNull()
    expect(index.queryByText(/doi\.org/)).toBeNull()
    expect(screen.getByRole('region', { name: 'Latest on Zenodo' })).toBeInTheDocument()
  })

  it('shows White papers as Coming soon and no Patents', () => {
    renderHome()
    const latest = within(screen.getByRole('region', { name: 'Latest on Zenodo' }))
    expect(latest.getAllByText('Coming soon')).toHaveLength(1)
    expect(latest.getByText('White papers')).toBeInTheDocument()
    expect(screen.queryByText(/Patents/)).not.toBeInTheDocument()
  })

  it('maps frameworks onto the pipeline', () => {
    renderHome()
    const pipeline = screen.getByRole('region', { name: 'Where each framework fits' })
    ;['Write', 'Review', 'Merge', 'Run', 'Foundation'].forEach((s) => expect(within(pipeline).getByText(s)).toBeInTheDocument())
  })
})

describe('Home — In the lab', () => {
  it('shows the 11 lab projects and hides the paused OpenQ suite', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    const lab = within(screen.getByRole('region', { name: 'In the lab' }))
    expect(lab.queryByText('OpenQ: the quantum-safe suite')).toBeNull()
    ;['ThreatDiff', 'Taintline', 'HubScan', 'Fuse'].forEach((n) =>
      expect(lab.getByText(n)).toBeInTheDocument()
    )
    expect(lab.queryByText('CyberLake')).toBeNull()
    expect(lab.getByRole('link', { name: /All 11/ })).toHaveAttribute('href', '/lab')
  })

  it('counts shipped and lab projects in the hero', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('12 open frameworks')).toBeInTheDocument()
    expect(screen.getByText('11 in the lab')).toBeInTheDocument()
  })
})

describe('Home hero mark', () => {
  it('shows the large drawn-in OpenAstra mark beside the headline', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    const mark = screen.getByTestId('hero-mark')
    expect(mark.querySelector('svg.oa-mark--intro')).toHaveAttribute('width', '280')
  })
})
