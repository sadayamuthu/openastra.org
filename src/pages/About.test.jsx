import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from './About'

describe('About page', () => {
  it('describes the lab and its four focus areas', () => {
    render(<MemoryRouter><About /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About')
    ;['Agentic', 'Security Controls', 'Security Catalog', 'Observability'].forEach((c) =>
      expect(screen.getByRole('link', { name: new RegExp(c) })).toBeInTheDocument()
    )
  })
})

describe('About copy accuracy', () => {
  it('does not claim every framework has a Zenodo release', () => {
    const { container } = render(<MemoryRouter><About /></MemoryRouter>)
    expect(container.textContent).not.toMatch(/every framework ships/i)
  })
})
