import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Lab from './Lab'

const renderAt = (path = '/lab') => render(<MemoryRouter initialEntries={[path]}><Lab /></MemoryRouter>)
const names = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('Lab page', () => {
  it('lists all 11 projects, each marked Coming soon', () => {
    renderAt()
    expect(names()).toHaveLength(11)
    expect(screen.getAllByText('Coming soon').length).toBe(11)
  })

  it('offers a filter only for groups with projects', () => {
    renderAt()
    const pills = within(screen.getByRole('group', { name: 'Filter by group' })).getAllByRole('button').map((b) => b.textContent)
    expect(pills).toEqual(['All', 'Threat Modeling & Risk', 'Runtime Security', 'Data Security & Privacy', 'Resilience & Recovery'])
  })

  it('presents the runtime tools in order', () => {
    renderAt()
    const runtime = within(screen.getByRole('region', { name: /Runtime Security/ }))
    expect(runtime.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['IntentLock', 'Taintline', 'Airlock'])
  })

  it('filters by group', () => {
    renderAt()
    fireEvent.click(screen.getByRole('button', { name: 'Resilience & Recovery' }))
    expect(names()).toEqual(['Rewind', 'Fuse'])
  })

  it('treats an unknown or paused group as All', () => {
    renderAt('/lab?group=openq')
    expect(names()).toHaveLength(11)
  })

  it('leaves out the paused projects and the ones that shipped', () => {
    renderAt()
    ;['CyberLake', 'OpenQR', 'AgentID', 'switchyard', 'AgentChaos'].forEach((n) => expect(screen.queryByText(n)).toBeNull())
  })
})
