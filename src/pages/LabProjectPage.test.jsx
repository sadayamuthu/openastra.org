import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LabProjectPage from './LabProjectPage'
import { OPEN_AREA_PROJECTS } from '../data/frameworks'

const renderSlug = (slug) => render(<MemoryRouter><LabProjectPage slug={slug} /></MemoryRouter>)

describe('LabProjectPage', () => {
  it.each(OPEN_AREA_PROJECTS.map((p) => [p.name.toLowerCase(), p.name]))('renders %s', (slug, name) => {
    renderSlug(slug)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(name)
    expect(document.title).toBe(`${name} · In the lab · OpenAstra`)
  })

  it('says the project is in the lab, with its area', () => {
    renderSlug('agentlock')
    const crumbs = within(screen.getByRole('navigation', { name: 'Breadcrumb' }))
    expect(crumbs.getByRole('link', { name: 'In the lab' })).toHaveAttribute('href', '/lab')
    expect(screen.getByText('In the lab · VIII. Runtime Security')).toBeInTheDocument()
    expect(screen.getByText('Tool calls limited to what the user asked for')).toBeInTheDocument()
    expect(screen.getByText(/design stage/i)).toBeInTheDocument()
  })

  it('links only GitHub, the thesis and governance', () => {
    renderSlug('agentlock')
    const links = within(screen.getByRole('list', { name: 'Project links' })).getAllByRole('link')
    expect(links.map((a) => [a.textContent.replace(/\s*↗$/, ''), a.getAttribute('href')])).toEqual([
      ['GitHub', 'https://github.com/sadayamuthu/agentlock'],
      ['Thesis', 'https://github.com/sadayamuthu/agentlock/blob/main/THESIS.md'],
      ['Governance', 'https://github.com/sadayamuthu/agentlock/blob/main/GOVERNANCE.md'],
    ])
    expect(screen.queryByRole('link', { name: /Roadmap|Contributing|Maintainers|Citation|License/ })).toBeNull()
  })

  it('lists the other lab projects in the same area', () => {
    renderSlug('agentlock')
    const related = within(screen.getByRole('region', { name: /Also in the lab/ }))
    expect(related.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/lab/agenttaint', '/lab/agentbox'])
  })

  it('shows Not found for an unknown project', () => {
    renderSlug('nope')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Not found')
  })
})
