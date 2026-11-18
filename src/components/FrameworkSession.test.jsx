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

  it('links MergeLock to its recorded session', () => {
    renderSlug('mergelock')
    expect(screen.getByText('Framework of the week · New video Wed 9 Dec')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/mergelock')
  })

  it.each(['controlgate', 'ocbc'])('links %s to the paired session', (slug) => {
    renderSlug(slug)
    expect(screen.getByRole('link', { name: /Details|Watch/ })).toHaveAttribute('href', '/events/ocbc-controlgate')
  })
})
