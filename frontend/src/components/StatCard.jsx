export default function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:border-orange-500/30 transition-all group">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors">
        {value}
      </div>
      <div className="text-sm text-white/60 uppercase tracking-wide">{label}</div>
    </div>
  );
}
