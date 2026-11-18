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
    const cal = screen.getAllByRole('link', { name: /Add to calendar/ })[0]
    expect(cal).toHaveAttribute('download', 'controls-as-code.ics')
    expect(cal.getAttribute('href')).toMatch(/^data:text\/calendar/)
    expect(screen.getAllByRole('link', { name: /Register on Luma/ })[0]).toHaveAttribute('href', 'https://lu.ma/oa-controls')
  })

  it('puts register and calendar before the video on small screens', () => {
    const { container } = renderAt('controls-as-code')
    const h1 = screen.getByRole('heading', { level: 1 })
    const mobile = container.querySelector('.lg\\:hidden')
    expect(mobile).toBeTruthy()
    expect(mobile.textContent).toContain('Sat 16 Jan 2027')
    expect(mobile.textContent).toContain('60 min')
    expect(mobile.querySelector('a[href="https://lu.ma/oa-controls"]')).toBeTruthy()
    expect(mobile.querySelector('a[download]')).toBeTruthy()
    const after = (a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
    expect(after(h1, mobile)).toBeTruthy()
    expect(after(mobile, screen.getByTestId('countdown'))).toBeTruthy()
  })

  it('past talk has no mobile register block', () => {
    const { container } = renderAt('introducing-openastra')
    expect(container.querySelector('.lg\\:hidden')).toBeNull()
  })

  it('live talk embeds the stream', () => {
    const { container } = renderAt('merge-conflicts')
    expect(container.querySelector('iframe')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/abc123DEF45')
    expect(screen.getByText(/LIVE/)).toBeInTheDocument()
    expect(screen.getByText('●')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getAllByRole('link', { name: /Register on Luma/ })[0]).toHaveAttribute('href', 'https://lu.ma/oa-merge')
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
