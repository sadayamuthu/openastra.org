import { useEffect } from 'react'
import { Button, Eyebrow } from '../components/ui'
import { MotionMark } from '../components/Logo'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not found · OpenAstra'
  }, [])

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 py-24 flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">
      <MotionMark variant="pulse" size={160} className="w-28 h-28 sm:w-40 sm:h-40" />
      <div className="flex flex-col items-start gap-4">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-serif text-5xl">Not found</h1>
        <p className="text-ink-muted">This page has drifted out of orbit. It isn't in the index.</p>
        <Button to="/frameworks" variant="solid">Browse frameworks</Button>
      </div>
    </div>
  )
}
