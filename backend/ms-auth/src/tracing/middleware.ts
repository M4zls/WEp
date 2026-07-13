import type { MiddlewareHandler } from 'hono'
import { REQUEST_ID_HEADER } from './config.js'
import { requestIdStorage } from './context.js'

export function tracingMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    let requestId = c.req.header(REQUEST_ID_HEADER)
    if (!requestId) {
      requestId = crypto.randomUUID()
    }
    c.res.headers.set(REQUEST_ID_HEADER, requestId)
    requestIdStorage.enterWith(requestId)
    await next()
  }
}
