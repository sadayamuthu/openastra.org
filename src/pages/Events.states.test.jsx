import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Events from './Events'

vi.mock('../data/events', () => {
  const base = { kind: 'talk', format: 'online', speakers: [], durationMin: 60, frameworks: [], series: 'framework-of-the-week', summary: 's' }
  return {
    LUMA_CALENDAR_URL: null,
    events: [
      { ...base, slug: 'w1', week: 1, title: 'Recorded one', start: '2026-12-02T16:00:00Z', recordingUrl: 'https://youtu.be/rec11111111' },
      { ...base, slug: 'w2', week: 2, title: 'No video two', start: '2026-12-09T16:00:00Z', recordingUrl: null, streamUrl: null },
      { ...base, slug: 'w3', week: 3, title: 'Live three', start: '2026-12-16T16:00:00Z', streamUrl: 'https://www.youtube.com/watch?v=abc123DEF45' },
    ],
  }
})

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-12-16T16:10:00Z'))
})
afterEach(() => vi.useRealTimers())

describe('series row states', () => {
  it('shows WATCH, RECORDING SOON and an aria-hidden ● PREMIERING, each with a time', () => {
    render(<MemoryRouter><Events /></MemoryRouter>)
    const region = screen.getByRole('region', { name: 'The series · 3 weeks' })
    const row = (title) => within(region).getByRole('link', { name: title }).closest('li')
    expect(within(row('Recorded one')).getByText('WATCH')).toBeInTheDocument()
    expect(within(row('No video two')).getByText('RECORDING SOON')).toBeInTheDocument()
    const live = row('Live three')
    expect(within(live).getByText('PREMIERING', { exact: false })).toBeInTheDocument()
    expect(within(live).getByText('●')).toHaveAttribute('aria-hidden', 'true')
    for (const t of ['Recorded one', 'No video two', 'Live three']) {
      expect(row(t).textContent).toMatch(/\d{1,2}:\d{2} [AP]M/)
    }
  })
})
