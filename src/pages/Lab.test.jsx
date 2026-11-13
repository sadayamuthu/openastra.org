import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Lab from './Lab'

const renderAt = (path = '/lab') => render(<MemoryRouter initialEntries={[path]}><Lab /></MemoryRouter>)
const names = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('Lab page', () => {
  it('lists all 9 projects, each marked Coming soon', () => {
    renderAt()
    expect(names()).toHaveLength(9)
    expect(screen.getAllByText('Coming soon').length).toBe(9)
  })

  it('presents the OpenQ suite in Know, Find, Fix order', () => {
    renderAt()
    const suite = within(screen.getByRole('region', { name: /OpenQ/ }))
    expect(suite.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['OpenQR', 'OpenQS', 'OpenQO'])
  })

  it('filters by group', () => {
    renderAt()
    fireEvent.click(screen.getByRole('button', { name: 'Observability' }))
    expect(names()).toEqual(['OpenCIQ', 'OpenEQ'])
  })

  it('treats an unknown group as All', () => {
    renderAt('/lab?group=bogus')
    expect(names()).toHaveLength(9)
  })

  it('links CyberLake to its page and shows domains as plain text', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /CyberLake/ })).toHaveAttribute('href', '/cyberlake')
    expect(screen.getByText('openid.ai')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /openid\.ai/ })).toBeNull()
  })
})
