import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

const props = {
  icon: '🛡️',
  name: 'ControlGate',
  tagline: 'NIST compliance gate',
  description: 'Scan code against NIST controls.',
  href: '/controlgate',
}

describe('ProductCard', () => {
  const renderCard = () =>
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    )

  it('renders product name', () => {
    renderCard()
    expect(screen.getByText('ControlGate')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    renderCard()
    expect(screen.getByText('NIST compliance gate')).toBeInTheDocument()
  })

  it('renders a Learn more link pointing to href', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /learn more/i })
    expect(link).toHaveAttribute('href', '/controlgate')
  })
})
