import { SITE } from '../config/site'
import { LEGENDS, MATCHES } from '../data/legends'

const API = SITE.apiUrl

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)
  try {
    const res = await fetch(`${API}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timeout)
  }
}

/** Live API with curated offline fallback */
export const api = {
  async getPlayers() {
    try {
      const data = await request('/players')
      if (data?.players?.length) return { source: 'api', players: data.players }
    } catch {
      /* fall through */
    }
    return { source: 'local', players: LEGENDS }
  },

  async getPlayer(id) {
    const data = await request(`/players/${id}`)
    return data?.player || null
  },

  async searchPlayers(query) {
    if (!query || !String(query).trim()) return { players: [] }
    const data = await request(`/players/search?query=${encodeURIComponent(query)}`)
    return data?.players || []
  },

  async searchPlayersLocal(query, limit = 30) {
    const q = String(query || '').trim().toLowerCase()
    if (!q) return []
    const source = await this.getPlayers()
    return (source.players || [])
      .filter((p) =>
        [p.name, p.fullName, p.nickName, p.country, (p.teams || []).join(' '), p.role]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      )
      .slice(0, limit)
  },

  async getTeams() {
    try {
      const data = await request('/teams')
      if (data?.teams?.length) return { source: 'api', teams: data.teams }
    } catch {
      /* fall through */
    }
    return { source: 'local', teams: [] }
  },

  async getMatches() {
    try {
      const data = await request('/matches?limit=50')
      if (data?.matches?.length) return { source: 'api', matches: data.matches }
    } catch {
      /* fall through */
    }
    return { source: 'local', matches: MATCHES }
  },

  async getLiveMatches() {
    const data = await request('/matches/live')
    return data?.matches || []
  },

  async getUpcomingMatches() {
    const data = await request('/matches/upcoming')
    return data?.matches || []
  },

  async getMatchLive(id) {
    const data = await request(`/matches/${id}/live`)
    return data?.match || null
  },

  /**
   * Subscribe to real-time live score pushes (Server-Sent Events).
   * Returns an unsubscribe function. Falls back to null if SSE is unavailable.
   */
  subscribeLive(onUpdate) {
    if (typeof EventSource === 'undefined') return null
    let es
    try {
      es = new EventSource(`${API}/live/stream`)
    } catch {
      return null
    }
    es.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'update' || data.type === 'snapshot') {
          onUpdate(data.matches || [], data)
        }
      } catch {
        /* ignore malformed frames */
      }
    })
    es.onerror = () => {
      /* the caller's fallback polling takes over */
    }
    return () => es.close()
  },

  async getNews() {
    const data = await request('/news')
    return data?.news || []
  },

  async getStreams() {
    const data = await request('/streams')
    return data?.streams || []
  },

  async getRecords() {
    const data = await request('/records')
    return data?.records || []
  },

  async getQuizQuestions() {
    const data = await request('/quiz/questions')
    return data?.questions || []
  },

  async getLeaderboard() {
    const data = await request('/quiz/leaderboard')
    return data?.attempts || []
  },

  async submitQuiz(token, payload) {
    return request('/quiz/attempt', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
  },

  async saveDreamTeam(token, dreamTeamLegends) {
    return request('/auth/dream-team', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ dreamTeamLegends }),
    })
  },

  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async register(name, email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  },

  async profile(token) {
    return request('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async updateFavorites(token, favoriteLegends) {
    return request('/auth/favorites', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ favoriteLegends }),
    })
  },
}

/** Map a backend match document to the frontend match card shape. */
export function normalizeApiMatch(m) {
  if (!m) return null
  if (m.teamA && m.scoreA) return m

  const t1 = m.team1?.name || m.teamA || 'Team A'
  const t2 = m.team2?.name || m.teamB || 'Team B'
  const s1 = m.scores?.[0]
  const s2 = m.scores?.[1]
  const scoreA = s1 ? `${s1.runs}/${s1.wickets}` : '—'
  const scoreB = s2 ? `${s2.runs}/${s2.wickets}` : '—'
  const winner = m.result?.winner?.name
  const margin = m.result?.margin ? `${m.result.margin} ${m.result.marginType || ''}`.trim() : ''
  const result = winner ? `${winner} won by ${margin}` : m.status || '—'
  const date = m.date ? new Date(m.date) : null

  return {
    id: m._id || `${t1}-vs-${t2}-${date?.getTime() || Math.random()}`,
    teamA: t1,
    teamB: t2,
    title: m.series || `${t1} vs ${t2}`,
    format: m.format || 'T20',
    scoreA,
    scoreB,
    highlight: result,
    venue: m.venue?.name || m.venue?.city || 'TBD',
    status: m.status || 'Scheduled',
    result,
    year: date?.getFullYear() || '—',
    date: m.date,
    liveScore: m.liveScore || null,
  }
}

export function normalizeApiPlayer(p) {
  if (!p) return null
  if (p.id && p.goatScore) return p
  return {
    id: p.id || p._id || String(p.name || '').toLowerCase().replace(/\s+/g, '-'),
    name: p.name,
    fullName: p.fullName || p.name,
    nickName: p.nickName || '',
    country: p.country,
    role: p.role,
    battingStyle: p.battingStyle,
    bowlingStyle: p.bowlingStyle,
    image: p.imageUrl || p.image,
    rating: p.rating || 85,
    goatScore: p.goatScore || p.rating || 80,
    hallOfFameRank: p.hallOfFameRank || 99,
    isLegend: p.isLegend !== false,
    bio: p.bio || '',
    tags: p.tags || p.achievements?.slice(0, 3) || [],
    stats: p.stats || {},
    awards: p.awards || p.achievements || [],
    milestones: p.milestones || [],
    greatestInnings: p.greatestInnings || [],
    era: p.era || p.playingFrom || '',
  }
}
