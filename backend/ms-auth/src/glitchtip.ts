import * as Sentry from '@sentry/bun'
import type { Context, MiddlewareHandler } from 'hono'

export function initGlitchtip(): void {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.log('[glitchtip] SENTRY_DSN not set, skipping init')
    return
  }
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  })
  console.log('[glitchtip] initialized')
}

export function glitchtipErrorHandler(err: Error, c: Context): Response {
  const dsn = process.env.SENTRY_DSN
  if (dsn) {
    Sentry.captureException(err)
    Sentry.flush(2000)
  }
  console.error('[error]', err.message)
  return c.json({ error: 'Internal Server Error' }, 500)
}

export function glitchtipMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const dsn = process.env.SENTRY_DSN
    let requestId = c.req.header('X-Request-Id')
    if (!requestId) {
      requestId = crypto.randomUUID()
    }
    c.res.headers.set('X-Request-Id', requestId)

    if (dsn) {
      Sentry.setTag('request_id', requestId)
      Sentry.setTag('service', c.req.header('Host') || 'unknown')
      return Sentry.startSpan(
        { op: 'http.server', name: `${c.req.method} ${c.req.path}` },
        async () => { await next() }
      )
    }
    await next()
  }
}
