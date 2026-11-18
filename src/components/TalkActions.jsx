import { Button } from './ui'
import { icsHref } from '../lib/events'

// Register on Luma + Add to calendar (.ics download) for an upcoming talk.
// `children` are extra actions appended after the pair (e.g. "Details →").
export default function TalkActions({ event, className = '', children }) {
  return (
    <div className={`flex-wrap items-center gap-3 ${className}`} data-testid="talk-actions">
      {event.registerUrl && <Button href={event.registerUrl} variant="solid">Register on Luma</Button>}
      <a
        href={icsHref(event)}
        download={`${event.slug}.ics`}
        className="inline-flex items-center px-4 py-2 rounded-sm border border-ink text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
      >
        Add to calendar
      </a>
      {children}
    </div>
  )
}
