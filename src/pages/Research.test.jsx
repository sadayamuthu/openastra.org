import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Research from './Research'
import { citedFrameworks, doiUrl } from '../data/frameworks'

const renderResearch = () => render(<MemoryRouter><Research /></MemoryRouter>)

describe('Research page', () => {
  it('lists every Zenodo citation with its doi.org link', () => {
    renderResearch()
    expect(screen.getByRole('heading', { name: /Zenodo citations/ })).toBeInTheDocument()
    const hrefs = screen.getAllByRole('link', { name: /^https:\/\/doi\.org\// }).map((a) => a.getAttribute('href'))
    expect(hrefs.sort()).toEqual(citedFrameworks().map((f) => doiUrl(f.zenodo.doi)).sort())
    expect(hrefs).toHaveLength(8)
  })

  it('keeps White papers and Patents as Coming soon', () => {
    renderResearch()
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
  })

  it('never calls the Zenodo records papers', () => {
    const { container } = renderResearch()
    const text = container.textContent.replace(/white papers/gi, '')
    expect(text).not.toMatch(/paper/i)
  })
})

describe('Research copy accuracy', () => {
  it('does not claim every framework has a DOI', () => {
    const { container } = render(<MemoryRouter><Research /></MemoryRouter>)
    expect(container.textContent).not.toMatch(/every framework/i)
  })
})

describe('Research agenda', () => {
  it('lists ten areas, four of them open', () => {
    renderResearch()
    const region = within(screen.getByRole('region', { name: 'Research agenda' }))
    expect(region.getAllByRole('listitem')).toHaveLength(10)
    expect(region.getAllByText('Open area')).toHaveLength(4)
  })

  it('links shipped projects and lab projects that have a page, and nothing else', () => {
    renderResearch()
    const region = within(screen.getByRole('region', { name: 'Research agenda' }))
    expect(region.getByRole('link', { name: 'MergeLock' })).toHaveAttribute('href', '/mergelock')
    expect(region.getByRole('link', { name: 'OpenGPL' })).toHaveAttribute('href', '/opengpl')
    expect(region.getByRole('link', { name: /CyberLake/ })).toHaveAttribute('href', '/cyberlake')
    expect(region.getByText(/AgentID/)).toBeInTheDocument()
    expect(region.queryByRole('link', { name: /AgentID/ })).toBeNull()
  })

  it('links areas I to VI to their category, and V (lab only) to its lab group', () => {
    renderResearch()
    const region = within(screen.getByRole('region', { name: 'Research agenda' }))
    expect(region.getByRole('link', { name: 'Agentic AI Security' })).toHaveAttribute('href', '/frameworks?category=agentic')
    expect(region.getByRole('link', { name: 'AI Governance & Compliance' })).toHaveAttribute('href', '/frameworks?category=governance')
    expect(region.getByRole('link', { name: 'AI Identity & Access' })).toHaveAttribute('href', '/lab?group=identity')
    expect(region.queryByRole('link', { name: 'AI Runtime Security' })).toBeNull()
  })

  it('is reachable from the section links', () => {
    renderResearch()
    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute('href', '#agenda')
  })

  it('says all eight frameworks are archived', () => {
    const { container } = renderResearch()
    expect(container.textContent).toMatch(/All eight frameworks are archived/)
  })
})
