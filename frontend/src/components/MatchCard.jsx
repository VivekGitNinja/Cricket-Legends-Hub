function MatchCard({ match }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-all">
      <div className="flex justify-between items-center mb-4">
        <span className="text-white font-semibold text-lg">
          {match.teamA?.name || 'TBA'} vs {match.teamB?.name || 'TBA'}
        </span>
        <span className="text-xs text-white/50 px-3 py-1 bg-white/10 rounded-full">
          {match.format || 'T20'}
        </span>
      </div>
      <div className="flex justify-between items-center mb-3 text-white/70 text-sm">
        <span>{match.teamA?.name || 'Team A'}: {match.scoreA || 'Yet to bat'}</span>
        <span className="text-white/40">vs</span>
        <span>{match.teamB?.name || 'Team B'}: {match.scoreB || 'Yet to bat'}</span>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
        <span className="text-white/50 text-sm">
          {match.venue || 'Venue TBD'}
        </span>
        <span className={`text-sm font-semibold ${match.status === 'completed' ? 'text-green-400' : match.status === 'live' ? 'text-red-400' : 'text-white/60'}`}>
          {match.status || 'Upcoming'}
        </span>
      </div>
    </div>
  )
}

export default MatchCard
