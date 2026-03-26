export default function PlayerCard({ player }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-orange-500/50 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
          {player?.name?.charAt(0) || '?'}
        </div>
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80">
          {player?.role}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition">
        {player?.name}
      </h3>
      <p className="text-white/70 text-sm mb-3">
        {player?.country}
      </p>
      <div className="flex gap-3 text-xs text-white/60">
        <span>Bat: {player?.battingStyle || 'RHB'}</span>
        <span>Bowl: {player?.bowlingStyle || 'RAM'}</span>
      </div>
    </div>
  );
}
