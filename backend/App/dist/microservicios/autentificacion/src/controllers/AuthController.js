import { Hono } from 'hono';
import { AuthService } from '../services/AuthService.js';
const auth = new Hono();
const service = new AuthService();
// POST /auth/login
// Body: { identifier: "rut o email", password: "..." }
auth.post('/login', async (c) => {
    try {
        const { identifier, password } = await c.req.json();
        if (!identifier || !password) {
            return c.json({ error: 'Identificador y contraseña son requeridos' }, 400);
        }
        const result = await service.login(identifier, password);
        return c.json(result, 200);
    }
    catch (err) {
        return c.json({ error: err.message }, 401);
    }
});
// POST /auth/register
// Body: { rut, dv, nombre, apellido, email, password, rol? }
auth.post('/register', async (c) => {
    try {
        const body = await c.req.json();
        const { rut, dv, nombre, apellido, email, password, rol } = body;
        if (!rut || !dv || !nombre || !apellido || !email || !password) {
            return c.json({ error: 'Todos los campos son requeridos' }, 400);
        }
        if (password.length < 6) {
            return c.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, 400);
        }
        const result = await service.register({ rut, dv, nombre, apellido, email, password, rol });
        return c.json(result, 201);
    }
    catch (err) {
        return c.json({ error: err.message }, 400);
    }
});
// POST /auth/logout
// Header: Authorization: Bearer <token>
auth.post('/logout', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return c.json({ error: 'Token no proporcionado' }, 401);
        }
        const token = authHeader.slice(7);
        await service.logout(token);
        return c.json({ message: 'Sesión cerrada correctamente' }, 200);
    }
    catch (err) {
        return c.json({ error: err.message }, 400);
    }
});
// GET /auth/verify
// Header: Authorization: Bearer <token>
// Usado por otros microservicios para validar el token
auth.get('/verify', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return c.json({ error: 'Token no proporcionado' }, 401);
        }
        const token = authHeader.slice(7);
        const payload = await service.verifyToken(token);
        return c.json({ valid: true, payload }, 200);
    }
    catch (err) {
        return c.json({ valid: false, error: err.message }, 401);
    }
});
export default auth;
//# sourceMappingURL=AuthController.js.map