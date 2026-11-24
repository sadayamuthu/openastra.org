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
    expect(hrefs).toHaveLength(10)
  })

  it('keeps White papers as Coming soon and does not mention patents', () => {
    const { container } = renderResearch()
    expect(screen.getAllByText('Coming soon')).toHaveLength(1)
    expect(container.textContent).not.toMatch(/patent/i)
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
  it('lists ten areas, none of them open', () => {
    const { container } = renderResearch()
    const region = within(screen.getByRole('region', { name: 'Research agenda' }))
    expect(region.getAllByRole('listitem')).toHaveLength(10)
    expect(region.queryAllByText('Open area')).toHaveLength(0)
    expect(container.textContent).toMatch(/Every area has projects today/)
  })

  it('links shipped projects and lab projects that have a page, and nothing else', () => {
    renderResearch()
    const region = within(screen.getByRole('region', { name: 'Research agenda' }))
    expect(region.getByRole('link', { name: 'MergeLock' })).toHaveAttribute('href', '/mergelock')
    expect(region.getByRole('link', { name: 'OpenGPL' })).toHaveAttribute('href', '/opengpl')
    expect(region.getByRole('link', { name: 'AgentTaint (lab)' })).toHaveAttribute('href', '/lab/agenttaint')
    expect(region.queryByText(/CyberLake|AgentID/)).toBeNull()
  })

  it('links each area to its category, or to the lab when nothing has shipped', () => {
    renderResearch()
    const region = within(screen.getByRole('region', { name: 'Research agenda' }))
    expect(region.getByRole('link', { name: 'Agentic AI Security' })).toHaveAttribute('href', '/frameworks?category=agentic')
    expect(region.getByRole('link', { name: 'AI Governance & Compliance' })).toHaveAttribute('href', '/frameworks?category=governance')
    expect(region.getByRole('link', { name: 'AI Identity & Access' })).toHaveAttribute('href', '/frameworks?category=identity')
    expect(region.getByRole('link', { name: 'AI Runtime Security' })).toHaveAttribute('href', '/frameworks?category=runtime')
    expect(region.getByRole('link', { name: 'AI Resilience & Recovery' })).toHaveAttribute('href', '/frameworks?category=resilience')
    expect(region.getByRole('link', { name: 'AI Threat Modeling & Risk Assessment' })).toHaveAttribute('href', '/lab?group=threat-modeling')
    expect(region.getByRole('link', { name: 'AI Data Security & Privacy' })).toHaveAttribute('href', '/lab?group=data-security')
  })

  it('is reachable from the section links', () => {
    renderResearch()
    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute('href', '#agenda')
  })

  it('says how many frameworks are archived', () => {
    const { container } = renderResearch()
    expect(container.textContent).toMatch(/10 of 12 frameworks are archived on Zenodo/)
  })
})

describe('Research open source section', () => {
  it('links every project\'s docs, lab repos included', () => {
    renderResearch()
    const region = within(screen.getByRole('region', { name: 'Open source' }))
    expect(region.getAllByRole('link', { name: 'switchyard Thesis' })[0])
      .toHaveAttribute('href', 'https://github.com/sadayamuthu/switchyard/blob/main/THESIS.md')
    expect(region.getAllByRole('link', { name: 'MergeLock License' })[0])
      .toHaveAttribute('href', 'https://github.com/sadayamuthu/mergelock/blob/main/LICENSE')
    expect(region.queryByText('Repo opens soon')).toBeNull()
    const agenttaint = region.getByRole('rowheader', { name: 'AgentTaint (lab)' }).closest('tr')
    expect(within(agenttaint).queryAllByText('–')).toHaveLength(0)
    expect(region.getAllByRole('link', { name: 'AgentTaint Thesis' })[0])
      .toHaveAttribute('href', 'https://github.com/sadayamuthu/agenttaint/blob/main/THESIS.md')
    expect(region.getAllByRole('link', { name: 'AgentTaint Code' })[0])
      .toHaveAttribute('href', 'https://github.com/sadayamuthu/agenttaint')
  })

  it('lists projects under their category, with no Area column', () => {
    renderResearch()
    const region = within(screen.getByRole('region', { name: 'Open source' }))
    const runtime = within(region.getByRole('rowgroup', { name: 'VIII. Runtime Security' }))
    expect(runtime.getAllByRole('rowheader').map((h) => h.textContent)).toEqual([
      'switchyard', 'AgentLock (lab)', 'AgentTaint (lab)', 'AgentBox (lab)',
    ])
    expect(region.queryByRole('columnheader', { name: 'Area' })).toBeNull()
  })

  it('is reachable from the section links', () => {
    renderResearch()
    expect(screen.getByRole('link', { name: 'Open source' })).toHaveAttribute('href', '#open-source')
  })
})
