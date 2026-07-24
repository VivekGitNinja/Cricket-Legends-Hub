import { useApp } from '../../context/AppContext'

export default function ScrollProgress() {
  const { scrollProgress } = useApp()
  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-amber-300 transition-[width] duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
