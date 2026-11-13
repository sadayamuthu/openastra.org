import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'

describe('Footer', () => {
  const renderFooter = () => render(<MemoryRouter><Footer /></MemoryRouter>)

  it('describes the lab', () => {
    renderFooter()
    expect(screen.getByText(/Independent research/)).toBeInTheDocument()
    expect(screen.getByText(/Open source/)).toBeInTheDocument()
  })

  it('repeats the section links', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: 'Frameworks' })).toHaveAttribute('href', '/frameworks')
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/research')
    expect(screen.getByRole('link', { name: 'Patents' })).toHaveAttribute('href', '/patents')
  })
})
