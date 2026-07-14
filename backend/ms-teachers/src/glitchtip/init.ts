import * as Sentry from '@sentry/bun'

export function initGlitchtip(): void {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.log('[glitchtip] SENTRY_DSN not set, skipping init')
    return
  }
  const normalizedDsn = (() => {
    try {
      const url = new URL(dsn)
      url.username = url.username.replace(/-/g, '')
      return url.toString()
    } catch {
      return dsn
    }
  })()
  Sentry.init({
    dsn: normalizedDsn,
    environment: process.env.SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    release: 'wep@1.0.0',
  })
  console.log('[glitchtip] initialized')
}
