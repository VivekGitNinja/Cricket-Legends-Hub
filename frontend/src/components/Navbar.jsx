import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-orange-400 transition-colors">
          Cricket Legends Hub
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/players" className="text-white/70 hover:text-white transition-colors"> 
              Players
            </Link>
          </li>
          <li>
            <Link to="/teams" className="text-white/70 hover:text-white transition-colors">
              Teams
            </Link>
          </li>
          <li>
            <Link to="/matches" className="text-white/70 hover:text-white transition-colors">
              Matches
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-white/70 hover:text-white transition-colors">
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
