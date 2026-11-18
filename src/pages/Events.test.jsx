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
    expect(screen.getByText('● LIVE NOW')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Watch live/ })).toHaveAttribute('href', '/events/merge-conflicts')
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
    const b = renderAt('/events?tab=live')
    expect(screen.queryByRole('region', { name: 'On demand' })).toBeNull()
    expect(hasLink('controls-as-code')).toBeInTheDocument()
    b.unmount()
    renderAt('/events?tab=bogus')
    expect(screen.getByRole('region', { name: 'On demand' })).toBeInTheDocument()
    expect(hasLink('controls-as-code')).toBeInTheDocument()
  })

  it('call for papers is shown as soon, not clickable', () => {
    renderAt()
    expect(screen.getByText('Call for papers · soon').closest('button')).toBeNull()
    expect(screen.queryByText(/conference/i)).toBeNull()
  })
})
