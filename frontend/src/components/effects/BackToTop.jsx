import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import Button from '../ui/Button'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <Button
      size="icon"
      variant="secondary"
      className="fixed bottom-6 right-6 z-40 shadow-[var(--shadow-md)]"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
