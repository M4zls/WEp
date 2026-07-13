import * as Sentry from '@sentry/bun'
import type { Context } from 'hono'

export function glitchtipErrorHandler(err: Error, c: Context): Response {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err)
    Sentry.flush(2000)
  }
  console.error('[error]', err.message)
  return c.json({ error: 'Internal Server Error' }, 500)
}
