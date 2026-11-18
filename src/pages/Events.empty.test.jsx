import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Events from './Events'

vi.mock('../data/events', () => ({ events: [] }))

describe('Events hub, empty', () => {
  it('shows placeholders', () => {
    render(<MemoryRouter><Events /></MemoryRouter>)
    expect(screen.getByText('Announced soon')).toBeInTheDocument()
    expect(screen.getByText('Recordings appear here after each talk')).toBeInTheDocument()
  })
})
