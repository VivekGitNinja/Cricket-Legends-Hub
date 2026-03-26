import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import PlayerCard from './components/PlayerCard'
import TeamCard from './components/TeamCard'
import MatchCard from './components/MatchCard'
import Footer from './components/Footer'

function App() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])

  useEffect(() => {
    setPlayers([
      { _id: '1', name: 'Virat Kohli', role: 'Batsman', team: 'RCB', matches: 237, runs: 7263, avg: 37.25, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Virat_Kohli_during_India_vs_New_Zealand_2019.jpg/440px-Virat_Kohli_during_India_vs_New_Zealand_2019.jpg' },
      { _id: '2', name: 'Rohit Sharma', role: 'Batsman', team: 'MI', matches: 243, runs: 6211, avg: 30.35, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Rohit_Sharma_fielding.jpg/440px-Rohit_Sharma_fielding.jpg' },
      { _id: '3', name: 'MS Dhoni', role: 'Wicket-Keeper', team: 'CSK', matches: 234, runs: 5082, avg: 38.09, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/M_S_Dhoni_at_the_ICC_Awards_in_2013_%28cropped%29.jpg/440px-M_S_Dhoni_at_the_ICC_Awards_in_2013_%28cropped%29.jpg' },
      { _id: '4', name: 'Jasprit Bumrah', role: 'Bowler', team: 'MI', matches: 120, wickets: 145, avg: 23.55, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Jasprit_Bumrah_at_IPL_2023_%28cropped%29.jpg/440px-Jasprit_Bumrah_at_IPL_2023_%28cropped%29.jpg' },
      { _id: '5', name: 'Ravindra Jadeja', role: 'All-Rounder', team: 'CSK', matches: 220, runs: 2502, wickets: 132, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Ravindra_Jadeja_in_2024.jpg/440px-Ravindra_Jadeja_in_2024.jpg' },
      { _id: '6', name: 'KL Rahul', role: 'Wicket-Keeper', team: 'LSG', matches: 132, runs: 4163, avg: 46.25, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/KL_Rahul_2017_%28cropped%29.jpg/440px-KL_Rahul_2017_%28cropped%29.jpg' }
    ])

    setTeams([
      { _id: '1', name: 'Mumbai Indians', short: 'MI', city: 'Mumbai', titles: 5, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Mumbai_Indians_Logo.svg/200px-Mumbai_Indians_Logo.svg.png' },
      { _id: '2', name: 'Chennai Super Kings', short: 'CSK', city: 'Chennai', titles: 5, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/200px-Chennai_Super_Kings_Logo.svg.png' },
      { _id: '3', name: 'Royal Challengers Bangalore', short: 'RCB', city: 'Bangalore', titles: 0, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Royal_Challengers_Bengaluru_Logo.svg/200px-Royal_Challengers_Bengaluru_Logo.svg.png' },
      { _id: '4', name: 'Kolkata Knight Riders', short: 'KKR', city: 'Kolkata', titles: 3, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Kolkata_Knight_Riders_Logo.svg/200px-Kolkata_Knight_Riders_Logo.svg.png' },
      { _id: '5', name: 'Delhi Capitals', short: 'DC', city: 'Delhi', titles: 0, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Delhi_Capitals_Logo.svg/200px-Delhi_Capitals_Logo.svg.png' },
      { _id: '6', name: 'Punjab Kings', short: 'PBKS', city: 'Mohali', titles: 0, logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Punjab_Kings_Logo.svg/200px-Punjab_Kings_Logo.svg.png' }
    ])

    setMatches([
      { _id: '1', team1: 'Mumbai Indians', team2: 'Chennai Super Kings', date: '2024-03-22', venue: 'Wankhede Stadium', result: 'CSK won by 6 wickets' },
      { _id: '2', team1: 'Royal Challengers Bangalore', team2: 'Kolkata Knight Riders', date: '2024-03-23', venue: 'M. Chinnaswamy Stadium', result: 'KKR won by 7 wickets' },
      { _id: '3', team1: 'Delhi Capitals', team2: 'Punjab Kings', date: '2024-03-24', venue: 'Arun Jaitley Stadium', result: 'PBKS won by 4 wickets' }
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home players={players} teams={teams} matches={matches} />} />
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
