import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Frameworks from './Frameworks'
import { frameworks } from '../data/frameworks'

const renderAt = (path = '/frameworks') => render(<MemoryRouter initialEntries={[path]}><Frameworks /></MemoryRouter>)
const names = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('Frameworks page', () => {
  it('lists all 10 frameworks', () => {
    renderAt()
    expect(names()).toEqual(expect.arrayContaining(frameworks.map((f) => f.name)))
    expect(names()).toHaveLength(10)
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
    expect(names()).toHaveLength(10)
  })

  it('tags only DOI-bearing frameworks with DOI', () => {
    renderAt()
    expect(screen.getAllByText('DOI')).toHaveLength(8)
  })

  it('keeps the total count when filtered and says how many are shown', () => {
    renderAt('/frameworks?category=agentic')
    expect(screen.getByText(/10 open frameworks/)).toBeInTheDocument()
    expect(screen.getByText(/4 shown/)).toBeInTheDocument()
  })
})
