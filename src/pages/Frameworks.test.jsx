import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Frameworks from './Frameworks'
import { frameworksByCategory, shippedFrameworks } from '../data/frameworks'

const renderAt = (path = '/frameworks') => render(<MemoryRouter initialEntries={[path]}><Frameworks /></MemoryRouter>)
const names = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('Frameworks page', () => {
  it('lists the 12 shipped frameworks, grouped by category', () => {
    renderAt()
    expect(names()).toEqual(frameworksByCategory().flatMap((g) => g.frameworks.map((f) => f.name)))
    expect(names()).toHaveLength(shippedFrameworks().length)
  })

  it('filters by category chip', () => {
    renderAt()
    fireEvent.click(screen.getByRole('button', { name: 'Security Catalog' }))
    expect(names()).toEqual(['OCBC', 'OEBC'])
  })

  it('honours ?category= in the URL', () => {
    renderAt('/frameworks?category=observability')
    expect(names()).toEqual(['anySQL'])
  })

  it('treats an unknown category as All', () => {
    renderAt('/frameworks?category=bogus')
    expect(names()).toHaveLength(12)
  })

  it('offers Identity and Governance chips', () => {
    renderAt()
    fireEvent.click(screen.getByRole('button', { name: 'Identity & Access' }))
    expect(names()).toEqual(['OpenAPL'])
    fireEvent.click(screen.getByRole('button', { name: 'Governance & Compliance' }))
    expect(names()).toEqual(['OpenGPL'])
  })

  it('honours ?category=identity now that OpenAPL ships there', () => {
    renderAt('/frameworks?category=identity')
    expect(names()).toEqual(['OpenAPL'])
  })

  it('tags only DOI-bearing frameworks with DOI', () => {
    renderAt()
    expect(screen.getAllByText('DOI')).toHaveLength(10)
  })

  it('keeps the total count when filtered and says how many are shown', () => {
    renderAt('/frameworks?category=agentic')
    expect(screen.getByText(/12 open frameworks/)).toBeInTheDocument()
    expect(screen.getByText(/3 shown/)).toBeInTheDocument()
  })
})

describe('Frameworks page lab pointer', () => {
  it('points to the lab', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /11 more in the lab/ })).toHaveAttribute('href', '/lab')
  })
})

describe('Frameworks page lifecycle', () => {
  it('shows where each framework fits, linking each one', () => {
    renderAt()
    const fits = within(screen.getByRole('region', { name: 'Where each framework fits' }))
    expect(fits.getByText('Guardrails at every stage of the agent lifecycle.')).toBeInTheDocument()
    ;['Write', 'Review', 'Merge', 'Run', 'Foundation'].forEach((s) => expect(fits.getByText(s)).toBeInTheDocument())
    expect(fits.getByRole('link', { name: 'switchyard' })).toHaveAttribute('href', '/switchyard')
    expect(fits.getByRole('link', { name: 'OCBC' })).toHaveAttribute('href', '/ocbc')
  })
})
