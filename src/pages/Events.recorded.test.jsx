import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Events from './Events'

vi.mock('../data/events', () => {
  const base = {
    kind: 'talk', format: 'online', delivery: 'recorded', speakers: [], frameworks: [],
    series: 'framework-of-the-week', summary: 's', registerUrl: 'https://lu.ma/x',
  }
  return {
    LUMA_CALENDAR_URL: null,
    events: [
      { ...base, slug: 'mergelock', week: 1, title: 'Merge one', subtitle: 'Sub one', start: '2026-12-09T16:00:00Z', videoUrl: 'https://youtu.be/vid11111111' },
      { ...base, slug: 'unasked', week: 2, title: 'Unasked two', start: '2026-12-16T16:00:00Z' },
      { ...base, slug: 'third', week: 3, title: 'Third', start: '2027-01-06T16:00:00Z' },
    ],
  }
})

const renderHub = () => render(<MemoryRouter><Events /></MemoryRouter>)
beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }))
afterEach(() => vi.useRealTimers())

describe('Events hub, recorded sessions', () => {
  it('features a just-released video with a Watch link and a WATCH row tag', () => {
    vi.setSystemTime(new Date('2026-12-15T00:00:00Z'))
    renderHub()
    expect(screen.getByText('Week 1 · New this week')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /▶ Watch/ })).toHaveAttribute('href', '/events/mergelock')
    expect(screen.queryByTestId('countdown')).toBeNull()
    const row = within(screen.getByRole('region', { name: /The series/ })).getByRole('link', { name: 'Merge one' }).closest('li')
    expect(within(row).getByText('WATCH')).toBeInTheDocument()
    expect(within(row).getByText('▶')).toHaveAttribute('aria-hidden', 'true')
  })

  it('tags a released row with no video as VIDEO COMING SOON', () => {
    vi.setSystemTime(new Date('2026-12-20T00:00:00Z'))
    renderHub()
    const row = within(screen.getByRole('region', { name: /The series/ })).getByRole('link', { name: 'Unasked two' }).closest('li')
    expect(within(row).getByText('VIDEO COMING SOON')).toBeInTheDocument()
    const od = screen.getByRole('region', { name: 'On demand' })
    expect(within(od).getByText('Video coming soon')).toBeInTheDocument()
  })

  it('released session without video gets a Video coming soon eyebrow and Details, not Watch', () => {
    vi.setSystemTime(new Date('2026-12-17T00:00:00Z'))
    renderHub()
    expect(screen.getByText('Week 2 · Video coming soon')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /▶ Watch/ })).toBeNull()
    expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/unasked')
  })

  it('features the next upcoming session with a reminder and Details', () => {
    vi.setSystemTime(new Date('2026-12-25T00:00:00Z'))
    renderHub()
    expect(screen.getByText('Week 3 · Coming Wed 6 Jan')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get a reminder on Luma' })).toHaveAttribute('href', 'https://lu.ma/x')
    expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/third')
  })
})
