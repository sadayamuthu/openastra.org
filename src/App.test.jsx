import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './App'

const renderAt = (path) => render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>)

describe('routes', () => {
  it.each([
    ['/controlgate', 'ControlGate'],
    ['/exposuregate', 'ExposureGate'],
    ['/ocbc', 'OCBC'],
    ['/oebc', 'OEBC'],
    ['/opengpl', 'OpenGPL'],
    ['/cyberlake', 'CyberLake'],
    ['/anysql', 'anySQL'],
    ['/zero-egress', 'ZeroEgress'],
    ['/mergelock', 'MergeLock'],
    ['/unasked', 'Unasked'],
  ])('%s renders %s', (path, name) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(name)
  })

  // Hub crashes on the new recorded row states until Task 3 teaches it 'watch' / 'coming' / 'video-soon'.
  it.todo("sets the title for a trailing-slash URL (/events/ with real data) (Task 3)")

  it.each([
    ['/', /Security research/],
    ['/frameworks', 'Frameworks'],
    ['/research', 'Research'],
    ['/lab', "What we're building next."],
    ['/about', 'About'],
    ['/does-not-exist', 'Not found'],
  ])('%s renders its page', (path, h1) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(h1)
  })
  it.todo('/events renders its page (real data) (Task 3)')
})
