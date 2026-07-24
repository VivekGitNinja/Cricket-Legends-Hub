/**
 * GOAT Calculator — weighted multi-format excellence model.
 * Transparent, explainable scoring for comparison UI.
 */

const WEIGHTS = {
  testRuns: 0.12,
  testAvg: 0.16,
  testHundreds: 0.08,
  odiRuns: 0.1,
  odiAvg: 0.12,
  odiHundreds: 0.08,
  wickets: 0.14,
  longevity: 0.08,
  peak: 0.07,
  impact: 0.05,
}

function scoreBand(value, min, max) {
  if (!value || value <= 0) return 0
  const t = (value - min) / (max - min)
  return Math.max(0, Math.min(100, t * 100))
}

export function computeGoatBreakdown(player) {
  const t = player.stats?.test || {}
  const o = player.stats?.odi || {}
  const tw = player.stats?.t20 || {}

  const totalMatches = (t.matches || 0) + (o.matches || 0) + (tw.matches || 0)
  const totalWickets = (t.wickets || 0) + (o.wickets || 0) + (tw.wickets || 0)
  const totalHundreds = (t.hundreds || 0) + (o.hundreds || 0) + (tw.hundreds || 0)

  const parts = {
    testRuns: scoreBand(t.runs || 0, 0, 16000),
    testAvg: scoreBand(t.average || 0, 20, 100),
    testHundreds: scoreBand(t.hundreds || 0, 0, 51),
    odiRuns: scoreBand(o.runs || 0, 0, 18500),
    odiAvg: scoreBand(o.average || 0, 20, 60),
    odiHundreds: scoreBand(o.hundreds || 0, 0, 51),
    wickets: scoreBand(totalWickets, 0, 800),
    longevity: scoreBand(totalMatches, 0, 650),
    peak: scoreBand(player.rating || 0, 70, 100),
    impact: scoreBand((player.awards?.length || 0) + totalHundreds * 0.15, 0, 20),
  }

  let total = 0
  const weighted = {}
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const contribution = (parts[key] || 0) * weight
    weighted[key] = Number(contribution.toFixed(2))
    total += contribution
  }

  // Prefer curated goatScore when present, blend for transparency
  const modelScore = Number(total.toFixed(1))
  const curated = player.goatScore
  const finalScore = curated
    ? Number((modelScore * 0.35 + curated * 0.65).toFixed(1))
    : modelScore

  return {
    score: finalScore,
    modelScore,
    curated: curated ?? null,
    parts,
    weighted,
    weights: WEIGHTS,
  }
}

export function comparePlayers(a, b) {
  const left = computeGoatBreakdown(a)
  const right = computeGoatBreakdown(b)

  const metrics = [
    { key: 'testRuns', label: 'Test Runs', a: a.stats?.test?.runs || 0, b: b.stats?.test?.runs || 0 },
    { key: 'testAvg', label: 'Test Average', a: a.stats?.test?.average || 0, b: b.stats?.test?.average || 0 },
    { key: 'odiRuns', label: 'ODI Runs', a: a.stats?.odi?.runs || 0, b: b.stats?.odi?.runs || 0 },
    { key: 'odiAvg', label: 'ODI Average', a: a.stats?.odi?.average || 0, b: b.stats?.odi?.average || 0 },
    { key: 'wickets', label: 'Total Wickets', a: (a.stats?.test?.wickets || 0) + (a.stats?.odi?.wickets || 0), b: (b.stats?.test?.wickets || 0) + (b.stats?.odi?.wickets || 0) },
    { key: 'goat', label: 'GOAT Score', a: left.score, b: right.score },
  ]

  return { left, right, metrics, winner: left.score >= right.score ? 'a' : 'b' }
}

export function rankLegends(list) {
  return [...list]
    .map((p) => ({ ...p, _goat: computeGoatBreakdown(p).score }))
    .sort((a, b) => b._goat - a._goat || a.hallOfFameRank - b.hallOfFameRank)
}
