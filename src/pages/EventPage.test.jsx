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

  it('upcoming premiere explains where it plays', () => {
    renderAt('controls-as-code')
    expect(screen.getByText('The premiere plays here, with live chat on YouTube')).toBeInTheDocument()
  })

  it('live premiere links to the YouTube chat', () => {
    renderAt('merge-conflicts')
    expect(screen.getByRole('link', { name: /Watch & ask in chat on YouTube/ }))
      .toHaveAttribute('href', 'https://www.youtube.com/watch?v=abc123DEF45')
  })

  it('shows exactly one set of talk actions per breakpoint', () => {
    renderAt('controls-as-code')
    const [mobile, desktop] = screen.getAllByTestId('talk-actions')
    // small screens: the block under the title (its wrapper is lg:hidden); desktop: the aside copy
    expect(mobile.closest('.lg\\:hidden')).not.toBeNull()
    expect(mobile.className).not.toMatch(/(^|\s)hidden(\s|$)/)
    expect(desktop.className).toMatch(/(^|\s)hidden(\s|$)/)
    expect(desktop.className).toMatch(/lg:flex/)
    expect(desktop.closest('.lg\\:hidden')).toBeNull()
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
    expect(screen.getByText('PREMIERING NOW')).toBeInTheDocument()
    expect(screen.getByText('PREMIERE')).toBeInTheDocument()
    screen.getAllByText('●').forEach((d) => expect(d).toHaveAttribute('aria-hidden', 'true'))
    expect(screen.getAllByRole('link', { name: /Register on Luma/ })[0]).toHaveAttribute('href', 'https://lu.ma/oa-merge')
  })

  it('delivery live shows LIVE NOW wording', () => {
    const live = { ...ev('merge-conflicts'), delivery: 'live' }
    const { container } = render(<EventMedia event={live} now={FIXTURE_NOW} />)
    expect(screen.getByText('LIVE')).toBeInTheDocument()
    expect(container.querySelector('iframe')).not.toBeNull()
  })

  it('upcoming week talk shows premiere eyebrow, countdown label and where', () => {
    const e = FIXTURE_EVENTS.find((x) => x.slug === 'controls-as-code')
    e.week = 4
    try {
      renderAt('controls-as-code')
    } finally {
      delete e.week
    }
    expect(screen.getByText('Week 4 · Webcast · Premiere with live Q&A · Free')).toBeInTheDocument()
    expect(screen.getByText('Premieres in')).toBeInTheDocument()
    expect(screen.getByText('YouTube Premiere · questions in live chat')).toBeInTheDocument()
  })

  it('without registerUrl there is no Register link but calendar remains', () => {
    const e = FIXTURE_EVENTS.find((x) => x.slug === 'controls-as-code')
    const saved = e.registerUrl
    e.registerUrl = null
    try {
      renderAt('controls-as-code')
    } finally {
      e.registerUrl = saved
    }
    expect(screen.queryByRole('link', { name: /Register/ })).toBeNull()
    expect(screen.getAllByRole('link', { name: /Add to calendar/ }).length).toBeGreaterThan(0)
  })

  it('titles the related list for multiple frameworks', () => {
    const e = FIXTURE_EVENTS.find((x) => x.slug === 'controls-as-code')
    e.frameworks = ['controlgate', 'mergelock']
    try {
      renderAt('controls-as-code')
    } finally {
      e.frameworks = ['controlgate']
    }
    expect(screen.getByText('Frameworks in this session')).toBeInTheDocument()
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
