// Rough heights in rows: a category heading is taller than a framework row.
const HEADING = 1.5

const height = (groups) => groups.reduce((n, g) => n + HEADING + g.frameworks.length, 0)

// Where to split the categories so both columns end up about as tall, keeping
// the reading order I → X down the left column, then down the right.
export function splitIndex(groups, asideHeight = 0) {
  let best = 1
  let bestDiff = Infinity
  for (let k = 1; k < groups.length; k++) {
    const diff = Math.abs(height(groups.slice(0, k)) - (height(groups.slice(k)) + asideHeight))
    if (diff < bestDiff) {
      best = k
      bestDiff = diff
    }
  }
  return best
}
