import { eventStatus, videoFor } from '../lib/events'

function countdownParts(event, now) {
  const ms = Math.max(0, new Date(event.start).getTime() - now.getTime())
  const mins = Math.floor(ms / 60000)
  return [
    ['days', Math.floor(mins / 1440)],
    ['hrs', Math.floor((mins % 1440) / 60)],
    ['min', mins % 60],
  ]
}

export default function EventMedia({ event, now }) {
  const { kind, embed } = videoFor(event, now)
  const live = eventStatus(event, now) === 'live'

  if (kind === 'countdown') {
    return (
      <div data-testid="countdown" className="border border-rule bg-card rounded-sm p-6 text-center">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted">Starts in</p>
        <div className="flex justify-center gap-3 mt-4">
          {countdownParts(event, now).map(([label, value]) => (
            <div key={label} className="border border-rule bg-paper rounded-sm px-4 py-3 min-w-[4.5rem]">
              <p className="font-serif text-3xl">{value}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (embed) {
    return (
      <div className="relative aspect-video bg-ink rounded-sm overflow-hidden">
        {live && (
          <span className="absolute top-3 left-3 z-10 bg-rust text-paper text-[11px] font-medium tracking-[0.14em] px-2 py-1 rounded-sm">
            ● LIVE
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
