import Countdown from './Countdown'
import { deliveryCopy, eventStatus, videoFor } from '../lib/events'

export default function EventMedia({ event, now }) {
  const { kind, embed } = videoFor(event, now)
  const live = eventStatus(event, now) === 'live'

  if (kind === 'countdown') {
    return (
      <Countdown event={event} now={now} label={deliveryCopy(event).startsIn} />
    )
  }

  if (embed) {
    return (
      <div className="relative aspect-video bg-ink rounded-sm overflow-hidden">
        {live && (
          <span className="absolute top-3 left-3 z-10 bg-rust text-paper text-[11px] font-medium tracking-[0.14em] px-2 py-1 rounded-sm">
            <span aria-hidden="true">●</span> {deliveryCopy(event).badgeShort}
          </span>
        )}
        <iframe
          title={event.title}
          src={embed}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  return (
    <div className="border border-dashed border-ink/30 rounded-sm aspect-video flex items-center justify-center text-center p-6">
      <p className="font-serif text-2xl text-rust">{live ? 'Stream link coming soon' : 'Recording coming soon'}</p>
    </div>
  )
}
