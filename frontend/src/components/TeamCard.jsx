import React from 'react';

function TeamCard({ team }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
      <h3 className="text-xl font-bold text-white mb-2">{team.name || 'TBA'}</h3>
      <p className="text-white/70 text-sm mb-1">Coach: {team.coach || 'N/A'}</p>
      <p className="text-white/70 text-sm mb-1">Rank: {team.rank || 'N/A'}</p>
      <p className="text-white/50 text-xs">Players: {team.players?.length || 0}</p>
    </div>
  );
}

export default TeamCard;
