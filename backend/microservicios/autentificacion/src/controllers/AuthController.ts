import { Hono } from 'hono';
import { AuthService } from '../services/AuthService.js';
import { loginAuthSchema, registerSchema } from '../dtos/AuthDto.js';
import { ErrorBuilder } from '../common/ErrorBuilder.js';
import { HTTPStatusCode } from '../common/Consts.js';

const auth = new Hono();
const service = new AuthService();

// POST /auth/login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginAuthSchema.safeParse(body);
    const { success, data: { identifier, password } } = parsed;
    if (!success) {
      return c.json(ErrorBuilder.getEntityFromErrorParsed(parsed), HTTPStatusCode.BAD_REQUEST);
    }

    const result = await service.login(identifier, password);
    return c.json(result, HTTPStatusCode.SUCCESS);
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

// POST /auth/register
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(ErrorBuilder.getEntityFromErrorParsed(parsed), 400);
    }

    const result = await service.register(parsed.data);
    return c.json(result, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

// POST /auth/logout
auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token no proporcionado' }, 401);
    }
    const token = authHeader.slice(7);
    await service.logout(token);
    return c.json({ message: 'Sesión cerrada correctamente' }, 200);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

// GET /auth/verify
auth.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token no proporcionado' }, 401);
    }
    const token = authHeader.slice(7);
    const payload = await service.verifyToken(token);
    return c.json({ valid: true, payload }, 200);
  } catch (err: any) {
    return c.json({ valid: false, error: err.message }, 401);
  }
});

export default auth;
