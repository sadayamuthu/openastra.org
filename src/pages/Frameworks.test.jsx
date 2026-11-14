import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Frameworks from './Frameworks'
import { shippedFrameworks } from '../data/frameworks'

const renderAt = (path = '/frameworks') => render(<MemoryRouter initialEntries={[path]}><Frameworks /></MemoryRouter>)
const names = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('Frameworks page', () => {
  it('lists the 8 shipped frameworks', () => {
    renderAt()
    expect(names()).toEqual(shippedFrameworks().map((f) => f.name))
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
    expect(names()).toHaveLength(8)
  })

  it('offers a Governance chip but no chip for Identity, which has nothing shipped', () => {
    renderAt()
    expect(screen.queryByRole('button', { name: 'Identity & Access' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Governance & Compliance' }))
    expect(names()).toEqual(['OpenGPL'])
  })

  it('treats ?category=identity (no shipped work) as All', () => {
    renderAt('/frameworks?category=identity')
    expect(names()).toHaveLength(8)
  })

  it('tags only DOI-bearing frameworks with DOI', () => {
    renderAt()
    expect(screen.getAllByText('DOI')).toHaveLength(8)
  })

  it('keeps the total count when filtered and says how many are shown', () => {
    renderAt('/frameworks?category=agentic')
    expect(screen.getByText(/8 open frameworks/)).toBeInTheDocument()
    expect(screen.getByText(/3 shown/)).toBeInTheDocument()
  })
})

describe('Frameworks page lab pointer', () => {
  it('points to the lab', () => {
    renderAt()
    expect(screen.getByRole('link', { name: /9 more in the lab/ })).toHaveAttribute('href', '/lab')
  })
})
