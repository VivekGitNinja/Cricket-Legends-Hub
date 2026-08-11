import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * 3D tilt wrapper — rotates the card toward the cursor with spring physics
 * and paints a glare highlight that follows the pointer. Pure transforms,
 * so it respects prefers-reduced-motion via the global CSS override.
 */
export default function TiltCard({ children, className, maxTilt = 9, glare = true, ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 18,
    mass: 0.6,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 220,
    damping: 18,
    mass: 0.6,
  })

  const glareX = useTransform(x, [-0.5, 0.5], ['20%', '80%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['20%', '80%'])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.14), transparent 65%)`

  const onMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={className}
      {...props}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-2xl)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  )
}
