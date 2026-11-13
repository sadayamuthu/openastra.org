import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button, ComingSoon, CodeBlock } from './ui'

describe('ui primitives', () => {
  it('Button renders internal links with to and external links in a new tab', () => {
    render(<MemoryRouter><Button to="/research">In</Button><Button href="https://x.org">Out</Button></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'In' })).toHaveAttribute('href', '/research')
    const out = screen.getByRole('link', { name: /Out/ })
    expect(out).toHaveAttribute('target', '_blank')
    expect(out).toHaveAttribute('rel', 'noreferrer')
  })

  it('ComingSoon shows its label and the exact text Coming soon', () => {
    render(<ComingSoon label="Patents" />)
    expect(screen.getByText('Patents')).toBeInTheDocument()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('CodeBlock renders comments and command lines', () => {
    render(<CodeBlock blocks={[{ comment: 'Install', lines: ['brew install x'] }]} />)
    expect(screen.getByText('# Install')).toBeInTheDocument()
    expect(screen.getByText('brew install x')).toBeInTheDocument()
  })
})
