import { render, screen } from '@testing-library/react'
import ExposureGate from './ExposureGate'

describe('ExposureGate page', () => {
  it('renders the product name', () => {
    render(<ExposureGate />)
    expect(screen.getByRole('heading', { name: /exposuregate/i })).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<ExposureGate />)
    expect(screen.getByText(/exposure gates scan the diff/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<ExposureGate />)
    expect(screen.getByText(/exposuregate scan/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<ExposureGate />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/exposuregate')
  })
})
