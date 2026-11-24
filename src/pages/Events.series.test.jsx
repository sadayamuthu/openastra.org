import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Events from './Events'
import { events } from '../data/events'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-20T00:00:00Z'))
})
afterEach(() => vi.useRealTimers())

describe('launch-day hub (real data)', () => {
  it('shows the featured week 1, the 8-week schedule with a break, and empty on-demand', () => {
    render(<MemoryRouter><Events /></MemoryRouter>)
    expect(screen.getByText('Framework of the week · New every Wednesday · Free')).toBeInTheDocument()
    expect(screen.getByText(/a recorded session published every Wednesday on YouTube/)).toBeInTheDocument()
    expect(screen.getByText('Week 1 · Coming Wed 9 Dec')).toBeInTheDocument()
    expect(screen.queryByTestId('countdown')).toBeNull()
    expect(screen.getAllByText("Merge conflicts git can't see").length).toBeGreaterThan(0)

    const region = screen.getByRole('region', { name: 'The series · 8 weeks' })
    const items = within(region).getAllByRole('listitem')
    const sessions = items.filter((li) => within(li).queryByRole('link'))
    const weeks = [...events].sort((a, b) => a.week - b.week)
    expect(sessions.map((li) => within(li).getByRole('link').getAttribute('href')))
      .toEqual(weeks.map((e) => `/events/${e.slug}`))
    expect(within(region).getByText(/Holiday break · back/)).toBeInTheDocument()
    expect(within(sessions[0]).getByText('COMING WED 9 DEC')).toBeInTheDocument()
    expect(within(sessions[1]).getByText('COMING WED 16 DEC')).toBeInTheDocument()
    const dateCell = within(sessions[0]).getByText('Week 1').parentElement
    expect(dateCell.textContent).toMatch(/Wed \d{1,2} Dec/)
    expect(dateCell.textContent).not.toMatch(/[AP]M/)

    const od = screen.getByRole('region', { name: 'On demand' })
    expect(within(od).getByText('Recordings build up here')).toBeInTheDocument()
  })
})
