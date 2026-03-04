import { render, screen } from '@testing-library/react'
import OpenGPL from './OpenGPL'

describe('OpenGPL page', () => {
  it('renders the product name', () => {
    render(<OpenGPL />)
    expect(screen.getByRole('heading', { name: /opengpl/i })).toBeInTheDocument()
  })

  it('renders the how it works section', () => {
    render(<OpenGPL />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })

  it('renders a policy snippet', () => {
    render(<OpenGPL />)
    expect(screen.getByText(/policy\.gpl/i)).toBeInTheDocument()
  })

  it('renders GitHub CTA link', () => {
    render(<OpenGPL />)
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/opengpl')
  })
})
