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

  it('renders OCBC GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /ocbc/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/ocbc')
  })

  it('renders OpenGPL footer link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /opengpl/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/opengpl')
  })

  it('renders anySQL footer link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /anysql/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/anySQL')
  })

  it('renders ExposureGate footer link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /exposuregate/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/exposuregate')
  })

  it('renders OEBC footer link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /oebc/i })
    expect(link).toHaveAttribute('href', 'https://github.com/sadayamuthu/oebc')
  })
})
