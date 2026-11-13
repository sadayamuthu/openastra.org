import { Eyebrow } from '../components/ui'

export default function Patents() {
  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center text-center gap-3">
      <Eyebrow>Intellectual property</Eyebrow>
      <h1 className="font-serif text-6xl">Patents</h1>
      <p className="font-serif text-2xl text-rust">Coming soon.</p>
      <p className="text-ink-muted max-w-md">This page will list each application as it's published.</p>
    </div>
  )
}
