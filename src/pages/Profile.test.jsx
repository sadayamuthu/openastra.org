import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Profile from './Profile'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/about/:slug" element={<Profile />} />
      </Routes>
    </MemoryRouter>
  )

describe('Profile page', () => {
  it('renders the full lead author profile', () => {
    renderAt('/about/karthikeyan-sadayamuthu')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Karthikeyan Sadayamuthu')
    expect(screen.getByText('Founder & Principal Author')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ORCID/ })).toHaveAttribute('href', 'https://orcid.org/0009-0008-3539-6048')
    expect(screen.getByText('Frameworks authored')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'MergeLock' })).toHaveAttribute('href', '/mergelock')
    expect(screen.getByText('Autodesk')).toBeInTheDocument()
  })

  it('renders a placeholder profile with LinkedIn', () => {
    renderAt('/about/vibha-nair')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vibha Nair')
    expect(screen.getByText('Profile coming soon')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/vibhanair/')
  })

  it('shows not found for an unknown person', () => {
    renderAt('/about/nobody')
    expect(screen.queryByText('Profile coming soon')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /nobody/i })).not.toBeInTheDocument()
  })
})
