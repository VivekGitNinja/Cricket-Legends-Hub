import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Cricket Legends Hub</h3>
        <p className="text-white/60 text-sm">Your ultimate destination for cricket statistics and match information.</p>
        <p className="text-white/40 text-xs mt-4">&copy; {currentYear} Cricket Legends Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
