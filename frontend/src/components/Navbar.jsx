import React from 'react';

function Navbar() {
  return (
    <nav className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Cricket Legends Hub</h1>
        <ul className="flex space-x-6">
          <li><a href="#" className="text-white/70 hover:text-white transition-colors">Home</a></li>
          <li><a href="#" className="text-white/70 hover:text-white transition-colors">Matches</a></li>
          <li><a href="#" className="text-white/70 hover:text-white transition-colors">Teams</a></li>
          <li><a href="#" className="text-white/70 hover:text-white transition-colors">About</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
