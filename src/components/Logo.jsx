// OpenAstra "Open Orbit" mark (A1). Geometry source of truth: brand/build.mjs.
const RING = 'M83.48 44.10 A34 34 0 1 1 55.90 16.52'
const STAR = 'M77 10 Q79 21 90 23 Q79 25 77 36 Q75 25 64 23 Q75 21 77 10Z'
// Small cut (≤40px): heavier ring, larger star so it survives at nav/footer sizes.
const STAR_SMALL = 'M78 6 Q81 19 95 22 Q81 25 78 38 Q75 25 61 22 Q75 19 78 6Z'

export function Mark({ size = 28, intro = false, className = '' }) {
  const small = size <= 40
  const origin = { transformOrigin: small ? '78px 22px' : '77px 23px' }
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`oa-mark${intro ? ' oa-mark--intro' : ''} ${className}`}
    >
      <path
        className="oa-ring"
        d={RING}
        pathLength="100"
        fill="none"
        stroke="currentColor"
        strokeWidth={small ? 13 : 10}
        strokeLinecap="round"
      />
      <g className="oa-star-pop" style={origin}>
        <path className="oa-star" d={small ? STAR_SMALL : STAR} style={origin} />
      </g>
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`font-serif tracking-tight ${className}`}>
      Open<em>Astra</em>
    </span>
  )
}

export default function Logo({ size = 28, intro = false, className = '', wordmarkClassName = 'text-xl' }) {
  return (
    <span className={`oa-logo inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={size} intro={intro} />
      <Wordmark className={wordmarkClassName} />
    </span>
  )
}
