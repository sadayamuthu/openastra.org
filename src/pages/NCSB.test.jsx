import { render, screen } from '@testing-library/react'
import NCSB from './NCSB'

describe('NCSB page', () => {
  it('renders the product name', () => {
    render(<NCSB />)
    expect(screen.getByRole('heading', { name: /ncsb/i })).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<NCSB />)
    expect(screen.getByText(/zero configuration/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<NCSB />)
    expect(screen.getByText(/ncsb-generate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<NCSB />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/nist-cloud-security-baseline')
  })
})
