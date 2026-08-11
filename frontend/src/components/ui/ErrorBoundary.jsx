import { Component } from 'react'

/**
 * Global error boundary — catches render/lifecycle errors anywhere below it
 * and shows a friendly fallback instead of a blank screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong' }
  }

  componentDidCatch(error, info) {
     
    console.error('ErrorBoundary caught an error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
          <p className="font-display text-6xl font-bold text-orange-400">Stumped</p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--text-primary)]">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
            {this.state.message} — a delivery we didn’t see coming. Try again or head back to the
            crease.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="btn-shine inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 px-6 py-3 text-sm font-medium text-white shadow-[var(--shadow-glow)] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-glass-strong)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)]"
            >
              Back home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
