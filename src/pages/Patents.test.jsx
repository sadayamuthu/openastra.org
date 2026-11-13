import { render, screen } from '@testing-library/react'
import Patents from './Patents'

describe('Patents page', () => {
  it('says coming soon and nothing about topics', () => {
    const { container } = render(<Patents />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Patents')
    expect(screen.getByText('Coming soon.')).toBeInTheDocument()
    expect(screen.getByText("This page will list each application as it's published.")).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/merge|attribution|registry/i)
  })
})
