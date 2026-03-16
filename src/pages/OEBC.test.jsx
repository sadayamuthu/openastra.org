import { render, screen } from '@testing-library/react'
import OEBC from './OEBC'

describe('OEBC page', () => {
  it('renders the product name', () => {
    render(<OEBC />)
    expect(screen.getByRole('heading', { name: /oebc/i })).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<OEBC />)
    expect(screen.getByText(/zero configuration/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<OEBC />)
    expect(screen.getByText(/oebc-generate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<OEBC />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/oebc')
  })
})
