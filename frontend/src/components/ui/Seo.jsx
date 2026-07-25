import { useEffect } from 'react'
import { SITE } from '../../config/site'

/** Lightweight document head manager (no extra dependency) */
export default function Seo({
  title,
  description = SITE.description,
  path = '',
  type = 'website',
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`
    document.title = fullTitle

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)[1])
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)[1])
        }
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:type"]', 'content', type)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', description)

    const url = `${SITE.url}${path}`
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, path, type])

  return null
}
