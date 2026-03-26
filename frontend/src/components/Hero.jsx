export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-red-900/20 to-blue-900/20" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1920')] bg-cover bg-center opacity-10" />
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-orange-400 bg-orange-500/10 rounded-full border border-orange-500/20">
          Welcome to Cricket Legends Hub
        </span>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Celebrating Cricket's
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Greatest Legends
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto">
          Dive into the world of cricket legends, their epic matches, incredible records,
          and the moments that defined the sport. Explore players, teams, and the
          history that makes cricket the gentleman's game.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#players"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1"
          >
            Explore Players
          </a>
          <a
            href="#matches"
            className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
          >
            View Matches
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  );
}
