import {
  categories, frameworks, getFramework, frameworksByCategory, shippedFrameworks, labProjects, LAB_GROUPS,
  doiUrl, citationText, bibtex,
} from './frameworks'

describe('frameworks data', () => {
  it('indexes 8 shipped frameworks numbered 1..8, with unique slugs overall', () => {
    expect(new Set(frameworks.map((f) => f.slug)).size).toBe(frameworks.length)
    expect(shippedFrameworks()).toHaveLength(8)
    expect(shippedFrameworks().map((f) => f.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    shippedFrameworks().forEach((f) => expect(f.zenodo).toBeDefined())
  })

  it('puts every framework in a known category and leaves no category empty', () => {
    const ids = categories.map((c) => c.id)
    expect(ids).toEqual(['agentic', 'security-controls', 'security-catalog', 'observability'])
    frameworks.forEach((f) => expect(ids).toContain(f.category))
    frameworksByCategory().forEach((g) => expect(g.frameworks.length).toBeGreaterThan(0))
  })

  it('orders the agentic category MergeLock, Unasked, ZeroEgress, CyberLake', () => {
    const agentic = frameworksByCategory().find((g) => g.category.id === 'agentic')
    expect(agentic.frameworks.map((f) => f.slug)).toEqual(['mergelock', 'unasked', 'zero-egress'])
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

describe('facts accuracy', () => {
  it('ExposureGate does not claim an unverified data source', () => {
    expect(getFramework('exposuregate').facts.map(([k]) => k)).not.toContain('Data')
  })
})

describe('packages', () => {
  const urls = (slug) => Object.fromEntries((getFramework(slug).packages || []).map((p) => [p.label, p.url]))

  it('links MergeLock to Homebrew, Docker, deb/rpm, GitHub Action and the MCP Registry', () => {
    expect(urls('mergelock')).toEqual({
      Homebrew: 'https://github.com/sadayamuthu/homebrew-tap/blob/main/Formula/mergelock.rb',
      Docker: 'https://github.com/sadayamuthu/mergelock/pkgs/container/mergelock',
      '.deb / .rpm / binaries': 'https://github.com/sadayamuthu/mergelock/releases/latest',
      'GitHub Action': 'https://github.com/sadayamuthu/mergelock/blob/main/action.yml',
      'MCP Registry': 'https://registry.modelcontextprotocol.io/v0/servers?search=io.github.sadayamuthu/mergelock',
    })
  })

  it('links PyPI only for packages published by the author', () => {
    const pypi = (slug) => urls(slug).PyPI
    expect(pypi('controlgate')).toBe('https://pypi.org/project/controlgate/')
    expect(pypi('ocbc')).toBe('https://pypi.org/project/ocbc/')
    expect(pypi('anysql')).toBe('https://pypi.org/project/anysql-sdk/')
    expect(pypi('opengpl')).toBe('https://pypi.org/project/opengpl-sdk/')
    expect(pypi('unasked')).toBeUndefined() // PyPI "unasked" is someone else's project
  })

  it('does not link a Homebrew formula that the tap does not have', () => {
    expect(urls('unasked').Homebrew).toBeUndefined()
    expect(getFramework('unasked').quickstart.flatMap((b) => b.lines).join('\n')).not.toMatch(/brew install/)
  })

  it('links the OpenGPL sidecar image', () => {
    expect(urls('opengpl')['Docker (sidecar)']).toBe('https://github.com/sadayamuthu/opengpl/pkgs/container/opengpl%2Fsidecar')
  })

  it('only uses https URLs', () => {
    frameworks.flatMap((f) => f.packages || []).forEach((p) => expect(p.url).toMatch(/^https:\/\//))
  })
})

describe('ControlGate facts', () => {
  it('keeps the 370 non-negotiable controls figure', () => {
    expect(getFramework('controlgate').facts).toContainEqual(['Controls', '370 non-negotiable'])
  })
})

describe('install commands match what is actually published', () => {
  const cmds = (slug) => (getFramework(slug).quickstart || []).flatMap((b) => b.lines).join('\n')

  it('ExposureGate and CyberLake are marked coming soon with no install commands', () => {
    ;['exposuregate', 'cyberlake'].forEach((slug) => {
      expect(getFramework(slug).status).toBe('Coming soon')
      expect(getFramework(slug).quickstart).toBeUndefined()
    })
  })

  it('does not link the unreachable cyberlake.org', () => {
    expect(getFramework('cyberlake').links.website).toBeUndefined()
  })

  it('never tells people to pip install a package that is not on PyPI', () => {
    const notOnPypi = ['exposuregate', 'oebc', 'cyberlake', 'opengpl', 'mergelock', 'unasked']
    frameworks.forEach((f) => {
      notOnPypi.forEach((pkg) => expect(cmds(f.slug)).not.toMatch(new RegExp(`pip install ${pkg}(\\s|$)`)))
    })
  })

  it('OEBC downloads the published catalog or builds from source', () => {
    expect(cmds('oebc')).toContain('curl -L https://openastra.org/oebc/catalog/v0.1/latest.json.gz | gunzip > oebc_catalog.json')
    expect(cmds('oebc')).toContain('git clone https://github.com/sadayamuthu/oebc.git')
    expect(cmds('oebc')).toContain('make generate')
  })

  it('OCBC uses the real CLI subcommands', () => {
    expect(cmds('ocbc')).toContain('pip install ocbc')
    expect(cmds('ocbc')).toContain('ocbc fetch --out catalog.json')
    expect(cmds('ocbc')).toContain('ocbc generate')
    expect(cmds('ocbc')).not.toMatch(/ocbc-generate|python -m src\.ocbc/)
  })

  it('anySQL wraps the client the way the SDK documents', () => {
    expect(cmds('anysql')).toContain('client = anysql.claude(db).wrap(anthropic_client)')
  })

  it('links the hosted OCBC and OEBC catalogs', () => {
    const urls = (slug) => getFramework(slug).packages.map((p) => p.url)
    expect(urls('ocbc')).toContain('https://openastra.org/ocbc/catalog/v0.1/latest.json')
    expect(urls('oebc')).toContain('https://openastra.org/oebc/catalog/v0.1/latest.json.gz')
  })
})

describe('In the lab', () => {
  it('holds CyberLake, ExposureGate and the 7 new projects', () => {
    expect(labProjects().map((p) => p.name)).toEqual([
      'OpenQR', 'OpenQS', 'OpenQO', 'AgentID', 'OpenQA', 'CyberLake', 'ExposureGate', 'OpenCIQ', 'OpenEQ',
    ])
  })

  it('keeps lab projects out of the numbered index', () => {
    ;['cyberlake', 'exposuregate'].forEach((slug) => {
      expect(getFramework(slug).lab).toBe(true)
      expect(getFramework(slug).number).toBeUndefined()
    })
  })

  it('pairs each new project with its domain', () => {
    const domains = Object.fromEntries(labProjects().filter((p) => p.domain).map((p) => [p.name, p.domain]))
    expect(domains).toEqual({
      OpenQR: 'openqr.dev', OpenQS: 'openqs.org', OpenQO: 'openqo.org', AgentID: 'openid.ai',
      OpenQA: 'openqa.dev', OpenCIQ: 'openciq.com', OpenEQ: 'openeq.dev',
    })
  })

  it('orders the OpenQ suite Know, Find, Fix', () => {
    expect(labProjects().filter((p) => p.group === 'openq').map((p) => `${p.step} ${p.name}`)).toEqual([
      'Know OpenQR', 'Find OpenQS', 'Fix OpenQO',
    ])
  })

  it('gives every project a known group', () => {
    const ids = LAB_GROUPS.map((g) => g.id)
    labProjects().forEach((p) => expect(ids).toContain(p.group))
  })

  it('links CyberLake and ExposureGate to their existing pages', () => {
    expect(labProjects().find((p) => p.name === 'CyberLake').to).toBe('/cyberlake')
    expect(labProjects().find((p) => p.name === 'ExposureGate').to).toBe('/exposuregate')
  })
})
