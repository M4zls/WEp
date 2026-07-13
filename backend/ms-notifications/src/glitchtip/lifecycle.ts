import * as Sentry from '@sentry/bun'

export function lifecycle(): void {
  process.on('beforeExit', () => {
    if (process.env.SENTRY_DSN) {
      Sentry.flush(2000)
    }
  })
}
