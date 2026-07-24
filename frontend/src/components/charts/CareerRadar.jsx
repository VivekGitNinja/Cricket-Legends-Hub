import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { computeGoatBreakdown } from '../../utils/goat'

export default function CareerRadar({ player }) {
  const { parts } = computeGoatBreakdown(player)
  const data = [
    { skill: 'Test Bat', value: Math.round((parts.testRuns + parts.testAvg) / 2) },
    { skill: 'ODI Bat', value: Math.round((parts.odiRuns + parts.odiAvg) / 2) },
    { skill: 'Bowling', value: Math.round(parts.wickets) },
    { skill: 'Longevity', value: Math.round(parts.longevity) },
    { skill: 'Peak', value: Math.round(parts.peak) },
    { skill: 'Impact', value: Math.round(parts.impact) },
  ]

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148,163,184,0.25)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={player.name}
            dataKey="value"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.35}
          />
          <Tooltip
            contentStyle={{
              background: '#0b1020',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
