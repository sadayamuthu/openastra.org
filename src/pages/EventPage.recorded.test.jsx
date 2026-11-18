import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EventPage from './EventPage'

// Real data (no fixture mock): week 1 is the MergeLock recorded session.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-20T00:00:00Z'))
})
afterEach(() => vi.useRealTimers())

describe('EventPage, real recorded data', () => {
  it('upcoming recorded session shows coming box, copy and no actions', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/events/mergelock']}>
        <Routes><Route path="/events/:slug" element={<EventPage />} /></Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Coming Wed 9 Dec')).toBeInTheDocument()
    expect(screen.getByText(/^Out at .*(AM|PM)/)).toBeInTheDocument()
    expect(screen.getByText('Week 1 · Recorded session · Free')).toBeInTheDocument()
    expect(screen.getByText('YouTube · recorded session')).toBeInTheDocument()
    expect(screen.getByText('In the YouTube comments')).toBeInTheDocument()
    expect(screen.queryByTestId('countdown')).toBeNull()
    expect(screen.queryByText(/Add to calendar/)).toBeNull()
    expect(screen.queryByText(/Register|reminder/)).toBeNull()
    expect(container.querySelector('[data-testid="talk-actions"]')).toBeNull()
  })
})
