import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/OpenAstra/i)).toBeInTheDocument()
  })

  it('renders ControlGate GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /controlgate/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/controlgate')
  })

  it('renders NCSB GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /ncsb/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/nist-cloud-security-baseline')
  })

  it('renders OpenGPL footer link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /opengpl/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/opengpl')
  })
})
