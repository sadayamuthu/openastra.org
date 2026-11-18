function countdownParts(event, now) {
  const ms = Math.max(0, new Date(event.start).getTime() - now.getTime())
  const mins = Math.floor(ms / 60000)
  return [
    ['days', Math.floor(mins / 1440)],
    ['hrs', Math.floor((mins % 1440) / 60)],
    ['min', mins % 60],
  ]
}

export default function Countdown({ event, now, className = '', label = 'Starts in' }) {
  return (
    <div data-testid="countdown" className={`border border-rule bg-card rounded-sm p-6 text-center ${className}`}>
      <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-ink-muted">{label}</p>
      <div className="flex justify-center gap-3 mt-4">
        {countdownParts(event, now).map(([unit, value]) => (
          <div key={unit} className="border border-rule bg-paper rounded-sm px-4 py-3 min-w-[4.5rem]">
            <p className="font-serif text-3xl">{value}</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">{unit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
