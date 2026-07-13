import * as Sentry from '@sentry/bun'
import type { MiddlewareHandler } from 'hono'
import { getRequestId } from '../tracing/context.js'

export function glitchtipMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    if (!process.env.SENTRY_DSN) {
      await next()
      return
    }
    const requestId = getRequestId()
    if (requestId) {
      Sentry.setTag('request_id', requestId)
    }
    return Sentry.startSpan(
      { op: 'http.server', name: `${c.req.method} ${c.req.path}` },
      async () => { await next() }
    )
  }
}
