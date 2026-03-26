import PlayerCard from './PlayerCard';
import TeamCard from './TeamCard';

const featuredPlayers = [
  { _id: '1', name: 'Sachin Tendulkar', country: 'India', role: 'Batsman', battingStyle: 'RHB', bowlingStyle: 'OB' },
  { _id: '2', name: 'Virat Kohli', country: 'India', role: 'Batsman', battingStyle: 'RHB', bowlingStyle: 'RM' },
  { _id: '3', name: 'Shane Warne', country: 'Australia', role: 'Bowler', battingStyle: 'RHB', bowlingStyle: 'LB' },
  { _id: '4', name: 'Kumar Sangakkara', country: 'Sri Lanka', role: 'Wicket-keeper', battingStyle: 'LHB', bowlingStyle: '' },
  { _id: '5', name: 'Ben Stokes', country: 'England', role: 'All-rounder', battingStyle: 'LHB', bowlingStyle: 'RMF' },
  { _id: '6', name: 'AB de Villiers', country: 'South Africa', role: 'Batsman', battingStyle: 'RHB', bowlingStyle: 'RM' },
];

const featuredTeams = [
  { _id: '1', name: 'India', shortName: 'IND', ranking: 1, wins: 156 },
  { _id: '2', name: 'Australia', shortName: 'AUS', ranking: 2, wins: 189 },
  { _id: '3', name: 'England', shortName: 'ENG', ranking: 3, wins: 142 },
];

export default function FeaturedLegends() {
  return (
    <section id="players" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">
            Discover the Icons
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Featured Cricket Legends
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Meet the players who redefined cricket with their extraordinary skills and memorable performances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuredPlayers.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </div>

        <div className="mt-16">
          <div className="text-center mb-12">
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">
              Top Contenders
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">
              Elite Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTeams.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
