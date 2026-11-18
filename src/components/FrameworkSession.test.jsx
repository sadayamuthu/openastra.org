import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FrameworkPage from '../pages/FrameworkPage'

const renderSlug = (slug) => render(<MemoryRouter><FrameworkPage slug={slug} /></MemoryRouter>)

describe('FrameworkSession banner', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-20T00:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('links MergeLock to its premiere', () => {
    renderSlug('mergelock')
    expect(screen.getByText(/Premieres/)).toBeInTheDocument()
    expect(screen.getByText('WEBCAST')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/mergelock')
  })

  it.each(['controlgate', 'ocbc'])('links %s to the paired session', (slug) => {
    renderSlug(slug)
    expect(screen.getByRole('link', { name: /Details|Watch/ })).toHaveAttribute('href', '/events/ocbc-controlgate')
  })
})
