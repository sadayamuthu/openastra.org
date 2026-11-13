import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from './NotFound'

describe('NotFound', () => {
  it('says Not found and offers a way back', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>)
    expect(screen.getByText('Not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse frameworks' })).toHaveAttribute('href', '/frameworks')
  })
})
