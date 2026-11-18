import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EventPage from './EventPage'
import EventMedia from '../components/EventMedia'
import { FIXTURE_EVENTS, FIXTURE_NOW } from '../test/eventsFixture'

vi.mock('../data/events', async () => ({ events: (await import('../test/eventsFixture')).FIXTURE_EVENTS }))

const ev = (slug) => FIXTURE_EVENTS.find((e) => e.slug === slug)

function renderAt(slug) {
  return render(
    <MemoryRouter initialEntries={[`/events/${slug}`]}>
      <Routes>
        <Route path="/events/:slug" element={<EventPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(FIXTURE_NOW)
})
afterEach(() => vi.useRealTimers())

describe('EventPage', () => {
  it('upcoming talk shows countdown, register and calendar', () => {
    const { container } = renderAt('controls-as-code')
    expect(screen.getByTestId('countdown')).toBeInTheDocument()
    expect(container.querySelector('iframe')).toBeNull()
    const cal = screen.getByRole('link', { name: /Add to calendar/ })
    expect(cal).toHaveAttribute('download', 'controls-as-code.ics')
    expect(cal.getAttribute('href')).toMatch(/^data:text\/calendar/)
    expect(screen.getByRole('link', { name: /Register on Luma/ })).toHaveAttribute('href', 'https://lu.ma/oa-controls')
  })

  it('live talk embeds the stream', () => {
    const { container } = renderAt('merge-conflicts')
    expect(container.querySelector('iframe')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/abc123DEF45')
    expect(screen.getByText(/LIVE/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Register on Luma/ })).toHaveAttribute('href', 'https://lu.ma/oa-merge')
  })

  it('live talk without a stream shows a placeholder', () => {
    const { container } = render(
      <EventMedia event={{ ...ev('merge-conflicts'), streamUrl: 'https://vimeo.com/1' }} now={FIXTURE_NOW} />,
    )
    expect(screen.getByText('Stream link coming soon')).toBeInTheDocument()
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('past talk plays the recording and hides register', () => {
    const { container } = renderAt('introducing-openastra')
    expect(container.querySelector('iframe').getAttribute('src')).toContain('rec11111111')
    expect(screen.queryByRole('link', { name: /Register/ })).toBeNull()
    expect(screen.queryByRole('link', { name: /Add to calendar/ })).toBeNull()
  })

  it('past talk without video says recording coming soon', () => {
    renderAt('research-agenda')
    expect(screen.getByText('Recording coming soon')).toBeInTheDocument()
    expect(screen.queryByText(/Related framework/)).toBeNull()
  })

  it('links speakers and frameworks', () => {
    renderAt('merge-conflicts')
    expect(screen.getByRole('link', { name: 'Karthikeyan Sadayamuthu' })).toHaveAttribute('href', '/about/karthikeyan-sadayamuthu')
    expect(screen.getByRole('link', { name: 'MergeLock' })).toHaveAttribute('href', '/mergelock')
    expect(document.title).toBe(`${ev('merge-conflicts').title} · Events · OpenAstra`)
  })

  it('unknown slug renders Not found', () => {
    renderAt('nope')
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})
