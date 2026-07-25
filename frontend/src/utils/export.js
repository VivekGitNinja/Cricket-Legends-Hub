/** Export & share helpers — pure client-side */

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  triggerDownload(blob, filename)
}

export function downloadCsv(filename, rows) {
  if (!rows?.length) return
  const headers = Object.keys(rows[0])
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  triggerDownload(blob, filename)
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function legendToExportRows(legend) {
  const t = legend.stats?.test || {}
  const o = legend.stats?.odi || {}
  const tw = legend.stats?.t20 || {}
  return [
    {
      name: legend.name,
      country: legend.country,
      role: legend.role,
      goatScore: legend.goatScore,
      testMatches: t.matches,
      testRuns: t.runs,
      testAvg: t.average,
      testHundreds: t.hundreds,
      testWickets: t.wickets,
      odiMatches: o.matches,
      odiRuns: o.runs,
      odiAvg: o.average,
      odiHundreds: o.hundreds,
      odiWickets: o.wickets,
      t20Matches: tw.matches,
      t20Runs: tw.runs,
      t20Avg: tw.average,
      t20Wickets: tw.wickets,
    },
  ]
}

export async function shareText({ title, text, url }) {
  if (navigator.share) {
    await navigator.share({ title, text, url })
    return 'shared'
  }
  await navigator.clipboard.writeText(url || text || title)
  return 'copied'
}

export function printPage() {
  window.print()
}
