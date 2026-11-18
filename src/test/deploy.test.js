import { readFileSync } from 'node:fs'

describe('deploy workflow', () => {
  it('publishes the OCBC catalog at /ocbc/catalog', () => {
    const wf = readFileSync('.github/workflows/deploy.yml', 'utf8')
    expect(wf).toMatch(/cp -r ocbc\/catalog dist\/ocbc\//)
  })

  it('runs the events prerender as part of the build', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
    expect(pkg.scripts.build).toContain('node scripts/prerender-events.mjs')
  })
})
