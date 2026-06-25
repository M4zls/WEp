import { Hono } from 'hono';
import { AuthService } from '../services/AuthService.js';
import { loginAuthSchema, registerSchema } from '../dtos/AuthDto.js';
import { formatZodErrors } from '../common/error-builder.js';

const auth = new Hono();
const service = new AuthService();

auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginAuthSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: formatZodErrors(parsed.error) }, 400);
    const { identifier, password } = parsed.data;
    const result = await service.login(identifier, password);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: formatZodErrors(parsed.error) }, 400);
    const result = await service.register(parsed.data);
    return c.json(result, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Token no proporcionado' }, 401);
    await service.logout(authHeader.slice(7));
    return c.json({ message: 'Sesión cerrada correctamente' });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

auth.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Token no proporcionado' }, 401);
    const payload = await service.verifyToken(authHeader.slice(7));
    return c.json({ valid: true, payload });
  } catch (err: any) {
    return c.json({ valid: false, error: err.message }, 401);
  }
});

export default auth;
