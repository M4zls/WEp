export function initGlitchtipLogger(serviceName: string): void {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.log('[glitchtip-logger] SENTRY_DSN not set, skipping log init')
    return
  }
  try {
    const url = new URL(dsn)
    const publicKey = url.username.replace(/-/g, '')
    const otlpEndpoint = `${url.origin}/v1/logs/`

    const sendLog = (severityNumber: number, severityText: string, message: string) => {
      if (message.startsWith('[glitchtip')) return
      fetch(otlpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sentry-Auth': `Sentry sentry_key=${publicKey}`,
        },
        body: JSON.stringify({
          resourceLogs: [{
            resource: { attributes: [{ key: 'service.name', value: { stringValue: serviceName } }] },
            scopeLogs: [{
              scope: { name: 'glitchtip-logger' },
              logRecords: [{
                timeUnixNano: String(Date.now() * 1_000_000),
                severityNumber,
                severityText,
                body: { stringValue: message },
              }],
            }],
          }],
        }),
      }).catch(() => {})
    }

    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error

    console.log = (...args: unknown[]) => {
      originalLog.apply(console, args)
      sendLog(9, 'INFO', args.map(String).join(' '))
    }
    console.warn = (...args: unknown[]) => {
      originalWarn.apply(console, args)
      sendLog(13, 'WARN', args.map(String).join(' '))
    }
    console.error = (...args: unknown[]) => {
      originalError.apply(console, args)
      sendLog(17, 'ERROR', args.map(String).join(' '))
    }

    console.log('[glitchtip-logger] initialized')
  } catch (err) {
    console.error('[glitchtip-logger] init failed:', err)
  }
}
