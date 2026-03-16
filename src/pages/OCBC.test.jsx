import { render, screen } from '@testing-library/react'
import OCBC from './OCBC'

describe('OCBC page', () => {
  it('renders the product name', () => {
    render(<OCBC />)
    expect(screen.getByRole('heading', { name: /ocbc/i })).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<OCBC />)
    expect(screen.getByText(/zero configuration/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<OCBC />)
    expect(screen.getByText(/ocbc-generate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<OCBC />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/ocbc')
  })
})
