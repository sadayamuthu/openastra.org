import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FrameworkPage from '../pages/FrameworkPage'

vi.mock('../data/events', () => ({ events: [], LUMA_CALENDAR_URL: null }))

describe('FrameworkSession banner without a session', () => {
  it('renders nothing', () => {
    render(<MemoryRouter><FrameworkPage slug="mergelock" /></MemoryRouter>)
    expect(screen.queryByText('WEBCAST')).toBeNull()
    expect(screen.queryByRole('link', { name: /Details|Watch/ })).toBeNull()
  })
})
