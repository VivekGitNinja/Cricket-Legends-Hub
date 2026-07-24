import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { pageTransition } from '../../animations/variants'
import AuroraBackground from '../effects/AuroraBackground'
import BackToTop from '../effects/BackToTop'
import ScrollProgress from '../effects/ScrollProgress'
import CommandPalette from '../search/CommandPalette'
import Footer from './Footer'
import Navbar from './Navbar'
import { cn } from '../../utils/cn'

export default function MainLayout() {
  const location = useLocation()
  const { readingMode } = useApp()

  return (
    <div className={cn('flex min-h-screen flex-col', readingMode && 'reading-mode')}>
      <AuroraBackground />
      <ScrollProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette />
    </div>
  )
}
