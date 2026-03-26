import Hero from '../components/Hero';
import FeaturedLegends from '../components/FeaturedLegends';
import StatCard from '../components/StatCard';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState({
    players: 0,
    teams: 0,
    matches: 0,
  });

  useEffect(() => {
    setStats({ players: 156, teams: 12, matches: 89 });
  }, []);

  return (
    <>
      <Hero />

      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon="" value={stats.players} label="Cricket Legends" />
            <StatCard icon="" value={stats.teams} label="National Teams" />
            <StatCard icon="" value={stats.matches} label="Featured Matches" />
          </div>
        </div>
      </section>

      <FeaturedLegends />

      <section id="matches" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">
              Historic Battles
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">
              Epic Cricket Encounters
            </h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">
              Relive the most thrilling matches that kept us on the edge of our seats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold text-lg">IND vs AUS</span>
                <span className="text-xs text-white/50">March 19, 2023</span>
              </div>
              <p className="text-white/70 text-sm mb-4">
                World Cup Final - A thrilling encounter that ended with India lifting the trophy.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-bold">India 240/10</span>
                <span className="text-white/50">vs</span>
                <span className="text-white/70">Australia 241/4</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold text-lg">ENG vs NZ</span>
                <span className="text-xs text-white/50">July 14, 2019</span>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Super Over thriller - The most dramatic World Cup final ever played.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-white/70">England 241</span>
                <span className="text-white/50">vs</span>
                <span className="text-white/70">New Zealand 241</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
