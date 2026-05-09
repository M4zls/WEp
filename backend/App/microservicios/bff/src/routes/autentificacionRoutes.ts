import { Hono } from 'hono';
import { loginAuthBffSchema } from '../dtos/BffDto.js';

const app = new Hono();

const AUTH_SERVICE = process.env.AUTENTIFICACION_SERVICE || process.env.AUTH_SERVICE || 'http://localhost:3002';

app.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginAuthBffSchema.safeParse(body);
    if (!parsed.success) {
      const msgs = parsed.error.issues.map(i => i.message).join(', ');
      return c.json({ error: msgs }, 400);
    }
    const response = await fetch(`${AUTH_SERVICE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    console.error('Auth login error:', error);
    return c.json({ error: 'Error during login' }, 500);
  }
});

app.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const response = await fetch(`${AUTH_SERVICE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error during logout' }, 500);
  }
});

app.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${AUTH_SERVICE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error during registration' }, 500);
  }
});

app.get('/verify', async (c) => {
  try {
    const token = c.req.header('Authorization');
    const response = await fetch(`${AUTH_SERVICE}/auth/verify`, {
      headers: { Authorization: token || '' },
    });
    const data = await response.json();
    return c.json(data, response.status as any);
  } catch (error) {
    return c.json({ error: 'Error verifying token' }, 500);
  }
});

export default app;
