export const SITE = {
  name: 'Cricket Legends Hub',
  tagline: 'The Ultimate Cricket Legends Experience',
  description:
    'Explore cricket’s greatest legends with career stats, head-to-head comparisons, hall of fame rankings, dream team builder, interactive timelines, and premium match archives.',
  url: 'https://vivekgitninja.github.io/Cricket-Legends-Hub',
  github: 'https://github.com/VivekGitNinja/Cricket-Legends-Hub',
  author: {
    name: 'Vivek Kumar Verma',
    github: 'https://github.com/VivekGitNinja',
    email: 'vkumarverma670@gmail.com',
  },
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  social: {
    twitter: '@VivekGitNinja',
  },
  keywords: [
    'cricket legends',
    'cricket statistics',
    'player comparison',
    'hall of fame',
    'dream team',
    'cricket records',
    'GOAT calculator',
    'IPL legends',
    'career timeline',
  ],
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/legends', label: 'Legends' },
  { to: '/compare', label: 'Compare' },
  { to: '/hall-of-fame', label: 'Hall of Fame' },
  { to: '/goat', label: 'GOAT Lab' },
  { to: '/countries', label: 'Countries' },
  { to: '/records', label: 'Records' },
  { to: '/matches', label: 'Matches' },
  { to: '/dream-team', label: 'Dream Team' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/about', label: 'About' },
]

export const SHORTCUTS = [
  { keys: ['⌘', 'K'], label: 'Command palette' },
  { keys: ['/'], label: 'Focus search' },
  { keys: ['G', 'H'], label: 'Go home' },
  { keys: ['G', 'L'], label: 'Go legends' },
  { keys: ['G', 'C'], label: 'Go compare' },
  { keys: ['T'], label: 'Toggle theme' },
]
