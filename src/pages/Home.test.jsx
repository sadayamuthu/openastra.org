import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home page', () => {
  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

  it('renders the hero headline', () => {
    renderHome()
    expect(screen.getByText(/The North Star for Autonomous Systems/i)).toBeInTheDocument()
  })

  it('renders ControlGate and OCBC product cards', () => {
    renderHome()
    expect(screen.getByText('ControlGate')).toBeInTheDocument()
    expect(screen.getByText('OCBC')).toBeInTheDocument()
  })

  it('renders CTA buttons linking to product pages', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore controlgate/i })).toHaveAttribute('href', '/controlgate')
    expect(screen.getByRole('link', { name: /explore ocbc/i })).toHaveAttribute('href', '/ocbc')
    expect(screen.getByRole('link', { name: /explore opengpl/i })).toHaveAttribute('href', '/opengpl')
  })

  it('renders OpenGPL product card', () => {
    renderHome()
    expect(screen.getByText('OpenGPL')).toBeInTheDocument()
  })

  it('renders Explore OpenGPL hero button', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore opengpl/i })).toBeInTheDocument()
  })

  it('renders anySQL product card', () => {
    renderHome()
    expect(screen.getByText('anySQL')).toBeInTheDocument()
  })

  it('renders Explore anySQL hero button', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore anysql/i })).toHaveAttribute('href', '/anysql')
  })

  it('renders ExposureGate product card', () => {
    renderHome()
    expect(screen.getByText('ExposureGate')).toBeInTheDocument()
  })

  it('renders Explore ExposureGate hero button', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore exposuregate/i })).toHaveAttribute('href', '/exposuregate')
  })

  it('renders OEBC product card', () => {
    renderHome()
    expect(screen.getByText('OEBC')).toBeInTheDocument()
  })

  it('renders Explore OEBC hero button', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /explore oebc/i })).toHaveAttribute('href', '/oebc')
  })

  it('renders OpenGPL with Governance Policy Language tagline', () => {
    renderHome()
    expect(screen.getByText(/governance policy language/i)).toBeInTheDocument()
  })
})
