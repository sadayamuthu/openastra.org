import { existsSync, readFileSync } from 'node:fs'

describe('deploy workflow', () => {
  it('serves catalogs and schemas from public/ at /<name>/catalog and /<name>/schema', () => {
    for (const path of [
      'public/ocbc/catalog/v0.1/latest.json',
      'public/oebc/catalog/v0.1/latest.json.gz',
      'public/ocbc/schema/v0.1/ocbc.json',
      'public/oebc/schema/v0.1/oebc.json',
    ]) {
      expect(existsSync(path), path).toBe(true)
    }
  })

  it('schemas declare their openastra.org URL as $id', () => {
    for (const name of ['ocbc', 'oebc']) {
      const schema = JSON.parse(readFileSync(`public/${name}/schema/v0.1/${name}.json`, 'utf8'))
      expect(schema.$id).toBe(`https://openastra.org/${name}/schema/v0.1/${name}.json`)
    }
  })

  it('replaces the latest catalogs with the newest GitHub Release after the build', () => {
    const wf = readFileSync('.github/workflows/deploy.yml', 'utf8')
    expect(wf).toContain('scripts/fetch-catalogs.sh dist')
    expect(wf).toContain('repository_dispatch')
    expect(wf).toContain('force_orphan: true')
  })

  it('runs the events prerender as part of the build', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
    expect(pkg.scripts.build).toContain('node scripts/prerender-events.mjs')
  })
})
