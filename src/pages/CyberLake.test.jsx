import { render, screen } from '@testing-library/react'
import CyberLake from './CyberLake'

describe('CyberLake page', () => {
  it('renders the product name', () => {
    render(<CyberLake />)
    expect(screen.getByRole('heading', { name: /cyberlake/i })).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<CyberLake />)
    expect(screen.getByText(/the trust layer for autonomous agents/i)).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<CyberLake />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<CyberLake />)
    expect(screen.getByText(/pip install cyberlake/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<CyberLake />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/cyberlake')
  })

  it('renders Website CTA link', () => {
    render(<CyberLake />)
    const link = screen.getByRole('link', { name: /website/i })
    expect(link).toHaveAttribute('href', 'https://cyberlake.org')
  })
})
