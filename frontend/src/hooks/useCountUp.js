import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useCountUp(target = 0, duration = 1200, active = true) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    if (reduced) {
      setValue(target)
      return undefined
    }

    let frame
    const start = performance.now()
    const from = 0

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, active, reduced])

  return value
}
