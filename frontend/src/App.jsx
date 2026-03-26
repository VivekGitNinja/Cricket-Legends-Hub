import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function App() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])

  useEffect(() => {
    fetchPlayers()
    fetchTeams()
    fetchMatches()
  }, [])

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${API_URL}/players`)
      setPlayers(res.data.players || [])
    } catch (err) {
      console.error('Error fetching players:', err)
    }
  }

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${API_URL}/teams`)
      setTeams(res.data.teams || [])
    } catch (err) {
      console.error('Error fetching teams:', err)
    }
  }

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${API_URL}/matches`)
      setMatches(res.data.matches || [])
    } catch (err) {
      console.error('Error fetching matches:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-primary/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Cricket Legends Hub
            </h1>
            <div className="flex space-x-4">
              <Link to="/" className="text-white/80 hover:text-white transition">Home</Link>
              <Link to="/players" className="text-white/80 hover:text-white transition">Players</Link>
              <Link to="/teams" className="text-white/80 hover:text-white transition">Teams</Link>
              <Link to="/matches" className="text-white/80 hover:text-white transition">Matches</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<PlayersList players={players} />} />
          <Route path="/teams" element={<TeamsList teams={teams} />} />
          <Route path="/matches" element={<MatchesList matches={matches} />} />
        </Routes>
      </main>

      <footer className="bg-slate-800/50 py-6 text-center text-white/60 text-sm">
        Cricket Legends Hub - BTech Major Project
      </footer>
    </div>
  )
}

function Home() {
  return (
    <div className="py-16 text-center">
      <h2 className="text-4xl font-bold text-white mb-4">Welcome to Cricket Legends Hub</h2>
      <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
        Explore cricket players, teams, and matches with our comprehensive sports data platform.
        Built with React, Node.js, Express, and MongoDB.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <StatCard title="Players" value="150+" icon="🏏" />
        <StatCard title="Teams" value="12" icon="🏆" />
        <StatCard title="Matches" value="500+" icon="⚡" />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-white/60">{title}</p>
    </div>
  )
}

function PlayersList({ players }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Players</h2>
      {players.length === 0 ? (
        <p className="text-white/60">No players found</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {players.map(p => (
            <PlayerCard key={p._id} player={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function PlayerCard({ player }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white">{player.name}</h3>
      <p className="text-white/60 text-sm">{player.role} • {player.country}</p>
      <p className="text-white/70 text-xs mt-2">Bat: {player.battingStyle} | Bowl: {player.bowlingStyle}</p>
    </div>
  )
}

function TeamsList({ teams }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Teams</h2>
      {teams.length === 0 ? (
        <p className="text-white/60">No teams found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(t => (
            <TeamCard key={t._id} team={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function TeamCard({ team }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-lg font-bold text-white">{team.name}</h3>
      <p className="text-white/60 text-sm">{team.shortName} • {team.country}</p>
      <p className="text-white/70 text-xs mt-2">Type: {team.type}</p>
    </div>
  )
}

function MatchesList({ matches }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Matches</h2>
      {matches.length === 0 ? (
        <p className="text-white/60">No matches found</p>
      ) : (
        <div className="space-y-4">
          {matches.map(m => (
            <MatchCard key={m._id} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}

function MatchCard({ match }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-center">
        <span className="text-white font-semibold">{match.teamA?.name || 'TBD'} vs {match.teamB?.name || 'TBD'}</span>
        <span className="text-white/60 text-sm">{match.venue}</span>
      </div>
      <p className="text-white/70 text-sm mt-1">{match.format} • {match.status}</p>
    </div>
  )
}

export default App
