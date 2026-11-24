import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FrameworkIndex from './FrameworkIndex'
import { splitIndex } from '../lib/indexColumns'

const group = (n) => ({ category: { id: String(Math.random()) }, frameworks: Array(n).fill({}) })

describe('FrameworkIndex', () => {
  it('splits categories so the columns are about as tall', () => {
    expect(splitIndex([group(3), group(2), group(2), group(1), group(1), group(1), group(1), group(1)], 5)).toBe(4)
    expect(splitIndex([group(2), group(2)])).toBe(1)
  })

  it('puts I–IV on the left and V–X with the featured citation on the right', () => {
    const { container } = render(<MemoryRouter><FrameworkIndex aside={<p>Featured</p>} /></MemoryRouter>)
    const [left, right] = container.firstChild.children
    const headings = (col) => [...col.querySelectorAll('h3')].map((h) => h.textContent.split('.')[0])
    expect(headings(left)).toEqual(['I', 'II', 'III', 'IV'])
    expect(headings(right)).toEqual(['V', 'VI', 'VIII', 'X'])
    expect(right).toContainElement(screen.getByText('Featured'))
  })

  it('balances without an aside: I–III left, IV–X right', () => {
    const { container } = render(<MemoryRouter><FrameworkIndex /></MemoryRouter>)
    const [left, right] = container.firstChild.children
    const headings = (col) => [...col.querySelectorAll('h3')].map((h) => h.textContent.split('.')[0])
    expect(headings(left)).toEqual(['I', 'II', 'III'])
    expect(headings(right)).toEqual(['IV', 'V', 'VI', 'VIII', 'X'])
  })
})
