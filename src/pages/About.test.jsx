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

describe('About people cards', () => {
  it('shows a card for every author linking to their profile page', () => {
    render(<MemoryRouter><About /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 2, name: /Authors/ })).toBeInTheDocument()
    ;[
      ['Karthikeyan Sadayamuthu', '/about/karthikeyan-sadayamuthu'],
      ['Vinodh Kannan Sadayamuthu', '/about/vinodh-kannan-sadayamuthu'],
      ['Kartic Narayanan', '/about/kartic-narayanan'],
      ['Manjulata Singh', '/about/manjulata-singh'],
      ['Chakkaravarthi Kannan', '/about/chakkaravarthi-kannan'],
      ['Vibha Nair', '/about/vibha-nair'],
    ].forEach(([name, href]) =>
      expect(screen.getByRole('link', { name: new RegExp(name) })).toHaveAttribute('href', href)
    )
    expect(screen.getAllByText(/Profile coming soon/)).toHaveLength(5)
  })
})

describe('About brand mark', () => {
  it('shows the intro GIF and explains the mark, without a brand kit link', () => {
    render(<MemoryRouter><About /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 2, name: 'Open Orbit' })).toBeInTheDocument()
    expect(screen.getByAltText(/OpenAstra mark/)).toHaveAttribute('src', '/brand/openastra-intro-512.gif')
    expect(screen.queryByRole('link', { name: /Brand kit/ })).not.toBeInTheDocument()
  })
})
