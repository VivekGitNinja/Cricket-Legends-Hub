import '@testing-library/jest-dom/vitest'

// jsdom + Node's experimental global localStorage don't play well together
// (Node 26 requires --localstorage-file). Provide a stable in-memory mock so
// theme/favorites/auth storage behaves identically in every test environment.
const store = new Map()

const localStorageMock = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
  key: (index) => [...store.keys()][index] ?? null,
  get length() {
    return store.size
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
})

// jsdom has no matchMedia — provide a minimal no-op so theme detection works.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
