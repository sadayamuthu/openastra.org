import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home page', () => {
  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

  it('renders the hero headline', () => {
    renderHome()
    expect(screen.getByText(/The North Star for Autonomous Systems/i)).toBeInTheDocument()
  })

  it('renders all product cards', () => {
    renderHome()
    expect(screen.getByText('ControlGate')).toBeInTheDocument()
    expect(screen.getByText('NCSB')).toBeInTheDocument()
  })

  it('renders CTA buttons linking to product pages', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore controlgate/i })).toHaveAttribute('href', '/controlgate')
    expect(screen.getByRole('link', { name: /explore ncsb/i })).toHaveAttribute('href', '/ncsb')
    expect(screen.getByRole('link', { name: /explore opengpl/i })).toHaveAttribute('href', '/opengpl')
  })

  it('renders OpenGPL product card', () => {
    renderHome()
    expect(screen.getByText('OpenGPL')).toBeInTheDocument()
  })

  it('renders Explore OpenGPL hero button', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore opengpl/i })).toBeInTheDocument()
  })
})
