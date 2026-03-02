import { render, screen } from '@testing-library/react'
import ControlGate from './ControlGate'

describe('ControlGate page', () => {
  it('renders the product name', () => {
    render(<ControlGate />)
    expect(screen.getByRole('heading', { name: /controlgate/i })).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<ControlGate />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })

  it('renders the install snippet', () => {
    render(<ControlGate />)
    expect(screen.getByText(/pip install controlgate/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<ControlGate />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/controlgate')
  })
})
