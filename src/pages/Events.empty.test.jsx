import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

async function renderHub(lumaUrl) {
  vi.resetModules()
  vi.doMock('../data/events', () => ({ events: [], LUMA_CALENDAR_URL: lumaUrl }))
  const { default: Events } = await import('./Events')
  render(<MemoryRouter><Events /></MemoryRouter>)
}

afterEach(() => vi.doUnmock('../data/events'))

describe('Events hub, empty', () => {
  it('without a Luma calendar shows no call to action', async () => {
    await renderHub(null)
    expect(screen.getByText('Announced soon')).toBeInTheDocument()
    expect(screen.getByText('The first talk will be announced here.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Follow on Luma/ })).toBeNull()
    expect(screen.getByText('Recordings build up here')).toBeInTheDocument()
    expect(screen.getByText('Each premiere stays available right after it airs.')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /The series/ })).toBeNull()
  })

  // Real data is now recorded; the hub renders it only after Task 3.
  it.todo('after the series ends says the next series is coming (Task 3)')

  it('with a Luma calendar shows a Follow button', async () => {
    await renderHub('https://lu.ma/openastra')
    expect(screen.getByText(/Follow the OpenAstra calendar on Luma/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Follow on Luma' })).toHaveAttribute('href', 'https://lu.ma/openastra')
  })
})
