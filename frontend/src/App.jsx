import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import PlayerCard from './components/PlayerCard'
import TeamCard from './components/TeamCard'
import MatchCard from './components/MatchCard'
import Footer from './components/Footer'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/players" element={<PlayersList players={players} />} />
          <Route path="/teams" element={<TeamsList teams={teams} />} />
          <Route path="/matches" element={<MatchesList matches={matches} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function PlayersList({ players }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">All Players</h2>
      {players.length === 0 ? (
        <p className="text-white/60 text-center">No players found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map(p => <PlayerCard key={p._id} player={p} />)}
        </div>
      )}
    </div>
  )
}

function TeamsList({ teams }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">All Teams</h2>
      {teams.length === 0 ? (
        <p className="text-white/60 text-center">No teams found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(t => <TeamCard key={t._id} team={t} />)}
        </div>
      )}
    </div>
  )
}

function MatchesList({ matches }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">All Matches</h2>
      {matches.length === 0 ? (
        <p className="text-white/60 text-center">No matches found</p>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {matches.map(m => <MatchCard key={m._id} match={m} />)}
        </div>
      )}
    </div>
  )
}

export default App
