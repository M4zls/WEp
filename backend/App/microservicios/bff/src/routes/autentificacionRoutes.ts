import { Hono } from 'hono';

const app = new Hono();

const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://localhost:3003';

// POST login
app.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${AUTH_SERVICE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error during login' }, 500);
  }
});

// POST logout
app.post('/logout', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${AUTH_SERVICE}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error during logout' }, 500);
  }
});

// POST register
app.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const response = await fetch(`${AUTH_SERVICE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return c.json(data, 201);
  } catch (error) {
    return c.json({ error: 'Error during registration' }, 500);
  }
});

// GET verify token
app.get('/verify', async (c) => {
  try {
    const token = c.req.header('Authorization');
    const response = await fetch(`${AUTH_SERVICE}/verify`, {
      headers: { Authorization: token || '' },
    });
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Error verifying token' }, 500);
  }
});

export default app;
