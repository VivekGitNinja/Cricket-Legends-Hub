import Footer from '../components/Footer';

export default function About() {
  return (
    <>  
      <section className="min-h-screen py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-orange-400 bg-orange-500/10 rounded-full border border-orange-500/20">
              About Us
            </span>
            <h1 className="text-5xl font-bold text-white mb-6">
              Celebrating Cricket's Rich Heritage
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Cricket Legends Hub is a tribute to the greatest players, memorable matches,
              and unforgettable moments that have shaped the sport of cricket.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-white/70">
                To preserve and celebrate the legacy of cricket's greatest legends,
                providing fans with a comprehensive platform to explore player profiles,
                match statistics, and the history of this beautiful game.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">What We Offer</h3>
              <ul className="text-white/70 space-y-2">
                <li>• Detailed player profiles and statistics</li>
                <li>• Match reports and scorecards</li>
                <li>• Team rankings and performance data</li>
                <li>• Historical records and milestones</li>
                <li>• Interactive stats and visualizations</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-8 border border-orange-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Join the Community</h3>
            <p className="text-white/70 mb-4">
              Be a part of our growing community of cricket enthusiasts. Share your
              favorite moments, discuss legendary performances, and stay updated with
              the latest news from the cricket world.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/" className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors">
                Explore Players
              </a>
              <a href="/" className="px-6 py-2 bg-white/10 text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
