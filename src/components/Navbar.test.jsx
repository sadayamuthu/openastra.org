import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const renderNavbar = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  )

describe('Navbar', () => {
  it('links the OpenAstra wordmark home', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'OpenAstra' })).toHaveAttribute('href', '/')
  })

  it('has the four section links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Frameworks' })).toHaveAttribute('href', '/frameworks')
    expect(screen.getByRole('link', { name: 'Lab' })).toHaveAttribute('href', '/lab')
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/research')
    expect(screen.getByRole('link', { name: 'Patents' })).toHaveAttribute('href', '/patents')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  })

  it('links GitHub externally', () => {
    renderNavbar()
    const gh = screen.getByRole('link', { name: /github/i })
    expect(gh).toHaveAttribute('href', 'https://github.com/sadayamuthu')
    expect(gh).toHaveAttribute('target', '_blank')
  })

  it('wraps links on narrow screens', () => {
    renderNavbar()
    expect(screen.getByRole('navigation').querySelector('.flex-wrap')).not.toBeNull()
  })

  it('marks the active section', () => {
    renderNavbar('/research')
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('aria-current', 'page')
  })
})
