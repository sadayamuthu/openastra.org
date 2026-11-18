import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Events from './Events'
import { FIXTURE_NOW } from '../test/eventsFixture'

vi.mock('../data/events', async () => ({ events: (await import('../test/eventsFixture')).FIXTURE_EVENTS }))

function renderAt(url = '/events') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/events" element={<Events />} />
      </Routes>
    </MemoryRouter>,
  )
}
const hasLink = (slug) => screen.queryByRole('link', { name: (_, el) => el.getAttribute('href') === `/events/${slug}` })

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(FIXTURE_NOW)
})
afterEach(() => vi.useRealTimers())

describe('Events hub', () => {
  it('features the live talk', () => {
    renderAt()
    expect(screen.getByText('PREMIERING NOW', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('●')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('link', { name: /Watch & ask in chat/ })).toHaveAttribute('href', '/events/merge-conflicts')
  })

  it('features an upcoming (not live) talk with register, calendar, details and countdown', () => {
    vi.setSystemTime(new Date('2026-12-01T00:00:00Z'))
    renderAt()
    expect(screen.queryByText('PREMIERING NOW', { exact: false })).toBeNull()
    expect(screen.getByRole('link', { name: /Register on Luma/ })).toHaveAttribute('href', 'https://lu.ma/oa-merge')
    expect(screen.getByRole('link', { name: /Add to calendar/ })).toHaveAttribute('download', 'merge-conflicts.ics')
    expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/merge-conflicts')
    expect(screen.getByTestId('countdown')).toBeInTheDocument()
  })

  it('lists upcoming and on-demand talks', () => {
    renderAt()
    expect(hasLink('controls-as-code')).toBeInTheDocument()
    const region = screen.getByRole('region', { name: 'On demand' })
    const hrefs = within(region).getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs.indexOf('/events/introducing-openastra')).toBeGreaterThanOrEqual(0)
    expect(hrefs.indexOf('/events/introducing-openastra')).toBeLessThan(hrefs.indexOf('/events/research-agenda'))
    expect(within(region).getByText('Recording soon')).toBeInTheDocument()
  })

  it('filters by tab', () => {
    const a = renderAt('/events?tab=on-demand')
    expect(hasLink('controls-as-code')).toBeNull()
    expect(screen.getByRole('region', { name: 'On demand' })).toBeInTheDocument()
    a.unmount()
    const b = renderAt('/events?tab=upcoming')
    expect(screen.queryByRole('region', { name: 'On demand' })).toBeNull()
    expect(hasLink('controls-as-code')).toBeInTheDocument()
    b.unmount()
    renderAt('/events?tab=bogus')
    expect(screen.getByRole('region', { name: 'On demand' })).toBeInTheDocument()
    expect(hasLink('controls-as-code')).toBeInTheDocument()
  })

  it('has exactly the three tabs and no call for papers', () => {
    renderAt()
    const labels = within(screen.getByRole('group', { name: 'Filter events' })).getAllByRole('button').map((b) => b.textContent)
    expect(labels).toEqual(['All', 'Upcoming', 'On demand'])
    expect(screen.queryByText(/call for papers/i)).toBeNull()
    expect(screen.queryByText(/conference/i)).toBeNull()
  })

  it('hides the series on the on-demand tab and on-demand on the upcoming tab', () => {
    const a = renderAt('/events?tab=on-demand')
    expect(screen.queryByRole('region', { name: /The series/ })).toBeNull()
    a.unmount()
    renderAt('/events?tab=upcoming')
    expect(screen.queryByRole('region', { name: 'On demand' })).toBeNull()
  })
})
