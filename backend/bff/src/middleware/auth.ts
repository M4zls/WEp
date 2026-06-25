import { verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'

const JWT_SECRET = process.env.JWT_SECRET ?? 'colegio_ohiggins_secret_changeme'

const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/students/login',
  '/health',
  '/docs',
]

export const authMiddleware = createMiddleware(async (c, next) => {
  if (PUBLIC_PATHS.some(p => c.req.path.startsWith(p))) {
    return next()
  }

  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return c.json({ error: 'Token no proporcionado' }, 401)
  }

  try {
    const payload = await verify(auth.slice(7), JWT_SECRET, { alg: 'HS256' })
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: 'Token inválido o expirado' }, 401)
  }
})
