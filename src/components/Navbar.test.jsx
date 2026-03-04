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
    expect(screen.getByRole('link', { name: /ncsb/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })

  it('renders OpenGPL nav link', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /opengpl/i })).toBeInTheDocument()
  })
})
