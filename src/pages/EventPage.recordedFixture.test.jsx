import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EventPage from './EventPage'

vi.mock('../data/events', () => {
  const base = { kind: 'talk', format: 'online', delivery: 'recorded', speakers: [], frameworks: [], summary: 's' }
  return {
    events: [
      { ...base, slug: 'out', title: 'Out', start: '2026-11-11T16:00:00Z', videoUrl: 'https://www.youtube.com/watch?v=abc123DEF45', registerUrl: 'https://lu.ma/x' },
      { ...base, slug: 'soon', title: 'Soon', start: '2026-11-11T16:00:00Z', videoUrl: null },
      { ...base, slug: 'later', title: 'Later', start: '2026-12-09T16:00:00Z', registerUrl: 'https://lu.ma/later' },
      { ...base, slug: 'prem', delivery: 'premiere', title: 'Prem', durationMin: 60, start: '2026-12-09T16:00:00Z', registerUrl: 'https://lu.ma/p', streamUrl: null },
    ],
  }
})

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-20T00:00:00Z'))
})
afterEach(() => vi.useRealTimers())

const renderAt = (slug) =>
  render(
    <MemoryRouter initialEntries={[`/events/${slug}`]}>
      <Routes><Route path="/events/:slug" element={<EventPage />} /></Routes>
    </MemoryRouter>,
  )

describe('EventPage, recorded fixtures', () => {
  it('past with a video embeds it and links to YouTube', () => {
    const { container } = renderAt('out')
    expect(container.querySelector('iframe')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/abc123DEF45')
    expect(screen.getByRole('link', { name: 'Watch on YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=abc123DEF45')
    expect(screen.getByText('Questions? Ask in the YouTube comments.')).toBeInTheDocument()
    expect(screen.queryByText('PREMIERE')).toBeNull()
    expect(screen.queryByText(/reminder/)).toBeNull()
  })

  it('past without a video says video coming soon', () => {
    renderAt('soon')
    expect(screen.getByText('Video coming soon')).toBeInTheDocument()
  })

  it('upcoming with registerUrl offers a Luma reminder', () => {
    renderAt('later')
    const links = screen.getAllByRole('link', { name: 'Get a reminder on Luma' })
    expect(links[0]).toHaveAttribute('href', 'https://lu.ma/later')
    expect(screen.queryByText(/Add to calendar/)).toBeNull()
  })

  it('premiere keeps countdown and calendar', () => {
    renderAt('prem')
    expect(screen.getByTestId('countdown')).toBeInTheDocument()
    expect(screen.getAllByText(/Add to calendar/).length).toBeGreaterThan(0)
  })
})
