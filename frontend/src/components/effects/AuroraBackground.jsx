export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[var(--bg-base)]" />
      <div className="absolute -left-24 top-0 h-[42rem] w-[42rem] rounded-full bg-orange-500/20 blur-[120px] animate-aurora" />
      <div className="absolute -right-24 top-32 h-[36rem] w-[36rem] rounded-full bg-sky-500/15 blur-[120px] animate-aurora-delayed" />
      <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-[100px] animate-aurora" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
    </div>
  )
}
