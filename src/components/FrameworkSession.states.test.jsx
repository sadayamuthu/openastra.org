import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FrameworkSession from './FrameworkSession'

const mock = vi.hoisted(() => ({ events: [] }))
vi.mock('../data/events', () => ({ events: mock.events }))

const base = {
  kind: 'talk', format: 'online', speakers: [], durationMin: 60, series: 'framework-of-the-week', week: 1,
  summary: 's', title: 'T', slug: 'sess', frameworks: ['mergelock'], start: '2026-12-02T16:00:00Z',
  streamUrl: null, recordingUrl: null,
}

function setup(now, over) {
  mock.events.length = 0
  mock.events.push({ ...base, ...over })
  vi.setSystemTime(new Date(now))
  render(<MemoryRouter><FrameworkSession slug="mergelock" /></MemoryRouter>)
}

beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }))
afterEach(() => vi.useRealTimers())

describe('FrameworkSession banner states', () => {
  it('live shows badge and Watch', () => {
    setup('2026-12-02T16:10:00Z', { streamUrl: 'https://www.youtube.com/watch?v=abc123DEF45' })
    expect(screen.getByText(/PREMIERING NOW/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Watch/ })).toHaveAttribute('href', '/events/sess')
  })
  it('past with video offers the session', () => {
    setup('2026-12-20T00:00:00Z', { recordingUrl: 'https://youtu.be/rec11111111' })
    expect(screen.getByText('Framework of the week · Watch the session')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Watch/ })).toBeInTheDocument()
  })
  it('past without video says recording coming soon', () => {
    setup('2026-12-20T00:00:00Z', {})
    expect(screen.getByText('Framework of the week · Recording coming soon')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/sess')
  })

  describe('recorded', () => {
    const rec = { delivery: 'recorded' }
    it('upcoming says new video with the date', () => {
      setup('2026-11-20T00:00:00Z', { ...rec, start: '2026-12-09T16:00:00Z' })
      expect(screen.getByText('Framework of the week · New video Wed 9 Dec')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/sess')
    })
    it('past with video offers Watch', () => {
      setup('2026-12-20T00:00:00Z', { ...rec, videoUrl: 'https://youtu.be/vid11111111' })
      expect(screen.getByText('Framework of the week · Watch the session')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Watch/ })).toHaveAttribute('href', '/events/sess')
    })
    it('past without video says video coming soon', () => {
      setup('2026-12-20T00:00:00Z', rec)
      expect(screen.getByText('Framework of the week · Video coming soon')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Details/ })).toHaveAttribute('href', '/events/sess')
    })
  })
})
