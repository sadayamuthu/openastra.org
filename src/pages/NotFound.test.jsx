import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from './NotFound'

describe('NotFound', () => {
  it('says Not found and offers a way back', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>)
    expect(screen.getByText('Not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse frameworks' })).toHaveAttribute('href', '/frameworks')
  })

  it('sets the tab title', () => {
    document.title = 'Research · OpenAstra'
    render(<MemoryRouter><NotFound /></MemoryRouter>)
    expect(document.title).toBe('Not found · OpenAstra')
  })

  it('shows the pulse GIF with a static reduced-motion fallback', () => {
    const { container } = render(<MemoryRouter><NotFound /></MemoryRouter>)
    expect(container.querySelector('img').getAttribute('src')).toBe('/brand/openastra-pulse-256.gif')
    expect(container.querySelector('source[media="(prefers-reduced-motion: reduce)"]'))
      .toHaveAttribute('srcset', '/brand/openastra-mark-512.png')
  })
})
