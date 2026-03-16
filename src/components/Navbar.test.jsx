import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {
  const renderNavbar = () =>
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

  it('renders the OpenAstra logo', () => {
    renderNavbar()
    expect(screen.getByText('OpenAstra')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /controlgate/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ocbc/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })

  it('renders OpenGPL nav link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /opengpl/i })).toBeInTheDocument()
  })

  it('renders anySQL nav link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /anysql/i })).toBeInTheDocument()
  })

  it('renders ExposureGate nav link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /exposuregate/i })).toBeInTheDocument()
  })

  it('renders OEBC nav link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /oebc/i })).toBeInTheDocument()
  })
})
