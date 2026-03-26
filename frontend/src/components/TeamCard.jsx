function TeamCard({ team }) {
  const shortName = team.shortName || team.country || ''
  const ranking = team.ranking || team.rank || ''
  const wins = team.wins || ''

  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/50 transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
          {shortName || team.name?.charAt(0) || 'T'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
            {team.name || 'TBA'}
          </h3>
          <p className="text-white/60 text-sm">
            {team.type || 'International'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ranking && (
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-orange-400 font-bold text-lg">#{ranking}</div>
            <div className="text-white/50 text-xs">World Rank</div>
          </div>
        )}
        {wins && (
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-green-400 font-bold text-lg">{wins}</div>
            <div className="text-white/50 text-xs">Wins</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamCard
