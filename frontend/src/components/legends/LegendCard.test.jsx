import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../../context/AppContext'
import { AuthProvider } from '../../context/AuthContext'
import { ThemeProvider } from '../../context/ThemeContext'
import LegendCard from './LegendCard'

const legend = {
  id: 'test-player',
  name: 'Test Player',
  country: 'India',
  role: 'Batsman',
  image: null,
  goatScore: 91.5,
  tags: ['GOAT'],
  stats: {
    test: { runs: 10000 },
    odi: { runs: 12000 },
  },
}

function renderCard() {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <MemoryRouter>
            <LegendCard legend={legend} />
          </MemoryRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

describe('LegendCard', () => {
  it('renders the legend name and country', () => {
    renderCard()
    expect(screen.getByText('Test Player')).toBeInTheDocument()
    expect(screen.getByText('India · Batsman')).toBeInTheDocument()
  })

  it('renders formatted stats and GOAT score', () => {
    renderCard()
    expect(screen.getByText('10,000')).toBeInTheDocument()
    expect(screen.getByText('12,000')).toBeInTheDocument()
    expect(screen.getByText('91.5')).toBeInTheDocument()
    expect(screen.getByText('Test Runs')).toBeInTheDocument()
  })

  it('links to the legend detail page', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /view profile/i })
    expect(link).toHaveAttribute('href', '/legends/test-player')
  })
})
