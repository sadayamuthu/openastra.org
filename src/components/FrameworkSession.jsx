import { Link } from 'react-router-dom'
import { events } from '../data/events'
import { deliveryCopy, eventStatus, formatWhen, sessionForFramework, videoFor } from '../lib/events'
import { useNow } from '../lib/useNow'

export default function FrameworkSession({ slug }) {
  const now = useNow()
  const session = sessionForFramework(events, slug, now)
  if (!session) return null

  const status = eventStatus(session, now)
  let text
  let cta = 'Details →'
  if (status === 'live') {
    text = <span className="font-medium"><span aria-hidden="true">● </span>{deliveryCopy(session).badge}</span>
    cta = 'Watch →'
  } else if (status === 'past') {
    if (videoFor(session, now).kind === 'none') {
      text = 'Framework of the week · Recording coming soon'
    } else {
      text = 'Framework of the week · Watch the session'
      cta = 'Watch →'
    }
  } else {
    text = `Framework of the week · Premieres ${formatWhen(session)}`
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border border-dashed border-rust/60 rounded-sm px-3 py-2 text-sm">
      <span className="text-[10px] font-medium tracking-[0.14em] text-rust">WEBCAST</span>
      <span className="text-ink">{text}</span>
      <Link to={`/events/${session.slug}`} className="ml-auto text-rust hover:underline">{cta}</Link>
    </div>
  )
}
