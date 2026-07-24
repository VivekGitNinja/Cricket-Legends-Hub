import { useApp } from '../context/AppContext'
import { LEGENDS } from '../data/legends'
import Section from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import LegendCard from '../components/legends/LegendCard'
import { motion } from 'framer-motion'
import { stagger } from '../animations/variants'

export default function Favorites() {
  const { favorites } = useApp()
  const list = LEGENDS.filter((l) => favorites.includes(l.id))

  return (
    <Section
      eyebrow="Saved"
      title="Your favorites"
      description="Legends you star are stored locally in your browser."
    >
      {list.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Open any legend profile and tap the heart to save them here."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((legend, i) => (
            <LegendCard key={legend.id} legend={legend} index={i} />
          ))}
        </motion.div>
      )}
    </Section>
  )
}
