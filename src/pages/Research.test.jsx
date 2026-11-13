import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Research from './Research'
import { citedFrameworks, doiUrl } from '../data/frameworks'

const renderResearch = () => render(<MemoryRouter><Research /></MemoryRouter>)

describe('Research page', () => {
  it('lists every Zenodo citation with its doi.org link', () => {
    renderResearch()
    expect(screen.getByRole('heading', { name: /Zenodo citations/ })).toBeInTheDocument()
    const hrefs = screen.getAllByRole('link', { name: /^https:\/\/doi\.org\// }).map((a) => a.getAttribute('href'))
    expect(hrefs.sort()).toEqual(citedFrameworks().map((f) => doiUrl(f.zenodo.doi)).sort())
    expect(hrefs).toHaveLength(8)
  })

  it('keeps White papers and Patents as Coming soon', () => {
    renderResearch()
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
  })

  it('never calls the Zenodo records papers', () => {
    const { container } = renderResearch()
    const text = container.textContent.replace(/white papers/gi, '')
    expect(text).not.toMatch(/paper/i)
  })
})
