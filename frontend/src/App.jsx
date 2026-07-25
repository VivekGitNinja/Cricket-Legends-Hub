import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import MainLayout from './components/layout/MainLayout'
import Skeleton from './components/ui/Skeleton'

const Home = lazy(() => import('./pages/Home'))
const Legends = lazy(() => import('./pages/Legends'))
const LegendDetail = lazy(() => import('./pages/LegendDetail'))
const Compare = lazy(() => import('./pages/Compare'))
const HallOfFame = lazy(() => import('./pages/HallOfFame'))
const Records = lazy(() => import('./pages/Records'))
const Matches = lazy(() => import('./pages/Matches'))
const DreamTeam = lazy(() => import('./pages/DreamTeam'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Timeline = lazy(() => import('./pages/Timeline'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Countries = lazy(() => import('./pages/Countries'))
const GoatCalculator = lazy(() => import('./pages/GoatCalculator'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="mx-auto max-w-[var(--container)] space-y-4 px-4 py-16">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-full max-w-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="legends" element={<Legends />} />
                <Route path="legends/:id" element={<LegendDetail />} />
                <Route path="players" element={<Navigate to="/legends" replace />} />
                <Route path="compare" element={<Compare />} />
                <Route path="hall-of-fame" element={<HallOfFame />} />
                <Route path="records" element={<Records />} />
                <Route path="matches" element={<Matches />} />
                <Route path="teams" element={<Navigate to="/legends" replace />} />
                <Route path="dream-team" element={<DreamTeam />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="timeline" element={<Timeline />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="countries" element={<Countries />} />
                <Route path="goat" element={<GoatCalculator />} />
                <Route path="about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
