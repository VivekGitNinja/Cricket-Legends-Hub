import React from 'react';

function MatchCard({ match }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-semibold">{match.teamA?.name || 'TBA'} vs {match.teamB?.name || 'TBA'}</span>
        <span className="text-white/60 text-sm">{match.venue}</span>
      </div>
      <p className="text-white/70 text-sm">{match.format} - {match.status || 'Upcoming'}</p>
    </div>
  );
}

export default MatchCard;
