import * as Sentry from '@sentry/bun'

export function lifecycle(): void {
  if (process.env.SENTRY_DSN) {
    setInterval(() => { Sentry.flush(2000).catch(() => {}) }, 5000)
  }
  process.on('beforeExit', () => {
    if (process.env.SENTRY_DSN) {
      Sentry.flush(2000)
    }
  })
}
