import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function StatsBars({ playerA, playerB }) {
  const data = [
    {
      metric: 'Test Runs',
      [playerA.name]: playerA.stats?.test?.runs || 0,
      [playerB.name]: playerB.stats?.test?.runs || 0,
    },
    {
      metric: 'ODI Runs',
      [playerA.name]: playerA.stats?.odi?.runs || 0,
      [playerB.name]: playerB.stats?.odi?.runs || 0,
    },
    {
      metric: 'Test Avg',
      [playerA.name]: playerA.stats?.test?.average || 0,
      [playerB.name]: playerB.stats?.test?.average || 0,
    },
    {
      metric: 'ODI Avg',
      [playerA.name]: playerA.stats?.odi?.average || 0,
      [playerB.name]: playerB.stats?.odi?.average || 0,
    },
    {
      metric: 'Wickets',
      [playerA.name]:
        (playerA.stats?.test?.wickets || 0) + (playerA.stats?.odi?.wickets || 0),
      [playerB.name]:
        (playerB.stats?.test?.wickets || 0) + (playerB.stats?.odi?.wickets || 0),
    },
  ]

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: '#0b1020',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#f8fafc',
            }}
          />
          <Legend />
          <Bar dataKey={playerA.name} fill="#f97316" radius={[6, 6, 0, 0]} />
          <Bar dataKey={playerB.name} fill="#38bdf8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
