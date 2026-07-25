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
      const data = await request('/matches')
      if (data?.matches?.length) return { source: 'api', matches: data.matches }
    } catch {
      /* fall through */
    }
    return { source: 'local', matches: MATCHES }
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
