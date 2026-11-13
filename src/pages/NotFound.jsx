import { Button, Eyebrow } from '../components/ui'

export default function NotFound() {
  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-24 flex flex-col items-start gap-4">
      <Eyebrow>404</Eyebrow>
      <h1 className="font-serif text-5xl">Not found</h1>
      <p className="text-ink-muted">That page isn't in the index.</p>
      <Button to="/frameworks" variant="solid">Browse frameworks</Button>
    </div>
  )
}
