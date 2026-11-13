import { render, screen, fireEvent, act } from '@testing-library/react'
import Citation from './Citation'
import { getFramework, citationText, bibtex } from '../data/frameworks'

const mergelock = getFramework('mergelock')

describe('Citation', () => {
  const original = navigator.clipboard
  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', { value: original, configurable: true })
    vi.useRealTimers()
  })

  const mockClipboard = () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    return writeText
  }

  it('links the DOI through doi.org', () => {
    render(<Citation framework={mergelock} />)
    expect(screen.getByRole('link', { name: 'https://doi.org/10.5281/zenodo.23637443' }))
      .toHaveAttribute('href', 'https://doi.org/10.5281/zenodo.23637443')
  })

  it('shows the citation title', () => {
    render(<Citation framework={mergelock} />)
    expect(screen.getByText('mergelock: a git-native merge gate')).toBeInTheDocument()
  })

  it('copies the APA citation and confirms', async () => {
    const writeText = mockClipboard()
    render(<Citation framework={mergelock} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy citation' })) })
    expect(writeText).toHaveBeenCalledWith(citationText(mergelock))
    expect(screen.getByRole('button', { name: 'Copy citation' })).toHaveTextContent('Copied')
  })

  it('copies BibTeX', async () => {
    const writeText = mockClipboard()
    render(<Citation framework={mergelock} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy BibTeX' })) })
    expect(writeText).toHaveBeenCalledWith(bibtex(mergelock))
  })

  it('does not throw when the clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    render(<Citation framework={mergelock} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy citation' })) })
    expect(screen.getByRole('button', { name: 'Copy citation' })).toBeInTheDocument()
  })

  it('links to the Zenodo record unless compact', () => {
    const { rerender } = render(<Citation framework={mergelock} />)
    expect(screen.getByRole('link', { name: /Zenodo/ })).toHaveAttribute('href', 'https://zenodo.org/doi/10.5281/zenodo.23637443')
    rerender(<Citation framework={mergelock} compact />)
    expect(screen.queryByRole('link', { name: /Zenodo/ })).toBeNull()
  })

  it('reveals and selects the citation when the clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    render(<Citation framework={mergelock} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy citation' })) })
    const box = screen.getByRole('textbox', { name: 'Citation' })
    expect(box).toHaveValue(citationText(mergelock))
    expect(box.selectionEnd - box.selectionStart).toBe(citationText(mergelock).length)
  })

  it('reveals and selects the BibTeX when the clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    render(<Citation framework={mergelock} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy BibTeX' })) })
    const box = screen.getByRole('textbox', { name: 'BibTeX' })
    expect(box).toHaveValue(bibtex(mergelock))
    expect(box.selectionEnd - box.selectionStart).toBe(bibtex(mergelock).length)
  })
})
