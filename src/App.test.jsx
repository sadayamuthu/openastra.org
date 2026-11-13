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

  it.each([
    ['/', /Security research/],
    ['/frameworks', 'Frameworks'],
    ['/research', 'Research'],
    ['/patents', 'Patents'],
    ['/about', 'About'],
    ['/does-not-exist', 'Not found'],
  ])('%s renders its page', (path, h1) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(h1)
  })
})
