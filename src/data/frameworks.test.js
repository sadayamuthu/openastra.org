import {
  categories, frameworks, getFramework, frameworksByCategory, shippedFrameworks, labProjects, activeLabGroups, LAB_GROUPS, OPEN_AREA_PROJECTS, repoDocs, openSourceGroups,
  doiUrl, citationText, bibtex, agenda,
} from './frameworks'

describe('frameworks data', () => {
  it('indexes 12 shipped frameworks numbered 1..12, with unique slugs overall', () => {
    expect(new Set(frameworks.map((f) => f.slug)).size).toBe(frameworks.length)
    expect(shippedFrameworks()).toHaveLength(12)
    expect(shippedFrameworks().map((f) => f.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('has one category per agenda area, and puts every framework in one', () => {
    const ids = categories.map((c) => c.id)
    expect(ids).toEqual([
      'agentic', 'security-controls', 'security-catalog', 'observability', 'identity', 'governance',
      'threat-modeling', 'runtime', 'data-security', 'resilience',
    ])
    expect(categories.map((c) => c.numeral)).toEqual(agenda().map((a) => a.numeral))
    expect(agenda().map((a) => a.category)).toEqual(ids)
    frameworks.forEach((f) => expect(ids).toContain(f.category))
    frameworksByCategory().forEach((g) => expect(g.frameworks.length).toBeGreaterThan(0))
  })

  it('numbers shipped frameworks in category order, with OpenAPL under Identity and OpenGPL under Governance', () => {
    expect(shippedFrameworks().map((f) => f.slug)).toEqual(
      ['mergelock', 'unasked', 'zero-egress', 'controlgate', 'exposuregate', 'ocbc', 'oebc', 'anysql', 'openapl', 'opengpl', 'switchyard', 'agentchaos'])
    expect(getFramework('openapl').category).toBe('identity')
    expect(getFramework('opengpl').category).toBe('governance')
    expect(frameworksByCategory().map((g) => g.category.id)).toEqual(
      ['agentic', 'security-controls', 'security-catalog', 'observability', 'identity', 'governance', 'runtime', 'resilience'])
  })

  it('keeps an Identity & Access lab group for when AgentID returns', () => {
    expect(LAB_GROUPS.map((g) => g.id)).toContain('identity')
  })

  it('orders the agentic category MergeLock, Unasked, ZeroEgress', () => {
    const agentic = frameworksByCategory().find((g) => g.category.id === 'agentic')
    expect(agentic.frameworks.map((f) => f.slug)).toEqual(['mergelock', 'unasked', 'zero-egress'])
  })

  it('puts switchyard under Runtime Security and AgentChaos under Resilience & Recovery', () => {
    expect(getFramework('switchyard').category).toBe('runtime')
    expect(getFramework('agentchaos').category).toBe('resilience')
  })

  it('ships switchyard and AgentChaos without a DOI yet', () => {
    ;['switchyard', 'agentchaos'].forEach((slug) => {
      expect(getFramework(slug).lab).toBeUndefined()
      expect(getFramework(slug).zenodo).toBeUndefined()
      expect(getFramework(slug).quickstart.length).toBeGreaterThan(0)
    })
  })

  it('gives 10 frameworks a well-formed Zenodo DOI and none to CyberLake', () => {
    const withDoi = frameworks.filter((f) => f.zenodo)
    expect(withDoi).toHaveLength(10)
    withDoi.forEach((f) => expect(f.zenodo.doi).toMatch(/^10\.5281\/zenodo\.\d+$/))
    expect(getFramework('cyberlake').zenodo).toBeUndefined()
    expect(getFramework('exposuregate').zenodo.doi).toBe('10.5281/zenodo.24241823')
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
  it('ExposureGate names the data it actually reads', () => {
    expect(getFramework('exposuregate').facts).toContainEqual(['Data', 'OEBC · OSV'])
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
    expect(pypi('exposuregate')).toBe('https://pypi.org/project/exposuregate/')
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

  it('CyberLake is marked coming soon with no install commands', () => {
    expect(getFramework('cyberlake').status).toBe('Coming soon')
    expect(getFramework('cyberlake').quickstart).toBeUndefined()
  })

  it('ExposureGate uses the real CLI subcommands', () => {
    expect(getFramework('exposuregate').status).toBeUndefined()
    expect(cmds('exposuregate')).toContain('pip install exposuregate')
    expect(cmds('exposuregate')).toContain('exposuregate update-data')
    expect(cmds('exposuregate')).toContain('exposuregate scan --mode pr --target-branch main')
  })

  it('does not link the unreachable cyberlake.org', () => {
    expect(getFramework('cyberlake').links.website).toBeUndefined()
  })

  it('never tells people to pip install a package that is not on PyPI', () => {
    const notOnPypi = ['oebc', 'cyberlake', 'opengpl', 'mergelock', 'unasked']
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
  const OPEN_AREA = [
    'ThreatDiff', 'OATC', 'AgentRisk',
    'AgentLock', 'AgentTaint', 'AgentBox',
    'Tripwire', 'ACLDrift', 'HubScan',
    'AgentRewind', 'AgentFuse',
  ]

  it('holds the 11 open-area projects, in area order', () => {
    expect(labProjects().map((p) => p.name)).toEqual(OPEN_AREA)
  })

  it('pauses the OpenQ suite, AgentID, OpenQA, OpenCIQ, OpenEQ and CyberLake', () => {
    const names = labProjects().map((p) => p.name)
    ;['OpenQR', 'OpenQS', 'OpenQO', 'AgentID', 'OpenQA', 'OpenCIQ', 'OpenEQ', 'CyberLake'].forEach((n) =>
      expect(names).not.toContain(n))
  })

  it('keeps lab projects out of the numbered index', () => {
    expect(getFramework('cyberlake').lab).toBe(true)
    expect(getFramework('cyberlake').number).toBeUndefined()
    expect(getFramework('exposuregate').lab).toBeUndefined()
  })

  it('groups each project by its agenda area', () => {
    expect(labProjects().map((p) => `${p.area} ${p.group}`)).toEqual([
      ...Array(3).fill('VII threat-modeling'),
      ...Array(3).fill('VIII runtime'),
      ...Array(3).fill('IX data-security'),
      ...Array(2).fill('X resilience'),
    ])
  })

  it('shows only groups that have projects', () => {
    expect(activeLabGroups().map((g) => g.id)).toEqual(['threat-modeling', 'runtime', 'data-security', 'resilience'])
  })

  it('gives each one a repo, a summary and a description', () => {
    OPEN_AREA_PROJECTS.forEach((p) => {
      expect(p.repo).toMatch(/^https:\/\/github\.com\/sadayamuthu\/[a-z]+$/)
      expect(p.summary).toBeTruthy()
      expect(p.description).toBeTruthy()
    })
  })

})

describe('research agenda', () => {
  it('has ten areas numbered I to X', () => {
    expect(agenda().map((a) => a.numeral)).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'])
  })

  it('lists lab projects under VII to X by area', () => {
    const [, , , , , , vii, viii, ix, x] = agenda()
    expect(vii.lab.map((p) => p.name)).toEqual(['ThreatDiff', 'OATC', 'AgentRisk'])
    expect(viii.lab.map((p) => p.name)).toEqual(['AgentLock', 'AgentTaint', 'AgentBox'])
    expect(ix.lab.map((p) => p.name)).toEqual(['Tripwire', 'ACLDrift', 'HubScan'])
    expect(x.lab.map((p) => p.name)).toEqual(['AgentRewind', 'AgentFuse'])
    expect(agenda().slice(6).map((a) => a.shipped.map((f) => f.name))).toEqual([[], ['switchyard'], [], ['AgentChaos']])
  })

  it('derives projects from categories', () => {
    const [, , , , v, vi] = agenda()
    expect(vi.shipped.map((f) => f.name)).toEqual(['OpenGPL'])
    expect(v.shipped.map((f) => f.name)).toEqual(['OpenAPL'])
    expect(v.lab).toEqual([])
  })
})

describe('repo docs', () => {
  it('gives every shipped framework its code, docs and license', () => {
    shippedFrameworks().forEach((f) => {
      const repo = repoDocs(f.links.github)
      expect(repo, f.slug).not.toBeNull()
      expect(repo.code).toBe(f.links.github)
      expect(repo.license.url).toMatch(/\/blob\/main\/LICENSE/)
    })
  })

  it('lists all six docs for switchyard and AgentChaos, in a fixed order', () => {
    ;['switchyard', 'agentchaos'].forEach((slug) => {
      expect(repoDocs(getFramework(slug).links.github).docs.map((d) => d.label)).toEqual([
        'Thesis', 'Roadmap', 'Contributing', 'Governance', 'Maintainers', 'Citation',
      ])
    })
    expect(repoDocs(getFramework('switchyard').links.github).docs[0].url)
      .toBe('https://github.com/sadayamuthu/switchyard/blob/main/THESIS.md')
  })

  it('names licenses and points at the right file', () => {
    expect(repoDocs(getFramework('unasked').links.github).license.label).toBe('MIT')
    expect(repoDocs(getFramework('zero-egress').links.github).license.url)
      .toBe('https://github.com/sadayamuthu/zero-egress/blob/main/LICENSE.txt')
  })

  it('groups projects by category I to X, shipped first, every row with its repo links', () => {
    const groups = openSourceGroups()
    expect(groups.map((g) => g.category.numeral)).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'])
    expect(groups.find((g) => g.category.id === 'runtime').rows.map((r) => r.name))
      .toEqual(['switchyard', 'AgentLock', 'AgentTaint', 'AgentBox'])
    expect(groups.find((g) => g.category.id === 'resilience').rows.map((r) => r.name))
      .toEqual(['AgentChaos', 'AgentRewind', 'AgentFuse'])
    const rows = groups.flatMap((g) => g.rows)
    expect(rows).toHaveLength(shippedFrameworks().length + labProjects().length)
    rows.forEach((r) => expect(r.code, r.name).toBeTruthy())
    rows.filter((r) => r.lab).forEach((r) => {
      expect(r.docs.map((d) => d.id), r.name).toEqual(['thesis', 'roadmap', 'contributing', 'governance', 'maintainers', 'citation'])
      expect(r.license.label).toBe('Apache 2.0')
    })
  })
})
