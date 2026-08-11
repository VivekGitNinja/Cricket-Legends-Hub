/**
 * Pure-CSS 3D cricket ball scene — layered spheres, spinning seam, dashed
 * orbit rings, floating motion and a ground shadow. No images, no canvas.
 */
export default function CricketBall3D() {
  return (
    <div className="relative mx-auto h-72 w-72 md:h-80 md:w-80" aria-hidden="true">
      {/* ambient glow */}
      <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-3xl" />

      {/* orbit rings */}
      <div className="animate-orbit absolute -inset-7 rounded-full border border-dashed border-orange-400/25 md:-inset-9" />
      <div
        className="animate-orbit absolute -inset-7 rounded-full border border-dashed border-sky-400/15 md:-inset-9"
        style={{ animationDirection: 'reverse', animationDuration: '32s' }}
      />

      {/* floating ball */}
      <div className="animate-float absolute inset-5" style={{ transformStyle: 'preserve-3d' }}>
        <div className="relative h-full w-full">
          {/* sphere body */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 32% 28%, #f87171, #dc2626 55%, #7f1d1d 100%)',
              boxShadow:
                'inset -18px -16px 40px rgba(0, 0, 0, 0.55), inset 12px 14px 30px rgba(255, 255, 255, 0.22), 0 30px 70px rgba(249, 115, 22, 0.35)',
            }}
          />
          {/* spinning seam */}
          <div className="animate-spin-ball absolute inset-0">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(254,202,202,0.95)" strokeWidth="4.5" />
              <path d="M18 48 Q100 108 182 48" stroke="rgba(254,202,202,0.95)" strokeWidth="4.5" fill="none" />
              <path d="M18 152 Q100 92 182 152" stroke="rgba(254,202,202,0.95)" strokeWidth="4.5" fill="none" />
            </svg>
          </div>
          {/* specular highlight */}
          <div className="absolute left-[16%] top-[12%] h-[28%] w-[28%] rounded-full bg-white/25 blur-md" />
          <div className="absolute right-[18%] bottom-[16%] h-[12%] w-[12%] rounded-full bg-white/10 blur-sm" />
        </div>
      </div>

      {/* ground shadow */}
      <div className="absolute -bottom-8 left-1/2 h-5 w-2/3 -translate-x-1/2 rounded-[100%] bg-black/50 blur-lg" />
    </div>
  )
}
