import {
  categories, frameworks, getFramework, frameworksByCategory,
  doiUrl, citationText, bibtex,
} from './frameworks'

describe('frameworks data', () => {
  it('has 10 frameworks with unique slugs and numbers 1..10', () => {
    expect(frameworks).toHaveLength(10)
    expect(new Set(frameworks.map((f) => f.slug)).size).toBe(10)
    expect(frameworks.map((f) => f.number).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('puts every framework in a known category and leaves no category empty', () => {
    const ids = categories.map((c) => c.id)
    expect(ids).toEqual(['agentic', 'security-controls', 'security-catalog', 'observability'])
    frameworks.forEach((f) => expect(ids).toContain(f.category))
    frameworksByCategory().forEach((g) => expect(g.frameworks.length).toBeGreaterThan(0))
  })

  it('orders the agentic category MergeLock, Unasked, ZeroEgress, CyberLake', () => {
    const agentic = frameworksByCategory().find((g) => g.category.id === 'agentic')
    expect(agentic.frameworks.map((f) => f.slug)).toEqual(['mergelock', 'unasked', 'zero-egress', 'cyberlake'])
  })

  it('gives 8 frameworks a well-formed Zenodo DOI and none to CyberLake or ExposureGate', () => {
    const withDoi = frameworks.filter((f) => f.zenodo)
    expect(withDoi).toHaveLength(8)
    withDoi.forEach((f) => expect(f.zenodo.doi).toMatch(/^10\.5281\/zenodo\.\d+$/))
    expect(getFramework('cyberlake').zenodo).toBeUndefined()
    expect(getFramework('exposuregate').zenodo).toBeUndefined()
  })

  it('builds doi.org URLs', () => {
    expect(doiUrl('10.5281/zenodo.23637443')).toBe('https://doi.org/10.5281/zenodo.23637443')
  })

  it('formats an APA-style software citation with a v-prefixed numeric version', () => {
    expect(citationText(getFramework('mergelock'))).toBe(
      'Sadayamuthu, K. (2026). mergelock: a git-native merge gate (v0.1.5) [Software]. Zenodo. https://doi.org/10.5281/zenodo.23637443'
    )
  })

  it('does not v-prefix non-numeric versions', () => {
    expect(citationText(getFramework('ocbc'))).toContain('(baseline-2026-03-27) [Software]')
  })

  it('formats a BibTeX @software entry', () => {
    const b = bibtex(getFramework('mergelock'))
    expect(b.startsWith('@software{sadayamuthu2026mergelock,')).toBe(true)
    expect(b).toContain('doi = {10.5281/zenodo.23637443}')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getFramework('nope')).toBeUndefined()
  })
})
